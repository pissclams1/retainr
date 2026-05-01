import { useState, useRef, useCallback, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { createClient } from '@supabase/supabase-js'
import { getStateConfig } from '../config/states'
import { useDetectedState } from '../hooks/useDetectedState'

const USES_KEY  = 'bindiq_uses'
const EMAIL_KEY = 'bindiq_email'
function getLocalUses()   { try { return parseInt(localStorage.getItem(USES_KEY) || '0', 10) } catch { return 0 } }
function incLocalUses()   { try { localStorage.setItem(USES_KEY, String(getLocalUses() + 1)) } catch {} }
function getStoredEmail() { try { return localStorage.getItem(EMAIL_KEY) || '' } catch { return '' } }
function saveEmail(e)     { try { localStorage.setItem(EMAIL_KEY, e.trim().toLowerCase()) } catch {} }

async function trackUsage(email, supabaseClient) {
  try {
    const { data } = await supabaseClient.functions.invoke('track-usage', { body: { email } })
    return data ?? { allowed: false }
  } catch { return { allowed: false } }
}

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
)

const F = { sans: { fontFamily: "'DM Sans', system-ui, -apple-system, sans-serif" } }

const C = {
  bg:         '#F8FAFC',
  bgAlt:      '#F1F5F9',
  bg2:        '#FFFFFF',
  text:       '#0F1F3D',
  muted:      '#64748B',
  subtle:     '#94A3B8',
  border:     '#E2E8F0',
  accent:     '#04256c',
  accentBg:   'rgba(4,37,108,0.07)',
  positive:   '#10B981',
  amber:      '#F59E0B',
  danger:     '#EF4444',
}

const PAGE_CSS = `
  html, body { background: ${C.bg}; }
  * { box-sizing: border-box; }

  .ip-textarea { width: 100%; padding: 16px; font-family: 'DM Sans', sans-serif; font-size: 13px; line-height: 1.7; color: ${C.text}; background: ${C.bg2}; border: 1.5px solid ${C.border}; border-radius: 10px; resize: vertical; outline: none; transition: border-color 0.15s; min-height: 220px; }
  .ip-textarea:focus { border-color: rgba(4,37,108,0.40); }
  .ip-textarea::placeholder { color: ${C.subtle}; }

  .ip-btn-primary { background: ${C.accent}; color: #fff; border: none; border-radius: 10px; font-family: 'DM Sans', sans-serif; font-size: 16px; font-weight: 700; padding: 16px 36px; cursor: pointer; transition: opacity 0.15s, box-shadow 0.15s; box-shadow: 0 4px 16px rgba(4,37,108,0.35); width: 100%; display: flex; align-items: center; justify-content: center; gap: 10px; }
  .ip-btn-primary:hover:not(:disabled) { opacity: 0.92; }
  .ip-btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }

  .ip-btn-outline { padding: 9px 18px; border-radius: 8px; border: 1.5px solid ${C.border}; background: ${C.bg2}; font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 600; color: ${C.muted}; cursor: pointer; transition: all 0.15s; }
  .ip-btn-outline:hover { border-color: ${C.accent}; color: ${C.accent}; }
  .ip-btn-outline.active { border-color: ${C.accent}; color: ${C.accent}; background: rgba(4,37,108,0.05); }

  .ip-dropzone { border: 2px dashed ${C.border}; border-radius: 10px; padding: 40px; text-align: center; cursor: pointer; transition: all 0.15s; }
  .ip-dropzone:hover, .ip-dropzone.drag-over { border-color: rgba(4,37,108,0.40); background: rgba(4,37,108,0.03); }

  .ip-spinner { width: 20px; height: 20px; border: 2.5px solid rgba(255,255,255,0.3); border-top-color: #fff; border-radius: 50%; animation: ipspin 0.7s linear infinite; }
  @keyframes ipspin { to { transform: rotate(360deg); } }

  .ip-progress-bar { height: 3px; background: ${C.border}; border-radius: 2px; overflow: hidden; }
  .ip-progress-fill { height: 100%; background: ${C.accent}; border-radius: 2px; transition: width 0.6s ease; }

  .entry-card { background: ${C.bg2}; border: 1.5px solid ${C.border}; border-radius: 14px; padding: 24px 28px; cursor: pointer; text-align: left; width: 100%; transition: border-color 0.18s, box-shadow 0.18s, transform 0.12s; display: flex; align-items: flex-start; gap: 18px; }
  .entry-card:hover { border-color: rgba(4,37,108,0.35); box-shadow: 0 6px 28px rgba(4,37,108,0.10); transform: translateY(-1px); }
  .entry-card:active { transform: translateY(0); }

  .ip-field-row { display: flex; align-items: flex-start; padding: 10px 0; border-bottom: 1px solid ${C.border}; gap: 16px; }
  .ip-field-row:last-child { border-bottom: none; padding-bottom: 0; }
  .ip-section { background: ${C.bg2}; border: 1px solid ${C.border}; border-radius: 12px; padding: 20px 22px; }

  .ip-flag-critical { background: rgba(239,68,68,0.07); border: 1px solid rgba(239,68,68,0.25); border-radius: 10px; padding: 12px 16px; display: flex; align-items: flex-start; gap: 10px; }
  .ip-flag-warning { background: rgba(245,158,11,0.07); border: 1px solid rgba(245,158,11,0.25); border-radius: 10px; padding: 12px 16px; display: flex; align-items: flex-start; gap: 10px; }

  .ip-selection-badge { display: inline-flex; align-items: center; justify-content: center; width: 26px; height: 26px; border-radius: 6px; font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 800; flex-shrink: 0; }

  .copy-btn { padding: 5px 12px; border-radius: 6px; border: 1px solid ${C.border}; background: ${C.bg2}; font-family: 'DM Sans', sans-serif; font-size: 11px; font-weight: 600; color: ${C.muted}; cursor: pointer; transition: all 0.15s; }
  .copy-btn:hover { border-color: ${C.accent}; color: ${C.accent}; }
  .copy-btn.copied { border-color: ${C.positive}; color: ${C.positive}; }

  @media (max-width: 640px) {
    .ip-btn-primary { font-size: 15px; padding: 14px 24px; }
    .entry-card { padding: 18px 20px; gap: 14px; }
  }
`

