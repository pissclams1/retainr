import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useSessionAuth } from '../hooks/useSessionAuth'

const F = { sans: { fontFamily: "'DM Sans', system-ui, -apple-system, sans-serif" } }
const C = {
  bg:     '#F8FAFC',
  bg2:    '#FFFFFF',
  text:   '#0F1F3D',
  muted:  '#64748B',
  border: '#E2E8F0',
  accent: '#04256c',
  danger: '#EF4444',
}

export default function SignInPageV2() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { login, loading, error: authError } = useSessionAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const redirectTo = searchParams.get('redirect_to') || '/dashboard'

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)

    if (!email.trim()) {
      setError('Email is required')
      return
    }
    if (!password) {
      setError('Password is required')
      return
    }

    setIsLoading(true)
    const { success, error: loginErr } = await login(email, password, rememberMe)

    if (success) {
      navigate(redirectTo)
    } else {
      setError(loginErr || 'Login failed')
      setIsLoading(false)
    }
  }

  return (
    <div style={{ ...F.sans, minHeight: '100vh', background: C.bg, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '48px 24px 80px', WebkitFontSmoothing: 'antialiased' }}>
      <Link to="/" style={{ ...F.sans, fontSize: 18, fontWeight: 800, color: C.text, textDecoration: 'none', marginBottom: 40, letterSpacing: '-0.02em' }}>
        Bind<span style={{ color: C.danger }}>IQ</span>
      </Link>

      <div style={{ width: '100%', maxWidth: 400 }}>
        <div style={{ background: C.bg2, borderRadius: 16, border: `1px solid ${C.border}`, padding: '36px 32px', boxShadow: '0 4px 24px rgba(15,31,61,0.06)' }}>
          <h1 style={{ ...F.sans, fontSize: 24, fontWeight: 800, color: C.text, margin: 0, marginBottom: 6, letterSpacing: '-0.025em' }}>
            Sign in
          </h1>
          <p style={{ ...F.sans, fontSize: 14, color: C.muted, margin: 0, marginBottom: 28 }}>
            Welcome back to BindIQ
          </p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ ...F.sans, fontSize: 14, fontWeight: 600, color: C.text, display: 'block', marginBottom: 6 }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                style={{ width: '100%', padding: '12px 14px', fontSize: 15, border: `1.5px solid ${C.border}`, borderRadius: 9, fontFamily: F.sans.fontFamily }}
              />
            </div>

            <div>
              <label style={{ ...F.sans, fontSize: 14, fontWeight: 600, color: C.text, display: 'block', marginBottom: 6 }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter your password"
                style={{ width: '100%', padding: '12px 14px', fontSize: 15, border: `1.5px solid ${C.border}`, borderRadius: 9, fontFamily: F.sans.fontFamily }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <input
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={e => setRememberMe(e.target.checked)}
                style={{ width: 18, height: 18 }}
              />
              <label htmlFor="rememberMe" style={{ ...F.sans, fontSize: 13, color: C.muted, margin: 0, cursor: 'pointer' }}>
                Keep me logged in for 30 days
              </label>
            </div>

            {error && (
              <div style={{ fontSize: 13, color: C.danger, background: 'rgba(239,68,68,0.06)', border: `1px solid rgba(239,68,68,0.20)`, borderRadius: 8, padding: '10px 14px' }}>
                {error}
              </div>
            )}
            {authError && (
              <div style={{ fontSize: 13, color: C.danger, background: 'rgba(239,68,68,0.06)', border: `1px solid rgba(239,68,68,0.20)`, borderRadius: 8, padding: '10px 14px' }}>
                {authError}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || loading}
              style={{ width: '100%', padding: 15, borderRadius: 10, border: 'none', background: C.accent, color: '#fff', fontSize: 16, fontWeight: 700, cursor: 'pointer', fontFamily: F.sans.fontFamily, opacity: isLoading || loading ? 0.5 : 1 }}
            >
              {isLoading || loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <p style={{ ...F.sans, fontSize: 13, color: C.muted, textAlign: 'center', marginTop: 20 }}>
            Don't have an account?{' '}
            <Link to="/sign-up" style={{ color: C.accent, fontWeight: 600, textDecoration: 'none' }}>Create one</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
