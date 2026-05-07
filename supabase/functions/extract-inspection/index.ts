import Anthropic from 'npm:@anthropic-ai/sdk'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// ── State context injected into the system prompt ────────────────────────────

const STATE_CONTEXT: Record<string, string> = {
  FL: `STATE: Florida
FORMS IN USE: OIR-B1-1802 Wind Mitigation Form, Florida 4-Point Inspection
BUILDING CODE: FBC (Florida Building Code)
STATE PLAN: Citizens Property Insurance
ROOF COVERING OPTIONS (wind mit): A=FBC compliant with permit, B=FBC equivalent no permit, C=Non-FBC compliant, D=Other`,

  TX: `STATE: Texas
FORMS IN USE: TWIA WPI-8 Windstorm Inspection Certificate, Texas 4-Point Inspection
BUILDING CODE: TBC / IBC (Texas / International Building Code)
STATE PLAN: TWIA (Texas Windstorm Insurance Association) — coastal counties only
NOTE: WPI-8 uses the same 6-section structure as FL OIR-B1-1802. Extract sections identically.
ROOF COVERING OPTIONS (wind mit): A=Code compliant with permit, B=Code equivalent no permit, C=Non-code compliant, D=Other`,

  LA: `STATE: Louisiana
FORMS IN USE: Louisiana Citizens Wind & Hail Inspection, Louisiana 4-Point Inspection
BUILDING CODE: Louisiana State Uniform Construction Code
STATE PLAN: Louisiana Citizens Property Insurance Corporation`,

  SC: `STATE: South Carolina
FORMS IN USE: SCWHUA Wind & Hail Inspection Form, SC 4-Point Inspection
BUILDING CODE: South Carolina Building Code
STATE PLAN: SC Wind & Hail Underwriting Association (SCWHUA)`,

  AL: `STATE: Alabama
FORMS IN USE: AIUA Wind & Hail Inspection, Alabama 4-Point Inspection
BUILDING CODE: Alabama Building Code
STATE PLAN: Alabama Insurance Underwriting Association (AIUA) — Baldwin and Mobile counties`,

  MS: `STATE: Mississippi
FORMS IN USE: MWUA Windstorm Inspection, Mississippi 4-Point Inspection
BUILDING CODE: Mississippi State Building Code
STATE PLAN: Mississippi Windstorm Underwriting Association (MWUA) — Hancock, Harrison, Jackson counties`,

  NC: `STATE: North Carolina
FORMS IN USE: NCJUA/NCIUA Wind-Only Inspection, NC 4-Point Inspection
BUILDING CODE: North Carolina State Building Code
STATE PLAN: NC Joint Underwriting Association (NCJUA) / Beach Plan — 18 coastal counties`,
}

const STATE_CARRIER: Record<string, string> = {
  FL: 'FL', TX: 'TX', LA: 'LA', SC: 'SC', AL: 'AL', MS: 'MS', NC: 'NC',
}

