export default function Button({ children, variant = 'primary', size = 'md', disabled, onClick, type = 'button', fullWidth, style: extraStyle }) {
  const base = {
    fontFamily: 'Geist, sans-serif',
    fontWeight: 500,
    borderRadius: size === 'sm' ? '5px' : '7px',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.6 : 1,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    transition: 'opacity 0.15s ease',
    width: fullWidth ? '100%' : undefined,
    border: 'none',
    textDecoration: 'none',
    whiteSpace: 'nowrap',
  }

  const sizes = {
    sm: { fontSize: '11px', padding: '5px 10px' },
    md: { fontSize: '13px', padding: '8px 16px' },
  }

  const variants = {
    primary:   { background: 'var(--ink-2)', color: 'var(--surface)' },
    secondary: { background: 'var(--surface-3)', color: 'var(--ink-2)' },
    outline:   { background: 'transparent', border: '1px solid var(--border-2)', color: 'var(--ink-2)' },
    ghost:     { background: 'transparent', color: 'var(--ink-4)' },
    danger:    { background: 'var(--danger-bg)', border: '1px solid rgba(184,58,42,0.2)', color: 'var(--danger)' },
  }

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      style={{ ...base, ...sizes[size], ...variants[variant], ...extraStyle }}
    >
      {children}
    </button>
  )
}
