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

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'authorization, content-type' } })
  }

  const authHeader = req.headers.get('Authorization')
  if (!authHeader) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })

  const { data: { user }, error: authError } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''))
  if (authError || !user) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })

  const { price_id, success_url, cancel_url } = await req.json()
  if (!price_id) return new Response(JSON.stringify({ error: 'price_id required' }), { status: 400 })

  // Get or create agency
  const { data: agency } = await supabase
    .from('agencies')
    .select('id, stripe_customer_id, subscription_tier')
    .eq('owner_email', user.email)
    .single()

  if (!agency) return new Response(JSON.stringify({ error: 'Agency not found' }), { status: 404 })

  // Get or create Stripe customer
  let customerId = agency.stripe_customer_id
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      metadata: { agency_id: agency.id },
    })
    customerId = customer.id
    await supabase.from('agencies').update({ stripe_customer_id: customerId }).eq('id', agency.id)
  }

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: 'subscription',
    line_items: [{ price: price_id, quantity: 1 }],
    success_url: success_url ?? `${Deno.env.get('APP_URL')}/billing?success=1`,
    cancel_url: cancel_url ?? `${Deno.env.get('APP_URL')}/billing`,
    metadata: { agency_id: agency.id },
    subscription_data: { metadata: { agency_id: agency.id } },
    allow_promotion_codes: true,
  })

  return new Response(
    JSON.stringify({ url: session.url }),
    { headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } },
  )
})
