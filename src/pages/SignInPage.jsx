import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

const F = { sans: { fontFamily: "'DM Sans', system-ui, -apple-system, sans-serif" } }
const C = { navy: '#04256c', dark: '#0F1F3D', muted: '#64748B', border: '#E2E8F0' }

const PAGE_CSS = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { height: 100%; }
  .si-input { width: 100%; padding: 11px 14px; border-radius: 9px; border: 1.5px solid ${C.border}; background: #fff; font-size: 14px; color: ${C.dark}; outline: none; transition: border-color 0.15s; font-family: 'DM Sans', sans-serif; }
  .si-input:focus { border-color: ${C.navy}; }
  .si-google-btn { width: 100%; padding: 11px 16px; border-radius: 9px; border: 1.5px solid ${C.border}; background: #fff; display: flex; align-items: center; justify-content: center; gap: 10px; font-size: 14px; font-weight: 600; color: ${C.dark}; cursor: pointer; transition: border-color 0.15s, box-shadow 0.15s; font-family: 'DM Sans', sans-serif; }
  .si-google-btn:hover { border-color: #94A3B8; box-shadow: 0 2px 8px rgba(0,0,0,0.06); }
  .si-submit-btn { width: 100%; padding: 13px; border-radius: 9px; border: none; background: ${C.navy}; color: #fff; font-size: 15px; font-weight: 700; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: opacity 0.15s; }
  .si-submit-btn:hover { opacity: 0.9; }
  .si-submit-btn:disabled { opacity: 0.55; cursor: default; }
`

export default function SignInPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mode, setMode] = useState('magic') // 'magic' | 'password'
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  async function handleMagicLink(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error: err } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/onboarding` },
    })
    setLoading(false)
    if (err) { setError(err.message) } else { setSent(true) }
  }

  async function handlePassword(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error: err } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (err) { setError(err.message) } else { navigate('/dashboard') }
  }

  return (
    <div style={{ ...F.sans, minHeight: '100vh', display: 'flex', flexDirection: 'column', WebkitFontSmoothing: 'antialiased' }}>
      <style>{PAGE_CSS}</style>

      {/* Nav */}
      <nav style={{ padding: '0 32px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: `1px solid ${C.border}`, background: '#fff', flexShrink: 0 }}>
        <Link to="/" style={{ ...F.sans, fontSize: 18, fontWeight: 800, letterSpacing: '-0.02em', color: C.dark, textDecoration: 'none' }}>retainr</Link>
        <span style={{ ...F.sans, fontSize: 14, color: C.muted }}>
          Don't have an account?{' '}
          <Link to="/sign-up" style={{ color: C.navy, fontWeight: 600, textDecoration: 'none' }}>Start free trial</Link>
        </span>
      </nav>

      {/* Body */}
      <div style={{ flex: 1, display: 'flex' }}>

        {/* Left — form */}
        <div style={{ flex: '0 0 480px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 48px', background: '#fff' }}>
          <div style={{ width: '100%', maxWidth: 360 }}>

            {sent ? (
              <div style={{ textAlign: 'center' }}>
                <div style={{ width: 60, height: 60, borderRadius: '50%', background: '#10B98115', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                    <path d="M6 14l5.5 5.5L22 8" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <h2 style={{ ...F.sans, fontSize: 22, fontWeight: 800, marginBottom: 8 }}>Check your email</h2>
                <p style={{ ...F.sans, fontSize: 14, color: C.muted, lineHeight: 1.65 }}>
                  We sent a sign-in link to <strong>{email}</strong>.<br />Click it to continue — no password needed.
                </p>
              </div>
            ) : (
              <>
                <h1 style={{ ...F.sans, fontSize: 26, fontWeight: 800, letterSpacing: '-0.025em', marginBottom: 6 }}>Welcome back</h1>
                <p style={{ ...F.sans, fontSize: 14, color: C.muted, marginBottom: 32 }}>Sign in to your retainr account</p>

                {/* Google SSO — placeholder, triggers magic link fallback */}
                <button
                  className="si-google-btn"
                  onClick={() => setMode('magic')}
                  style={{ marginBottom: 20 }}
                >
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4" />
                    <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853" />
                    <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05" />
                    <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335" />
                  </svg>
                  Continue with Google
                </button>

                {/* Divider */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                  <div style={{ flex: 1, height: 1, background: C.border }} />
                  <span style={{ ...F.sans, fontSize: 12, color: '#CBD5E1', fontWeight: 500 }}>or</span>
                  <div style={{ flex: 1, height: 1, background: C.border }} />
                </div>

                <form onSubmit={mode === 'magic' ? handleMagicLink : handlePassword} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <label style={{ ...F.sans, fontSize: 13, fontWeight: 600, color: C.dark }}>Work email</label>
                    <input className="si-input" type="email" placeholder="you@agency.com" value={email} onChange={e => setEmail(e.target.value)} required />
                  </div>

                  {mode === 'password' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      <label style={{ ...F.sans, fontSize: 13, fontWeight: 600, color: C.dark }}>Password</label>
                      <input className="si-input" type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required />
                      <div style={{ textAlign: 'right', marginTop: -2 }}>
                        <a href="#" style={{ ...F.sans, fontSize: 13, color: C.navy, fontWeight: 500, textDecoration: 'none' }}>Forgot password?</a>
                      </div>
                    </div>
                  )}

                  {error && <p style={{ ...F.sans, fontSize: 13, color: '#EF4444', lineHeight: 1.5 }}>{error}</p>}

                  <button type="submit" className="si-submit-btn" disabled={loading}>
                    {loading ? 'Signing in…' : mode === 'magic' ? 'Send sign-in link' : 'Sign in'}
                  </button>
                </form>

                <p style={{ ...F.sans, textAlign: 'center', fontSize: 13, color: C.muted, marginTop: 16 }}>
                  {mode === 'magic' ? (
                    <>Prefer a password?{' '}
                      <button onClick={() => setMode('password')} style={{ ...F.sans, fontSize: 13, color: C.navy, fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                        Use email + password
                      </button>
                    </>
                  ) : (
                    <>Prefer a magic link?{' '}
                      <button onClick={() => setMode('magic')} style={{ ...F.sans, fontSize: 13, color: C.navy, fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                        Send me a link
                      </button>
                    </>
                  )}
                </p>

                <p style={{ ...F.sans, textAlign: 'center', fontSize: 13, color: C.muted, marginTop: 12 }}>
                  Don't have an account?{' '}
                  <Link to="/sign-up" style={{ color: C.navy, fontWeight: 600, textDecoration: 'none' }}>Start free trial</Link>
                </p>
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
          {/* Decorative circles */}
          <div style={{ position: 'absolute', top: -80, right: -80, width: 320, height: 320, borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />
          <div style={{ position: 'absolute', bottom: -120, left: -60, width: 400, height: 400, borderRadius: '50%', background: 'rgba(255,255,255,0.03)' }} />

          <div style={{ maxWidth: 420, position: 'relative', zIndex: 1 }}>
            <div style={{ ...F.sans, fontSize: 13, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)', marginBottom: 20 }}>
              Why agencies use retainr
            </div>

            {[
              { stat: '22%', desc: 'average improvement in client retention in year 1' },
              { stat: '4.8 hrs', desc: 'saved per client account every month' },
              { stat: '47 sec', desc: 'average time to generate a complete AI report' },
            ].map(({ stat, desc }) => (
              <div key={stat} style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 28 }}>
                <div style={{ ...F.sans, fontSize: 32, fontWeight: 800, color: '#fff', letterSpacing: '-0.03em', minWidth: 80 }}>{stat}</div>
                <div style={{ ...F.sans, fontSize: 15, color: 'rgba(255,255,255,0.65)', lineHeight: 1.5 }}>{desc}</div>
              </div>
            ))}

            {/* Testimonial */}
            <div style={{ marginTop: 12, padding: '20px 24px', background: 'rgba(255,255,255,0.08)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.12)' }}>
              <p style={{ ...F.sans, fontSize: 14, color: 'rgba(255,255,255,0.8)', lineHeight: 1.65, fontStyle: 'italic', marginBottom: 14 }}>
                "retainr turned our monthly reporting from a chore into a competitive advantage. Every junior AM sounds like a senior one now."
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', ...F.sans, fontSize: 12, fontWeight: 700, color: '#fff' }}>SK</div>
                <div>
                  <div style={{ ...F.sans, fontSize: 13, fontWeight: 700, color: '#fff' }}>Sarah K.</div>
                  <div style={{ ...F.sans, fontSize: 12, color: 'rgba(255,255,255,0.45)' }}>Head of PPC · Apex Digital</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
