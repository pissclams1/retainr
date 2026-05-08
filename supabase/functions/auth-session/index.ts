import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'
import { serve } from 'https://deno.land/std@0.208.0/http/server.ts'

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
)

serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 })
  }

  try {
    const { sessionToken } = await req.json()

    if (!sessionToken) {
      return new Response(
        JSON.stringify({ authenticated: false }),
        { status: 200 },
      )
    }

    // Find session
    const { data: session, error: sessionError } = await supabase
      .from('sessions')
      .select('user_id, expires_at')
      .eq('session_token', sessionToken)
      .single()

    if (sessionError || !session) {
      return new Response(
        JSON.stringify({ authenticated: false }),
        { status: 200 },
      )
    }

    // Check if session expired
    if (new Date(session.expires_at) < new Date()) {
      // Delete expired session
      await supabase
        .from('sessions')
        .delete()
        .eq('session_token', sessionToken)

      return new Response(
        JSON.stringify({ authenticated: false }),
        { status: 200 },
      )
    }

    // Get user data
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, email')
      .eq('id', session.user_id)
      .single()

    if (userError || !user) {
      return new Response(
        JSON.stringify({ authenticated: false }),
        { status: 200 },
      )
    }

    return new Response(
      JSON.stringify({
        authenticated: true,
        userId: user.id,
        email: user.email,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } },
    )
  } catch (error) {
    console.error('Session check error:', error)
    return new Response(
      JSON.stringify({ error: error.message || 'Session check failed' }),
      { status: 500 },
    )
  }
})
