import { createClient } from 'npm:@supabase/supabase-js'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// 1 free local use + SERVER_LIMIT server-tracked = 3 total free
const SERVER_LIMIT = 2

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const { email } = await req.json()

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return new Response(JSON.stringify({ error: 'Valid email required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    )

    const normalizedEmail = email.trim().toLowerCase()

    const { data: existing } = await supabase
      .from('free_trials')
      .select('use_count')
      .eq('email', normalizedEmail)
      .single()

    if (existing && existing.use_count >= SERVER_LIMIT) {
      return new Response(
        JSON.stringify({ allowed: false, uses: existing.use_count, limit: SERVER_LIMIT }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      )
    }

    const newCount = (existing?.use_count ?? 0) + 1

    await supabase.from('free_trials').upsert(
      { email: normalizedEmail, use_count: newCount, last_used_at: new Date().toISOString() },
      { onConflict: 'email' },
    )

    return new Response(
      JSON.stringify({ allowed: true, uses: newCount, limit: SERVER_LIMIT }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )
  } catch (e) {
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : String(e) }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )
  }
})