function buildSystemPrompt(state: string): string {
  const ctx = STATE_CONTEXT[state] || STATE_CONTEXT['FL']
  const carrier = STATE_CARRIER[state] || 'FL'

  return `You are an expert at reading property inspection reports used for insurance underwriting.

${ctx}

Your job: extract field values precisely. Do not guess or infer values not clearly present in the document. If a value is not stated, use null.

FORM TYPE DETECTION:
- Wind Mitigation / Windstorm / Wind & Hail: standardised checklist with sections for roof covering, roof deck attachment, roof-to-wall connection, roof geometry, secondary water resistance (if present), and opening protection — each with lettered choices (A, B, C, etc.)
- 4-Point: covers four systems — Roof, HVAC/Air Conditioning, Plumbing, Electrical — with age, material, and condition for each
- If the document is neither, use "unknown"

WIND MITIGATION SECTION SELECTIONS:
Each section has lettered choices. Identify the selected/checked/marked option.
- Roof Covering: see state-specific options above; if not specified use A=Code compliant, B=Code equivalent, C=Non-compliant, D=Other
- Roof Deck Attachment: A=Staples or 6d nails, B=8d nails >6" o.c., C=8d nails ≤6" o.c., D=8d ring shank, E=Two layers, F=Other
- Roof-to-Wall Connection: A=Toe nails, B=Clips, C=Single wraps, D=Double wraps, E=Structural, F=N/A
- Roof Geometry: A=Hip (all sections), B=Flat, C=Other (gable, combination, etc.)
- Secondary Water Resistance (SWR): Yes or No (omit section if not present in this state's form)
- Opening Protection: A=None, B=Basic (shutters/panels — not rated), C=Hurricane/wind rated, D=Impact resistant glazing, X=Unknown

FLAGS (check every document — these determine insurability in any state):
- FEDERAL_PACIFIC_PANEL (critical): panel brand mentions "Federal Pacific", "FPE", "Stab-Lok", "Stab Lok"
- ZINSCO_PANEL (critical): panel brand mentions "Zinsco", "GTE Sylvania", "Sylvania"
- PUSHMATIC_PANEL (critical): panel brand mentions "Pushmatic", "Bulldog Pushmatic", "ITE"
- ALUMINUM_WIRING (critical): wiring described as aluminum for branch circuits (not just service entrance)
- KNOB_AND_TUBE (critical): wiring described as "knob and tube", "K&T", or "knob & tube"
- POLYBUTYLENE_PLUMBING (warning): supply pipes are polybutylene, "poly-b", "PB pipe", "Quest pipe"
- GALVANIZED_PLUMBING (warning): supply pipes are galvanized steel
- ROOF_OVER_25_YEARS (warning): roof age clearly exceeds 25 years
- POOR_CONDITION_ROOF (warning): roof condition explicitly stated as poor, deteriorated, failing, or in need of replacement
- POOR_CONDITION_HVAC (warning): HVAC condition explicitly poor or failing
- POOR_CONDITION_ELECTRICAL (warning): electrical condition explicitly poor or failing
- OPEN_GABLE_ROOF (warning): roof geometry is gable (not hip, not predominantly hip combination)

Flag messages: one sentence, practical — what it means for insurance placement in this state (${state}).

Return ONLY valid JSON. No markdown fences. No surrounding text. Exactly this structure:

For wind mitigation / windstorm / wind & hail:
{
  "form_type": "wind_mitigation",
  "property": {
    "address": "string or null",
    "inspection_date": "string or null",
    "inspector_name": "string or null",
    "license_number": "string or null"
  },
  "wind_mitigation": {
    "roof_covering": { "selection": "A", "description": "string or null" },
    "roof_deck_attachment": { "selection": "C", "description": "string or null" },
    "roof_to_wall_connection": { "selection": "D", "description": "string or null" },
    "roof_geometry": { "shape": "hip", "hip_percentage": 100 },
    "secondary_water_resistance": { "present": true, "type": "string or null" },
    "opening_protection": { "selection": "D", "description": "string or null" }
  },
  "four_point": null,
  "flags": [
    { "code": "FLAG_CODE", "severity": "critical", "message": "string" }
  ],
  "insurability_summary": "One or two sentences an agent can use to describe insurability to a client."
}

For four_point:
{
  "form_type": "four_point",
  "property": {
    "address": "string or null",
    "inspection_date": "string or null",
    "inspector_name": "string or null",
    "license_number": "string or null"
  },
  "wind_mitigation": null,
  "four_point": {
    "roof": {
      "material": "string or null",
      "age_years": null,
      "condition": "good",
      "estimated_remaining_life_years": null,
      "notes": "string or null"
    },
    "hvac": {
      "age_years": null,
      "type": "string or null",
      "brand": "string or null",
      "condition": "good",
      "notes": "string or null"
    },
    "plumbing": {
      "supply_material": "string or null",
      "drain_material": "string or null",
      "water_heater_age_years": null,
      "condition": "good",
      "notes": "string or null"
    },
    "electrical": {
      "panel_brand": "string or null",
      "panel_type": "circuit_breaker",
      "service_amps": "string or null",
      "wiring_type": "string or null",
      "condition": "good",
      "notes": "string or null"
    }
  },
  "flags": [],
  "insurability_summary": "string"
}`
}

const USER_TEMPLATE = (rawText: string) => `Extract all fields from the following inspection report:

---
${rawText}
---

Return only valid JSON following the exact structure in your instructions.`

// ── BindIQ Score Engine ────────────────────────────────���─────────────────────

interface BindScoreResult {
  score: number
  label: 'likely_bind' | 'conditional_risk' | 'likely_decline'
  reasons: string[]
  carrier_impact: string
}

