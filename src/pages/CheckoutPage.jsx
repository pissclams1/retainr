import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { createClient } from '@supabase/supabase-js'
import { PRICE_IDS, PLANS } from '../lib/plans'

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
)

const F = { sans: { fontFamily: "'DM Sans', system-ui, -apple-system, sans-serif" } }
const C = {
  bg:       '#F8FAFC',
  bg2:      '#FFFFFF',
  text:     '#0F1F3D',
  muted:    '#64748B',
  subtle:   '#94A3B8',
  border:   '#E2E8F0',
  accent:   '#04256c',
  positive: '#10B981',
  danger:   '#EF4444',
}

const PAGE_CSS = `
  html, body { background: ${C.bg}; }
  * { box-sizing: border-box; }
  .co-btn { width: 100%; padding: 15px; border-radius: 10px; border: none; background: ${C.accent}; color: #fff; font-size: 16px; font-weight: 700; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: opacity 0.15s; box-shadow: 0 4px 16px rgba(4,37,108,0.30); display: flex; align-items: center; justify-content: center; gap: 8px; }
  .co-btn:hover:not(:disabled) { opacity: 0.92; }
  .co-btn:disabled { opacity: 0.5; cursor: not-allowed; box-shadow: none; }
  .co-spinner { width: 18px; height: 18px; border: 2.5px solid rgba(255,255,255,0.3); border-top-color: #fff; border-radius: 50%; animation: cospin 0.7s linear infinite; }
  @keyframes cospin { to { transform: rotate(360deg); } }
  .plan-card { cursor: pointer; border-radius: 12px; border: 2px solid ${C.border}; padding: 16px; transition: all 0.15s; background: #fff; position: relative; }
  .plan-card.selected { border-color: ${C.accent}; background: rgba(4,37,108,0.03); }
  .plan-card:hover:not(.selected) { border-color: #CBD5E1; }
`

const PLAN_KEYS = ['starter', 'pro', 'agency']

