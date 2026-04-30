import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const GRAPH   = 'https://graph.facebook.com/v19.0'
const CONV_ACTIONS = [
  'offsite_conversion.fb_pixel_purchase',
  'purchase',
  'offsite_conversion.fb_pixel_lead',
  'lead',
  'offsite_conversion.fb_pixel_complete_registration',
]

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
    if (!client.meta_ad_account_id || !client.meta_access_token) {
      return err('Meta Ads not connected for this client', 400)
    }

    // Decrypt stored token
    const storedToken = await decryptToken(client.meta_access_token, Deno.env.get('ENCRYPTION_KEY')!)

    // Extend the long-lived token (resets the ~60-day expiry)
    const refreshedToken = await extendToken(storedToken)

    // Persist the refreshed token
    const encryptedNew = await encryptToken(refreshedToken, Deno.env.get('ENCRYPTION_KEY')!)
    await supabase
      .from('clients')
      .update({ meta_access_token: encryptedNew })
      .eq('id', client_id)

    const { currentStart, currentEnd, priorStart, priorEnd, periodMonth } = getDateRanges()
    const accountId = client.meta_ad_account_id

    // Pull account totals + campaign breakdown for both periods in parallel
    const [currentTotals, priorTotals, currentCampaigns, priorCampaigns] = await Promise.all([
      fetchInsights(refreshedToken, accountId, currentStart, currentEnd, 'account'),
      fetchInsights(refreshedToken, accountId, priorStart,   priorEnd,   'account'),
      fetchInsights(refreshedToken, accountId, currentStart, currentEnd, 'campaign'),
      fetchInsights(refreshedToken, accountId, priorStart,   priorEnd,   'campaign'),
    ])

    const current  = parseAccountTotals(currentTotals)
    const prior    = parseAccountTotals(priorTotals)
    const deltas   = computeDeltas(current, prior)
    const healthScore = computeHealthScore(current, prior, deltas)

    const rawMetaData = {
      period_month: periodMonth,
      date_range:   { current: { start: currentStart, end: currentEnd }, prior: { start: priorStart, end: priorEnd } },
      current:      { ...current, campaigns: parseCampaigns(currentCampaigns) },
      prior:        { ...prior,   campaigns: parseCampaigns(priorCampaigns) },
      deltas,
      health_score: healthScore,
      agency:       { name: client.agencies?.name, brand_color: client.agencies?.brand_color },
      client:       { name: client.name, industry: client.industry, location: client.location, retainer_amount: client.retainer_amount, start_date: client.start_date },
    }

    // Upsert into the same report row as Google Ads data
    const { data: report, error: reportErr } = await supabase
      .from('reports')
      .upsert({
        client_id:     client_id,
        period_month:  periodMonth,
        raw_meta_data: rawMetaData,
        generated_at:  new Date().toISOString(),
      }, { onConflict: 'client_id,period_month' })
      .select()
      .single()

    if (reportErr) {
      console.error('Report upsert error:', reportErr)
      return err('Failed to store Meta data', 500)
    }

    // Meta health score only updates the client if it's higher than current
    // (Google Ads health score takes precedence when both are connected)
    const currentScore = client.health_score ?? 0
    if (healthScore > currentScore || !client.gads_customer_id) {
      await supabase
        .from('clients')
        .update({ health_score: healthScore, last_refreshed: new Date().toISOString() })
        .eq('id', client_id)
    }

    // Trigger report generation (will use both gads + meta data now present in DB)
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

// ─── Meta Graph API ───────────────────────────────────────────────────────────

async function extendToken(token: string): Promise<string> {
  const res = await fetch(
    `${GRAPH}/oauth/access_token?` + new URLSearchParams({
      grant_type:        'fb_exchange_token',
      client_id:         Deno.env.get('META_APP_ID')!,
      client_secret:     Deno.env.get('META_APP_SECRET')!,
      fb_exchange_token: token,
    }),
  )
  const data = await res.json()
  if (data.error) {
    console.warn('Token extension failed, using existing token:', data.error)
    return token  // fall back to stored token — it may still have time left
  }
  return data.access_token
}

async function fetchInsights(
  accessToken: string,
  accountId: string,
  since: string,
  until: string,
  level: 'account' | 'campaign',
): Promise<any> {
  const fields = level === 'account'
    ? 'impressions,clicks,spend,reach,frequency,ctr,cpc,cpm,actions,action_values'
    : 'campaign_name,impressions,clicks,spend,actions,action_values'

  const params = new URLSearchParams({
    fields,
    time_range:                JSON.stringify({ since, until }),
    action_attribution_windows: JSON.stringify(['7d_click', '1d_view']),
    level,
    limit: '50',
    access_token: accessToken,
  })

  const res = await fetch(`${GRAPH}/${accountId}/insights?${params}`)

  if (!res.ok) {
    const e = await res.json()
    throw new Error(`Meta Insights API error: ${JSON.stringify(e)}`)
  }

  return res.json()
}

// ─── Parsing ─────────────────────────────────────────────────────────────────

interface MetaTotals {
  impressions:       number
  clicks:            number
  spend:             number
  reach:             number
  frequency:         number
  ctr:               number
  cpc:               number
  cpm:               number
  conversions:       number
  conversion_value:  number
  roas:              number
  cpa:               number
}

function findAction(actions: any[], types: string[]): number {
  if (!actions) return 0
  for (const t of types) {
    const match = actions.find((a: any) => a.action_type === t)
    if (match) return parseFloat(match.value) || 0
  }
  return 0
}

