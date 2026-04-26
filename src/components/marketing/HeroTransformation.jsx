import { useState, useEffect, useRef, useCallback } from 'react'

const DURATION = 3000

const serif = { fontFamily: "'Instrument Serif', serif" }
const sans = { fontFamily: "'Geist', sans-serif" }

function Pill({ children, variant }) {
  const styles = variant === 'after'
    ? { background: '#EFF6FF', color: '#1D4ED8', border: '1px solid #BFDBFE' }
    : { background: '#F8FAFC', color: '#475569', border: '1px solid #E2E8F0' }
  return (
    <div style={{
      ...sans, ...styles,
      display: 'inline-flex', alignItems: 'center', gap: 6,
      fontSize: 11, fontWeight: 500, padding: '3px 10px',
      borderRadius: 20, marginBottom: 12,
    }}>
      <span style={{
        width: 5, height: 5, borderRadius: '50%', flexShrink: 0,
        background: variant === 'after' ? '#2563EB' : '#94A3B8',
      }} />
      {children}
    </div>
  )
}

function SectionLabel({ children }) {
  return (
    <div style={{
      ...sans, fontSize: 9, fontWeight: 600, textTransform: 'uppercase',
      letterSpacing: '0.10em', color: '#94A3B8',
      paddingBottom: 6, borderBottom: '1px solid #F1F5F9', marginBottom: 6,
    }}>
      {children}
    </div>
  )
}

