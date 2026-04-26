import { useState, useMemo } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'

const serif = { fontFamily: "'Instrument Serif', serif" }
const sans = { fontFamily: "'Geist', sans-serif" }

const PLANS = {
  starter: { tier: 'Starter', monthly: 149, yearly: 119, blurb: 'For small agencies standardizing client communication' },
  growth:  { tier: 'Growth',  monthly: 399, yearly: 319, blurb: 'For teams with multiple account managers' },
  agency:  { tier: 'Agency',  monthly: 999, yearly: 799, blurb: 'For agencies scaling communication consistency' },
}

/* ─── styles ─── */

const screen = {
  minHeight: '100vh',
  background: '#0F0F0E',
  display: 'flex', flexDirection: 'column', alignItems: 'center',
  padding: '40px 24px 80px',
  ...sans,
}
const logo = { ...serif, fontSize: 22, color: '#F5F5F3', textDecoration: 'none', marginBottom: 32, display: 'block' }

const card = {
  width: '100%', maxWidth: 480,
  background: '#1A1A18',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: 14,
  padding: 28,
}
const eyebrow = {
  ...sans, fontSize: 11, fontWeight: 600,
  textTransform: 'uppercase', letterSpacing: '0.12em',
  color: 'rgba(245,245,243,0.50)', marginBottom: 12,
}
const title = { ...serif, fontSize: 26, fontWeight: 400, color: '#F5F5F3', lineHeight: 1.2, marginBottom: 6 }
const sub = { ...sans, fontSize: 13, color: 'rgba(245,245,243,0.55)', lineHeight: 1.6, marginBottom: 22 }

const dotRow = { display: 'flex', gap: 8, marginBottom: 24 }
const dot = (active) => ({
  width: 24, height: 4, borderRadius: 2,
  background: active ? '#F5F5F3' : 'rgba(245,245,243,0.18)',
})

const primary = (disabled) => ({
  width: '100%', height: 42,
  background: disabled ? 'rgba(245,245,243,0.25)' : '#F5F5F3',
  color: disabled ? 'rgba(15,15,14,0.4)' : '#0F0F0E',
  border: 'none', borderRadius: 8,
  ...sans, fontSize: 13, fontWeight: 500,
  cursor: disabled ? 'not-allowed' : 'pointer',
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
})
const ghost = {
  ...sans, fontSize: 12, color: 'rgba(245,245,243,0.50)',
  background: 'transparent', border: 'none', cursor: 'pointer',
  marginTop: 12, width: '100%',
}
const input = {
  width: '100%', height: 40, padding: '0 12px',
  ...sans, fontSize: 13, color: '#F5F5F3',
  background: '#0F0F0E',
  border: '1px solid rgba(255,255,255,0.12)', borderRadius: 7,
  outline: 'none', boxSizing: 'border-box',
}
const label = {
  ...sans, fontSize: 11, fontWeight: 600,
  textTransform: 'uppercase', letterSpacing: '0.10em',
  color: 'rgba(245,245,243,0.50)',
  display: 'block', marginBottom: 6,
}

/* ─── steps ─── */

function Dots({ step }) {
  return (
    <div style={dotRow}>
      {[1, 2, 3, 4].map((n) => <div key={n} style={dot(step >= n)} />)}
    </div>
  )
}

function PlanStep({ planKey, setPlanKey, onNext }) {
  return (
    <div style={card}>
      <div style={eyebrow}>Step 1 of 4</div>
      <h1 style={title}>Choose your plan</h1>
      <p style={sub}>You can change or cancel any time.</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {Object.entries(PLANS).map(([key, p]) => {
          const active = planKey === key
          return (
            <button
              key={key}
              onClick={() => setPlanKey(key)}
              style={{
                ...sans, textAlign: 'left',
                padding: '14px 14px',
                background: active ? 'rgba(245,245,243,0.06)' : 'transparent',
                border: `1px solid ${active ? 'rgba(245,245,243,0.30)' : 'rgba(255,255,255,0.10)'}`,
                borderRadius: 10, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
              }}
            >
              <div>
                <div style={{ fontSize: 14, fontWeight: 500, color: '#F5F5F3' }}>{p.tier}</div>
                <div style={{ fontSize: 11, color: 'rgba(245,245,243,0.50)', marginTop: 3, lineHeight: 1.45 }}>{p.blurb}</div>
              </div>
              <div style={{ ...serif, fontSize: 22, color: '#F5F5F3' }}>${p.monthly}</div>
            </button>
          )
        })}
      </div>

      <button onClick={onNext} style={{ ...primary(false), marginTop: 20 }}>Continue →</button>
    </div>
  )
}

