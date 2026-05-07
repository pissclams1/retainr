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

// Map every live price ID to its tier name
const PRICE_TIER: Record<string, string> = {
  // Starter
  'price_1TSj4zDhLiXU2Hvz323rMzWu': 'starter', // $79/mo
  'price_1TSjEiDhLiXU2HvzmiN7eftK': 'starter', // $804/yr
  // Pro
  'price_1TSjHrDhLiXU2HvzTDwlT6Qy': 'pro',     // $149/mo
  'price_1TSjHtDhLiXU2HvzSjr0vxBu': 'pro',     // $1,524/yr
  // Agency
  'price_1TSjHwDhLiXU2HvzsaiA6ECo': 'agency',  // $299/mo
  'price_1TSjHzDhLiXU2Hvz2137S7Jn': 'agency',  // $3,048/yr
}

function tierForPrice(priceId: string): string {
  return PRICE_TIER[priceId] ?? 'trial'
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
      // Reset usage cycle on new subscription
      reports_this_cycle:  0,
      cycle_started_at:    new Date().toISOString(),
    }).eq('id', agencyId)
  }

  // ── Subscription updated (plan change / renewal) ─────────────────────────
  if (event.type === 'customer.subscription.updated') {
    const sub      = event.data.object as Stripe.Subscription
    const prevSub  = event.data.previous_attributes as Partial<Stripe.Subscription>
    const agencyId = sub.metadata?.agency_id
    if (!agencyId) return ok()

    const priceId = sub.items.data[0]?.price.id
    const tier    = tierForPrice(priceId)
    const status  = sub.status === 'active'   ? 'active'
                  : sub.status === 'past_due'  ? 'past_due'
                  : sub.status === 'canceled'  ? 'cancelled'
                  : 'active'

    const updates: Record<string, unknown> = {
      subscription_tier:   tier,
      subscription_status: status,
    }

    // Reset cycle on plan upgrade/downgrade or billing period renewal
    const periodChanged = prevSub?.current_period_start !== undefined
    const tierChanged   = prevSub?.items !== undefined
    if (periodChanged || tierChanged) {
      updates.reports_this_cycle = 0
      updates.cycle_started_at   = new Date().toISOString()
    }

    await supabase.from('agencies').update(updates).eq('id', agencyId)
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
