import { Link, useLocation } from 'react-router-dom'
import { supabase } from '../lib/supabase'

const APP_ROUTES = ['/dashboard', '/clients', '/reports', '/alerts', '/billing']

export default function AppBar() {
  const location = useLocation()
  const isAppRoute = APP_ROUTES.some(r => location.pathname.startsWith(r))

  if (!isAppRoute) return null

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  return (
    <header style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      height: 52,
      background: '#FAFAF9',
      borderBottom: '1px solid rgba(15,15,14,0.10)',
      display: 'flex', alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 24px',
    }}>
      <Link to="/dashboard" style={{
        fontFamily: "'Instrument Serif', serif",
        fontSize: 20, fontWeight: 400,
        color: '#1A1A18', letterSpacing: '-0.3px',
        textDecoration: 'none',
      }}>
        retainr
      </Link>

      <nav style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        {[
          { label: 'Dashboard', to: '/dashboard' },
          { label: 'Clients', to: '/clients' },
          { label: 'Alerts', to: '/alerts' },
          { label: 'Billing', to: '/billing' },
        ].map(({ label, to }) => (
          <Link key={to} to={to} style={{
            fontFamily: "'Geist', sans-serif",
            fontSize: 13,
            color: location.pathname.startsWith(to) ? '#1A1A18' : '#6B6B66',
            fontWeight: location.pathname.startsWith(to) ? 500 : 400,
            padding: '6px 10px', borderRadius: 6,
            textDecoration: 'none',
            background: location.pathname.startsWith(to) ? '#F0EFE8' : 'transparent',
          }}>
            {label}
          </Link>
        ))}
        <button
          onClick={handleSignOut}
          style={{
            fontFamily: "'Geist', sans-serif",
            fontSize: 13, fontWeight: 500,
            color: '#6B6B66', background: 'transparent',
            border: '1px solid rgba(15,15,14,0.18)',
            padding: '6px 14px', borderRadius: 7,
            cursor: 'pointer', marginLeft: 8,
          }}
        >
          Sign out
        </button>
      </nav>
    </header>
  )
}
