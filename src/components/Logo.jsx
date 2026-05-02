import { Link } from 'react-router-dom'

export default function Logo({ dark = false, size = 'md', to = '/' }) {
  const fontSize = size === 'lg' ? 20 : size === 'sm' ? 15 : 18
  const color    = dark ? '#ffffff' : '#0F1F3D'
  const red      = '#EF4444'

  return (
    <Link
      to={to}
      style={{
        textDecoration: 'none',
        display: 'inline-flex',
        alignItems: 'center',
        userSelect: 'none',
        lineHeight: 1,
        fontFamily: "'DM Sans', system-ui, -apple-system, sans-serif",
        fontSize,
        fontWeight: 800,
        letterSpacing: '-0.035em',
        color,
      }}
    >
      Bind<span style={{ color: red }}>IQ</span>
    </Link>
  )
}
