import { useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import { Link } from 'react-router-dom'

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
)

// ── Shared usage gate ──────────────────────────────────────────────────────────
const FREE_LIMIT = 3
const STORAGE_KEY = 'bindiq_uses'
function getUses() { try { return parseInt(localStorage.getItem(STORAGE_KEY) || '0', 10) } catch { return 0 } }
function incrementUses() { try { localStorage.setItem(STORAGE_KEY, String(getUses() + 1)) } catch {} }

// ── Colors ─────────────────────────────────────────────────────────────────────
const C = {
  navy: '#04256C',
  fg: '#0F172A',
  muted: '#64748B',
  border: '#E2E8F0',
  bg: '#ffffff',
  bgSoft: '#F8FAFC',
  green: '#10B981',
  greenBg: 'rgba(16,185,129,0.08)',
  greenBorder: 'rgba(16,185,129,0.25)',
  positive: '#10B981',
  red: '#EF4444',
}

// ── Gate modal ─────────────────────────────────────────────────────────────────
function FreeGate({ onDismiss }) {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, background: 'rgba(4,37,108,0.55)', backdropFilter: 'blur(6px)' }}>
      <div style={{ background: '#fff', borderRadius: 20, padding: 40, maxWidth: 460, width: '100%', boxShadow: '0 24px 80px rgba(4,37,108,0.25)', textAlign: 'center', fontFamily: "'DM Sans', sans-serif" }}>
        <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'rgba(4,37,108,0.07)', border: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px', fontSize: 24 }}>
          🔗
        </div>
        <div style={{ fontSize: 11, fontWeight: 700, color: C.navy, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
          Free limit reached
        </div>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: C.fg, margin: '0 0 10px', letterSpacing: '-0.02em' }}>
          You've used your 3 free reports
        </h2>
        <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.65, margin: '0 0 28px' }}>
          Subscribe for unlimited intake links and scored risk profiles — plus automatic underwriting flag detection on every submission.
        </p>

        <div style={{ background: C.bgSoft, border: `1px solid ${C.border}`, borderRadius: 12, padding: '14px 20px', marginBottom: 24, textAlign: 'left' }}>
          {[
            'Unlimited intake links',
            'Automatic red flag detection',
            'BindIQ Score on every property',
            'Cancel any time',
          ].map(item => (
            <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="6" fill="rgba(16,185,129,0.12)"/><path d="M4.5 7l1.8 1.8L9.5 5" stroke={C.positive} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              <span style={{ fontSize: 13, color: C.fg }}>{item}</span>
            </div>
          ))}
          <div style={{ fontSize: 20, fontWeight: 800, color: C.fg, marginTop: 12, letterSpacing: '-0.02em' }}>
            $79<span style={{ fontSize: 13, fontWeight: 500, color: C.muted }}>/mo · or $59/mo billed annually</span>
          </div>
        </div>

        <Link
          to="/sign-up"
          style={{ display: 'block', width: '100%', padding: '14px', background: C.navy, color: '#fff', border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: 'pointer', textDecoration: 'none', boxShadow: '0 4px 16px rgba(4,37,108,0.30)', marginBottom: 10 }}
        >
          Start 14-day free trial →
        </Link>
        <button
          onClick={onDismiss}
          style={{ fontSize: 13, color: C.muted, background: 'none', border: 'none', cursor: 'pointer', padding: '6px 0' }}
        >
          Maybe later
        </button>
      </div>
    </div>
  )
}