// Representative wind mitigation sample
const SAMPLE_WIND_MIT = `UNIFORM MITIGATION VERIFICATION INSPECTION FORM
OIR-B1-1802 (Adopted January 1, 2012)

Property Owner: James & Carol Whitfield
Inspection Address: 4821 Pelican Cove Road, Naples, FL 34108
Date of Inspection: 03/12/2024
Inspector Name: Robert D. Torres
License Number: HI12334455
Company: Coastal Inspection Services LLC

SECTION A - ROOF COVERING
[X] A. FBC equivalent - Required building permit and final inspection obtained
Roof covering type: Concrete barrel tile
Installation date: 2017 (permit #17-0088341)

SECTION B - ROOF DECK ATTACHMENT
[X] C. 8d nails at 6" o.c. at panel edges and 6" o.c. in the field (or equivalent)
Deck type: 19/32" plywood OSB

SECTION C - ROOF TO WALL ATTACHMENT
[X] D. Double Wraps
Double wrap hurricane straps connecting each rafter/truss to wall plate throughout.

SECTION D - ROOF GEOMETRY
[X] A. Hip
All roof sections have hip geometry. No gable ends present.
Hip percentage: 100%

SECTION E - SECONDARY WATER RESISTANCE (SWR)
[X] YES - Self-adhering polymer modified bitumen roof underlayment installed
(peel-and-stick SWR throughout)

SECTION F - OPENING PROTECTION
[X] D. Impact Resistant Glazing
All windows: PGT impact-rated glass throughout
Entry doors: Therma-Tru impact-rated, FBC compliant
Garage door: Amarr impact-rated double garage door (8' x 7')
Skylights: None`

// Representative 4-point sample
const SAMPLE_FOUR_PT = `FOUR POINT INSPECTION REPORT

Property Address: 2204 Cypress Lake Drive, Orlando, FL 32811
Inspection Date: 01/28/2024
Inspector: Sandra M. Holloway
License #: HI9987654
Company: Central Florida Property Inspections

ROOFING SYSTEM
Roof Covering Material: 30-year architectural asphalt shingles
Roof Age: Approximately 9 years (installed 2015)
Condition: Good — no missing shingles, no visible damage, no active leaks
Estimated Remaining Life: 18-20 years
Notes: Gutters clean and properly secured. Flashing in good condition.

HVAC SYSTEM
System Type: Split system central air / heat pump
Brand: Carrier
Age: 7 years (2017 installation)
Condition: Good — cooling and heating functioning normally
Notes: Air handler in attic, condenser on ground pad. Last serviced 6 months ago.

PLUMBING SYSTEM
Supply Line Material: CPVC throughout
Drain/Waste: PVC and ABS
Water Heater: Rheem 50-gallon electric, 5 years old (2019)
Condition: Good — no leaks observed at visible supply lines, fixtures, or connections
Notes: Pressure appears normal. Water heater in good condition, TPR valve present.

ELECTRICAL SYSTEM
Main Panel Brand: Square D (QO Series)
Service Size: 200 amp main breaker
Wiring Type: Copper throughout (branch circuits)
Condition: Good — panel well-organised, breakers properly labelled, no double-taps observed
Notes: GFCI protection verified at all required locations. Smoke detectors present.`

/* ─── PDF text extraction via pdfjs (loaded from CDN) ─── */

async function loadPdfJs() {
  if (window.pdfjsLib) return window.pdfjsLib
  await new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js'
    script.onload = resolve
    script.onerror = reject
    document.head.appendChild(script)
  })
  window.pdfjsLib.GlobalWorkerOptions.workerSrc =
    'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js'
  return window.pdfjsLib
}

async function extractTextFromPDF(file) {
  const pdfjsLib = await loadPdfJs()
  const arrayBuffer = await file.arrayBuffer()
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
  let fullText = ''
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i)
    const content = await page.getTextContent()
    fullText += content.items.map(item => item.str).join(' ') + '\n'
  }
  return fullText.trim()
}

/* ─── Entry screen ─── */

