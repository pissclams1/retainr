// BindIQ subscription — single plan, monthly or annual billing
// Update PRICE_IDS with live Stripe price IDs after creating them in the Stripe Dashboard.

export const PRICE_IDS = {
  monthly: 'price_LIVE_MONTHLY',   // $79/mo  — replace after Stripe live setup
  annual:  'price_LIVE_ANNUAL',    // $708/yr ($59/mo) — replace after Stripe live setup
}

export const PLAN = {
  name:    'BindIQ Pro',
  monthly: 79,
  annual:  59,  // per month, billed as $708/yr
  features: [
    'Unlimited 4-point extractions',
    'Unlimited wind mitigation extractions',
    'BindIQ Score + red flag detection',
    'All 7 supported states',
    'Priority support',
  ],
}

// Tier name written to agencies.subscription_tier on successful checkout.
// Used by the app to check if a user has an active subscription.
export const PAID_TIER = 'pro'

// Legacy exports kept for compatibility with existing components
export const TIER_LIMIT = { trial: 3, pro: Infinity }
export const PLANS = {
  pro: { name: 'BindIQ Pro', price: PLAN.monthly, priceId: PRICE_IDS.monthly, features: PLAN.features },
}