// ── Page ───────────────────────────────────────────────────────────────────────
export default function GenerateLinkPage() {
  const [agentName, setAgentName]   = useState('')
  const [agencyName, setAgencyName] = useState('')
  const [agentEmail, setAgentEmail] = useState('')
  const [loading, setLoading]       = useState(false)
  const [result, setResult]         = useState(null)
  const [copied, setCopied]         = useState(false)
  const [error, setError]           = useState(null)
  const [showGate, setShowGate]     = useState(false)

  async function handleGenerate(e) {
    e.preventDefault()
    if (!agentName.trim()) return

    // Usage gate
    if (getUses() >= FREE_LIMIT) {
      setShowGate(true)
      return
    }

    setLoading(true)
    setError(null)
    try {
      const { data, error: fnErr } = await supabase.functions.invoke('create-intake-link', {
        body: {
          agent_name:  agentName.trim(),
          agency_name: agencyName.trim() || null,
          agent_email: agentEmail.trim() || null,
        },
      })
      if (fnErr) throw new Error(fnErr.message)
      if (data?.error) throw new Error(data.error)
      incrementUses()
      const url = `${window.location.origin}/intake/${data.slug}`
      setResult({ ...data, url })
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  function handleCopy() {
    navigator.clipboard.writeText(result.url).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  function handleReset() {
    // Gate check before letting them generate another
    if (getUses() >= FREE_LIMIT) {
      setShowGate(true)
      return
    }
    setResult(null)
    setAgentName('')
    setAgencyName('')
    setAgentEmail('')
  }

  const usesLeft = Math.max(0, FREE_LIMIT - getUses())

  return (
    <div style={{ minHeight: '100vh', background: C.bg, fontFamily: "'DM Sans', sans-serif" }}>
      {showGate && <FreeGate onDismiss={() => setShowGate(false)} />}

      {/* Nav */}
      <div style={{ borderBottom: `1px solid ${C.border}`, padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 28, height: 28, borderRadius: 7, background: C.navy, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: '#fff', fontWeight: 700, fontSize: 13 }}>B</span>
          </div>
          <span style={{ fontWeight: 700, fontSize: 15, color: C.fg }}>BindIQ</span>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {usesLeft > 0 && (
            <span style={{ fontSize: 12, color: C.muted }}>
              {usesLeft} free {usesLeft === 1 ? 'report' : 'reports'} left
            </span>
          )}
          <Link to="/inspect" style={{ fontSize: 13, color: C.muted, textDecoration: 'none' }}>
            ← Back to Inspector
          </Link>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 520, margin: '0 auto', padding: '64px 24px' }}>
        {!result ? (
          <>
            <div style={{ marginBottom: 32 }}>
              <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: C.fg, lineHeight: 1.2 }}>
                Generate an intake link
              </h1>
              <p style={{ margin: '10px 0 0', fontSize: 15, color: C.muted, lineHeight: 1.6 }}>
                Send one link to your client. They fill out a 3-step form — you get a scored, submission-ready risk profile.
              </p>
            </div>

            <form onSubmit={handleGenerate}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: C.fg, marginBottom: 6 }}>
                    Your name <span style={{ color: C.red }}>*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Sarah Johnson"
                    value={agentName}
                    onChange={e => setAgentName(e.target.value)}
                    required
                    style={{ width: '100%', boxSizing: 'border-box', padding: '10px 12px', borderRadius: 8, border: `1.5px solid ${C.border}`, fontSize: 14, color: C.fg, background: C.bg, outline: 'none', fontFamily: "'DM Sans', sans-serif" }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: C.fg, marginBottom: 6 }}>
                    Agency name <span style={{ color: C.muted, fontWeight: 400 }}>(optional)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Coastal Insurance Group"
                    value={agencyName}
                    onChange={e => setAgencyName(e.target.value)}
                    style={{ width: '100%', boxSizing: 'border-box', padding: '10px 12px', borderRadius: 8, border: `1.5px solid ${C.border}`, fontSize: 14, color: C.fg, background: C.bg, outline: 'none', fontFamily: "'DM Sans', sans-serif" }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: C.fg, marginBottom: 6 }}>
                    Your email <span style={{ color: C.muted, fontWeight: 400 }}>(optional — shown to client)</span>
                  </label>
                  <input
                    type="email"
                    placeholder="you@agency.com"
                    value={agentEmail}
                    onChange={e => setAgentEmail(e.target.value)}
                    style={{ width: '100%', boxSizing: 'border-box', padding: '10px 12px', borderRadius: 8, border: `1.5px solid ${C.border}`, fontSize: 14, color: C.fg, background: C.bg, outline: 'none', fontFamily: "'DM Sans', sans-serif" }}
                  />
                </div>

                {error && (
                  <div style={{ padding: '10px 14px', borderRadius: 8, background: 'rgba(239,68,68,0.07)', border: '1.5px solid rgba(239,68,68,0.25)', fontSize: 13, color: '#991B1B' }}>
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || !agentName.trim()}
                  style={{ padding: '12px 20px', borderRadius: 10, border: 'none', background: loading || !agentName.trim() ? '#94A3B8' : C.navy, color: '#fff', fontSize: 15, fontWeight: 600, cursor: loading || !agentName.trim() ? 'not-allowed' : 'pointer', fontFamily: "'DM Sans', sans-serif", transition: 'background 0.15s' }}
                >
                  {loading ? 'Generating…' : 'Generate intake link →'}
                </button>
              </div>
            </form>

            {/* How it works */}
            <div style={{ marginTop: 40, padding: '20px 24px', borderRadius: 12, background: C.bgSoft, border: `1px solid ${C.border}` }}>
              <p style={{ margin: '0 0 14px', fontSize: 13, fontWeight: 600, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.06em' }}>How it works</p>
              {[
                ['1', 'You generate a link and send it to your client'],
                ['2', 'Client fills out property basics + systems overview (2 min)'],
                ['3', 'Optionally uploads their 4-point or wind mit PDF'],
                ['4', 'You get a BindIQ Score with actionable underwriting notes'],
              ].map(([n, text]) => (
                <div key={n} style={{ display: 'flex', gap: 12, marginBottom: 10, alignItems: 'flex-start' }}>
                  <div style={{ width: 22, height: 22, borderRadius: 100, background: C.navy, color: '#fff', fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>{n}</div>
                  <p style={{ margin: 0, fontSize: 13, color: C.fg, lineHeight: 1.5 }}>{text}</p>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: C.greenBg, border: `1.5px solid ${C.greenBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, marginBottom: 20 }}>
              ✓
            </div>
            <h1 style={{ margin: '0 0 8px', fontSize: 24, fontWeight: 700, color: C.fg }}>
              Your intake link is ready
            </h1>
            <p style={{ margin: '0 0 28px', fontSize: 15, color: C.muted, lineHeight: 1.6 }}>
              Send this link to your client. They'll complete the form in about 2 minutes and you'll get a scored risk profile.
            </p>

            {/* URL box */}
            <div style={{ borderRadius: 10, border: `1.5px solid ${C.greenBorder}`, background: C.greenBg, padding: '14px 16px', marginBottom: 12 }}>
              <p style={{ margin: '0 0 8px', fontSize: 11, fontWeight: 700, color: C.green, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Intake link</p>
              <p style={{ margin: '0 0 12px', fontSize: 13, color: C.fg, wordBreak: 'break-all', fontFamily: 'monospace', lineHeight: 1.5 }}>{result.url}</p>
              <button
                onClick={handleCopy}
                style={{ padding: '8px 16px', borderRadius: 8, border: `1.5px solid ${C.greenBorder}`, background: copied ? C.green : '#fff', color: copied ? '#fff' : C.fg, fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s', fontFamily: "'DM Sans', sans-serif" }}
              >
                {copied ? '✓ Copied!' : 'Copy link'}
              </button>
            </div>

            {/* Details */}
            <div style={{ padding: '14px 16px', borderRadius: 10, background: C.bgSoft, border: `1px solid ${C.border}`, marginBottom: 24 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {agentName  && <Row label="Agent"  value={agentName} />}
                {agencyName && <Row label="Agency" value={agencyName} />}
                {agentEmail && <Row label="Email"  value={agentEmail} />}
                <Row label="Link ID" value={result.slug} mono />
              </div>
            </div>

            {usesLeft > 0 && (
              <p style={{ fontSize: 12, color: C.muted, marginBottom: 16, textAlign: 'center' }}>
                {usesLeft} free {usesLeft === 1 ? 'report' : 'reports'} remaining
              </p>
            )}

            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={handleReset}
                style={{ flex: 1, padding: '11px', borderRadius: 10, border: `1.5px solid ${C.border}`, background: C.bg, color: C.fg, fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}
              >
                Generate another
              </button>
              <Link
                to="/inspect"
                style={{ flex: 1, padding: '11px', borderRadius: 10, border: 'none', background: C.navy, color: '#fff', fontSize: 14, fontWeight: 600, textDecoration: 'none', textAlign: 'center', display: 'block', boxSizing: 'border-box' }}
              >
                Go to Inspector
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function Row({ label, value, mono = false }) {
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
      <span style={{ fontSize: 12, color: C.muted, width: 60, flexShrink: 0 }}>{label}</span>
      <span style={{ fontSize: 13, color: C.fg, fontFamily: mono ? 'monospace' : 'inherit' }}>{value}</span>
    </div>
  )
}
