import { Link } from 'react-router-dom'

const F = { sans: { fontFamily: "'DM Sans', system-ui, -apple-system, sans-serif" } }
const C = {
  text:    '#0F1F3D',
  muted:   '#64748B',
  subtle:  '#94A3B8',
  border:  '#E2E8F0',
  accent:  '#04256c',
  positive:'#10B981',
  amber:   '#F59E0B',
}

const NEXT_TIER = {
  starter: {
    key:      'pro',
    name:     'Pro',
    monthly:  149,
    annual:   127,
    features: [
      'Up to 200 reports/month',
      'Intake Links — async client submissions',
      'Submission history dashboard',
      'Enhanced underwriting explanations',
    ],
  },
  pro: {
    key:      'agency',
    name:     'Agency',
    monthly:  299,
    annual:   254,
    features: [
      '500+ reports/month',
      'Multi-user access (3 seats)',
      'Agency branding on intake links',
      'Exportable underwriting summaries',
      'Priority support',
    ],
  },
}

export default function UpgradeModal({ info, onDismiss }) {
  // info = { tier, used, limit, next_tier }
  const { tier, used, limit } = info ?? {}
  const next = NEXT_TIER[tier]
  const tierLabel = tier ? (tier.charAt(0).toUpperCase() + tier.slice(1)) : 'your'
  const pct = limit > 0 ? Math.min(100, Math.round((used / limit) * 100)) : 100

  return (
    <div
      onClick={onDismiss}
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(15,31,61,0.55)', backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 24,
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          ...F.sans, background: '#fff', borderRadius: 20,
          padding: '36px 32px 28px', maxWidth: 440, width: '100%',
          boxShadow: '0 24px 80px rgba(15,31,61,0.18)',
          position: 'relative',
        }}
      >
        {/* Close */}
        <button
          onClick={onDismiss}
          style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', cursor: 'pointer', color: C.subtle, fontSize: 18, lineHeight: 1, padding: 4 }}
        >
          ×
        </button>

        {/* Usage indicator */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: C.text }}>{tierLabel} plan — monthly usage</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: C.amber }}>{used} / {limit} reports</span>
          </div>
          <div style={{ height: 6, background: '#F1F5F9', borderRadius: 4, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${pct}%`, background: pct >= 100 ? '#EF4444' : C.amber, borderRadius: 4, transition: 'width 0.4s ease' }} />
          </div>
          <div style={{ fontSize: 12, color: C.muted, marginTop: 6 }}>
            You've used all {limit} reports on your {tierLabel} plan this month.
          </div>
        </div>

        {next ? (
          <>
            <h3 style={{ ...F.sans, fontSize: 18, fontWeight: 800, color: C.text, margin: '0 0 4px', letterSpacing: '-0.02em' }}>
              Upgrade to {next.name}
            </h3>
            <p style={{ ...F.sans, fontSize: 13, color: C.muted, margin: '0 0 20px', lineHeight: 1.5 }}>
              Keep running reports right now — upgrade takes effect instantly.
            </p>

            {/* Features */}
            <div style={{ background: '#F8FAFC', borderRadius: 12, padding: '14px 16px', marginBottom: 20 }}>
              {next.features.map(f => (
                <div key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 7 }}>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0, marginTop: 1 }}>
                    <circle cx="7" cy="7" r="6" fill="rgba(16,185,129,0.12)"/>
                    <path d="M4.5 7l1.8 1.8L9.5 5" stroke={C.positive} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span style={{ fontSize: 13, color: C.text }}>{f}</span>
                </div>
              ))}
            </div>

            {/* Pricing */}
            <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
              <Link
                to={`/checkout?plan=${next.key}`}
                style={{
                  ...F.sans, flex: 1, display: 'block', textAlign: 'center', textDecoration: 'none',
                  padding: '13px 0', borderRadius: 10, fontSize: 14, fontWeight: 700,
                  background: C.accent, color: '#fff',
                  boxShadow: '0 4px 14px rgba(4,37,108,0.25)',
                }}
              >
                Upgrade — ${next.monthly}/mo
              </Link>
              <Link
                to={`/checkout?plan=${next.key}&billing=annual`}
                style={{
                  ...F.sans, flex: 1, display: 'block', textAlign: 'center', textDecoration: 'none',
                  padding: '13px 0', borderRadius: 10, fontSize: 14, fontWeight: 700,
                  background: 'rgba(4,37,108,0.07)', color: C.accent, border: '1.5px solid rgba(4,37,108,0.15)',
                }}
              >
                Annual — ${next.annual}/mo
              </Link>
            </div>

            <button
              onClick={onDismiss}
              style={{ ...F.sans, width: '100%', background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, color: C.muted, padding: '6px 0' }}
            >
              Wait until next month
            </button>
          </>
        ) : (
          /* Agency tier — already at top */
          <>
            <h3 style={{ ...F.sans, fontSize: 18, fontWeight: 800, color: C.text, margin: '0 0 8px' }}>
              You're on Agency — our highest tier
            </h3>
            <p style={{ ...F.sans, fontSize: 13, color: C.muted, margin: '0 0 20px', lineHeight: 1.5 }}>
              You've run {used} reports this month. Fair-use limits apply at very high volumes.
              Reach out and we'll make it work.
            </p>
            <a
              href="mailto:support@usebindiq.com?subject=High%20volume%20usage"
              style={{
                ...F.sans, display: 'block', textAlign: 'center', textDecoration: 'none',
                padding: '13px 0', borderRadius: 10, fontSize: 14, fontWeight: 700,
                background: C.accent, color: '#fff',
              }}
            >
              Contact us
            </a>
            <button
              onClick={onDismiss}
              style={{ ...F.sans, width: '100%', background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, color: C.muted, padding: '10px 0 0' }}
            >
              Dismiss
            </button>
          </>
        )}
      </div>
    </div>
  )
}
