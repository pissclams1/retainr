import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'

const serif = { fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }
const sans = { fontFamily: "'Inter', system-ui, sans-serif" }

/* ────────── Canonical demo report (matches landing hero exactly) ────────── */

const DEMO_REPORT = {
  client: 'Apex Digital',
  period: 'April 2025',
  generatedAt: 'April 26, 2026',
  narrative: 'Performance improved this month, driven by stronger efficiency in high-intent campaigns and improved allocation of spend toward converting traffic.',
  headlineMetrics: [
    'Conversions increased 18%',
    'CPA decreased 11%',
    'Brand campaigns outperformed non-brand traffic',
  ],
  keyTakeaway: 'Performance gains were driven by efficiency improvements rather than increased spend.',
  drivers: [
    'Improved efficiency in branded search campaigns',
    'Reduced spend on low-intent keyword traffic',
    'Stronger conversion performance in remarketing segments',
  ],
  explainQuotes: [
    'We improved efficiency this month without increasing your budget.',
    "We're seeing stronger performance from higher-intent search traffic.",
    'The account is becoming more efficient as we refine spend allocation.',
  ],
  talkingPoints: [
    'This month is about efficiency gains, not just volume.',
    "We're improving how budget is allocated across intent levels.",
    'The account is trending toward higher-quality traffic overall.',
  ],
}

/* ────────── Page ────────── */

export default function ReportViewPage() {
  const { id } = useParams()
  const isDemo = id && id.startsWith('demo')

  const [report, setReport] = useState(null)
  const [status, setStatus] = useState(isDemo ? 'demo' : 'loading')

  useEffect(() => {
    if (isDemo) return
    supabase
      .from('reports')
      .select('period_month, generated_at, client_report_html, client_name')
      .eq('id', id)
      .single()
      .then(({ data, error }) => {
        if (error || !data) { setStatus('not_found'); return }
        if (!data.client_report_html) { setStatus('not_ready'); return }
        setReport(data)
        setStatus('ready')
      })
  }, [id, isDemo])

  if (status === 'loading') return <Shell><CenterMsg primary="Loading report…" /></Shell>
  if (status === 'not_found') return <Shell><CenterMsg primary="Report not found" sub="This link may be invalid or the report may have been removed." /></Shell>
  if (status === 'not_ready') return <Shell><CenterMsg primary="Report is being generated" sub="Check back in a moment — this usually takes under a minute." /></Shell>

  return (
    <Shell>
      {status === 'demo' ? (
        <ReportDocument report={DEMO_REPORT} />
      ) : (
        <RealReportDocument report={report} />
      )}
    </Shell>
  )
}

/* ────────── Shell with brand bar + share/copy/download action bar ────────── */

function Shell({ children }) {
  return (
    <div style={{ minHeight: '100vh', background: '#ffffff', display: 'flex', flexDirection: 'column' }}>
      <BrandBar />
      <ActionBar />
      <div style={{ flex: 1 }}>{children}</div>
      <Footer />
    </div>
  )
}

function BrandBar() {
  return (
    <div style={{
      borderBottom: '1px solid var(--border)',
      padding: '14px 24px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      background: '#ffffff',
      position: 'sticky', top: 0, zIndex: 10,
    }}>
      <a href="/" style={{ ...serif, fontSize: 18, color: 'var(--ink)', letterSpacing: '-0.3px', textDecoration: 'none' }}>
        retainr
      </a>
      <span style={{ ...sans, fontSize: 11, color: 'var(--ink-5)' }}>
        Read-only · client view
      </span>
    </div>
  )
}

