const serif = { fontFamily: "'Instrument Serif', serif" }
const sans = { fontFamily: "'Geist', sans-serif" }

function Icon({ type }) {
  const styles = {
    yes: { background: '#DCFCE7', color: '#15803D' },
    no:  { background: '#F1F5F9', color: '#94A3B8' },
    partial: { background: '#FFFBEB', color: '#B45309' },
  }
  const s = styles[type] || styles.no
  return (
    <span style={{
      ...sans,
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      width: 18, height: 18, borderRadius: '50%',
      fontSize: type === 'partial' ? 9 : 11, fontWeight: 600,
      ...s,
    }}>
      {type === 'yes' ? '✓' : type === 'no' ? '—' : '~'}
    </span>
  )
}

function SectionRow({ label }) {
  return (
    <tr>
      <td colSpan={5} style={{
        ...sans, fontSize: 9, fontWeight: 600,
        textTransform: 'uppercase', letterSpacing: '0.10em',
        color: '#94A3B8', background: '#F8FAFC',
        padding: '7px 12px', borderBottom: '1px solid #E2E8F0',
      }}>
        {label}
      </td>
    </tr>
  )
}

const features = [
  {
    section: 'Client reporting',
    rows: [
      { name: 'White-label reports', desc: 'Agency name + brand color', retainr: 'yes', aa: 'yes', dash: 'partial', what: 'yes' },
      { name: 'Automated monthly report', desc: 'Generated without manual work', retainr: 'yes', aa: 'yes', dash: 'yes', what: 'yes' },
      { name: 'AI narrative + exec summary', desc: 'CFO-readable, no jargon, stands alone', retainr: 'yes', aa: 'partial', dash: 'partial', what: 'partial', highlight: true },
      { name: 'Shareable link, no client login', desc: 'Send a URL, no portal setup', retainr: 'yes', aa: 'no', dash: 'yes', what: 'yes' },
    ],
  },
  {
    section: 'Account manager preparation',
    rows: [
      { name: 'Pre-call briefing card', desc: 'Private, internal, per-client', retainr: 'yes', aa: 'no', dash: 'no', what: 'no', highlight: true },
      { name: 'Concern surfaced first', desc: 'The metric client will challenge, upfront', retainr: 'yes', aa: 'no', dash: 'no', what: 'no', highlight: true },
      { name: 'Suggested call script', desc: 'Written, ready to speak aloud', retainr: 'yes', aa: 'no', dash: 'no', what: 'no', highlight: true },
      { name: 'Commitments tracker', desc: 'What you promised, what\'s overdue', retainr: 'yes', aa: 'no', dash: 'no', what: 'no', highlight: true },
      { name: 'Account health score', desc: '0–100, computed daily', retainr: 'yes', aa: 'no', dash: 'no', what: 'no', highlight: true },
    ],
  },
  {
    section: 'Data and integrations',
    rows: [
      { name: 'GA4 connected, daily refresh', desc: 'Automatic, no manual export', retainr: 'yes', aa: 'yes', dash: 'yes', what: 'yes' },
      { name: 'Multi-platform (Ads, Meta, etc.)', desc: '70+ integrations', retainr: 'partial', aa: 'yes', dash: 'yes', what: 'yes' },
      { name: 'Threshold alerts', desc: 'Traffic drop, CPL spike notifications', retainr: 'yes', aa: 'yes', dash: 'no', what: 'partial' },
    ],
  },
]

const tools = [
  { name: 'retainr', price: 'from $39/mo', isRetainr: true },
  { name: 'AgencyAnalytics', price: 'from $79/mo', isRetainr: false },
  { name: 'DashThis', price: 'from $49/mo', isRetainr: false },
  { name: 'Whatagraph', price: 'from $229/mo', isRetainr: false },
]

const pricing = [
  { price: '$39', note: 'All features included', noteColor: '#64748B', isRetainr: true },
  { price: '$79', note: '+ $20/client above 5', noteColor: '#B45309', isRetainr: false },
  { price: '$159', note: 'White-label on Pro tier', noteColor: '#B45309', isRetainr: false },
  { price: '$229', note: 'Annual commitment req.', noteColor: '#B45309', isRetainr: false },
]

const tdBase = {
  padding: '9px 12px',
  borderBottom: '1px solid #F1F5F9',
  verticalAlign: 'middle',
}

