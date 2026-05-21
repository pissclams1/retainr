import { Navigate } from 'react-router-dom'
import { useSessionAuth } from '../hooks/useSessionAuth'

export default function AuthGuard({ children }) {
  const { session, loading } = useSessionAuth()

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--surface)' }}>
        <span style={{ fontFamily: 'Geist, sans-serif', fontSize: '13px', color: 'var(--ink-5)' }}>Loading…</span>
      </div>
    )
  }

  if (!session) return <Navigate to="/sign-in" replace />

  return children
}
