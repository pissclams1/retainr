export default function Callout({ variant = 'info', title, children }) {
  const variants = {
    win:   { borderColor: 'var(--win)',   background: 'var(--win-bg)',   titleColor: 'var(--win)' },
    alert: { borderColor: 'var(--alert)', background: 'var(--alert-bg)', titleColor: 'var(--alert)' },
    danger:{ borderColor: 'var(--danger)',background: 'var(--danger-bg)',titleColor: 'var(--danger)' },
    info:  { borderColor: 'var(--info)',  background: 'var(--info-bg)',  titleColor: 'var(--info)' },
  }

  const v = variants[variant]

  return (
    <div style={{ borderLeft: `3px solid ${v.borderColor}`, background: v.background, padding: '14px 16px' }}>
      {title && (
        <p style={{ fontFamily: 'Geist, sans-serif', fontSize: '12px', fontWeight: 600, color: v.titleColor, marginBottom: '4px' }}>
          {title}
        </p>
      )}
      <div style={{ fontFamily: 'Geist, sans-serif', fontSize: '12px', lineHeight: 1.6, color: 'var(--ink-3)' }}>
        {children}
      </div>
    </div>
  )
}
