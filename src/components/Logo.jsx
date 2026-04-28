import { Link } from 'react-router-dom'

/**
 * retainr logo — wordmark + two-bar underline from Claude Design.
 *
 * Props:
 *   dark  — white wordmark + dim bars (for navy/dark backgrounds)
 *   size  — "sm" | "md" (default) | "lg"
 *   to    — React Router link target (default "/")
 */
export default function Logo({ dark = false, size = 'md', to = '/' }) {
  const fontSize  = size === 'lg' ? 20 : size === 'sm' ? 15 : 18
  const barLong   = size === 'lg' ? 44 : size === 'sm' ? 28 : 36
  const barShort  = size === 'lg' ? 16 : size === 'sm' ? 10 : 13
  const color     = dark ? '#ffffff' : '#0F1F3D'
  const accent    = dark ? 'rgba(255,255,255,0.55)' : '#04256c'

  return (
    <Link
      to={to}
      style={{
        textDecoration: 'none',
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: 3,
        userSelect: 'none',
        lineHeight: 1,
      }}
    >
      <span style={{
        fontFamily: "'DM Sans', system-ui, -apple-system, sans-serif",
        fontSize,
        fontWeight: 800,
        letterSpacing: '-0.035em',
        color,
        lineHeight: 1,
      }}>
        retainr
      </span>
      <div style={{ display: 'flex', gap: 3, alignItems: 'center' }}>
        <div style={{ height: 3, width: barLong, borderRadius: 2, background: color, opacity: dark ? 0.2 : 0.15 }} />
        <div style={{ height: 3, width: barShort, borderRadius: 2, background: accent }} />
      </div>
    </Link>
  )
}
