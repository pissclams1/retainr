import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-admin-secret',
}

function ok(body: unknown) {
  return new Response(JSON.stringify(body), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
}
function err(msg: string, status = 400) {
  return new Response(JSON.stringify({ error: msg }), { status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
}
function forbidden() { return err('Forbidden', 403) }

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  // Auth
  const secret = req.headers.get('x-admin-secret')
  const expected = Deno.env.get('ADMIN_SECRET')
  if (!expected || secret !== expected) return forbidden()

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  )

  const body = await req.json().catch(() => ({}))
  const { action, user_id } = body

  if (!user_id) return err('user_id required')

  // ── disable_user ──────────────────────────────────────────────────────────────
  if (action === 'disable_user') {
    const { error } = await supabase.auth.admin.updateUserById(user_id, { ban_duration: '876600h' }) // 100 years
    if (error) return err(error.message)
    return ok({ success: true, action: 'disabled', user_id })
  }

  // ── enable_user ───────────────────────────────────────────────────────────────
  if (action === 'enable_user') {
    const { error } = await supabase.auth.admin.updateUserById(user_id, { ban_duration: 'none' })
    if (error) return err(error.message)
    return ok({ success: true, action: 'enabled', user_id })
  }

  // ── delete_user ───────────────────────────────────────────────────────────────
  if (action === 'delete_user') {
    // Delete from auth — cascade will clean up app data via FK or RLS
    const { error } = await supabase.auth.admin.deleteUser(user_id)
    if (error) return err(error.message)

    // Also wipe the profiles/accounts row if it exists (belt + suspenders)
    await supabase.from('accounts').delete().eq('owner_id', user_id)

    return ok({ success: true, action: 'deleted', user_id })
  }

  // ── flag_support ──────────────────────────────────────────────────────────────
  if (action === 'flag_support') {
    const { email } = body
    // No-op for now — placeholder so the UI doesn't error
    console.log(`Support flag: ${user_id} <${email}>`)
    return ok({ success: true, action: 'flagged' })
  }

  return err(`Unknown action: ${action}`)
})
