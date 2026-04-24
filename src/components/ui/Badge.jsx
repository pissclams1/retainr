export default function Badge({ children, variant = 'default' }) {
  const variants = {
    default: { background: 'var(--surface-3)', color: 'var(--ink-4)' },
    win:     { background: 'var(--win-bg)', color: 'var(--win)', border: '1px solid var(--win-border)' },
    alert:   { background: 'var(--alert-bg)', color: 'var(--alert)', border: '1px solid var(--alert-border)' },
    danger:  { background: 'var(--danger-bg)', color: 'var(--danger)' },
    info:    { background: 'var(--info-bg)', color: 'var(--info)' },
  }

  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      padding: '2px 8px',
      borderRadius: '20px',
      fontFamily: 'Geist, sans-serif',
      fontSize: '11px',
      fontWeight: 500,
      ...variants[variant],
    }}>
      {children}
    </span>
  )
}