function ActionBar() {
  const [copied, setCopied] = useState(false)
  const [emailCopied, setEmailCopied] = useState(false)

  const url = typeof window !== 'undefined' ? window.location.href : ''

  const copyShare = async () => {
    try { await navigator.clipboard.writeText(url) } catch {}
    setCopied(true); setTimeout(() => setCopied(false), 1800)
  }

  const copyEmail = async () => {
    const body = formatEmailBody(DEMO_REPORT, url)
    try { await navigator.clipboard.writeText(body) } catch {}
    setEmailCopied(true); setTimeout(() => setEmailCopied(false), 1800)
  }

  const downloadPdf = () => alert('PDF download stub')

  return (
    <div style={{
      borderBottom: '1px solid var(--border)',
      background: '#FAFAF9',
      padding: '10px 24px',
      display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center', justifyContent: 'flex-end',
    }}>
      <button onClick={downloadPdf} style={btnPrimary}>↓ Download PDF</button>
      <button onClick={copyEmail} style={btnGhost}>
        {emailCopied ? '✓ Email copied' : '✉ Copy to client email'}
      </button>
      <button onClick={copyShare} style={btnGhost}>
        {copied ? '✓ Link copied' : '↗ Copy share link'}
      </button>
    </div>
  )
}

function Footer() {
  return (
    <div style={{
      borderTop: '1px solid var(--border)',
      padding: '18px 24px',
      textAlign: 'center', background: '#ffffff',
    }}>
      <p style={{ ...sans, fontSize: 11, color: 'var(--ink-5)' }}>
        Prepared with <a href="/" style={{ ...serif, fontSize: 12, color: 'var(--ink-4)', textDecoration: 'none' }}>retainr</a>
        {' '}— performance communication for agency teams
      </p>
    </div>
  )
}

function CenterMsg({ primary, sub }) {
  return (
    <div style={{ textAlign: 'center', padding: '80px 24px' }}>
      <p style={{ ...serif, fontSize: 24, color: 'var(--ink-4)', marginBottom: 8 }}>{primary}</p>
      {sub && <p style={{ ...sans, fontSize: 13, color: 'var(--ink-5)' }}>{sub}</p>}
    </div>
  )
}

/* ────────── Document renderers ────────── */

function ReportDocument({ report }) {
  return (
    <div style={{ maxWidth: 760, margin: '0 auto', padding: '48px 24px 80px' }}>
      <DocHeader client={report.client} period={report.period} generatedAt={report.generatedAt} />
      <Narrative report={report} />
      <Section
        eyebrow="What drove performance changes"
        items={report.drivers}
        bullet={<span style={{ color: '#94A3B8' }}>→</span>}
      />
      <CalloutBlock
        eyebrow="How to explain this to the client"
        eyebrowColor="#1D4ED8"
        accent="#2563EB"
        bg="#EFF6FF"
        items={report.explainQuotes}
        renderItem={(q) => (
          <div style={{ ...serif, fontSize: 16, fontStyle: 'italic', lineHeight: 1.65, color: '#1E3A5F', marginTop: 6 }}>
            "{q}"
          </div>
        )}
      />
      <CalloutBlock
        eyebrow="Client meeting talking points"
        eyebrowColor="#B45309"
        accent="#D97706"
        bg="#FFFBEB"
        items={report.talkingPoints}
        renderItem={(t) => (
          <div style={{ ...sans, fontSize: 14, lineHeight: 1.6, color: '#78350F', marginTop: 6, display: 'flex', gap: 8 }}>
            <span style={{ color: '#D97706', flexShrink: 0 }}>›</span>"{t}"
          </div>
        )}
      />
    </div>
  )
}

