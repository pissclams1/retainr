import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { PLANS } from '../lib/plans'
import DemoAnimation from '../components/DemoAnimation'

// ── Design tokens ──────────────────────────────────────────────────────────
const T = {
  navy:        '#04256C',
  navy2:       '#0F1F3D',
  navyLight:   'rgba(4,37,108,0.07)',
  navyBorder:  'rgba(4,37,108,0.15)',
  red:         '#DC2626',
  green:       '#10B981',
  greenDark:   '#065F46',
  amber:       '#F59E0B',
  text:        '#0F1F3D',
  muted:       '#64748B',
  subtle:      '#94A3B8',
  border:      '#E2E8F0',
  border2:     '#CBD5E1',
  surface:     '#F8FAFC',
  surface2:    '#F1F5F9',
  font:        "'DM Sans', system-ui, sans-serif",
}

// ── Logo wordmark ─────────────────────────────────────────────────────────
function Logo({ size = 24, tagline = false }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
      <div style={{ fontSize: size, fontWeight: 800, letterSpacing: '-0.04em', color: T.navy2, lineHeight: 1 }}>
        Bind<span style={{ color: T.red }}>IQ</span>
      </div>
      <div style={{ display: 'flex', gap: 3 }}>
        <div style={{ height: 3, width: 28, borderRadius: 2, background: 'rgba(15,31,61,0.18)' }} />
        <div style={{ height: 3, width: 10, borderRadius: 2, background: T.red }} />
      </div>
      {tagline && (
        <div style={{ fontSize: 11, fontWeight: 500, color: T.muted, letterSpacing: '0.01em', marginTop: 1, whiteSpace: 'nowrap' }}>
          Know before you quote.
        </div>
      )}
    </div>
  )
}

// ── Geo state configs ─────────────────────────────────────────────────────
const STATE_CONFIGS = {
  FL: {
    trustLine: '4-point & wind mitigation',
    statePill: 'Florida-ready',
    footerText: 'Built for Florida insurance agents.',
    inspectNote: 'Florida 4-point · Wind mitigation OIR-B1-1802 · More states coming soon',
  },
  TX: {
    trustLine: '4-point & windstorm forms',
    statePill: 'Texas-ready',
    footerText: 'Built for Texas insurance agents.',
    inspectNote: 'Texas 4-point · Windstorm inspection · More states coming soon',
  },
  LA: {
    trustLine: '4-point & wind mitigation',
    statePill: 'Louisiana-ready',
    footerText: 'Built for Louisiana insurance agents.',
    inspectNote: 'Louisiana 4-point · Wind mitigation · More states coming soon',
  },
  SC: {
    trustLine: '4-point & wind mitigation',
    statePill: 'South Carolina-ready',
    footerText: 'Built for South Carolina insurance agents.',
    inspectNote: 'SC 4-point · Wind mitigation · More states coming soon',
  },
}
const DEFAULT_STATE = STATE_CONFIGS.FL

const PAGE_CSS = `
  html { scroll-behavior: smooth; }
  html, body { background: #ffffff; }
  * { box-sizing: border-box; }
  ::selection { background: rgba(4,37,108,0.10); }
  section { scroll-margin-top: 80px; }

  .lp-nav-link {
    font-size: 15px; font-weight: 500; color: ${T.muted};
    padding: 7px 12px; border-radius: 8px;
    text-decoration: none; cursor: pointer; background: none; border: none;
    font-family: ${T.font};
    transition: color 0.15s, background 0.15s;
  }
  .lp-nav-link:hover { color: ${T.text}; background: ${T.surface}; }

  .lp-faq-item summary { list-style: none; cursor: pointer; }
  .lp-faq-item summary::-webkit-details-marker { display: none; }
  .lp-faq-item[open] .faq-icon { transform: rotate(45deg); }

  @media (max-width: 900px) {
    .lp-nav-links { display: none !important; }
    .hero-card-cluster { grid-template-columns: 1fr !important; }
    .lp-steps-grid { grid-template-columns: 1fr !important; }
    .lp-flags-list { max-width: 100% !important; }
    .lp-plans-grid { grid-template-columns: 1fr !important; max-width: 420px !important; }
    .lp-faq-scoring-grid { grid-template-columns: 1fr !important; }
    .lp-footer-grid { grid-template-columns: 1fr 1fr !important; gap: 32px !important; }
    .lp-h1 { font-size: 42px !important; }
    .lp-h2 { font-size: 30px !important; }
  }
  @media (max-width: 640px) {
    .lp-h1 { font-size: 34px !important; }
    .lp-h2 { font-size: 24px !important; }
    .hero-card-cluster { max-width: 100% !important; }
    .stats-band-inner { gap: 24px !important; flex-wrap: wrap !important; }
    .lp-footer-grid { grid-template-columns: 1fr !important; }
  }
`

