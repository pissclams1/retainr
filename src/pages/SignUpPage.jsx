import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import Logo from '../components/Logo'

const F = { sans: { fontFamily: "'DM Sans', system-ui, -apple-system, sans-serif" } }
const C = {
  navy:    '#04256c',
  dark:    '#0F1F3D',
  muted:   '#64748B',
  border:  '#E2E8F0',
  positive: '#10B981',
  bgAlt:   '#F8FAFC',
}

const PAGE_CSS = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { background: ${C.bgAlt}; }
  .su-input { width: 100%; padding: 11px 14px; border-radius: 9px; border: 1.5px solid ${C.border}; background: #fff; font-size: 14px; color: ${C.dark}; outline: none; transition: border-color 0.15s; font-family: 'DM Sans', sans-serif; }
  .su-input:focus { border-color: ${C.navy}; }
  .su-btn-primary { width: 100%; padding: 13px; border-radius: 9px; border: none; background: ${C.navy}; color: #fff; font-size: 15px; font-weight: 700; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: opacity 0.15s; }
  .su-btn-primary:hover { opacity: 0.9; }
  .su-btn-primary:disabled { background: ${C.border}; color: #94A3B8; cursor: default; opacity: 1; }
  .su-google-btn { width: 100%; padding: 11px 16px; border-radius: 9px; border: 1.5px solid ${C.border}; background: #fff; display: flex; align-items: center; justify-content: center; gap: 10px; font-size: 14px; font-weight: 600; color: ${C.dark}; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: border-color 0.15s; }
  .su-google-btn:hover { border-color: #94A3B8; }
`

const STEPS = ['Your account', 'Connect Google Ads', "You're in!"]

function StepIndicator({ current }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      {STEPS.map((label, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: i < current ? C.positive : i === current ? C.navy : C.border,
            transition: 'all 0.3s',
            flexShrink: 0,
          }}>
            {i < current ? (
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M2.5 6l2.5 2.5L9.5 3.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            ) : (
              <span style={{ ...F.sans, fontSize: 12, fontWeight: 700, color: i === current ? '#fff' : '#94A3B8' }}>{i + 1}</span>
            )}
          </div>
          {i < STEPS.length - 1 && (
            <div style={{ width: 40, height: 2, borderRadius: 1, background: i < current ? C.positive : C.border, transition: 'background 0.3s' }} />
          )}
        </div>
      ))}
    </div>
  )
}

/* ─────────── Step 1: Account setup ─────────── */

function Step1({ data, setData, onNext }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    if (!data.email || !data.firstName) return
    setLoading(true)
    setError('')
    // Sign up with magic link — sends email, then continues to step 2
    const { error: err } = await supabase.auth.signInWithOtp({
      email: data.email,
      options: {
        emailRedirectTo: `${window.location.origin}/onboarding`,
        data: { first_name: data.firstName, last_name: data.lastName, agency_name: data.agency },
      },
    })
    setLoading(false)
    if (err) { setError(err.message) } else { onNext() }
  }

  return (
    <div>
      <h1 style={{ ...F.sans, fontSize: 26, fontWeight: 800, letterSpacing: '-0.025em', marginBottom: 6 }}>Create your account</h1>
      <p style={{ ...F.sans, fontSize: 14, color: C.muted, marginBottom: 28 }}>14-day free trial · No credit card required</p>

      <button className="su-google-btn" style={{ marginBottom: 20 }}>
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4" />
          <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853" />
          <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05" />
          <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335" />
        </svg>
        Sign up with Google
      </button>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <div style={{ flex: 1, height: 1, background: C.border }} />
        <span style={{ ...F.sans, fontSize: 12, color: '#CBD5E1', fontWeight: 500 }}>or</span>
        <div style={{ flex: 1, height: 1, background: C.border }} />
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ display: 'flex', gap: 12 }}>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ ...F.sans, fontSize: 13, fontWeight: 600, color: C.dark }}>First name</label>
            <input className="su-input" placeholder="Jane" value={data.firstName} onChange={e => setData({ ...data, firstName: e.target.value })} required />
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ ...F.sans, fontSize: 13, fontWeight: 600, color: C.dark }}>Last name</label>
            <input className="su-input" placeholder="Smith" value={data.lastName} onChange={e => setData({ ...data, lastName: e.target.value })} />
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <label style={{ ...F.sans, fontSize: 13, fontWeight: 600, color: C.dark }}>Agency name</label>
          <input className="su-input" placeholder="Apex Digital" value={data.agency} onChange={e => setData({ ...data, agency: e.target.value })} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <label style={{ ...F.sans, fontSize: 13, fontWeight: 600, color: C.dark }}>Work email</label>
          <input className="su-input" type="email" placeholder="jane@apexdigital.com" value={data.email} onChange={e => setData({ ...data, email: e.target.value })} required />
        </div>

        {error && <p style={{ ...F.sans, fontSize: 13, color: '#EF4444' }}>{error}</p>}

        <button type="submit" className="su-btn-primary" disabled={loading} style={{ marginTop: 8 }}>
          {loading ? 'Creating account…' : 'Continue →'}
        </button>
      </form>

      <p style={{ ...F.sans, textAlign: 'center', fontSize: 12, color: '#94A3B8', marginTop: 16, lineHeight: 1.6 }}>
        By continuing you agree to retainr's{' '}
        <Link to="/terms" style={{ color: C.navy, textDecoration: 'none' }}>Terms</Link> and{' '}
        <Link to="/privacy" style={{ color: C.navy, textDecoration: 'none' }}>Privacy Policy</Link>
      </p>
    </div>
  )
}

/* ─────────── Step 2: Connect Google Ads ─────────── */

function Step2({ onNext }) {
  const [connecting, setConnecting] = useState(false)
  const [connected, setConnected] = useState(false)

  function handleConnect() {
    setConnecting(true)
    // In production: initiate Google OAuth flow for Ads API
    // Scopes needed: https://www.googleapis.com/auth/adwords (read-only)
    setTimeout(() => { setConnecting(false); setConnected(true) }, 1800)
  }

  return (
    <div>
      <h1 style={{ ...F.sans, fontSize: 26, fontWeight: 800, letterSpacing: '-0.025em', marginBottom: 6 }}>Connect Google Ads</h1>
      <p style={{ ...F.sans, fontSize: 14, color: C.muted, marginBottom: 28 }}>
        retainr needs read-only access to pull your campaign data in real-time.
      </p>

      {/* Permissions list */}
      <div style={{ background: C.bgAlt, borderRadius: 12, padding: '20px', border: `1px solid ${C.border}`, marginBottom: 24 }}>
        <div style={{ ...F.sans, fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#94A3B8', marginBottom: 14 }}>
          What retainr accesses
        </div>
        {[
          { icon: '📊', label: 'Campaign performance data', note: 'Read only' },
          { icon: '💰', label: 'Spend & budget metrics', note: 'Read only' },
          { icon: '🎯', label: 'Keyword & conversion data', note: 'Read only' },
          { icon: '📈', label: 'Impression share & auction data', note: 'Read only' },
        ].map(({ icon, label, note }) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '9px 0', borderBottom: `1px solid ${C.border}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 16 }}>{icon}</span>
              <span style={{ ...F.sans, fontSize: 14, color: C.dark, fontWeight: 500 }}>{label}</span>
            </div>
            <span style={{ ...F.sans, fontSize: 12, color: C.positive, fontWeight: 600, background: `${C.positive}15`, padding: '2px 8px', borderRadius: 4 }}>{note}</span>
          </div>
        ))}
        <div style={{ ...F.sans, marginTop: 12, fontSize: 12, color: '#94A3B8', lineHeight: 1.6 }}>
          retainr <strong>never</strong> makes changes to your campaigns, bids, or budgets.
          Access can be revoked at any time from your Google account settings.
        </div>
      </div>

      {/* AI generation note */}
      <div style={{ background: `${C.navy}08`, border: `1px solid ${C.navy}18`, borderRadius: 10, padding: '14px 16px', marginBottom: 20 }}>
        <div style={{ ...F.sans, fontSize: 12, fontWeight: 700, color: C.navy, marginBottom: 4 }}>🤖 What happens after you connect</div>
        <p style={{ ...F.sans, fontSize: 13, color: C.dark, lineHeight: 1.6, margin: 0 }}>
          retainr immediately pulls your account data and generates your first AI report — live, on-demand, in under 60 seconds. Client narrative, internal briefing, and predicted client questions all generated simultaneously.
        </p>
      </div>

      {connected ? (
        <div style={{ background: `${C.positive}10`, border: `1.5px solid ${C.positive}30`, borderRadius: 10, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: C.positive, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2.5 7l3 3 6-6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div>
            <div style={{ ...F.sans, fontSize: 14, fontWeight: 700, color: C.dark }}>Connected: Apex Digital (3 accounts)</div>
            <div style={{ ...F.sans, fontSize: 12, color: C.muted }}>google-ads@apexdigital.com · read-only</div>
          </div>
        </div>
      ) : (
        <button
          className="su-google-btn"
          onClick={handleConnect}
          disabled={connecting}
          style={{ marginBottom: 12, opacity: connecting ? 0.7 : 1 }}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <rect width="20" height="20" rx="4" fill="#4285F4" />
            <path d="M15.5 10.18c0-.56-.05-1.1-.14-1.62H10v3.06h3.04a2.6 2.6 0 01-1.13 1.71v1.42h1.83c1.07-.98 1.76-2.42 1.76-4.57z" fill="#fff" />
            <path d="M10 16c1.52 0 2.8-.5 3.73-1.36l-1.83-1.42c-.5.34-1.15.54-1.9.54-1.46 0-2.7-.99-3.14-2.31H5v1.46A6 6 0 0010 16z" fill="#fff" />
            <path d="M6.86 11.45A3.6 3.6 0 016.68 10c0-.5.09-.98.18-1.45V7.09H5A6 6 0 004 10c0 .97.23 1.88.6 2.7l1.86-1.25z" fill="#fff" />
            <path d="M10 6.24c.82 0 1.56.28 2.14.84l1.6-1.6A5.98 5.98 0 0010 4 6 6 0 005 7.09l1.86 1.46C7.3 7.23 8.54 6.24 10 6.24z" fill="#fff" />
          </svg>
          {connecting ? 'Connecting…' : 'Connect Google Ads account'}
        </button>
      )}

      <button className="su-btn-primary" onClick={onNext} disabled={!connected}>
        {connected ? 'Generate my first report →' : 'Finish setup →'}
      </button>

      <p style={{ textAlign: 'center', marginTop: 12 }}>
        <button onClick={onNext} style={{ ...F.sans, fontSize: 13, color: C.muted, background: 'none', border: 'none', cursor: 'pointer', padding: 0, textDecoration: 'underline' }}>
          Skip for now — connect later
        </button>
      </p>
    </div>
  )
}

