import { useState, useEffect, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
)

const C = {
  navy: '#04256C',
  navyDark: '#021B4E',
  accent: '#2563EB',
  fg: '#0F172A',
  muted: '#64748B',
  mutedLight: '#94A3B8',
  border: '#E2E8F0',
  borderFocus: '#2563EB',
  bg: '#ffffff',
  bgSoft: '#F8FAFC',
  green: '#10B981',
  greenBg: 'rgba(16,185,129,0.07)',
  greenBorder: 'rgba(16,185,129,0.25)',
  amber: '#F59E0B',
  amberBg: 'rgba(245,158,11,0.07)',
  amberBorder: 'rgba(245,158,11,0.28)',
  red: '#EF4444',
  redBg: 'rgba(239,68,68,0.07)',
  redBorder: 'rgba(239,68,68,0.25)',
}

// ── PDF text extraction via pdfjs ─────────────────────────────────────────────
async function extractPdfText(file) {
  return new Promise((resolve, reject) => {
    const script = document.querySelector('script[data-pdfjsloaded]')
    const load = () => {
      const reader = new FileReader()
      reader.onload = async (e) => {
        try {
          const pdfjsLib = window['pdfjs-dist/build/pdf']
          pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js'
          const pdf = await pdfjsLib.getDocument({ data: e.target.result }).promise
          let text = ''
          for (let i = 1; i <= Math.min(pdf.numPages, 12); i++) {
            const page = await pdf.getPage(i)
            const content = await page.getTextContent()
            text += content.items.map(it => it.str).join(' ') + '\n'
          }
          resolve(text.trim())
        } catch (err) {
          reject(err)
        }
      }
      reader.readAsArrayBuffer(file)
    }
    if (window['pdfjs-dist/build/pdf']) {
      load()
    } else {
      const s = document.createElement('script')
      s.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js'
      s.setAttribute('data-pdfjsloaded', '1')
      s.onload = load
      s.onerror = () => reject(new Error('Failed to load PDF library'))
      document.head.appendChild(s)
    }
  })
}

// ── Score display ─────────────────────────────────────────────────────────────
function BindIQScore({ bs }) {
  if (!bs) return null
  const map = {
    likely_bind:      { bg: C.greenBg, border: `1.5px solid ${C.greenBorder}`, barColor: C.green, scoreColor: '#065F46', emoji: '🟢', label: 'Likely to Bind' },
    conditional_risk: { bg: C.amberBg, border: `1.5px solid ${C.amberBorder}`, barColor: C.amber, scoreColor: '#92400E', emoji: '🟡', label: 'Conditional Risk' },
    likely_decline:   { bg: C.redBg,   border: `1.5px solid ${C.redBorder}`,   barColor: C.red,   scoreColor: '#991B1B', emoji: '🔴', label: 'Likely Decline' },
  }
  const m = map[bs.label] || map.conditional_risk
  return (
    <div style={{ borderRadius: 14, padding: '24px 24px 20px', background: m.bg, border: m.border }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: m.scoreColor, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>BindIQ Score</div>
          <div style={{ fontSize: 48, fontWeight: 800, color: m.scoreColor, lineHeight: 1 }}>{bs.score}</div>
          <div style={{ fontSize: 12, color: m.scoreColor, marginTop: 2 }}>out of 100</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 22 }}>{m.emoji}</div>
          <div style={{ fontSize: 14, fontWeight: 700, color: m.scoreColor, marginTop: 4 }}>{m.label}</div>
        </div>
      </div>
      {/* Bar */}
      <div style={{ height: 6, borderRadius: 100, background: 'rgba(0,0,0,0.08)', overflow: 'hidden', marginBottom: 20 }}>
        <div style={{ height: '100%', width: `${bs.score}%`, borderRadius: 100, background: m.barColor, transition: 'width 0.8s cubic-bezier(0.16,1,0.3,1)' }} />
      </div>
      {bs.reasons?.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          <p style={{ margin: '0 0 8px', fontSize: 11, fontWeight: 700, color: m.scoreColor, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Why this score</p>
          {bs.reasons.map((r, i) => (
            <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 6, alignItems: 'flex-start' }}>
              <span style={{ color: m.barColor, marginTop: 2, flexShrink: 0, fontSize: 10 }}>●</span>
              <span style={{ fontSize: 13, color: C.fg, lineHeight: 1.45 }}>{r}</span>
            </div>
          ))}
        </div>
      )}
      <div style={{ padding: '12px 14px', borderRadius: 10, background: 'rgba(255,255,255,0.6)', border: `1px solid rgba(0,0,0,0.06)` }}>
        <p style={{ margin: 0, fontSize: 13, color: C.fg, lineHeight: 1.5 }}>
          <strong>Carrier impact:</strong> {bs.carrier_impact}
        </p>
      </div>
    </div>
  )
}

