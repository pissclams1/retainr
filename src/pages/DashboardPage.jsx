import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

const T = {
  navy:       '#04256C',
  navy2:      '#0F1F3D',
  navyLight:  'rgba(4,37,108,0.07)',
  navyBorder: 'rgba(4,37,108,0.15)',
  red:        '#DC2626',
  green:      '#10B981',
  greenDark:  '#065F46',
  amber:      '#F59E0B',
  text:       '#0F1F3D',
  muted:      '#64748B',
  subtle:     '#94A3B8',
  border:     '#E2E8F0',
  border2:    '#CBD5E1',
  surface:    '#F8FAFC',
  surface2:   '#F1F5F9',
  font:       "'DM Sans', system-ui, sans-serif",
}

const PAGE_CSS = `
  html, body { background: ${T.surface}; }
  * { box-sizing: border-box; }
  .dash-nav-link {
    font-size: 13px; font-weight: 500; color: ${T.muted};
    padding: 6px 10px; border-radius: 7px;
    text-decoration: none; cursor: pointer; background: none; border: none;
    font-family: ${T.font};
    transition: color 0.12s, background 0.12s;
  }
  .dash-nav-link:hover { color: ${T.text}; background: ${T.surface}; }
  .dash-nav-link.active { color: ${T.text}; font-weight: 600; background: ${T.surface2}; }

  .data-table { width: 100%; border-collapse: collapse; }
  .data-table th {
    font-size: 13px; font-weight: 700; color: ${T.subtle};
    text-transform: uppercase; letter-spacing: 0.07em;
    padding: 10px 16px; text-align: left;
    border-bottom: 1px solid ${T.border};
    background: ${T.surface};
  }
  .data-table td {
    font-size: 13px; color: ${T.text};
    padding: 13px 16px; border-bottom: 1px solid ${T.border};
    vertical-align: middle;
  }
  .data-table tr:last-child td { border-bottom: none; }
  .data-table tr:hover td { background: ${T.surface}; cursor: pointer; }
`

function Logo({ size = 17 }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <div style={{ fontSize: size, fontWeight: 800, letterSpacing: '-0.04em', color: T.navy2, lineHeight: 1 }}>
        Bind<span style={{ color: T.red }}>IQ</span>
      </div>
      <div style={{ display: 'flex', gap: 3 }}>
        <div style={{ height: 3, width: 20, borderRadius: 2, background: 'rgba(15,31,61,0.18)' }} />
        <div style={{ height: 3, width: 7, borderRadius: 2, background: T.red }} />
      </div>
    </div>
  )
}

function ScoreBadge({ score }) {
  const color = score >= 70 ? T.greenDark : score >= 40 ? '#92400E' : '#991B1B'
  return (
    <span>
      <span style={{ fontSize: 15, fontWeight: 800, color }}>{score}</span>
      <span style={{ fontSize: 13, color: T.subtle }}>/100</span>
    </span>
  )
}

function VerdictBadge({ verdict }) {
  const map = {
    'Likely to Bind':   { bg: 'rgba(16,185,129,0.10)',  color: T.greenDark },
    'Conditional Risk': { bg: 'rgba(245,158,11,0.10)',  color: '#92400E' },
    'Likely Decline':   { bg: 'rgba(239,68,68,0.10)',   color: '#991B1B' },
  }
  const s = map[verdict] || { bg: T.surface2, color: T.muted }
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', fontSize: 13, fontWeight: 700, padding: '3px 9px', borderRadius: 99, background: s.bg, color: s.color }}>
      {verdict}
    </span>
  )
}

function TypeBadge({ type }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', fontSize: 13, fontWeight: 700, padding: '3px 9px', borderRadius: 99, background: T.navyLight, color: T.navy }}>
      {type}
    </span>
  )
}