/* ─────────── Step 3: Success ─────────── */

function Step3({ email }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ width: 72, height: 72, borderRadius: '50%', background: `${C.positive}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
          <circle cx="18" cy="18" r="17" fill={C.positive} />
          <path d="M10 18l5.5 5.5L26 12" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <h1 style={{ ...F.sans, fontSize: 28, fontWeight: 800, letterSpacing: '-0.025em', marginBottom: 8 }}>You're all set!</h1>
      <p style={{ ...F.sans, fontSize: 15, color: C.muted, lineHeight: 1.65, marginBottom: 8 }}>
        Check <strong>{email || 'your email'}</strong> for a sign-in link.<br />
        Your account is ready — first report in under 60 seconds.
      </p>
      <p style={{ ...F.sans, fontSize: 13, color: C.muted, marginBottom: 32, lineHeight: 1.5 }}>
        Reports are emailed directly to your clients automatically — and a shareable web link is always available too.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <Link to="/sample-reports" style={{
          display: 'block', width: '100%', padding: '13px', borderRadius: 9,
          border: `1.5px solid ${C.border}`, background: '#fff', color: C.dark,
          ...F.sans, fontSize: 15, fontWeight: 600, textDecoration: 'none',
        }}>
          See sample reports while you wait
        </Link>
      </div>

      <div style={{ marginTop: 32, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
        {[
          { icon: '🤖', label: 'AI generates in real-time' },
          { icon: '📧', label: 'Auto-emailed to clients' },
          { icon: '🔒', label: 'Read-only Google access' },
        ].map(({ icon, label }) => (
          <div key={label} style={{ background: C.bgAlt, borderRadius: 10, padding: '14px 12px', textAlign: 'center' }}>
            <div style={{ fontSize: 20, marginBottom: 6 }}>{icon}</div>
            <div style={{ ...F.sans, fontSize: 12, color: C.muted, lineHeight: 1.4 }}>{label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ─────────── Page ─────────── */

export default function SignUpPage() {
  const [step, setStep] = useState(0)
  const [data, setData] = useState({ firstName: '', lastName: '', agency: '', email: '' })

  return (
    <div style={{ ...F.sans, minHeight: '100vh', display: 'flex', flexDirection: 'column', WebkitFontSmoothing: 'antialiased' }}>
      <style>{PAGE_CSS}</style>

      {/* Nav */}
      <nav style={{ padding: '0 32px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: `1px solid ${C.border}`, background: '#fff', flexShrink: 0 }}>
        <Logo />
        <span style={{ ...F.sans, fontSize: 14, color: C.muted }}>
          Already have an account?{' '}
          <Link to="/sign-in" style={{ color: C.navy, fontWeight: 600, textDecoration: 'none' }}>Sign in</Link>
        </span>
      </nav>

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 24px' }}>
        <div style={{ width: '100%', maxWidth: 460 }}>
          {/* Step indicator */}
          {step < 2 && (
            <div style={{ marginBottom: 32 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <StepIndicator current={step} />
                <span style={{ ...F.sans, fontSize: 12, color: C.muted }}>Step {step + 1} of 3</span>
              </div>
              <div style={{ ...F.sans, fontSize: 12, fontWeight: 600, color: C.muted }}>{STEPS[step]}</div>
            </div>
          )}

          {/* Card */}
          <div style={{ background: '#fff', borderRadius: 16, border: `1px solid ${C.border}`, padding: '36px', boxShadow: '0 4px 24px rgba(15,31,61,0.06)' }}>
            {step === 0 && <Step1 data={data} setData={setData} onNext={() => setStep(1)} />}
            {step === 1 && <Step2 onNext={() => setStep(2)} />}
            {step === 2 && <Step3 email={data.email} />}
          </div>

          {step === 0 && (
            <p style={{ ...F.sans, textAlign: 'center', fontSize: 13, color: '#94A3B8', marginTop: 20 }}>
              🔒 Your data is encrypted. Read-only Google Ads access only.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
