import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const F = { sans: { fontFamily: "'DM Sans', system-ui, -apple-system, sans-serif" } }

const C = {
  bg:           '#FFFFFF',
  bgAlt:        '#F8FAFC',
  text:         '#0F1F3D',
  textMuted:    '#64748B',
  textSubtle:   '#94A3B8',
  border:       '#E2E8F0',
  borderMid:    '#CBD5E1',
  accent:       '#04256c',
  accentBg:     'rgba(4,37,108,0.07)',
  accentBorder: 'rgba(4,37,108,0.18)',
  positive:     '#10B981',
  amber:        '#F59E0B',
  danger:       '#EF4444',
  navy:         '#0F1F3D',
}

const MAX = 1100

const PAGE_CSS = `
  html, body { background: ${C.bg}; }
  * { box-sizing: border-box; }
  ::selection { background: rgba(4,37,108,0.10); }

  .lp-nav { background: rgba(255,255,255,0.8); border-bottom: 1px solid transparent; transition: background 0.2s, border-color 0.2s; }
  .lp-nav.scrolled { background: rgba(255,255,255,0.94); border-bottom-color: ${C.border}; backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); }
  .lp-nav-link { padding: 6px 12px; border-radius: 7px; color: ${C.textMuted}; text-decoration: none; font-size: 14px; font-weight: 500; transition: background 0.15s, color 0.15s; }
  .lp-nav-link:hover { background: ${C.bgAlt}; color: ${C.text}; }

  .lp-cta-primary { background: ${C.accent}; color: #fff; border: none; border-radius: 10px; font-size: 15px; font-weight: 700; padding: 14px 28px; cursor: pointer; text-decoration: none; display: inline-flex; align-items: center; box-shadow: 0 4px 16px rgba(4,37,108,0.35); transition: box-shadow 0.15s, opacity 0.15s; }
  .lp-cta-primary:hover { opacity: 0.92; box-shadow: 0 6px 24px rgba(4,37,108,0.45); }
  .lp-cta-ghost { background: ${C.bg}; color: ${C.text}; border: 1.5px solid ${C.border}; border-radius: 10px; font-size: 15px; font-weight: 600; padding: 13px 24px; cursor: pointer; text-decoration: none; display: inline-flex; align-items: center; transition: border-color 0.15s; }
  .lp-cta-ghost:hover { border-color: ${C.borderMid}; }

  .lp-section-pad { padding: 96px 24px; }
  .lp-h1 { font-size: 56px; line-height: 1.07; letter-spacing: -0.03em; }
  .lp-h2 { font-size: 38px; line-height: 1.12; letter-spacing: -0.025em; }

  .lp-flag-critical { background: rgba(239,68,68,0.07); border: 1px solid rgba(239,68,68,0.22); border-radius: 12px; padding: 18px 20px; }
  .lp-flag-warning  { background: rgba(245,158,11,0.07); border: 1px solid rgba(245,158,11,0.22); border-radius: 12px; padding: 18px 20px; }

  .lp-step-card { background: ${C.bg}; border: 1.5px solid ${C.border}; border-radius: 16px; padding: 28px; flex: 1; }

  .lp-faq summary { list-style: none; cursor: pointer; }
  .lp-faq summary::-webkit-details-marker { display: none; }
  .lp-faq[open] .lp-faq-icon { transform: rotate(45deg); }

  @media (max-width: 900px) {
    .lp-hero-grid { grid-template-columns: 1fr !important; }
    .lp-hero-right { display: none !important; }
    .lp-steps-grid { flex-direction: column !important; }
    .lp-flags-grid { grid-template-columns: 1fr !important; }
    .lp-outcomes-grid { grid-template-columns: 1fr !important; }
    .lp-extract-grid { grid-template-columns: 1fr !important; }
    .lp-h1 { font-size: 38px !important; }
    .lp-h2 { font-size: 28px !important; }
    .lp-section-pad { padding: 72px 24px !important; }
  }
  @media (max-width: 640px) {
    .lp-h1 { font-size: 32px !important; }
    .lp-h2 { font-size: 24px !important; }
    .lp-section-pad { padding: 56px 20px !important; }
    .lp-nav-links { display: none !important; }
  }
`

export default function LandingPage() {
  return (
    <div style={{ ...F.sans, color: C.text, background: C.bg, WebkitFontSmoothing: 'antialiased' }}>
      <style>{PAGE_CSS}</style>
      <Banner />
      <Nav />
      <Hero />
      <BindIQScoreSection />
      <HowItWorks />
      <WhatGetsFlagged />
      <ValueStatement />
      <WhatGetsExtracted />
      <Pricing />
      <FAQ />
      <FinalCTA />
      <Footer />
    </div>
  )
}

/* ─── Banner ─── */

function Banner() {
  return (
    <div style={{ background: C.accent, color: '#fff', padding: '10px 24px', textAlign: 'center', ...F.sans, fontSize: 13, fontWeight: 500, position: 'relative', zIndex: 101 }}>
      <span style={{ opacity: 0.85 }}>Founding agent pricing — </span>
      <strong>$79/mo locked forever</strong>
      <span style={{ opacity: 0.85 }}> for the first 100 subscribers. Price goes up after that.</span>
      <Link to="/sign-up" style={{ marginLeft: 16, fontSize: 12, fontWeight: 700, color: C.accent, background: '#fff', padding: '3px 12px', borderRadius: 20, textDecoration: 'none', whiteSpace: 'nowrap' }}>
        Get early access →
      </Link>
    </div>
  )
}

