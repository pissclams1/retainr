import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
)

// Update these with real Stripe price IDs from your dashboard
const PRICES = {
  monthly: 'price_1TPagAAD9v8suvv9wZ5q40Br',
  annual:  'price_1TPagEAD9v8suvv9nePbMsCL',
}

const F = { sans: { fontFamily: "'DM Sans', system-ui, -apple-system, sans-serif" } }
const C = {
  bg:     '#F8FAFC',
  bg2:    '#FFFFFF',
  text:   '#0F1F3D',
  muted:  '#64748B',
  subtle: '#94A3B8',
  border: '#E2E8F0',
  accent: '#04256c',
  positive: '#10B981',
  danger: '#EF4444',
}

const PAGE_CSS = `
  html, body { background: ${C.bg}; }
  * { box-sizing: border-box; }
  .co-input { width: 100%; padding: 11px 14px; border-radius: 9px; border: 1.5px solid ${C.border}; background: #fff; font-size: 14px; color: ${C.text}; outline: none; transition: border-color 0.15s; font-family: 'DM Sans', sans-serif; }
  .co-input:focus { border-color: ${C.accent}; }
  .co-btn { width: 100%; padding: 15px; border-radius: 10px; border: none; background: ${C.accent}; color: #fff; font-size: 16px; font-weight: 700; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: opacity 0.15s; box-shadow: 0 4px 16px rgba(4,37,108,0.30); display: flex; align-items: center; justify-content: center; gap: 8px; }
  .co-btn:hover:not(:disabled) { opacity: 0.92; }
  .co-btn:disabled { opacity: 0.5; cursor: not-allowed; box-shadow: none; }
  .co-spinner { width: 18px; height: 18px; border: 2.5px solid rgba(255,255,255,0.3); border-top-color: #fff; border-radius: 50%; animation: cospin 0.7s linear infinite; }
  @keyframes cospin { to { transform: rotate(360deg); } }
`

export default function CheckoutPage() {
  const navigate = useNavigate()
  const [billing, setBilling] = useState('monthly')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function handleCheckout() {
    setError(null)
    setLoading(true)

    try {
      const { data: { session } } = await supabase.auth.getSession()

      if (!session) {
        // Not logged in — send to sign-up, come back here after
        navigate('/sign-up?redirect=/checkout')
        return
      }

      const { data, error: fnErr } = await supabase.functions.invoke('create-checkout-session', {
        body: {
          price_id: PRICES[billing],
          success_url: `${window.location.origin}/inspect?subscribed=1`,
          cancel_url:  `${window.location.origin}/checkout`,
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

  const price     = billing === 'annual' ? 59 : 79
  const annualTotal = 59 * 12

  return (
    <div style={{ ...F.sans, minHeight: '100vh', background: C.bg, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '48px 24px 80px', WebkitFontSmoothing: 'antialiased' }}>
      <style>{PAGE_CSS}</style>

      <Link to="/" style={{ ...F.sans, fontSize: 18, fontWeight: 800, color: C.text, textDecoration: 'none', marginBottom: 40, letterSpacing: '-0.02em' }}>
        BindIQ
      </Link>

      <div style={{ width: '100%', maxWidth: 440 }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <h1 style={{ ...F.sans, fontSize: 26, fontWeight: 800, color: C.text, letterSpacing: '-0.025em', margin: 0, marginBottom: 6 }}>
            Start your subscription
          </h1>
          <p style={{ ...F.sans, fontSize: 14, color: C.muted, margin: 0 }}>
            14-day free trial · Cancel any time · No setup fees
          </p>
        </div>

        {/* Card */}
        <div style={{ background: C.bg2, borderRadius: 16, border: `1px solid ${C.border}`, padding: 32, boxShadow: '0 4px 24px rgba(15,31,61,0.06)' }}>

          {/* Billing toggle */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ ...F.sans, fontSize: 12, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 10 }}>
              Billing period
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { key: 'monthly', label: 'Monthly', price: '$79/mo', sub: `$${79*12}/yr billed monthly` },
                { key: 'annual',  label: 'Annual',  price: '$59/mo', sub: `$${annualTotal}/yr — save $${(79-59)*12}`, badge: 'Save 25%' },
              ].map(opt => (
                <button
                  key={opt.key}
                  onClick={() => setBilling(opt.key)}
                  style={{
                    ...F.sans, textAlign: 'left', cursor: 'pointer', padding: '14px 16px',
                    background: billing === opt.key ? C.accentBg : C.bg2,
                    border: `1.5px solid ${billing === opt.key ? C.accent : C.border}`,
                    borderRadius: 10,
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
                    transition: 'all 0.15s',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 14, fontWeight: 600, color: C.text }}>{opt.label}</span>
                      {opt.badge && <span style={{ fontSize: 10, fontWeight: 700, color: '#065F46', background: 'rgba(16,185,129,0.12)', padding: '2px 8px', borderRadius: 10 }}>{opt.badge}</span>}
                    </div>
                    <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>{opt.sub}</div>
                  </div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: billing === opt.key ? C.accent : C.text, whiteSpace: 'nowrap' }}>{opt.price}</div>
                </button>
              ))}
            </div>
          </div>

          {/* What's included */}
          <div style={{ background: C.bg, borderRadius: 10, padding: '14px 16px', marginBottom: 24 }}>
            <div style={{ ...F.sans, fontSize: 11, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>Included</div>
            {[
              'Unlimited 4-point extractions',
              'Unlimited wind mitigation extractions',
              'Automatic red flag detection',
              'Wind mitigation & 4-point form support',
            ].map(item => (
              <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 7 }}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <circle cx="7" cy="7" r="6" fill="rgba(16,185,129,0.12)"/>
                  <path d="M4.5 7l1.8 1.8L9.5 5" stroke={C.positive} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span style={{ ...F.sans, fontSize: 13, color: C.text }}>{item}</span>
              </div>
            ))}
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
              : <span>Continue to payment — ${price}/mo →</span>
            }
          </button>

          <p style={{ ...F.sans, fontSize: 12, color: C.subtle, textAlign: 'center', marginTop: 14, lineHeight: 1.5 }}>
            Secured by Stripe · Cancel any time from your billing page · No credit card required for the 14-day trial
          </p>
        </div>

        <p style={{ ...F.sans, fontSize: 13, color: C.muted, textAlign: 'center', marginTop: 20 }}>
          Already have an account?{' '}
          <Link to="/sign-in" style={{ color: C.accent, fontWeight: 600, textDecoration: 'none' }}>Sign in</Link>
        </p>
      </div>
    </div>
  )
}
