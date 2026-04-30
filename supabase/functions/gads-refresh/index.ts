import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const { client_id } = await req.json()
    if (!client_id) return err('Missing client_id', 400)

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    )

    const { data: client, error: clientErr } = await supabase
      .from('clients')
      .select('*, agencies(name, brand_color, voice_notes)')
      .eq('id', client_id)
      .single()

    if (clientErr || !client) return err('Client not found', 404)
    if (!client.gads_customer_id || !client.gads_refresh_token) {
      return err('Google Ads not connected for this client', 400)
    }

    // Decrypt the stored refresh token
    const refreshToken = await decryptToken(
      client.gads_refresh_token,
      Deno.env.get('ENCRYPTION_KEY')!,
    )

    // Exchange refresh token for a new access token
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        refresh_token: refreshToken,
        client_id:     Deno.env.get('GOOGLE_CLIENT_ID')!,
        client_secret: Deno.env.get('GOOGLE_CLIENT_SECRET')!,
        grant_type:    'refresh_token',
      }),
    })

    const tokenData = await tokenRes.json()
    if (tokenData.error) {
      console.error('Token refresh error:', tokenData)
      return err(`Failed to refresh Google token: ${tokenData.error_description ?? tokenData.error}`, 400)
    }

    const accessToken = tokenData.access_token
    const customerId  = client.gads_customer_id
    const developerToken = Deno.env.get('GOOGLE_ADS_DEVELOPER_TOKEN')!

    const { currentStart, currentEnd, priorStart, priorEnd, periodMonth } = getDateRanges()

    // Pull campaign-level metrics for both periods in parallel
    const [currentCampaigns, priorCampaigns] = await Promise.all([
      runGadsQuery(accessToken, customerId, developerToken, currentStart, currentEnd),
      runGadsQuery(accessToken, customerId, developerToken, priorStart, priorEnd),
    ])

    const current = aggregateMetrics(currentCampaigns)
    const prior   = aggregateMetrics(priorCampaigns)

    const deltas     = computeDeltas(current, prior)
    const healthScore = computeHealthScore(current, prior, deltas)

    const rawGadsData = {
      period_month: periodMonth,
      date_range:   { current: { start: currentStart, end: currentEnd }, prior: { start: priorStart, end: priorEnd } },
      current:      { ...current, campaigns: currentCampaigns },
      prior:        { ...prior,   campaigns: priorCampaigns },
      deltas,
      health_score: healthScore,
      agency:       { name: client.agencies?.name, brand_color: client.agencies?.brand_color },
      client:       { name: client.name, industry: client.industry, location: client.location, retainer_amount: client.retainer_amount, start_date: client.start_date },
    }

    // Upsert report record
    const { data: report, error: reportErr } = await supabase
      .from('reports')
      .upsert({
        client_id:    client_id,
        period_month: periodMonth,
        raw_gads_data: rawGadsData,
        generated_at: new Date().toISOString(),
      }, { onConflict: 'client_id,period_month' })
      .select()
      .single()

    if (reportErr) {
      console.error('Report upsert error:', reportErr)
      return err('Failed to store Google Ads data', 500)
    }

    await supabase
      .from('clients')
      .update({ health_score: healthScore, last_refreshed: new Date().toISOString() })
      .eq('id', client_id)

    await checkAlerts(supabase, client_id, deltas)

    supabase.functions.invoke('generate-report', {
      body: { report_id: report.id, client_id },
    }).catch((e) => console.error('generate-report invoke error:', e))

    return new Response(JSON.stringify({ ok: true, report_id: report.id, health_score: healthScore }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (e) {
    console.error('Unexpected error:', e)
    return err('Internal server error', 500)
  }
})

// ─── Google Ads API ──────────────────────────────────────────────────────────

interface CampaignRow {
  name:              string
  impressions:       number
  clicks:            number
  cost:              number  // in dollars (cost_micros / 1_000_000)
  conversions:       number
  conversions_value: number
}

async function runGadsQuery(
  accessToken: string,
  customerId: string,
  developerToken: string,
  startDate: string,
  endDate: string,
): Promise<CampaignRow[]> {
  const query = `
    SELECT
      campaign.name,
      metrics.impressions,
      metrics.clicks,
      metrics.cost_micros,
      metrics.conversions,
      metrics.conversions_value
    FROM campaign
    WHERE segments.date BETWEEN '${startDate}' AND '${endDate}'
      AND campaign.status != 'REMOVED'
    ORDER BY metrics.cost_micros DESC
    LIMIT 50
  `

  const res = await fetch(
    `https://googleads.googleapis.com/v17/customers/${customerId}/googleAds:search`,
    {
      method:  'POST',
      headers: {
        Authorization:    `Bearer ${accessToken}`,
        'developer-token': developerToken,
        'Content-Type':   'application/json',
      },
      body: JSON.stringify({ query }),
    },
  )

  if (!res.ok) {
    const e = await res.json()
    throw new Error(`Google Ads API error: ${JSON.stringify(e)}`)
  }

  const data = await res.json()

  return (data.results ?? []).map((row: any) => ({
    name:              row.campaign?.name ?? 'Unknown',
    impressions:       Number(row.metrics?.impressions ?? 0),
    clicks:            Number(row.metrics?.clicks ?? 0),
    cost:              (Number(row.metrics?.costMicros ?? 0)) / 1_000_000,
    conversions:       Number(row.metrics?.conversions ?? 0),
    conversions_value: Number(row.metrics?.conversionsValue ?? 0),
  }))
}

// ─── Aggregation ─────────────────────────────────────────────────────────────

