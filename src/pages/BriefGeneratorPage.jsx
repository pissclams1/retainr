import { useState, useRef, useCallback, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'

const F = { sans: { fontFamily: "'DM Sans', system-ui, -apple-system, sans-serif" } }

const C = {
  bg:       '#F8FAFC',
  bg2:      '#FFFFFF',
  text:     '#0F1F3D',
  muted:    '#64748B',
  subtle:   '#94A3B8',
  border:   '#E2E8F0',
  accent:   '#04256c',
  positive: '#10B981',
  amber:    '#F59E0B',
  danger:   '#EF4444',
}

const PAGE_CSS = `
  html, body { background: ${C.bg}; }
  * { box-sizing: border-box; }

  .bg-nav { background: rgba(255,255,255,0.92); border-bottom: 1px solid ${C.border}; backdrop-filter: blur(12px); }

  .bg-textarea { width: 100%; padding: 16px; font-family: 'DM Sans', sans-serif; font-size: 14px; line-height: 1.7; color: ${C.text}; background: ${C.bg2}; border: 1.5px solid ${C.border}; border-radius: 10px; resize: vertical; outline: none; transition: border-color 0.15s; min-height: 220px; }
  .bg-textarea:focus { border-color: rgba(4,37,108,0.40); }
  .bg-textarea::placeholder { color: ${C.subtle}; }

  .bg-btn-primary { background: ${C.accent}; color: #fff; border: none; border-radius: 10px; font-family: 'DM Sans', sans-serif; font-size: 16px; font-weight: 700; padding: 16px 36px; cursor: pointer; transition: opacity 0.15s, box-shadow 0.15s; box-shadow: 0 4px 16px rgba(4,37,108,0.35); width: 100%; display: flex; align-items: center; justify-content: center; gap: 10px; }
  .bg-btn-primary:hover:not(:disabled) { opacity: 0.92; }
  .bg-btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }

  .bg-btn-outline { padding: 9px 18px; border-radius: 8px; border: 1.5px solid ${C.border}; background: ${C.bg2}; font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 600; color: ${C.muted}; cursor: pointer; transition: all 0.15s; }
  .bg-btn-outline:hover { border-color: ${C.accent}; color: ${C.accent}; }
  .bg-btn-outline.active { border-color: ${C.accent}; color: ${C.accent}; background: rgba(4,37,108,0.05); }

  .bg-dropzone { border: 2px dashed ${C.border}; border-radius: 10px; padding: 40px; text-align: center; cursor: pointer; transition: all 0.15s; }
  .bg-dropzone:hover, .bg-dropzone.drag-over { border-color: rgba(4,37,108,0.40); background: rgba(4,37,108,0.03); }

  .bg-spinner { width: 20px; height: 20px; border: 2.5px solid rgba(255,255,255,0.3); border-top-color: #fff; border-radius: 50%; animation: bgspin 0.7s linear infinite; }
  @keyframes bgspin { to { transform: rotate(360deg); } }

  .bg-progress-bar { height: 3px; background: ${C.border}; border-radius: 2px; overflow: hidden; }
  .bg-progress-fill { height: 100%; background: ${C.accent}; border-radius: 2px; transition: width 0.6s ease; }

  .entry-card { background: ${C.bg2}; border: 1.5px solid ${C.border}; border-radius: 14px; padding: 24px 28px; cursor: pointer; text-align: left; width: 100%; transition: border-color 0.18s, box-shadow 0.18s, transform 0.12s; display: flex; align-items: flex-start; gap: 18px; }
  .entry-card:hover { border-color: rgba(4,37,108,0.35); box-shadow: 0 6px 28px rgba(4,37,108,0.10); transform: translateY(-1px); }
  .entry-card:active { transform: translateY(0); }

  .brief-metric { background: ${C.bg}; border: 1px solid ${C.border}; border-radius: 10px; padding: 14px 16px; }
  .brief-section { background: ${C.bg2}; border: 1px solid ${C.border}; border-radius: 12px; padding: 22px 24px; }
  .brief-section.accent { border-color: rgba(4,37,108,0.18); background: rgba(4,37,108,0.025); }
  .brief-win-item { display: flex; align-items: flex-start; gap: 10px; padding: 10px 0; border-bottom: 1px solid ${C.border}; }
  .brief-win-item:last-child { border-bottom: none; padding-bottom: 0; }

  .copy-btn { padding: 5px 12px; border-radius: 6px; border: 1px solid ${C.border}; background: ${C.bg2}; font-family: 'DM Sans', sans-serif; font-size: 11px; font-weight: 600; color: ${C.muted}; cursor: pointer; transition: all 0.15s; }
  .copy-btn:hover { border-color: ${C.accent}; color: ${C.accent}; }
  .copy-btn.copied { border-color: ${C.positive}; color: ${C.positive}; }

  @media (max-width: 640px) {
    .bg-btn-primary { font-size: 15px; padding: 14px 24px; }
    .entry-card { padding: 18px 20px; gap: 14px; }
  }
`

const SAMPLE_REPORT = `CLIENT: Bright Spark Media
PERIOD: April 1–28, 2025
CHANNEL: Google Ads

CAMPAIGN PERFORMANCE SUMMARY
Total Spend: $14,820
Total Clicks: 9,340
Total Impressions: 218,500
Average CPC: $1.59
Total Conversions: 187
Cost Per Conversion: $79.25
Conversion Rate: 2.00%
Total Revenue Attributed: $312,500
ROAS: 21.08x

MoM CHANGES
Spend: +$1,200 (+8.8%)
Conversions: +35 (+23.1%)
CPC: -$0.14 (-8.1%)
ROAS: +2.1x

TOP CAMPAIGNS
Search – Brand: 82 conv, $58 CPA, 28.4x ROAS
Search – Non-Brand: 61 conv, $91 CPA, 14.2x ROAS
Shopping – All Products: 44 conv, $87 CPA, 18.6x ROAS

ISSUES
Brand CTR dropped from 13.1% to 11.2% (seasonal, monitoring)`

/* ─── Entry screen ─── */

function EntryScreen({ onSelect }) {
  const OPTIONS = [
    { id: 'upload', icon: '📎', label: 'Upload report', desc: 'PDF, CSV, Excel — any export from your ad platform' },
    { id: 'paste',  icon: '📋', label: 'Paste report',  desc: 'Copy and paste data from any source or export' },
    { id: 'sample', icon: '⚡', label: 'See a demo',    desc: 'Generate a brief from a sample report instantly', badge: 'Instant' },
  ]
  return (
    <div style={{ maxWidth: 560, margin: '0 auto', padding: '0 20px' }}>
      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <div style={{ ...F.sans, fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', color: C.accent, textTransform: 'uppercase', marginBottom: 10 }}>Client Brief Generator</div>
        <h1 style={{ ...F.sans, fontSize: 30, fontWeight: 800, color: C.text, margin: 0, marginBottom: 10, letterSpacing: '-0.02em' }}>
          Generate a client brief
        </h1>
        <p style={{ ...F.sans, fontSize: 15, color: C.muted, margin: 0, lineHeight: 1.6 }}>
          Paste any performance report. Get a clean brief your client can read in 2 minutes.
        </p>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {OPTIONS.map(opt => (
          <button key={opt.id} className="entry-card" onClick={() => onSelect(opt.id)}>
            <span style={{ fontSize: 28, flexShrink: 0, lineHeight: 1 }}>{opt.icon}</span>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <span style={{ ...F.sans, fontSize: 16, fontWeight: 700, color: C.text }}>{opt.label}</span>
                {opt.badge && <span style={{ ...F.sans, fontSize: 10, fontWeight: 700, color: '#fff', background: C.accent, padding: '2px 8px', borderRadius: 10 }}>{opt.badge}</span>}
              </div>
              <span style={{ ...F.sans, fontSize: 13, color: C.muted, lineHeight: 1.5 }}>{opt.desc}</span>
            </div>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, marginTop: 4 }}>
              <path d="M6 3l5 5-5 5" stroke={C.subtle} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        ))}
      </div>
      <p style={{ ...F.sans, fontSize: 13, color: C.subtle, textAlign: 'center', marginTop: 24 }}>
        No account required · Works with any ad platform
      </p>
    </div>
  )
}

/* ─── Input view ─── */

function InputView({ initialMode, autoGenerate, onResult }) {
  const [mode, setMode] = useState(initialMode === 'upload' ? 'upload' : 'paste')
  const [text, setText] = useState(initialMode === 'sample' ? SAMPLE_REPORT : '')
  const [clientName, setClientName] = useState(initialMode === 'sample' ? 'Bright Spark Media' : '')
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [stage, setStage] = useState('')
  const [error, setError] = useState(null)
  const [dragging, setDragging] = useState(false)
  const fileRef = useRef(null)
  const autoFired = useRef(false)
  const timers = useRef([])

  const STAGES = [
    { pct: 12, label: 'Reading report data...' },
    { pct: 28, label: 'Extracting performance signals...' },
    { pct: 46, label: 'Writing performance summary...' },
    { pct: 62, label: 'Framing key wins...' },
    { pct: 76, label: 'Drafting next steps...' },
    { pct: 88, label: 'Finalising brief...' },
    { pct: 93, label: 'Almost there...' },
  ]
  const DELAYS = [800, 3000, 6000, 10000, 15000, 21000, 27000]

  function startProgress() {
    timers.current.forEach(clearTimeout)
    timers.current = []
    setProgress(0)
    setStage(STAGES[0].label)
    STAGES.forEach((s, i) => {
      const t = setTimeout(() => { setProgress(s.pct); setStage(s.label) }, DELAYS[i])
      timers.current.push(t)
    })
  }

  function stopProgress() {
    timers.current.forEach(clearTimeout)
    timers.current = []
  }

  const generate = useCallback(async (overrideText) => {
    const raw = (overrideText ?? text).trim()
    if (!raw || raw.length < 20) { setError('Please paste a longer report first.'); return }
    setError(null)
    setLoading(true)
    startProgress()
    try {
      const { data, error: fnErr } = await supabase.functions.invoke('generate-script', {
        body: { rawText: raw, clientName: clientName.trim() || undefined },
      })
      if (fnErr) throw new Error(fnErr.message)
      if (data?.error) throw new Error(data.error)
      stopProgress()
      setProgress(100)
      await new Promise(r => setTimeout(r, 300))
      onResult(data.script, clientName.trim(), raw)
    } catch (e) {
      stopProgress()
      setError(e.message || 'Something went wrong. Please try again.')
      setLoading(false)
      setProgress(0)
    }
  }, [text, clientName, onResult])

  useEffect(() => {
    if (autoGenerate && !autoFired.current) {
      autoFired.current = true
      const t = setTimeout(() => generate(SAMPLE_REPORT), 400)
      return () => clearTimeout(t)
    }
  }, [autoGenerate, generate])

  function handleFile(file) {
    if (!file) return
    const reader = new FileReader()
    reader.onload = e => { setText(e.target.result); setMode('paste') }
    reader.readAsText(file)
  }

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: '0 20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28 }}>
        <div style={{ ...F.sans, fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', color: C.accent, textTransform: 'uppercase' }}>Client Brief Generator</div>
      </div>

      {/* Mode tabs */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 20 }}>
        {[['paste','Paste text'],['upload','Upload file']].map(([m, label]) => (
          <button key={m} className={`bg-btn-outline${mode === m ? ' active' : ''}`} onClick={() => setMode(m)}>{label}</button>
        ))}
      </div>

      {/* Client name */}
      <div style={{ marginBottom: 14 }}>
        <input
          value={clientName}
          onChange={e => setClientName(e.target.value)}
          placeholder="Client name (optional)"
          style={{ ...F.sans, width: '100%', padding: '10px 14px', border: `1.5px solid ${C.border}`, borderRadius: 8, fontSize: 14, color: C.text, background: C.bg2, outline: 'none', boxSizing: 'border-box' }}
          onFocus={e => e.target.style.borderColor = 'rgba(4,37,108,0.40)'}
          onBlur={e => e.target.style.borderColor = C.border}
        />
      </div>

      {/* Input area */}
      {mode === 'paste' ? (
        <textarea
          className="bg-textarea"
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Paste your performance report here — Google Ads export, Meta summary, CSV, plain text. Any format works."
          rows={10}
        />
      ) : (
        <div
          className={`bg-dropzone${dragging ? ' drag-over' : ''}`}
          onClick={() => fileRef.current?.click()}
          onDragOver={e => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={e => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files[0]) }}
        >
          <input ref={fileRef} type="file" accept=".txt,.csv,.pdf,.xlsx,.xls" style={{ display: 'none' }} onChange={e => handleFile(e.target.files[0])} />
          <div style={{ fontSize: 28, marginBottom: 10 }}>📎</div>
          <div style={{ ...F.sans, fontSize: 15, fontWeight: 600, color: C.text, marginBottom: 6 }}>Drop your file here</div>
          <div style={{ ...F.sans, fontSize: 13, color: C.muted }}>or click to browse · PDF, CSV, TXT, Excel</div>
          {text && <div style={{ ...F.sans, fontSize: 13, color: C.positive, marginTop: 12, fontWeight: 600 }}>✓ File loaded — ready to generate</div>}
        </div>
      )}

      {/* Progress */}
      {loading && (
        <div style={{ marginTop: 16 }}>
          <div className="bg-progress-bar">
            <div className="bg-progress-fill" style={{ width: `${progress}%` }} />
          </div>
          <div style={{ ...F.sans, fontSize: 12, color: C.muted, marginTop: 8, display: 'flex', justifyContent: 'space-between' }}>
            <span>{stage}</span>
            <span>{progress}%</span>
          </div>
          {progress >= 93 && (
            <div style={{ ...F.sans, fontSize: 12, color: C.subtle, marginTop: 6, fontStyle: 'italic' }}>Longer reports can take up to 45 seconds...</div>
          )}
        </div>
      )}

      {/* Error */}
      {error && (
        <div style={{ ...F.sans, fontSize: 13, color: C.danger, background: 'rgba(239,68,68,0.06)', border: `1px solid rgba(239,68,68,0.20)`, borderRadius: 8, padding: '10px 14px', marginTop: 12 }}>
          {error}
        </div>
      )}

      <button className="bg-btn-primary" onClick={() => generate()} disabled={loading} style={{ marginTop: 16 }}>
        {loading ? <><div className="bg-spinner"/><span>Generating brief...</span></> : <><span>Generate client brief</span><span style={{ fontSize: 18 }}>→</span></>}
      </button>

      <p style={{ ...F.sans, fontSize: 12, color: C.subtle, textAlign: 'center', marginTop: 12 }}>
        Works with Google Ads, Meta, LinkedIn Ads, or any text export
      </p>
    </div>
  )
}