function calculateBindScore(result: Record<string, unknown>, state: string): BindScoreResult {
  let score = 100
  const reasons: string[] = []
  let hasCritical = false

  const flags = (result.flags as Array<{ code: string; severity: string }>) || []
  const flagCodes = new Set(flags.map(f => f.code))
  const fourPoint = result.four_point as Record<string, unknown> | null
  const windMit   = result.wind_mitigation as Record<string, unknown> | null
  const st = state || 'FL'

  // ── Critical decline risks ──
  if (flagCodes.has('FEDERAL_PACIFIC_PANEL')) {
    score -= 60; hasCritical = true
    reasons.push('Federal Pacific electrical panel detected — high underwriting rejection risk')
  }
  if (flagCodes.has('ZINSCO_PANEL')) {
    score -= 60; hasCritical = true
    reasons.push(`Zinsco / Sylvania electrical panel detected — most ${st} carriers will not bind`)
  }
  if (flagCodes.has('KNOB_AND_TUBE')) {
    score -= 60; hasCritical = true
    reasons.push(`Knob-and-tube wiring — virtually uninsurable with standard ${st} carriers`)
  }
  if (flagCodes.has('ALUMINUM_WIRING')) {
    score -= 50; hasCritical = true
    reasons.push('Aluminum branch circuit wiring — requires remediation documentation before most carriers will write')
  }
  if (flagCodes.has('PUSHMATIC_PANEL')) {
    score -= 40; hasCritical = true
    reasons.push('Pushmatic / Bulldog panel — obsolete and unserviceable, most standard carriers will not write')
  }

  if (hasCritical && score > 40) score = 40

  // ── High risk issues ──
  if (flagCodes.has('POLYBUTYLENE_PLUMBING')) {
    score -= 30
    reasons.push(`Polybutylene supply pipes — many ${st} carriers restrict or require replacement`)
  }
  if (flagCodes.has('GALVANIZED_PLUMBING')) {
    score -= 15
    reasons.push('Galvanized supply lines — corrosion risk, some carriers add exclusions')
  }
  if (flagCodes.has('ROOF_OVER_25_YEARS')) {
    score -= 25
    reasons.push(`Roof exceeds 25 years — most ${st} carriers require inspection or replacement before binding`)
  }
  if (flagCodes.has('POOR_CONDITION_ROOF')) {
    score -= 35
    reasons.push('Roof in poor condition — likely requires replacement before placement')
  }
  if (flagCodes.has('OPEN_GABLE_ROOF')) {
    score -= 20
    reasons.push('Open gable roof geometry — lowest wind mitigation rating, significantly affects premium')
  }
  if (flagCodes.has('POOR_CONDITION_HVAC')) {
    score -= 15
    reasons.push('HVAC in poor condition — may trigger carrier inspection or exclusion')
  }
  if (flagCodes.has('POOR_CONDITION_ELECTRICAL')) {
    score -= 15
    reasons.push('Electrical system in poor condition — may require remediation before binding')
  }

  // ── Wind mitigation specifics ──
  if (windMit) {
    const swr = windMit.secondary_water_resistance as Record<string, unknown>
    if (swr?.present === false) {
      score -= 15
      reasons.push('No secondary water resistance — increases wind damage exposure rating')
    }
    const op = windMit.opening_protection as Record<string, unknown>
    if (op?.selection === 'C' || op?.selection === 'D') {
      score += 10
      reasons.push('Hurricane-rated or impact-resistant opening protection — reduces wind risk')
    }
    const rtw = windMit.roof_to_wall_connection as Record<string, unknown>
    if (rtw?.selection === 'D' || rtw?.selection === 'E') {
      score += 5
      reasons.push('Strong roof-to-wall connection — positive wind mitigation factor')
    }
  }

  // ── Four-point specifics ──
  if (fourPoint) {
    const hvac  = fourPoint.hvac      as Record<string, unknown>
    const roof  = fourPoint.roof      as Record<string, unknown>
    const plumb = fourPoint.plumbing  as Record<string, unknown>
    const elec  = fourPoint.electrical as Record<string, unknown>

    const hvacAge = hvac?.age_years as number
    if (hvacAge && hvacAge > 15) {
      score -= 10
      reasons.push(`HVAC system is ${hvacAge} years old — approaching end of typical serviceable life`)
    }
    const roofAge = roof?.age_years as number
    if (roofAge && roofAge <= 10) {
      score += 10
      reasons.push(`Roof replaced within last 10 years (${roofAge} yrs) — positive underwriting factor`)
    }
    const supply = ((plumb?.supply_material as string) || '').toLowerCase()
    if (supply && (supply.includes('copper') || supply.includes('pex') || supply.includes('cpvc'))) {
      score += 5
      reasons.push('Modern plumbing supply material — favorable for underwriting')
    }
    const amps      = String(elec?.service_amps || '')
    const brand     = ((elec?.panel_brand as string) || '').toLowerCase()
    const is200amp  = amps.includes('200') || parseInt(amps) >= 200
    const namedBrand = brand.length > 0 && !brand.includes('unknown') && !brand.includes('unlabeled')
    if (namedBrand && is200amp) {
      score += 5
      reasons.push('Modern 200A electrical panel — favorable for underwriting')
    }
  }

  score = Math.max(0, Math.min(100, score))

  let label: BindScoreResult['label']
  let carrier_impact: string

  if (score >= 70) {
    label = 'likely_bind'
    carrier_impact = `No significant underwriting barriers identified. Standard ${st} carriers should write this property with normal review.`
  } else if (score >= 40) {
    label = 'conditional_risk'
    carrier_impact = `One or more issues may require documentation, higher premium, or exclusions. Placement is possible — confirm with the carrier before quoting.`
  } else {
    label = 'likely_decline'
    carrier_impact = `Critical underwriting issues detected. Most standard ${st} carriers will require remediation before binding. Consider surplus lines or non-standard markets.`
  }

  return { score, label, reasons, carrier_impact }
}