interface PeriodTotals {
  impressions:       number
  clicks:            number
  cost:              number
  conversions:       number
  conversions_value: number
  ctr:               number
  cpc:               number
  conversion_rate:   number
  roas:              number
  cpa:               number
}

function aggregateMetrics(campaigns: CampaignRow[]): PeriodTotals {
  const impressions       = campaigns.reduce((s, c) => s + c.impressions, 0)
  const clicks            = campaigns.reduce((s, c) => s + c.clicks, 0)
  const cost              = campaigns.reduce((s, c) => s + c.cost, 0)
  const conversions       = campaigns.reduce((s, c) => s + c.conversions, 0)
  const conversions_value = campaigns.reduce((s, c) => s + c.conversions_value, 0)

  return {
    impressions,
    clicks,
    cost:              round2(cost),
    conversions:       round2(conversions),
    conversions_value: round2(conversions_value),
    ctr:               impressions > 0 ? round4(clicks / impressions) : 0,
    cpc:               clicks > 0      ? round2(cost / clicks)        : 0,
    conversion_rate:   clicks > 0      ? round4(conversions / clicks) : 0,
    roas:              cost > 0        ? round2(conversions_value / cost) : 0,
    cpa:               conversions > 0 ? round2(cost / conversions)   : 0,
  }
}

// ─── Deltas ───────────────────────────────────────────────────────────────────

function pct(current: number, prior: number): number {
  if (prior === 0) return current > 0 ? 100 : 0
  return Math.round(((current - prior) / prior) * 1000) / 10
}

function computeDeltas(current: PeriodTotals, prior: PeriodTotals) {
  return {
    impressions_pct:       pct(current.impressions,       prior.impressions),
    clicks_pct:            pct(current.clicks,            prior.clicks),
    cost_pct:              pct(current.cost,              prior.cost),
    conversions_pct:       pct(current.conversions,       prior.conversions),
    conversions_value_pct: pct(current.conversions_value, prior.conversions_value),
    ctr_delta:             round4(current.ctr            - prior.ctr),
    cpc_pct:               pct(current.cpc,              prior.cpc),
    conversion_rate_delta: round4(current.conversion_rate - prior.conversion_rate),
    roas_delta:            round2(current.roas            - prior.roas),
    roas_pct:              pct(current.roas,              prior.roas),
    cpa_pct:               pct(current.cpa,               prior.cpa),
  }
}

// ─── Health score ─────────────────────────────────────────────────────────────

function computeHealthScore(
  current: PeriodTotals,
  _prior: PeriodTotals,
  deltas: ReturnType<typeof computeDeltas>,
): number {
  let score = 50

  // ROAS trend: ±20 pts (±30% swing = ±20 pts)
  score += Math.max(-20, Math.min(20, (deltas.roas_pct / 30) * 20))

  // Conversion rate: absolute level bonus — 0.05+ CR = 15 pts, 0 = 0 pts
  score += Math.max(0, Math.min(15, (current.conversion_rate / 0.05) * 15))

  // CPA trend: lower is better, ±15 pts (inverted — negative pct is good)
  score += Math.max(-15, Math.min(15, (-deltas.cpa_pct / 20) * 15))

  return Math.round(Math.max(0, Math.min(100, score)))
}

// ─── Alerts ───────────────────────────────────────────────────────────────────

async function checkAlerts(supabase: any, client_id: string, deltas: ReturnType<typeof computeDeltas>) {
  const alertsToInsert: object[] = []

  if (deltas.conversions_pct <= -15) {
    alertsToInsert.push({ client_id, type: 'conversion_drop', threshold_pct: Math.abs(deltas.conversions_pct) })
  }

  if (deltas.roas_pct <= -15) {
    alertsToInsert.push({ client_id, type: 'roas_drop', threshold_pct: Math.abs(deltas.roas_pct) })
  }

  if (alertsToInsert.length > 0) {
    await supabase.from('alerts').insert(alertsToInsert)
  }
}

// ─── Date helpers ─────────────────────────────────────────────────────────────

function getDateRanges() {
  const now       = new Date()
  const year      = now.getFullYear()
  const month     = now.getMonth()
  const yesterday = new Date(now)
  yesterday.setDate(yesterday.getDate() - 1)

  const currentStart = `${year}-${pad(month + 1)}-01`
  const currentEnd   = yesterday.toISOString().split('T')[0]
  const periodMonth  = `${year}-${pad(month + 1)}`

  const priorYear  = month === 0 ? year - 1 : year
  const priorMonth = month === 0 ? 12 : month
  const priorStart = `${priorYear}-${pad(priorMonth)}-01`
  const priorEndDate = new Date(priorYear, priorMonth - 1, yesterday.getDate())
  const priorEnd     = priorEndDate.toISOString().split('T')[0]

  return { currentStart, currentEnd, priorStart, priorEnd, periodMonth }
}

function pad(n: number) { return String(n).padStart(2, '0') }

function round2(n: number) { return Math.round(n * 100) / 100 }
function round4(n: number) { return Math.round(n * 10000) / 10000 }

// ─── Crypto ───────────────────────────────────────────────────────────────────

async function decryptToken(hex: string, keyHex: string): Promise<string> {
  const combined   = hexToBytes(hex)
  const iv         = combined.slice(0, 12)
  const ciphertext = combined.slice(12)

  const keyBytes = hexToBytes(keyHex.padEnd(64, '0').slice(0, 64))
  const key = await crypto.subtle.importKey('raw', keyBytes, 'AES-GCM', false, ['decrypt'])
  const plaintext = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, ciphertext)
  return new TextDecoder().decode(plaintext)
}

function hexToBytes(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2)
  for (let i = 0; i < bytes.length; i++) bytes[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16)
  return bytes
}

function err(message: string, status: number) {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}
