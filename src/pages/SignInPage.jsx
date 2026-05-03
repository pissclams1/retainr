import { useState } from 'react'
import { Link } from 'react-router-dom'
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
  html, body { background: #fff; }
  * { box-sizing: border-box; }
  .si-input {
    width: 100%; padding: 11px 14px;
    border-radius: 9px; border: 1.5px solid ${T.border};
    background: #fff; font-family: ${T.font};
    font-size: 14px; color: ${T.text}; outline: none;
    transition: border-color 0.15s, box-shadow 0.15s;
  }
  .si-input:focus { border-color: ${T.navy}; box-shadow: 0 0 0 3px rgba(4,37,108,0.08); }
  .si-btn {
    width: 100%; padding: 13px; border-radius: 10px; border: none;
    background: ${T.navy}; color: #fff;
    font-family: ${T.font}; font-size: 15px; font-weight: 700;
    cursor: pointer; transition: opacity 0.15s;
    box-shadow: 0 3px 12px rgba(4,37,108,0.28);
  }
  .si-btn:hover:not(:disabled) { opacity: 0.91; }
  .si-btn:disabled { opacity: 0.5; cursor: not-allowed; }
`

function Logo({ size = 24 }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
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

export default function SignInPage() {
  const [email, setEmail]     = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)
  const [sent, setSent]       = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!email.trim()) return
    setError(null)
    setLoading(true)
    const { error: err } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: { emailRedirectTo: `${window.location.origin}/inspect` },
    })
    setLoading(false)
    if (err) { setError(err.message) } else { setSent(true) }
  }

  return (
    <div style={{ fontFamily: T.font, minHeight: '100vh', display: 'flex', flexDirection: 'column', WebkitFontSmoothing: 'antialiased' }}>
      <style>{PAGE_CSS}</style>

      {/* Top nav */}
      <nav style={{ height: 64, background: '#fff', borderBottom: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', padding: '0 32px', justifyContent: 'space-between', flexShrink: 0 }}>
        <Link to="/" style={{ textDecoration: 'none' }}><Logo size={24} /></Link>
        <span style={{ fontSize: 14, color: T.muted }}>
          Don't have an account?{' '}
          <Link to="/sign-up" style={{ fontSize: 14, fontWeight: 700, color: T.navy, textDecoration: 'none', marginLeft: 4 }}>Start free trial</Link>
        </span>
      </nav>

      {/* Body */}
      <div style={{ flex: 1, display: 'flex' }}>

        {/* Left form panel */}
        <div style={{ flex: '0 0 480px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 56px', background: '#fff' }}>
          {sent ? (
            <div style={{ width: '100%', maxWidth: 340, textAlign: 'center' }}>
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
              <button onClick={() => { setSent(false); setEmail('') }} style={{ fontFamily: T.font, fontSize: 13, color: T.navy, background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontWeight: 600 }}>
                Use a different email
              </button>
            </div>
          ) : (
            <div style={{ width: '100%', maxWidth: 340 }}>
              <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-0.03em', color: T.text, margin: '0 0 6px' }}>Welcome back</h1>
              <p style={{ fontSize: 14, color: T.muted, margin: '0 0 32px' }}>Sign in to your BindIQ account</p>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: T.text, display: 'block', marginBottom: 6 }}>Work email</label>
                  <input
                    className="si-input"
                    type="email"
                    placeholder="you@agency.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    autoFocus
                    required
                  />
                </div>

                {error && (
                  <div style={{ fontSize: 13, color: T.red, background: 'rgba(220,38,38,0.06)', border: '1px solid rgba(220,38,38,0.20)', borderRadius: 8, padding: '10px 14px' }}>
                    {error}
                  </div>
                )}

                <button type="submit" className="si-btn" disabled={loading || !email.trim()}>
                  {loading ? 'Sending…' : 'Send sign-in link'}
                </button>
              </form>

              <p style={{ fontSize: 13, color: T.muted, textAlign: 'center', marginTop: 16 }}>
                Don't have an account?{' '}
                <Link to="/sign-up" style={{ fontSize: 13, fontWeight: 600, color: T.navy, textDecoration: 'none' }}>Start free trial</Link>
              </p>
            </div>
          )}
        </div>

        {/* Right dark panel */}
        <div style={{ flex: 1, background: T.navy2, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 48px', position: 'relative', overflow: 'hidden' }}>
          {/* Decorative circles */}
          <div style={{ position: 'absolute', top: -100, right: -100, width: 400, height: 400, borderRadius: '50%', background: 'rgba(255,255,255,0.03)' }} />
          <div style={{ position: 'absolute', bottom: -150, left: -80, width: 480, height: 480, borderRadius: '50%', background: 'rgba(255,255,255,0.025)' }} />

          <div style={{ maxWidth: 380, position: 'relative', zIndex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: 28 }}>
              Why agents use BindIQ
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 24, marginBottom: 36 }}>
              {[
                { val: '3+', desc: 'hours saved per week on quotes that wouldn\'t bind anyway' },
                { val: '<60s', desc: 'from upload to underwriting decision on any report' },
                { val: '87%', desc: 'of critical underwriting issues flagged before submission' },
              ].map(item => (
                <div key={item.val} style={{ display: 'flex', gap: 18, alignItems: 'flex-start' }}>
                  <div style={{ fontSize: 28, fontWeight: 800, color: '#fff', letterSpacing: '-0.03em', minWidth: 72, lineHeight: 1 }}>{item.val}</div>
                  <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', lineHeight: 1.6, paddingTop: 4 }}>{item.desc}</div>
                </div>
              ))}
            </div>

            {/* Testimonial */}
            <div style={{ padding: '20px 24px', background: 'rgba(255,255,255,0.07)', borderRadius: 14, border: '1px solid rgba(255,255,255,0.1)' }}>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.78)', lineHeight: 1.65, fontStyle: 'italic', margin: '0 0 14px' }}>
                "BindIQ paid for itself the first week. Caught a Federal Pacific panel before I wasted two hours submitting."
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'rgba(255,255,255,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: '#fff' }}>MR</div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>Mike R.</div>
                  <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>Independent Agent · Tampa, FL</div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
