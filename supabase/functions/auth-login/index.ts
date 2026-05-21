import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'
import { serve } from 'https://deno.land/std@0.208.0/http/server.ts'
import { crypto } from 'https://deno.land/std@0.208.0/crypto/mod.ts'

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
)

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Simple password verification
async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const encoder = new TextEncoder()
  const data = encoder.encode(password)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const computed = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
  return computed === hash
}

async function createSession(userId: string, rememberMe: boolean = false): Promise<string> {
  const token = crypto.randomUUID()
  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + (rememberMe ? 30 : 7))

  const { error } = await supabase
    .from('sessions')
    .insert({
      user_id: userId,
      session_token: token,
      expires_at: expiresAt.toISOString(),
      remember_me: rememberMe,
    })

  if (error) throw new Error(`Failed to create session: ${error.message}`)
  return token
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers: corsHeaders })
  }

  try {
    const { email, password, rememberMe } = await req.json()

    if (!email || !password) {
      return new Response(
        JSON.stringify({ error: 'Email and password are required' }),
        { status: 400, headers: corsHeaders },
      )
    }

    // Find user
    const { data: user, error: queryError } = await supabase
      .from('users')
      .select('id, password_hash')
      .eq('email', email.toLowerCase())
      .single()

    if (queryError || !user) {
      // Don't reveal if email exists (security)
      return new Response(
        JSON.stringify({ error: 'Invalid email or password' }),
        { status: 401, headers: corsHeaders },
      )
    }

    // Verify password
    const passwordValid = await verifyPassword(password, user.password_hash)
    if (!passwordValid) {
      return new Response(
        JSON.stringify({ error: 'Invalid email or password' }),
        { status: 401, headers: corsHeaders },
      )
    }

    // Create session
    const sessionToken = await createSession(user.id, rememberMe)

    return new Response(
      JSON.stringify({
        success: true,
        userId: user.id,
        email: email.toLowerCase(),
        sessionToken,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )
  } catch (error) {
    console.error('Login error:', error)
    return new Response(
      JSON.stringify({ error: error.message || 'Login failed' }),
      { status: 500, headers: corsHeaders },
    )
  }
})
