import { useState, useRef, useCallback, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { getStateConfig } from '../config/states'
import { useDetectedState } from '../hooks/useDetectedState'
import UpgradeModal from '../components/UpgradeModal'

const USES_KEY  = 'bindiq_uses'
const EMAIL_KEY = 'bindiq_email'
function getLocalUses()   { try { return parseInt(localStorage.getItem(USES_KEY) || '0', 10) } catch { return 0 } }
function incLocalUses()   { try { localStorage.setItem(USES_KEY, String(getLocalUses() + 1)) } catch {} }
function getStoredEmail() { try { return localStorage.getItem(EMAIL_KEY) || '' } catch { return '' } }
function saveEmail(e)     { try { localStorage.setItem(EMAIL_KEY, e.trim().toLowerCase()) } catch {} }

async function trackUsage(email, supabaseClient, accessToken = null) {
  try {
    const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : {}
    const body    = accessToken ? {} : { email }
    const { data } = await supabaseClient.functions.invoke('track-usage', { body, headers })
    return data ?? { allowed: false }
  } catch { return { allowed: false } }
}

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
  surface:    '#F8FAFC',
  surface2:   '#F1F5F9',
  font:       "'DM Sans', system-ui, sans-serif",
}

const PAGE_CSS = `
  html, body { background: ${T.surface}; }
  * { box-sizing: border-box; }

  .ip-textarea {
    width: 100%; padding: 16px; font-family: ${T.font};
    font-size: 13px; line-height: 1.7; color: ${T.text};
    background: #fff; border: 1.5px solid ${T.border};
    border-radius: 10px; resize: vertical; outline: none;
    transition: border-color 0.15s; min-height: 220px;
  }
  .ip-textarea:focus { border-color: rgba(4,37,108,0.40); }
  .ip-textarea::placeholder { color: ${T.subtle}; }

  .ip-btn-primary {
    background: ${T.navy}; color: #fff; border: none; border-radius: 10px;
    font-family: ${T.font}; font-size: 16px; font-weight: 700;
    padding: 16px 36px; cursor: pointer;
    transition: opacity 0.15s, box-shadow 0.15s;
    box-shadow: 0 4px 16px rgba(4,37,108,0.35);
    width: 100%; display: flex; align-items: center; justify-content: center; gap: 10px;
  }
  .ip-btn-primary:hover:not(:disabled) { opacity: 0.92; }
  .ip-btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }

  .ip-btn-outline {
    padding: 9px 18px; border-radius: 8px;
    border: 1.5px solid ${T.border}; background: #fff;
    font-family: ${T.font}; font-size: 13px; font-weight: 600; color: ${T.muted};
    cursor: pointer; transition: all 0.15s;
  }
  .ip-btn-outline:hover { border-color: ${T.navy}; color: ${T.navy}; }
  .ip-btn-outline.active { border-color: ${T.navy}; color: ${T.navy}; background: rgba(4,37,108,0.05); }

  .ip-dropzone {
    border: 2px dashed ${T.border}; border-radius: 10px;
    padding: 40px; text-align: center; cursor: pointer; transition: all 0.15s;
  }
  .ip-dropzone:hover, .ip-dropzone.drag-over {
    border-color: rgba(4,37,108,0.40); background: rgba(4,37,108,0.03);
  }

  .ip-spinner {
    width: 52px; height: 52px;
    border: 4px solid rgba(4,37,108,0.12);
    border-top-color: ${T.navy};
    border-radius: 50%;
    animation: ipspin 0.8s linear infinite;
  }
  .ip-spinner-sm {
    width: 20px; height: 20px;
    border: 2.5px solid rgba(255,255,255,0.3);
    border-top-color: #fff;
    border-radius: 50%;
    animation: ipspin 0.7s linear infinite;
  }
  @keyframes ipspin { to { transform: rotate(360deg); } }

  .ip-progress-bar { height: 3px; background: ${T.border}; border-radius: 2px; overflow: hidden; }
  .ip-progress-fill { height: 100%; background: ${T.navy}; border-radius: 2px; transition: width 0.6s ease; }

  .entry-option {
    background: #fff; border: 1.5px solid ${T.border};
    border-radius: 14px; padding: 22px 24px;
    display: flex; align-items: center; gap: 18px;
    cursor: pointer; width: 100%;
    transition: border-color 0.18s, box-shadow 0.18s, transform 0.1s;
    text-align: left;
  }
  .entry-option:hover {
    border-color: ${T.navyBorder};
    box-shadow: 0 6px 24px rgba(4,37,108,0.08);
    transform: translateY(-1px);
  }
  .entry-option:active { transform: translateY(0); }

  .ip-field-row {
    display: flex; align-items: flex-start;
    padding: 10px 0; border-bottom: 1px solid ${T.border}; gap: 16px;
  }
  .ip-field-row:last-child { border-bottom: none; padding-bottom: 0; }
  .ip-section {
    background: #fff; border: 1px solid ${T.border};
    border-radius: 12px; padding: 20px 22px;
  }

  .ip-flag-critical {
    background: rgba(239,68,68,0.07); border: 1px solid rgba(239,68,68,0.25);
    border-radius: 10px; padding: 12px 16px;
    display: flex; align-items: flex-start; gap: 10px;
  }
  .ip-flag-warning {
    background: rgba(245,158,11,0.07); border: 1px solid rgba(245,158,11,0.25);
    border-radius: 10px; padding: 12px 16px;
    display: flex; align-items: flex-start; gap: 10px;
  }

  .ip-selection-badge {
    display: inline-flex; align-items: center; justify-content: center;
    width: 26px; height: 26px; border-radius: 6px;
    font-family: ${T.font}; font-size: 13px; font-weight: 800; flex-shrink: 0;
  }

  .copy-btn {
    padding: 5px 12px; border-radius: 6px;
    border: 1px solid ${T.border}; background: #fff;
    font-family: ${T.font}; font-size: 11px; font-weight: 600; color: ${T.muted};
    cursor: pointer; transition: all 0.15s;
  }
  .copy-btn:hover { border-color: ${T.navy}; color: ${T.navy}; }
  .copy-btn.copied { border-color: ${T.green}; color: ${T.green}; }

  @media (max-width: 640px) {
    .ip-btn-primary { font-size: 15px; padding: 14px 24px; }
    .entry-option { padding: 18px 20px; gap: 14px; }
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
  try {
    const pdfjsLib = await loadPdfJs()
    if (!pdfjsLib) throw new Error('PDF.js library failed to load')

    const arrayBuffer = await file.arrayBuffer()
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise

    let fullText = ''
    for (let i = 1; i <= pdf.numPages; i++) {
      try {
        const page = await pdf.getPage(i)
        const content = await page.getTextContent()
        const pageText = content.items.map(item => item.str).join(' ')
        fullText += pageText + '\n'
      } catch (pageErr) {
        console.warn(`Failed to extract page ${i}:`, pageErr)
      }
    }

    if (!fullText.trim()) {
      throw new Error('No text could be extracted from PDF — it may be a scanned image with no OCR')
    }
    return fullText.trim()
  } catch (err) {
    console.error('PDF extraction error:', err)
    throw err
  }
}

/* ─── Entry screen ─── */

function EntryScreen({ onSelect, stateConfig }) {
  const sc = stateConfig
  const OPTIONS = [
    { id: 'upload', icon: '📄', label: 'Upload PDF',       desc: `Drop a ${sc.formShort.split('·')[0].trim()} PDF — text is extracted automatically` },
    { id: 'paste',  icon: '📋', label: 'Paste report text', desc: 'Copy and paste text from any inspection report' },
    { id: 'sample', icon: '⚡', label: 'See a demo',        desc: `Run extraction on a sample ${sc.sampleType.toLowerCase()} instantly`, badge: 'INSTANT' },
  ]
  return (
    <div style={{ maxWidth: 640, margin: '0 auto', padding: '0 24px' }}>
      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <div style={{ fontFamily: T.font, fontSize: 13, fontWeight: 700, color: T.navy, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>
          BINDIQ SCORER
        </div>
        <h1 style={{ fontFamily: T.font, fontSize: 30, fontWeight: 800, color: T.text, letterSpacing: '-0.03em', margin: '0 0 10px' }}>
          Get your BindIQ Score
        </h1>
        <p style={{ fontFamily: T.font, fontSize: 15, color: T.muted, margin: 0, lineHeight: 1.6, maxWidth: 420, marginLeft: 'auto', marginRight: 'auto' }}>
          {sc.entryDesc}
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {OPTIONS.map(opt => (
          <button key={opt.id} className="entry-option" onClick={() => onSelect(opt.id)}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: T.navyLight, border: `1px solid ${T.navyBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>
              {opt.icon}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                <span style={{ fontFamily: T.font, fontSize: 15, fontWeight: 700, color: T.text }}>{opt.label}</span>
                {opt.badge && (
                  <span style={{ fontFamily: T.font, fontSize: 13, fontWeight: 700, color: '#fff', background: T.navy, padding: '2px 8px', borderRadius: 99 }}>
                    {opt.badge}
                  </span>
                )}
              </div>
              <span style={{ fontFamily: T.font, fontSize: 13, color: T.muted, lineHeight: 1.5 }}>{opt.desc}</span>
            </div>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
              <path d="M6 3l5 5-5 5" stroke={T.subtle} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        ))}
      </div>

      <p style={{ fontFamily: T.font, fontSize: 13, color: T.subtle, textAlign: 'center', marginTop: 24 }}>
        {sc.footerNote} · More forms coming soon
      </p>
    </div>
  )
}