function EntryScreen({ onSelect, stateConfig }) {
  const sc = stateConfig
  const OPTIONS = [
    { id: 'upload', icon: '📄', label: 'Upload PDF',       desc: `Drop a ${sc.formShort.split('·')[0].trim()} PDF — text is extracted automatically` },
    { id: 'paste',  icon: '📋', label: 'Paste report text', desc: 'Copy and paste text from any inspection report' },
    { id: 'sample', icon: '⚡', label: 'See a demo',        desc: `Run extraction on a sample ${sc.sampleType.toLowerCase()} instantly`, badge: 'Instant' },
  ]
  return (
    <div style={{ maxWidth: 560, margin: '0 auto', padding: '0 20px' }}>
      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <div style={{ ...F.sans, fontSize: 22, fontWeight: 800, color: C.text, letterSpacing: '-0.02em', marginBottom: 6 }}>BindIQ</div>
        <h1 style={{ ...F.sans, fontSize: 26, fontWeight: 800, color: C.text, margin: 0, marginBottom: 10, letterSpacing: '-0.02em' }}>
          Get your BindIQ Score
        </h1>
        <p style={{ ...F.sans, fontSize: 15, color: C.muted, margin: 0, lineHeight: 1.6 }}>
          {sc.entryDesc}
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
        {sc.footerNote} · More forms coming soon
      </p>
    </div>
  )
}

/* ─── Input view ─── */

