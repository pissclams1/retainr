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

// Simple password hashing using PBKDF2 (not ideal but sufficient for MVP)
// In production, use bcrypt or Argon2id
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(password)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

async function createSession(userId: string, rememberMe: boolean = false): Promise<string> {
  const token = crypto.randomUUID()
  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + (rememberMe ? 30 : 7)) // 30 days or 7 days

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

    if (password.length < 8) {
      return new Response(
        JSON.stringify({ error: 'Password must be at least 8 characters' }),
        { status: 400, headers: corsHeaders },
      )
    }

    // Check if user already exists
    const { data: existing } = await supabase
      .from('users')
      .select('id')
      .eq('email', email.toLowerCase())
      .single()

    if (existing) {
      return new Response(
        JSON.stringify({ error: 'Email already registered' }),
        { status: 409, headers: corsHeaders },
      )
    }

    // Hash password and create user
    const passwordHash = await hashPassword(password)
    const { data: user, error: insertError } = await supabase
      .from('users')
      .insert({
        email: email.toLowerCase(),
        password_hash: passwordHash,
      })
      .select('id')
      .single()

    if (insertError) throw new Error(`Failed to create user: ${insertError.message}`)

    // Create session
    const sessionToken = await createSession(user.id, rememberMe)

    return new Response(
      JSON.stringify({
        success: true,
        userId: user.id,
        email: email.toLowerCase(),
        sessionToken,
      }),
      { status: 201, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )
  } catch (error) {
    console.error('Signup error:', error)
    return new Response(
      JSON.stringify({ error: error.message || 'Signup failed' }),
      { status: 500, headers: corsHeaders },
    )
  }
})