export default function CheckoutPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  // Allow pre-selecting a plan via ?plan=pro
  const initialPlan = PLAN_KEYS.includes(searchParams.get('plan')) ? searchParams.get('plan') : 'pro'

  const [selectedPlan, setSelectedPlan] = useState(initialPlan)
  const [billing, setBilling] = useState('monthly')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const plan = PLANS[selectedPlan]
  const price = billing === 'annual' ? plan.annual : plan.monthly
  const priceId = PRICE_IDS[selectedPlan][billing]

  async function handleCheckout() {
    setError(null)
    setLoading(true)

    try {
      const { data: { session } } = await supabase.auth.getSession()

      if (!session) {
        navigate(`/sign-up?redirect=/checkout?plan=${selectedPlan}`)
        return
      }

      const { data, error: fnErr } = await supabase.functions.invoke('create-checkout-session', {
        body: {
          price_id: priceId,
          success_url: `${window.location.origin}/inspect?subscribed=1`,
          cancel_url:  `${window.location.origin}/checkout?plan=${selectedPlan}`,
        },
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      })

      if (fnErr) throw new Error(fnErr.message)
      if (data?.error) throw new Error(data.error)
      if (!data?.url) throw new Error('No checkout URL returned')

      window.location.href = data.url
    } catch (e) {
      setError(e.message || 'Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div style={{ ...F.sans, minHeight: '100vh', background: C.bg, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '48px 24px 80px', WebkitFontSmoothing: 'antialiased' }}>
      <style>{PAGE_CSS}</style>

      <Link to="/" style={{ ...F.sans, fontSize: 18, fontWeight: 800, color: C.text, textDecoration: 'none', marginBottom: 40, letterSpacing: '-0.02em' }}>
        BindIQ
      </Link>

      <div style={{ width: '100%', maxWidth: 520 }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <h1 style={{ ...F.sans, fontSize: 26, fontWeight: 800, color: C.text, letterSpacing: '-0.025em', margin: 0, marginBottom: 6 }}>
            Start your subscription
          </h1>
          <p style={{ ...F.sans, fontSize: 14, color: C.muted, margin: 0 }}>
            Cancel any time · No setup fees · Instant access
          </p>
        </div>

        {/* Card */}
        <div style={{ background: C.bg2, borderRadius: 16, border: `1px solid ${C.border}`, padding: 28, boxShadow: '0 4px 24px rgba(15,31,61,0.06)' }}>

          {/* Billing toggle */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 24, background: C.bg, borderRadius: 10, padding: 4 }}>
            {[
              { key: 'monthly', label: 'Monthly' },
              { key: 'annual',  label: 'Annual — save 15%' },
            ].map(opt => (
              <button
                key={opt.key}
                onClick={() => setBilling(opt.key)}
                style={{
                  ...F.sans, flex: 1, padding: '8px 0', borderRadius: 8, border: 'none', cursor: 'pointer',
                  fontSize: 13, fontWeight: 600,
                  background: billing === opt.key ? '#fff' : 'transparent',
                  color: billing === opt.key ? C.text : C.muted,
                  boxShadow: billing === opt.key ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
                  transition: 'all 0.15s',
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Plan selector */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
            {PLAN_KEYS.map(key => {
              const p = PLANS[key]
              const monthlyPrice = billing === 'annual' ? p.annual : p.monthly
              const isSelected = selectedPlan === key
              return (
                <div
                  key={key}
                  className={`plan-card${isSelected ? ' selected' : ''}`}
                  onClick={() => setSelectedPlan(key)}
                >
                  {p.popular && (
                    <div style={{
                      position: 'absolute', top: -11, left: '50%', transform: 'translateX(-50%)',
                      background: C.accent, color: '#fff', fontSize: 10, fontWeight: 700,
                      padding: '3px 12px', borderRadius: 20, letterSpacing: '0.06em', whiteSpace: 'nowrap',
                    }}>
                      MOST POPULAR
                    </div>
                  )}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      {/* Radio dot */}
                      <div style={{
                        width: 16, height: 16, borderRadius: '50%', border: `2px solid ${isSelected ? C.accent : C.border}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                      }}>
                        {isSelected && <div style={{ width: 8, height: 8, borderRadius: '50%', background: C.accent }} />}
                      </div>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: C.text }}>{p.name}</div>
                        <div style={{ fontSize: 11, color: C.muted, marginTop: 1 }}>
                          Up to {p.reportLimit === 500 ? '500+' : p.reportLimit} reports/mo
                        </div>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 18, fontWeight: 800, color: isSelected ? C.accent : C.text }}>
                        ${monthlyPrice}<span style={{ fontSize: 12, fontWeight: 500, color: C.muted }}>/mo</span>
                      </div>
                      {billing === 'annual' && (
                        <div style={{ fontSize: 10, color: C.muted }}>${p.annualTotal}/yr</div>
                      )}
                    </div>
                  </div>

                  {/* Features — only show for selected plan */}
                  {isSelected && (
                    <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px solid ${C.border}` }}>
                      {p.features.map(feat => (
                        <div key={feat} style={{ display: 'flex', alignItems: 'flex-start', gap: 7, marginBottom: 5 }}>
                          <svg width="13" height="13" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0, marginTop: 1 }}>
                            <circle cx="7" cy="7" r="6" fill="rgba(16,185,129,0.12)"/>
                            <path d="M4.5 7l1.8 1.8L9.5 5" stroke={C.positive} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          <span style={{ ...F.sans, fontSize: 12, color: C.text, lineHeight: 1.4 }}>{feat}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Error */}
          {error && (
            <div style={{ ...F.sans, fontSize: 13, color: C.danger, background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.20)', borderRadius: 8, padding: '10px 14px', marginBottom: 16 }}>
              {error}
            </div>
          )}

          {/* CTA */}
          <button className="co-btn" onClick={handleCheckout} disabled={loading}>
            {loading
              ? <><div className="co-spinner" /><span>Preparing checkout…</span></>
              : <span>Continue with {plan.name} — ${price}/mo →</span>
            }
          </button>

          <p style={{ ...F.sans, fontSize: 12, color: C.subtle, textAlign: 'center', marginTop: 14, lineHeight: 1.5 }}>
            Secured by Stripe · Cancel any time from your billing page
          </p>
        </div>

        <p style={{ ...F.sans, fontSize: 13, color: C.muted, textAlign: 'center', marginTop: 20 }}>
          Already have an account?{' '}
          <Link to="/sign-up" style={{ color: C.accent, fontWeight: 600, textDecoration: 'none' }}>Sign in</Link>
        </p>
      </div>
    </div>
  )
}
