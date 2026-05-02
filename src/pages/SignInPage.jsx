import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import Logo from '../components/Logo'

const F = { sans: { fontFamily: "'DM Sans', system-ui, -apple-system, sans-serif" } }
const C = { navy: '#04256c', dark: '#0F1F3D', muted: '#64748B', border: '#E2E8F0' }

const PAGE_CSS = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { height: 100%; }
  .si-input { width: 100%; padding: 11px 14px; border-radius: 9px; border: 1.5px solid ${C.border}; background: #fff; font-size: 14px; color: ${C.dark}; outline: none; transition: border-color 0.15s; font-family: 'DM Sans', sans-serif; }
  .si-input:focus { border-color: ${C.navy}; }
  .si-submit-btn { width: 100%; padding: 13px; border-radius: 9px; border: none; background: ${C.navy}; color: #fff; font-size: 15px; font-weight: 700; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: opacity 0.15s; }
  .si-submit-btn:hover { opacity: 0.9; }
  .si-submit-btn:disabled { opacity: 0.55; cursor: default; }
`

export default function SignInPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error: err } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/inspect` },
    })
    setLoading(false)
    if (err) { setError(err.message) } else { setSent(true) }
  }

  return (
    <div style={{ ...F.sans, minHeight: '100vh', display: 'flex', flexDirection: 'column', WebkitFontSmoothing: 'antialiased' }}>
      <style>{PAGE_CSS}</style>

      {/* Nav */}
      <nav style={{ padding: '0 32px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: `1px solid ${C.border}`, background: '#fff', flexShrink: 0 }}>
        <Logo />
        <span style={{ ...F.sans, fontSize: 14, color: C.muted }}>
          No account?{' '}
          <Link to="/sign-up" style={{ color: C.navy, fontWeight: 600, textDecoration: 'none' }}>Start free →</Link>
        </span>
      </nav>

      {/* Body */}
      <div style={{ flex: 1, display: 'flex' }}>

        {/* Left — form */}
        <div style={{ flex: '0 0 480px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 48px', background: '#fff' }}>
          <div style={{ width: '100%', maxWidth: 360 }}>

            {sent ? (
              <div style={{ textAlign: 'center' }}>
                <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#10B98115', border: '1.5px solid rgba(16,185,129,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                    <path d="M4 14l7 7L24 7" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <h2 style={{ ...F.sans, fontSize: 22, fontWeight: 800, color: C.dark, marginBottom: 10 }}>Check your email</h2>
                <p style={{ ...F.sans, fontSize: 14, color: C.muted, lineHeight: 1.7, marginBottom: 6 }}>
                  We sent a sign-in link to
                </p>
                <p style={{ ...F.sans, fontSize: 15, fontWeight: 600, color: C.dark, marginBottom: 20 }}>{email}</p>
                <p style={{ ...F.sans, fontSize: 13, color: C.muted, lineHeight: 1.6 }}>
                  Click the link to sign in — no password needed.<br />
                  Check your spam folder if you don't see it.
                </p>
                <button
                  onClick={() => { setSent(false); setEmail('') }}
                  style={{ ...F.sans, marginTop: 20, fontSize: 13, color: C.navy, background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}
                >
                  Use a different email
                </button>
              </div>
            ) : (
              <>
                <h1 style={{ ...F.sans, fontSize: 26, fontWeight: 800, letterSpacing: '-0.025em', color: C.dark, marginBottom: 6 }}>Sign in</h1>
                <p style={{ ...F.sans, fontSize: 14, color: C.muted, marginBottom: 28 }}>
                  For existing BindIQ subscribers.
                </p>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <label style={{ ...F.sans, fontSize: 13, fontWeight: 600, color: C.dark }}>Email</label>
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

                  {error && <p style={{ ...F.sans, fontSize: 13, color: '#EF4444', lineHeight: 1.5 }}>{error}</p>}

                  <button type="submit" className="si-submit-btn" disabled={loading || !email.trim()}>
                    {loading ? 'Sending…' : 'Send sign-in link →'}
                  </button>
                </form>

                <div style={{ borderTop: `1px solid ${C.border}`, marginTop: 24, paddingTop: 20 }}>
                  <p style={{ ...F.sans, fontSize: 13, color: C.muted, margin: '0 0 6px' }}>
                    <strong style={{ color: C.dark }}>New to BindIQ?</strong> Try 3 reports free — no account needed.
                  </p>
                  <Link to="/inspect" style={{ ...F.sans, fontSize: 13, color: C.navy, fontWeight: 600, textDecoration: 'none' }}>
                    Try it free →
                  </Link>
                  <span style={{ ...F.sans, fontSize: 13, color: C.muted, margin: '0 8px' }}>·</span>
                  <Link to="/sign-up" style={{ ...F.sans, fontSize: 13, color: C.navy, fontWeight: 600, textDecoration: 'none' }}>
                    Create account →
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Right — brand panel */}
        <div style={{
          flex: 1, background: `linear-gradient(135deg, ${C.navy} 0%, #0a3a8f 100%)`,
          display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
          padding: '60px 48px', position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', top: -80, right: -80, width: 320, height: 320, borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />
          <div style={{ position: 'absolute', bottom: -120, left: -60, width: 400, height: 400, borderRadius: '50%', background: 'rgba(255,255,255,0.03)' }} />

          <div style={{ maxWidth: 420, position: 'relative', zIndex: 1 }}>
            <div style={{ ...F.sans, fontSize: 13, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)', marginBottom: 20 }}>
              Why agents use BindIQ
            </div>

            {[
              { stat: '~30s', desc: 'typical time to score any inspection report' },
              { stat: '8+', desc: 'underwriting flags detected automatically' },
              { stat: 'FL', desc: 'purpose-built for Florida — more states coming' },
            ].map(({ stat, desc }) => (
              <div key={stat} style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 28 }}>
                <div style={{ ...F.sans, fontSize: 32, fontWeight: 800, color: '#fff', letterSpacing: '-0.03em', minWidth: 80 }}>{stat}</div>
                <div style={{ ...F.sans, fontSize: 15, color: 'rgba(255,255,255,0.65)', lineHeight: 1.5 }}>{desc}</div>
              </div>
            ))}

            <div style={{ marginTop: 12, padding: '20px 24px', background: 'rgba(255,255,255,0.08)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.12)' }}>
              <p style={{ ...F.sans, fontSize: 14, color: 'rgba(255,255,255,0.8)', lineHeight: 1.65, fontStyle: 'italic', marginBottom: 14 }}>
                "BindIQ caught a Federal Pacific panel on a submission I almost quoted. Saved me the carrier call and the client embarrassment."
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', ...F.sans, fontSize: 12, fontWeight: 700, color: '#fff' }}>SK</div>
                <div>
                  <div style={{ ...F.sans, fontSize: 13, fontWeight: 700, color: '#fff' }}>Sarah K.</div>
                  <div style={{ ...F.sans, fontSize: 12, color: 'rgba(255,255,255,0.45)' }}>Independent P&C Agent · Florida</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
