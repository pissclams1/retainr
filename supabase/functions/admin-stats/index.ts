import { createClient } from 'npm:@supabase/supabase-js'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-admin-secret',
}

function forbidden() {
  return new Response(JSON.stringify({ error: 'Forbidden' }), {
    status: 403,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}

function err(msg: string, status = 500) {
  return new Response(JSON.stringify({ error: msg }), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}

const TIER_PRICE: Record<string, number> = {
  starter: 7900,
  growth:  14900,
  agency:  29900,
  trial:   0,
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  // Auth check — accept via header or query param
  const url = new URL(req.url)
  const secret = req.headers.get('x-admin-secret') || url.searchParams.get('key')
  const expected = Deno.env.get('ADMIN_SECRET')
  if (!expected || secret !== expected) return forbidden()

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    )

    // ── Agencies (users) ──────────────────────────────────────────────────────
    const { data: agencies, error: agErr } = await supabase
      .from('agencies')
      .select('*')
      .order('created_at', { ascending: false })

    if (agErr) throw agErr

    // ── Auth users ────────────────────────────────────────────────────────────
    const { data: { users: authUsers }, error: authErr } = await supabase.auth.admin.listUsers({
      perPage: 500,
    })
    if (authErr) throw authErr

    // Build auth map by email
    const authMap: Record<string, { id: string; created_at: string; last_sign_in_at: string | null }> = {}
    for (const u of authUsers) {
      if (u.email) authMap[u.email] = {
        id: u.id,
        created_at: u.created_at,
        last_sign_in_at: u.last_sign_in_at ?? null,
      }
    }

    // ── Intake links (per agent email) ────────────────────────────────────────
    const { data: links } = await supabase
      .from('intake_links')
      .select('id, agent_email, created_at')

    const linksByEmail: Record<string, number> = {}
    for (const l of (links ?? [])) {
      if (l.agent_email) linksByEmail[l.agent_email] = (linksByEmail[l.agent_email] ?? 0) + 1
    }

    // ── Intake submissions ────────────────────────────────────────────────────
    const { data: subs } = await supabase
      .from('intake_submissions')
      .select(`
        id, address, bind_score, bind_label, score_source, has_pdf,
        submitted_at, status,
        intake_links!inner(agent_name, agency_name, agent_email)
      `)
      .order('submitted_at', { ascending: false })
      .limit(200)

    const now = new Date()
    const cutoff24h = new Date(now.getTime() - 24 * 60 * 60 * 1000)

    const totalSubs = subs?.length ?? 0
    const subs24h = (subs ?? []).filter(s => new Date(s.submitted_at) > cutoff24h).length

    // Group submission counts by agent_email for user table
    const subsByEmail: Record<string, { count: number; last: string }> = {}
    for (const s of (subs ?? [])) {
      const email = (s.intake_links as any)?.agent_email
      if (email) {
        if (!subsByEmail[email]) subsByEmail[email] = { count: 0, last: s.submitted_at }
        subsByEmail[email].count++
        if (new Date(s.submitted_at) > new Date(subsByEmail[email].last)) {
          subsByEmail[email].last = s.submitted_at
        }
      }
    }

    // ── Clients ───────────────────────────────────────────────────────────────
    const { data: clients } = await supabase
      .from('clients')
      .select('agency_id')

    const clientsByAgency: Record<string, number> = {}
    for (const c of (clients ?? [])) {
      if (c.agency_id) clientsByAgency[c.agency_id] = (clientsByAgency[c.agency_id] ?? 0) + 1
    }

    // ── Enrich agencies ───────────────────────────────────────────────────────
    const enrichedAgencies = (agencies ?? []).map(ag => {
      const auth = authMap[ag.owner_email] ?? null
      const intake = subsByEmail[ag.owner_email] ?? { count: 0, last: null }
      return {
        ...ag,
        auth_user_id:    auth?.id ?? null,
        auth_created_at: auth?.created_at ?? ag.created_at,
        last_sign_in_at: auth?.last_sign_in_at ?? null,
        intake_link_count:       linksByEmail[ag.owner_email] ?? 0,
        intake_submission_count: intake.count,
        last_submission_at:      intake.last ?? null,
        client_count: clientsByAgency[ag.id] ?? 0,
      }
    })

    // ── Auth users not yet in agencies ────────────────────────────────────────
    const agencyEmails = new Set((agencies ?? []).map(a => a.owner_email))
    const orphanUsers = authUsers
      .filter(u => u.email && !agencyEmails.has(u.email))
      .map(u => ({
        id: null, name: null, owner_email: u.email,
        auth_user_id: u.id,
        auth_created_at: u.created_at,
        last_sign_in_at: u.last_sign_in_at ?? null,
        subscription_tier: 'none', subscription_status: 'none',
        stripe_customer_id: null, trial_ends_at: null,
        created_at: u.created_at, brand_color: null, voice_notes: null,
        intake_link_count: 0, intake_submission_count: 0,
        last_submission_at: null, client_count: 0,
      }))

    const allUsers = [...enrichedAgencies, ...orphanUsers]

    // ── MRR ───────────────────────────────────────────────────────────────────
    const mrr = (agencies ?? [])
      .filter(a => a.subscription_status === 'active')
      .reduce((sum, a) => sum + (TIER_PRICE[a.subscription_tier] ?? 0), 0)

    // ── Stats ─────────────────────────────────────────────────────────────────
    const stats = {
      total_users:           authUsers.length,
      total_agencies:        (agencies ?? []).length,
      active_subscriptions:  (agencies ?? []).filter(a => a.subscription_status === 'active').length,
      trialing:              (agencies ?? []).filter(a => a.subscription_status === 'trialing').length,
      total_submissions:     totalSubs,
      submissions_24h:       subs24h,
      mrr_cents:             mrr,
    }

    // ── Recent submissions (logs) ─────────────────────────────────────────────
    const recentSubs = (subs ?? []).slice(0, 100).map(s => ({
      id: s.id,
      address: s.address,
      bind_score: s.bind_score,
      bind_label: s.bind_label,
      score_source: s.score_source,
      has_pdf: s.has_pdf,
      submitted_at: s.submitted_at,
      status: s.status,
      agent_name:   (s.intake_links as any)?.agent_name,
      agency_name:  (s.intake_links as any)?.agency_name,
      agent_email:  (s.intake_links as any)?.agent_email,
    }))

    return new Response(JSON.stringify({ stats, users: allUsers, submissions: recentSubs }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (e) {
    return err(e instanceof Error ? e.message : String(e))
  }
})
