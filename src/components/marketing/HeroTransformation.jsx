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
            <SectionLabel>Overview metrics — exported from GA4</SectionLabel>
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
              Traffic by channel — screenshot pasted from GA4
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
            &quot;Traffic was down month over month. Paid continued to perform. Let us know if you have any questions — happy to jump on a call to walk through the numbers.&quot;
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
  return (
    <div>
      <Pill variant="after">Generated by retainr — Monarch Plumbing &amp; HVAC, Dallas</Pill>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>

        {/* Client report */}
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
            <span style={{ ...sans, fontSize: 10, color: '#94A3B8' }}>Monarch Plumbing &amp; HVAC</span>
          </div>
          <div style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 11 }}>

            {/* Exec summary */}
            <div>
              <div style={{ ...sans, fontSize: 9, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.10em', color: '#94A3B8', marginBottom: 5 }}>
                Executive summary
              </div>
              <div style={{
                ...serif, fontSize: 12.5, fontStyle: 'italic',
                lineHeight: 1.65, color: '#1E293B',
                borderLeft: '2px solid #2563EB', paddingLeft: 10,
              }}>
                &quot;April&apos;s paid campaigns delivered your best conversion rate in five months at 5.1%, adding 135 more booked jobs than March. Organic softened 18% following a Google core update affecting local service pages across Dallas — the affected pages are identified and repair begins this week. The retainer is earning its return on paid; organic is the near-term watch item.&quot;
              </div>
            </div>

            {/* Channel bars */}
            <div>
              <div style={{ ...sans, fontSize: 9, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.10em', color: '#94A3B8', marginBottom: 5 }}>
                Channel performance
              </div>
              {[
                { name: 'Paid search', pct: 90, color: '#2563EB', delta: '+18%', deltaColor: '#15803D' },
                { name: 'Direct', pct: 58, color: '#93C5FD', delta: '+3%', deltaColor: '#64748B' },
                { name: 'Organic', pct: 34, color: '#BFDBFE', delta: '−18%', deltaColor: '#DC2626' },
              ].map((ch) => (
                <div key={ch.name} style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 5 }}>
                  <span style={{ ...sans, fontSize: 10, color: '#64748B', width: 60, flexShrink: 0 }}>{ch.name}</span>
                  <div style={{ flex: 1, height: 4, background: '#EFF6FF', borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{ width: `${ch.pct}%`, height: '100%', background: ch.color, borderRadius: 3 }} />
                  </div>
                  <span style={{ ...sans, fontSize: 10, fontWeight: 500, color: ch.deltaColor, minWidth: 28, textAlign: 'right' }}>{ch.delta}</span>
                </div>
              ))}
            </div>

            {/* Metric chips */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 5 }}>
              {[
                { label: 'Sessions', value: '9,241', delta: '−18% MoM', up: false },
                { label: 'Booked Jobs', value: '312', delta: '+8% MoM', up: true },
                { label: 'Conv. Rate', value: '5.1%', delta: '+2.5pp', up: true },
              ].map((m) => (
                <div key={m.label} style={{ background: '#F8FAFC', border: '1px solid #F1F5F9', borderRadius: 6, padding: '7px 9px' }}>
                  <div style={{ ...sans, fontSize: 9, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 3 }}>{m.label}</div>
                  <div style={{ ...serif, fontSize: 18, color: '#1E293B', lineHeight: 1 }}>{m.value}</div>
                  <div style={{ ...sans, fontSize: 10, fontWeight: 500, marginTop: 2, color: m.up ? '#15803D' : '#DC2626' }}>{m.delta}</div>
                </div>
              ))}
            </div>

          </div>
        </div>

        {/* Briefing card */}
        <div style={{ border: '1px solid #E2E8F0', borderRadius: 12, overflow: 'hidden', background: '#FAFAF9' }}>
          <div style={{
            padding: '10px 14px', borderBottom: '1px solid #F1F5F9',
            background: '#F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <div>
              <div style={{ ...sans, fontSize: 9, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.10em', color: '#94A3B8' }}>Internal briefing</div>
              <div style={{ ...sans, fontSize: 12, fontWeight: 500, color: '#1E293B', marginTop: 1 }}>Monarch Plumbing · call Friday</div>
            </div>
            <div style={{
              width: 36, height: 36, borderRadius: '50%',
              border: '2px solid #2563EB',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              ...serif, fontSize: 14, color: '#2563EB', flexShrink: 0,
            }}>71</div>
          </div>
          <div style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 8 }}>

            {/* Watch for */}
            <div style={{ borderLeft: '2px solid #D97706', background: '#FFFBEB', padding: '8px 10px' }}>
              <div style={{ ...sans, fontSize: 9, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.10em', color: '#B45309', marginBottom: 3 }}>Watch for</div>
              <div style={{ ...sans, fontSize: 11, lineHeight: 1.5, color: '#78350F' }}>Organic down 18% — they will open with this. Have the Google core update explanation ready before they ask.</div>
            </div>

            {/* Lead with */}
            <div style={{ borderLeft: '2px solid #15803D', background: '#F0FDF4', padding: '8px 10px' }}>
              <div style={{ ...sans, fontSize: 9, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.10em', color: '#15803D', marginBottom: 3 }}>Lead with</div>
              <div style={{ ...sans, fontSize: 11, lineHeight: 1.5, color: '#14532D' }}>Best conversion rate in 5 months. Paid added 135 more booked jobs vs. March despite fewer clicks.</div>
            </div>

            {/* Script */}
            <div style={{ border: '1px solid #DBEAFE', borderRadius: 6, background: '#EFF6FF', padding: '8px 10px' }}>
              <div style={{ ...sans, fontSize: 9, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.10em', color: '#3B82F6', marginBottom: 4 }}>Suggested script</div>
              <div style={{ ...serif, fontSize: 12, fontStyle: 'italic', lineHeight: 1.6, color: '#1E3A5F' }}>
                &quot;Before we get into the organic numbers — your paid campaigns just hit the best conversion rate we&apos;ve seen all year. I want to make sure we cover that first.&quot;
              </div>
            </div>

            {/* Commitments */}
            <div>
              <div style={{ ...sans, fontSize: 9, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.10em', color: '#94A3B8', marginBottom: 5 }}>Open commitments</div>
              {[
                { text: 'GMB citation audit — completed Apr 12', done: true },
                { text: 'Landing page rebuild — in progress, due May 1', done: false },
                { text: 'Schema markup — due Apr 30', done: false },
              ].map((c, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                  <span style={{ width: 5, height: 5, borderRadius: '50%', flexShrink: 0, background: c.done ? '#15803D' : '#D97706' }} />
                  <span style={{ ...sans, fontSize: 10, color: '#64748B' }}>{c.text}</span>
                </div>
              ))}
            </div>

          </div>
        </div>

      </div>

      {/* Captions */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 12 }}>
        {[
          { title: 'Client-facing report', body: 'Your agency name, your brand color. Executive summary a CFO reads in 20 seconds. Shareable link, no login needed.' },
          { title: 'Internal briefing card', body: 'Concern first, always. Win ready to speak. Script written. Commitments tracked.' },
        ].map((c) => (
          <div key={c.title} style={{ padding: '10px 12px', border: '1px solid #DBEAFE', borderRadius: 8, background: '#F8FAFC' }}>
            <strong style={{ ...sans, fontSize: 11, fontWeight: 600, color: '#1E3A5F', display: 'block', marginBottom: 2 }}>{c.title}</strong>
            <span style={{ ...sans, fontSize: 11, color: '#64748B', lineHeight: 1.5 }}>{c.body}</span>
          </div>
        ))}
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
    <div style={{ background: '#FAFAF9', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 12, padding: 16, overflow: 'hidden' }}>

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