/* ─── Nav ─── */

function Nav() {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', h)
    return () => window.removeEventListener('scroll', h)
  }, [])
  const scrollTo = id => {
    const el = document.getElementById(id)
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 72, behavior: 'smooth' })
  }
  return (
    <nav className={`lp-nav${scrolled ? ' scrolled' : ''}`} style={{ position: 'fixed', top: 40, left: 0, right: 0, zIndex: 100 }}>
      <div style={{ maxWidth: MAX, margin: '0 auto', padding: '0 24px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
          <Link to="/" style={{ ...F.sans, fontSize: 17, fontWeight: 800, color: C.text, letterSpacing: '-0.02em', textDecoration: 'none' }}>BindIQ</Link>
          <div className="lp-nav-links" style={{ display: 'flex', gap: 4 }}>
            <button onClick={() => scrollTo('how')}     className="lp-nav-link" style={{ ...F.sans, background: 'none', border: 'none', cursor: 'pointer' }}>How it works</button>
            <button onClick={() => scrollTo('flags')}   className="lp-nav-link" style={{ ...F.sans, background: 'none', border: 'none', cursor: 'pointer' }}>What gets flagged</button>
            <button onClick={() => scrollTo('pricing')} className="lp-nav-link" style={{ ...F.sans, background: 'none', border: 'none', cursor: 'pointer' }}>Pricing</button>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Link to="/sign-in" style={{ ...F.sans, fontSize: 14, fontWeight: 500, color: C.textMuted, padding: '8px 14px', textDecoration: 'none' }}>Sign in</Link>
          <Link to="/inspect" className="lp-cta-primary" style={{ ...F.sans, fontSize: 14, fontWeight: 700, padding: '9px 20px', borderRadius: 8, boxShadow: '0 4px 12px rgba(4,37,108,0.30)' }}>
            Try BindIQ free
          </Link>
        </div>
      </div>
    </nav>
  )
}

/* ─── Hero ─── */

function Hero() {
  return (
    <section style={{ paddingTop: 164, paddingBottom: 80, background: 'linear-gradient(180deg, #EEF2FF 0%, #fff 70%)' }}>
      <div style={{ maxWidth: MAX, margin: '0 auto', padding: '0 24px' }}>
        <div className="lp-hero-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 480px', gap: 72, alignItems: 'center' }}>

          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: C.accentBg, border: `1px solid ${C.accentBorder}`, borderRadius: 20, padding: '5px 14px 5px 8px', marginBottom: 22 }}>
              <span style={{ width: 18, height: 18, borderRadius: '50%', background: C.accent, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="9" height="9" viewBox="0 0 9 9" fill="none"><path d="M1.5 4.5h6M4.5 1.5v6" stroke="#fff" strokeWidth="1.5" strokeLinecap="round"/></svg>
              </span>
              <span style={{ ...F.sans, fontSize: 13, fontWeight: 600, color: C.accent }}>For Florida independent insurance agents</span>
            </div>

            <h1 className="lp-h1" style={{ ...F.sans, fontWeight: 800, color: C.text, margin: 0, marginBottom: 20 }}>
              Know if a policy<br />will get declined<br />
              <span style={{ color: C.accent }}>in 30 seconds.</span>
            </h1>

            <p style={{ ...F.sans, fontSize: 17, color: C.textMuted, lineHeight: 1.65, marginBottom: 32, maxWidth: 500 }}>
              BindIQ analyzes Florida 4-point and wind mitigation reports to surface underwriting red flags before you quote.
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32, flexWrap: 'wrap' }}>
              <Link to="/inspect" className="lp-cta-primary" style={F.sans}>
                Try BindIQ free
              </Link>
              <button onClick={() => document.getElementById('how')?.scrollIntoView({ behavior: 'smooth', block: 'start' })} className="lp-cta-ghost" style={F.sans}>
                See how it works
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                'Upload any Florida 4-point or wind mitigation report',
                'Instantly extract all underwriting-critical fields',
                'Get a BindIQ Score — your 0–100 bind likelihood rating',
                'See deal-killing risks flagged automatically',
              ].map(t => (
                <span key={t} style={{ ...F.sans, fontSize: 14, color: C.textMuted, display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" style={{ flexShrink: 0, marginTop: 1 }}>
                    <circle cx="9" cy="9" r="8" fill={C.accentBg}/>
                    <path d="M5.5 9l2.5 2.5L12.5 6" stroke={C.accent} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  {t}
                </span>
              ))}
            </div>
          </div>

          <div className="lp-hero-right">
            <HeroMockup />
          </div>
        </div>
      </div>
    </section>
  )
}

