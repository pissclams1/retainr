import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const serif = { fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }
const sans = { fontFamily: "'Inter', system-ui, sans-serif" }

/* ─────────── Report content (matches sample on landing) ─────────── */

const REPORT = {
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

/* ─────────── Shared styles ─────────── */

const screen = {
  minHeight: '100vh',
  background: '#0F0F0E',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '40px 24px 80px',
  ...sans,
}

const logo = {
  ...serif,
  fontSize: 22,
  color: '#F5F5F3',
  letterSpacing: '-0.3px',
  textDecoration: 'none',
  marginBottom: 32,
  display: 'block',
}

const stepDots = {
  display: 'flex',
  gap: 8,
  marginBottom: 24,
}

const dot = (active) => ({
  width: 24, height: 4, borderRadius: 2,
  background: active ? '#F5F5F3' : 'rgba(245,245,243,0.18)',
  transition: 'background 0.2s',
})

const card = {
  width: '100%',
  maxWidth: 440,
  background: '#1A1A18',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: 14,
  padding: 32,
}

const eyebrow = {
  ...sans,
  fontSize: 11,
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '0.12em',
  color: 'rgba(245,245,243,0.50)',
  marginBottom: 12,
}

const title = {
  ...serif,
  fontSize: 26,
  fontWeight: 400,
  color: '#F5F5F3',
  marginBottom: 8,
  lineHeight: 1.2,
}

const sub = {
  ...sans,
  fontSize: 14,
  fontWeight: 300,
  color: 'rgba(245,245,243,0.55)',
  lineHeight: 1.6,
  marginBottom: 24,
}

const primaryBtn = (disabled) => ({
  width: '100%',
  height: 42,
  background: disabled ? 'rgba(245,245,243,0.25)' : '#F5F5F3',
  color: disabled ? 'rgba(15,15,14,0.4)' : '#0F0F0E',
  border: 'none',
  borderRadius: 8,
  ...sans,
  fontSize: 13,
  fontWeight: 500,
  cursor: disabled ? 'not-allowed' : 'pointer',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 8,
})

const ghostBtn = {
  ...sans,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 6,
  padding: '10px 16px',
  fontSize: 13,
  fontWeight: 500,
  color: 'rgba(245,245,243,0.65)',
  background: 'transparent',
  border: '1px solid rgba(255,255,255,0.14)',
  borderRadius: 8,
  textDecoration: 'none',
  cursor: 'pointer',
}

/* ─────────── Step components ─────────── */

function StepDots({ step }) {
  return (
    <div style={stepDots}>
      <div style={dot(step >= 1)} />
      <div style={dot(step >= 2)} />
      <div style={dot(step >= 3)} />
    </div>
  )
}

function ConnectStep({ onNext }) {
  return (
    <div style={card}>
      <div style={eyebrow}>Step 1 of 3</div>
      <h1 style={title}>Connect your Google Ads account</h1>
      <p style={sub}>
        We use your campaign data to generate client-ready communication.
      </p>
      <button onClick={onNext} style={primaryBtn(false)}>
        <GoogleMark />
        Connect Google Ads
      </button>
      <p style={{ ...sans, fontSize: 11, color: 'rgba(245,245,243,0.35)', marginTop: 14, lineHeight: 1.5 }}>
        Read-only access. We never modify campaigns or budgets.
      </p>
    </div>
  )
}

function SelectStep({ accounts, selected, setSelected, onNext, onBack }) {
  return (
    <div style={card}>
      <div style={eyebrow}>Step 2 of 3</div>
      <h1 style={title}>Select a client account</h1>
      <p style={sub}>
        We'll generate a finished report for the account you choose.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
        {accounts.map((a) => {
          const active = selected === a.id
          return (
            <button
              key={a.id}
              onClick={() => setSelected(a.id)}
              style={{
                ...sans, textAlign: 'left',
                padding: '12px 14px',
                background: active ? 'rgba(245,245,243,0.06)' : 'transparent',
                border: `1px solid ${active ? 'rgba(245,245,243,0.30)' : 'rgba(255,255,255,0.10)'}`,
                borderRadius: 8, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
              }}
            >
              <div>
                <div style={{ fontSize: 13, fontWeight: 500, color: '#F5F5F3' }}>{a.name}</div>
                <div style={{ fontSize: 11, color: 'rgba(245,245,243,0.45)', marginTop: 2 }}>{a.spend}</div>
              </div>
              <span style={{
                width: 14, height: 14, borderRadius: '50%',
                border: `1px solid ${active ? '#F5F5F3' : 'rgba(245,245,243,0.30)'}`,
                background: active ? '#F5F5F3' : 'transparent',
                flexShrink: 0,
              }} />
            </button>
          )
        })}
      </div>

      <button onClick={onNext} style={primaryBtn(false)}>Generate report →</button>
      <button
        onClick={onBack}
        style={{
          ...sans, fontSize: 12, color: 'rgba(245,245,243,0.45)',
          background: 'transparent', border: 'none', cursor: 'pointer',
          marginTop: 12, width: '100%',
        }}
      >
        ← Back
      </button>
    </div>
  )
}

function GeneratingStep({ accountName }) {
  return (
    <div style={{ ...card, textAlign: 'center', padding: '48px 32px' }}>
      <div style={eyebrow}>Step 3 of 3</div>
      <div style={{
        width: 48, height: 48, borderRadius: '50%',
        border: '2px solid rgba(245,245,243,0.10)',
        borderTopColor: '#F5F5F3',
        margin: '0 auto 18px',
        animation: 'spin 0.9s linear infinite',
      }} />
      <h1 style={{ ...title, fontSize: 22, marginBottom: 6 }}>
        Generating your client-ready report…
      </h1>
      <p style={{ ...sub, marginBottom: 0 }}>
        Generating for <strong style={{ color: 'rgba(245,245,243,0.75)', fontWeight: 500 }}>{accountName}</strong>.
        Writing the monthly narrative, drivers, client explanations, and call talking points.
      </p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

/* ─────────── Final report (light card on dark canvas) ─────────── */

function ReportReady({ accountName = 'Apex Digital', onRegenerate }) {
  const [tone, setTone] = useState('Simple')
  const [copied, setCopied] = useState(false)
  const [reportCopied, setReportCopied] = useState(false)
  const [sendOpen, setSendOpen] = useState(false)
  const [clientEmail, setClientEmail] = useState('')
  const [sent, setSent] = useState(false)

  const shareUrl = `${window.location.origin}/r/demo-apex-april-2025`

  const handleShare = async () => {
    try { await navigator.clipboard.writeText(shareUrl) } catch {}
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }

  const handleCopyReport = async () => {
    const text = [
      'APEX DIGITAL — APRIL 2025',
      'Generated by retainr',
      '',
      'MONTHLY PERFORMANCE NARRATIVE',
      `"${REPORT.narrative}"`,
      '',
      ...REPORT.headlineMetrics.map((b) => `• ${b}`),
      '',
      'KEY TAKEAWAY',
      REPORT.keyTakeaway,
      '',
      'WHAT DROVE PERFORMANCE CHANGES',
      ...REPORT.drivers.map((d) => `→ ${d}`),
      '',
      'HOW TO EXPLAIN THIS TO THE CLIENT',
      ...REPORT.explainQuotes.map((q) => `"${q}"`),
      '',
      'TALKING POINTS FOR CLIENT CALLS',
      ...REPORT.talkingPoints.map((t) => `› "${t}"`),
      '',
      `View online: ${shareUrl}`,
    ].join('\n')
    try { await navigator.clipboard.writeText(text) } catch {}
    setReportCopied(true)
    setTimeout(() => setReportCopied(false), 1800)
  }

  const handleSend = (e) => {
    e.preventDefault()
    setSent(true)
    setTimeout(() => { setSendOpen(false); setSent(false); setClientEmail('') }, 1600)
  }

  return (
    <div style={{ width: '100%', maxWidth: 720 }}>
      <div style={{ ...eyebrow, color: 'rgba(245,245,243,0.50)' }}>Step 3 of 3 · Ready</div>
      <h1 style={{ ...title, fontSize: 32, marginBottom: 6 }}>
        Your first client-ready report is ready
      </h1>
      <p style={{ ...sub, marginBottom: 24 }}>
        {accountName} · April 2025 · Generated in 47 seconds
      </p>

      {/* Action bar */}
      <div style={{
        display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center',
        marginBottom: 16,
      }}>
        <button style={primaryBtn(false)} onClick={() => alert('PDF download stub')}>
          ↓ Download PDF
        </button>
        <button style={ghostBtn} onClick={handleCopyReport}>
          {reportCopied ? '✓ Report copied' : '⧉ Copy report'}
        </button>
        <button style={ghostBtn} onClick={handleShare}>
          {copied ? '✓ Link copied' : '↗ Share link'}
        </button>
        <button style={ghostBtn} onClick={() => setSendOpen((v) => !v)}>
          ✉ Copy to client email
        </button>
        <button style={ghostBtn} onClick={onRegenerate}>
          Generate next report
        </button>
        <ToneSelect tone={tone} setTone={setTone} />
      </div>

      {/* Send to client inline form */}
      {sendOpen && (
        <form
          onSubmit={handleSend}
          style={{
            display: 'flex', gap: 8, alignItems: 'center', marginBottom: 16,
            padding: 10, background: 'rgba(245,245,243,0.04)',
            border: '1px solid rgba(255,255,255,0.10)', borderRadius: 8,
          }}
        >
          <input
            type="email"
            required
            placeholder="client@company.com"
            value={clientEmail}
            onChange={(e) => setClientEmail(e.target.value)}
            style={{
              flex: 1, height: 36, padding: '0 12px',
              ...sans, fontSize: 13, color: '#F5F5F3',
              background: '#0F0F0E',
              border: '1px solid rgba(255,255,255,0.12)', borderRadius: 7,
              outline: 'none',
            }}
          />
          <button type="submit" style={{ ...primaryBtn(false), width: 'auto', padding: '0 16px', height: 36 }}>
            {sent ? '✓ Sent' : 'Send report →'}
          </button>
        </form>
      )}

      <ReportCard tone={tone} accountName={accountName} />

      {/* Share/PDF/Send footer (mirrors actions for end of card) */}
      <div style={{
        marginTop: 12, padding: '12px 14px',
        background: 'rgba(245,245,243,0.03)',
        border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10,
        display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ ...sans, fontSize: 12, color: 'rgba(245,245,243,0.55)' }}>
          Read-only share link — clients view in browser, no login required.
        </div>
        <div style={{ ...sans, fontSize: 11, color: 'rgba(245,245,243,0.40)', fontFamily: 'ui-monospace, Menlo, monospace' }}>
          {shareUrl.replace(/^https?:\/\//, '')}
        </div>
      </div>

      {/* Team expansion */}
      <TeamInvite />
    </div>
  )
}

function TeamInvite() {
  const [emails, setEmails] = useState([''])
  const [done, setDone] = useState(false)

  const updateEmail = (i, v) => setEmails((arr) => arr.map((e, idx) => idx === i ? v : e))
  const addRow = () => setEmails((arr) => [...arr, ''])
  const sendInvites = (e) => {
    e.preventDefault()
    setDone(true)
  }

  return (
    <div style={{
      marginTop: 28,
      padding: 24,
      background: '#1A1A18',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: 14,
    }}>
      <div style={eyebrow}>Team expansion</div>
      <h2 style={{ ...title, fontSize: 22, marginBottom: 6 }}>
        Bring your team into retainr
      </h2>
      <p style={{ ...sub, marginBottom: 20 }}>
        Standardize how your entire agency communicates with clients. Reports become
        shared communication assets across your team.
      </p>

      {done ? (
        <div style={{
          padding: '12px 14px',
          background: 'rgba(45,106,39,0.15)',
          border: '1px solid rgba(45,106,39,0.3)',
          borderRadius: 8,
          ...sans, fontSize: 13, color: '#A7E2A1',
        }}>
          ✓ Invites sent to {emails.filter(Boolean).length} teammate{emails.filter(Boolean).length === 1 ? '' : 's'}.
          They can view this report and the next one as soon as they accept.
        </div>
      ) : (
        <form onSubmit={sendInvites} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {emails.map((email, i) => (
            <input
              key={i}
              type="email"
              placeholder="account-manager@youragency.com"
              value={email}
              onChange={(e) => updateEmail(i, e.target.value)}
              style={{
                height: 40, padding: '0 12px',
                ...sans, fontSize: 13, color: '#F5F5F3',
                background: '#0F0F0E',
                border: '1px solid rgba(255,255,255,0.12)', borderRadius: 7,
                outline: 'none',
              }}
            />
          ))}
          <button
            type="button"
            onClick={addRow}
            style={{
              ...sans, fontSize: 12, fontWeight: 500,
              color: 'rgba(245,245,243,0.55)',
              background: 'transparent', border: 'none', cursor: 'pointer',
              padding: '4px 0', textAlign: 'left',
            }}
          >
            + Add another teammate
          </button>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 4 }}>
            <button type="submit" style={primaryBtn(false)}>
              Send invites
            </button>
            <Link
              to="/dashboard"
              style={{ ...ghostBtn, justifyContent: 'center' }}
            >
              Skip for now →
            </Link>
          </div>

          <div style={{ ...sans, fontSize: 11, color: 'rgba(245,245,243,0.35)', marginTop: 6, lineHeight: 1.5 }}>
            Invited teammates can view your reports, generate new ones for their accounts,
            and use the same talking-point standards you do.
          </div>
        </form>
      )}
    </div>
  )
}

function ToneSelect({ tone, setTone }) {
  const options = ['Formal', 'Simple', 'Detailed']
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 8,
      padding: '4px 6px',
      background: 'rgba(245,245,243,0.04)',
      border: '1px solid rgba(255,255,255,0.10)',
      borderRadius: 8,
    }}>
      <span style={{ ...sans, fontSize: 11, color: 'rgba(245,245,243,0.45)', padding: '0 4px' }}>
        Tone
      </span>
      {options.map((o) => (
        <button
          key={o}
          onClick={() => setTone(o)}
          style={{
            ...sans, fontSize: 12, fontWeight: 500,
            padding: '5px 10px', borderRadius: 6,
            background: tone === o ? '#F5F5F3' : 'transparent',
            color: tone === o ? '#0F0F0E' : 'rgba(245,245,243,0.65)',
            border: 'none', cursor: 'pointer',
          }}
        >
          {o}
        </button>
      ))}
    </div>
  )
}

