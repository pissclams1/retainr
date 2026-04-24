import { useRef } from 'react'

export default function Input({ label, hint, error, id, ...props }) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')

  const handleFocus = (e) => {
    e.target.style.boxShadow = '0 0 0 3px rgba(15,15,14,0.06)'
    e.target.style.borderColor = 'var(--ink-3)'
    props.onFocus?.(e)
  }

  const handleBlur = (e) => {
    e.target.style.boxShadow = error ? '0 0 0 3px rgba(184,58,42,0.08)' : 'none'
    e.target.style.borderColor = error ? 'var(--danger)' : 'var(--border-2)'
    props.onBlur?.(e)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
      {label && (
        <label htmlFor={inputId} style={{ fontFamily: 'Geist, sans-serif', fontSize: '11px', fontWeight: 600, color: 'var(--ink-3)', letterSpacing: '0.05em' }}>
          {label}
        </label>
      )}
      <input
        id={inputId}
        {...props}
        onFocus={handleFocus}
        onBlur={handleBlur}
        style={{
          height: '36px',
          background: 'white',
          border: `1px solid ${error ? 'var(--danger)' : 'var(--border-2)'}`,
          borderRadius: '7px',
          padding: '8px 12px',
          fontFamily: 'Geist, sans-serif',
          fontSize: '13px',
          color: 'var(--ink-2)',
          outline: 'none',
          width: '100%',
          boxShadow: error ? '0 0 0 3px rgba(184,58,42,0.08)' : 'none',
          transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
          ...(props.style || {}),
        }}
      />
      {hint && !error && <p style={{ fontFamily: 'Geist, sans-serif', fontSize: '11px', color: 'var(--ink-5)' }}>{hint}</p>}
      {error && <p style={{ fontFamily: 'Geist, sans-serif', fontSize: '11px', color: 'var(--danger)' }}>{error}</p>}
    </div>
  )
}
