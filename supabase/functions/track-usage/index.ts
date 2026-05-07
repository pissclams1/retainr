import { createClient } from 'npm:@supabase/supabase-js'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// 1 free local use + SERVER_LIMIT server-tracked = 3 total free
const SERVER_LIMIT = 2

const TIER_LIMITS: Record<string, number> = {
  starter: 50,
  pro:     200,
  agency:  500,
}

const NEXT_TIER: Record<string, string | null> = {
  starter: 'pro',
  pro:     'agency',
  agency:  null,
}

const SUPABASE_URL     = Deno.env.get('SUPABASE_URL')!
const SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const ANON_KEY         = Deno.env.get('SUPABASE_ANON_KEY')!

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  const json = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })

  try {
    const adminClient = createClient(SUPABASE_URL, SERVICE_ROLE_KEY)

    // ── Authenticated user path ────────────────────────────────────────────────
    const authHeader  = req.headers.get('Authorization') ?? ''
    const bearerToken = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : ''

    if (bearerToken && bearerToken !== ANON_KEY) {
      const userClient = createClient(SUPABASE_URL, ANON_KEY, {
        global: { headers: { Authorization: authHeader } },
      })
      const { data: { user }, error: userErr } = await userClient.auth.getUser()

      if (!userErr && user?.email) {
        const { data: agency, error: agErr } = await adminClient
          .from('agencies')
          .select('id, subscription_tier, subscription_status, reports_this_cycle, cycle_started_at')
          .eq('owner_email', user.email)
          .single()

        if (!agErr && agency) {
          const tier = agency.subscription_tier as string

          if (tier in TIER_LIMITS) {
            const limit = TIER_LIMITS[tier]

            // Check if billing cycle has rolled over (30-day window)
            const cycleStart = new Date(agency.cycle_started_at)
            const now        = new Date()
            const daysSince  = (now.getTime() - cycleStart.getTime()) / (1000 * 60 * 60 * 24)

            if (daysSince >= 30) {
              // New cycle — reset and allow
              await adminClient
                .from('agencies')
                .update({ reports_this_cycle: 1, cycle_started_at: now.toISOString() })
                .eq('id', agency.id)
              return json({ allowed: true, used: 1, limit, tier })
            }

            const currentCount = agency.reports_this_cycle

            if (currentCount >= limit) {
              return json({
                allowed:   false,
                reason:    'cap',
                tier,
                used:      currentCount,
                limit,
                next_tier: NEXT_TIER[tier],
              })
            }

            // Increment and allow
            await adminClient
              .from('agencies')
              .update({ reports_this_cycle: currentCount + 1 })
              .eq('id', agency.id)

            return json({ allowed: true, used: currentCount + 1, limit, tier })
          }
          // On trial tier — fall through to free trial check using their email
        }
      }
    }

    // ── Free trial path (anonymous or trial-tier users) ────────────────────────
    const body = await req.json().catch(() => ({}))
    const { email } = body as { email?: string }

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return json({ error: 'Valid email required' }, 400)
    }

    const normalizedEmail = email.trim().toLowerCase()

    // If this email belongs to a paid agency, allow through
    const { data: paidAgency } = await adminClient
      .from('agencies')
      .select('subscription_tier')
      .eq('owner_email', normalizedEmail)
      .single()

    if (paidAgency && paidAgency.subscription_tier in TIER_LIMITS) {
      return json({ allowed: true, tier: paidAgency.subscription_tier })
    }

    const { data: existing } = await adminClient
      .from('free_trials')
      .select('use_count')
      .eq('email', normalizedEmail)
      .single()

    if (existing && existing.use_count >= SERVER_LIMIT) {
      return json({ allowed: false, uses: existing.use_count, limit: SERVER_LIMIT })
    }

    const newCount = (existing?.use_count ?? 0) + 1

    await adminClient.from('free_trials').upsert(
      { email: normalizedEmail, use_count: newCount, last_used_at: new Date().toISOString() },
      { onConflict: 'email' },
    )

    return json({ allowed: true, uses: newCount, limit: SERVER_LIMIT })

  } catch (e) {
    return json({ error: e instanceof Error ? e.message : String(e) }, 500)
  }
})
