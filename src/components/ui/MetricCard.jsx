export default function MetricCard({ label, value, delta, deltaLabel }) {
  const deltaColor = delta > 0 ? 'var(--win)' : delta < 0 ? 'var(--danger)' : 'var(--ink-5)'
  const deltaSign  = delta > 0 ? '+' : ''

  return (
    <div style={{
      background: 'white',
      border: '1px solid var(--border)',
      borderRadius: '12px',
      padding: '18px 20px',
    }}>
      <p style={{ fontFamily: 'Geist, sans-serif', fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--ink-5)', marginBottom: '10px' }}>
        {label}
      </p>
      <p style={{ fontFamily: 'Instrument Serif, serif', fontSize: '32px', color: 'var(--ink-2)', lineHeight: 1 }}>
        {value ?? '—'}
      </p>
      {delta !== undefined && (
        <p style={{ fontFamily: 'Geist, sans-serif', fontSize: '12px', fontWeight: 500, color: deltaColor, marginTop: '6px' }}>
          {deltaSign}{delta}% {deltaLabel}
        </p>
      )}
    </div>
  )
}
