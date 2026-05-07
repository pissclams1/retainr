import { Link } from 'react-router-dom'

const C = {
  bg:     '#F8FAFC',
  text:   '#0F1F3D',
  muted:  '#64748B',
  accent: '#04256c',
  red:    '#DC2626',
}

function Logo() {
  return (
    <div style={{ fontSize: 32, fontWeight: 800, letterSpacing: '-0.04em', color: C.text, lineHeight: 1 }}>
      Bind<span style={{ color: C.red }}>IQ</span>
    </div>
  )
}

export default function NotFoundPage() {
  return (
    <div style={{
      fontFamily: "'DM Sans', system-ui, -apple-system, sans-serif",
      minHeight: '100vh',
      background: C.bg,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '32px 24px',
      WebkitFontSmoothing: 'antialiased',
    }}>
      {/* Logo */}
      <div style={{ position: 'absolute', top: 32, left: 32 }}>
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
          <Logo />
        </Link>
      </div>

      {/* Content */}
      <div style={{ textAlign: 'center', maxWidth: 520 }}>
        <div style={{
          fontSize: 96,
          fontWeight: 800,
          color: C.accent,
          lineHeight: 1,
          marginBottom: 16,
          letterSpacing: '-0.04em',
        }}>
          404
        </div>

        <h1 style={{
          fontSize: 32,
          fontWeight: 800,
          color: C.text,
          margin: '0 0 12px',
          letterSpacing: '-0.025em',
        }}>
          Page not found
        </h1>

        <p style={{
          fontSize: 16,
          color: C.muted,
          margin: '0 0 32px',
          lineHeight: 1.6,
        }}>
          The page you're looking for doesn't exist. Check the URL or go back to the homepage.
        </p>

        <Link
          to="/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '12px 24px',
            background: C.accent,
            color: '#fff',
            fontSize: 15,
            fontWeight: 700,
            borderRadius: 10,
            textDecoration: 'none',
            transition: 'opacity 0.15s',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 4px 16px rgba(4,37,108,0.30)',
          }}
          onMouseEnter={(e) => e.target.style.opacity = '0.92'}
          onMouseLeave={(e) => e.target.style.opacity = '1'}
        >
          Back to home
        </Link>
      </div>
    </div>
  )
}
