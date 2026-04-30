import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const ANTHROPIC_MODEL = 'claude-sonnet-4-6'

// When true, Meta reports always carry the "Powered by retainr" watermark
// regardless of subscription tier (Meta beta / coming-soon period).
// Flip to false when Meta is included in paid plans at launch.
const META_WATERMARK_ENABLED = Deno.env.get('META_WATERMARK_ENABLED') !== 'false'

const WATERMARK_HTML = `
<div style="text-align:center;padding:20px 16px;border-top:1px solid #E2E8F0;margin-top:32px">
  <span style="font-family:system-ui,-apple-system,sans-serif;font-size:11px;color:#94A3B8">
    Powered by <a href="https://retainr.io" style="color:#04256c;font-weight:600;text-decoration:none">retainr</a>
    &nbsp;·&nbsp;
    <a href="https://retainr.io/pricing" style="color:#94A3B8;text-decoration:underline;font-size:11px">Remove branding</a>
  </span>
</div>`

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const { report_id, client_id } = await req.json()
    if (!report_id || !client_id) return err('Missing report_id or client_id', 400)

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    )

    const [{ data: report }, { data: client }, { data: commitments }, { data: reportPrompt }, { data: briefingPrompt }] =
      await Promise.all([
        supabase.from('reports').select('*').eq('id', report_id).single(),
        supabase.from('clients').select('*, agencies(name, brand_color, voice_notes, subscription_tier)').eq('id', client_id).single(),
        supabase.from('commitments').select('text, due_date, status').eq('client_id', client_id).neq('status', 'done'),
        supabase.from('prompt_templates').select('system_prompt, user_template').eq('name', 'client_report').eq('is_active', true).single(),
        supabase.from('prompt_templates').select('system_prompt, user_template').eq('name', 'internal_briefing').eq('is_active', true).single(),
      ])

    const hasGads = !!report?.raw_gads_data
    const hasMeta = !!report?.raw_meta_data

    if (!hasGads && !hasMeta) return err('Report has no ad data', 400)
    if (!reportPrompt || !briefingPrompt) return err('Prompt templates not found — run seed migration', 400)

    const agency = client?.agencies

    // Build combined data payload — include whichever channels have data
    const dataPayload = JSON.stringify({
      channels: {
        ...(hasGads ? { google_ads: report.raw_gads_data } : {}),
        ...(hasMeta ? { meta_ads:   report.raw_meta_data } : {}),
      },
      commitments_open: commitments ?? [],
    }, null, 2)

    const agencyContext = agency
      ? `Agency: ${agency.name}. Brand color: ${agency.brand_color}.${agency.voice_notes ? ` Voice notes: ${agency.voice_notes}` : ''}`
      : ''

    const [clientReportHtml, internalBriefingJson] = await Promise.all([
      callAnthropic(
        reportPrompt.system_prompt,
        interpolate(reportPrompt.user_template, { data: dataPayload, agency_context: agencyContext }),
      ),
      callAnthropic(
        briefingPrompt.system_prompt,
        interpolate(briefingPrompt.user_template, { data: dataPayload }),
      ),
    ])

    // Inject watermark when: trial/starter tier, OR Meta data present during beta period
    const tier         = agency?.subscription_tier ?? 'trial'
    const isWhiteLabel = ['growth', 'pro', 'scale'].includes(tier)
    const needsWatermark = !isWhiteLabel || (hasMeta && META_WATERMARK_ENABLED)
    const finalHtml    = needsWatermark ? clientReportHtml + WATERMARK_HTML : clientReportHtml

    let briefingData: object
    try {
      const jsonMatch = internalBriefingJson.match(/```json\s*([\s\S]*?)\s*```/) ??
                        internalBriefingJson.match(/(\{[\s\S]*\})/)
      briefingData = JSON.parse(jsonMatch?.[1] ?? internalBriefingJson)
    } catch {
      console.error('Briefing JSON parse failed, storing raw:', internalBriefingJson.slice(0, 200))
      briefingData = { raw: internalBriefingJson, parse_error: true }
    }

    const { error: updateErr } = await supabase
      .from('reports')
      .update({
        client_report_html:     finalHtml,
        internal_briefing_json: briefingData,
        generated_at:           new Date().toISOString(),
      })
      .eq('id', report_id)

    if (updateErr) {
      console.error('Report update error:', updateErr)
      return err('Failed to save generated report', 500)
    }

    return new Response(JSON.stringify({ ok: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (e) {
    console.error('Unexpected error:', e)
    return err('Internal server error', 500)
  }
})

// ─── Anthropic API ───────────────────────────────────────────────────────────

async function callAnthropic(systemPrompt: string, userMessage: string): Promise<string> {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key':         Deno.env.get('ANTHROPIC_API_KEY')!,
      'anthropic-version': '2023-06-01',
      'anthropic-beta':    'prompt-caching-2024-07-31',
      'content-type':      'application/json',
    },
    body: JSON.stringify({
      model:      ANTHROPIC_MODEL,
      max_tokens: 2000,
      system: [{ type: 'text', text: systemPrompt, cache_control: { type: 'ephemeral' } }],
      messages: [{ role: 'user', content: userMessage }],
    }),
  })

  if (!res.ok) {
    const e = await res.json()
    throw new Error(`Anthropic API error: ${JSON.stringify(e)}`)
  }

  const data = await res.json()
  return data.content[0].text
}

function interpolate(template: string, vars: Record<string, string>): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => vars[key] ?? '')
}

function err(message: string, status: number) {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}