function ReportCard({ tone, accountName = 'Apex Digital' }) {
  return (
    <div style={{
      background: '#FAFAF9',
      border: '1px solid rgba(255,255,255,0.10)',
      borderRadius: 14,
      overflow: 'hidden',
    }}>
      <div style={{ height: 4, background: '#2563EB' }} />
      <div style={{
        padding: '14px 20px', borderBottom: '1px solid #F1F5F9',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <span style={{ ...sans, fontSize: 12, fontWeight: 500, color: '#1E293B', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#2563EB' }} />
          {accountName} · April 2025
        </span>
        <span style={{ ...sans, fontSize: 11, color: '#94A3B8' }}>Tone: {tone}</span>
      </div>

      <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 18 }}>

        {/* Narrative */}
        <Section label="Monthly Performance Narrative">
          <div style={{
            ...serif, fontSize: 17, fontStyle: 'italic',
            lineHeight: 1.6, color: '#1E293B',
            borderLeft: '3px solid #2563EB', paddingLeft: 14,
          }}>
            "{REPORT.narrative}"
          </div>
          <ul style={{ listStyle: 'none', padding: 0, margin: '12px 0 0 0', display: 'flex', flexDirection: 'column', gap: 6 }}>
            {REPORT.headlineMetrics.map((b) => (
              <li key={b} style={{ ...sans, fontSize: 13, color: '#334155', display: 'flex', gap: 8, lineHeight: 1.55 }}>
                <span style={{ color: '#2563EB' }}>•</span>{b}
              </li>
            ))}
          </ul>
        </Section>

        {/* Key takeaway */}
        <div style={{ borderLeft: '3px solid #15803D', background: '#F0FDF4', padding: '12px 14px', borderRadius: 4 }}>
          <Eyebrow color="#15803D">Key takeaway</Eyebrow>
          <div style={{ ...sans, fontSize: 13, lineHeight: 1.55, color: '#14532D', marginTop: 4 }}>
            {REPORT.keyTakeaway}
          </div>
        </div>

        {/* Drivers */}
        <Section label="What drove performance changes">
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
            {REPORT.drivers.map((b) => (
              <li key={b} style={{ ...sans, fontSize: 13, color: '#334155', display: 'flex', gap: 8, lineHeight: 1.55 }}>
                <span style={{ color: '#94A3B8' }}>→</span>{b}
              </li>
            ))}
          </ul>
        </Section>

        {/* Explanations */}
        <div style={{ borderLeft: '3px solid #2563EB', background: '#EFF6FF', padding: '12px 14px', borderRadius: 4 }}>
          <Eyebrow color="#1D4ED8">How to explain this to the client</Eyebrow>
          {REPORT.explainQuotes.map((q) => (
            <div key={q} style={{ ...serif, fontSize: 14, fontStyle: 'italic', lineHeight: 1.6, color: '#1E3A5F', marginTop: 6 }}>
              "{q}"
            </div>
          ))}
        </div>

        {/* Talking points */}
        <div style={{ borderLeft: '3px solid #D97706', background: '#FFFBEB', padding: '12px 14px', borderRadius: 4 }}>
          <Eyebrow color="#B45309">Talking points for client calls</Eyebrow>
          {REPORT.talkingPoints.map((t) => (
            <div key={t} style={{ ...sans, fontSize: 13, lineHeight: 1.55, color: '#78350F', marginTop: 6, display: 'flex', gap: 8 }}>
              <span style={{ color: '#D97706' }}>›</span>"{t}"
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}

function Section({ label, children }) {
  return (
    <div>
      <Eyebrow color="#94A3B8">{label}</Eyebrow>
      <div style={{ marginTop: 8 }}>{children}</div>
    </div>
  )
}

function Eyebrow({ color, children }) {
  return (
    <div style={{
      ...sans, fontSize: 10, fontWeight: 600,
      textTransform: 'uppercase', letterSpacing: '0.10em', color,
    }}>
      {children}
    </div>
  )
}

function GoogleMark() {
  return (
    <svg width="14" height="14" viewBox="0 0 48 48" aria-hidden>
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3a12 12 0 1 1-3.3-13l5.7-5.7A20 20 0 1 0 44 24a20 20 0 0 0-.4-3.5z"/>
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8A12 12 0 0 1 24 12a12 12 0 0 1 8 3.1l5.7-5.7A20 20 0 0 0 6.3 14.7z"/>
      <path fill="#4CAF50" d="M24 44a20 20 0 0 0 13.5-5.2l-6.2-5.3A12 12 0 0 1 12.7 28l-6.6 5.1A20 20 0 0 0 24 44z"/>
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3a12 12 0 0 1-4.1 5.5l6.2 5.3c-.4.4 6.6-4.8 6.6-14.8a20 20 0 0 0-.4-3.5z"/>
    </svg>
  )
}

/* ─────────── Page ─────────── */

const ACCOUNTS = [
  { id: 'apex',      name: 'Apex Digital — main account', spend: '$24,180/mo' },
  { id: 'monarch',   name: 'Monarch Plumbing & HVAC',     spend: '$8,420/mo' },
  { id: 'northstar', name: 'Northstar Realty Group',      spend: '$3,260/mo' },
]

export default function OnboardingPage() {
  const [step, setStep] = useState('connect')   // connect | select | generating | ready
  const [accountId, setAccountId] = useState(ACCOUNTS[0].id)
  const accountName = ACCOUNTS.find((a) => a.id === accountId)?.name.split(' — ')[0] || 'your account'

  // Auto-advance from generating → ready
  useEffect(() => {
    if (step !== 'generating') return
    const t = setTimeout(() => setStep('ready'), 2200)
    return () => clearTimeout(t)
  }, [step])

  const stepNum = step === 'connect' ? 1 : step === 'select' ? 2 : 3

  return (
    <div style={screen}>
      <Link to="/" style={logo}>retainr</Link>

      {step !== 'ready' && <StepDots step={stepNum} />}

      {step === 'connect' && (
        <ConnectStep onNext={() => setStep('select')} />
      )}
      {step === 'select' && (
        <SelectStep
          accounts={ACCOUNTS}
          selected={accountId}
          setSelected={setAccountId}
          onNext={() => setStep('generating')}
          onBack={() => setStep('connect')}
        />
      )}
      {step === 'generating' && <GeneratingStep accountName={accountName} />}
      {step === 'ready' && (
        <ReportReady
          accountName={accountName}
          onRegenerate={() => setStep('generating')}
        />
      )}
    </div>
  )
}
