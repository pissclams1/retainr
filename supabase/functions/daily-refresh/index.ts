import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

Deno.serve(async (req) => {
  // Called only by pg_cron — verify shared secret
  const auth = req.headers.get('authorization') ?? ''
  if (auth !== `Bearer ${Deno.env.get('CRON_SECRET')}`) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  )

  // Fetch all clients with GA4 connected
  const { data: clients, error } = await supabase
    .from('clients')
    .select('id, name')
    .not('ga4_property_id', 'is', null)
    .not('ga4_refresh_token', 'is', null)

  if (error) {
    console.error('Failed to fetch clients:', error)
    return new Response(JSON.stringify({ error: 'Failed to fetch clients' }), { status: 500 })
  }

  if (!clients?.length) {
    console.log('No GA4-connected clients to refresh')
    return new Response(JSON.stringify({ ok: true, refreshed: 0 }), { status: 200 })
  }

  console.log(`Refreshing ${clients.length} clients`)

  // Invoke ga4-refresh for each client — stagger slightly to avoid GA4 rate limits
  const results = await Promise.allSettled(
    clients.map((client, i) =>
      new Promise((resolve) => setTimeout(resolve, i * 500)).then(() =>
        supabase.functions.invoke('ga4-refresh', {
          body: { client_id: client.id },
        }).then(({ data, error }) => {
          if (error) throw new Error(`${client.name}: ${error.message}`)
          if (data?.error) throw new Error(`${client.name}: ${data.error}`)
          console.log(`✓ ${client.name} — health score ${data.health_score}`)
          return data
        })
      )
    )
  )

  const succeeded = results.filter((r) => r.status === 'fulfilled').length
  const failed    = results.filter((r) => r.status === 'rejected')

  if (failed.length) {
    failed.forEach((r) => console.error('Refresh failed:', (r as PromiseRejectedResult).reason))
  }

  return new Response(
    JSON.stringify({ ok: true, refreshed: succeeded, failed: failed.length, total: clients.length }),
    { status: 200, headers: { 'Content-Type': 'application/json' } },
  )
})
