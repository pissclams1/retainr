export const PLANS = {
  growth: {
    name:        'Growth',
    price:       79,
    priceId:     'price_1TPagAAD9v8suvv9wZ5q40Br',  // update in Stripe dashboard
    clientLimit: 10,
    features: [
      'Up to 10 client accounts',
      'Google Ads reports',
      'Meta Ads reports (watermarked)',
      'Client report + AM internal brief',
      'Predicted questions (3 per report)',
    ],
  },
  pro: {
    name:        'Pro Agency',
    price:       199,
    priceId:     'price_1TPagEAD9v8suvv9nePbMsCL',  // update in Stripe dashboard
    clientLimit: 30,
    features: [
      'Up to 30 client accounts',
      'Everything in Growth',
      'White-label branding',
      'Scheduled auto-delivery',
      'Team access (up to 5 seats)',
      'Custom templates',
    ],
  },
  scale: {
    name:        'Scale',
    price:       399,
    priceId:     'price_1TPagHAD9v8suvv9GoinsyQA',  // update in Stripe dashboard
    clientLimit: 75,
    features: [
      'Up to 75 client accounts',
      'Everything in Pro Agency',
      'Unlimited team seats',
      'Custom domain',
      'API access',
      'Priority support + custom onboarding',
    ],
  },
}

export const TIER_LIMIT = {
  trial:  3,
  growth: PLANS.growth.clientLimit,
  pro:    PLANS.pro.clientLimit,
  scale:  PLANS.scale.clientLimit,
}