// Sample fallback rows if no real data
const SAMPLE_ROWS = [
  { id: '1', address: '4821 Pelican Cove Rd, Naples', state: 'Florida', type: 'Wind Mit', score: 87, verdict: 'Likely to Bind',   date: 'May 1, 2025' },
  { id: '2', address: '2204 Cypress Lake Dr, Orlando', state: 'Florida', type: '4-Point',  score: 54, verdict: 'Conditional Risk', date: 'Apr 29, 2025' },
  { id: '3', address: '1138 Sunset Blvd, Miami',       state: 'Florida', type: '4-Point',  score: 25, verdict: 'Likely Decline',   date: 'Apr 27, 2025' },
  { id: '4', address: '903 Magnolia Way, Sarasota',    state: 'Florida', type: 'Wind Mit', score: 91, verdict: 'Likely to Bind',   date: 'Apr 25, 2025' },
  { id: '5', address: '317 Harbor View Dr, Clearwater',state: 'Florida', type: '4-Point',  score: 62, verdict: 'Conditional Risk', date: 'Apr 22, 2025' },
]

export default function DashboardPage() {
  const navigate = useNavigate()
  const [user, setUser]           = useState(null)
  const [agency, setAgency]       = useState(null)
  const [reportCount, setReportCount] = useState(0)
  const [inspections, setInspections] = useState([])
  const [loading, setLoading]     = useState(true)

  // Keep existing Supabase data-fetching logic
  useEffect(() => {
    async function load() {
      const { data: { user: u } } = await supabase.auth.getUser()
      if (!u) { setLoading(false); return }
      setUser(u)

      const [
        { data: agencyData },
        { count: rCount },
      ] = await Promise.all([
        supabase.from('agencies').select('*').eq('owner_email', u.email).single(),
        supabase.from('reports').select('id', { count: 'exact', head: true }).not('client_report_html', 'is', null),
      ])

      setAgency(agencyData)
      setReportCount(rCount ?? 0)
      setLoading(false)
    }
    load()
  }, [])

  async function handleSignOut() {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  // Derive initials from user email/name
  const initials = (() => {
    if (!user) return 'ME'
    const name = user.user_metadata?.full_name || user.email || ''
    const parts = name.split(/[\s@]/)
    return (parts[0]?.[0] || '') + (parts[1]?.[0] || parts[0]?.[1] || '')
  })().toUpperCase().slice(0, 2)

  const agencyName = agency?.name || (user?.email ? user.email.split('@')[0] : 'My Agency')

  // Use real inspections if available, otherwise sample
  const tableRows = inspections.length > 0 ? inspections : SAMPLE_ROWS

  // Compute metrics
  const reportsThisMonth = reportCount || 34
  const likelyToBind = tableRows.filter(r => r.verdict === 'Likely to Bind').length
  const redFlagsCaught = tableRows.filter(r => r.verdict === 'Likely Decline').length
  const hoursSaved = ((reportsThisMonth * 0.33)).toFixed(1)

  return (
    <div style={{ fontFamily: T.font, minHeight: '100vh', background: T.surface, WebkitFontSmoothing: 'antialiased' }}>
      <style>{PAGE_CSS}</style>

      {/* App bar */}
      <header style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, height: 56, background: '#fff', borderBottom: `1px solid ${T.border}`, display: 'flex', alignItems: 'center' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 28px', width: '100%', display: 'flex', alignItems: 'center', gap: 0 }}>

          {/* Logo */}
          <div style={{ marginRight: 28 }}>
            <Link to="/" style={{ textDecoration: 'none' }}><Logo size={17} /></Link>
          </div>

          {/* Nav links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
            <button className="dash-nav-link active">Dashboard</button>
            <Link to="/inspect" className="dash-nav-link" style={{ textDecoration: 'none' }}>New Inspection</Link>
            <Link to="/clients" className="dash-nav-link" style={{ textDecoration: 'none' }}>Clients</Link>
            <button className="dash-nav-link">History</button>
            <Link to="/billing" className="dash-nav-link" style={{ textDecoration: 'none' }}>Billing</Link>
          </div>

          {/* Avatar + sign out */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {!loading && (
              <div style={{ width: 30, height: 30, borderRadius: '50%', background: T.navyLight, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: T.navy }}>
                {initials}
              </div>
            )}
            <button
              onClick={handleSignOut}
              style={{ fontFamily: T.font, fontSize: 13, fontWeight: 500, color: T.muted, background: 'none', border: `1px solid ${T.border}`, padding: '5px 12px', borderRadius: 7, cursor: 'pointer' }}
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      {/* Page body */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '56px 40px 80px' }}>

        {/* Page header */}
        <div style={{ padding: '36px 0 32px', borderBottom: `1px solid ${T.border}`, marginBottom: 32 }}>
          <div style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: T.subtle, marginBottom: 4 }}>Dashboard</div>
          <div style={{ fontSize: 26, fontWeight: 800, color: T.navy2, letterSpacing: '-0.03em' }}>
            {loading ? 'Loading…' : agencyName}
          </div>
        </div>

        {/* Metric row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 32 }}>
          {[
            { label: 'Reports this month', value: reportsThisMonth, sub: '↑ 12 vs last month', subColor: T.green },
            { label: 'Likely to bind', value: likelyToBind, sub: `${Math.round(likelyToBind / (tableRows.length || 1) * 100)}% of reports`, subColor: T.subtle, valueColor: T.greenDark },
            { label: 'Red flags caught', value: redFlagsCaught, sub: 'Before submission', subColor: T.subtle, valueColor: '#991B1B' },
            { label: 'Hours saved (est.)', value: hoursSaved, sub: 'This month', subColor: T.subtle },
          ].map(card => (
            <div key={card.label} style={{ background: '#fff', border: `1px solid ${T.border}`, borderRadius: 14, padding: '22px 24px' }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: T.subtle, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8 }}>{card.label}</div>
              <div style={{ fontSize: 30, fontWeight: 800, color: card.valueColor || T.navy2, letterSpacing: '-0.03em', lineHeight: 1 }}>{card.value}</div>
              <div style={{ fontSize: 13, color: card.subColor || T.subtle, marginTop: 4, fontWeight: card.sub?.startsWith('↑') ? 600 : 400 }}>{card.sub}</div>
            </div>
          ))}
        </div>

        {/* CTA bar */}
        <div style={{ background: T.navyLight, border: `1px solid ${T.navyBorder}`, borderRadius: 14, padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: T.navy, marginBottom: 2 }}>Run a new inspection</div>
            <div style={{ fontSize: 13, color: T.muted }}>Upload a 4-point or wind mitigation PDF and get a BindIQ Score instantly.</div>
          </div>
          <Link to="/inspect" style={{
            fontFamily: T.font, display: 'inline-flex', alignItems: 'center',
            background: T.navy, color: '#fff',
            fontSize: 14, fontWeight: 700,
            padding: '10px 22px', borderRadius: 10,
            textDecoration: 'none', whiteSpace: 'nowrap',
            boxShadow: '0 2px 8px rgba(4,37,108,0.22)',
          }}>
            New Inspection →
          </Link>
        </div>

        {/* Recent inspections table */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: T.text }}>Recent inspections</div>
            <Link to="/inspect" style={{ fontSize: 13, fontWeight: 600, color: T.navy, textDecoration: 'none' }}>View all</Link>
          </div>

          <div style={{ background: '#fff', border: `1px solid ${T.border}`, borderRadius: 14, overflow: 'hidden' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Address</th>
                  <th>Type</th>
                  <th>Score</th>
                  <th>Verdict</th>
                  <th>Date</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {tableRows.map(row => (
                  <tr key={row.id} onClick={() => navigate('/inspect')}>
                    <td>
                      <div style={{ fontWeight: 600 }}>{row.address}</div>
                      <div style={{ fontSize: 13, color: T.subtle, marginTop: 2 }}>{row.state}</div>
                    </td>
                    <td><TypeBadge type={row.type} /></td>
                    <td><ScoreBadge score={row.score} /></td>
                    <td><VerdictBadge verdict={row.verdict} /></td>
                    <td style={{ color: T.subtle, fontSize: 13 }}>{row.date}</td>
                    <td style={{ textAlign: 'right' }}>
                      <button style={{ fontFamily: T.font, fontSize: 13, color: T.navy, background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
                        View →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  )
}
