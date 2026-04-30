import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const GRAPH = 'https://graph.facebook.com/v19.0'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const { code, client_id, ad_account_id, redirect_uri } = await req.json()

    if (!code || !client_id || !ad_account_id || !redirect_uri) {
      return error('Missing required parameters', 400)
    }

    // Normalise: strip non-digits, accept "act_123" or bare "123"
    const rawId = String(ad_account_id).replace(/^act_/, '').replace(/\D/g, '')
    if (!rawId) return error('Ad account ID must be numeric', 400)
    const normalizedAccountId = `act_${rawId}`

    // Exchange code for short-lived user access token
    const tokenRes = await fetch(`${GRAPH}/oauth/access_token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id:     Deno.env.get('META_APP_ID')!,
        client_secret: Deno.env.get('META_APP_SECRET')!,
        redirect_uri,
        code,
      }),
    })

    const tokenData = await tokenRes.json()
    if (tokenData.error) {
      console.error('Meta token exchange error:', tokenData)
      return error(`Meta token exchange failed: ${tokenData.error.message ?? tokenData.error}`, 400)
    }

    // Exchange short-lived token for long-lived token (~60 days)
    const longRes = await fetch(
      `${GRAPH}/oauth/access_token?` + new URLSearchParams({
        grant_type:        'fb_exchange_token',
        client_id:         Deno.env.get('META_APP_ID')!,
        client_secret:     Deno.env.get('META_APP_SECRET')!,
        fb_exchange_token: tokenData.access_token,
      }),
    )

    const longData = await longRes.json()
    if (longData.error) {
      console.error('Meta long-lived token exchange error:', longData)
      return error(`Failed to get long-lived token: ${longData.error.message}`, 400)
    }

    const accessToken = longData.access_token

    // Verify the ad account is accessible
    const acctRes = await fetch(
      `${GRAPH}/${normalizedAccountId}?fields=id,name,account_status&access_token=${accessToken}`,
    )
    if (!acctRes.ok) {
      const acctErr = await acctRes.json()
      console.error('Meta account verification failed:', acctErr)
      return error(`Meta ad account not accessible: ${acctErr.error?.message ?? 'unknown error'}`, 400)
    }

    // Encrypt and store
    const encryptedToken = await encryptToken(accessToken, Deno.env.get('ENCRYPTION_KEY')!)

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    )

    const { error: dbError } = await supabase
      .from('clients')
      .update({
        meta_ad_account_id: normalizedAccountId,
        meta_access_token:  encryptedToken,
      })
      .eq('id', client_id)

    if (dbError) {
      console.error('DB update error:', dbError)
      return error('Failed to save Meta connection.', 500)
    }

    return new Response(JSON.stringify({ ok: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (err) {
    console.error('Unexpected error:', err)
    return error('Internal server error', 500)
  }
})

function error(message: string, status: number) {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}

async function encryptToken(plaintext: string, keyHex: string): Promise<string> {
  const keyBytes = hexToBytes(keyHex.padEnd(64, '0').slice(0, 64))
  const key = await crypto.subtle.importKey('raw', keyBytes, 'AES-GCM', false, ['encrypt'])
  const iv  = crypto.getRandomValues(new Uint8Array(12))
  const enc = new TextEncoder().encode(plaintext)
  const ciphertext = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, enc)
  const combined = new Uint8Array(12 + ciphertext.byteLength)
  combined.set(iv, 0)
  combined.set(new Uint8Array(ciphertext), 12)
  return bytesToHex(combined)
}

function hexToBytes(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2)
  for (let i = 0; i < bytes.length; i++) bytes[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16)
  return bytes
}

function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes).map((b) => b.toString(16).padStart(2, '0')).join('')
}