function BillingStep({ planKey, billing, setBilling, onNext, onBack }) {
  const p = PLANS[planKey]
  const yearlyAnnual = p.yearly * 12
  const monthlyAnnual = p.monthly * 12
  const savings = monthlyAnnual - yearlyAnnual

  const opt = (key, label, badge) => {
    const active = billing === key
    const price = key === 'yearly' ? p.yearly : p.monthly
    return (
      <button
        onClick={() => setBilling(key)}
        style={{
          ...sans, textAlign: 'left', cursor: 'pointer',
          padding: '14px 14px',
          background: active ? 'rgba(245,245,243,0.06)' : 'transparent',
          border: `1px solid ${active ? 'rgba(245,245,243,0.30)' : 'rgba(255,255,255,0.10)'}`,
          borderRadius: 10,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
        }}
      >
        <div>
          <div style={{ fontSize: 14, fontWeight: 500, color: '#F5F5F3', display: 'flex', gap: 8, alignItems: 'center' }}>
            {label}
            {badge && (
              <span style={{
                fontSize: 9, fontWeight: 600,
                padding: '2px 7px', borderRadius: 10,
                background: 'rgba(45,106,39,0.25)', color: '#A7E2A1',
                letterSpacing: '0.04em',
              }}>{badge}</span>
            )}
          </div>
          <div style={{ fontSize: 11, color: 'rgba(245,245,243,0.50)', marginTop: 3 }}>
            {key === 'yearly'
              ? `$${yearlyAnnual.toLocaleString()}/yr · save $${savings.toLocaleString()}`
              : `$${monthlyAnnual.toLocaleString()}/yr if billed monthly`}
          </div>
        </div>
        <div style={{ ...serif, fontSize: 22, color: '#F5F5F3' }}>${price}<span style={{ ...sans, fontSize: 11, color: 'rgba(245,245,243,0.45)' }}>/mo</span></div>
      </button>
    )
  }

  return (
    <div style={card}>
      <div style={eyebrow}>Step 2 of 4</div>
      <h1 style={title}>Choose your billing period</h1>
      <p style={sub}>{p.tier} plan · pay monthly or save 20% with yearly.</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {opt('monthly', 'Monthly')}
        {opt('yearly', 'Yearly', 'Save 20%')}
      </div>

      <button onClick={onNext} style={{ ...primary(false), marginTop: 20 }}>Continue →</button>
      <button onClick={onBack} style={ghost}>← Back</button>
    </div>
  )
}

function PaymentStep({ form, setForm, onNext, onBack }) {
  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }))
  const valid = form.name && form.email && form.card.length >= 12 && form.exp && form.cvc
  return (
    <div style={card}>
      <div style={eyebrow}>Step 3 of 4</div>
      <h1 style={title}>Billing information</h1>
      <p style={sub}>Stripe-secured. We never store raw card data.</p>

      <form onSubmit={(e) => { e.preventDefault(); if (valid) onNext() }} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div>
          <label style={label}>Full name</label>
          <input style={input} value={form.name} onChange={(e) => update('name', e.target.value)} placeholder="Jane Smith" required />
        </div>
        <div>
          <label style={label}>Billing email</label>
          <input type="email" style={input} value={form.email} onChange={(e) => update('email', e.target.value)} placeholder="billing@youragency.com" required />
        </div>
        <div>
          <label style={label}>Card number</label>
          <input
            style={input}
            value={form.card}
            onChange={(e) => update('card', e.target.value.replace(/[^\d ]/g, '').slice(0, 19))}
            placeholder="4242 4242 4242 4242"
            inputMode="numeric"
            required
          />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <div>
            <label style={label}>Expiry</label>
            <input style={input} value={form.exp} onChange={(e) => update('exp', e.target.value.replace(/[^\d/]/g, '').slice(0, 5))} placeholder="MM/YY" required />
          </div>
          <div>
            <label style={label}>CVC</label>
            <input style={input} value={form.cvc} onChange={(e) => update('cvc', e.target.value.replace(/\D/g, '').slice(0, 4))} placeholder="123" required />
          </div>
        </div>
        <button type="submit" disabled={!valid} style={{ ...primary(!valid), marginTop: 6 }}>Continue →</button>
        <button type="button" onClick={onBack} style={ghost}>← Back</button>
      </form>
    </div>
  )
}

