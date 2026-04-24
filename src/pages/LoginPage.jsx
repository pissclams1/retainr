import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'

export default function LoginPage() {
  const { session, loading } = useAuth()
  const [email, setEmail]   = useState('')
  const [sending, setSending] = useState(false)
  const [sent, setSent]     = useState(false)
  const [error, setError]   = useState(null)

  if (!loading && session) return <Navigate to="/dashboard" replace />

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSending(true)
    setError(null)

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${import.meta.env.VITE_APP_URL ?? window.location.origin}/dashboard` },
    })

    if (error) setError(error.message)
    else setSent(true)

    setSending(false)
  }

  const inputStyle = {
    width: '100%',
    height: '42px',
    background: 'var(--hero-surface)',
    border: '1px solid var(--hero-border)',
    borderRadius: '7px',
    padding: '8px 14px',
    fontFamily: 'Geist, sans-serif',
    fontSize: '14px',
    color: 'var(--hero-text)',
    outline: 'none',
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--hero-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ width: '100%', maxWidth: '360px' }}>

        {/* Logo */}
        <p style={{ fontFamily: 'Instrument Serif, serif', fontSize: '26px', color: 'var(--hero-text)', letterSpacing: '-0.3px', marginBottom: '52px', textAlign: 'center' }}>
          retainr
        </p>

        {!sent ? (
          <>
            <h1 style={{ fontFamily: 'Instrument Serif, serif', fontSize: '28px', color: 'var(--hero-text)', lineHeight: 1.15, marginBottom: '8px' }}>
              Sign in
            </h1>
            <p style={{ fontFamily: 'Geist, sans-serif', fontSize: '14px', fontWeight: 300, color: 'var(--hero-muted)', lineHeight: 1.6, marginBottom: '32px' }}>
              Enter your email and we'll send a magic link. No password needed.
            </p>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontFamily: 'Geist, sans-serif', fontSize: '11px', fontWeight: 600, color: 'rgba(245,245,243,0.40)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '6px' }}>
                  Email address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@youragency.com"
                  required
                  style={inputStyle}
                  onFocus={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.20)' }}
                  onBlur={(e)  => { e.target.style.borderColor = 'var(--hero-border)' }}
                />
              </div>

              {error && (
                <p style={{ fontFamily: 'Geist, sans-serif', fontSize: '12px', color: '#F87171' }}>{error}</p>
              )}

              <button
                type="submit"
                disabled={sending || !email}
                style={{
                  width: '100%',
                  height: '42px',
                  marginTop: '4px',
                  background: 'var(--hero-text)',
                  color: 'var(--hero-bg)',
                  border: 'none',
                  borderRadius: '7px',
                  fontFamily: 'Geist, sans-serif',
                  fontSize: '13px',
                  fontWeight: 500,
                  cursor: (sending || !email) ? 'not-allowed' : 'pointer',
                  opacity: (sending || !email) ? 0.6 : 1,
                  transition: 'opacity 0.15s ease',
                }}
              >
                {sending ? 'Sending…' : 'Send magic link'}
              </button>
            </form>
          </>
        ) : (
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--hero-surface)', border: '1px solid var(--hero-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
              <span style={{ fontSize: '20px' }}>✉</span>
            </div>
            <h1 style={{ fontFamily: 'Instrument Serif, serif', fontSize: '28px', color: 'var(--hero-text)', lineHeight: 1.15, marginBottom: '12px' }}>
              Check your inbox
            </h1>
            <p style={{ fontFamily: 'Geist, sans-serif', fontSize: '14px', fontWeight: 300, color: 'var(--hero-muted)', lineHeight: 1.6, marginBottom: '32px' }}>
              Magic link sent to{' '}
              <span style={{ color: 'var(--hero-accent)', fontWeight: 400 }}>{email}</span>.
              <br />Click it to sign in — no password needed.
            </p>
            <button
              onClick={() => { setSent(false); setEmail('') }}
              style={{
                background: 'transparent',
                border: '1px solid var(--hero-border)',
                borderRadius: '7px',
                padding: '8px 16px',
                fontFamily: 'Geist, sans-serif',
                fontSize: '13px',
                fontWeight: 500,
                color: 'var(--hero-muted)',
                cursor: 'pointer',
              }}
            >
              Use a different email
            </button>
          </div>
        )}

        <p style={{ marginTop: '52px', textAlign: 'center', fontFamily: 'Geist, sans-serif', fontSize: '12px', color: 'var(--hero-muted)' }}>
          New agency?{' '}
          <a href="mailto:hello@retainr.io" style={{ color: 'var(--hero-accent)', textDecoration: 'none' }}>
            Get in touch
          </a>
        </p>
      </div>
    </div>
  )
}