function DocHeader({ client, period, generatedAt }) {
  return (
    <header style={{ marginBottom: 36, paddingBottom: 20, borderBottom: '1px solid var(--border)' }}>
      <div style={{ ...sans, fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.10em', color: '#94A3B8', marginBottom: 8 }}>
        Monthly performance report · {period}
      </div>
      <h1 style={{ ...serif, fontSize: 38, fontWeight: 400, color: '#1A1A18', lineHeight: 1.15, marginBottom: 8 }}>
        {client}
      </h1>
      <div style={{ ...sans, fontSize: 13, color: 'var(--ink-5)' }}>Generated {generatedAt} · Read-only client view</div>
    </header>
  )
}

function Narrative({ report }) {
  return (
    <section style={{ marginBottom: 32 }}>
      <Eyebrow>Monthly Performance Narrative</Eyebrow>
      <p style={{
        ...serif, fontSize: 18, fontStyle: 'italic',
        lineHeight: 1.7, color: '#1E293B',
        borderLeft: '3px solid #2563EB', paddingLeft: 16,
        margin: '12px 0 0 0',
      }}>
        "{report.narrative}"
      </p>
      <ul style={{ listStyle: 'none', padding: 0, margin: '18px 0 0 0', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {report.headlineMetrics.map((b) => (
          <li key={b} style={{ ...sans, fontSize: 14, color: '#334155', display: 'flex', gap: 10, lineHeight: 1.6 }}>
            <span style={{ color: '#2563EB' }}>•</span>{b}
          </li>
        ))}
      </ul>
      <div style={{
        marginTop: 18,
        borderLeft: '3px solid #15803D', background: '#F0FDF4',
        padding: '14px 18px',
      }}>
        <Eyebrow color="#15803D">Key takeaway</Eyebrow>
        <div style={{ ...sans, fontSize: 14, color: '#14532D', lineHeight: 1.6, marginTop: 4 }}>
          {report.keyTakeaway}
        </div>
      </div>
    </section>
  )
}

function Section({ eyebrow, items, bullet }) {
  return (
    <section style={{ marginBottom: 32 }}>
      <Eyebrow>{eyebrow}</Eyebrow>
      <ul style={{ listStyle: 'none', padding: 0, margin: '12px 0 0 0', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {items.map((item) => (
          <li key={item} style={{ ...sans, fontSize: 14, color: '#334155', display: 'flex', gap: 10, lineHeight: 1.6 }}>
            {bullet}
            {item}
          </li>
        ))}
      </ul>
    </section>
  )
}

function CalloutBlock({ eyebrow, eyebrowColor, accent, bg, items, renderItem }) {
  return (
    <section style={{
      marginBottom: 32,
      borderLeft: `3px solid ${accent}`, background: bg,
      padding: '16px 20px',
    }}>
      <Eyebrow color={eyebrowColor}>{eyebrow}</Eyebrow>
      {items.map((it) => <div key={it}>{renderItem(it)}</div>)}
    </section>
  )
}

function Eyebrow({ color = '#94A3B8', children }) {
  return (
    <div style={{
      ...sans, fontSize: 10, fontWeight: 600,
      textTransform: 'uppercase', letterSpacing: '0.10em', color,
    }}>
      {children}
    </div>
  )
}

/* Real DB-backed report path: keep dangerouslySetInnerHTML for production */
function RealReportDocument({ report }) {
  return (
    <div style={{ maxWidth: 760, margin: '0 auto', padding: '48px 24px 80px' }}>
      <DocHeader
        client={report.client_name || 'Client report'}
        period={report.period_month}
        generatedAt={new Date(report.generated_at).toLocaleDateString()}
      />
      <div dangerouslySetInnerHTML={{ __html: report.client_report_html }} />
    </div>
  )
}

/* ────────── Helpers ────────── */

function formatEmailBody(r, url) {
  return [
    `Subject: ${r.client} — ${r.period} performance report`,
    '',
    `Hi,`,
    '',
    `Here's your ${r.period} performance summary:`,
    '',
    `"${r.narrative}"`,
    '',
    ...r.headlineMetrics.map((b) => `• ${b}`),
    '',
    `Key takeaway: ${r.keyTakeaway}`,
    '',
    `Full report (read-only): ${url}`,
    '',
    `Happy to walk through it on our next call.`,
    '',
    `— [Your name]`,
  ].join('\n')
}

const btnBase = {
  ...sans, fontSize: 12, fontWeight: 500,
  height: 32, padding: '0 14px',
  borderRadius: 7, cursor: 'pointer',
  display: 'inline-flex', alignItems: 'center', gap: 6,
  border: '1px solid transparent',
}
const btnPrimary = { ...btnBase, background: '#1A1A18', color: '#F5F5F3' }
const btnGhost = { ...btnBase, background: '#FFFFFF', color: '#1A1A18', borderColor: 'var(--border)' }
