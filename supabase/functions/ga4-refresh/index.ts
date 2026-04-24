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

    // Fetch client + agency
    const { data: client, error: clientErr } = await supabase
      .from('clients')
      .select('*, agencies(name, brand_color, voice_notes)')
      .eq('id', client_id)
      .single()

    if (clientErr || !client) return err('Client not found', 404)
    if (!client.ga4_property_id || !client.ga4_refresh_token) {
      return err('GA4 not connected for this client', 400)
    }

    // Decrypt the stored refresh token
    const refreshToken = await decryptToken(
      client.ga4_refresh_token,
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

    // Build date ranges: current month MTD vs same days of prior month
    const { currentStart, currentEnd, priorStart, priorEnd, periodMonth } = getDateRanges()

    // Pull GA4 data: overall metrics + channel breakdown
    const propertyId = client.ga4_property_id.replace('properties/', '')

    const [overallData, channelData] = await Promise.all([
      runGA4Report(accessToken, propertyId, currentStart, currentEnd, priorStart, priorEnd, [
        'sessions', 'activeUsers', 'newUsers', 'screenPageViews',
        'engagementRate', 'averageSessionDuration',
      ], []),
      runGA4Report(accessToken, propertyId, currentStart, currentEnd, priorStart, priorEnd, [
        'sessions', 'activeUsers',
      ], ['sessionDefaultChannelGroup']),
    ])

    // Parse into structured format
    const current = parseOverall(overallData, 0)
    const prior   = parseOverall(overallData, 1)
    const currentChannels = parseChannels(channelData, 0)
    const priorChannels   = parseChannels(channelData, 1)

    const deltas = computeDeltas(current, prior, currentChannels, priorChannels)
    const healthScore = computeHealthScore(current, prior, deltas)

    const rawGA4Data = {
      period_month:     periodMonth,
      date_range:       { current: { start: currentStart, end: currentEnd }, prior: { start: priorStart, end: priorEnd } },
      current:          { ...current, channels: currentChannels },
      prior:            { ...prior,   channels: priorChannels },
      deltas,
      health_score:     healthScore,
      agency:           { name: client.agencies?.name, brand_color: client.agencies?.brand_color },
      client:           { name: client.name, industry: client.industry, location: client.location, retainer_amount: client.retainer_amount, start_date: client.start_date },
    }

    // Upsert report record
    const { data: report, error: reportErr } = await supabase
      .from('reports')
      .upsert({
        client_id:    client_id,
        period_month: periodMonth,
        raw_ga4_data: rawGA4Data,
        generated_at: new Date().toISOString(),
      }, { onConflict: 'client_id,period_month' })
      .select()
      .single()

    if (reportErr) {
      console.error('Report upsert error:', reportErr)
      return err('Failed to store GA4 data', 500)
    }

    // Update client health score + last_refreshed
    await supabase
      .from('clients')
      .update({ health_score: healthScore, last_refreshed: new Date().toISOString() })
      .eq('id', client_id)

    // Check alert thresholds
    await checkAlerts(supabase, client_id, deltas)

    // Trigger AI report generation (fire and forget)
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

// ─── GA4 API ───────────────────────────────────────────────────────────────

async function runGA4Report(
  accessToken: string,
  propertyId: string,
  currentStart: string,
  currentEnd: string,
  priorStart: string,
  priorEnd: string,
  metricNames: string[],
  dimensionNames: string[],
) {
  const body: Record<string, unknown> = {
    dateRanges: [
      { startDate: currentStart, endDate: currentEnd,   name: 'current' },
      { startDate: priorStart,   endDate: priorEnd,     name: 'prior'   },
    ],
    metrics:    metricNames.map((name) => ({ name })),
  }
  if (dimensionNames.length > 0) {
    body.dimensions = dimensionNames.map((name) => ({ name }))
    // Include date range name as a dimension to split results
    body.dimensions = [...body.dimensions as object[], { name: 'dateRange' }]
  }

  const res = await fetch(
    `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`,
    {
      method:  'POST',
      headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
      body:    JSON.stringify(body),
    },
  )

  if (!res.ok) {
    const e = await res.json()
    throw new Error(`GA4 API error: ${JSON.stringify(e)}`)
  }

  return res.json()
}

function parseOverall(data: any, rangeIndex: number): Record<string, number> {
  const row = data.rows?.[rangeIndex]
  if (!row) return { sessions: 0, activeUsers: 0, newUsers: 0, screenPageViews: 0, engagementRate: 0, averageSessionDuration: 0 }

  const headers: string[] = data.metricHeaders.map((h: any) => h.name)
  const result: Record<string, number> = {}
  headers.forEach((name, i) => {
    result[name] = parseFloat(row.metricValues[i].value) || 0
  })
  return result
}

function parseChannels(data: any, rangeIndex: number): Record<string, number> {
  const channels: Record<string, number> = {}
  if (!data.rows) return channels

  const rangeName = rangeIndex === 0 ? 'current' : 'prior'
  const dimHeaders: string[] = data.dimensionHeaders.map((h: any) => h.name)
  const dateRangeIdx = dimHeaders.indexOf('dateRange')
  const channelIdx   = dimHeaders.indexOf('sessionDefaultChannelGroup')
  const sessionIdx   = data.metricHeaders.findIndex((h: any) => h.name === 'sessions')

  for (const row of data.rows) {
    if (row.dimensionValues[dateRangeIdx]?.value !== rangeName) continue
    const channel  = row.dimensionValues[channelIdx]?.value ?? 'Other'
    const sessions = parseFloat(row.metricValues[sessionIdx]?.value) || 0
    channels[channel] = (channels[channel] ?? 0) + sessions
  }
  return channels
}

// ─── Delta & health calculations ────────────────────────────────────────────

function pct(current: number, prior: number): number {
  if (prior === 0) return current > 0 ? 100 : 0
  return Math.round(((current - prior) / prior) * 1000) / 10 // one decimal place
}

function computeDeltas(
  current: Record<string, number>,
  prior: Record<string, number>,
  currentChannels: Record<string, number>,
  priorChannels: Record<string, number>,
) {
  const allChannels = new Set([...Object.keys(currentChannels), ...Object.keys(priorChannels)])
  const channelDeltas: Record<string, number> = {}
  for (const ch of allChannels) {
    channelDeltas[ch] = pct(currentChannels[ch] ?? 0, priorChannels[ch] ?? 0)
  }

  return {
    sessions_pct:              pct(current.sessions,             prior.sessions),
    users_pct:                 pct(current.activeUsers,          prior.activeUsers),
    new_users_pct:             pct(current.newUsers,             prior.newUsers),
    page_views_pct:            pct(current.screenPageViews,      prior.screenPageViews),
    engagement_rate_delta:     Math.round((current.engagementRate - prior.engagementRate) * 1000) / 10,
    avg_session_duration_pct:  pct(current.averageSessionDuration, prior.averageSessionDuration),
    channel_deltas:            channelDeltas,
  }
}

function computeHealthScore(
  current: Record<string, number>,
  prior: Record<string, number>,
  deltas: ReturnType<typeof computeDeltas>,
): number {
  let score = 50

  // Sessions trend: ±20 points (±30% swing = ±20 pts, linear)
  const sessionComponent = Math.max(-20, Math.min(20, (deltas.sessions_pct / 30) * 20))
  score += sessionComponent

  // Engagement rate: 0–20 points (0.65+ = full 20, 0.30 = 0)
  const engComponent = Math.max(0, Math.min(20, ((current.engagementRate - 0.30) / 0.35) * 20))
  score += engComponent

  // New users trend: ±10 points
  const newUsersComponent = Math.max(-10, Math.min(10, (deltas.new_users_pct / 20) * 10))
  score += newUsersComponent

  return Math.round(Math.max(0, Math.min(100, score)))
}

// ─── Alert thresholds ────────────────────────────────────────────────────────

async function checkAlerts(supabase: any, client_id: string, deltas: ReturnType<typeof computeDeltas>) {
  const alertsToInsert: object[] = []

  if (deltas.sessions_pct <= -15) {
    alertsToInsert.push({
      client_id,
      type:          'traffic_drop',
      threshold_pct: Math.abs(deltas.sessions_pct),
    })
  }

  if (alertsToInsert.length > 0) {
    await supabase.from('alerts').insert(alertsToInsert)
  }
}

// ─── Date helpers ─────────────────────────────────────────────────────────────

function getDateRanges() {
  const now       = new Date()
  const year      = now.getFullYear()
  const month     = now.getMonth() // 0-indexed
  const yesterday = new Date(now)
  yesterday.setDate(yesterday.getDate() - 1)

  const currentStart  = `${year}-${pad(month + 1)}-01`
  const currentEnd    = yesterday.toISOString().split('T')[0]
  const periodMonth   = `${year}-${pad(month + 1)}`

  // Prior month, same number of days
  const priorYear   = month === 0 ? year - 1 : year
  const priorMonth  = month === 0 ? 12 : month // 1-indexed
  const priorStart  = `${priorYear}-${pad(priorMonth)}-01`
  // End on same day-of-month as yesterday (e.g. April 22 → March 22)
  const priorDayNum   = yesterday.getDate()
  const priorEndDate  = new Date(priorYear, priorMonth - 1, priorDayNum)
  const priorEnd      = priorEndDate.toISOString().split('T')[0]

  return { currentStart, currentEnd, priorStart, priorEnd, periodMonth }
}

function pad(n: number) { return String(n).padStart(2, '0') }

// ─── Crypto ──────────────────────────────────────────────────────────────────

async function decryptToken(hex: string, keyHex: string): Promise<string> {
  const combined  = hexToBytes(hex)
  const iv        = combined.slice(0, 12)
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

// ─── Error helper ────────────────────────────────────────────────────────────

function err(message: string, status: number) {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}