function HeroMockup() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>

      {/* BindIQ Score — the hero result */}
      <div style={{ background: 'rgba(16,185,129,0.07)', border: '1.5px solid rgba(16,185,129,0.28)', borderRadius: 14, padding: '18px 20px', boxShadow: '0 8px 32px rgba(15,31,61,0.08)' }}>
        <div style={{ ...F.sans, fontSize: 10, fontWeight: 700, color: '#047857', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>BindIQ Score</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 10 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 3 }}>
            <span style={{ ...F.sans, fontSize: 46, fontWeight: 800, color: '#065F46', lineHeight: 1, letterSpacing: '-0.03em' }}>85</span>
            <span style={{ ...F.sans, fontSize: 13, color: '#065F46', opacity: 0.45, fontWeight: 600 }}>/100</span>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
              <span style={{ fontSize: 14 }}>🟢</span>
              <span style={{ ...F.sans, fontSize: 14, fontWeight: 800, color: '#065F46' }}>Likely to Bind</span>
            </div>
            <div style={{ height: 6, background: 'rgba(0,0,0,0.07)', borderRadius: 3, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: '85%', background: '#10B981', borderRadius: 3 }} />
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {[
            '· Impact-resistant opening protection — reduces wind risk',
            '· Strong roof-to-wall connection — positive factor',
          ].map(r => (
            <span key={r} style={{ ...F.sans, fontSize: 11, color: '#047857', lineHeight: 1.5 }}>{r}</span>
          ))}
        </div>
      </div>

      {/* Wind mit fields */}
      <div style={{ background: '#fff', borderRadius: 14, border: `1px solid ${C.border}`, overflow: 'hidden', boxShadow: '0 6px 24px rgba(15,31,61,0.08)' }}>
        <div style={{ background: C.accentBg, borderBottom: `1px solid ${C.accentBorder}`, padding: '9px 14px' }}>
          <span style={{ ...F.sans, fontSize: 11, fontWeight: 700, color: C.accent, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Wind Mitigation · OIR-B1-1802</span>
        </div>
        <div style={{ padding: '10px 14px' }}>
          <div style={{ ...F.sans, fontSize: 11, color: C.textSubtle, marginBottom: 6 }}>4821 Pelican Cove Rd, Naples FL · 03/12/2024</div>
          {[
            { label: 'Roof-to-Wall',       badge: 'D', desc: 'Double wraps' },
            { label: 'Roof Geometry',      badge: null, desc: 'Hip — 100%' },
            { label: 'Opening Protection', badge: 'D', desc: 'Impact glass throughout' },
          ].map((row) => (
            <div key={row.label} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '5px 0', borderBottom: `1px solid ${C.border}` }}>
              <span style={{ ...F.sans, fontSize: 11, color: C.textSubtle, width: 120, flexShrink: 0 }}>{row.label}</span>
              {row.badge && <span style={{ ...F.sans, fontSize: 11, fontWeight: 800, background: 'rgba(16,185,129,0.12)', color: '#065F46', width: 18, height: 18, borderRadius: 4, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{row.badge}</span>}
              <span style={{ ...F.sans, fontSize: 12, color: C.text }}>{row.desc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Decline example */}
      <div style={{ background: 'rgba(239,68,68,0.06)', border: '1.5px solid rgba(239,68,68,0.22)', borderRadius: 12, padding: '14px 16px', boxShadow: '0 4px 16px rgba(15,31,61,0.06)' }}>
        <div style={{ ...F.sans, fontSize: 10, fontWeight: 700, color: '#991B1B', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>BindIQ Score</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <span style={{ ...F.sans, fontSize: 32, fontWeight: 800, color: '#991B1B', lineHeight: 1, letterSpacing: '-0.03em' }}>25</span>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <span style={{ fontSize: 12 }}>🔴</span>
              <span style={{ ...F.sans, fontSize: 13, fontWeight: 800, color: '#991B1B' }}>Likely Decline</span>
            </div>
            <div style={{ height: 4, background: 'rgba(0,0,0,0.07)', borderRadius: 2, overflow: 'hidden', marginTop: 4, width: 120 }}>
              <div style={{ height: '100%', width: '25%', background: '#EF4444', borderRadius: 2 }} />
            </div>
          </div>
        </div>
        <span style={{ ...F.sans, fontSize: 11, color: '#B91C1C', lineHeight: 1.5 }}>· Federal Pacific panel — high underwriting rejection risk</span>
      </div>
    </div>
  )
}

/* ─── BindIQ Score Section ─── */

function BindIQScoreSection() {
  const tiers = [
    {
      score: 85,
      emoji: '🟢',
      label: 'Likely to Bind',
      range: '70 – 100',
      barColor: '#10B981',
      bg: 'rgba(16,185,129,0.06)',
      border: 'rgba(16,185,129,0.22)',
      scoreColor: '#065F46',
      labelColor: '#047857',
      example: 'Hip roof, impact glass, double wraps, copper plumbing. No red flags. Standard FL carriers should write with normal review.',
      reasons: ['Impact-resistant opening protection', 'Strong roof-to-wall connection', 'Modern plumbing supply material'],
    },
    {
      score: 54,
      emoji: '🟡',
      label: 'Conditional Risk',
      range: '40 – 69',
      barColor: '#F59E0B',
      bg: 'rgba(245,158,11,0.06)',
      border: 'rgba(245,158,11,0.25)',
      scoreColor: '#92400E',
      labelColor: '#B45309',
      example: 'Galvanized plumbing and HVAC 18 years old. Placeable — but carrier may require documentation, exclusions, or higher premium.',
      reasons: ['Galvanized supply lines — corrosion risk', 'HVAC system is 18 years old'],
    },
    {
      score: 25,
      emoji: '🔴',
      label: 'Likely Decline',
      range: '0 – 39',
      barColor: '#EF4444',
      bg: 'rgba(239,68,68,0.06)',
      border: 'rgba(239,68,68,0.22)',
      scoreColor: '#991B1B',
      labelColor: '#B91C1C',
      example: 'Federal Pacific panel. Most standard FL carriers will not bind. Remediation required before placement.',
      reasons: ['Federal Pacific panel — high underwriting rejection risk', 'Roof exceeds 25 years'],
    },
  ]

  return (
    <section className="lp-section-pad" style={{ background: C.bgAlt }}>
      <div style={{ maxWidth: MAX, margin: '0 auto', padding: '0 24px' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <div style={{ ...F.sans, fontSize: 12, fontWeight: 700, color: C.accent, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>The BindIQ Score</div>
          <h2 className="lp-h2" style={{ ...F.sans, fontWeight: 800, color: C.text, margin: '0 0 16px' }}>
            One number. Instant decision.
          </h2>
          <p style={{ ...F.sans, fontSize: 16, color: C.textMuted, maxWidth: 560, margin: '0 auto 0', lineHeight: 1.7 }}>
            Every report gets scored 0–100 based on FL underwriting rules. Not AI guesswork — a deterministic rules engine that checks the same things every carrier underwriter checks. You see the score, the reasons, and what to say to the client before you pick up the phone.
          </p>
        </div>

        {/* Three tier cards */}
        <div className="lp-outcomes-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, marginBottom: 48 }}>
          {tiers.map(t => (
            <div key={t.label} style={{ background: t.bg, border: `1.5px solid ${t.border}`, borderRadius: 16, padding: '28px 24px' }}>
              {/* Score + bar */}
              <div style={{ marginBottom: 18 }}>
                <div style={{ ...F.sans, fontSize: 11, fontWeight: 700, color: t.scoreColor, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 6 }}>BindIQ Score</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 3, marginBottom: 10 }}>
                  <span style={{ ...F.sans, fontSize: 48, fontWeight: 800, color: t.scoreColor, lineHeight: 1, letterSpacing: '-0.03em' }}>{t.score}</span>
                  <span style={{ ...F.sans, fontSize: 13, color: t.scoreColor, opacity: 0.4, fontWeight: 600 }}>/100</span>
                </div>
                <div style={{ height: 6, background: 'rgba(0,0,0,0.07)', borderRadius: 3, overflow: 'hidden', marginBottom: 10 }}>
                  <div style={{ height: '100%', width: `${t.score}%`, background: t.barColor, borderRadius: 3 }} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: 16 }}>{t.emoji}</span>
                  <span style={{ ...F.sans, fontSize: 15, fontWeight: 800, color: t.scoreColor }}>{t.label}</span>
                  <span style={{ ...F.sans, fontSize: 11, color: t.scoreColor, opacity: 0.55, marginLeft: 4 }}>{t.range}</span>
                </div>
              </div>

              {/* Reasons */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 14 }}>
                {t.reasons.map(r => (
                  <div key={r} style={{ display: 'flex', alignItems: 'flex-start', gap: 7 }}>
                    <span style={{ ...F.sans, fontSize: 12, color: t.scoreColor, flexShrink: 0, marginTop: 1 }}>·</span>
                    <span style={{ ...F.sans, fontSize: 12, color: t.scoreColor, lineHeight: 1.5, opacity: 0.85 }}>{r}</span>
                  </div>
                ))}
              </div>

              {/* Example scenario */}
              <div style={{ paddingTop: 14, borderTop: `1px solid ${t.border}` }}>
                <div style={{ ...F.sans, fontSize: 11, fontWeight: 700, color: t.scoreColor, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 5 }}>What this means</div>
                <p style={{ ...F.sans, fontSize: 12, color: t.scoreColor, lineHeight: 1.6, margin: 0, opacity: 0.8 }}>{t.example}</p>
              </div>
            </div>
          ))}
        </div>

        {/* How score is calculated */}
        <div style={{ background: C.bg, border: `1.5px solid ${C.border}`, borderRadius: 16, padding: '32px 36px', maxWidth: 720, margin: '0 auto' }}>
          <div style={{ ...F.sans, fontSize: 12, fontWeight: 700, color: C.accent, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>How the score is calculated</div>
          <p style={{ ...F.sans, fontSize: 14, color: C.textMuted, lineHeight: 1.7, margin: '0 0 20px' }}>
            Starts at 100. Risk penalties are subtracted based on what's found in the report. Positive factors add back. Any critical flag (Federal Pacific, Zinsco, knob-and-tube, aluminum wiring) automatically caps the score at 40 or below — the Likely Decline range.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {[
              { label: 'Federal Pacific / Zinsco panel', pts: '−60 (cap at 40)', crit: true },
              { label: 'Knob-and-tube wiring',           pts: '−60 (cap at 40)', crit: true },
              { label: 'Aluminum branch wiring',         pts: '−50 (cap at 40)', crit: true },
              { label: 'Roof in poor condition',         pts: '−35', crit: false },
              { label: 'Polybutylene plumbing',          pts: '−30', crit: false },
              { label: 'Roof over 25 years',             pts: '−25', crit: false },
              { label: 'Open gable geometry',            pts: '−20', crit: false },
              { label: 'Impact / hurricane protection',  pts: '+10', crit: false, positive: true },
            ].map(row => (
              <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px 10px', background: row.crit ? 'rgba(239,68,68,0.05)' : row.positive ? 'rgba(16,185,129,0.05)' : C.bgAlt, borderRadius: 8 }}>
                <span style={{ ...F.sans, fontSize: 12, color: C.text }}>{row.label}</span>
                <span style={{ ...F.sans, fontSize: 12, fontWeight: 700, color: row.crit ? '#991B1B' : row.positive ? '#065F46' : C.textMuted, flexShrink: 0, marginLeft: 12 }}>{row.pts}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}

/* ─── How it works (Product Demo) ─── */

function HowItWorks() {
  const steps = [
    {
      num: '01',
      title: 'Upload Report',
      body: 'Drag and drop any 4-point or wind mitigation PDF. Works with any Florida inspection company\'s format — no reformatting needed.',
    },
    {
      num: '02',
      title: 'Automatic Extraction',
      body: 'Every field is structured instantly — roof material, age, and condition; electrical panel brand and wiring type; plumbing supply material; HVAC age and condition.',
    },
    {
      num: '03',
      title: 'BindIQ Score',
      body: 'Every report gets scored 0–100. 🟢 Likely to Bind (70–100) · 🟡 Conditional Risk (40–69) · 🔴 Likely Decline (0–39). You see the score, the exact reasons it moved, and a plain-English carrier impact note — before you pick up the phone.',
    },
  ]
  return (
    <section id="how" className="lp-section-pad" style={{ background: C.bgAlt }}>
      <div style={{ maxWidth: MAX, margin: '0 auto', padding: '0 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <div style={{ ...F.sans, fontSize: 12, fontWeight: 700, color: C.accent, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>How it works</div>
          <h2 className="lp-h2" style={{ ...F.sans, fontWeight: 800, color: C.text, margin: 0, marginBottom: 14 }}>
            From inspection report to underwriting<br />clarity in seconds
          </h2>
          <p style={{ ...F.sans, fontSize: 16, color: C.textMuted, maxWidth: 480, margin: '0 auto', lineHeight: 1.65 }}>
            Three steps. Under a minute. No training required.
          </p>
        </div>

        <div className="lp-steps-grid" style={{ display: 'flex', gap: 20 }}>
          {steps.map((s, i) => (
            <div key={i} className="lp-step-card">
              <div style={{ width: 36, height: 36, borderRadius: 10, background: C.accentBg, border: `1px solid ${C.accentBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                <span style={{ ...F.sans, fontSize: 13, fontWeight: 800, color: C.accent }}>{s.num}</span>
              </div>
              <div style={{ ...F.sans, fontSize: 18, fontWeight: 700, color: C.text, marginBottom: 12 }}>{s.title}</div>
              <div style={{ ...F.sans, fontSize: 14, color: C.textMuted, lineHeight: 1.7 }}>{s.body}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── What gets flagged ─── */

function WhatGetsFlagged() {
  const flags = [
    {
      severity: 'critical',
      title: 'Federal Pacific / Zinsco panels',
      impact: 'Likely decline',
      body: 'Most FL carriers will not bind on either panel brand. Federal Pacific Stab-Lok and Zinsco are both known fire hazards — virtually every standard market will require replacement before quoting.',
    },
    {
      severity: 'critical',
      title: 'Aluminum branch wiring',
      impact: 'High underwriting risk',
      body: 'Aluminum wiring on branch circuits — not just the service entrance — creates fire risk at connections. Requires remediation documentation or COPALUM connector certification before most carriers will write.',
    },
    {
      severity: 'critical',
      title: 'Knob-and-tube wiring',
      impact: 'Almost always uninsurable',
      body: 'Knob-and-tube is uninsurable with virtually all standard FL carriers. Requires full rewire before placement. Catching this before the quote prevents a wasted submission entirely.',
    },
    {
      severity: 'warning',
      title: 'Polybutylene plumbing',
      impact: 'Carrier restrictions',
      body: 'Poly-b supply pipes have a known failure history. Many FL carriers exclude water damage or require replacement. Catching this before submission prevents the client call no one wants to make.',
    },
    {
      severity: 'warning',
      title: 'Roof over 25 years',
      impact: 'Inspection / replacement trigger',
      body: 'Most FL carriers require a roof inspection or condition letter for roofs over 20–25 years, and may require replacement. Age flagged automatically so you can set expectations before the quote goes out.',
    },
  ]

  return (
    <section id="flags" className="lp-section-pad">
      <div style={{ maxWidth: MAX, margin: '0 auto', padding: '0 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <div style={{ ...F.sans, fontSize: 12, fontWeight: 700, color: C.accent, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>What gets flagged</div>
          <h2 className="lp-h2" style={{ ...F.sans, fontWeight: 800, color: C.text, margin: 0, marginBottom: 14 }}>
            Know what carriers will reject<br />before you waste time quoting
          </h2>
          <p style={{ ...F.sans, fontSize: 16, color: C.textMuted, maxWidth: 520, margin: '0 auto', lineHeight: 1.65 }}>
            Every extraction runs against the full list of FL underwriting killers — automatically, before you pick up the phone.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 780, margin: '0 auto' }}>
          {flags.map(f => (
            <div key={f.title} className={f.severity === 'critical' ? 'lp-flag-critical' : 'lp-flag-warning'}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, marginBottom: 8, flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 16 }}>{f.severity === 'critical' ? '🚨' : '⚠️'}</span>
                  <span style={{ ...F.sans, fontSize: 15, fontWeight: 700, color: f.severity === 'critical' ? '#991B1B' : '#92400E' }}>
                    {f.title}
                  </span>
                </div>
                <span style={{
                  ...F.sans, fontSize: 11, fontWeight: 700,
                  color: f.severity === 'critical' ? '#991B1B' : '#92400E',
                  background: f.severity === 'critical' ? 'rgba(239,68,68,0.12)' : 'rgba(245,158,11,0.15)',
                  padding: '3px 10px', borderRadius: 20, whiteSpace: 'nowrap',
                }}>
                  {f.impact}
                </span>
              </div>
              <p style={{ ...F.sans, fontSize: 13, color: f.severity === 'critical' ? '#B91C1C' : '#B45309', lineHeight: 1.6, margin: 0, paddingLeft: 26 }}>
                {f.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── Value Statement ─── */

function ValueStatement() {
  return (
    <section style={{ background: C.navy, padding: '96px 24px' }}>
      <div style={{ maxWidth: 760, margin: '0 auto', textAlign: 'center' }}>
        <h2 className="lp-h2" style={{ ...F.sans, fontWeight: 800, color: '#fff', margin: '0 0 20px' }}>
          Stop writing quotes that will never bind.
        </h2>
        <p style={{ ...F.sans, fontSize: 17, color: 'rgba(255,255,255,0.65)', lineHeight: 1.7, margin: '0 0 36px', maxWidth: 600, marginLeft: 'auto', marginRight: 'auto' }}>
          Florida agents lose hours every day quoting properties carriers won't accept. BindIQ prevents wasted submissions by identifying underwriting issues before the quote is sent.
        </p>
        <Link to="/inspect" className="lp-cta-primary" style={{ ...F.sans, background: '#fff', color: C.navy, fontSize: 15 }}>
          Try BindIQ free — no account needed
        </Link>
      </div>
    </section>
  )
}

/* ─── What gets extracted ─── */

function WhatGetsExtracted() {
  return (
    <section className="lp-section-pad" style={{ background: C.bgAlt }}>
      <div style={{ maxWidth: MAX, margin: '0 auto', padding: '0 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <div style={{ ...F.sans, fontSize: 12, fontWeight: 700, color: C.accent, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>What gets extracted</div>
          <h2 className="lp-h2" style={{ ...F.sans, fontWeight: 800, color: C.text, margin: 0 }}>Every field. Structured.</h2>
        </div>

        <div className="lp-extract-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>

          <div style={{ background: C.bg, border: `1.5px solid ${C.border}`, borderRadius: 16, padding: 28 }}>
            <div style={{ ...F.sans, fontSize: 13, fontWeight: 700, color: C.accent, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>Wind Mitigation</div>
            <div style={{ ...F.sans, fontSize: 12, color: C.textSubtle, marginBottom: 20 }}>OIR-B1-1802</div>
            {[
              ['Roof Covering',          'Selection A–D + permit date + approval number'],
              ['Roof Deck Attachment',   'Selection A–G + description'],
              ['Roof-to-Wall Connection','Selection A–F (toe nails → structural)'],
              ['Roof Geometry',          'Hip / gable / flat + hip percentage'],
              ['Secondary Water Resist.','Yes / No + underlayment type'],
              ['Opening Protection',     'None / basic / hurricane / impact + details'],
            ].map(([label, detail]) => (
              <div key={label} style={{ display: 'flex', flexDirection: 'column', padding: '9px 0', borderBottom: `1px solid ${C.border}` }}>
                <span style={{ ...F.sans, fontSize: 13, fontWeight: 600, color: C.text }}>{label}</span>
                <span style={{ ...F.sans, fontSize: 12, color: C.textMuted, marginTop: 2 }}>{detail}</span>
              </div>
            ))}
          </div>

          <div style={{ background: C.bg, border: `1.5px solid ${C.border}`, borderRadius: 16, padding: 28 }}>
            <div style={{ ...F.sans, fontSize: 13, fontWeight: 700, color: C.accent, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>4-Point Inspection</div>
            <div style={{ ...F.sans, fontSize: 12, color: C.textSubtle, marginBottom: 20 }}>All four systems</div>
            {[
              ['Roof',       'Material, age, condition, estimated remaining life'],
              ['HVAC',       'Type, brand, age, condition, last service'],
              ['Plumbing',   'Supply material (copper / CPVC / polybutylene), drains, water heater age'],
              ['Electrical', 'Panel brand, type, service amps, wiring type, condition'],
            ].map(([label, detail]) => (
              <div key={label} style={{ display: 'flex', flexDirection: 'column', padding: '9px 0', borderBottom: `1px solid ${C.border}` }}>
                <span style={{ ...F.sans, fontSize: 13, fontWeight: 600, color: C.text }}>{label}</span>
                <span style={{ ...F.sans, fontSize: 12, color: C.textMuted, marginTop: 2 }}>{detail}</span>
              </div>
            ))}
            <div style={{ marginTop: 16, ...F.sans, fontSize: 12, color: C.textSubtle, lineHeight: 1.6 }}>
              Plus: property address, inspection date, inspector name and license number.
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─── Pricing ─── */

function Pricing() {
  const plans = [
    {
      name: 'Free',
      price: 0,
      desc: 'Try it out',
      scans: '5 scans',
      features: [
        '5 report scans total',
        '4-point + wind mitigation',
        'BindIQ Score on every scan',
        'Risk flag detection',
      ],
      cta: 'Start free',
      ctaTo: '/sign-up',
      highlight: false,
      badge: null,
    },
    {
      name: 'Starter',
      price: 79,
      desc: 'For solo agents',
      scans: '50 scans/mo',
      features: [
        '50 report scans per month',
        '4-point + wind mitigation',
        'BindIQ Score on every scan',
        'Risk flag detection',
        'Structured underwriting output',
        'Clipboard export',
      ],
      cta: 'Start free trial',
      ctaTo: '/sign-up',
      highlight: false,
      badge: null,
    },
    {
      name: 'Pro',
      price: 149,
      desc: 'For growing agencies',
      scans: '200 scans/mo',
      features: [
        '200 report scans per month',
        'Everything in Starter',
        'Intake Link — send one link to clients',
        'Client-facing 3-step intake form',
        'PDF upload in intake flow',
        'Submission history dashboard',
      ],
      cta: 'Start free trial',
      ctaTo: '/sign-up',
      highlight: true,
      badge: 'Most popular',
    },
    {
      name: 'Agency',
      price: 299,
      desc: 'For full teams',
      scans: 'Unlimited',
      features: [
        'Unlimited scans',
        'Everything in Pro',
        'Team seats (up to 10 agents)',
        'Shared intake link library',
        'Submission export (CSV)',
        'Priority support',
      ],
      cta: 'Contact us',
      ctaTo: '/sign-up',
      highlight: false,
      badge: null,
    },
  ]

  return (
    <section id="pricing" className="lp-section-pad">
      <div style={{ maxWidth: MAX, margin: '0 auto', padding: '0 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{ ...F.sans, fontSize: 12, fontWeight: 700, color: C.accent, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>Pricing</div>
          <h2 className="lp-h2" style={{ ...F.sans, fontWeight: 800, color: C.text, margin: 0, marginBottom: 14 }}>
            Built for Florida insurance agents
          </h2>
          <p style={{ ...F.sans, fontSize: 16, color: C.textMuted, maxWidth: 440, margin: '0 auto', lineHeight: 1.6 }}>
            Start free. Upgrade when you need Intake Links or your team grows.
          </p>
        </div>

        {/* Plan grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, alignItems: 'start' }}>
          {plans.map(plan => (
            <div
              key={plan.name}
              style={{
                background: C.bg,
                border: plan.highlight ? `2px solid ${C.accent}` : `1.5px solid ${C.border}`,
                borderRadius: 16,
                padding: '28px 24px',
                position: 'relative',
                boxShadow: plan.highlight ? '0 8px 32px rgba(4,37,108,0.12)' : 'none',
              }}
            >
              {plan.badge && (
                <div style={{
                  position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)',
                  background: C.accent, color: '#fff', ...F.sans,
                  fontSize: 10, fontWeight: 700, padding: '3px 14px', borderRadius: 20,
                  letterSpacing: '0.06em', whiteSpace: 'nowrap',
                }}>
                  {plan.badge.toUpperCase()}
                </div>
              )}

              <div style={{ marginBottom: 16 }}>
                <div style={{ ...F.sans, fontSize: 12, fontWeight: 700, color: plan.highlight ? C.accent : C.textMuted, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>{plan.name}</div>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, marginBottom: 2 }}>
                  <span style={{ ...F.sans, fontSize: plan.price === 0 ? 36 : 36, fontWeight: 800, color: C.text, lineHeight: 1, letterSpacing: '-0.02em' }}>
                    {plan.price === 0 ? 'Free' : `$${plan.price}`}
                  </span>
                  {plan.price > 0 && <span style={{ ...F.sans, fontSize: 13, color: C.textMuted, paddingBottom: 5 }}>/mo</span>}
                </div>
                <div style={{ ...F.sans, fontSize: 12, color: C.textMuted }}>{plan.scans}</div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
                {plan.features.map(f => (
                  <div key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" style={{ flexShrink: 0, marginTop: 2 }}>
                      <circle cx="7.5" cy="7.5" r="6.5" fill="rgba(16,185,129,0.12)"/>
                      <path d="M4.5 7.5l2 2 4-4" stroke={C.positive} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span style={{ ...F.sans, fontSize: 13, color: C.text, lineHeight: 1.45 }}>{f}</span>
                  </div>
                ))}
              </div>

              <Link
                to={plan.ctaTo}
                style={{
                  ...F.sans,
                  display: 'block', textAlign: 'center', textDecoration: 'none',
                  padding: '11px 16px', borderRadius: 9, fontSize: 14, fontWeight: 700,
                  background: plan.highlight ? C.accent : 'transparent',
                  color: plan.highlight ? '#fff' : C.accent,
                  border: plan.highlight ? 'none' : `1.5px solid ${C.accent}`,
                  transition: 'all 0.15s',
                }}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

        {/* Intake link callout */}
        <div style={{ maxWidth: 600, margin: '36px auto 0', background: 'rgba(4,37,108,0.04)', border: `1px solid rgba(4,37,108,0.12)`, borderRadius: 14, padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ fontSize: 28, flexShrink: 0 }}>🔗</div>
          <div>
            <div style={{ ...F.sans, fontSize: 14, fontWeight: 700, color: C.text, marginBottom: 4 }}>
              Pro & Agency: Intake Links included
            </div>
            <div style={{ ...F.sans, fontSize: 13, color: C.textMuted, lineHeight: 1.55 }}>
              Generate a shareable link, send it to your client. They fill out a 3-step form with optional PDF upload — you get a scored, submission-ready risk profile in your dashboard.
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─── FAQ ─── */

function FAQ() {
  const items = [
    ['Does it work with any 4-point or wind mitigation PDF?',
     'Yes — BindIQ works with most standard inspection PDFs used in Florida, including 4-point and wind mitigation reports. If the PDF contains selectable text, it processes instantly. If it\'s image-based, it is handled through our processing pipeline.'],
    ['What about scanned or handwritten reports?',
     'Scanned PDFs (image-based) are supported. You can also paste text directly using Paste Mode if needed. Full automated OCR support for scanned documents is being added to improve coverage further.'],
    ['How accurate is the extraction?',
     'BindIQ is highly accurate for standard inspection reports. It is designed specifically for Florida underwriting documents, and reliably extracts key fields such as roof condition, electrical panels, plumbing type, HVAC age, and wind mitigation features. Critical risk indicators are detected using rule-based validation — not guesswork.'],
    ['Is client data stored or shared?',
     'No. BindIQ does not store or share inspection report content. Reports are processed securely to extract underwriting insights and are immediately discarded after processing. Client-identifying information is not retained beyond the session.'],
    ['What forms are supported?',
     'Currently supported: Florida OIR-B1-1802 wind mitigation forms and standard 4-point inspection reports. Additional state forms (including Texas and Louisiana) are in development.'],
    ['Can I cancel any time?',
     'Yes. You can cancel anytime from your billing dashboard. No penalties or commitments — access continues until the end of your billing period.'],
  ]
  return (
    <section className="lp-section-pad" style={{ background: C.bgAlt }}>
      <div style={{ maxWidth: 680, margin: '0 auto', padding: '0 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <h2 className="lp-h2" style={{ ...F.sans, fontWeight: 800, color: C.text, margin: 0 }}>Questions</h2>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {items.map(([q, a]) => (
            <details key={q} className="lp-faq" style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 12, overflow: 'hidden' }}>
              <summary style={{ padding: '18px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                <span style={{ ...F.sans, fontSize: 15, fontWeight: 600, color: C.text }}>{q}</span>
                <span className="lp-faq-icon" style={{ ...F.sans, fontSize: 20, color: C.textSubtle, flexShrink: 0, transition: 'transform 0.2s', lineHeight: 1 }}>+</span>
              </summary>
              <div style={{ ...F.sans, fontSize: 14, color: C.textMuted, lineHeight: 1.7, padding: '0 20px 18px' }}>{a}</div>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── Final CTA ─── */

function FinalCTA() {
  return (
    <section className="lp-section-pad">
      <div style={{ maxWidth: MAX, margin: '0 auto', padding: '0 24px', textAlign: 'center' }}>
        <h2 className="lp-h2" style={{ ...F.sans, fontWeight: 800, color: C.text, margin: '0 auto 16px', maxWidth: 560 }}>
          Start making cleaner, faster underwriting decisions.
        </h2>
        <p style={{ ...F.sans, fontSize: 16, color: C.textMuted, maxWidth: 440, margin: '0 auto 32px', lineHeight: 1.65 }}>
          No account needed to start. Upload a PDF and see results in under a minute.
        </p>
        <Link to="/inspect" className="lp-cta-primary" style={{ ...F.sans, fontSize: 16, padding: '16px 36px' }}>
          Try BindIQ →
        </Link>
      </div>
    </section>
  )
}

/* ─── Footer ─── */

function Footer() {
  return (
    <footer style={{ borderTop: `1px solid ${C.border}`, padding: '28px 24px' }}>
      <div style={{ maxWidth: MAX, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
        <span style={{ ...F.sans, fontSize: 14, fontWeight: 700, color: C.text }}>BindIQ</span>
        <div style={{ display: 'flex', gap: 20 }}>
          {[['Privacy', '/privacy'], ['Terms', '/terms'], ['Support', '/support']].map(([label, to]) => (
            <Link key={label} to={to} style={{ ...F.sans, fontSize: 13, color: C.textSubtle, textDecoration: 'none' }}>{label}</Link>
          ))}
        </div>
        <span style={{ ...F.sans, fontSize: 12, color: C.textSubtle }}>© 2026 BindIQ. Built for Florida agents.</span>
      </div>
    </footer>
  )
}
