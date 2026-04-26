import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error: err } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/onboarding` },
    })
    setLoading(false)
    if (err) {
      setError(err.message)
    } else {
      setSent(true)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0F0F0E',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      fontFamily: "'Geist', sans-serif",
    }}>

      {/* Logo */}
      <a href="/" style={{
        fontFamily: "'Instrument Serif', serif",
        fontSize: 22,
        color: '#F5F5F3',
        letterSpacing: '-0.3px',
        textDecoration: 'none',
        marginBottom: 48,
        display: 'block',
      }}>
        retainr
      </a>

      {/* Card */}
      <div style={{
        width: '100%',
        maxWidth: 360,
        background: '#1A1A18',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 14,
        padding: 32,
      }}>

        {sent ? (
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: 48, height: 48, borderRadius: '50%',
              background: 'rgba(45,106,39,0.15)',
              border: '1px solid rgba(45,106,39,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 20px',
              fontSize: 20,
            }}>
              ✓
            </div>
            <h2 style={{
              fontFamily: "'Instrument Serif', serif",
              fontSize: 24, fontWeight: 400,
              color: '#F5F5F3', marginBottom: 10,
            }}>
              Check your email
            </h2>
            <p style={{
              fontSize: 14, fontWeight: 300,
              color: 'rgba(245,245,243,0.50)',
              lineHeight: 1.6,
            }}>
              We sent a magic link to <strong style={{ color: 'rgba(245,245,243,0.75)', fontWeight: 500 }}>{email}</strong>.
              Click it to sign in — no password needed.
            </p>
          </div>
        ) : (
          <>
            <h1 style={{
              fontFamily: "'Instrument Serif', serif",
              fontSize: 28, fontWeight: 400,
              color: '#F5F5F3', marginBottom: 8,
            }}>
              Sign in
            </h1>
            <p style={{
              fontSize: 14, fontWeight: 300,
              color: 'rgba(245,245,243,0.50)',
              lineHeight: 1.6, marginBottom: 28,
            }}>
              Enter your email and we'll send a magic link. First time? Your account is created automatically.
            </p>

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: 16 }}>
                <label style={{
                  fontFamily: "'Geist', sans-serif",
                  fontSize: 11, fontWeight: 600,
                  textTransform: 'uppercase', letterSpacing: '0.12em',
                  color: 'rgba(245,245,243,0.50)',
                  display: 'block', marginBottom: 6,
                }}>
                  Email address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@youragency.com"
                  required
                  style={{
                    width: '100%',
                    height: 40,
                    background: '#0F0F0E',
                    border: error
                      ? '1px solid rgba(184,58,42,0.6)'
                      : '1px solid rgba(255,255,255,0.12)',
                    borderRadius: 7,
                    padding: '0 12px',
                    fontFamily: "'Geist', sans-serif",
                    fontSize: 13,
                    color: '#F5F5F3',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'rgba(255,255,255,0.30)'
                    e.target.style.boxShadow = '0 0 0 3px rgba(255,255,255,0.04)'
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = error
                      ? 'rgba(184,58,42,0.6)'
                      : 'rgba(255,255,255,0.12)'
                    e.target.style.boxShadow = 'none'
                  }}
                />
                {error && (
                  <p style={{
                    fontFamily: "'Geist', sans-serif",
                    fontSize: 11, color: '#B83A2A',
                    marginTop: 6,
                  }}>
                    {error}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading || !email}
                style={{
                  width: '100%',
                  height: 40,
                  background: loading || !email
                    ? 'rgba(245,245,243,0.25)'
                    : '#F5F5F3',
                  color: loading || !email ? 'rgba(15,15,14,0.4)' : '#0F0F0E',
                  border: 'none',
                  borderRadius: 7,
                  fontFamily: "'Geist', sans-serif",
                  fontSize: 13, fontWeight: 500,
                  cursor: loading || !email ? 'not-allowed' : 'pointer',
                  transition: 'opacity 0.15s',
                }}
              >
                {loading ? 'Sending…' : 'Send magic link'}
              </button>
            </form>
          </>
        )}
      </div>

      {/* Footer */}
      <p style={{
        marginTop: 32,
        fontFamily: "'Geist', sans-serif",
        fontSize: 12, fontWeight: 300,
        color: 'rgba(245,245,243,0.28)',
        textAlign: 'center',
      }}>
        By continuing you agree to our{' '}
        <a href="/terms" style={{ color: 'rgba(245,245,243,0.45)', textDecoration: 'none' }}>terms</a>
        {' '}and{' '}
        <a href="/privacy" style={{ color: 'rgba(245,245,243,0.45)', textDecoration: 'none' }}>privacy policy</a>
      </p>

    </div>
  )
}
