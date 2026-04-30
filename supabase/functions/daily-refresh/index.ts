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

  // Fetch all clients that have at least one channel connected
  const { data: clients, error } = await supabase
    .from('clients')
    .select('id, name, gads_customer_id, gads_refresh_token, meta_ad_account_id, meta_access_token')
    .or('gads_customer_id.not.is.null,meta_ad_account_id.not.is.null')

  if (error) {
    console.error('Failed to fetch clients:', error)
    return new Response(JSON.stringify({ error: 'Failed to fetch clients' }), { status: 500 })
  }

  if (!clients?.length) {
    console.log('No connected clients to refresh')
    return new Response(JSON.stringify({ ok: true, refreshed: 0 }), { status: 200 })
  }

  console.log(`Refreshing ${clients.length} clients`)

  // For each client: run gads-refresh and/or meta-refresh in parallel per client,
  // staggered across clients to avoid rate limits.
  const results = await Promise.allSettled(
    clients.map((client, i) =>
      new Promise((resolve) => setTimeout(resolve, i * 600)).then(async () => {
        const channelJobs: Promise<any>[] = []

        if (client.gads_customer_id && client.gads_refresh_token) {
          channelJobs.push(
            supabase.functions.invoke('gads-refresh', { body: { client_id: client.id } })
              .then(({ data, error }) => {
                if (error) throw new Error(`${client.name} [gads]: ${error.message}`)
                if (data?.error) throw new Error(`${client.name} [gads]: ${data.error}`)
                console.log(`✓ ${client.name} [gads] — health score ${data.health_score}`)
              })
          )
        }

        if (client.meta_ad_account_id && client.meta_access_token) {
          channelJobs.push(
            supabase.functions.invoke('meta-refresh', { body: { client_id: client.id } })
              .then(({ data, error }) => {
                if (error) throw new Error(`${client.name} [meta]: ${error.message}`)
                if (data?.error) throw new Error(`${client.name} [meta]: ${data.error}`)
                console.log(`✓ ${client.name} [meta] — health score ${data.health_score}`)
              })
          )
        }

        return Promise.all(channelJobs)
      })
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