/* ─── Brief output ─── */

function BriefOutput({ script, clientName, rawText, onReset }) {
  const [view, setView] = useState('brief') // 'brief' | 'internal'
  const [copied, setCopied] = useState(false)

  const metrics = script.metrics || []

  function copyBriefText() {
    const lines = [
      clientName ? `${clientName} — Performance Brief` : 'Performance Brief',
      '',
      script.what_happened || '',
      '',
      'Key wins:',
      ...(script.key_wins || []).map(w => `• ${w}`),
    ]
    if (script.areas_to_address?.length) {
      lines.push('', 'One thing to watch:')
      const a = script.areas_to_address[0]
      lines.push(`${a.issue} — ${a.action}`)
    }
    lines.push('', script.next_step_narrative || '')
    navigator.clipboard.writeText(lines.join('\n'))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '0 20px 60px' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div style={{ ...F.sans, fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', color: C.accent, textTransform: 'uppercase', marginBottom: 4 }}>
            {clientName ? `${clientName} — ` : ''}Client Brief
          </div>
          <div style={{ ...F.sans, fontSize: 22, fontWeight: 800, color: C.text, letterSpacing: '-0.02em' }}>
            Performance Brief
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          {/* View toggle */}
          <div style={{ display: 'flex', gap: 4, padding: 3, background: C.bg, border: `1px solid ${C.border}`, borderRadius: 8 }}>
            {[['brief','Client view'],['internal','Internal notes']].map(([v, label]) => (
              <button key={v} onClick={() => setView(v)} style={{ ...F.sans, fontSize: 12, fontWeight: 600, padding: '5px 12px', border: 'none', cursor: 'pointer', borderRadius: 6, background: view === v ? C.text : 'transparent', color: view === v ? '#fff' : C.muted, transition: 'all 0.15s' }}>
                {label}
              </button>
            ))}
          </div>
          <button className={`copy-btn${copied ? ' copied' : ''}`} onClick={copyBriefText}>
            {copied ? '✓ Copied' : 'Copy text'}
          </button>
          <button className="bg-btn-outline" onClick={onReset} style={{ fontSize: 12, padding: '6px 12px' }}>
            New brief
          </button>
        </div>
      </div>

      {view === 'brief' ? (
        <ClientBriefView script={script} metrics={metrics} />
      ) : (
        <InternalNotesView script={script} />
      )}
    </div>
  )
}

function ClientBriefView({ script, metrics }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* Metrics row */}
      {metrics.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(metrics.length, 4)}, 1fr)`, gap: 10 }}>
          {metrics.slice(0, 4).map((m, i) => (
            <div key={i} className="brief-metric">
              <div style={{ ...F.sans, fontSize: 11, fontWeight: 600, color: C.muted, marginBottom: 4 }}>{m.label}</div>
              <div style={{ ...F.sans, fontSize: 22, fontWeight: 800, color: C.text, letterSpacing: '-0.02em', lineHeight: 1 }}>{m.value}</div>
              {m.delta && (
                <div style={{ ...F.sans, fontSize: 12, fontWeight: 600, color: m.positive ? C.positive : C.danger, marginTop: 4 }}>
                  {m.positive ? '↑' : '↓'} {m.delta}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* What happened */}
      {script.what_happened && (
        <div className="brief-section accent">
          <div style={{ ...F.sans, fontSize: 11, fontWeight: 700, color: C.accent, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>This month</div>
          <p style={{ ...F.sans, fontSize: 15, color: C.text, lineHeight: 1.7, margin: 0 }}>{script.what_happened}</p>
        </div>
      )}

      {/* What it means */}
      {script.what_it_means && (
        <div className="brief-section">
          <div style={{ ...F.sans, fontSize: 11, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>What this means for your business</div>
          <p style={{ ...F.sans, fontSize: 15, color: C.text, lineHeight: 1.7, margin: 0 }}>{script.what_it_means}</p>
        </div>
      )}

      {/* Key wins */}
      {script.key_wins?.length > 0 && (
        <div className="brief-section">
          <div style={{ ...F.sans, fontSize: 11, fontWeight: 700, color: C.positive, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>Wins this month</div>
          <div>
            {script.key_wins.map((win, i) => (
              <div key={i} className="brief-win-item">
                <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'rgba(16,185,129,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 5l2.2 2.2L8 2.5" stroke={C.positive} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                <span style={{ ...F.sans, fontSize: 14, color: C.text, lineHeight: 1.55 }}>{win}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* One thing to watch */}
      {script.areas_to_address?.length > 0 && (
        <div className="brief-section" style={{ borderColor: 'rgba(245,158,11,0.25)', background: 'rgba(245,158,11,0.03)' }}>
          <div style={{ ...F.sans, fontSize: 11, fontWeight: 700, color: C.amber, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>One thing to know</div>
          {script.areas_to_address.slice(0, 1).map((a, i) => (
            <div key={i}>
              <div style={{ ...F.sans, fontSize: 14, fontWeight: 700, color: C.text, marginBottom: 6 }}>{a.issue}</div>
              <div style={{ ...F.sans, fontSize: 14, color: C.muted, lineHeight: 1.6, marginBottom: 8 }}>{a.reason}</div>
              <div style={{ ...F.sans, fontSize: 13, color: C.accent, fontWeight: 600 }}>What we're doing: {a.action}</div>
            </div>
          ))}
        </div>
      )}

      {/* Next steps */}
      {script.next_step_narrative && (
        <div className="brief-section">
          <div style={{ ...F.sans, fontSize: 11, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>What's next</div>
          <p style={{ ...F.sans, fontSize: 15, color: C.text, lineHeight: 1.7, margin: 0 }}>{script.next_step_narrative}</p>
        </div>
      )}

      {/* CTA strip */}
      <div style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 12, padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div style={{ ...F.sans, fontSize: 13, color: C.muted }}>Ready to send to your client</div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button style={{ ...F.sans, fontSize: 13, fontWeight: 700, color: '#fff', background: C.accent, border: 'none', borderRadius: 7, padding: '8px 18px', cursor: 'pointer' }}>
            Send to client
          </button>
          <button style={{ ...F.sans, fontSize: 13, fontWeight: 600, color: C.muted, background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 7, padding: '8px 14px', cursor: 'pointer' }}>
            Download PDF
          </button>
        </div>
      </div>
    </div>
  )
}

function InternalNotesView({ script }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ ...F.sans, fontSize: 13, color: C.muted, background: C.bg, border: `1px solid ${C.border}`, borderRadius: 8, padding: '10px 14px' }}>
        Internal use only — not shown to clients. Use these before your next call or check-in.
      </div>

      {/* Opening */}
      {script.opening && (
        <div className="brief-section">
          <div style={{ ...F.sans, fontSize: 11, fontWeight: 700, color: C.accent, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>Opening line</div>
          <p style={{ ...F.sans, fontSize: 14, color: C.text, lineHeight: 1.7, margin: 0, fontStyle: 'italic' }}>"{script.opening}"</p>
        </div>
      )}

      {/* Talk track */}
      {script.talking_points?.length > 0 && (
        <div className="brief-section accent">
          <div style={{ ...F.sans, fontSize: 11, fontWeight: 700, color: C.accent, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>Talk track</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {script.talking_points.map((tp, i) => (
              <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <span style={{ ...F.sans, fontSize: 11, fontWeight: 800, color: C.accent, minWidth: 20, marginTop: 2 }}>{String(i+1).padStart(2,'0')}</span>
                <p style={{ ...F.sans, fontSize: 14, color: C.text, lineHeight: 1.6, margin: 0, fontStyle: 'italic' }}>"{tp}"</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Expected questions */}
      {script.expected_questions?.length > 0 && (
        <div className="brief-section">
          <div style={{ ...F.sans, fontSize: 11, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>Expected questions</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {script.expected_questions.map((eq, i) => (
              <div key={i}>
                <div style={{ ...F.sans, fontSize: 14, fontWeight: 700, color: C.text, marginBottom: 6 }}>{eq.question}</div>
                <div style={{ ...F.sans, fontSize: 14, color: C.muted, lineHeight: 1.6 }}>{eq.answer}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Additional issues */}
      {script.areas_to_address?.length > 1 && (
        <div className="brief-section">
          <div style={{ ...F.sans, fontSize: 11, fontWeight: 700, color: C.amber, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>All areas to address</div>
          {script.areas_to_address.map((a, i) => (
            <div key={i} style={{ marginBottom: 14, paddingBottom: 14, borderBottom: i < script.areas_to_address.length - 1 ? `1px solid ${C.border}` : 'none' }}>
              <div style={{ ...F.sans, fontSize: 14, fontWeight: 700, color: C.text, marginBottom: 4 }}>{a.issue}</div>
              <div style={{ ...F.sans, fontSize: 13, color: C.muted, marginBottom: 6 }}>{a.reason}</div>
              <div style={{ ...F.sans, fontSize: 13, color: C.accent, fontWeight: 600 }}>Action: {a.action}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

/* ─── Page shell ─── */

export default function BriefGeneratorPage() {
  const [stage, setStage] = useState('entry')   // 'entry' | 'input'
  const [inputMode, setInputMode] = useState(null)
  const [script, setScript] = useState(null)
  const [clientName, setClientName] = useState('')

  function handleSelect(mode) {
    setInputMode(mode)
    setStage('input')
  }

  function handleResult(s, name) {
    setScript(s)
    setClientName(name)
  }

  function handleReset() {
    setScript(null)
    setStage('entry')
    setInputMode(null)
  }

  return (
    <div style={{ ...F.sans, minHeight: '100vh', background: C.bg }}>
      <style>{PAGE_CSS}</style>

      {/* Nav */}
      <nav className="bg-nav" style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100 }}>
        <div style={{ maxWidth: 960, margin: '0 auto', padding: '0 24px', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link to="/" style={{ ...F.sans, fontSize: 17, fontWeight: 800, color: C.text, letterSpacing: '-0.02em', textDecoration: 'none' }}>retainr</Link>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <Link to="/propose" style={{ ...F.sans, fontSize: 13, fontWeight: 600, color: C.muted, textDecoration: 'none', padding: '6px 12px' }}>Proposals →</Link>
            <Link to="/sign-up" style={{ ...F.sans, fontSize: 13, fontWeight: 700, color: '#fff', background: C.accent, padding: '7px 16px', borderRadius: 8, textDecoration: 'none' }}>Start free</Link>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div style={{ paddingTop: 96, paddingBottom: 60 }}>
        {script ? (
          <BriefOutput script={script} clientName={clientName} onReset={handleReset} />
        ) : stage === 'entry' ? (
          <EntryScreen onSelect={handleSelect} />
        ) : (
          <InputView
            initialMode={inputMode}
            autoGenerate={inputMode === 'sample'}
            onResult={handleResult}
          />
        )}
      </div>
    </div>
  )
}
