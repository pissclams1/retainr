import { NavLink, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function AppBar() {
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    navigate('/login')
  }

  return (
    <header style={{
      height: '52px',
      background: 'white',
      borderBottom: '1px solid var(--border)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 24px',
      position: 'sticky',
      top: 0,
      zIndex: 100,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
        <span style={{ fontFamily: 'Instrument Serif, serif', fontSize: '20px', color: 'var(--ink)', letterSpacing: '-0.3px' }}>
          retainr
        </span>
        <nav style={{ display: 'flex', gap: '2px' }}>
          {[
            { to: '/dashboard', label: 'Dashboard' },
            { to: '/clients',   label: 'Clients' },
            { to: '/reports',   label: 'Reports' },
            { to: '/alerts',    label: 'Alerts' },
            { to: '/billing',   label: 'Billing' },
          ].map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              style={({ isActive }) => ({
                fontFamily: 'Geist, sans-serif',
                fontSize: '13px',
                fontWeight: isActive ? 500 : 400,
                color: isActive ? 'var(--ink-2)' : 'var(--ink-4)',
                padding: '6px 10px',
                borderRadius: '6px',
                textDecoration: 'none',
                background: isActive ? 'var(--surface-2)' : 'transparent',
              })}
            >
              {label}
            </NavLink>
          ))}
        </nav>
      </div>

      <button
        onClick={handleSignOut}
        style={{
          background: 'transparent',
          border: 'none',
          fontFamily: 'Geist, sans-serif',
          fontSize: '13px',
          color: 'var(--ink-4)',
          cursor: 'pointer',
          padding: '6px 10px',
        }}
      >
        Sign out
      </button>
    </header>
  )
}
