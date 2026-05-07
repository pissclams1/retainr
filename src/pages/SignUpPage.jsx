import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
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
  .su-input { width: 100%; padding: 12px 14px; border-radius: 9px; border: 1.5px solid ${C.border}; background: #fff; font-size: 15px; color: ${C.text}; outline: none; transition: border-color 0.15s; font-family: 'DM Sans', sans-serif; }
  .su-input:focus { border-color: ${C.accent}; }
  .su-btn { width: 100%; padding: 14px; border-radius: 10px; border: none; background: ${C.accent}; color: #fff; font-size: 15px; font-weight: 700; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: opacity 0.15s; box-shadow: 0 4px 14px rgba(4,37,108,0.28); }
  .su-btn:hover:not(:disabled) { opacity: 0.92; }
  .su-btn:disabled { background: ${C.border}; color: ${C.subtle}; cursor: default; box-shadow: none; }
`

export default function SignUpPage() {
  const [params] = useSearchParams()
  const redirect = params.get('redirect') || '/inspect'

  const [step, setStep] = useState('form')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!email.trim()) return
    setError(null)
    setLoading(true)

    try {
      const res = await fetch('https://sccdotqafhgihcbxctmp.supabase.co/functions/v1/request-magic-link', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim(),
          redirectTo: `${window.location.origin}${redirect}`,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error || 'Failed to send magic link')
        setLoading(false)
        return
      }

      setLoading(false)
      setStep('sent')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to send magic link')
      setLoading(false)
    }
  }

  return (
    <div style={{ ...F.sans, minHeight: '100vh', background: C.bg, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '48px 24px 80px', WebkitFontSmoothing: 'antialiased' }}>
      <style>{PAGE_CSS}</style>

      <Link to="/" style={{ ...F.sans, fontSize: 18, fontWeight: 800, color: C.text, textDecoration: 'none', marginBottom: 40, letterSpacing: '-0.02em' }}>
        Bind<span style={{ color: C.danger }}>IQ</span>
      </Link>

      <div style={{ width: '100%', maxWidth: 400 }}>
        <div style={{ background: C.bg2, borderRadius: 16, border: `1px solid ${C.border}`, padding: '36px 32px', boxShadow: '0 4px 24px rgba(15,31,61,0.06)' }}>

          {step === 'form' ? (
            <>
              <h1 style={{ ...F.sans, fontSize: 24, fontWeight: 800, color: C.text, letterSpacing: '-0.025em', margin: 0, marginBottom: 6 }}>
                Get started
              </h1>
              <p style={{ ...F.sans, fontSize: 14, color: C.muted, margin: '0 0 28px' }}>
                Enter your email — we'll send you a sign-in link.
              </p>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <input
                  className="su-input"
                  type="email"
                  placeholder="you@agency.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  autoFocus
                  required
                />

                {error && (
                  <div style={{ ...F.sans, fontSize: 13, color: C.danger, background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.20)', borderRadius: 8, padding: '10px 14px' }}>
                    {error}
                  </div>
                )}

                <button type="submit" className="su-btn" disabled={loading || !email.trim()}>
                  {loading ? 'Sending…' : 'Send sign-in link →'}
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
              <p style={{ ...F.sans, fontSize: 15, fontWeight: 600, color: C.text, margin: '0 0 20px' }}>
                {email}
              </p>
              <p style={{ ...F.sans, fontSize: 13, color: C.muted, lineHeight: 1.6, margin: '0 0 20px' }}>
                Click the link to continue — no password needed.<br />
                Check your spam folder if you don't see it.
              </p>
              <button
                onClick={() => { setStep('form'); setEmail('') }}
                style={{ ...F.sans, fontSize: 13, color: C.accent, background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontWeight: 600 }}
              >
                Use a different email
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