function InputView({ initialMode, autoGenerate, onResult, stateConfig }) {
  const sc = stateConfig
  const [mode, setMode] = useState(initialMode === 'upload' ? 'upload' : 'paste')
  const [text, setText] = useState(initialMode === 'sample' ? SAMPLE_WIND_MIT : '')
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [stage, setStage] = useState('')
  const [error, setError] = useState(null)
  const [dragging, setDragging] = useState(false)
  const [fileNames, setFileNames] = useState([])
  const [showEmailGate, setShowEmailGate] = useState(false)
  const [showPaywall, setShowPaywall] = useState(false)
  const [pendingRaw, setPendingRaw] = useState(null)
  const skipGateRef = useRef(false)
  const fileRef = useRef(null)
  const autoFired = useRef(false)
  const timers = useRef([])

  const STAGES = [
    { pct: 15, label: 'Reading document...' },
    { pct: 35, label: 'Detecting form type...' },
    { pct: 55, label: 'Extracting underwriting fields...' },
    { pct: 72, label: 'Running risk checks...' },
    { pct: 88, label: 'Calculating BindIQ Score...' },
    { pct: 93, label: 'Almost there...' },
  ]
  const DELAYS = [600, 2000, 4000, 7000, 11000, 16000]

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

  const extract = useCallback(async (overrideText) => {
    const raw = (overrideText ?? text).trim()
    if (!raw || raw.length < 50) { setError('Paste more of the inspection report first.'); return }

    // Sample mode is always free
    const isSample = initialMode === 'sample' && !overrideText

    if (!isSample) {
      if (skipGateRef.current) {
        // Email was just verified in handleEmailSubmit — proceed without re-checking
        skipGateRef.current = false
      } else {
        const localUses = getLocalUses()
        const email = getStoredEmail()

        if (localUses >= 1) {
          if (!email) {
            // Need email before proceeding
            setPendingRaw(overrideText ?? null)
            setShowEmailGate(true)
            return
          }
          // Has email — check server
          const result = await trackUsage(email, supabase)
          if (!result?.allowed) {
            setShowPaywall(true)
            return
          }
        }
      }
    }

    setError(null)
    setLoading(true)
    startProgress()
    try {
      const { data, error: fnErr } = await supabase.functions.invoke('extract-inspection', {
        body: { rawText: raw, state: sc?.abbr || 'FL' },
      })
      if (fnErr) throw new Error(fnErr.message)
      if (data?.error) throw new Error(data.error)
      stopProgress()
      setProgress(100)
      await new Promise(r => setTimeout(r, 300))
      if (!isSample) incLocalUses()
      onResult(data.result)
    } catch (e) {
      stopProgress()
      setError(e.message || 'Something went wrong. Please try again.')
      setLoading(false)
      setProgress(0)
    }
  }, [text, onResult])

  async function handleEmailSubmit(email) {
    saveEmail(email)
    const result = await trackUsage(email, supabase)
    if (!result?.allowed) {
      setShowEmailGate(false)
      setShowPaywall(true)
      return
    }
    setShowEmailGate(false)
    skipGateRef.current = true
    const raw = pendingRaw
    setPendingRaw(null)
    extract(raw)
  }

  useEffect(() => {
    if (autoGenerate && !autoFired.current) {
      autoFired.current = true
      const t = setTimeout(() => extract(SAMPLE_WIND_MIT), 400)
      return () => clearTimeout(t)
    }
  }, [autoGenerate, extract])

  async function handleFiles(fileList) {
    const files = Array.from(fileList).slice(0, 2)
    if (files.length === 0) return
    setFileNames(files.map(f => f.name))
    setError(null)
    setStage('Extracting text from PDFs...')
    try {
      const texts = await Promise.all(files.map(async f => {
        if (f.type === 'application/pdf' || f.name.toLowerCase().endsWith('.pdf')) {
          const extracted = await extractTextFromPDF(f)
          if (!extracted || extracted.length < 50) {
            throw new Error(`Could not extract text from ${f.name} — it may be a scanned image.`)
          }
          return extracted
        } else {
          return await new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.onload = e => resolve(e.target.result)
            reader.onerror = () => reject(new Error(`Could not read ${f.name}`))
            reader.readAsText(f)
          })
        }
      }))
      setText(texts.length > 1 ? texts.join('\n\n--- SECOND DOCUMENT ---\n\n') : texts[0])
      setStage('')
      setMode('paste')
    } catch (e) {
      setError(e.message || 'Could not read files. Try copying and pasting the text instead.')
      setFileNames([])
      setStage('')
    }
  }

  return (
    <>
    {showEmailGate && <EmailGate onSubmit={handleEmailSubmit} onDismiss={() => setShowEmailGate(false)} />}
    {showPaywall && <PaywallGate />}
    <div style={{ maxWidth: 600, margin: '0 auto', padding: '0 20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28 }}>
        <div style={{ ...F.sans, fontSize: 16, fontWeight: 800, color: C.text, letterSpacing: '-0.01em' }}>BindIQ</div>
        <span style={{ ...F.sans, fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', color: C.accent, textTransform: 'uppercase' }}>Bind Likelihood Scorer</span>
      </div>

      {/* Mode tabs — hidden in sample mode */}
      {initialMode === 'sample' ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
          <span style={{ ...F.sans, fontSize: 12, fontWeight: 700, color: C.accent, textTransform: 'uppercase', letterSpacing: '0.08em', background: 'rgba(4,37,108,0.07)', border: `1px solid rgba(4,37,108,0.15)`, borderRadius: 6, padding: '4px 10px' }}>Sample report</span>
          <span style={{ ...F.sans, fontSize: 12, color: C.subtle }}>{sc?.sampleLabel || 'Wind mitigation · Naples, FL'}</span>
        </div>
      ) : (
        <div style={{ display: 'flex', gap: 6, marginBottom: 20 }}>
          {[['paste','Paste text'],['upload','Upload PDF']].map(([m, label]) => (
            <button key={m} className={`ip-btn-outline${mode === m ? ' active' : ''}`} onClick={() => setMode(m)}>{label}</button>
          ))}
        </div>
      )}

      {/* Input area — hidden in sample mode */}
      {initialMode === 'sample' ? null : mode === 'paste' ? (
        <textarea
          className="ip-textarea"
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder={sc?.formHint || 'Paste the full text of a 4-point or wind mitigation inspection report.'}
          rows={10}
        />
      ) : (
        <div
          className={`ip-dropzone${dragging ? ' drag-over' : ''}`}
          onClick={() => fileRef.current?.click()}
          onDragOver={e => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={e => { e.preventDefault(); setDragging(false); handleFiles(e.dataTransfer.files) }}
        >
          <input ref={fileRef} type="file" accept=".pdf,.txt" multiple style={{ display: 'none' }} onChange={e => handleFiles(e.target.files)} />
          <div style={{ fontSize: 28, marginBottom: 10 }}>📄</div>
          <div style={{ ...F.sans, fontSize: 15, fontWeight: 600, color: C.text, marginBottom: 6 }}>Drop up to 2 inspection PDFs here</div>
          <div style={{ ...F.sans, fontSize: 13, color: C.muted }}>or click to browse · {sc?.uploadHint || '4-point + wind mit together'} · PDF only</div>
          {fileNames.length > 0 && (
            <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 4 }}>
              {fileNames.map(n => (
                <div key={n} style={{ ...F.sans, fontSize: 13, color: C.positive, fontWeight: 600 }}>✓ {n}</div>
              ))}
            </div>
          )}
        </div>
      ) }

      {/* Progress */}
      {(loading || stage === 'Extracting text from PDFs...') && (
        <div style={{ marginTop: 16 }}>
          <div className="ip-progress-bar">
            <div className="ip-progress-fill" style={{ width: `${progress}%` }} />
          </div>
          <div style={{ ...F.sans, fontSize: 12, color: C.muted, marginTop: 8, display: 'flex', justifyContent: 'space-between' }}>
            <span>{stage}</span>
            {loading && <span>{progress}%</span>}
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div style={{ ...F.sans, fontSize: 13, color: C.danger, background: 'rgba(239,68,68,0.06)', border: `1px solid rgba(239,68,68,0.20)`, borderRadius: 8, padding: '10px 14px', marginTop: 12 }}>
          {error}
        </div>
      )}

      <button className="ip-btn-primary" onClick={() => extract()} disabled={loading} style={{ marginTop: 16 }}>
        {loading
          ? <><div className="ip-spinner"/><span>Scoring...</span></>
          : <><span>Get BindIQ Score</span><span style={{ fontSize: 18 }}>→</span></>
        }
      </button>

      <p style={{ ...F.sans, fontSize: 12, color: C.subtle, textAlign: 'center', marginTop: 12 }}>
        {sc?.footerNote || 'Florida 4-point · Wind mitigation OIR-B1-1802'}
      </p>
    </div>
    </>
  )
}

/* ─── Output components ─── */

const WIND_MIT_LABELS = {
  roof_covering:          'Roof Covering',
  roof_deck_attachment:   'Roof Deck Attachment',
  roof_to_wall_connection:'Roof-to-Wall Connection',
  roof_geometry:          'Roof Geometry',
  secondary_water_resistance: 'Secondary Water Resistance',
  opening_protection:     'Opening Protection',
}

// Selection letter → colour (rough indication of how good each selection is)
const SELECTION_COLOUR = {
  A: { bg: 'rgba(16,185,129,0.12)', color: '#065F46' },
  B: { bg: 'rgba(16,185,129,0.08)', color: '#047857' },
  C: { bg: 'rgba(245,158,11,0.10)', color: '#92400E' },
  D: { bg: 'rgba(16,185,129,0.12)', color: '#065F46' }, // D = good for roof-to-wall
  E: { bg: 'rgba(16,185,129,0.15)', color: '#065F46' },
  F: { bg: 'rgba(100,116,139,0.10)', color: '#475569' },
}

function SelectionBadge({ letter }) {
  const s = SELECTION_COLOUR[letter] || { bg: 'rgba(100,116,139,0.10)', color: '#475569' }
  return (
    <span className="ip-selection-badge" style={{ background: s.bg, color: s.color }}>
      {letter}
    </span>
  )
}

function ConditionBadge({ condition }) {
  const map = {
    good:    { bg: 'rgba(16,185,129,0.10)',  color: '#065F46',  label: 'Good' },
    fair:    { bg: 'rgba(245,158,11,0.10)',  color: '#92400E',  label: 'Fair' },
    poor:    { bg: 'rgba(239,68,68,0.10)',   color: '#991B1B',  label: 'Poor' },
    unknown: { bg: 'rgba(100,116,139,0.10)', color: '#475569',  label: 'Unknown' },
  }
  const s = map[condition?.toLowerCase()] || map.unknown
  return (
    <span style={{ ...F.sans, fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 6, background: s.bg, color: s.color }}>
      {s.label}
    </span>
  )
}

function WindMitOutput({ wm }) {
  const sections = [
    { key: 'roof_covering',           value: wm.roof_covering },
    { key: 'roof_deck_attachment',    value: wm.roof_deck_attachment },
    { key: 'roof_to_wall_connection', value: wm.roof_to_wall_connection },
    { key: 'roof_geometry',           value: wm.roof_geometry },
    { key: 'secondary_water_resistance', value: wm.secondary_water_resistance },
    { key: 'opening_protection',      value: wm.opening_protection },
  ]

  function renderValue(key, val) {
    if (!val) return <span style={{ ...F.sans, fontSize: 13, color: C.subtle }}>Not found</span>

    if (key === 'roof_geometry') {
      const shape = val.shape ? val.shape.charAt(0).toUpperCase() + val.shape.slice(1) : '—'
      const pct = val.hip_percentage != null ? ` (${val.hip_percentage}% hip)` : ''
      return <span style={{ ...F.sans, fontSize: 13, color: C.text }}>{shape}{pct}</span>
    }

    if (key === 'secondary_water_resistance') {
      const present = val.present
      return (
        <span style={{ ...F.sans, fontSize: 13, color: present ? '#065F46' : C.danger, fontWeight: 600 }}>
          {present ? '✓ Present' : '✗ Not present'}{val.type ? ` — ${val.type}` : ''}
        </span>
      )
    }

    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {val.selection && <SelectionBadge letter={val.selection} />}
        <span style={{ ...F.sans, fontSize: 13, color: C.text }}>{val.description || '—'}</span>
      </div>
    )
  }

  return (
    <div className="ip-section">
      {sections.map(({ key, value }) => (
        <div key={key} className="ip-field-row">
          <div style={{ ...F.sans, fontSize: 12, fontWeight: 600, color: C.muted, width: 180, flexShrink: 0, paddingTop: 2 }}>
            {WIND_MIT_LABELS[key]}
          </div>
          <div style={{ flex: 1 }}>
            {renderValue(key, value)}
          </div>
        </div>
      ))}
    </div>
  )
}