// ─────────────────────────────────────────��───────────────────────────────────

function err(msg: string, status = 400) {
  return new Response(JSON.stringify({ error: msg }), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}

// ── IP rate limiter: 10 requests per IP per 10-minute window ─────────────
// In-memory — resets per function instance. Cheap, effective against casual abuse.
const ipWindows = new Map<string, { count: number; windowStart: number }>()
const RATE_LIMIT   = 10
const WINDOW_MS    = 10 * 60 * 1000 // 10 minutes

function isRateLimited(ip: string): boolean {
  const now  = Date.now()
  const entry = ipWindows.get(ip)
  if (!entry || now - entry.windowStart > WINDOW_MS) {
    ipWindows.set(ip, { count: 1, windowStart: now })
    return false
  }
  entry.count++
  return entry.count > RATE_LIMIT
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  // Rate limit by IP
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
  if (isRateLimited(ip)) {
    return err('Too many requests — please wait a few minutes before trying again.', 429)
  }

  try {
    const body = await req.json().catch(() => null)
    if (!body?.rawText?.trim()) return err('rawText is required')

    const { rawText, state } = body
    const stateCode = (typeof state === 'string' && STATE_CONTEXT[state.toUpperCase()])
      ? state.toUpperCase()
      : 'FL'

    const apiKey = Deno.env.get('ANTHROPIC_API_KEY')
    if (!apiKey) return err('ANTHROPIC_API_KEY secret not set', 500)

    if (rawText.length < 50) return err('Text too short — paste more of the inspection report')
    if (rawText.length > 60000) return err('Text too long — try a shorter excerpt')

    const client = new Anthropic({ apiKey })

    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 2048,
      temperature: 0,
      system: buildSystemPrompt(stateCode),
      messages: [{ role: 'user', content: USER_TEMPLATE(rawText) }],
    })

    const raw     = message.content[0].type === 'text' ? message.content[0].text.trim() : ''
    const cleaned = raw.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '').trim()

    let result: Record<string, unknown>
    try {
      result = JSON.parse(cleaned)
    } catch {
      console.error('JSON parse failed:', cleaned.slice(0, 400))
      return err('Extraction failed — model returned malformed output. Try again.', 500)
    }

    if (!result.form_type) {
      return err('Could not detect form type. Paste a wind mitigation or 4-point inspection report.', 400)
    }

    result.bind_score = calculateBindScore(result, stateCode)
    result.state = stateCode

    return new Response(JSON.stringify({ result }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    console.error('extract-inspection error:', msg)
    return err(`Internal error: ${msg}`, 500)
  }
})
