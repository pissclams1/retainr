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
    const { code, client_id, customer_id, redirect_uri } = await req.json()

    if (!code || !client_id || !customer_id || !redirect_uri) {
      return error('Missing required parameters', 400)
    }

    // Strip hyphens from customer ID (123-456-7890 → 1234567890)
    const normalizedCustomerId = String(customer_id).replace(/-/g, '')
    if (!/^\d{8,12}$/.test(normalizedCustomerId)) {
      return error('Customer ID must be a numeric Google Ads customer ID (e.g. 1234567890)', 400)
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

    // Verify the customer is accessible via the Google Ads API
    const custRes = await fetch(
      `https://googleads.googleapis.com/v17/customers/${normalizedCustomerId}`,
      {
        headers: {
          Authorization:    `Bearer ${tokens.access_token}`,
          'developer-token': Deno.env.get('GOOGLE_ADS_DEVELOPER_TOKEN')!,
        },
      },
    )

    if (!custRes.ok) {
      const custErr = await custRes.json()
      console.error('Customer verification failed:', custErr)
      const msg = custErr.error?.message ?? custErr.error?.details?.[0]?.errors?.[0]?.message ?? 'unknown error'
      return error(`Google Ads customer not accessible: ${msg}`, 400)
    }

    // Encrypt the refresh token with AES-256-GCM
    const encryptedToken = await encryptToken(
      tokens.refresh_token,
      Deno.env.get('ENCRYPTION_KEY')!,
    )

    // Store in Supabase using service role key (bypasses RLS for server-side write)
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    )

    const { error: dbError } = await supabase
      .from('clients')
      .update({
        gads_customer_id:   normalizedCustomerId,
        gads_refresh_token: encryptedToken,
      })
      .eq('id', client_id)

    if (dbError) {
      console.error('DB update error:', dbError)
      return error('Failed to save Google Ads connection.', 500)
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
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16)
  }
  return bytes
}

function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes).map((b) => b.toString(16).padStart(2, '0')).join('')
}