/* ─── Input view ─── */

function InputView({ initialMode, autoGenerate, onResult, stateConfig, embed }) {
  const sc = stateConfig
  const [mode, setMode]                   = useState(initialMode === 'upload' ? 'upload' : 'paste')
  const [text, setText]                   = useState(initialMode === 'sample' ? SAMPLE_WIND_MIT : '')
  const [loading, setLoading]             = useState(autoGenerate)
  const [progress, setProgress]           = useState(0)
  const [stage, setStage]                 = useState(autoGenerate ? 'Reading document...' : '')
  const [error, setError]                 = useState(null)
  const [dragging, setDragging]           = useState(false)
  const [fileStatuses, setFileStatuses]   = useState([])
  const [showEmailGate, setShowEmailGate] = useState(false)
  const [showPaywall, setShowPaywall]     = useState(false)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [upgradeInfo, setUpgradeInfo]     = useState(null)
  const [pendingRaw, setPendingRaw]       = useState(null)
  const skipGateRef = useRef(false)
  const fileRef     = useRef(null)
  const autoFired   = useRef(false)
  const timers      = useRef([])

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

  const extract = useCallback(async (overrideText, source = 'paste') => {
    const raw = (overrideText ?? text).trim()

    // Different thresholds for uploaded vs pasted text
    const minLength = source === 'upload' ? 20 : 50
    if (!raw || raw.length < minLength) {
      const msg = source === 'upload'
        ? 'Extracted text is too short. Please try: (1) another PDF format, (2) pasting the text directly instead.'
        : 'Please paste at least 50 characters of inspection report text.'
      setError(msg)
      return
    }

    const isSample = initialMode === 'sample'

    if (!isSample) {
      if (skipGateRef.current) {
        skipGateRef.current = false
      } else {
        const { data: { session } } = await supabase.auth.getSession()

        if (session?.access_token) {
          const result = await trackUsage(null, supabase, session.access_token)
          if (!result?.allowed) {
            if (result?.reason === 'cap') {
              setUpgradeInfo(result)
              setShowUpgradeModal(true)
            } else {
              setShowPaywall(true)
            }
            return
          }
        } else {
          const localUses = getLocalUses()
          const email = getStoredEmail()

          if (localUses >= 1) {
            if (!email) {
              setPendingRaw(overrideText ?? null)
              setShowEmailGate(true)
              return
            }
            const result = await trackUsage(email, supabase)
            if (!result?.allowed) {
              setShowPaywall(true)
              return
            }
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
      const t = setTimeout(() => {
        if (autoFired.current) extract(SAMPLE_WIND_MIT)
      }, 400)
      return () => {
        autoFired.current = false  // reset so StrictMode second-run can re-schedule
        clearTimeout(t)
      }
    }
  }, [autoGenerate, extract])

  async function handleFiles(fileList) {
    const files = Array.from(fileList)

    // Validate file count
    if (files.length === 0) return
    if (files.length > 2) {
      setError('Maximum 2 files allowed. Please select up to 2 files.')
      return
    }

    setFileStatuses(files.map(f => ({ name: f.name, status: 'uploading', error: null })))
    setError(null)
    setStage('Extracting text from files...')
    try {
      // Extract text from all files separately, then combine them
      const texts = []
      for (const file of files) {
        let text
        if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
          try {
            text = await extractTextFromPDF(file)
          } catch (extractErr) {
            console.error(`PDF extraction failed for ${file.name}:`, extractErr)
            throw new Error(`Could not extract text from ${file.name} — it may be a scanned image. Try pasting the text instead.`)
          }

          // Relaxed threshold for uploads - text extraction is imperfect
          if (!text || text.trim().length === 0) {
            throw new Error(`${file.name} has no readable text (scanned image?). Try pasting the text instead.`)
          }
        } else {
          text = await new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.onload = e => resolve(e.target.result)
            reader.onerror = () => reject(new Error(`Could not read ${file.name}`))
            reader.readAsText(file)
          })
          if (!text || text.trim().length === 0) {
            throw new Error(`${file.name} is empty.`)
          }
        }
        texts.push(text.trim())
      }
      // Combine texts naturally with a newline separator, not a marker
      const combinedText = texts.join('\n\n')
      if (!combinedText || combinedText.trim().length === 0) {
        throw new Error('No readable text found in uploaded files.')
      }
      setText(combinedText)
      setStage('')
      setMode('paste')
      // Auto-submit with the combined text directly (avoids stale closure in state)
      // Pass source='upload' since this came from file upload
      extract(combinedText, 'upload')
    } catch (e) {
      console.error('File handling error:', e)
      setError(e.message || 'Could not process files. Try copying and pasting the text instead.')
      setFileStatuses([])
      setStage('')
    }
  }

  // ── Loading screen ──
  if (loading) {
    return (
      <div style={{ maxWidth: 640, margin: '0 auto', padding: '0 24px', textAlign: 'center', paddingTop: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 28 }}>
          <div className="ip-spinner" />
        </div>
        <div style={{ fontFamily: T.font, fontSize: 15, fontWeight: 600, color: T.text, marginBottom: 20 }}>{stage}</div>
        <div className="ip-progress-bar" style={{ maxWidth: 360, margin: '0 auto' }}>
          <div className="ip-progress-fill" style={{ width: `${progress}%` }} />
        </div>
        <div style={{ fontFamily: T.font, fontSize: 13, color: T.subtle, marginTop: 8 }}>{progress}%</div>
      </div>
    )
  }

  return (
    <>
      {showEmailGate && <EmailGate onSubmit={handleEmailSubmit} onDismiss={() => setShowEmailGate(false)} />}
      {showPaywall && <PaywallGate />}
      {showUpgradeModal && <UpgradeModal info={upgradeInfo} onDismiss={() => setShowUpgradeModal(false)} />}
      <div style={{ maxWidth: 600, margin: '0 auto', padding: '0 20px' }}>
        {!embed && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28 }}>
            <div style={{ fontFamily: T.font, fontSize: 16, fontWeight: 800, color: T.text, letterSpacing: '-0.01em' }}>BindIQ</div>
            <span style={{ fontFamily: T.font, fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', color: T.navy, textTransform: 'uppercase' }}>Bind Likelihood Scorer</span>
          </div>
        )}

        {/* Mode tabs — hidden in sample mode */}
        {initialMode === 'sample' ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
            <span style={{ fontFamily: T.font, fontSize: 12, fontWeight: 700, color: T.navy, textTransform: 'uppercase', letterSpacing: '0.08em', background: T.navyLight, border: `1px solid ${T.navyBorder}`, borderRadius: 6, padding: '4px 10px' }}>Sample report</span>
            <span style={{ fontFamily: T.font, fontSize: 12, color: T.subtle }}>{sc?.sampleLabel || 'Wind mitigation · Naples, FL'}</span>
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
            <div style={{ fontFamily: T.font, fontSize: 15, fontWeight: 600, color: T.text, marginBottom: 6 }}>Drop 1–2 inspection PDFs here</div>
            <div style={{ fontFamily: T.font, fontSize: 13, color: T.muted }}>or click to browse · PDF or TXT</div>
            {fileStatuses.length > 0 && (
              <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 6 }}>
                {fileStatuses.map(fs => (
                  <div key={fs.name} style={{ fontFamily: T.font, fontSize: 13, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ color: fs.status === 'uploading' ? T.muted : fs.error ? '#EF4444' : T.green }}>
                      {fs.status === 'uploading' ? '⏳' : fs.error ? '✗' : '✓'}
                    </span>
                    <span style={{ color: fs.error ? '#EF4444' : T.text, fontWeight: fs.error ? 600 : 400 }}>
                      {fs.name}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Progress bar (non-loading state — PDF extraction) */}
        {stage === 'Extracting text from PDFs...' && (
          <div style={{ marginTop: 16 }}>
            <div className="ip-progress-bar">
              <div className="ip-progress-fill" style={{ width: `${progress}%` }} />
            </div>
            <div style={{ fontFamily: T.font, fontSize: 12, color: T.muted, marginTop: 8 }}>{stage}</div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div style={{ fontFamily: T.font, fontSize: 13, color: '#DC2626', background: 'rgba(220,38,38,0.06)', border: '1px solid rgba(220,38,38,0.20)', borderRadius: 8, padding: '10px 14px', marginTop: 12 }}>
            {error}
          </div>
        )}

        {/* Submit button — hidden in auto-generate loading state */}
        {!(autoGenerate && loading) && (
          <button className="ip-btn-primary" onClick={() => extract()} disabled={loading} style={{ marginTop: 16 }}>
            {loading
              ? <><div className="ip-spinner-sm" /><span>Scoring...</span></>
              : <><span>Get BindIQ Score</span><span style={{ fontSize: 18 }}>→</span></>
            }
          </button>
        )}

        {!embed && (
          <p style={{ fontFamily: T.font, fontSize: 12, color: T.subtle, textAlign: 'center', marginTop: 12 }}>
            {sc?.footerNote || 'Florida 4-point · Wind mitigation OIR-B1-1802'}
          </p>
        )}
      </div>
    </>
  )
}

/* ─── Output components ─── */

const WIND_MIT_LABELS = {
  roof_covering:              'Roof Covering',
  roof_deck_attachment:       'Roof Deck Attachment',
  roof_to_wall_connection:    'Roof-to-Wall Connection',
  roof_geometry:              'Roof Geometry',
  secondary_water_resistance: 'Secondary Water Resistance',
  opening_protection:         'Opening Protection',
}

const SELECTION_COLOUR = {
  A: { bg: 'rgba(16,185,129,0.12)', color: '#065F46' },
  B: { bg: 'rgba(16,185,129,0.08)', color: '#047857' },
  C: { bg: 'rgba(245,158,11,0.10)', color: '#92400E' },
  D: { bg: 'rgba(16,185,129,0.12)', color: '#065F46' },
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
    <span style={{ fontFamily: T.font, fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 6, background: s.bg, color: s.color }}>
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
    if (!val) return <span style={{ fontFamily: T.font, fontSize: 13, color: T.subtle }}>Not found</span>

    if (key === 'roof_geometry') {
      const shape = val.shape ? val.shape.charAt(0).toUpperCase() + val.shape.slice(1) : '—'
      const pct = val.hip_percentage != null ? ` (${val.hip_percentage}% hip)` : ''
      return <span style={{ fontFamily: T.font, fontSize: 13, color: T.text }}>{shape}{pct}</span>
    }

    if (key === 'secondary_water_resistance') {
      const present = val.present
      return (
        <span style={{ fontFamily: T.font, fontSize: 13, color: present ? '#065F46' : '#DC2626', fontWeight: 600 }}>
          {present ? '✓ Present' : '✗ Not present'}{val.type ? ` — ${val.type}` : ''}
        </span>
      )
    }

    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {val.selection && <SelectionBadge letter={val.selection} />}
        <span style={{ fontFamily: T.font, fontSize: 13, color: T.text }}>{val.description || '—'}</span>
      </div>
    )
  }

  return (
    <div className="ip-section">
      {sections.map(({ key, value }) => (
        <div key={key} className="ip-field-row">
          <div style={{ fontFamily: T.font, fontSize: 12, fontWeight: 600, color: T.muted, width: 180, flexShrink: 0, paddingTop: 2 }}>
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
      { label: 'Material',              value: fp.roof?.material },
      { label: 'Age',                   value: fp.roof?.age_years != null ? `${fp.roof.age_years} years` : null },
      { label: 'Est. remaining life',   value: fp.roof?.estimated_remaining_life_years != null ? `${fp.roof.estimated_remaining_life_years} years` : null },
      { label: 'Notes',                 value: fp.roof?.notes },
    ]},
    { label: 'HVAC',       icon: '❄️', data: fp.hvac,       fields: [
      { label: 'Type',                  value: fp.hvac?.type },
      { label: 'Brand',                 value: fp.hvac?.brand },
      { label: 'Age',                   value: fp.hvac?.age_years != null ? `${fp.hvac.age_years} years` : null },
      { label: 'Notes',                 value: fp.hvac?.notes },
    ]},
    { label: 'Plumbing',   icon: '🔧', data: fp.plumbing,   fields: [
      { label: 'Supply lines',          value: fp.plumbing?.supply_material },
      { label: 'Drain lines',           value: fp.plumbing?.drain_material },
      { label: 'Water heater age',      value: fp.plumbing?.water_heater_age_years != null ? `${fp.plumbing.water_heater_age_years} years` : null },
      { label: 'Notes',                 value: fp.plumbing?.notes },
    ]},
    { label: 'Electrical', icon: '⚡', data: fp.electrical, fields: [
      { label: 'Panel brand',           value: fp.electrical?.panel_brand },
      { label: 'Panel type',            value: fp.electrical?.panel_type?.replace('_', ' ') },
      { label: 'Service size',          value: fp.electrical?.service_amps ? `${fp.electrical.service_amps} amps` : null },
      { label: 'Wiring',                value: fp.electrical?.wiring_type },
      { label: 'Notes',                 value: fp.electrical?.notes },
    ]},
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {systems.map(sys => (
        <div key={sys.label} className="ip-section">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <span style={{ fontSize: 18 }}>{sys.icon}</span>
            <span style={{ fontFamily: T.font, fontSize: 15, fontWeight: 700, color: T.text }}>{sys.label}</span>
            {sys.data?.condition && <ConditionBadge condition={sys.data.condition} />}
          </div>
          {sys.fields.filter(f => f.value).map(f => (
            <div key={f.label} className="ip-field-row">
              <div style={{ fontFamily: T.font, fontSize: 12, fontWeight: 600, color: T.muted, width: 160, flexShrink: 0, paddingTop: 1 }}>{f.label}</div>
              <div style={{ fontFamily: T.font, fontSize: 13, color: T.text }}>{f.value}</div>
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
          <div style={{ fontFamily: T.font, fontSize: 14, fontWeight: 700, color: '#065F46' }}>No red flags</div>
          <div style={{ fontFamily: T.font, fontSize: 13, color: '#047857', marginTop: 2 }}>Nothing found that would prevent placement with standard carriers.</div>
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
            <div style={{ fontFamily: T.font, fontSize: 13, fontWeight: 700, color: '#991B1B' }}>{f.code.replace(/_/g, ' ')}</div>
            <div style={{ fontFamily: T.font, fontSize: 13, color: '#B91C1C', marginTop: 2 }}>{f.message}</div>
          </div>
        </div>
      ))}
      {warnings.map((f, i) => (
        <div key={i} className="ip-flag-warning">
          <span style={{ fontSize: 18, flexShrink: 0 }}>⚠️</span>
          <div>
            <div style={{ fontFamily: T.font, fontSize: 13, fontWeight: 700, color: '#92400E' }}>{f.code.replace(/_/g, ' ')}</div>
            <div style={{ fontFamily: T.font, fontSize: 13, color: '#B45309', marginTop: 2 }}>{f.message}</div>
          </div>
        </div>
      ))}
    </div>
  )
}

function BindIQScore({ bs }) {
  if (!bs) return null

  const map = {
    likely_bind:      { bg: 'rgba(16,185,129,0.07)', border: '1.5px solid rgba(16,185,129,0.28)', barColor: '#10B981', scoreColor: '#065F46', emoji: '🟢', label: 'Likely to Bind' },
    conditional_risk: { bg: 'rgba(245,158,11,0.07)', border: '1.5px solid rgba(245,158,11,0.30)', barColor: '#F59E0B', scoreColor: '#92400E', emoji: '🟡', label: 'Conditional Risk' },
    likely_decline:   { bg: 'rgba(239,68,68,0.07)',  border: '1.5px solid rgba(239,68,68,0.28)',  barColor: '#EF4444', scoreColor: '#991B1B', emoji: '🔴', label: 'Likely Decline' },
  }
  const s = map[bs.label] || map.conditional_risk

  return (
    <div style={{ background: s.bg, border: s.border, borderRadius: 16, padding: '24px 26px', marginBottom: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 16 }}>
        <div style={{ flexShrink: 0 }}>
          <div style={{ fontFamily: T.font, fontSize: 11, fontWeight: 700, color: s.scoreColor, letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 4 }}>BindIQ Score</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 3, lineHeight: 1 }}>
            <span style={{ fontFamily: T.font, fontSize: 56, fontWeight: 800, color: s.scoreColor, letterSpacing: '-0.04em', lineHeight: 1 }}>{bs.score}</span>
            <span style={{ fontFamily: T.font, fontSize: 15, color: s.scoreColor, opacity: 0.45, fontWeight: 600 }}>/100</span>
          </div>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <span style={{ fontSize: 20 }}>{s.emoji}</span>
            <span style={{ fontFamily: T.font, fontSize: 17, fontWeight: 800, color: s.scoreColor, letterSpacing: '-0.01em' }}>{s.label}</span>
          </div>
          <div style={{ height: 8, background: 'rgba(0,0,0,0.07)', borderRadius: 4, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${bs.score}%`, background: s.barColor, borderRadius: 4, transition: 'width 1s ease' }} />
          </div>
          <div style={{ fontFamily: T.font, fontSize: 11, color: s.scoreColor, opacity: 0.55, marginTop: 5 }}>{bs.scoreSubtitle || 'Standard carrier placement likelihood'}</div>
        </div>
      </div>

      {bs.reasons?.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontFamily: T.font, fontSize: 11, fontWeight: 700, color: s.scoreColor, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8 }}>Why this score</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            {bs.reasons.map((r, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                <span style={{ fontFamily: T.font, fontSize: 13, color: s.scoreColor, flexShrink: 0, marginTop: 1 }}>·</span>
                <span style={{ fontFamily: T.font, fontSize: 13, color: s.scoreColor, lineHeight: 1.55, opacity: 0.85 }}>{r}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {bs.carrier_impact && (
        <div style={{ paddingTop: 14, borderTop: `1px solid ${s.barColor}22` }}>
          <div style={{ fontFamily: T.font, fontSize: 11, fontWeight: 700, color: s.scoreColor, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 5 }}>Carrier impact</div>
          <div style={{ fontFamily: T.font, fontSize: 13, color: s.scoreColor, lineHeight: 1.65, opacity: 0.8 }}>{bs.carrier_impact}</div>
        </div>
      )}
    </div>
  )
}

function UsageNudge({ embed }) {
  if (embed) return null
  const uses = getLocalUses()
  const email = getStoredEmail()
  if (uses === 0 || uses >= 3) return null
  const remaining = 3 - uses
  const isLastFree = remaining === 1 && !email

  return (
    <div style={{
      fontFamily: T.font, fontSize: 13, fontWeight: 500,
      background: isLastFree ? 'rgba(245,158,11,0.08)' : 'rgba(4,37,108,0.05)',
      border: `1px solid ${isLastFree ? 'rgba(245,158,11,0.30)' : 'rgba(4,37,108,0.14)'}`,
      borderRadius: 10, padding: '10px 16px', marginBottom: 20,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap',
    }}>
      <span style={{ color: isLastFree ? '#92400E' : T.muted }}>
        {isLastFree
          ? '⚠️ This is your last free report. Enter your email to continue after this.'
          : `✓ Report ${uses} of 3 free reports used — ${remaining} remaining.`
        }
      </span>
      <Link to="/sign-up" style={{ fontFamily: T.font, fontSize: 12, fontWeight: 700, color: T.navy, textDecoration: 'none', whiteSpace: 'nowrap' }}>
        Upgrade for unlimited →
      </Link>
    </div>
  )
}

function InspectionOutput({ result, onReset, embed }) {
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
    <div style={{ maxWidth: 700, margin: '0 auto', padding: '0 20px 60px' }}>

      {/* Conversion nudge bar */}
      <UsageNudge embed={embed} />

      {/* Result header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div style={{ fontFamily: T.font, fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', color: T.navy, textTransform: 'uppercase', marginBottom: 4 }}>
            {formLabel}
          </div>
          <div style={{ fontFamily: T.font, fontSize: 22, fontWeight: 800, color: T.text, letterSpacing: '-0.02em' }}>
            {property?.address || 'Inspection Results'}
          </div>
          {(property?.inspection_date || property?.inspector_name) && (
            <div style={{ fontFamily: T.font, fontSize: 13, color: T.muted, marginTop: 4 }}>
              {[property.inspection_date, property.inspector_name, property.license_number].filter(Boolean).join(' · ')}
            </div>
          )}
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button className={`copy-btn${copied ? ' copied' : ''}`} onClick={handleCopy}>
            {copied ? '✓ Copied' : 'Copy summary'}
          </button>
          {!embed && (
            <button className="ip-btn-outline" onClick={onReset} style={{ fontSize: 12, padding: '6px 12px' }}>
              New inspection
            </button>
          )}
          {embed && (
            <a href="/inspect" style={{ fontFamily: T.font, fontSize: 12, padding: '6px 12px', borderRadius: 8, border: `1.5px solid ${T.border}`, color: T.navy, textDecoration: 'none', fontWeight: 600 }}>
              Try with your report →
            </a>
          )}
        </div>
      </div>

      {/* Score card */}
      <BindIQScore bs={bind_score} />

      {/* Red flags */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontFamily: T.font, fontSize: 12, fontWeight: 700, color: T.muted, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>
          Red Flags
        </div>
        <FlagsSection flags={flags} />
      </div>

      {/* Mitigation selections / inspection results */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontFamily: T.font, fontSize: 12, fontWeight: 700, color: T.muted, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>
          {form_type === 'wind_mitigation' ? 'Mitigation Selections' : 'Inspection Results'}
        </div>
        {form_type === 'wind_mitigation' && wind_mitigation && <WindMitOutput wm={wind_mitigation} />}
        {form_type === 'four_point' && four_point && <FourPointOutput fp={four_point} />}
      </div>

      {/* Insurability summary */}
      {insurability_summary && (
        <div style={{ background: 'rgba(4,37,108,0.03)', border: '1px solid rgba(4,37,108,0.12)', borderRadius: 12, padding: '18px 20px' }}>
          <div style={{ fontFamily: T.font, fontSize: 12, fontWeight: 700, color: T.navy, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>
            Insurability Summary
          </div>
          <div style={{ fontFamily: T.font, fontSize: 14, color: T.text, lineHeight: 1.7 }}>
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
        <div style={{ width: 52, height: 52, borderRadius: '50%', background: T.navyLight, border: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px', fontSize: 24 }}>📄</div>
        <div style={{ fontFamily: T.font, fontSize: 11, fontWeight: 700, color: T.navy, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Continue for free</div>
        <h2 style={{ fontFamily: T.font, fontSize: 22, fontWeight: 800, color: T.text, margin: '0 0 10px', letterSpacing: '-0.02em' }}>Get 2 more free reports</h2>
        <p style={{ fontFamily: T.font, fontSize: 14, color: T.muted, lineHeight: 1.65, margin: '0 0 24px' }}>
          Enter your email to continue — no password, no credit card.
        </p>
        <form onSubmit={handleSubmit} style={{ textAlign: 'left' }}>
          <input
            type="email"
            placeholder="you@agency.com"
            value={email}
            onChange={e => { setEmail(e.target.value); setErr('') }}
            autoFocus
            style={{ fontFamily: T.font, width: '100%', boxSizing: 'border-box', padding: '12px 14px', borderRadius: 9, border: `1.5px solid ${err ? '#DC2626' : T.border}`, fontSize: 14, color: T.text, outline: 'none', marginBottom: 8 }}
          />
          {err && <p style={{ fontFamily: T.font, fontSize: 12, color: '#DC2626', margin: '0 0 10px' }}>{err}</p>}
          <button
            type="submit"
            disabled={busy}
            style={{ fontFamily: T.font, width: '100%', padding: '13px', background: T.navy, color: '#fff', border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: busy ? 'not-allowed' : 'pointer', opacity: busy ? 0.6 : 1, boxShadow: '0 4px 16px rgba(4,37,108,0.30)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
          >
            {busy ? <><div style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'ipspin 0.7s linear infinite' }} />Checking...</> : 'Continue →'}
          </button>
        </form>
        <button onClick={onDismiss} style={{ fontFamily: T.font, fontSize: 13, color: T.muted, background: 'none', border: 'none', cursor: 'pointer', padding: '12px 0 0', display: 'block', margin: '0 auto' }}>
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
        <div style={{ width: 52, height: 52, borderRadius: '50%', background: T.navyLight, border: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px', fontSize: 24 }}>📄</div>
        <div style={{ fontFamily: T.font, fontSize: 11, fontWeight: 700, color: T.navy, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Free limit reached</div>
        <h2 style={{ fontFamily: T.font, fontSize: 22, fontWeight: 800, color: T.text, margin: '0 0 10px', letterSpacing: '-0.02em' }}>You've used your 3 free reports</h2>
        <p style={{ fontFamily: T.font, fontSize: 14, color: T.muted, lineHeight: 1.65, margin: '0 0 28px' }}>
          Subscribe for unlimited 4-point and wind mitigation extractions — plus automatic red flag detection on every report.
        </p>
        <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 12, padding: '14px 20px', marginBottom: 24, textAlign: 'left' }}>
          {['Unlimited extractions', 'Automatic red flag detection', 'All supported state forms', 'Cancel any time'].map(item => (
            <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <circle cx="7" cy="7" r="6" fill="rgba(16,185,129,0.12)"/>
                <path d="M4.5 7l1.8 1.8L9.5 5" stroke={T.green} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span style={{ fontFamily: T.font, fontSize: 13, color: T.text }}>{item}</span>
            </div>
          ))}
          <div style={{ fontFamily: T.font, fontSize: 20, fontWeight: 800, color: T.text, marginTop: 12, letterSpacing: '-0.02em' }}>
            $79<span style={{ fontSize: 13, fontWeight: 500, color: T.muted }}>/mo · or $59/mo billed annually</span>
          </div>
        </div>
        <Link to="/checkout?plan=starter" style={{ fontFamily: T.font, display: 'block', width: '100%', padding: '14px', background: T.navy, color: '#fff', border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: 'pointer', textDecoration: 'none', boxShadow: '0 4px 16px rgba(4,37,108,0.30)' }}>
          Choose a plan →
        </Link>
      </div>
    </div>
  )
}

/* ─── Page root ─── */

export default function InspectionPage() {
  const [searchParams] = useSearchParams()
  const initialMode = searchParams.get('mode')
  const embed = searchParams.get('embed') === '1'
  const [stage, setStage] = useState(initialMode ? 'input' : 'entry')

  // Restore and persist user session across visits
  useEffect(() => {
    let isMounted = true

    async function restoreOrSync() {
      // First, try to restore from localStorage if session exists
      const storedSession = localStorage.getItem('bindiq_session')
      if (storedSession) {
        try {
          const parsed = JSON.parse(storedSession)
          // Try to restore the session
          await supabase.auth.setSession(parsed)
        } catch (e) {
          console.warn('Failed to restore session from storage:', e)
          localStorage.removeItem('bindiq_session')
        }
      }

      // Then sync with Supabase to get current session
      const { data: { session } } = await supabase.auth.getSession()
      if (!isMounted) return

      // If we have an active session, store it for next visit
      if (session) {
        localStorage.setItem('bindiq_session', JSON.stringify({
          access_token: session.access_token,
          refresh_token: session.refresh_token,
          expires_at: session.expires_at,
        }))
        // Sync email if signed in
        if (session.user?.email && !getStoredEmail()) {
          saveEmail(session.user.email)
        }
      } else {
        // No session - clear the stored one
        localStorage.removeItem('bindiq_session')
      }

      // Watch for auth changes and update storage
      const { data: { subscription } } = supabase.auth.onAuthStateChange((event, newSession) => {
        if (!isMounted) return
        if (newSession) {
          localStorage.setItem('bindiq_session', JSON.stringify({
            access_token: newSession.access_token,
            refresh_token: newSession.refresh_token,
            expires_at: newSession.expires_at,
          }))
          if (newSession.user?.email && !getStoredEmail()) {
            saveEmail(newSession.user.email)
          }
        } else {
          localStorage.removeItem('bindiq_session')
        }
      })

      return () => subscription?.unsubscribe()
    }

    const cleanup = restoreOrSync()
    return () => {
      isMounted = false
      cleanup?.then(unsub => unsub?.())
    }
  }, [])

  const [inputMode, setInputMode] = useState(initialMode)
  const [result, setResult]       = useState(null)
  const stateCode   = useDetectedState()
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
      <div style={{ minHeight: embed ? 'auto' : '100vh', background: T.surface, paddingTop: embed ? 20 : 100, paddingBottom: embed ? 24 : 40 }}>
        {result ? (
          <InspectionOutput result={result} onReset={handleReset} embed={embed} />
        ) : stage === 'entry' ? (
          <EntryScreen onSelect={handleSelect} stateConfig={stateConfig} />
        ) : (
          <InputView
            initialMode={inputMode}
            autoGenerate={inputMode === 'sample'}
            onResult={handleResult}
            stateConfig={stateConfig}
            embed={embed}
          />
        )}
      </div>
    </>
  )
}
