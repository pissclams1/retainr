import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const ANTHROPIC_MODEL = 'claude-sonnet-4-6'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const { report_id, client_id } = await req.json()
    if (!report_id || !client_id) return err('Missing report_id or client_id', 400)

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    )

    // Fetch report + client + commitments in parallel
    const [{ data: report }, { data: client }, { data: commitments }, { data: reportPrompt }, { data: briefingPrompt }] =
      await Promise.all([
        supabase.from('reports').select('*').eq('id', report_id).single(),
        supabase.from('clients').select('*, agencies(name, brand_color, voice_notes)').eq('id', client_id).single(),
        supabase.from('commitments').select('text, due_date, status').eq('client_id', client_id).neq('status', 'done'),
        supabase.from('prompt_templates').select('system_prompt, user_template').eq('name', 'client_report').eq('is_active', true).single(),
        supabase.from('prompt_templates').select('system_prompt, user_template').eq('name', 'internal_briefing').eq('is_active', true).single(),
      ])

    if (!report?.raw_ga4_data) return err('Report has no GA4 data', 400)
    if (!reportPrompt || !briefingPrompt) return err('Prompt templates not found — run seed migration', 400)

    const ga4 = report.raw_ga4_data
    const agency = client?.agencies

    // Build data payload for prompts
    const dataPayload = JSON.stringify({
      ...ga4,
      commitments_open: commitments ?? [],
    }, null, 2)

    const agencyContext = agency
      ? `Agency: ${agency.name}. Brand color: ${agency.brand_color}.${agency.voice_notes ? ` Voice notes: ${agency.voice_notes}` : ''}`
      : ''

    // Run both AI chains in parallel with prompt caching on system prompts
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

    // Parse internal briefing — must be valid JSON
    let briefingData: object
    try {
      const jsonMatch = internalBriefingJson.match(/```json\s*([\s\S]*?)\s*```/) ??
                        internalBriefingJson.match(/(\{[\s\S]*\})/)
      briefingData = JSON.parse(jsonMatch?.[1] ?? internalBriefingJson)
    } catch {
      console.error('Briefing JSON parse failed, storing raw:', internalBriefingJson.slice(0, 200))
      briefingData = { raw: internalBriefingJson, parse_error: true }
    }

    // Update report with both outputs
    const { error: updateErr } = await supabase
      .from('reports')
      .update({
        client_report_html:     clientReportHtml,
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
      system: [
        {
          type: 'text',
          text: systemPrompt,
          cache_control: { type: 'ephemeral' }, // cache the system prompt across calls
        },
      ],
      messages: [
        { role: 'user', content: userMessage },
      ],
    }),
  })

  if (!res.ok) {
    const e = await res.json()
    throw new Error(`Anthropic API error: ${JSON.stringify(e)}`)
  }

  const data = await res.json()
  return data.content[0].text
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function interpolate(template: string, vars: Record<string, string>): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => vars[key] ?? '')
}

function err(message: string, status: number) {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}