// ── Form field components ─────────────────────────────────────────────────────
function Field({ label, required, hint, children }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: C.fg, marginBottom: required ? 5 : 4 }}>
        {label}
        {required && <span style={{ color: C.red, marginLeft: 3 }}>*</span>}
        {hint && <span style={{ fontWeight: 400, color: C.muted, marginLeft: 6, fontSize: 12 }}>{hint}</span>}
      </label>
      {children}
    </div>
  )
}

const inputStyle = {
  width: '100%', boxSizing: 'border-box',
  padding: '10px 12px', borderRadius: 8,
  border: `1.5px solid ${C.border}`, fontSize: 14,
  color: C.fg, background: C.bg, outline: 'none',
  fontFamily: "'DM Sans', sans-serif",
}

const selectStyle = { ...inputStyle, appearance: 'none', backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%2364748B' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', paddingRight: 32 }

// ── Main page ─────────────────────────────────────────────────────────────────
export default function IntakePage() {
  const { slug } = useParams()
  const [linkData, setLinkData] = useState(null)
  const [linkLoading, setLinkLoading] = useState(true)
  const [linkError, setLinkError] = useState(null)

  // Form state
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({
    address: '', year_built: '', roof_age_years: '', square_footage: '',
    electrical_panel: '', plumbing_type: '', hvac_age_years: '', roof_condition: '',
  })
  const [pdfFile, setPdfFile] = useState(null)
  const [pdfText, setPdfText] = useState('')
  const [pdfExtracting, setPdfExtracting] = useState(false)
  const [pdfError, setPdfError] = useState(null)
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef(null)

  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState(null)
  const [submitError, setSubmitError] = useState(null)

  // Load link metadata
  useEffect(() => {
    async function fetchLink() {
      try {
        const { data, error } = await supabase
          .from('intake_links')
          .select('id, agent_name, agency_name, agent_email')
          .eq('slug', slug)
          .maybeSingle()
        if (error) throw new Error(error.message)
        if (!data) { setLinkError('This intake link is not valid or has expired.'); setLinkLoading(false); return }
        setLinkData(data)
      } catch (e) {
        setLinkError(e.message)
      } finally {
        setLinkLoading(false)
      }
    }
    fetchLink()
  }, [slug])

  function setField(key, val) {
    setForm(f => ({ ...f, [key]: val }))
  }

  // Step validation
  const step1Valid = form.address.trim().length > 3 && form.year_built && form.roof_age_years
  const step2Valid = form.electrical_panel && form.plumbing_type && form.roof_condition

  async function handlePdfDrop(file) {
    if (!file || file.type !== 'application/pdf') { setPdfError('Please upload a PDF file.'); return }
    if (file.size > 20 * 1024 * 1024) { setPdfError('File too large (max 20 MB).'); return }
    setPdfFile(file)
    setPdfError(null)
    setPdfExtracting(true)
    try {
      const text = await extractPdfText(file)
      if (text.length < 100) throw new Error('Could not extract text from this PDF. Scanned images are not supported — please use a text-based PDF.')
      setPdfText(text)
    } catch (e) {
      setPdfError(e.message)
      setPdfFile(null)
      setPdfText('')
    } finally {
      setPdfExtracting(false)
    }
  }

  async function handleSubmit() {
    setSubmitting(true)
    setSubmitError(null)
    try {
      const body = {
        slug,
        ...form,
        year_built: form.year_built ? parseInt(form.year_built) : null,
        roof_age_years: form.roof_age_years ? parseInt(form.roof_age_years) : null,
        square_footage: form.square_footage ? parseInt(form.square_footage) : null,
        hvac_age_years: form.hvac_age_years ? parseInt(form.hvac_age_years) : null,
      }
      if (pdfText) body.pdf_text = pdfText
      const { data, error: fnErr } = await supabase.functions.invoke('submit-intake', { body })
      if (fnErr) throw new Error(fnErr.message)
      if (data?.error) throw new Error(data.error)
      setResult(data)
    } catch (e) {
      setSubmitError(e.message)
    } finally {
      setSubmitting(false)
    }
  }

  // ── Loading / error states ────────────────────────────────────────────────
  if (linkLoading) {
    return (
      <PageShell>
        <div style={{ textAlign: 'center', padding: '80px 24px', color: C.muted, fontSize: 14 }}>
          Loading…
        </div>
      </PageShell>
    )
  }

  if (linkError) {
    return (
      <PageShell>
        <div style={{ maxWidth: 480, margin: '0 auto', padding: '80px 24px', textAlign: 'center' }}>
          <div style={{ fontSize: 40, marginBottom: 16 }}>🔗</div>
          <h2 style={{ margin: '0 0 8px', fontSize: 20, color: C.fg }}>Link not found</h2>
          <p style={{ color: C.muted, fontSize: 14 }}>{linkError}</p>
        </div>
      </PageShell>
    )
  }

  // ── Success state ─────────────────────────────────────────────────────────
  if (result) {
    return (
      <PageShell linkData={linkData}>
        <div style={{ maxWidth: 560, margin: '0 auto', padding: '48px 24px' }}>
          <div style={{ marginBottom: 28 }}>
            <h1 style={{ margin: '0 0 6px', fontSize: 22, fontWeight: 700, color: C.fg }}>
              Your BindIQ report is ready
            </h1>
            <p style={{ margin: 0, fontSize: 14, color: C.muted }}>
              {result.bind_score?.label === 'likely_bind'
                ? 'Good news — this property looks bindable. Your agent will review the details.'
                : result.bind_score?.label === 'conditional_risk'
                ? 'There are a few items your agent will want to discuss before quoting.'
                : 'This report flagged some critical items. Your agent will reach out to explain next steps.'}
            </p>
          </div>

          <BindIQScore bs={result.bind_score} />

          {result.bind_score?.label !== 'likely_bind' && (
            <div style={{ marginTop: 16, padding: '14px 16px', borderRadius: 10, background: C.bgSoft, border: `1px solid ${C.border}` }}>
              <p style={{ margin: 0, fontSize: 13, color: C.muted, lineHeight: 1.55 }}>
                {linkData?.agent_name ? `${linkData.agent_name} will review this report` : 'Your agent will review this report'} and reach out to discuss options.
                {linkData?.agent_email && <> You can also contact them at <a href={`mailto:${linkData.agent_email}`} style={{ color: C.accent }}>{linkData.agent_email}</a>.</>}
              </p>
            </div>
          )}

          <div style={{ marginTop: 24, padding: '12px 16px', borderRadius: 10, background: C.bgSoft, border: `1px solid ${C.border}` }}>
            <p style={{ margin: 0, fontSize: 12, color: C.mutedLight, lineHeight: 1.5 }}>
              Powered by <strong style={{ color: C.muted }}>BindIQ</strong> · This is an automated estimate, not a binding commitment from any insurer.
              {result.bind_score && <> Score source: <strong>{result.extracted_data ? 'PDF analysis' : 'Form estimate'}</strong>.</>}
            </p>
          </div>
        </div>
      </PageShell>
    )
  }

  // ── Step form ─────────────────────────────────────────────────────────────
  return (
    <PageShell linkData={linkData}>
      <div style={{ maxWidth: 540, margin: '0 auto', padding: '40px 24px 80px' }}>
        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ margin: '0 0 6px', fontSize: 22, fontWeight: 700, color: C.fg }}>
            Property intake form
          </h1>
          <p style={{ margin: 0, fontSize: 14, color: C.muted, lineHeight: 1.55 }}>
            {linkData?.agent_name
              ? `${linkData.agent_name}${linkData.agency_name ? ` at ${linkData.agency_name}` : ''} needs a few property details to give you an accurate quote.`
              : 'Your agent needs a few property details to give you an accurate quote.'}
          </p>
        </div>

        {/* Step progress */}
        <StepBar step={step} />

        {/* Step 1 — Property basics */}
        {step === 1 && (
          <div>
            <StepHeading n={1} title="Property basics" />
            <Field label="Property address" required>
              <input style={inputStyle} placeholder="123 Bayfront Dr, Miami, FL 33101" value={form.address} onChange={e => setField('address', e.target.value)} />
            </Field>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <Field label="Year built" required>
                <input style={inputStyle} type="number" placeholder="e.g. 1998" min="1800" max="2024" value={form.year_built} onChange={e => setField('year_built', e.target.value)} />
              </Field>
              <Field label="Roof age" required hint="years">
                <input style={inputStyle} type="number" placeholder="e.g. 8" min="0" max="100" value={form.roof_age_years} onChange={e => setField('roof_age_years', e.target.value)} />
              </Field>
            </div>
            <Field label="Square footage" hint="optional">
              <input style={inputStyle} type="number" placeholder="e.g. 1850" min="100" value={form.square_footage} onChange={e => setField('square_footage', e.target.value)} />
            </Field>
            <NextButton disabled={!step1Valid} onClick={() => setStep(2)} />
          </div>
        )}

        {/* Step 2 — Systems overview */}
        {step === 2 && (
          <div>
            <StepHeading n={2} title="Systems overview" />
            <Field label="Electrical panel type" required>
              <select style={selectStyle} value={form.electrical_panel} onChange={e => setField('electrical_panel', e.target.value)}>
                <option value="">Select panel type…</option>
                <option value="modern_cb">Modern circuit breaker (unknown brand)</option>
                <option value="square_d">Square D / Schneider</option>
                <option value="siemens">Siemens</option>
                <option value="ge">GE / General Electric</option>
                <option value="eaton">Eaton / Cutler-Hammer</option>
                <option value="leviton">Leviton</option>
                <option value="fuse_box">Fuse box (older)</option>
                <option value="federal_pacific">Federal Pacific / Stab-Lok ⚠️</option>
                <option value="zinsco">Zinsco / Sylvania ⚠️</option>
                <option value="unknown">Unknown / not sure</option>
              </select>
            </Field>
            <Field label="Plumbing supply material" required>
              <select style={selectStyle} value={form.plumbing_type} onChange={e => setField('plumbing_type', e.target.value)}>
                <option value="">Select material…</option>
                <option value="copper">Copper</option>
                <option value="pex">PEX</option>
                <option value="cpvc">CPVC</option>
                <option value="galvanized">Galvanized steel</option>
                <option value="polybutylene">Polybutylene (grey plastic) ⚠️</option>
                <option value="mixed">Mixed / combination</option>
                <option value="unknown">Unknown / not sure</option>
              </select>
            </Field>
            <Field label="Roof condition" required>
              <select style={selectStyle} value={form.roof_condition} onChange={e => setField('roof_condition', e.target.value)}>
                <option value="">Select condition…</option>
                <option value="good">Good — no visible damage or wear</option>
                <option value="fair">Fair — minor wear, no active leaks</option>
                <option value="poor">Poor — visible damage or needs replacement ⚠️</option>
              </select>
            </Field>
            <Field label="HVAC age" hint="years (optional)">
              <input style={inputStyle} type="number" placeholder="e.g. 7" min="0" max="50" value={form.hvac_age_years} onChange={e => setField('hvac_age_years', e.target.value)} />
            </Field>
            <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
              <BackButton onClick={() => setStep(1)} />
              <NextButton disabled={!step2Valid} onClick={() => setStep(3)} flex={2} label="Continue →" />
            </div>
          </div>
        )}

        {/* Step 3 — Upload inspection (optional) */}
        {step === 3 && (
          <div>
            <StepHeading n={3} title="Upload inspection report" badge="Optional" />
            <p style={{ margin: '0 0 20px', fontSize: 13, color: C.muted, lineHeight: 1.6 }}>
              If you have a Florida 4-point or wind mitigation inspection report, upload it here for a more accurate BindIQ Score. Otherwise, we'll estimate from your answers.
            </p>

            {!pdfFile ? (
              <div
                onDragOver={e => { e.preventDefault(); setDragOver(true) }}
                onDragLeave={() => setDragOver(false)}
                onDrop={e => { e.preventDefault(); setDragOver(false); handlePdfDrop(e.dataTransfer.files[0]) }}
                onClick={() => fileInputRef.current?.click()}
                style={{
                  border: `2px dashed ${dragOver ? C.accent : C.border}`,
                  borderRadius: 12, padding: '36px 20px', textAlign: 'center',
                  background: dragOver ? 'rgba(37,99,235,0.04)' : C.bgSoft,
                  cursor: 'pointer', transition: 'all 0.15s', marginBottom: 16,
                }}
              >
                <div style={{ fontSize: 28, marginBottom: 10 }}>📄</div>
                <p style={{ margin: '0 0 4px', fontSize: 14, fontWeight: 600, color: C.fg }}>
                  Drop your inspection PDF here
                </p>
                <p style={{ margin: 0, fontSize: 13, color: C.muted }}>
                  or click to browse · max 20 MB
                </p>
                <input ref={fileInputRef} type="file" accept=".pdf,application/pdf" style={{ display: 'none' }}
                  onChange={e => handlePdfDrop(e.target.files[0])} />
              </div>
            ) : pdfExtracting ? (
              <div style={{ padding: '28px', borderRadius: 12, background: C.bgSoft, border: `1.5px solid ${C.border}`, textAlign: 'center', marginBottom: 16 }}>
                <div style={{ fontSize: 20, marginBottom: 10 }}>⏳</div>
                <p style={{ margin: 0, fontSize: 14, color: C.muted }}>Reading PDF…</p>
              </div>
            ) : pdfText ? (
              <div style={{ padding: '16px', borderRadius: 12, background: C.greenBg, border: `1.5px solid ${C.greenBorder}`, marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                <div>
                  <p style={{ margin: '0 0 2px', fontSize: 13, fontWeight: 600, color: '#065F46' }}>✓ PDF loaded</p>
                  <p style={{ margin: 0, fontSize: 12, color: C.muted }}>{pdfFile.name} · {(pdfFile.size / 1024).toFixed(0)} KB</p>
                </div>
                <button onClick={() => { setPdfFile(null); setPdfText(''); setPdfError(null) }}
                  style={{ padding: '4px 10px', borderRadius: 6, border: `1px solid ${C.greenBorder}`, background: 'transparent', fontSize: 12, color: C.muted, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>
                  Remove
                </button>
              </div>
            ) : null}

            {pdfError && (
              <div style={{ padding: '10px 14px', borderRadius: 8, background: C.redBg, border: `1.5px solid ${C.redBorder}`, fontSize: 13, color: '#991B1B', marginBottom: 16 }}>
                {pdfError}
              </div>
            )}

            {/* Skip note */}
            {!pdfFile && (
              <p style={{ margin: '0 0 20px', fontSize: 12, color: C.mutedLight, textAlign: 'center' }}>
                No inspection report? That's fine — we'll estimate from your form answers.
              </p>
            )}

            {submitError && (
              <div style={{ padding: '10px 14px', borderRadius: 8, background: C.redBg, border: `1.5px solid ${C.redBorder}`, fontSize: 13, color: '#991B1B', marginBottom: 16 }}>
                {submitError}
              </div>
            )}

            <div style={{ display: 'flex', gap: 10 }}>
              <BackButton onClick={() => setStep(2)} />
              <button
                onClick={handleSubmit}
                disabled={submitting || pdfExtracting}
                style={{
                  flex: 2, padding: '13px', borderRadius: 10, border: 'none',
                  background: submitting || pdfExtracting ? '#94A3B8' : C.navy,
                  color: '#fff', fontSize: 15, fontWeight: 700,
                  cursor: submitting || pdfExtracting ? 'not-allowed' : 'pointer',
                  fontFamily: "'DM Sans', sans-serif", transition: 'background 0.15s',
                }}
              >
                {submitting
                  ? (pdfText ? 'Analysing report…' : 'Calculating score…')
                  : pdfText
                  ? 'Get BindIQ Score →'
                  : 'Submit without PDF →'}
              </button>
            </div>
          </div>
        )}
      </div>
    </PageShell>
  )
}

// ── Sub-components ────────────────────────────────────────────────────────────
function PageShell({ children, linkData }) {
  return (
    <div style={{ minHeight: '100vh', background: C.bg, fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ borderBottom: `1px solid ${C.border}`, padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 26, height: 26, borderRadius: 6, background: C.navy, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: '#fff', fontWeight: 700, fontSize: 12 }}>B</span>
          </div>
          <span style={{ fontWeight: 700, fontSize: 14, color: C.fg }}>BindIQ</span>
        </div>
        {linkData?.agency_name && (
          <span style={{ fontSize: 12, color: C.muted }}>{linkData.agency_name}</span>
        )}
      </div>
      {children}
    </div>
  )
}

function StepBar({ step }) {
  const steps = ['Property basics', 'Systems', 'Inspection']
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: 28 }}>
      {steps.map((label, i) => {
        const n = i + 1
        const active = n === step
        const done = n < step
        return (
          <div key={n} style={{ display: 'flex', alignItems: 'center', flex: n < steps.length ? 1 : 0 }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <div style={{
                width: 28, height: 28, borderRadius: 100,
                background: done ? C.green : active ? C.navy : C.border,
                color: done || active ? '#fff' : C.muted,
                fontSize: 12, fontWeight: 700,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                {done ? '✓' : n}
              </div>
              <span style={{ fontSize: 11, color: active ? C.fg : C.muted, fontWeight: active ? 600 : 400, whiteSpace: 'nowrap' }}>{label}</span>
            </div>
            {n < steps.length && (
              <div style={{ flex: 1, height: 2, background: done ? C.green : C.border, margin: '0 6px', marginTop: -14 }} />
            )}
          </div>
        )
      })}
    </div>
  )
}

function StepHeading({ n, title, badge }) {
  return (
    <div style={{ marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
      <h2 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: C.fg }}>{title}</h2>
      {badge && (
        <span style={{ padding: '2px 8px', borderRadius: 100, background: 'rgba(37,99,235,0.09)', color: C.accent, fontSize: 11, fontWeight: 700 }}>{badge}</span>
      )}
    </div>
  )
}

function NextButton({ disabled, onClick, flex = 1, label = 'Continue →' }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        flex, padding: '12px', borderRadius: 10, border: 'none',
        background: disabled ? '#94A3B8' : C.navy,
        color: '#fff', fontSize: 14, fontWeight: 700,
        cursor: disabled ? 'not-allowed' : 'pointer',
        fontFamily: "'DM Sans', sans-serif", transition: 'background 0.15s',
        width: '100%', marginTop: 8,
      }}
    >
      {label}
    </button>
  )
}

function BackButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        flex: 1, padding: '12px', borderRadius: 10, border: `1.5px solid ${C.border}`,
        background: C.bg, color: C.fg, fontSize: 14, fontWeight: 600,
        cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
      }}
    >
      ← Back
    </button>
  )
}
