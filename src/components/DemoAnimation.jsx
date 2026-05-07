import { useState, useEffect, useRef } from 'react'

const T = {
  navy:       '#04256C',
  navy2:      '#0F1F3D',
  navyLight:  'rgba(4,37,108,0.07)',
  navyBorder: 'rgba(4,37,108,0.15)',
  green:      '#10B981',
  greenDark:  '#065F46',
  red:        '#EF4444',
  redDark:    '#991B1B',
  muted:      '#64748B',
  subtle:     '#94A3B8',
  border:     '#E2E8F0',
  surface:    '#F8FAFC',
  font:       "'DM Sans', system-ui, sans-serif",
}

const STAGES = [
  { pct: 18,  label: 'Reading document...' },
  { pct: 40,  label: 'Extracting fields...' },
  { pct: 63,  label: 'Identifying risk factors...' },
  { pct: 85,  label: 'Scoring against carrier guidelines...' },
  { pct: 100, label: 'Calculating BindIQ Score...' },
]

// Timings (ms)
const T_ENTRY_SHOW    = 1400   // show entry
const T_DEMO_CLICK    = 1000   // highlight demo card
const T_LOADING_TOTAL = 2800   // total loading time
const T_STAGE_STEP    = T_LOADING_TOTAL / STAGES.length
const T_BIND_SHOW     = 3200   // show bind result
const T_TOGGLE_PAUSE  = 800    // pause before toggle
const T_DECLINE_SHOW  = 3200   // show decline result
const T_RESET_PAUSE   = 600    // fade before reset

const TOTAL_LOOP =
  T_ENTRY_SHOW + T_DEMO_CLICK +
  T_LOADING_TOTAL +
  T_BIND_SHOW + T_TOGGLE_PAUSE +
  T_DECLINE_SHOW + T_RESET_PAUSE

