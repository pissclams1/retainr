import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'
import { serve } from 'https://deno.land/std@0.208.0/http/server.ts'

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
)

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers: corsHeaders })
  }

  try {
    const { sessionToken } = await req.json()

    if (!sessionToken) {
      return new Response(
        JSON.stringify({ success: true }),
        { status: 200, headers: corsHeaders },
      )
    }

    // Delete the session
    const { error } = await supabase
      .from('sessions')
      .delete()
      .eq('session_token', sessionToken)

    if (error) {
      console.error('Logout error:', error)
    }

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )
  } catch (error) {
    console.error('Logout error:', error)
    return new Response(
      JSON.stringify({ error: error.message || 'Logout failed' }),
      { status: 500, headers: corsHeaders },
    )
  }
})
