import Anthropic from 'npm:@anthropic-ai/sdk'
import { createClient } from 'npm:@supabase/supabase-js'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

function err(msg: string, status = 400) {
  return new Response(JSON.stringify({ error: msg }), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}

// ── Form-based scoring (no PDF) ───────────────────────────────────────────────
interface FormData {
  electrical_panel: string
  plumbing_type: string
  hvac_age_years?: number | null
  roof_age_years?: number | null
  roof_condition: string
}

interface BindScore {
  score: number
  label: 'likely_bind' | 'conditional_risk' | 'likely_decline'
  reasons: string[]
  carrier_impact: string
}

function scoreFromForm(f: FormData): BindScore {
  let score = 100
  const reasons: string[] = []
  let hasCritical = false

  const panel = (f.electrical_panel || '').toLowerCase()
  if (panel === 'federal_pacific') {
    score -= 60; hasCritical = true
    reasons.push('Federal Pacific electrical panel — high underwriting rejection risk')
  } else if (panel === 'zinsco') {
    score -= 60; hasCritical = true
    reasons.push('Zinsco / Sylvania panel — most FL carriers will not bind')
  } else if (panel === 'fuse_box') {
    score -= 20
    reasons.push('Fuse box — older system, many carriers add surcharges or exclusions')
  } else if (panel === 'modern_cb') {
    score += 5
    reasons.push('Modern circuit breaker panel — favorable for underwriting')
  }

  if (hasCritical && score > 40) score = 40

  const plumbing = (f.plumbing_type || '').toLowerCase()
  if (plumbing === 'polybutylene') {
    score -= 30
    reasons.push('Polybutylene supply pipes — many FL carriers restrict or require replacement')
  } else if (['copper', 'pex', 'cpvc'].includes(plumbing)) {
    score += 5
    reasons.push('Modern plumbing supply material — favorable for underwriting')
  }

  const roofAge = Number(f.roof_age_years) || 0
  if (roofAge > 25) {
    score -= 25
    reasons.push(`Roof is ${roofAge} years old — exceeds 25-year threshold, most FL carriers require inspection or replacement`)
  } else if (roofAge > 15) {
    score -= 10
    reasons.push(`Roof is ${roofAge} years old — approaching carrier age thresholds`)
  } else if (roofAge > 0 && roofAge <= 10) {
    score += 10
    reasons.push(`Roof replaced within last 10 years (${roofAge} yrs) — positive underwriting factor`)
  }

  const condition = (f.roof_condition || '').toLowerCase()
  if (condition === 'poor') {
    score -= 35
    reasons.push('Roof in poor condition — likely requires replacement before placement')
  } else if (condition === 'fair') {
    score -= 10
    reasons.push('Roof in fair condition — some carriers may require inspection')
  }

  const hvacAge = Number(f.hvac_age_years) || 0
  if (hvacAge > 15) {
    score -= 10
    reasons.push(`HVAC system is ${hvacAge} years old — approaching end of typical serviceable life`)
  }

  score = Math.max(0, Math.min(100, score))

  let label: BindScore['label']
  let carrier_impact: string
  if (score >= 70) {
    label = 'likely_bind'
    carrier_impact = 'No significant underwriting barriers identified. Standard FL carriers should write this property with normal review.'
  } else if (score >= 40) {
    label = 'conditional_risk'
    carrier_impact = 'One or more issues may require documentation, higher premium, or exclusions. Placement is possible — confirm with the carrier before quoting.'
  } else {
    label = 'likely_decline'
    carrier_impact = 'Critical underwriting issues detected. Most standard FL carriers will require remediation before binding. Consider surplus lines or non-standard markets.'
  }

  return { score, label, reasons, carrier_impact }
}

// ── PDF-based scoring (reuse extract-inspection logic) ────────────────────────
const EXTRACTION_PROMPT = `You are an expert at reading Florida property inspection reports.

Extract fields and return ONLY valid JSON — no markdown, no surrounding text.

For wind_mitigation:
{"form_type":"wind_mitigation","property":{"address":null,"inspection_date":null,"inspector_name":null,"license_number":null},"wind_mitigation":{"roof_covering":{"selection":null,"description":null},"roof_deck_attachment":{"selection":null,"description":null},"roof_to_wall_connection":{"selection":null,"description":null},"roof_geometry":{"shape":null,"hip_percentage":null},"secondary_water_resistance":{"present":null,"type":null},"opening_protection":{"selection":null,"description":null}},"four_point":null,"flags":[],"insurability_summary":null}

For four_point:
{"form_type":"four_point","property":{"address":null,"inspection_date":null,"inspector_name":null,"license_number":null},"wind_mitigation":null,"four_point":{"roof":{"material":null,"age_years":null,"condition":null,"estimated_remaining_life_years":null,"notes":null},"hvac":{"age_years":null,"type":null,"brand":null,"condition":null,"notes":null},"plumbing":{"supply_material":null,"drain_material":null,"water_heater_age_years":null,"condition":null,"notes":null},"electrical":{"panel_brand":null,"panel_type":null,"service_amps":null,"wiring_type":null,"condition":null,"notes":null}},"flags":[],"insurability_summary":null}

FLAGS to detect (add to flags array):
FEDERAL_PACIFIC_PANEL (critical), ZINSCO_PANEL (critical), PUSHMATIC_PANEL (critical), ALUMINUM_WIRING (critical), KNOB_AND_TUBE (critical), POLYBUTYLENE_PLUMBING (warning), GALVANIZED_PLUMBING (warning), ROOF_OVER_25_YEARS (warning), POOR_CONDITION_ROOF (warning), POOR_CONDITION_HVAC (warning), POOR_CONDITION_ELECTRICAL (warning), OPEN_GABLE_ROOF (warning)`

function scoreFromExtraction(result: Record<string, unknown>): BindScore {
  let score = 100
  const reasons: string[] = []
  let hasCritical = false

  const flags = (result.flags as Array<{ code: string }>) || []
  const codes = new Set(flags.map(f => f.code))
  const wm = result.wind_mitigation as Record<string, unknown> | null
  const fp = result.four_point as Record<string, unknown> | null

  if (codes.has('FEDERAL_PACIFIC_PANEL')) { score -= 60; hasCritical = true; reasons.push('Federal Pacific electrical panel — high underwriting rejection risk') }
  if (codes.has('ZINSCO_PANEL'))          { score -= 60; hasCritical = true; reasons.push('Zinsco / Sylvania panel — most FL carriers will not bind') }
  if (codes.has('KNOB_AND_TUBE'))         { score -= 60; hasCritical = true; reasons.push('Knob-and-tube wiring — virtually uninsurable with standard FL carriers') }
  if (codes.has('ALUMINUM_WIRING'))       { score -= 50; hasCritical = true; reasons.push('Aluminum branch circuit wiring — requires remediation before most carriers will write') }
  if (codes.has('PUSHMATIC_PANEL'))       { score -= 40; hasCritical = true; reasons.push('Pushmatic / Bulldog panel — obsolete, most standard carriers will not write') }
  if (hasCritical && score > 40) score = 40

  if (codes.has('POLYBUTYLENE_PLUMBING')) { score -= 30; reasons.push('Polybutylene supply pipes — many FL carriers restrict or require replacement') }
  if (codes.has('GALVANIZED_PLUMBING'))   { score -= 15; reasons.push('Galvanized supply lines — corrosion risk, some carriers add exclusions') }
  if (codes.has('ROOF_OVER_25_YEARS'))    { score -= 25; reasons.push('Roof exceeds 25 years — most FL carriers require inspection or replacement before binding') }
  if (codes.has('POOR_CONDITION_ROOF'))   { score -= 35; reasons.push('Roof in poor condition — likely requires replacement before placement') }
  if (codes.has('OPEN_GABLE_ROOF'))       { score -= 20; reasons.push('Open gable roof geometry — lowest wind mitigation rating, affects premium significantly') }
  if (codes.has('POOR_CONDITION_HVAC'))   { score -= 15; reasons.push('HVAC in poor condition — may trigger carrier inspection or exclusion') }
  if (codes.has('POOR_CONDITION_ELECTRICAL')) { score -= 15; reasons.push('Electrical in poor condition — may require remediation before binding') }

  if (wm) {
    const swr = wm.secondary_water_resistance as Record<string, unknown>
    if (swr?.present === false) { score -= 15; reasons.push('No secondary water resistance — increases wind damage exposure') }
    const op = wm.opening_protection as Record<string, unknown>
    if (op?.selection === 'C' || op?.selection === 'D') { score += 10; reasons.push('Hurricane-rated or impact-resistant opening protection') }
    const rtw = wm.roof_to_wall_connection as Record<string, unknown>
    if (rtw?.selection === 'D' || rtw?.selection === 'E') { score += 5; reasons.push('Strong roof-to-wall connection — positive wind mitigation factor') }
  }

  if (fp) {
    const hvac = fp.hvac as Record<string, unknown>
    const roofFp = fp.roof as Record<string, unknown>
    const plumb = fp.plumbing as Record<string, unknown>
    const elec = fp.electrical as Record<string, unknown>
    const hvacAge = Number(hvac?.age_years) || 0
    if (hvacAge > 15) { score -= 10; reasons.push(`HVAC is ${hvacAge} years old — approaching end of serviceable life`) }
    const roofAge = Number(roofFp?.age_years) || 0
    if (roofAge > 0 && roofAge <= 10) { score += 10; reasons.push(`Roof replaced within last 10 years (${roofAge} yrs)`) }
    const supply = ((plumb?.supply_material as string) || '').toLowerCase()
    if (supply.includes('copper') || supply.includes('pex') || supply.includes('cpvc')) { score += 5; reasons.push('Modern plumbing supply material — favorable for underwriting') }
    const amps = String(elec?.service_amps || '')
    const brand = ((elec?.panel_brand as string) || '').toLowerCase()
    if (brand && !brand.includes('unknown') && (amps.includes('200') || parseInt(amps) >= 200)) { score += 5; reasons.push('Modern 200A electrical panel — favorable for underwriting') }
  }

  score = Math.max(0, Math.min(100, score))

  let label: BindScore['label']
  let carrier_impact: string
  if (score >= 70) { label = 'likely_bind'; carrier_impact = 'No significant underwriting barriers identified. Standard FL carriers should write this property with normal review.' }
  else if (score >= 40) { label = 'conditional_risk'; carrier_impact = 'One or more issues may require documentation, higher premium, or exclusions. Placement is possible — confirm with the carrier before quoting.' }
  else { label = 'likely_decline'; carrier_impact = 'Critical underwriting issues detected. Most standard FL carriers will require remediation before binding. Consider surplus lines or non-standard markets.' }

  return { score, label, reasons, carrier_impact }
}

// ── Main handler ──────────────────────────────────────────────────────────────
Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const body = await req.json().catch(() => null)
    if (!body?.slug) return err('slug is required')

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    )

    // Resolve slug → link id
    const { data: link, error: linkErr } = await supabase
      .from('intake_links')
      .select('id')
      .eq('slug', body.slug)
      .maybeSingle()

    if (linkErr) return err(linkErr.message, 500)
    if (!link) return err('Intake link not found', 404)

    let bindScore: BindScore
    let extractedData: Record<string, unknown> | null = null
    const hasPdf = !!body.pdf_text?.trim()

    if (hasPdf) {
      const apiKey = Deno.env.get('ANTHROPIC_API_KEY')
      if (!apiKey) return err('ANTHROPIC_API_KEY not set', 500)
      const client = new Anthropic({ apiKey })
      const message = await client.messages.create({
        model: 'claude-sonnet-4-6',
        max_tokens: 2048,
        temperature: 0,
        system: EXTRACTION_PROMPT,
        messages: [{ role: 'user', content: `Extract from this inspection report:\n\n---\n${body.pdf_text}\n---\n\nReturn only valid JSON.` }],
      })
      const raw = message.content[0].type === 'text' ? message.content[0].text.trim() : ''
      const cleaned = raw.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '').trim()
      try {
        extractedData = JSON.parse(cleaned)
        bindScore = scoreFromExtraction(extractedData!)
      } catch {
        // Fall back to form scoring if PDF extraction fails
        bindScore = scoreFromForm(body)
        extractedData = null
      }
    } else {
      bindScore = scoreFromForm(body)
    }

    const { data: submission, error: insertErr } = await supabase
      .from('intake_submissions')
      .insert({
        link_id: link.id,
        address: body.address?.trim() || null,
        year_built: body.year_built ? parseInt(body.year_built) : null,
        roof_age_years: body.roof_age_years ? parseInt(body.roof_age_years) : null,
        square_footage: body.square_footage ? parseInt(body.square_footage) : null,
        electrical_panel: body.electrical_panel || null,
        plumbing_type: body.plumbing_type || null,
        hvac_age_years: body.hvac_age_years ? parseInt(body.hvac_age_years) : null,
        roof_condition: body.roof_condition || null,
        has_pdf: hasPdf,
        extracted_data: extractedData,
        bind_score: bindScore.score,
        bind_label: bindScore.label,
        bind_reasons: bindScore.reasons,
        carrier_impact: bindScore.carrier_impact,
        score_source: hasPdf ? 'pdf' : 'form',
      })
      .select('id')
      .single()

    if (insertErr) return err(insertErr.message, 500)

    return new Response(JSON.stringify({ submission_id: submission.id, bind_score: bindScore, extracted_data: extractedData }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (e) {
    return err(e instanceof Error ? e.message : String(e), 500)
  }
})