// ── Entry screen ──────────────────────────────────────────────────────────────
function EntryScreen({ demoHighlighted }) {
  const options = [
    { icon: '📄', label: 'Upload PDF',  desc: 'Drop any 4-point or wind mit report' },
    { icon: '📋', label: 'Paste text',  desc: 'Copy-paste the report content' },
    { icon: '⚡', label: 'See a demo',  desc: 'Run extraction on a sample instantly', badge: 'INSTANT' },
  ]
  return (
    <div style={{ padding: '32px 28px', display: 'flex', flexDirection: 'column', gap: 0 }}>
      <div style={{ fontSize: 10, fontWeight: 700, color: T.navy, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>BindIQ Scorer</div>
      <div style={{ fontSize: 20, fontWeight: 800, color: T.navy2, letterSpacing: '-0.02em', marginBottom: 6, lineHeight: 1.2 }}>
        Score an inspection report
      </div>
      <div style={{ fontSize: 13, color: T.muted, marginBottom: 20 }}>
        Upload a 4-point or wind mitigation PDF and get a bind likelihood score in seconds.
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {options.map((opt, i) => {
          const isDemo = i === 2
          const active = isDemo && demoHighlighted
          return (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 14,
              background: active ? T.navyLight : '#fff',
              border: `1.5px solid ${active ? T.navy : T.border}`,
              borderRadius: 12, padding: '14px 16px',
              transition: 'all 0.3s ease',
              transform: active ? 'translateY(-1px)' : 'none',
              boxShadow: active ? '0 4px 16px rgba(4,37,108,0.12)' : 'none',
              cursor: 'pointer',
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                background: active ? T.navyLight : T.surface,
                border: `1px solid ${active ? T.navyBorder : T.border}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 16,
              }}>{opt.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: active ? T.navy : T.navy2, marginBottom: 2 }}>{opt.label}</div>
                <div style={{ fontSize: 12, color: T.muted }}>{opt.desc}</div>
              </div>
              {opt.badge && (
                <span style={{
                  fontSize: 10, fontWeight: 700, letterSpacing: '0.06em',
                  color: '#fff', background: T.navy,
                  padding: '3px 8px', borderRadius: 99,
                }}>
                  {opt.badge}
                </span>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── Loading screen ────────────────────────────────────────────────────────────
function LoadingScreen({ stageIdx }) {
  const stage = STAGES[Math.min(stageIdx, STAGES.length - 1)]
  const prevStage = stageIdx > 0 ? STAGES[stageIdx - 1] : { pct: 0 }
  const pct = stageIdx >= 0 ? stage.pct : 0

  return (
    <div style={{ padding: '48px 28px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 240 }}>
      {/* Spinner */}
      <div style={{
        width: 48, height: 48, borderRadius: '50%',
        border: `3px solid ${T.border}`,
        borderTop: `3px solid ${T.navy}`,
        animation: 'bindiq-spin 0.8s linear infinite',
        marginBottom: 24,
      }} />

      {/* Stage label */}
      <div style={{ fontSize: 14, fontWeight: 600, color: T.navy2, marginBottom: 20, textAlign: 'center', minHeight: 20 }}>
        {stage.label}
      </div>

      {/* Progress bar */}
      <div style={{ width: '100%', maxWidth: 280, height: 3, background: T.border, borderRadius: 99, overflow: 'hidden' }}>
        <div style={{
          height: '100%',
          width: `${pct}%`,
          background: T.navy,
          borderRadius: 99,
          transition: 'width 0.42s ease',
        }} />
      </div>

      <style>{`@keyframes bindiq-spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

// ── Result screen ─────────────────────────────────────────────────────────────
function ResultScreen({ scenario }) {
  const isBind = scenario === 'bind'

  const bind = {
    score: 87, label: 'Likely to Bind',
    bg: 'rgba(16,185,129,0.07)', border: '1.5px solid rgba(16,185,129,0.28)',
    barColor: '#10B981', scoreColor: T.greenDark, dotColor: '#10B981',
    bullets: ['Impact-resistant glazing confirmed', 'Double wraps roof-to-wall attachment'],
    flags: null,
  }
  const decline = {
    score: 25, label: 'Likely Decline',
    bg: 'rgba(239,68,68,0.07)', border: '1.5px solid rgba(239,68,68,0.28)',
    barColor: '#EF4444', scoreColor: T.redDark, dotColor: '#EF4444',
    bullets: null,
    flags: ['Federal Pacific electrical panel', 'Aluminum branch wiring detected', 'Roof age: 28 years'],
  }
  const s = isBind ? bind : decline

  return (
    <div style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Toggle pills */}
      <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
        {['bind', 'decline'].map(v => (
          <div key={v} style={{
            fontSize: 11, fontWeight: 700,
            padding: '5px 14px', borderRadius: 99,
            background: scenario === v ? T.navy : T.surface,
            color: scenario === v ? '#fff' : T.muted,
            border: `1px solid ${scenario === v ? T.navy : T.border}`,
            transition: 'all 0.3s ease',
            cursor: 'pointer',
            letterSpacing: '0.02em',
          }}>
            {v === 'bind' ? 'Likely to Bind' : 'Likely Decline'}
          </div>
        ))}
      </div>

      {/* Score card */}
      <div style={{ borderRadius: 14, padding: '20px 22px', background: s.bg, border: s.border, transition: 'all 0.4s ease' }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: s.scoreColor, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>BindIQ Score</div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 5, marginBottom: 12 }}>
          <span style={{
            fontSize: 56, fontWeight: 800, color: s.scoreColor,
            letterSpacing: '-3px', lineHeight: 1,
            transition: 'color 0.4s ease',
          }}>
            {s.score}
          </span>
          <span style={{ fontSize: 16, fontWeight: 500, color: s.scoreColor, opacity: 0.45 }}>/100</span>
        </div>
        <div style={{ height: 5, background: isBind ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)', borderRadius: 99, overflow: 'hidden', marginBottom: 12 }}>
          <div style={{
            height: '100%', width: `${s.score}%`,
            background: s.barColor, borderRadius: 99,
            transition: 'width 0.5s ease, background 0.4s ease',
          }} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: isBind ? 10 : 0 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: s.dotColor, flexShrink: 0, transition: 'background 0.4s ease' }} />
          <span style={{ fontSize: 13, fontWeight: 700, color: s.scoreColor, transition: 'color 0.4s ease' }}>{s.label}</span>
        </div>

        {/* Bind bullets */}
        {isBind && s.bullets && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {s.bullets.map((b, i) => (
              <div key={i} style={{ fontSize: 12, color: '#065F46', lineHeight: 1.5 }}>
                <span style={{ color: T.green, fontWeight: 700 }}>·</span> {b}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Flags */}
      {!isBind && s.flags && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: T.subtle, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Red Flags</div>
          {s.flags.map((f, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.18)',
              borderRadius: 8, padding: '9px 12px',
            }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#EF4444', flexShrink: 0 }} />
              <span style={{ fontSize: 12, color: '#B91C1C', fontWeight: 500 }}>{f}</span>
            </div>
          ))}
        </div>
      )}

      {/* No flags badge for bind */}
      {isBind && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          background: 'rgba(16,185,129,0.07)', border: '1px solid rgba(16,185,129,0.22)',
          borderRadius: 8, padding: '9px 14px',
        }}>
          <span style={{ fontSize: 14 }}>✓</span>
          <span style={{ fontSize: 12, fontWeight: 600, color: T.greenDark }}>No critical flags found</span>
        </div>
      )}
    </div>
  )
}

// ── Browser chrome frame ───────────────────────────────────────────────────────
function BrowserFrame({ children }) {
  return (
    <div style={{
      borderRadius: 14, overflow: 'hidden',
      border: `1px solid ${T.border}`,
      boxShadow: '0 2px 8px rgba(15,31,61,0.06), 0 12px 40px rgba(15,31,61,0.10)',
      background: '#fff',
      maxWidth: 420,
      width: '100%',
    }}>
      {/* Title bar */}
      <div style={{
        background: T.surface,
        borderBottom: `1px solid ${T.border}`,
        padding: '10px 14px',
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        {/* Traffic lights */}
        <div style={{ display: 'flex', gap: 6 }}>
          {['#FF5F57', '#FEBC2E', '#28C840'].map((c, i) => (
            <div key={i} style={{ width: 10, height: 10, borderRadius: '50%', background: c }} />
          ))}
        </div>
        {/* URL bar */}
        <div style={{
          flex: 1, background: '#fff', border: `1px solid ${T.border}`,
          borderRadius: 6, padding: '4px 10px',
          fontSize: 11, color: T.subtle, fontFamily: T.font,
          display: 'flex', alignItems: 'center', gap: 5,
        }}>
          <span style={{ color: T.green, fontSize: 10 }}>🔒</span>
          usebindiq.com/inspect
        </div>
      </div>

      {/* Content */}
      <div style={{ minHeight: 340 }}>
        {children}
      </div>
    </div>
  )
}

// ── Main export ───────────────────────────────────────────────────────────────
export default function DemoAnimation() {
  const [phase, setPhase]           = useState('entry')   // entry | loading | result
  const [demoHighlighted, setDemo]  = useState(false)
  const [stageIdx, setStageIdx]     = useState(0)
  const [scenario, setScenario]     = useState('bind')
  const [opacity, setOpacity]       = useState(1)
  const timerRef = useRef([])

  function clear() { timerRef.current.forEach(clearTimeout); timerRef.current = [] }
  function after(ms, fn) { const id = setTimeout(fn, ms); timerRef.current.push(id); return id }

  function runLoop() {
    clear()
    let t = 0

    // Entry
    setPhase('entry'); setDemo(false); setOpacity(1)

    after(t + T_DEMO_CLICK, () => setDemo(true))
    t += T_ENTRY_SHOW

    // Loading
    after(t, () => { setPhase('loading'); setStageIdx(0) })
    STAGES.forEach((_, i) => {
      after(t + i * T_STAGE_STEP, () => setStageIdx(i))
    })
    t += T_LOADING_TOTAL

    // Bind result
    after(t, () => { setPhase('result'); setScenario('bind') })
    t += T_BIND_SHOW

    // Pause then toggle to decline
    after(t, () => setScenario('decline'))
    t += T_TOGGLE_PAUSE + T_DECLINE_SHOW

    // Fade out, reset
    after(t, () => setOpacity(0))
    after(t + T_RESET_PAUSE, () => runLoop())
  }

  useEffect(() => {
    runLoop()
    return clear
  }, [])

  return (
    <div style={{ display: 'flex', justifyContent: 'center', transition: 'opacity 0.5s ease', opacity }}>
      <BrowserFrame>
        {phase === 'entry'   && <EntryScreen   demoHighlighted={demoHighlighted} />}
        {phase === 'loading' && <LoadingScreen stageIdx={stageIdx} />}
        {phase === 'result'  && <ResultScreen  scenario={scenario} />}
      </BrowserFrame>
    </div>
  )
}
