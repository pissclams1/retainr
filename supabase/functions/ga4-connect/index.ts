import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { code, client_id, property_id, redirect_uri } = await req.json()

    if (!code || !client_id || !property_id || !redirect_uri) {
      return error('Missing required parameters', 400)
    }

    // Exchange authorization code for tokens
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id:     Deno.env.get('GOOGLE_CLIENT_ID')!,
        client_secret: Deno.env.get('GOOGLE_CLIENT_SECRET')!,
        redirect_uri,
        grant_type:    'authorization_code',
      }),
    })

    const tokens = await tokenRes.json()

    if (tokens.error) {
      console.error('Token exchange error:', tokens)
      return error(`Google token exchange failed: ${tokens.error_description ?? tokens.error}`, 400)
    }

    if (!tokens.refresh_token) {
      return error('No refresh token returned — user may have already authorized. Revoke access at myaccount.google.com/permissions and try again.', 400)
    }

    // Encrypt the refresh token with AES-256-GCM
    const encryptedToken = await encryptToken(
      tokens.refresh_token,
      Deno.env.get('ENCRYPTION_KEY')!,
    )

    // Verify the property exists and is accessible with the access token
    const propRes = await fetch(
      `https://analyticsadmin.googleapis.com/v1beta/${property_id}`,
      { headers: { Authorization: `Bearer ${tokens.access_token}` } },
    )

    if (!propRes.ok) {
      const propErr = await propRes.json()
      console.error('Property verification failed:', propErr)
      return error(`GA4 property not accessible: ${propErr.error?.message ?? 'unknown error'}`, 400)
    }

    // Store in Supabase using service role key (bypasses RLS for server-side write)
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    )

    const { error: dbError } = await supabase
      .from('clients')
      .update({
        ga4_property_id:   property_id,
        ga4_refresh_token: encryptedToken,
      })
      .eq('id', client_id)

    if (dbError) {
      console.error('DB update error:', dbError)
      return error('Failed to save GA4 connection.', 500)
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
  const keyBytes = hexToBytes(keyHex.padEnd(64, '0').slice(0, 64)) // ensure 32 bytes
  const key = await crypto.subtle.importKey('raw', keyBytes, 'AES-GCM', false, ['encrypt'])
  const iv  = crypto.getRandomValues(new Uint8Array(12))
  const enc = new TextEncoder().encode(plaintext)
  const ciphertext = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, enc)

  // Prepend IV so we can decrypt later: iv(12 bytes) + ciphertext
  const combined = new Uint8Array(12 + ciphertext.byteLength)
  combined.set(iv, 0)
  combined.set(new Uint8Array(ciphertext), 12)
  return bytesToHex(combined)
}

function hexToBytes(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2)
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16)
  }
  return bytes
}

function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes).map((b) => b.toString(16).padStart(2, '0')).join('')
}