function FourPointOutput({ fp }) {
  const systems = [
    { label: 'Roof',       icon: '🏠', data: fp.roof,       fields: [
      { label: 'Material',          value: fp.roof?.material },
      { label: 'Age',               value: fp.roof?.age_years != null ? `${fp.roof.age_years} years` : null },
      { label: 'Est. remaining life', value: fp.roof?.estimated_remaining_life_years != null ? `${fp.roof.estimated_remaining_life_years} years` : null },
      { label: 'Notes',             value: fp.roof?.notes },
    ]},
    { label: 'HVAC',       icon: '❄️', data: fp.hvac,       fields: [
      { label: 'Type',              value: fp.hvac?.type },
      { label: 'Brand',             value: fp.hvac?.brand },
      { label: 'Age',               value: fp.hvac?.age_years != null ? `${fp.hvac.age_years} years` : null },
      { label: 'Notes',             value: fp.hvac?.notes },
    ]},
    { label: 'Plumbing',   icon: '🔧', data: fp.plumbing,   fields: [
      { label: 'Supply lines',      value: fp.plumbing?.supply_material },
      { label: 'Drain lines',       value: fp.plumbing?.drain_material },
      { label: 'Water heater age',  value: fp.plumbing?.water_heater_age_years != null ? `${fp.plumbing.water_heater_age_years} years` : null },
      { label: 'Notes',             value: fp.plumbing?.notes },
    ]},
    { label: 'Electrical', icon: '⚡', data: fp.electrical, fields: [
      { label: 'Panel brand',       value: fp.electrical?.panel_brand },
      { label: 'Panel type',        value: fp.electrical?.panel_type?.replace('_', ' ') },
      { label: 'Service size',      value: fp.electrical?.service_amps ? `${fp.electrical.service_amps} amps` : null },
      { label: 'Wiring',            value: fp.electrical?.wiring_type },
      { label: 'Notes',             value: fp.electrical?.notes },
    ]},
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {systems.map(sys => (
        <div key={sys.label} className="ip-section">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <span style={{ fontSize: 18 }}>{sys.icon}</span>
            <span style={{ ...F.sans, fontSize: 15, fontWeight: 700, color: C.text }}>{sys.label}</span>
            {sys.data?.condition && <ConditionBadge condition={sys.data.condition} />}
          </div>
          {sys.fields.filter(f => f.value).map(f => (
            <div key={f.label} className="ip-field-row">
              <div style={{ ...F.sans, fontSize: 12, fontWeight: 600, color: C.muted, width: 160, flexShrink: 0, paddingTop: 1 }}>{f.label}</div>
              <div style={{ ...F.sans, fontSize: 13, color: C.text }}>{f.value}</div>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

function FlagsSection({ flags }) {
  if (!flags?.length) {
    return (
      <div style={{ background: 'rgba(16,185,129,0.07)', border: '1px solid rgba(16,185,129,0.25)', borderRadius: 10, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ fontSize: 20 }}>✅</span>
        <div>
          <div style={{ ...F.sans, fontSize: 14, fontWeight: 700, color: '#065F46' }}>No red flags</div>
          <div style={{ ...F.sans, fontSize: 13, color: '#047857', marginTop: 2 }}>Nothing found that would prevent placement with standard carriers.</div>
        </div>
      </div>
    )
  }

  const critical = flags.filter(f => f.severity === 'critical')
  const warnings = flags.filter(f => f.severity === 'warning')

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {critical.map((f, i) => (
        <div key={i} className="ip-flag-critical">
          <span style={{ fontSize: 18, flexShrink: 0 }}>🚨</span>
          <div>
            <div style={{ ...F.sans, fontSize: 13, fontWeight: 700, color: '#991B1B' }}>{f.code.replace(/_/g, ' ')}</div>
            <div style={{ ...F.sans, fontSize: 13, color: '#B91C1C', marginTop: 2 }}>{f.message}</div>
          </div>
        </div>
      ))}
      {warnings.map((f, i) => (
        <div key={i} className="ip-flag-warning">
          <span style={{ fontSize: 18, flexShrink: 0 }}>⚠️</span>
          <div>
            <div style={{ ...F.sans, fontSize: 13, fontWeight: 700, color: '#92400E' }}>{f.code.replace(/_/g, ' ')}</div>
            <div style={{ ...F.sans, fontSize: 13, color: '#B45309', marginTop: 2 }}>{f.message}</div>
          </div>
        </div>
      ))}
    </div>
  )
}

function BindIQScore({ bs }) {
  if (!bs) return null

  const map = {
    likely_bind:      { bg: 'rgba(16,185,129,0.07)', border: '1.5px solid rgba(16,185,129,0.28)', barColor: '#10B981', scoreColor: '#065F46', labelBg: 'rgba(16,185,129,0.14)', emoji: '🟢', label: 'Likely to Bind' },
    conditional_risk: { bg: 'rgba(245,158,11,0.07)', border: '1.5px solid rgba(245,158,11,0.30)', barColor: '#F59E0B', scoreColor: '#92400E', labelBg: 'rgba(245,158,11,0.14)', emoji: '🟡', label: 'Conditional Risk' },
    likely_decline:   { bg: 'rgba(239,68,68,0.07)',  border: '1.5px solid rgba(239,68,68,0.28)',  barColor: '#EF4444', scoreColor: '#991B1B', labelBg: 'rgba(239,68,68,0.14)',  emoji: '🔴', label: 'Likely Decline' },
  }
  const s = map[bs.label] || map.conditional_risk

  return (
    <div style={{ background: s.bg, border: s.border, borderRadius: 16, padding: '24px 26px', marginBottom: 24 }}>
      {/* Score + label row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 16 }}>
        <div style={{ flexShrink: 0 }}>
          <div style={{ ...F.sans, fontSize: 11, fontWeight: 700, color: s.scoreColor, letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 4 }}>BindIQ Score</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 3, lineHeight: 1 }}>
            <span style={{ ...F.sans, fontSize: 56, fontWeight: 800, color: s.scoreColor, letterSpacing: '-0.04em', lineHeight: 1 }}>{bs.score}</span>
            <span style={{ ...F.sans, fontSize: 15, color: s.scoreColor, opacity: 0.45, fontWeight: 600 }}>/100</span>
          </div>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <span style={{ fontSize: 20 }}>{s.emoji}</span>
            <span style={{ ...F.sans, fontSize: 17, fontWeight: 800, color: s.scoreColor, letterSpacing: '-0.01em' }}>{s.label}</span>
          </div>
          <div style={{ height: 8, background: 'rgba(0,0,0,0.07)', borderRadius: 4, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${bs.score}%`, background: s.barColor, borderRadius: 4, transition: 'width 1s ease' }} />
          </div>
          <div style={{ ...F.sans, fontSize: 11, color: s.scoreColor, opacity: 0.55, marginTop: 5 }}>{bs.scoreSubtitle || 'Standard carrier placement likelihood'}</div>
        </div>
      </div>

      {/* Why this score */}
      {bs.reasons?.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          <div style={{ ...F.sans, fontSize: 11, fontWeight: 700, color: s.scoreColor, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8 }}>Why this score</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            {bs.reasons.map((r, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                <span style={{ ...F.sans, fontSize: 13, color: s.scoreColor, flexShrink: 0, marginTop: 1 }}>·</span>
                <span style={{ ...F.sans, fontSize: 13, color: s.scoreColor, lineHeight: 1.55, opacity: 0.85 }}>{r}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Carrier impact */}
      {bs.carrier_impact && (
        <div style={{ paddingTop: 14, borderTop: `1px solid ${s.barColor}22` }}>
          <div style={{ ...F.sans, fontSize: 11, fontWeight: 700, color: s.scoreColor, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 5 }}>Carrier impact</div>
          <div style={{ ...F.sans, fontSize: 13, color: s.scoreColor, lineHeight: 1.65, opacity: 0.8 }}>{bs.carrier_impact}</div>
        </div>
      )}
    </div>
  )
}

function InspectionOutput({ result, onReset }) {
  const { form_type, property, wind_mitigation, four_point, flags, insurability_summary, bind_score } = result
  const [copied, setCopied] = useState(false)

  const formLabel = form_type === 'wind_mitigation' ? 'Wind Mitigation' : form_type === 'four_point' ? '4-Point Inspection' : 'Inspection'

  const LABEL_TEXT = {
    likely_bind:      'Likely to Bind',
    conditional_risk: 'Conditional Risk',
    likely_decline:   'Likely Decline',
  }

  function buildCopyText() {
    const lines = [
      `BindIQ Score: ${bind_score?.score ?? '—'}/100 — ${LABEL_TEXT[bind_score?.label] ?? ''}`,
      formLabel + (property?.address ? ` — ${property.address}` : ''),
      property?.inspection_date ? `Inspected: ${property.inspection_date}` : '',
      '',
    ]

    if (bind_score?.reasons?.length) {
      lines.push('Score reasons:')
      bind_score.reasons.forEach(r => lines.push(`  · ${r}`))
      lines.push('')
    }

    if (flags?.length) {
      lines.push('Flags:')
      flags.forEach(f => lines.push(`  ${f.severity === 'critical' ? '🚨' : '⚠️'} ${f.code.replace(/_/g, ' ')}: ${f.message}`))
      lines.push('')
    } else {
      lines.push('✅ No red flags found')
      lines.push('')
    }

    if (bind_score?.carrier_impact) {
      lines.push('Carrier impact:', bind_score.carrier_impact)
    } else if (insurability_summary) {
      lines.push('Summary:', insurability_summary)
    }

    return lines.filter(Boolean).join('\n')
  }

  function handleCopy() {
    navigator.clipboard.writeText(buildCopyText())
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '0 20px 60px' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div style={{ ...F.sans, fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', color: C.accent, textTransform: 'uppercase', marginBottom: 4 }}>
            {formLabel}
          </div>
          <div style={{ ...F.sans, fontSize: 22, fontWeight: 800, color: C.text, letterSpacing: '-0.02em' }}>
            {property?.address || 'Inspection Results'}
          </div>
          {(property?.inspection_date || property?.inspector_name) && (
            <div style={{ ...F.sans, fontSize: 13, color: C.muted, marginTop: 4 }}>
              {[property.inspection_date, property.inspector_name, property.license_number].filter(Boolean).join(' · ')}
            </div>
          )}
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button className={`copy-btn${copied ? ' copied' : ''}`} onClick={handleCopy}>
            {copied ? '✓ Copied' : 'Copy summary'}
          </button>
          <button className="ip-btn-outline" onClick={onReset} style={{ fontSize: 12, padding: '6px 12px' }}>
            New inspection
          </button>
        </div>
      </div>

      {/* BindIQ Score — first thing the agent sees */}
      <BindIQScore bs={bind_score} />

      {/* Flags */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ ...F.sans, fontSize: 12, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>
          Red Flags
        </div>
        <FlagsSection flags={flags} />
      </div>

      {/* Form data */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ ...F.sans, fontSize: 12, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>
          {form_type === 'wind_mitigation' ? 'Mitigation Selections' : 'Inspection Results'}
        </div>
        {form_type === 'wind_mitigation' && wind_mitigation && <WindMitOutput wm={wind_mitigation} />}
        {form_type === 'four_point' && four_point && <FourPointOutput fp={four_point} />}
      </div>

      {/* Insurability summary */}
      {insurability_summary && (
        <div style={{ background: 'rgba(4,37,108,0.03)', border: '1px solid rgba(4,37,108,0.12)', borderRadius: 12, padding: '18px 20px' }}>
          <div style={{ ...F.sans, fontSize: 12, fontWeight: 700, color: C.accent, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>
            Insurability Summary
          </div>
          <div style={{ ...F.sans, fontSize: 14, color: C.text, lineHeight: 1.7 }}>
            {insurability_summary}
          </div>
        </div>
      )}
    </div>
  )
}

/* ─── Email capture gate ─── */

function EmailGate({ onSubmit, onDismiss }) {
  const [email, setEmail] = useState('')
  const [err, setErr]     = useState('')
  const [busy, setBusy]   = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    const v = email.trim().toLowerCase()
    if (!v || !v.includes('@') || !v.includes('.')) { setErr('Enter a valid email address.'); return }
    setBusy(true)
    setErr('')
    await onSubmit(v)
    setBusy(false)
  }

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, background: 'rgba(15,31,61,0.55)', backdropFilter: 'blur(6px)' }}>
      <div style={{ background: '#fff', borderRadius: 20, padding: 40, maxWidth: 440, width: '100%', boxShadow: '0 24px 80px rgba(15,31,61,0.25)', textAlign: 'center' }}>
        <div style={{ width: 52, height: 52, borderRadius: '50%', background: C.accentBg, border: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px', fontSize: 24 }}>
          📄
        </div>
        <div style={{ ...F.sans, fontSize: 11, fontWeight: 700, color: C.accent, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
          Continue for free
        </div>
        <h2 style={{ ...F.sans, fontSize: 22, fontWeight: 800, color: C.text, margin: '0 0 10px', letterSpacing: '-0.02em' }}>
          Get 2 more free reports
        </h2>
        <p style={{ ...F.sans, fontSize: 14, color: C.muted, lineHeight: 1.65, margin: '0 0 24px' }}>
          Enter your email to continue — no password, no credit card.
        </p>
        <form onSubmit={handleSubmit} style={{ textAlign: 'left' }}>
          <input
            type="email"
            placeholder="you@agency.com"
            value={email}
            onChange={e => { setEmail(e.target.value); setErr('') }}
            autoFocus
            style={{ ...F.sans, width: '100%', boxSizing: 'border-box', padding: '12px 14px', borderRadius: 9, border: `1.5px solid ${err ? C.danger : C.border}`, fontSize: 14, color: C.text, outline: 'none', marginBottom: 8 }}
          />
          {err && <p style={{ ...F.sans, fontSize: 12, color: C.danger, margin: '0 0 10px' }}>{err}</p>}
          <button
            type="submit"
            disabled={busy}
            style={{ ...F.sans, width: '100%', padding: '13px', background: C.accent, color: '#fff', border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: busy ? 'not-allowed' : 'pointer', opacity: busy ? 0.6 : 1, boxShadow: '0 4px 16px rgba(4,37,108,0.30)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
          >
            {busy ? <><div style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'ipspin 0.7s linear infinite' }} />Checking...</> : 'Continue →'}
          </button>
        </form>
        <button
          onClick={onDismiss}
          style={{ ...F.sans, fontSize: 13, color: C.muted, background: 'none', border: 'none', cursor: 'pointer', padding: '12px 0 0', display: 'block', margin: '0 auto' }}
        >
          Maybe later
        </button>
      </div>
    </div>
  )
}

/* ─── Paywall modal ─── */

function PaywallGate() {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, background: 'rgba(15,31,61,0.55)', backdropFilter: 'blur(6px)' }}>
      <div style={{ background: '#fff', borderRadius: 20, padding: 40, maxWidth: 460, width: '100%', boxShadow: '0 24px 80px rgba(15,31,61,0.25)', textAlign: 'center' }}>
        <div style={{ width: 52, height: 52, borderRadius: '50%', background: C.accentBg, border: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px', fontSize: 24 }}>
          📄
        </div>
        <div style={{ ...F.sans, fontSize: 11, fontWeight: 700, color: C.accent, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
          Free limit reached
        </div>
        <h2 style={{ ...F.sans, fontSize: 22, fontWeight: 800, color: C.text, margin: '0 0 10px', letterSpacing: '-0.02em' }}>
          You've used your 3 free reports
        </h2>
        <p style={{ ...F.sans, fontSize: 14, color: C.muted, lineHeight: 1.65, margin: '0 0 28px' }}>
          Subscribe for unlimited 4-point and wind mitigation extractions — plus automatic red flag detection on every report.
        </p>
        <div style={{ background: C.bgAlt, border: `1px solid ${C.border}`, borderRadius: 12, padding: '14px 20px', marginBottom: 24, textAlign: 'left' }}>
          {['Unlimited extractions', 'Automatic red flag detection', 'All supported state forms', 'Cancel any time'].map(item => (
            <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="6" fill="rgba(16,185,129,0.12)"/><path d="M4.5 7l1.8 1.8L9.5 5" stroke={C.positive} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              <span style={{ ...F.sans, fontSize: 13, color: C.text }}>{item}</span>
            </div>
          ))}
          <div style={{ ...F.sans, fontSize: 20, fontWeight: 800, color: C.text, marginTop: 12, letterSpacing: '-0.02em' }}>
            $79<span style={{ fontSize: 13, fontWeight: 500, color: C.muted }}>/mo · or $59/mo billed annually</span>
          </div>
        </div>
        <Link
          to="/sign-up"
          style={{ ...F.sans, display: 'block', width: '100%', padding: '14px', background: C.accent, color: '#fff', border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: 'pointer', textDecoration: 'none', boxShadow: '0 4px 16px rgba(4,37,108,0.30)' }}
        >
          Choose a plan →
        </Link>
      </div>
    </div>
  )
}

/* ─── Page root ─── */

export default function InspectionPage() {
  const [searchParams] = useSearchParams()
  const initialMode = searchParams.get('mode') // e.g. ?mode=sample
  const [stage, setStage] = useState(initialMode ? 'input' : 'entry')
  const [inputMode, setInputMode] = useState(initialMode)
  const [result, setResult] = useState(null)
  const stateCode = useDetectedState()
  const stateConfig = getStateConfig(stateCode)

  function handleSelect(mode) {
    setInputMode(mode)
    setStage('input')
  }

  function handleResult(r) {
    setResult(r)
  }

  function handleReset() {
    setResult(null)
    setStage('entry')
    setInputMode(null)
  }

  return (
    <>
      <style>{PAGE_CSS}</style>
      <div style={{ minHeight: '100vh', background: C.bg, paddingTop: 72, paddingBottom: 40 }}>
        {result ? (
          <InspectionOutput result={result} onReset={handleReset} />
        ) : stage === 'entry' ? (
          <EntryScreen onSelect={handleSelect} stateConfig={stateConfig} />
        ) : (
          <InputView
            initialMode={inputMode}
            autoGenerate={inputMode === 'sample'}
            onResult={handleResult}
            stateConfig={stateConfig}
          />
        )}
      </div>
    </>
  )
}
