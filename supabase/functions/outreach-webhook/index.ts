/**
 * outreach-webhook
 *
 * Receives Resend webhook events and updates outreach_contacts:
 *   email.opened     → opened_at (first open only)
 *   email.bounced    → bounced_at + unsubscribed = true
 *   email.complained → complained_at + unsubscribed = true
 *   email.sent / email.delivered → no-op (just logged)
 *
 * Webhook signing verified via Svix HMAC (whsec_...).
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const SUPABASE_URL     = Deno.env.get('SUPABASE_URL')!
const SUPABASE_KEY     = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const WEBHOOK_SECRET   = Deno.env.get('RESEND_WEBHOOK_SECRET') ?? ''

// ── Svix signature verification ───────────────────────────────────────────────
async function verifySignature(req: Request, body: string): Promise<boolean> {
  if (!WEBHOOK_SECRET) return true // dev fallback — skip verification

  const msgId        = req.headers.get('svix-id') ?? ''
  const msgTimestamp = req.headers.get('svix-timestamp') ?? ''
  const msgSig       = req.headers.get('svix-signature') ?? ''

  if (!msgId || !msgTimestamp || !msgSig) return false

  // Reject timestamps older than 5 minutes
  const ts = parseInt(msgTimestamp, 10)
  if (Math.abs(Date.now() / 1000 - ts) > 300) return false

  const toSign = `${msgId}.${msgTimestamp}.${body}`

  // Decode the base64 secret (strip "whsec_" prefix)
  const secretB64 = WEBHOOK_SECRET.replace(/^whsec_/, '')
  const secretBytes = Uint8Array.from(atob(secretB64), c => c.charCodeAt(0))

  const key = await crypto.subtle.importKey(
    'raw', secretBytes, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
  )
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(toSign))
  const computed = btoa(String.fromCharCode(...new Uint8Array(sig)))

  // msgSig may contain multiple space-separated "v1,<sig>" entries
  return msgSig.split(' ').some(s => {
    const [, b64] = s.split(',')
    return b64 === computed
  })
}

// ── Main handler ──────────────────────────────────────────────────────────────
Deno.serve(async (req: Request) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  const body = await req.text()

  const valid = await verifySignature(req, body)
  if (!valid) {
    return new Response('Unauthorized', { status: 401 })
  }

  let payload: Record<string, unknown>
  try {
    payload = JSON.parse(body)
  } catch {
    return new Response('Bad JSON', { status: 400 })
  }

  const type      = payload.type as string        // e.g. "email.opened"
  const data      = (payload.data ?? {}) as Record<string, unknown>
  const to        = (data.to as string[] | undefined)?.[0] ?? (data.to as string | undefined)
  const email     = Array.isArray(to) ? to[0] : to

  console.log(`[outreach-webhook] ${type} → ${email}`)

  if (!email) return new Response('OK', { status: 200 })

  const db = createClient(SUPABASE_URL, SUPABASE_KEY)
  const now = new Date().toISOString()

  if (type === 'email.opened') {
    // Only record first open
    await db
      .from('outreach_contacts')
      .update({ opened_at: now })
      .eq('email', email)
      .is('opened_at', null)

  } else if (type === 'email.bounced') {
    await db
      .from('outreach_contacts')
      .update({ bounced_at: now, unsubscribed: true })
      .eq('email', email)

  } else if (type === 'email.complained') {
    await db
      .from('outreach_contacts')
      .update({ complained_at: now, unsubscribed: true })
      .eq('email', email)
  }

  // Store raw event for audit / future use
  await db.from('outreach_events').insert({
    email,
    event_type: type,
    resend_id: data.email_id ?? data.id,
    payload,
    created_at: now,
  }).then(({ error }) => {
    if (error) console.warn('[outreach-webhook] event log error:', error.message)
  })

  return new Response('OK', { status: 200 })
})