// ─────────────────────────────────────────────────────────────────────────────
export default function LandingPage() {
  const [geoState, setGeoState] = useState(DEFAULT_STATE)

  useEffect(() => {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 3000)
    fetch('https://ipapi.co/json/', { signal: controller.signal })
      .then(r => r.json())
      .then(data => {
        const cfg = STATE_CONFIGS[data.region_code]
        if (cfg) setGeoState(cfg)
      })
      .catch(() => {})
      .finally(() => clearTimeout(timeout))
  }, [])

  return (
    <div style={{ fontFamily: T.font, color: T.text, background: '#fff', WebkitFontSmoothing: 'antialiased' }}>
      <style>{PAGE_CSS}</style>
      <Nav geoState={geoState} />
      <Hero geoState={geoState} />
      <StatsBand />
      <DemoSection />
      <HowItWorks />
      <WhatGetsFlagged />
      <Pricing />
      <FaqAndScoring />
      <FinalCTA />
      <Footer geoState={geoState} />
    </div>
  )
}

// ─── Nav ─────────────────────────────────────────────────────────────────────
function Nav({ geoState }) {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', h)
    return () => window.removeEventListener('scroll', h)
  }, [])

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      height: 72,
      background: scrolled ? 'rgba(255,255,255,0.96)' : 'rgba(255,255,255,0.92)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      borderBottom: `1px solid ${scrolled ? T.border : 'transparent'}`,
      transition: 'background 0.2s, border-color 0.2s',
    }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 32px', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
          <Link to="/" style={{ textDecoration: 'none' }}><Logo size={24} tagline /></Link>
          <div className="lp-nav-links" style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <a href="#how-it-works" className="lp-nav-link">How it works</a>
            <a href="#flags" className="lp-nav-link">What gets flagged</a>
            <a href="#pricing" className="lp-nav-link">Pricing</a>
            {geoState !== DEFAULT_STATE && (
              <span style={{ fontSize: 13, fontWeight: 600, color: T.navy, background: T.navyLight, border: `1px solid ${T.navyBorder}`, borderRadius: 99, padding: '4px 12px' }}>
                {geoState.statePill}
              </span>
            )}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <Link to="/sign-in" style={{ fontFamily: T.font, fontSize: 15, fontWeight: 500, color: T.muted, padding: '9px 16px', borderRadius: 9, textDecoration: 'none', transition: 'color 0.15s' }}>
            Sign in
          </Link>
          <Link to="/inspect" style={{
            fontFamily: T.font, display: 'inline-flex', alignItems: 'center',
            background: T.navy, color: '#fff',
            fontSize: 15, fontWeight: 700,
            padding: '9px 20px', borderRadius: 9,
            textDecoration: 'none',
            boxShadow: '0 2px 8px rgba(4,37,108,0.25)',
          }}>
            Try free
          </Link>
        </div>
      </div>
    </nav>
  )
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
function Hero({ geoState }) {
  return (
    <section style={{ paddingTop: 64 }}>
      <div className="lp-hero" style={{ padding: '140px 32px 96px', maxWidth: 1100, margin: '0 auto', textAlign: 'center' }}>

        <h1 className="lp-h1" style={{
          fontSize: 62, fontWeight: 800,
          color: T.navy2, letterSpacing: '-0.035em',
          lineHeight: 1.06, marginBottom: 22,
          margin: '0 0 22px',
        }}>
          Know if a policy will bind<br />
          <em style={{ fontStyle: 'normal', color: T.navy }}>before you waste time quoting.</em>
        </h1>

        <p style={{ fontSize: 19, fontWeight: 400, color: T.muted, lineHeight: 1.65, maxWidth: 520, margin: '0 auto 36px' }}>
          Upload a property inspection report. Get a BindIQ Score in seconds — with every underwriting red flag surfaced before you quote.
        </p>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 16 }}>
          <Link to="/inspect" style={{
            fontFamily: T.font, display: 'inline-flex', alignItems: 'center',
            background: T.navy, color: '#fff',
            fontSize: 15, fontWeight: 700,
            padding: '14px 32px', borderRadius: 10,
            textDecoration: 'none',
            boxShadow: '0 3px 12px rgba(4,37,108,0.28)',
          }}>
            Try BindIQ free →
          </Link>
          <Link to="/inspect?mode=sample" style={{
            fontFamily: T.font, display: 'inline-flex', alignItems: 'center',
            background: '#fff', color: T.text,
            fontSize: 15, fontWeight: 600,
            padding: '13px 24px', borderRadius: 10,
            textDecoration: 'none',
            border: `1.5px solid ${T.border}`,
          }}>
            See a demo →
          </Link>
        </div>

        <div style={{ fontSize: 15, color: T.subtle, marginBottom: 72, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
          <span>No account needed</span>
          <span style={{ width: 3, height: 3, borderRadius: '50%', background: T.border2 }} />
          <span>3 free reports</span>
          <span style={{ width: 3, height: 3, borderRadius: '50%', background: T.border2 }} />
          <span>{geoState.trustLine}</span>
        </div>

        {/* Score card cluster */}
        <div className="hero-card-cluster" style={{ maxWidth: 860, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, textAlign: 'left' }}>

          {/* Green */}
          <div style={{ borderRadius: 16, padding: '28px 24px', background: 'rgba(16,185,129,0.06)', border: '1.5px solid rgba(16,185,129,0.22)' }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: T.greenDark, letterSpacing: '0.09em', textTransform: 'uppercase', marginBottom: 12 }}>BindIQ Score</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 5, marginBottom: 14 }}>
              <span style={{ fontSize: 60, fontWeight: 800, color: T.greenDark, letterSpacing: '-3px', lineHeight: 1 }}>87</span>
              <span style={{ fontSize: 17, fontWeight: 500, color: T.green, opacity: 0.5 }}>/100</span>
            </div>
            <div style={{ height: 6, background: 'rgba(16,185,129,0.15)', borderRadius: 99, overflow: 'hidden', marginBottom: 14 }}>
              <div style={{ height: '100%', width: '87%', background: T.green, borderRadius: 99 }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 12 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: T.green, flexShrink: 0 }} />
              <span style={{ fontSize: 14, fontWeight: 700, color: T.greenDark }}>Likely to Bind</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <div style={{ fontSize: 13, color: '#047857', lineHeight: 1.5 }}>· Impact-resistant glazing</div>
              <div style={{ fontSize: 13, color: '#047857', lineHeight: 1.5 }}>· Double wraps roof-to-wall</div>
              <div style={{ fontSize: 13, color: '#047857', lineHeight: 1.5 }}>· Modern electrical panel</div>
            </div>
          </div>

          {/* Amber */}
          <div style={{ borderRadius: 16, padding: '28px 24px', background: 'rgba(245,158,11,0.06)', border: '1.5px solid rgba(245,158,11,0.25)' }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#92400E', letterSpacing: '0.09em', textTransform: 'uppercase', marginBottom: 12 }}>BindIQ Score</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 5, marginBottom: 14 }}>
              <span style={{ fontSize: 60, fontWeight: 800, color: '#92400E', letterSpacing: '-3px', lineHeight: 1 }}>54</span>
              <span style={{ fontSize: 17, fontWeight: 500, color: T.amber, opacity: 0.5 }}>/100</span>
            </div>
            <div style={{ height: 6, background: 'rgba(245,158,11,0.15)', borderRadius: 99, overflow: 'hidden', marginBottom: 14 }}>
              <div style={{ height: '100%', width: '54%', background: T.amber, borderRadius: 99 }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 12 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: T.amber, flexShrink: 0 }} />
              <span style={{ fontSize: 14, fontWeight: 700, color: '#92400E' }}>Conditional Risk</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <div style={{ fontSize: 13, color: '#B45309', lineHeight: 1.5 }}>· Galvanized supply lines</div>
              <div style={{ fontSize: 13, color: '#B45309', lineHeight: 1.5 }}>· HVAC system 18 years old</div>
              <div style={{ fontSize: 13, color: '#B45309', lineHeight: 1.5 }}>· Gable geometry detected</div>
            </div>
          </div>

          {/* Red */}
          <div style={{ borderRadius: 16, padding: '28px 24px', background: 'rgba(239,68,68,0.06)', border: '1.5px solid rgba(239,68,68,0.22)' }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#991B1B', letterSpacing: '0.09em', textTransform: 'uppercase', marginBottom: 12 }}>BindIQ Score</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 5, marginBottom: 14 }}>
              <span style={{ fontSize: 60, fontWeight: 800, color: '#991B1B', letterSpacing: '-3px', lineHeight: 1 }}>25</span>
              <span style={{ fontSize: 17, fontWeight: 500, color: '#EF4444', opacity: 0.5 }}>/100</span>
            </div>
            <div style={{ height: 6, background: 'rgba(239,68,68,0.15)', borderRadius: 99, overflow: 'hidden', marginBottom: 14 }}>
              <div style={{ height: '100%', width: '25%', background: '#EF4444', borderRadius: 99 }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 12 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#EF4444', flexShrink: 0 }} />
              <span style={{ fontSize: 14, fontWeight: 700, color: '#991B1B' }}>Likely Decline</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <div style={{ fontSize: 13, color: '#B91C1C', lineHeight: 1.5 }}>⚠ Federal Pacific panel</div>
              <div style={{ fontSize: 13, color: '#B91C1C', lineHeight: 1.5 }}>⚠ Roof over 25 years</div>
              <div style={{ fontSize: 13, color: '#B91C1C', lineHeight: 1.5 }}>⚠ Polybutylene plumbing</div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}

// ─── Demo Section ─────────────────────────────────────────────────────────────
function DemoSection() {
  return (
    <section style={{ background: '#fff', padding: '80px 32px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div className="demo-section-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }}>
          {/* Left: copy */}
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: T.navy, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>
              See it in action
            </div>
            <h2 className="lp-h2" style={{ fontSize: 38, fontWeight: 800, color: T.navy2, letterSpacing: '-0.025em', lineHeight: 1.15, marginBottom: 20 }}>
              From upload to score<br />in under 60 seconds
            </h2>
            <p style={{ fontSize: 17, color: T.muted, lineHeight: 1.65, marginBottom: 32, maxWidth: 420 }}>
              Upload any 4-point or wind mitigation PDF. BindIQ extracts every underwriting field and returns a 0–100 bind likelihood score — with every red flag surfaced before you call the carrier.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { icon: '🟢', text: 'Score 87 — impact glass confirmed, double wraps on roof-to-wall. Clean bind.' },
                { icon: '🔴', text: 'Score 25 — Federal Pacific panel, aluminum wiring, 28-year roof. Decline before you waste a quote.' },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  <span style={{ fontSize: 16, marginTop: 1 }}>{item.icon}</span>
                  <span style={{ fontSize: 14, color: T.muted, lineHeight: 1.6 }}>{item.text}</span>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 32 }}>
              <Link to="/inspect" style={{
                fontFamily: T.font, display: 'inline-flex', alignItems: 'center', gap: 8,
                background: T.navy, color: '#fff',
                fontSize: 15, fontWeight: 700,
                padding: '12px 24px', borderRadius: 10,
                textDecoration: 'none',
                boxShadow: '0 2px 8px rgba(4,37,108,0.25)',
              }}>
                Try it free →
              </Link>
            </div>
          </div>
          {/* Right: animation */}
          <div>
            <DemoAnimation />
          </div>
        </div>
      </div>
      <style>{`
        @media (max-width: 900px) {
          .demo-section-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  )
}

// ─── Stats Band ───────────────────────────────────────────────────────────────
function StatsBand() {
  return (
    <div style={{ borderTop: `1px solid ${T.border}`, borderBottom: `1px solid ${T.border}`, background: T.surface, padding: '20px 32px' }}>
      <div className="stats-band-inner" style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 48 }}>
        {[
          { val: '87%', label: 'of critical issues caught first' },
          null,
          { val: '< 60s', label: 'from upload to score' },
          null,
          { val: '4-pt + Wind', label: 'Florida inspection forms' },
          null,
          { val: '100+', label: 'Florida agents using BindIQ' },
        ].map((item, i) =>
          item === null
            ? <div key={i} style={{ width: 1, height: 32, background: T.border }} />
            : (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                <span style={{ fontSize: 24, fontWeight: 800, color: T.navy2, letterSpacing: '-0.03em' }}>{item.val}</span>
                <span style={{ fontSize: 13, color: T.subtle }}>{item.label}</span>
              </div>
            )
        )}
      </div>
    </div>
  )
}

// ─── How it works ─────────────────────────────────────────────────────────────
function HowItWorks() {
  const steps = [
    { num: '01', title: 'Upload Report', body: "Upload any Florida 4-point or wind mitigation report PDF. Works with any inspection company's format — no reformatting required." },
    { num: '02', title: 'Automatic Extraction', body: 'Every underwriting-critical field is extracted automatically. Roof, electrical, plumbing, HVAC — all structured in one place.' },
    { num: '03', title: 'BindIQ Score', body: 'Every report gets a 0–100 BindIQ Score with clear risk explanations. Know exactly what moved the score and what it means for placement.' },
  ]
  return (
    <section id="how-it-works" style={{ padding: '96px 32px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ maxWidth: 560, marginBottom: 56 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: T.navy, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12 }}>How it works</div>
          <h2 className="lp-h2" style={{ fontSize: 40, fontWeight: 800, color: T.navy2, letterSpacing: '-0.03em', lineHeight: 1.1, margin: '0 0 16px' }}>
            From inspection report<br />to decision in seconds
          </h2>
          <p style={{ fontSize: 17, color: T.muted, lineHeight: 1.7, margin: 0 }}>Three steps. Under a minute. No training required.</p>
        </div>

        <div className="lp-steps-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20 }}>
          {steps.map(s => (
            <div key={s.num} style={{ padding: 28, border: `1.5px solid ${T.border}`, borderRadius: 16, background: '#fff' }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: T.navyLight, border: `1px solid ${T.navyBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                <span style={{ fontSize: 13, fontWeight: 800, color: T.navy }}>{s.num}</span>
              </div>
              <div style={{ fontSize: 18, fontWeight: 700, color: T.text, marginBottom: 10 }}>{s.title}</div>
              <div style={{ fontSize: 14, color: T.muted, lineHeight: 1.7 }}>{s.body}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── What gets flagged ────────────────────────────────────────────────────────
function WhatGetsFlagged() {
  const flags = [
    {
      sev: 'critical', icon: '⚡', title: 'Federal Pacific / Zinsco panels', badge: 'Likely decline',
      body: 'Most FL carriers will not bind on either panel brand. Both are known fire hazards — virtually every standard market requires replacement before quoting.',
    },
    {
      sev: 'critical', icon: '⚡', title: 'Aluminum branch wiring', badge: 'High risk',
      body: 'Aluminum wiring on branch circuits creates fire risk at connections. Requires remediation documentation before most carriers will write.',
    },
    {
      sev: 'critical', icon: '🔌', title: 'Knob-and-tube wiring', badge: 'Almost always uninsurable',
      body: 'Uninsurable with virtually all standard FL carriers. Catching this before the quote prevents a wasted submission entirely.',
    },
    {
      sev: 'warning', icon: '🔧', title: 'Polybutylene plumbing', badge: 'Carrier restrictions',
      body: 'Many FL carriers exclude water damage or require replacement. Catching this before submission prevents the client call no one wants to make.',
    },
    {
      sev: 'warning', icon: '🏠', title: 'Roof age and condition issues', badge: 'Inspection trigger',
      body: 'Most FL carriers require a roof inspection or condition letter for roofs over 20–25 years. Age and condition are flagged automatically.',
    },
  ]

  return (
    <section id="flags" style={{ padding: '96px 32px', background: T.surface, borderTop: `1px solid ${T.border}`, borderBottom: `1px solid ${T.border}` }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ maxWidth: 560, marginBottom: 48 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: T.navy, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12 }}>What gets flagged</div>
          <h2 className="lp-h2" style={{ fontSize: 40, fontWeight: 800, color: T.navy2, letterSpacing: '-0.03em', lineHeight: 1.1, margin: '0 0 16px' }}>
            Know what carriers will reject<br />before you quote
          </h2>
          <p style={{ fontSize: 17, color: T.muted, lineHeight: 1.7, margin: 0 }}>These are the same issues that kill deals at underwriting. BindIQ catches every one of them — automatically.</p>
        </div>

        <div className="lp-flags-list" style={{ display: 'flex', flexDirection: 'column', gap: 10, maxWidth: 800 }}>
          {flags.map(f => (
            <div key={f.title} style={{
              padding: '20px 24px', borderRadius: 14, display: 'flex', alignItems: 'flex-start', gap: 16,
              background: f.sev === 'critical' ? 'rgba(239,68,68,0.05)' : 'rgba(245,158,11,0.05)',
              border: `1px solid ${f.sev === 'critical' ? 'rgba(239,68,68,0.18)' : 'rgba(245,158,11,0.20)'}`,
            }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: f.sev === 'critical' ? 'rgba(239,68,68,0.10)' : 'rgba(245,158,11,0.10)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 15 }}>
                {f.icon}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 5, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 15, fontWeight: 700, color: f.sev === 'critical' ? '#991B1B' : '#92400E' }}>{f.title}</span>
                  <span style={{
                    display: 'inline-flex', alignItems: 'center',
                    fontSize: 13, fontWeight: 700,
                    padding: '3px 9px', borderRadius: 99,
                    background: f.sev === 'critical' ? 'rgba(239,68,68,0.10)' : 'rgba(245,158,11,0.10)',
                    color: f.sev === 'critical' ? '#991B1B' : '#92400E',
                  }}>
                    {f.badge}
                  </span>
                </div>
                <p style={{ fontSize: 13, color: f.sev === 'critical' ? '#B91C1C' : '#B45309', lineHeight: 1.65, margin: 0 }}>{f.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Pricing ──────────────────────────────────────────────────────────────────
function Pricing() {
  const [annual, setAnnual] = useState(false)
  const planList = Object.values(PLANS)

  return (
    <section id="pricing" style={{ padding: '96px 32px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: T.navy, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12 }}>Pricing</div>
          <h2 className="lp-h2" style={{ fontSize: 40, fontWeight: 800, color: T.navy2, letterSpacing: '-0.03em', lineHeight: 1.1, margin: '0 0 16px' }}>
            Simple, predictable pricing
          </h2>
          <p style={{ fontSize: 17, color: T.muted, lineHeight: 1.7, maxWidth: 520, margin: '0 auto 28px' }}>
            No per-report charges. No friction. Just fast underwriting decisions.
          </p>

          {/* Billing toggle */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 0, background: T.surface, border: `1px solid ${T.border}`, borderRadius: 99, padding: '5px 6px' }}>
            <button
              onClick={() => setAnnual(false)}
              style={{ fontFamily: T.font, fontSize: 14, fontWeight: annual ? 600 : 700, padding: '8px 20px', borderRadius: 99, border: 'none', background: annual ? 'transparent' : T.navy, color: annual ? T.muted : '#fff', cursor: 'pointer', transition: 'all 0.2s' }}
            >
              Monthly
            </button>
            <button
              onClick={() => setAnnual(true)}
              style={{ fontFamily: T.font, fontSize: 14, fontWeight: annual ? 700 : 600, padding: '8px 20px', borderRadius: 99, border: 'none', background: annual ? T.navy : 'transparent', color: annual ? '#fff' : T.muted, cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: 6 }}
            >
              Annual
              {!annual && <span style={{ fontSize: 13, fontWeight: 700, color: T.greenDark, background: 'rgba(16,185,129,0.12)', borderRadius: 99, padding: '2px 8px' }}>Save 15%</span>}
            </button>
          </div>
        </div>

        <div className="lp-plans-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20, maxWidth: 900, margin: '0 auto' }}>
          {planList.map(plan => {
            const price = annual ? plan.annual : plan.monthly
            const isFeatured = plan.popular
            return (
              <div key={plan.key} style={{
                background: '#fff', borderRadius: 18,
                border: `1.5px solid ${isFeatured ? T.navy : T.border}`,
                padding: '32px 28px',
                position: 'relative',
                boxShadow: isFeatured ? '0 8px 40px rgba(4,37,108,0.12)' : '0 2px 8px rgba(15,31,61,0.04)',
                display: 'flex', flexDirection: 'column',
              }}>
                {isFeatured && (
                  <div style={{
                    position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)',
                    background: T.navy, color: '#fff',
                    fontSize: 13, fontWeight: 700,
                    padding: '3px 14px', borderRadius: 99, letterSpacing: '0.06em', whiteSpace: 'nowrap',
                  }}>
                    MOST POPULAR
                  </div>
                )}
                <div style={{ fontSize: 13, fontWeight: 700, color: isFeatured ? T.navy : T.muted, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8 }}>{plan.name}</div>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, marginBottom: 4 }}>
                  <span style={{ fontSize: 38, fontWeight: 800, color: T.text, letterSpacing: '-0.025em', lineHeight: 1 }}>${price}</span>
                  <span style={{ fontSize: 13, color: T.muted, paddingBottom: 5 }}>/mo</span>
                </div>
                {annual
                  ? <div style={{ fontSize: 11, fontWeight: 700, color: T.greenDark, marginBottom: 4 }}>${plan.annualTotal}/yr · save 15%</div>
                  : <div style={{ fontSize: 11, color: T.subtle, marginBottom: 4 }}>billed monthly</div>
                }
                <div style={{ fontSize: 13, color: T.subtle, marginBottom: 24 }}>Up to {plan.reportLimit} reports/month</div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 9, marginBottom: 28, flex: 1 }}>
                  {plan.features.map(f => (
                    <div key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 13, color: T.muted }}>
                      <span style={{ color: T.green, flexShrink: 0, marginTop: 1 }}>✓</span>
                      {f}
                    </div>
                  ))}
                </div>

                <Link
                  to={`/checkout?plan=${plan.key}&billing=${annual ? 'annual' : 'monthly'}`}
                  style={{
                    fontFamily: T.font, display: 'block', textAlign: 'center', textDecoration: 'none',
                    padding: '11px 16px', borderRadius: 10, fontSize: 14, fontWeight: 700,
                    background: isFeatured ? T.navy : '#fff',
                    color: isFeatured ? '#fff' : T.text,
                    border: isFeatured ? 'none' : `1.5px solid ${T.border}`,
                    boxShadow: isFeatured ? '0 4px 14px rgba(4,37,108,0.22)' : 'none',
                  }}
                >
                  Get started →
                </Link>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// ─── FAQ + Scoring grid ───────────────────────────────────────────────────────
function FaqAndScoring() {
  const scoreRows = [
    { label: 'Federal Pacific / Zinsco panel', pts: '−60 · cap at 40', type: 'critical' },
    { label: 'Knob-and-tube wiring',           pts: '−60 · cap at 40', type: 'critical' },
    { label: 'Aluminum branch wiring',         pts: '−50 · cap at 40', type: 'critical' },
    { label: 'Roof in poor condition',         pts: '−35',             type: 'warning' },
    { label: 'Polybutylene plumbing',          pts: '−30',             type: 'warning' },
    { label: 'Roof over 25 years',             pts: '−25',             type: 'warning' },
    { label: 'Impact / hurricane protection',  pts: '+10',             type: 'positive' },
  ]

  const faqItems = [
    ['Does it work with any inspection PDF?', 'Yes — BindIQ works with standard 4-point and wind mitigation reports from most inspection companies. If the PDF contains selectable text, it processes instantly. Scanned PDFs are also supported.'],
    ['How accurate is it?', 'Highly accurate for standard inspection formats. Critical risk indicators are detected using a rules engine built on real carrier underwriting guidelines — not guesswork.'],
    ['Is client data stored?', 'No. Reports are processed securely and discarded after extraction. No inspection content is retained on our servers.'],
    ['What states are supported?', 'Currently optimized for Florida inspection forms. Additional states are being added — sign up to be notified when your state launches.'],
    ['Can I cancel anytime?', 'Yes. No contracts, no commitments. Cancel any time from your billing dashboard with one click.'],
  ]

  return (
    <section style={{ padding: '96px 32px', background: T.surface, borderTop: `1px solid ${T.border}` }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div className="lp-faq-scoring-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'start' }}>

          {/* Left: Scoring methodology */}
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: T.navy, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12 }}>How the score works</div>
            <h2 className="lp-h2" style={{ fontSize: 40, fontWeight: 800, color: T.navy2, letterSpacing: '-0.03em', lineHeight: 1.1, margin: '0 0 16px' }}>
              One number.<br />Clear reasoning.
            </h2>
            <p style={{ fontSize: 17, color: T.muted, lineHeight: 1.7, margin: '0 0 32px', maxWidth: 520 }}>
              Every report starts at 100. Risk factors subtract points. Any critical issue automatically caps the score at 40 — the Likely Decline zone.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {scoreRows.map(row => (
                <div key={row.label} style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 12, padding: '10px 14px', background: '#fff', border: `1px solid ${T.border}`, borderRadius: 10, alignItems: 'center' }}>
                  <span style={{ fontSize: 14, color: T.text }}>{row.label}</span>
                  <span style={{
                    fontSize: 13, fontWeight: 700, padding: '3px 10px', borderRadius: 99, whiteSpace: 'nowrap',
                    background: row.type === 'critical' ? 'rgba(239,68,68,0.08)' : row.type === 'positive' ? 'rgba(16,185,129,0.08)' : 'rgba(245,158,11,0.08)',
                    color: row.type === 'critical' ? '#991B1B' : row.type === 'positive' ? T.greenDark : '#92400E',
                  }}>
                    {row.pts}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: FAQ */}
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: T.navy, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12 }}>FAQ</div>
            <h2 className="lp-h2" style={{ fontSize: 40, fontWeight: 800, color: T.navy2, letterSpacing: '-0.03em', lineHeight: 1.1, margin: '0 0 8px' }}>
              Common questions
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2, marginTop: 8 }}>
              {faqItems.map(([q, a]) => (
                <details key={q} className="lp-faq-item" style={{ background: '#fff', border: `1px solid ${T.border}`, borderRadius: 12, overflow: 'hidden', marginBottom: 2 }}>
                  <summary style={{ padding: '18px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                    <span style={{ fontSize: 15, fontWeight: 600, color: T.text }}>{q}</span>
                    <span className="faq-icon" style={{ fontSize: 20, color: T.subtle, flexShrink: 0, lineHeight: 1, transition: 'transform 0.2s' }}>+</span>
                  </summary>
                  <div style={{ fontSize: 14, color: T.muted, lineHeight: 1.7, padding: '0 20px 18px' }}>{a}</div>
                </details>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}

// ─── Final CTA ────────────────────────────────────────────────────────────────
function FinalCTA() {
  return (
    <section style={{ padding: '80px 32px', background: T.navy2, textAlign: 'center' }}>
      <div style={{ maxWidth: 480, margin: '0 auto' }}>
        <h2 style={{ fontSize: 38, fontWeight: 800, color: '#fff', letterSpacing: '-0.03em', margin: '0 0 16px', lineHeight: 1.1 }}>
          Know before you quote.
        </h2>
        <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.6)', lineHeight: 1.7, margin: '0 0 32px' }}>
          Stop wasting time on risks that won't bind.
        </p>
        <Link to="/inspect" style={{
          fontFamily: T.font, display: 'inline-block',
          background: '#fff', color: T.navy2,
          fontSize: 15, fontWeight: 700,
          padding: '14px 36px', borderRadius: 10,
          textDecoration: 'none',
        }}>
          Try BindIQ free — no account needed
        </Link>
      </div>
    </section>
  )
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer({ geoState }) {
  const linkStyle = { fontSize: 13, color: T.muted, textDecoration: 'none' }

  return (
    <footer style={{ borderTop: `1px solid ${T.border}`, padding: '56px 32px 36px', background: '#fff' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>

        <div className="lp-footer-grid" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 48, marginBottom: 48 }}>

          {/* Brand */}
          <div>
            <div style={{ marginBottom: 14 }}><Logo size={22} /></div>
            <p style={{ fontSize: 13, color: T.muted, lineHeight: 1.65, maxWidth: 240, margin: '0 0 20px' }}>
              Know if a policy will bind before you quote. Built for Florida insurance agents.
            </p>
            <div style={{ fontSize: 13, color: T.subtle }}>usebindiq.com</div>
          </div>

          {/* Product */}
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: T.text, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 14 }}>Product</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <a href="#how-it-works" style={linkStyle}>How it works</a>
              <a href="#flags" style={linkStyle}>What gets flagged</a>
              <a href="#pricing" style={linkStyle}>Pricing</a>
            </div>
          </div>

          {/* Account */}
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: T.text, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 14 }}>Account</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <Link to="/sign-in" style={linkStyle}>Sign in</Link>
              <Link to="/sign-up" style={linkStyle}>Create account</Link>
            </div>
          </div>

          {/* Legal */}
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: T.text, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 14 }}>Legal</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <Link to="/privacy" style={linkStyle}>Privacy</Link>
              <Link to="/terms" style={linkStyle}>Terms</Link>
              <Link to="/security" style={linkStyle}>Security</Link>
            </div>
          </div>

        </div>

        <div style={{ borderTop: `1px solid ${T.border}`, paddingTop: 28, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 13, color: T.subtle }}>© 2026 BindIQ. All rights reserved.</span>
          <span style={{ fontSize: 13, color: T.subtle }}>{geoState.footerText}</span>
        </div>

      </div>
    </footer>
  )
}