function BeforePanel() {
  const metrics = [
    { label: 'Sessions', value: '9,241', sub: 'vs 11,249 (Mar)' },
    { label: 'Users', value: '7,108', sub: 'vs 8,632 (Mar)' },
    { label: 'Bounce Rate', value: '64.2%', sub: 'vs 61.8% (Mar)' },
    { label: 'Avg. Session', value: '1m 47s', sub: 'vs 2m 02s (Mar)', small: true },
    { label: 'Goal Comp.', value: '312', sub: 'vs 289 (Mar)' },
    { label: 'Conv. Rate', value: '3.38%', sub: 'vs 2.57% (Mar)' },
    { label: 'New Users', value: '5,904', sub: 'vs 7,211 (Mar)' },
    { label: 'Pages/Session', value: '2.1', sub: 'vs 2.3 (Mar)' },
  ]
  const bars = [90, 76, 94, 70, 60, 65, 82, 46, 42, 37, 33, 29]
  const tableRows = [
    ['google / organic', '3,812', '3,104', '2.9%', '67%'],
    ['google / cpc', '2,641', '2,210', '5.1%', '54%'],
    ['direct / none', '1,544', '1,188', '2.8%', '71%'],
    ['(other)', '1,244', '606', '1.2%', '78%'],
  ]
  const painTags = [
    '3–5 hrs to assemble', 'No narrative',
    'No explanation for the drop', 'Not CFO-readable',
    'AM walks into the call unprepared',
  ]

  return (
    <div>
      <Pill variant="before">Assembled manually — Monarch Plumbing &amp; HVAC, Dallas</Pill>
      <div style={{
        border: '1px solid #E2E8F0', borderRadius: 12,
        overflow: 'hidden', background: '#FAFAF9',
      }}>
        {/* Navy header */}
        <div style={{
          background: '#1E3A5F', padding: '10px 16px',
          display: 'flex', alignItems: 'baseline',
          justifyContent: 'space-between', gap: 12,
        }}>
          <span style={{ ...sans, fontSize: 12, fontWeight: 500, color: '#fff' }}>
            Monthly Performance Report — April 2025
          </span>
          <span style={{ ...sans, fontSize: 10, color: 'rgba(255,255,255,0.45)', whiteSpace: 'nowrap' }}>
            Monarch Plumbing &amp; HVAC · Apex Digital
          </span>
        </div>

        {/* Body */}
        <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 13, background: '#FAFAF9' }}>

          {/* Metrics grid */}
          <div>
            <SectionLabel>Overview metrics — exported from Google Ads</SectionLabel>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6 }}>
              {metrics.map((m) => (
                <div key={m.label} style={{
                  border: '1px solid #F1F5F9', borderRadius: 6,
                  padding: '8px 10px', background: '#FAFAFA',
                }}>
                  <div style={{ ...sans, fontSize: 9, color: '#94A3B8', marginBottom: 2 }}>{m.label}</div>
                  <div style={{ ...sans, fontSize: m.small ? 11 : 14, fontWeight: 500, color: '#334155' }}>{m.value}</div>
                  <div style={{ ...sans, fontSize: 9, color: '#94A3B8', marginTop: 1 }}>{m.sub}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Chart */}
          <div style={{ border: '1px solid #F1F5F9', borderRadius: 6, overflow: 'hidden' }}>
            <div style={{
              background: '#F8FAFC', padding: '6px 12px',
              ...sans, fontSize: 10, color: '#64748B',
              borderBottom: '1px solid #F1F5F9',
            }}>
              Campaigns by channel — screenshot pasted from Google Ads
            </div>
            <div style={{
              padding: '10px 12px', display: 'flex',
              alignItems: 'flex-end', gap: 3, height: 60, background: '#FAFAF9',
            }}>
              {bars.map((h, i) => (
                <div key={i} style={{
                  flex: 1, height: `${h}%`,
                  background: i < 7 ? '#BFDBFE' : '#E2E8F0',
                  borderRadius: '2px 2px 0 0',
                }} />
              ))}
            </div>
          </div>

          {/* Table */}
          <div style={{ border: '1px solid #F1F5F9', borderRadius: 6, overflow: 'hidden' }}>
            <table style={{ width: '100%', fontSize: 10, borderCollapse: 'collapse', tableLayout: 'fixed', ...sans }}>
              <thead>
                <tr>
                  {['Source / Medium', 'Sessions', 'Users', 'Conv.', 'Bounce'].map((h) => (
                    <th key={h} style={{
                      background: '#F8FAFC', color: '#64748B', padding: '5px 9px',
                      textAlign: 'left', fontWeight: 500, fontSize: 9,
                      textTransform: 'uppercase', letterSpacing: '0.06em',
                      borderBottom: '1px solid #F1F5F9',
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tableRows.map((row, i) => (
                  <tr key={i}>
                    {row.map((cell, j) => (
                      <td key={j} style={{
                        padding: '5px 9px', color: '#334155',
                        borderBottom: i < tableRows.length - 1 ? '1px solid #F8FAFC' : 'none',
                      }}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Note */}
          <div style={{
            background: '#F8FAFC', border: '1px solid #F1F5F9',
            borderRadius: 6, padding: '10px 12px',
            ...sans, fontSize: 11, color: '#64748B',
            fontStyle: 'italic', lineHeight: 1.55,
          }}>
            "Traffic was down month over month. Paid continued to perform. Let us know if you have any questions — happy to jump on a call to walk through the numbers."
          </div>

          {/* Pain tags */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
            {painTags.map((t) => (
              <span key={t} style={{
                ...sans, fontSize: 10, padding: '3px 9px', borderRadius: 20,
                background: '#F1F5F9', color: '#475569', border: '1px solid #E2E8F0',
              }}>{t}</span>
            ))}
          </div>

        </div>
      </div>
    </div>
  )
}

function AfterPanel() {
  const explainQuotes = [
    "We improved efficiency this month without increasing your budget.",
    "We're seeing stronger performance from higher-intent search traffic.",
    "The account is becoming more efficient as we refine spend allocation.",
  ]
  const talkingPoints = [
    "This month is about efficiency gains, not just volume.",
    "We're improving how budget is allocated across intent levels.",
    "The account is trending toward higher-quality traffic overall.",
  ]
  const drivers = [
    'Improved efficiency in branded search campaigns',
    'Reduced spend on low-intent keyword traffic',
    'Stronger conversion performance in remarketing segments',
  ]
  const headlineMetrics = [
    'Conversions increased 18%',
    'CPA decreased 11%',
    'Brand campaigns outperformed non-brand traffic',
  ]

  return (
    <div>
      <Pill variant="after">Generated by retainr — Apex Digital, April 2025</Pill>

      <div style={{ border: '1px solid #E2E8F0', borderRadius: 12, overflow: 'hidden', background: '#FAFAF9' }}>
        <div style={{ height: 3, background: '#2563EB' }} />
        <div style={{
          padding: '10px 14px', borderBottom: '1px solid #F1F5F9',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <span style={{ ...sans, fontSize: 11, fontWeight: 500, color: '#1E293B', display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#2563EB', flexShrink: 0 }} />
            Apex Digital · April 2025
          </span>
          <span style={{ ...sans, fontSize: 10, color: '#94A3B8' }}>Monthly Performance Narrative</span>
        </div>

        <div style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 11 }}>

          {/* Narrative summary */}
          <div>
            <div style={{ ...sans, fontSize: 9, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.10em', color: '#94A3B8', marginBottom: 5 }}>
              Monthly Performance Narrative
            </div>
            <div style={{
              ...serif, fontSize: 12.5, fontStyle: 'italic',
              lineHeight: 1.65, color: '#1E293B',
              borderLeft: '2px solid #2563EB', paddingLeft: 10,
            }}>
              "Performance improved this month, driven by stronger efficiency in high-intent campaigns and improved allocation of spend toward converting traffic."
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: '8px 0 0 0', display: 'flex', flexDirection: 'column', gap: 4 }}>
              {headlineMetrics.map((b) => (
                <li key={b} style={{ ...sans, fontSize: 11, color: '#334155', display: 'flex', gap: 6, lineHeight: 1.5 }}>
                  <span style={{ color: '#2563EB', flexShrink: 0 }}>•</span>{b}
                </li>
              ))}
            </ul>
          </div>

          {/* Key takeaway */}
          <div style={{ borderLeft: '2px solid #15803D', background: '#F0FDF4', padding: '8px 10px' }}>
            <div style={{ ...sans, fontSize: 9, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.10em', color: '#15803D', marginBottom: 3 }}>Key takeaway</div>
            <div style={{ ...sans, fontSize: 11, lineHeight: 1.5, color: '#14532D' }}>
              Performance gains were driven by efficiency improvements rather than increased spend.
            </div>
          </div>

          {/* What drove changes */}
          <div>
            <div style={{ ...sans, fontSize: 9, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.10em', color: '#94A3B8', marginBottom: 5 }}>
              What drove performance changes
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
              {drivers.map((b) => (
                <li key={b} style={{ ...sans, fontSize: 11, color: '#334155', display: 'flex', gap: 6, lineHeight: 1.5 }}>
                  <span style={{ color: '#94A3B8', flexShrink: 0 }}>→</span>{b}
                </li>
              ))}
            </ul>
          </div>

          {/* How to explain to client */}
          <div style={{ borderLeft: '2px solid #2563EB', background: '#EFF6FF', padding: '8px 10px' }}>
            <div style={{ ...sans, fontSize: 9, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.10em', color: '#1D4ED8', marginBottom: 5 }}>How to explain this to the client</div>
            {explainQuotes.map((q) => (
              <div key={q} style={{ ...serif, fontSize: 12, fontStyle: 'italic', lineHeight: 1.55, color: '#1E3A5F', marginTop: 4 }}>
                "{q}"
              </div>
            ))}
          </div>

          {/* Talking points */}
          <div style={{ borderLeft: '2px solid #D97706', background: '#FFFBEB', padding: '8px 10px' }}>
            <div style={{ ...sans, fontSize: 9, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.10em', color: '#B45309', marginBottom: 5 }}>Talking points for client calls</div>
            {talkingPoints.map((t) => (
              <div key={t} style={{ ...sans, fontSize: 11, lineHeight: 1.5, color: '#78350F', marginTop: 3, display: 'flex', gap: 6 }}>
                <span style={{ color: '#D97706', flexShrink: 0 }}>›</span>"{t}"
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* CTA under sample report */}
      <div style={{ marginTop: 12, textAlign: 'center' }}>
        <a href="/login" style={{
          ...sans, display: 'inline-flex', alignItems: 'center', gap: 6,
          fontSize: 12, fontWeight: 500, color: '#1D4ED8',
          textDecoration: 'none', padding: '8px 14px',
          background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: 8,
        }}>
          Generate a report like this for your account →
        </a>
      </div>
    </div>
  )
}

export default function HeroTransformation() {
  const [active, setActive] = useState('before')
  const [paused, setPaused] = useState(false)
  const [progress, setProgress] = useState(0)
  const timerRef = useRef(null)
  const animRef = useRef(null)
  const startRef = useRef(null)

  const startProgress = useCallback(() => {
    setProgress(0)
    startRef.current = performance.now()
    const tick = (now) => {
      const elapsed = now - startRef.current
      const pct = Math.min((elapsed / DURATION) * 100, 100)
      setProgress(pct)
      if (pct < 100) {
        animRef.current = requestAnimationFrame(tick)
      }
    }
    animRef.current = requestAnimationFrame(tick)
    timerRef.current = setTimeout(() => {
      setActive((prev) => (prev === 'before' ? 'after' : 'before'))
    }, DURATION)
  }, [])

  const stopAll = useCallback(() => {
    clearTimeout(timerRef.current)
    cancelAnimationFrame(animRef.current)
  }, [])

  useEffect(() => {
    if (!paused) {
      startProgress()
    }
    return stopAll
  }, [active, paused, startProgress, stopAll])

  const handleSwitch = (panel) => {
    stopAll()
    setPaused(true)
    setProgress(0)
    setActive(panel)
  }

  return (
    <div
      style={{ background: '#FAFAF9', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 12, padding: 16, overflow: 'hidden', cursor: 'pointer' }}
      onClick={() => document.getElementById('comparison')?.scrollIntoView({ behavior: 'smooth' })}
    >

      {/* Toggle row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{ display: 'flex', border: '1px solid #DBEAFE', borderRadius: 8, overflow: 'hidden' }}>
          {[
            { key: 'before', label: 'What agencies send today' },
            { key: 'after', label: 'What retainr generates' },
          ].map((btn, i) => (
            <button
              key={btn.key}
              onClick={() => handleSwitch(btn.key)}
              style={{
                ...sans, fontSize: 12, fontWeight: 500,
                padding: '7px 14px', border: 'none', cursor: 'pointer',
                borderRight: i === 0 ? '1px solid #DBEAFE' : 'none',
                background: active === btn.key ? '#EFF6FF' : '#fff',
                color: active === btn.key ? '#1D4ED8' : '#6B7280',
                transition: 'background 0.2s, color 0.2s',
              }}
            >
              {btn.label}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ ...sans, fontSize: 10, color: '#94A3B8' }}>
            {paused ? 'paused' : 'auto-switching'}
          </span>
          <div style={{ width: 80, height: 3, background: '#F1F5F9', borderRadius: 2, overflow: 'hidden' }}>
            <div style={{ width: `${progress}%`, height: '100%', background: '#2563EB', borderRadius: 2 }} />
          </div>
        </div>
      </div>

      {/* Panels — CSS grid overlap keeps both panels same height */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gridTemplateRows: '1fr' }}>
        <div style={{
          gridColumn: 1, gridRow: 1,
          opacity: active === 'before' ? 1 : 0,
          transition: 'opacity 0.4s ease',
          pointerEvents: active === 'before' ? 'auto' : 'none',
          visibility: active === 'before' ? 'visible' : 'hidden',
        }}>
          <BeforePanel />
        </div>
        <div style={{
          gridColumn: 1, gridRow: 1,
          opacity: active === 'after' ? 1 : 0,
          transition: 'opacity 0.4s ease',
          pointerEvents: active === 'after' ? 'auto' : 'none',
          visibility: active === 'after' ? 'visible' : 'hidden',
        }}>
          <AfterPanel />
        </div>
      </div>

    </div>
  )
}
