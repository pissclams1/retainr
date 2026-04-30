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

// Unambiguous chars (no 0/O, 1/l/I)
const SLUG_CHARS = 'abcdefghjkmnpqrstuvwxyz23456789'

function generateSlug(len = 8): string {
  let s = ''
  for (let i = 0; i < len; i++) s += SLUG_CHARS[Math.floor(Math.random() * SLUG_CHARS.length)]
  return s
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const body = await req.json().catch(() => ({}))
    const { agent_name, agency_name, agent_email } = body

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    )

    // Generate a unique slug (retry on collision)
    let slug = ''
    for (let attempt = 0; attempt < 5; attempt++) {
      const candidate = generateSlug()
      const { data } = await supabase
        .from('intake_links')
        .select('slug')
        .eq('slug', candidate)
        .maybeSingle()
      if (!data) { slug = candidate; break }
    }
    if (!slug) return err('Could not generate unique slug', 500)

    const { data, error } = await supabase
      .from('intake_links')
      .insert({ slug, agent_name: agent_name?.trim() || null, agency_name: agency_name?.trim() || null, agent_email: agent_email?.trim() || null })
      .select()
      .single()

    if (error) return err(error.message, 500)

    const origin = req.headers.get('origin') || 'https://retainr-tau.vercel.app'
    const url = `${origin}/intake/${slug}`

    return new Response(JSON.stringify({ slug, url, id: data.id }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (e) {
    return err(e instanceof Error ? e.message : String(e), 500)
  }
})