export default function CompetitorComparison() {
  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ ...sans, fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#94A3B8', marginBottom: 10 }}>
          How it compares
        </div>
        <h2 style={{ ...serif, fontSize: 34, fontWeight: 400, color: '#1A1A18', marginBottom: 8, lineHeight: 1.15 }}>
          Already paying for a reporting tool?
        </h2>
        <p style={{ ...sans, fontSize: 14, color: '#6B6B66', lineHeight: 1.6, maxWidth: 560 }}>
          Here's what you're getting — and what's still missing. The tools below automate the report.
          None of them prepare the person sending it.
        </p>
      </div>

      {/* Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12, ...sans }}>
          <thead>
            <tr>
              <th style={{ width: '30%', padding: '10px 12px', borderBottom: '1px solid #E2E8F0' }} />
              {tools.map((t) => (
                <th
                  key={t.name}
                  style={{
                    width: '17.5%',
                    padding: '10px 12px',
                    borderBottom: '1px solid #E2E8F0',
                    verticalAlign: 'bottom',
                    textAlign: 'left',
                    ...(t.isRetainr ? {
                      background: '#EFF6FF',
                      borderLeft: '2px solid #BFDBFE',
                    } : {}),
                  }}
                >
                  {t.isRetainr && (
                    <div style={{
                      ...sans, fontSize: 9, fontWeight: 600, textTransform: 'uppercase',
                      letterSpacing: '0.08em', background: '#DBEAFE', color: '#1D4ED8',
                      padding: '2px 7px', borderRadius: 20,
                      display: 'inline-block', marginBottom: 5,
                    }}>
                      built for this
                    </div>
                  )}
                  <div style={{
                    ...(t.isRetainr ? serif : sans),
                    fontSize: t.isRetainr ? 16 : 13,
                    fontWeight: t.isRetainr ? 400 : 500,
                    color: t.isRetainr ? '#1E3A5F' : '#475569',
                  }}>
                    {t.name}
                  </div>
                  <div style={{ ...sans, fontSize: 11, color: t.isRetainr ? '#2563EB' : '#94A3B8', fontWeight: t.isRetainr ? 500 : 400, marginTop: 2 }}>
                    {t.price}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {features.map((group) => (
              <>
                <SectionRow key={group.section} label={group.section} />
                {group.rows.map((row) => (
                  <tr key={row.name} style={{ cursor: 'default' }}
                    onMouseEnter={(e) => { Array.from(e.currentTarget.cells).forEach(c => { if (!c.style.background || c.style.background === 'rgb(248, 251, 255)') c.style.background = '#FAFAFA' }) }}
                    onMouseLeave={(e) => { Array.from(e.currentTarget.cells).forEach((c, i) => { c.style.background = i === 1 ? (row.highlight ? '#EFF6FF' : '#F8FBFF') : '' }) }}
                  >
                    <td style={{ ...tdBase, color: '#334155' }}>
                      <div style={{ fontSize: 12, fontWeight: 500, color: '#1E293B', lineHeight: 1.3 }}>{row.name}</div>
                      <div style={{ fontSize: 10, color: '#94A3B8', lineHeight: 1.4, marginTop: 1 }}>{row.desc}</div>
                    </td>
                    <td style={{ ...tdBase, background: row.highlight ? '#EFF6FF' : '#F8FBFF', borderLeft: '2px solid #BFDBFE' }}>
                      <Icon type={row.retainr} />
                    </td>
                    <td style={tdBase}><Icon type={row.aa} /></td>
                    <td style={tdBase}><Icon type={row.dash} /></td>
                    <td style={tdBase}><Icon type={row.what} /></td>
                  </tr>
                ))}
              </>
            ))}

            {/* Pricing row */}
            <SectionRow label="Pricing for 5 clients" />
            <tr>
              <td style={{ ...tdBase, ...sans, fontSize: 11, color: '#64748B', lineHeight: 1.5 }}>
                Monthly cost,<br />white-label included
              </td>
              {pricing.map((p, i) => (
                <td key={i} style={{
                  ...tdBase, padding: 12,
                  background: p.isRetainr ? '#EFF6FF' : 'transparent',
                  ...(p.isRetainr ? { borderLeft: '2px solid #BFDBFE' } : {}),
                }}>
                  <div style={{
                    ...serif, fontSize: 22,
                    color: p.isRetainr ? '#2563EB' : '#1E293B',
                    lineHeight: 1,
                  }}>
                    {p.price}
                  </div>
                  <div style={{ ...sans, fontSize: 10, color: p.noteColor, marginTop: 3 }}>
                    {p.note}
                  </div>
                </td>
              ))}
            </tr>

          </tbody>
        </table>
      </div>

      {/* Switch callout */}
      <div style={{
        marginTop: 20,
        border: '1px solid #DBEAFE', borderRadius: 10,
        padding: '14px 16px', background: '#EFF6FF',
        display: 'flex', alignItems: 'flex-start', gap: 12,
      }}>
        <div style={{
          width: 32, height: 32, borderRadius: 8, background: '#BFDBFE',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 15, flexShrink: 0,
        }}>↗</div>
        <div>
          <div style={{ ...sans, fontSize: 12, fontWeight: 600, color: '#1E3A5F', marginBottom: 3 }}>
            Already using one of these? Switching takes 10 minutes.
          </div>
          <div style={{ ...sans, fontSize: 11, color: '#3B5A8A', lineHeight: 1.55 }}>
            Connect your first GA4 client, and retainr generates the initial report and briefing card immediately.
            No template setup, no dashboard building. If it doesn't change how you walk into client calls, cancel — no questions asked.
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginTop: 8 }}>
            {['No template setup', 'First report in minutes', 'Cancel anytime', 'No credit card to start'].map((t) => (
              <span key={t} style={{
                ...sans, fontSize: 10, padding: '3px 9px', borderRadius: 20,
                background: '#DBEAFE', color: '#1D4ED8', border: '1px solid #BFDBFE',
              }}>{t}</span>
            ))}
          </div>
        </div>
      </div>

    </div>
  )
}
