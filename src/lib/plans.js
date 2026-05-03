// BindIQ subscription — 3 tiers, monthly or annual billing (15% off annual)

export const PRICE_IDS = {
  starter: {
    monthly: 'price_1TSj4zDhLiXU2Hvz323rMzWu',  // $79/mo
    annual:  'price_1TSjEiDhLiXU2HvzmiN7eftK',   // $804/yr ($67/mo)
  },
  pro: {
    monthly: 'price_1TSjHrDhLiXU2HvzTDwlT6Qy',  // $149/mo
    annual:  'price_1TSjHtDhLiXU2HvzSjr0vxBu',  // $1,524/yr ($127/mo)
  },
  agency: {
    monthly: 'price_1TSjHwDhLiXU2HvzsaiA6ECo',  // $299/mo
    annual:  'price_1TSjHzDhLiXU2Hvz2137S7Jn',  // $3,048/yr ($254/mo)
  },
}

export const PLANS = {
  starter: {
    key:     'starter',
    name:    'Starter',
    monthly: 79,
    annual:  67,   // per month, billed as $804/yr
    annualTotal: 804,
    reportLimit: 50,
    features: [
      'BindIQ Score on every scan',
      'Florida 4-point + wind mitigation',
      'Structured underwriting output',
      'PDF upload + paste mode',
    ],
  },
  pro: {
    key:     'pro',
    name:    'Pro',
    monthly: 149,
    annual:  127,  // per month, billed as $1,524/yr
    annualTotal: 1524,
    reportLimit: 200,
    popular: true,
    features: [
      'Everything in Starter',
      'Intake Links — async client submissions',
      'Client-facing 3-step intake form',
      'Submission history dashboard',
      'Enhanced underwriting explanations',
    ],
  },
  agency: {
    key:     'agency',
    name:    'Agency',
    monthly: 299,
    annual:  254,  // per month, billed as $3,048/yr
    annualTotal: 3048,
    reportLimit: 500,
    features: [
      'Everything in Pro',
      'Multi-user access (3 included)',
      'Agency branding on intake links',
      'Exportable underwriting summaries',
      'Priority support',
    ],
  },
}

// Tier name written to agencies.subscription_tier on successful checkout.
export const PAID_TIER = 'pro'

// Legacy exports kept for compatibility with existing components
export const TIER_LIMIT = { trial: 3, starter: 50, pro: 200, agency: 500 }