function ConfirmStep({ planKey, billing, form, onConfirm, onBack, submitting }) {
  const p = PLANS[planKey]
  const price = billing === 'yearly' ? p.yearly : p.monthly
  const total = billing === 'yearly' ? p.yearly * 12 : p.monthly
  const last4 = form.card.replace(/\s/g, '').slice(-4)

  const Row = ({ k, v }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
      <span style={{ ...sans, fontSize: 12, color: 'rgba(245,245,243,0.55)' }}>{k}</span>
      <span style={{ ...sans, fontSize: 13, color: '#F5F5F3', fontWeight: 500 }}>{v}</span>
    </div>
  )

  return (
    <div style={card}>
      <div style={eyebrow}>Step 4 of 4</div>
      <h1 style={title}>Confirm subscription</h1>
      <p style={sub}>Review and start your retainr subscription.</p>

      <div style={{ marginBottom: 18 }}>
        <Row k="Plan" v={p.tier} />
        <Row k="Billing" v={billing === 'yearly' ? 'Yearly (save 20%)' : 'Monthly'} />
        <Row k="Price" v={`$${price}/mo`} />
        <Row k="Today's charge" v={`$${total.toLocaleString()}`} />
        <Row k="Card" v={last4 ? `•••• ${last4}` : '—'} />
        <Row k="Email" v={form.email} />
      </div>

      <button onClick={onConfirm} disabled={submitting} style={primary(submitting)}>
        {submitting ? 'Starting your subscription…' : `Confirm and pay $${total.toLocaleString()}`}
      </button>
      <button onClick={onBack} style={ghost} disabled={submitting}>← Back</button>

      <p style={{ ...sans, fontSize: 11, color: 'rgba(245,245,243,0.35)', marginTop: 14, lineHeight: 1.5, textAlign: 'center' }}>
        Cancel any time. No setup fees, no per-report charges.
      </p>
    </div>
  )
}

function SuccessStep({ planKey, billing }) {
  const p = PLANS[planKey]
  return (
    <div style={{ ...card, textAlign: 'center', padding: '40px 32px' }}>
      <div style={{
        width: 56, height: 56, borderRadius: '50%',
        background: 'rgba(45,106,39,0.15)', border: '1px solid rgba(45,106,39,0.3)',
        margin: '0 auto 18px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        ...serif, fontSize: 22, color: '#A7E2A1',
      }}>✓</div>
      <h1 style={{ ...title, fontSize: 26, marginBottom: 6 }}>You're on {p.tier}</h1>
      <p style={{ ...sub, marginBottom: 22 }}>
        Subscription active · {billing === 'yearly' ? 'Yearly billing' : 'Monthly billing'}.
        Generate your first client-ready report now.
      </p>
      <Link to="/onboarding" style={{ ...primary(false), textDecoration: 'none' }}>
        Generate first report →
      </Link>
    </div>
  )
}

/* ─── page ─── */

export default function CheckoutPage() {
  const [params] = useSearchParams()
  const navigate = useNavigate()

  const initialPlan = useMemo(() => {
    const p = (params.get('plan') || 'growth').toLowerCase()
    return PLANS[p] ? p : 'growth'
  }, [params])
  const initialBilling = (params.get('billing') === 'yearly') ? 'yearly' : 'monthly'

  const [step, setStep] = useState(1)
  const [planKey, setPlanKey] = useState(initialPlan)
  const [billing, setBilling] = useState(initialBilling)
  const [form, setForm] = useState({ name: '', email: '', card: '', exp: '', cvc: '' })
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)

  const handleConfirm = () => {
    setSubmitting(true)
    setTimeout(() => {
      setSubmitting(false)
      setDone(true)
    }, 1400)
  }

  return (
    <div style={screen}>
      <Link to="/" style={logo}>retainr</Link>
      {!done && <Dots step={step} />}

      {!done && step === 1 && (
        <PlanStep planKey={planKey} setPlanKey={setPlanKey} onNext={() => setStep(2)} />
      )}
      {!done && step === 2 && (
        <BillingStep
          planKey={planKey}
          billing={billing}
          setBilling={setBilling}
          onNext={() => setStep(3)}
          onBack={() => setStep(1)}
        />
      )}
      {!done && step === 3 && (
        <PaymentStep
          form={form} setForm={setForm}
          onNext={() => setStep(4)}
          onBack={() => setStep(2)}
        />
      )}
      {!done && step === 4 && (
        <ConfirmStep
          planKey={planKey} billing={billing} form={form}
          onConfirm={handleConfirm}
          onBack={() => setStep(3)}
          submitting={submitting}
        />
      )}
      {done && <SuccessStep planKey={planKey} billing={billing} />}

      {!done && (
        <p style={{ ...sans, fontSize: 11, color: 'rgba(245,245,243,0.35)', marginTop: 24 }}>
          Already have an account? <Link to="/login" style={{ color: 'rgba(245,245,243,0.55)', textDecoration: 'none' }}>Sign in</Link>
        </p>
      )}
    </div>
  )
}