function parseAccountTotals(data: any): MetaTotals {
  const row = data.data?.[0] ?? {}

  const impressions      = parseFloat(row.impressions ?? 0)
  const clicks           = parseFloat(row.clicks ?? 0)
  const spend            = parseFloat(row.spend ?? 0)
  const reach            = parseFloat(row.reach ?? 0)
  const frequency        = parseFloat(row.frequency ?? 0)
  const ctr              = parseFloat(row.ctr ?? 0)
  const cpc              = parseFloat(row.cpc ?? 0)
  const cpm              = parseFloat(row.cpm ?? 0)
  const conversions      = findAction(row.actions,      CONV_ACTIONS)
  const conversion_value = findAction(row.action_values, CONV_ACTIONS)

  return {
    impressions, clicks, spend: r2(spend), reach, frequency: r2(frequency),
    ctr: r4(ctr / 100), cpc: r2(cpc), cpm: r2(cpm),
    conversions: r2(conversions),
    conversion_value: r2(conversion_value),
    roas: spend > 0 ? r2(conversion_value / spend) : 0,
    cpa:  conversions > 0 ? r2(spend / conversions) : 0,
  }
}

function parseCampaigns(data: any): object[] {
  return (data.data ?? []).map((row: any) => ({
    name:             row.campaign_name ?? 'Unknown',
    impressions:      parseFloat(row.impressions ?? 0),
    clicks:           parseFloat(row.clicks ?? 0),
    spend:            r2(parseFloat(row.spend ?? 0)),
    conversions:      r2(findAction(row.actions, CONV_ACTIONS)),
    conversion_value: r2(findAction(row.action_values, CONV_ACTIONS)),
  }))
}

// ─── Deltas ───────────────────────────────────────────────────────────────────

function pct(current: number, prior: number): number {
  if (prior === 0) return current > 0 ? 100 : 0
  return Math.round(((current - prior) / prior) * 1000) / 10
}

function computeDeltas(current: MetaTotals, prior: MetaTotals) {
  return {
    impressions_pct:      pct(current.impressions,      prior.impressions),
    clicks_pct:           pct(current.clicks,           prior.clicks),
    spend_pct:            pct(current.spend,            prior.spend),
    conversions_pct:      pct(current.conversions,      prior.conversions),
    conversion_value_pct: pct(current.conversion_value, prior.conversion_value),
    roas_delta:           r2(current.roas - prior.roas),
    roas_pct:             pct(current.roas,             prior.roas),
    cpa_pct:              pct(current.cpa,              prior.cpa),
    ctr_delta:            r4(current.ctr - prior.ctr),
    cpm_pct:              pct(current.cpm,              prior.cpm),
    reach_pct:            pct(current.reach,            prior.reach),
  }
}

function computeHealthScore(
  current: MetaTotals,
  _prior: MetaTotals,
  deltas: ReturnType<typeof computeDeltas>,
): number {
  let score = 50
  score += Math.max(-20, Math.min(20, (deltas.roas_pct / 30) * 20))
  score += Math.max(-15, Math.min(15, (-deltas.cpa_pct / 20) * 15))
  score += Math.max(-15, Math.min(15, (deltas.conversions_pct / 20) * 15))
  return Math.round(Math.max(0, Math.min(100, score)))
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

  const priorYear    = month === 0 ? year - 1 : year
  const priorMonth   = month === 0 ? 12 : month
  const priorStart   = `${priorYear}-${pad(priorMonth)}-01`
  const priorEndDate = new Date(priorYear, priorMonth - 1, yesterday.getDate())
  const priorEnd     = priorEndDate.toISOString().split('T')[0]

  return { currentStart, currentEnd, priorStart, priorEnd, periodMonth }
}

function pad(n: number) { return String(n).padStart(2, '0') }
function r2(n: number)  { return Math.round(n * 100) / 100 }
function r4(n: number)  { return Math.round(n * 10000) / 10000 }

// ─── Crypto ───────────────────────────────────────────────────────────────────

async function encryptToken(plaintext: string, keyHex: string): Promise<string> {
  const keyBytes = hexToBytes(keyHex.padEnd(64, '0').slice(0, 64))
  const key = await crypto.subtle.importKey('raw', keyBytes, 'AES-GCM', false, ['encrypt'])
  const iv  = crypto.getRandomValues(new Uint8Array(12))
  const enc = new TextEncoder().encode(plaintext)
  const ct  = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, enc)
  const combined = new Uint8Array(12 + ct.byteLength)
  combined.set(iv, 0)
  combined.set(new Uint8Array(ct), 12)
  return bytesToHex(combined)
}

async function decryptToken(hex: string, keyHex: string): Promise<string> {
  const combined   = hexToBytes(hex)
  const iv         = combined.slice(0, 12)
  const ciphertext = combined.slice(12)
  const keyBytes   = hexToBytes(keyHex.padEnd(64, '0').slice(0, 64))
  const key = await crypto.subtle.importKey('raw', keyBytes, 'AES-GCM', false, ['decrypt'])
  const plaintext = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, ciphertext)
  return new TextDecoder().decode(plaintext)
}

function hexToBytes(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2)
  for (let i = 0; i < bytes.length; i++) bytes[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16)
  return bytes
}

function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes).map((b) => b.toString(16).padStart(2, '0')).join('')
}

function err(message: string, status: number) {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}
