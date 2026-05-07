import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
)

const T = {
  navy:    '#04256C',
  navy2:   '#0F1F3D',
  red:     '#DC2626',
  green:   '#10B981',
  text:    '#0F1F3D',
  muted:   '#64748B',
  subtle:  '#94A3B8',
  border:  '#E2E8F0',
  surface: '#F8FAFC',
  font:    "'DM Sans', system-ui, sans-serif",
}

const PAGE_CSS = `
  html, body { background: ${T.surface}; }
  * { box-sizing: border-box; }
  .su-input {
    width: 100%; padding: 11px 14px;
    border-radius: 9px; border: 1.5px solid ${T.border};
    background: #fff; font-family: ${T.font};
    font-size: 14px; color: ${T.text}; outline: none;
    transition: border-color 0.15s, box-shadow 0.15s;
  }
  .su-input:focus { border-color: ${T.navy}; box-shadow: 0 0 0 3px rgba(4,37,108,0.08); }
  .su-btn {
    width: 100%; padding: 13px; border-radius: 10px; border: none;
    background: ${T.navy}; color: #fff;
    font-family: ${T.font}; font-size: 15px; font-weight: 700;
    cursor: pointer; margin-top: 4px;
    transition: opacity 0.15s;
    box-shadow: 0 3px 12px rgba(4,37,108,0.28);
  }
  .su-btn:hover:not(:disabled) { opacity: 0.91; }
  .su-btn:disabled { opacity: 0.5; cursor: not-allowed; }
`

function Logo({ size = 19 }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5, alignItems: 'flex-start' }}>
      <div style={{ fontSize: size, fontWeight: 800, letterSpacing: '-0.04em', color: T.navy2, lineHeight: 1 }}>
        Bind<span style={{ color: T.red }}>IQ</span>
      </div>
      <div style={{ display: 'flex', gap: 3 }}>
        <div style={{ height: 3, width: 28, borderRadius: 2, background: 'rgba(15,31,61,0.18)' }} />
        <div style={{ height: 3, width: 10, borderRadius: 2, background: T.red }} />
      </div>
    </div>
  )
}

export default function SignUpPage() {
  const [params] = useSearchParams()
  const redirect = params.get('redirect') || '/inspect'

  const [step, setStep]       = useState('form')
  const [firstName, setFirstName] = useState('')
  const [email, setEmail]     = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!email.trim()) return
    setError(null)
    setLoading(true)

    // Save first name before sending OTP
    if (firstName.trim()) {
      try { localStorage.setItem('bindiq_name', firstName.trim()) } catch {}
    }

    const { error: err } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: { emailRedirectTo: `${window.location.origin}${redirect}` },
    })

    setLoading(false)
    if (err) { setError(err.message) } else { setStep('sent') }
  }

  return (
    <div style={{ fontFamily: T.font, minHeight: '100vh', background: T.surface, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '56px 24px 80px', WebkitFontSmoothing: 'antialiased' }}>
      <style>{PAGE_CSS}</style>

      <Link to="/" style={{ textDecoration: 'none', marginBottom: 40 }}>
        <Logo size={19} />
      </Link>

      <div style={{ width: '100%', maxWidth: 400 }}>
        <div style={{ background: '#fff', border: `1px solid ${T.border}`, borderRadius: 18, padding: '36px 32px', boxShadow: '0 4px 24px rgba(15,31,61,0.05)' }}>

          {step === 'form' ? (
            <>
              <h1 style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-0.025em', color: T.text, margin: '0 0 6px' }}>
                Create your account
              </h1>
              <p style={{ fontSize: 14, color: T.muted, margin: '0 0 28px' }}>
                14-day free trial · No credit card required
              </p>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: T.text, display: 'block', marginBottom: 6 }}>First name</label>
                  <input
                    className="su-input"
                    type="text"
                    placeholder="Jane"
                    value={firstName}
                    onChange={e => setFirstName(e.target.value)}
                    autoFocus
                  />
                </div>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: T.text, display: 'block', marginBottom: 6 }}>Work email</label>
                  <input
                    className="su-input"
                    type="email"
                    placeholder="jane@yourinsuranceagency.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                  />
                </div>

                {error && (
                  <div style={{ fontSize: 13, color: T.red, background: 'rgba(220,38,38,0.06)', border: '1px solid rgba(220,38,38,0.20)', borderRadius: 8, padding: '10px 14px' }}>
                    {error}
                  </div>
                )}

                <button type="submit" className="su-btn" disabled={loading || !email.trim()}>
                  {loading ? 'Sending…' : 'Continue →'}
                </button>
              </form>

              <p style={{ fontSize: 13, color: T.subtle, textAlign: 'center', marginTop: 16, lineHeight: 1.6 }}>
                By continuing you agree to our{' '}
                <Link to="/terms" style={{ color: T.navy, textDecoration: 'none' }}>Terms</Link>
                {' '}and{' '}
                <Link to="/privacy" style={{ color: T.navy, textDecoration: 'none' }}>Privacy Policy</Link>
              </p>
            </>
          ) : (
            <div style={{ textAlign: 'center' }}>
              <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(16,185,129,0.12)', border: '1.5px solid rgba(16,185,129,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M20 4H4C2.9 4 2 4.9 2 6v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2z" stroke={T.green} strokeWidth="1.5" strokeLinejoin="round"/>
                  <path d="M2 6l10 7 10-7" stroke={T.green} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h2 style={{ fontSize: 22, fontWeight: 800, color: T.text, margin: '0 0 8px', letterSpacing: '-0.025em' }}>Check your email</h2>
              <p style={{ fontSize: 14, color: T.muted, margin: '0 0 6px', lineHeight: 1.6 }}>We sent a sign-in link to</p>
              <p style={{ fontSize: 15, fontWeight: 600, color: T.text, margin: '0 0 20px' }}>{email}</p>
              <p style={{ fontSize: 13, color: T.muted, lineHeight: 1.6, margin: '0 0 20px' }}>
                Click the link to continue — no password needed.<br />
                Check your spam folder if you don't see it.
              </p>
              <button onClick={() => { setStep('form'); setEmail(''); setFirstName('') }} style={{ fontFamily: T.font, fontSize: 13, color: T.navy, background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontWeight: 600 }}>
                Use a different email
              </button>
            </div>
          )}
        </div>

        <p style={{ fontSize: 13, color: T.muted, textAlign: 'center', marginTop: 20 }}>
          Already have an account?{' '}
          <Link to="/sign-in" style={{ fontSize: 13, fontWeight: 700, color: T.navy, textDecoration: 'none', marginLeft: 4 }}>Sign in</Link>
        </p>
      </div>
    </div>
  )
}
