export const PLANS = {
  starter: {
    name:       'Starter',
    price:      39,
    priceId:    'price_1TPagAAD9v8suvv9wZ5q40Br',
    clientLimit: 5,
    features: [
      'Up to 5 clients',
      'Daily GA4 data sync',
      'AI-generated client reports',
      'Internal briefing cards',
      'Commitment tracking',
    ],
  },
  growth: {
    name:       'Growth',
    price:      79,
    priceId:    'price_1TPagEAD9v8suvv9nePbMsCL',
    clientLimit: 15,
    features: [
      'Up to 15 clients',
      'Everything in Starter',
      'Priority data refresh',
      'Team-ready reporting',
    ],
  },
  agency: {
    name:       'Agency',
    price:      149,
    priceId:    'price_1TPagHAD9v8suvv9GoinsyQA',
    clientLimit: 999,
    features: [
      'Unlimited clients',
      'Everything in Growth',
      'White-label reports',
      'Dedicated support',
    ],
  },
}

export const TIER_LIMIT = {
  trial:   3,
  starter: PLANS.starter.clientLimit,
  growth:  PLANS.growth.clientLimit,
  agency:  PLANS.agency.clientLimit,
}
