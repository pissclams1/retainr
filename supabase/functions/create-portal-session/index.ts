import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Stripe from 'https://esm.sh/stripe@14?target=deno'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, {
  apiVersion: '2024-04-10',
  httpClient: Stripe.createFetchHttpClient(),
})

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
)

async function getUserFromToken(token: string) {
  const { data: { user }, error: authError } = await supabase.auth.getUser(token)
  if (!authError && user?.email) return { id: user.id, email: user.email }

  const { data: session } = await supabase
    .from('sessions')
    .select('user_id, expires_at')
    .eq('session_token', token)
    .single()

  if (!session || new Date(session.expires_at) < new Date()) return null

  const { data: customUser } = await supabase
    .from('users')
    .select('id, email')
    .eq('id', session.user_id)
    .single()

  return customUser?.email ? customUser : null
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'authorization, content-type' } })
  }

  const authHeader = req.headers.get('Authorization')
  if (!authHeader) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })

  const user = await getUserFromToken(authHeader.replace('Bearer ', ''))
  if (!user) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })

  const { data: agency } = await supabase
    .from('agencies')
    .select('stripe_customer_id')
    .eq('owner_email', user.email)
    .single()

  if (!agency?.stripe_customer_id) {
    return new Response(JSON.stringify({ error: 'No active subscription found' }), { status: 404 })
  }

  const { return_url } = await req.json().catch(() => ({}))

  const session = await stripe.billingPortal.sessions.create({
    customer: agency.stripe_customer_id,
    return_url: return_url ?? `${Deno.env.get('APP_URL')}/billing`,
  })

  return new Response(
    JSON.stringify({ url: session.url }),
    { headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } },
  )
})
