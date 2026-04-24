export default function HealthRing({ score }) {
  const color = score >= 70 ? 'var(--win)' : score >= 50 ? 'var(--alert)' : 'var(--danger)'

  return (
    <div style={{
      width: '72px',
      height: '72px',
      borderRadius: '50%',
      border: `3px solid ${color}`,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
    }}>
      <span style={{ fontFamily: 'Instrument Serif, serif', fontSize: '24px', color, lineHeight: 1 }}>
        {score}
      </span>
      <span style={{ fontFamily: 'Geist, sans-serif', fontSize: '9px', fontWeight: 600, textTransform: 'uppercase', color: 'var(--ink-5)', letterSpacing: '0.06em' }}>
        score
      </span>
    </div>
  )
}
