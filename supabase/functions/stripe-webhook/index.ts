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

// Both monthly and annual prices grant the same 'pro' tier.
// Update these price IDs after creating live products in the Stripe Dashboard.
const PAID_PRICE_IDS = new Set([
  Deno.env.get('STRIPE_PRICE_MONTHLY') ?? 'price_LIVE_MONTHLY',
  Deno.env.get('STRIPE_PRICE_ANNUAL')  ?? 'price_LIVE_ANNUAL',
])

function tierForPrice(priceId: string): string {
  return PAID_PRICE_IDS.has(priceId) ? 'pro' : 'trial'
}

Deno.serve(async (req) => {
  const body      = await req.text()
  const signature = req.headers.get('stripe-signature') ?? ''

  let event: Stripe.Event
  try {
    event = await stripe.webhooks.constructEventAsync(body, signature, Deno.env.get('STRIPE_WEBHOOK_SECRET')!)
  } catch {
    return new Response('Invalid signature', { status: 400 })
  }

  // ── Checkout completed → activate subscription ───────────────────────────
  if (event.type === 'checkout.session.completed') {
    const session  = event.data.object as Stripe.Checkout.Session
    const agencyId = session.metadata?.agency_id
    if (!agencyId || session.mode !== 'subscription') return ok()

    const subscription = await stripe.subscriptions.retrieve(session.subscription as string)
    const priceId      = subscription.items.data[0]?.price.id
    const tier         = tierForPrice(priceId)

    await supabase.from('agencies').update({
      stripe_customer_id:  session.customer as string,
      subscription_tier:   tier,
      subscription_status: 'active',
    }).eq('id', agencyId)
  }

  // ── Subscription updated (plan change / renewal) ─────────────────────────
  if (event.type === 'customer.subscription.updated') {
    const sub      = event.data.object as Stripe.Subscription
    const agencyId = sub.metadata?.agency_id
    if (!agencyId) return ok()

    const priceId = sub.items.data[0]?.price.id
    const tier    = tierForPrice(priceId)
    const status  = sub.status === 'active'     ? 'active'
                  : sub.status === 'past_due'   ? 'past_due'
                  : sub.status === 'canceled'   ? 'cancelled'
                  : 'active'

    await supabase.from('agencies').update({
      subscription_tier:   tier,
      subscription_status: status,
    }).eq('id', agencyId)
  }

  // ── Subscription cancelled ───────────────────────────────────────────────
  if (event.type === 'customer.subscription.deleted') {
    const sub      = event.data.object as Stripe.Subscription
    const agencyId = sub.metadata?.agency_id
    if (!agencyId) return ok()

    await supabase.from('agencies').update({
      subscription_tier:   'trial',
      subscription_status: 'cancelled',
    }).eq('id', agencyId)
  }

  return ok()
})

function ok() {
  return new Response(JSON.stringify({ received: true }), { headers: { 'Content-Type': 'application/json' } })
}
