import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
)

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
  .su-input { width: 100%; padding: 11px 14px; border-radius: 9px; border: 1.5px solid ${C.border}; background: #fff; font-size: 14px; color: ${C.text}; outline: none; transition: border-color 0.15s; font-family: 'DM Sans', sans-serif; }
  .su-input:focus { border-color: ${C.accent}; }
  .su-btn { width: 100%; padding: 14px; border-radius: 10px; border: none; background: ${C.accent}; color: #fff; font-size: 15px; font-weight: 700; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: opacity 0.15s; box-shadow: 0 4px 14px rgba(4,37,108,0.28); }
  .su-btn:hover:not(:disabled) { opacity: 0.92; }
  .su-btn:disabled { background: ${C.border}; color: ${C.subtle}; cursor: default; box-shadow: none; }
`

export default function SignUpPage() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const redirect = params.get('redirect') || '/checkout'

  const [step, setStep] = useState('form')   // 'form' | 'sent'
  const [form, setForm] = useState({ firstName: '', email: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.firstName.trim() || !form.email.trim()) return
    setError(null)
    setLoading(true)

    const { error: err } = await supabase.auth.signInWithOtp({
      email: form.email.trim(),
      options: {
        emailRedirectTo: `${window.location.origin}${redirect}`,
        data: { first_name: form.firstName.trim() },
      },
    })

    setLoading(false)
    if (err) {
      setError(err.message)
    } else {
      setStep('sent')
    }
  }

  return (
    <div style={{ ...F.sans, minHeight: '100vh', background: C.bg, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '48px 24px 80px', WebkitFontSmoothing: 'antialiased' }}>
      <style>{PAGE_CSS}</style>

      <Link to="/" style={{ ...F.sans, fontSize: 18, fontWeight: 800, color: C.text, textDecoration: 'none', marginBottom: 40, letterSpacing: '-0.02em' }}>
        BindIQ
      </Link>

      <div style={{ width: '100%', maxWidth: 420 }}>
        <div style={{ background: C.bg2, borderRadius: 16, border: `1px solid ${C.border}`, padding: '36px 32px', boxShadow: '0 4px 24px rgba(15,31,61,0.06)' }}>

          {step === 'form' ? (
            <>
              <h1 style={{ ...F.sans, fontSize: 24, fontWeight: 800, color: C.text, letterSpacing: '-0.025em', margin: 0, marginBottom: 6 }}>
                Create your account
              </h1>
              <p style={{ ...F.sans, fontSize: 14, color: C.muted, margin: '0 0 28px' }}>
                14-day free trial · No credit card required
              </p>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label style={{ ...F.sans, fontSize: 13, fontWeight: 600, color: C.text, display: 'block', marginBottom: 6 }}>First name</label>
                  <input
                    className="su-input"
                    placeholder="Jane"
                    value={form.firstName}
                    onChange={e => setForm({ ...form, firstName: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label style={{ ...F.sans, fontSize: 13, fontWeight: 600, color: C.text, display: 'block', marginBottom: 6 }}>Email</label>
                  <input
                    className="su-input"
                    type="email"
                    placeholder="jane@yourinsuranceagency.com"
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    required
                  />
                </div>

                {error && (
                  <div style={{ ...F.sans, fontSize: 13, color: C.danger, background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.20)', borderRadius: 8, padding: '10px 14px' }}>
                    {error}
                  </div>
                )}

                <button type="submit" className="su-btn" disabled={loading || !form.firstName.trim() || !form.email.trim()}>
                  {loading ? 'Sending link…' : 'Continue →'}
                </button>
              </form>

              <p style={{ ...F.sans, fontSize: 12, color: C.subtle, textAlign: 'center', marginTop: 16, lineHeight: 1.6 }}>
                By continuing you agree to our{' '}
                <Link to="/terms" style={{ color: C.accent, textDecoration: 'none' }}>Terms</Link>
                {' '}and{' '}
                <Link to="/privacy" style={{ color: C.accent, textDecoration: 'none' }}>Privacy Policy</Link>
              </p>
            </>
          ) : (
            /* Sent state */
            <div style={{ textAlign: 'center' }}>
              <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(16,185,129,0.12)', border: '1.5px solid rgba(16,185,129,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M20 4H4C2.9 4 2 4.9 2 6v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2z" stroke={C.positive} strokeWidth="1.5" strokeLinejoin="round"/>
                  <path d="M2 6l10 7 10-7" stroke={C.positive} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h2 style={{ ...F.sans, fontSize: 22, fontWeight: 800, color: C.text, margin: '0 0 8px', letterSpacing: '-0.025em' }}>
                Check your email
              </h2>
              <p style={{ ...F.sans, fontSize: 14, color: C.muted, margin: '0 0 6px', lineHeight: 1.6 }}>
                We sent a sign-in link to
              </p>
              <p style={{ ...F.sans, fontSize: 15, fontWeight: 600, color: C.text, margin: '0 0 24px' }}>
                {form.email}
              </p>
              <p style={{ ...F.sans, fontSize: 13, color: C.muted, lineHeight: 1.6, margin: '0 0 24px' }}>
                Click the link in the email to verify your account and continue to checkout. Check your spam folder if you don't see it.
              </p>
              <button
                onClick={() => setStep('form')}
                style={{ ...F.sans, fontSize: 13, color: C.accent, background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontWeight: 600 }}
              >
                Use a different email
              </button>
            </div>
          )}
        </div>

        <p style={{ ...F.sans, fontSize: 13, color: C.muted, textAlign: 'center', marginTop: 20 }}>
          Already have an account?{' '}
          <Link to="/sign-in" style={{ color: C.accent, fontWeight: 600, textDecoration: 'none' }}>Sign in</Link>
        </p>
      </div>
    </div>
  )
}
