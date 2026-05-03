import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { PLANS } from '../lib/plans'
import Button from '../components/ui/Button'
import Callout from '../components/ui/Callout'
import Skeleton from '../components/ui/Skeleton'

export default function BillingPage() {
  const [agency, setAgency]     = useState(null)
  const [loading, setLoading]   = useState(true)
  const [upgrading, setUpgrading] = useState(null)
  const [searchParams]          = useSearchParams()
  const justUpgraded            = searchParams.get('success') === '1'

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      const { data } = await supabase
        .from('agencies')
        .select('id, name, subscription_tier, subscription_status, trial_ends_at')
        .eq('owner_email', user.email)
        .single()
      setAgency(data)
      setLoading(false)
    }
    load()
  }, [])

  const handleManageBilling = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    const { data, error } = await supabase.functions.invoke('create-portal-session', {
      body: { return_url: `${window.location.origin}/billing` },
      headers: { Authorization: `Bearer ${session.access_token}` },
    })
    if (!error && data?.url) window.location.href = data.url
  }

  const handleUpgrade = async (priceId) => {
    setUpgrading(priceId)
    const { data: { session } } = await supabase.auth.getSession()
    const { data, error } = await supabase.functions.invoke('create-checkout-session', {
      body: {
        price_id:    priceId,
        success_url: `${window.location.origin}/billing?success=1`,
        cancel_url:  `${window.location.origin}/billing`,
      },
      headers: { Authorization: `Bearer ${session.access_token}` },
    })
    if (error || !data?.url) {
      setUpgrading(null)
      return
    }
    window.location.href = data.url
  }

  const currentTier = agency?.subscription_tier ?? 'trial'
  const isActive    = agency?.subscription_status === 'active'

  const trialEnd = agency?.trial_ends_at
    ? new Date(agency.trial_ends_at).toLocaleDateString(undefined, { month: 'long', day: 'numeric' })
    : null

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', maxWidth: '860px' }}>

      {/* Header */}
      <div>
        <p style={{ fontFamily: 'Geist, sans-serif', fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--ink-5)', marginBottom: '4px' }}>
          Billing
        </p>
        <h1 style={{ fontFamily: 'Instrument Serif, serif', fontSize: '28px', color: 'var(--ink-2)', lineHeight: 1.2 }}>
          Plan & billing
        </h1>
      </div>

      {justUpgraded && (
        <Callout variant="win">You're all set — your plan has been activated. Welcome aboard.</Callout>
      )}

      {/* Current plan banner */}
      {loading ? (
        <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: '12px', padding: '20px 24px' }}>
          <Skeleton width="140px" height="12px" style={{ marginBottom: '8px' }} />
          <Skeleton width="220px" height="20px" />
        </div>
      ) : (
        <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: '12px', padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <p style={{ fontFamily: 'Geist, sans-serif', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--ink-5)', marginBottom: '4px' }}>
              Current plan
            </p>
            <p style={{ fontFamily: 'Instrument Serif, serif', fontSize: '22px', color: 'var(--ink-2)' }}>
              {currentTier === 'trial' ? 'Free trial' : `Retainr ${PLANS[currentTier]?.name}`}
              {currentTier === 'trial' && trialEnd && (
                <span style={{ fontFamily: 'Geist, sans-serif', fontSize: '13px', color: 'var(--ink-5)', marginLeft: '12px' }}>
                  expires {trialEnd}
                </span>
              )}
            </p>
          </div>
          {isActive && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontFamily: 'Geist, sans-serif', fontSize: '12px', fontWeight: 500, color: 'var(--win)', background: 'var(--win-bg)', padding: '4px 10px', borderRadius: '20px' }}>
                Active
              </span>
              <Button variant="outline" onClick={handleManageBilling}>
                Manage billing
              </Button>
            </div>
          )}
          {currentTier === 'trial' && (
            <span style={{ fontFamily: 'Geist, sans-serif', fontSize: '12px', fontWeight: 500, color: 'var(--alert)', background: 'var(--alert-bg)', padding: '4px 10px', borderRadius: '20px' }}>
              Trial
            </span>
          )}
        </div>
      )}

      {/* Plan cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
        {Object.entries(PLANS).map(([key, plan]) => {
          const isCurrent = currentTier === key && isActive
          return (
            <div
              key={key}
              style={{
                background: 'white',
                border: `1px solid ${isCurrent ? 'var(--ink-3)' : 'var(--border)'}`,
                borderRadius: '14px',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {isCurrent && (
                <div style={{ background: 'var(--ink-2)', padding: '6px 16px', textAlign: 'center' }}>
                  <p style={{ fontFamily: 'Geist, sans-serif', fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--hero-text)' }}>
                    Current plan
                  </p>
                </div>
              )}

              <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <p style={{ fontFamily: 'Instrument Serif, serif', fontSize: '22px', color: 'var(--ink-2)', marginBottom: '4px' }}>{plan.name}</p>
                  <p style={{ fontFamily: 'Instrument Serif, serif', fontSize: '32px', color: 'var(--ink-2)', lineHeight: 1 }}>
                    ${plan.price}
                    <span style={{ fontFamily: 'Geist, sans-serif', fontSize: '14px', color: 'var(--ink-5)', fontWeight: 400 }}>/mo</span>
                  </p>
                </div>

                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
                  {plan.features.map((f) => (
                    <li key={f} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                      <span style={{ color: 'var(--win)', fontSize: '14px', lineHeight: '20px', flexShrink: 0 }}>✓</span>
                      <span style={{ fontFamily: 'Geist, sans-serif', fontSize: '13px', color: 'var(--ink-3)', lineHeight: '20px' }}>{f}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  variant={isCurrent ? 'outline' : 'primary'}
                  disabled={isCurrent || upgrading === plan.priceId || loading}
                  onClick={() => !isCurrent && handleUpgrade(plan.priceId)}
                >
                  {isCurrent ? 'Current plan' : upgrading === plan.priceId ? 'Redirecting…' : `Upgrade to ${plan.name}`}
                </Button>
              </div>
            </div>
          )
        })}
      </div>

      <p style={{ fontFamily: 'Geist, sans-serif', fontSize: '12px', color: 'var(--ink-5)', lineHeight: 1.6 }}>
        All plans billed monthly. Cancel anytime — your data stays accessible through the end of your billing period.
        Payments are processed securely by Stripe.
      </p>

    </div>
  )
}
