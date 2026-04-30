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
  accent:       '#04256C',
  accentBg:     'rgba(4,37,108,0.07)',
  accentBorder: 'rgba(4,37,108,0.18)',
  positive:     '#10B981',
  positiveBg:   'rgba(16,185,129,0.08)',
  positiveBorder:'rgba(16,185,129,0.25)',
  amber:        '#F59E0B',
  amberBg:      'rgba(245,158,11,0.07)',
  amberBorder:  'rgba(245,158,11,0.25)',
  danger:       '#EF4444',
  dangerBg:     'rgba(239,68,68,0.07)',
  dangerBorder: 'rgba(239,68,68,0.22)',
  navy:         '#0F1F3D',
}

const MAX = 1100

const PAGE_CSS = `
  html { scroll-behavior: smooth; }
  html, body { background: ${C.bg}; }
  * { box-sizing: border-box; }
  ::selection { background: rgba(4,37,108,0.10); }
  section[id] { scroll-margin-top: 80px; }

  .lp-nav { background: rgba(255,255,255,0.8); border-bottom: 1px solid transparent; transition: background 0.2s, border-color 0.2s; }
  .lp-nav.scrolled { background: rgba(255,255,255,0.96); border-bottom-color: ${C.border}; backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); }
  .lp-nav-link { padding: 6px 12px; border-radius: 7px; color: ${C.textMuted}; text-decoration: none; font-size: 14px; font-weight: 500; transition: background 0.15s, color 0.15s; }
  .lp-nav-link:hover { background: ${C.bgAlt}; color: ${C.text}; }

  .lp-cta-primary { background: ${C.accent}; color: #fff; border: none; border-radius: 10px; font-size: 15px; font-weight: 700; padding: 14px 28px; cursor: pointer; text-decoration: none; display: inline-flex; align-items: center; box-shadow: 0 4px 16px rgba(4,37,108,0.35); transition: box-shadow 0.15s, opacity 0.15s; }
  .lp-cta-primary:hover { opacity: 0.92; box-shadow: 0 6px 24px rgba(4,37,108,0.45); }
  .lp-cta-ghost { background: ${C.bg}; color: ${C.text}; border: 1.5px solid ${C.border}; border-radius: 10px; font-size: 15px; font-weight: 600; padding: 13px 24px; cursor: pointer; text-decoration: none; display: inline-flex; align-items: center; transition: border-color 0.15s; }
  .lp-cta-ghost:hover { border-color: ${C.borderMid}; }

  .lp-section-pad { padding: 96px 24px; }
  .lp-h1 { font-size: 56px; line-height: 1.07; letter-spacing: -0.03em; }
  .lp-h2 { font-size: 38px; line-height: 1.12; letter-spacing: -0.025em; }

  .lp-flag-critical { background: ${C.dangerBg}; border: 1px solid ${C.dangerBorder}; border-radius: 12px; padding: 18px 20px; }
  .lp-flag-warning  { background: ${C.amberBg};  border: 1px solid ${C.amberBorder};  border-radius: 12px; padding: 18px 20px; }

  .lp-step-card { background: ${C.bg}; border: 1.5px solid ${C.border}; border-radius: 16px; padding: 28px; flex: 1; }

  .lp-faq summary { list-style: none; cursor: pointer; }
  .lp-faq summary::-webkit-details-marker { display: none; }
  .lp-faq[open] .lp-faq-icon { transform: rotate(45deg); }

  @media (max-width: 900px) {
    .lp-hero-grid { grid-template-columns: 1fr !important; }
    .lp-hero-right { display: none !important; }
    .lp-steps-grid { flex-direction: column !important; }
    .lp-flags-grid { grid-template-columns: 1fr !important; }
    .lp-three-grid { grid-template-columns: 1fr !important; }
    .lp-extract-grid { grid-template-columns: 1fr !important; }
    .lp-plans-grid { grid-template-columns: 1fr !important; }
    .lp-footer-grid { grid-template-columns: 1fr 1fr !important; gap: 32px !important; }
    .lp-h1 { font-size: 38px !important; }
    .lp-h2 { font-size: 28px !important; }
    .lp-section-pad { padding: 72px 24px !important; }
  }
  @media (max-width: 640px) {
    .lp-h1 { font-size: 32px !important; }
    .lp-h2 { font-size: 24px !important; }
    .lp-section-pad { padding: 56px 20px !important; }
    .lp-nav-links { display: none !important; }
    .score-calc-grid { grid-template-columns: 1fr !important; }
    .lp-footer-grid { grid-template-columns: 1fr !important; }
  }
`

export default function LandingPage() {
  return (
    <div style={{ ...F.sans, color: C.text, background: C.bg, WebkitFontSmoothing: 'antialiased' }}>
      <style>{PAGE_CSS}</style>
      <Banner />
      <Nav />
      <Hero />
      <CoreValue />
      <HowItWorks />
      <AsyncWorkflow />
      <BindIQScoreSection />
      <WhatGetsFlagged />
      <WhatGetsExtracted />
      <Pricing />
      <ROI />
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
      <span style={{ opacity: 0.8 }}>Founding agent pricing — </span>
      <strong>$79/mo locked for the first 100 agencies.</strong>
      <Link to="/sign-up" style={{ marginLeft: 16, fontSize: 12, fontWeight: 700, color: C.accent, background: '#fff', padding: '3px 12px', borderRadius: 20, textDecoration: 'none', whiteSpace: 'nowrap' }}>
        Claim your spot →
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
    <section style={{ paddingTop: 164, paddingBottom: 72, background: 'linear-gradient(180deg, #EEF2FF 0%, #fff 72%)' }}>
      <div style={{ maxWidth: MAX, margin: '0 auto', padding: '0 24px' }}>
        <div className="lp-hero-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 460px', gap: 72, alignItems: 'center' }}>

          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: C.accentBg, border: `1px solid ${C.accentBorder}`, borderRadius: 20, padding: '5px 14px 5px 8px', marginBottom: 22 }}>
              <span style={{ width: 18, height: 18, borderRadius: '50%', background: C.accent, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="9" height="9" viewBox="0 0 9 9" fill="none"><path d="M1.5 4.5h6M4.5 1.5v6" stroke="#fff" strokeWidth="1.5" strokeLinecap="round"/></svg>
              </span>
              <span style={{ ...F.sans, fontSize: 13, fontWeight: 600, color: C.accent }}>For Florida independent insurance agents</span>
            </div>

            <h1 className="lp-h1" style={{ ...F.sans, fontWeight: 800, color: C.text, margin: 0, marginBottom: 20 }}>
              Know if a policy will bind —<br />
              <span style={{ color: C.accent }}>before you waste time quoting it.</span>
            </h1>

            <p style={{ ...F.sans, fontSize: 17, color: C.textMuted, lineHeight: 1.65, marginBottom: 32, maxWidth: 500 }}>
              Stop quoting risks that won't bind. Get a clear underwriting decision and move from inquiry to quote faster.
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 36, flexWrap: 'wrap' }}>
              <Link to="/inspect" className="lp-cta-primary" style={F.sans}>
                Try BindIQ free — no account needed
              </Link>
              <button onClick={() => document.getElementById('how')?.scrollIntoView({ behavior: 'smooth', block: 'start' })} className="lp-cta-ghost" style={F.sans}>
                See how it works
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 20px' }}>
              {[
                'Avoid dead-end quotes',
                'See declination risks before you submit',
                'Get complete submissions upfront',
                'No more back-and-forth with clients',
                'Move from inquiry to quote faster',
                'Fewer calls. Less waiting. Faster decisions.',
              ].map(t => (
                <span key={t} style={{ ...F.sans, fontSize: 14, color: C.textMuted, display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, marginTop: 2 }}>
                    <circle cx="8" cy="8" r="7" fill={C.accentBg} />
                    <path d="M5 8l2 2 4-4" stroke={C.accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Product snapshot mockup */}
          <div className="lp-hero-right">
            <ProductSnapshotMockup />
          </div>
        </div>
      </div>
    </section>
  )
}

function ProductSnapshotMockup() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>

      {/* Decline card */}
      <div style={{ background: C.dangerBg, border: `1.5px solid ${C.dangerBorder}`, borderRadius: 14, padding: '20px 22px', boxShadow: '0 8px 32px rgba(15,31,61,0.08)' }}>
        <div style={{ ...F.sans, fontSize: 10, fontWeight: 700, color: '#991B1B', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>BindIQ Score</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 12 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 4 }}>
              <span style={{ ...F.sans, fontSize: 52, fontWeight: 800, color: '#991B1B', lineHeight: 1, letterSpacing: '-0.03em' }}>25</span>
              <span style={{ ...F.sans, fontSize: 14, color: '#991B1B', opacity: 0.45, fontWeight: 600 }}>/100</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
              <span style={{ fontSize: 15 }}>🔴</span>
              <span style={{ ...F.sans, fontSize: 15, fontWeight: 800, color: '#991B1B' }}>Likely Decline</span>
            </div>
            <div style={{ height: 6, background: 'rgba(0,0,0,0.07)', borderRadius: 3, overflow: 'hidden', width: 200 }}>
              <div style={{ height: '100%', width: '25%', background: '#EF4444', borderRadius: 3 }} />
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          {[
            'Federal Pacific panel detected',
            'Roof exceeds 25 years',
          ].map(r => (
            <div key={r} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
              <span style={{ color: '#EF4444', fontSize: 10, marginTop: 3, flexShrink: 0 }}>●</span>
              <span style={{ ...F.sans, fontSize: 12, color: '#B91C1C', lineHeight: 1.5 }}>{r}</span>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 14, padding: '10px 12px', borderRadius: 8, background: 'rgba(255,255,255,0.55)', border: '1px solid rgba(239,68,68,0.14)' }}>
          <span style={{ ...F.sans, fontSize: 12, color: '#991B1B', lineHeight: 1.5, fontWeight: 500 }}>
            Most Florida carriers will not bind this risk without remediation.
          </span>
        </div>
      </div>

      {/* Bind card */}
      <div style={{ background: C.positiveBg, border: `1.5px solid ${C.positiveBorder}`, borderRadius: 14, padding: '18px 22px', boxShadow: '0 6px 24px rgba(15,31,61,0.06)' }}>
        <div style={{ ...F.sans, fontSize: 10, fontWeight: 700, color: '#065F46', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>BindIQ Score</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 10 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 3 }}>
            <span style={{ ...F.sans, fontSize: 40, fontWeight: 800, color: '#065F46', lineHeight: 1, letterSpacing: '-0.03em' }}>85</span>
            <span style={{ ...F.sans, fontSize: 13, color: '#065F46', opacity: 0.45, fontWeight: 600 }}>/100</span>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
              <span style={{ fontSize: 13 }}>🟢</span>
              <span style={{ ...F.sans, fontSize: 13, fontWeight: 800, color: '#065F46' }}>Likely to Bind</span>
            </div>
            <div style={{ height: 5, background: 'rgba(0,0,0,0.07)', borderRadius: 3, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: '85%', background: '#10B981', borderRadius: 3 }} />
            </div>
          </div>
        </div>
        <span style={{ ...F.sans, fontSize: 11, color: '#047857', lineHeight: 1.5 }}>· Impact-resistant opening protection · Double wraps · Modern plumbing</span>
      </div>
    </div>
  )
}

/* ─── Core Value (moved high) ─── */

function CoreValue() {
  return (
    <section style={{ background: C.navy, padding: '80px 24px' }}>
      <div style={{ maxWidth: 820, margin: '0 auto', textAlign: 'center' }}>
        <h2 className="lp-h2" style={{ ...F.sans, fontWeight: 800, color: '#fff', margin: '0 0 20px' }}>
          Stop writing quotes that will never bind.
        </h2>
        <p style={{ ...F.sans, fontSize: 17, color: 'rgba(255,255,255,0.65)', lineHeight: 1.75, margin: '0 0 36px', maxWidth: 620, marginLeft: 'auto', marginRight: 'auto' }}>
          Florida agents lose hours every week quoting properties carriers won't accept.
          BindIQ identifies underwriting issues before you submit — so you only quote risks that have a real chance of binding.
        </p>
        <Link to="/inspect" className="lp-cta-primary" style={{ ...F.sans, background: '#fff', color: C.navy, fontSize: 15, boxShadow: 'none' }}>
          Try BindIQ free — no account needed
        </Link>
      </div>
    </section>
  )
}

/* ─── How it works ─── */

function HowItWorks() {
  const steps = [
    {
      num: '01',
      title: 'Upload Report',
      body: 'Upload any Florida 4-point or wind mitigation report PDF. Works with any inspection company\'s format — no reformatting, no manual data entry.',
    },
    {
      num: '02',
      title: 'Automatic Extraction',
      body: 'BindIQ extracts every underwriting-critical field automatically. Roof material, age, and condition. Electrical panel brand and wiring type. Plumbing supply material. HVAC age and condition.',
    },
    {
      num: '03',
      title: 'BindIQ Score',
      body: 'Every report gets a 0–100 BindIQ Score with clear risk explanations. See exactly what moved the score, what it means for placement, and what to tell the client — before you pick up the phone.',
    },
  ]
  return (
    <section id="how" className="lp-section-pad">
      <div style={{ maxWidth: MAX, margin: '0 auto', padding: '0 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <div style={{ ...F.sans, fontSize: 12, fontWeight: 700, color: C.accent, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>How it works</div>
          <h2 className="lp-h2" style={{ ...F.sans, fontWeight: 800, color: C.text, margin: 0, marginBottom: 14 }}>
            From inspection report to decision in seconds
          </h2>
          <p style={{ ...F.sans, fontSize: 16, color: C.textMuted, maxWidth: 440, margin: '0 auto', lineHeight: 1.65 }}>
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

/* ─── Async / Workflow Upgrade ─── */

function AsyncWorkflow() {
  return (
    <section className="lp-section-pad" style={{ background: C.bgAlt }}>
      <div style={{ maxWidth: MAX, margin: '0 auto', padding: '0 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }} className="lp-extract-grid">

          {/* Left: copy */}
          <div>
            <div style={{ ...F.sans, fontSize: 12, fontWeight: 700, color: C.accent, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>Workflow upgrade</div>
            <h2 className="lp-h2" style={{ ...F.sans, fontWeight: 800, color: C.text, margin: '0 0 16px' }}>
              Stop chasing clients for information
            </h2>
            <p style={{ ...F.sans, fontSize: 16, color: C.textMuted, lineHeight: 1.7, margin: '0 0 28px' }}>
              Instead of calls and email chains, BindIQ gives you a faster path from inquiry to quote.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[
                { icon: '📎', title: 'Upload inspection or send a simple intake link', body: 'Agent uploads a report directly, or sends a one-click intake link to the client.' },
                { icon: '📋', title: 'Get complete property data upfront', body: 'Client fills a 3-step form. You get structured property data — no phone tag required.' },
                { icon: '✅', title: 'Know if it\'s worth quoting immediately', body: 'BindIQ scores the submission instantly. You quote with confidence or skip before wasting an hour.' },
              ].map(item => (
                <div key={item.title} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: C.accentBg, border: `1px solid ${C.accentBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 16 }}>
                    {item.icon}
                  </div>
                  <div>
                    <div style={{ ...F.sans, fontSize: 14, fontWeight: 700, color: C.text, marginBottom: 4 }}>{item.title}</div>
                    <div style={{ ...F.sans, fontSize: 13, color: C.textMuted, lineHeight: 1.6 }}>{item.body}</div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 32 }}>
              <Link to="/generate-link" style={{ ...F.sans, fontSize: 14, fontWeight: 700, color: C.accent, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6, padding: '10px 18px', border: `1.5px solid ${C.accentBorder}`, borderRadius: 9, background: C.accentBg }}>
                Generate an intake link →
              </Link>
            </div>
          </div>

          {/* Right: intake link mockup */}
          <div>
            <IntakeLinkMockup />
          </div>
        </div>
      </div>
    </section>
  )
}

function IntakeLinkMockup() {
  return (
    <div style={{ background: '#fff', border: `1.5px solid ${C.border}`, borderRadius: 16, overflow: 'hidden', boxShadow: '0 8px 32px rgba(15,31,61,0.08)' }}>
      {/* Header */}
      <div style={{ background: C.accentBg, borderBottom: `1px solid ${C.accentBorder}`, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ width: 22, height: 22, borderRadius: 5, background: C.accent, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ color: '#fff', fontWeight: 800, fontSize: 11 }}>B</span>
        </div>
        <span style={{ ...F.sans, fontSize: 12, fontWeight: 700, color: C.accent }}>BindIQ Intake Form</span>
        <span style={{ ...F.sans, fontSize: 11, color: C.textSubtle, marginLeft: 'auto' }}>Sent by Sarah Johnson</span>
      </div>

      {/* Step indicator */}
      <div style={{ padding: '14px 16px', borderBottom: `1px solid ${C.border}`, display: 'flex', gap: 8, alignItems: 'center' }}>
        {['Property basics', 'Systems', 'Inspection'].map((label, i) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6, flex: i < 2 ? 1 : 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <div style={{ width: 20, height: 20, borderRadius: 100, background: i === 0 ? C.positive : i < 3 ? C.border : C.border, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: i === 0 ? '#fff' : C.textSubtle }}>
                {i === 0 ? '✓' : i + 1}
              </div>
              <span style={{ ...F.sans, fontSize: 10, color: i === 1 ? C.text : C.textSubtle, fontWeight: i === 1 ? 600 : 400 }}>{label}</span>
            </div>
            {i < 2 && <div style={{ flex: 1, height: 1, background: i === 0 ? C.positive : C.border }} />}
          </div>
        ))}
      </div>

      {/* Form fields */}
      <div style={{ padding: '16px' }}>
        <div style={{ ...F.sans, fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 14 }}>Systems overview</div>
        {[
          { label: 'Electrical panel type', value: 'Modern circuit breaker' },
          { label: 'Plumbing supply material', value: 'Copper' },
        ].map(f => (
          <div key={f.label} style={{ marginBottom: 10 }}>
            <div style={{ ...F.sans, fontSize: 11, fontWeight: 600, color: C.textMuted, marginBottom: 4 }}>{f.label}</div>
            <div style={{ padding: '8px 10px', border: `1.5px solid ${C.border}`, borderRadius: 7, ...F.sans, fontSize: 12, color: C.text, background: C.bgAlt }}>{f.value}</div>
          </div>
        ))}
        <div style={{ marginBottom: 10 }}>
          <div style={{ ...F.sans, fontSize: 11, fontWeight: 600, color: C.textMuted, marginBottom: 4 }}>Roof condition</div>
          <div style={{ padding: '8px 10px', border: `1.5px solid ${C.positive}`, borderRadius: 7, ...F.sans, fontSize: 12, color: C.text, background: 'rgba(16,185,129,0.05)' }}>Good — no visible damage</div>
        </div>
        <button style={{ width: '100%', padding: '10px', borderRadius: 9, background: C.accent, color: '#fff', border: 'none', ...F.sans, fontSize: 13, fontWeight: 700, marginTop: 6 }}>
          Continue →
        </button>
      </div>
    </div>
  )
}

/* ─── BindIQ Score Section ─── */

function BindIQScoreSection() {
  const tiers = [
    {
      score: 85, emoji: '🟢', label: 'Likely to Bind', range: '70 – 100',
      barColor: '#10B981', bg: 'rgba(16,185,129,0.06)', border: 'rgba(16,185,129,0.22)',
      scoreColor: '#065F46',
      reasons: ['Impact-resistant opening protection', 'Strong roof-to-wall connection', 'Modern plumbing supply material'],
    },
    {
      score: 54, emoji: '🟡', label: 'Conditional Risk', range: '40 – 69',
      barColor: '#F59E0B', bg: 'rgba(245,158,11,0.06)', border: 'rgba(245,158,11,0.25)',
      scoreColor: '#92400E',
      reasons: ['Galvanized supply lines — corrosion risk', 'HVAC system is 18 years old'],
    },
    {
      score: 25, emoji: '🔴', label: 'Likely Decline', range: '0 – 39',
      barColor: '#EF4444', bg: 'rgba(239,68,68,0.06)', border: 'rgba(239,68,68,0.22)',
      scoreColor: '#991B1B',
      reasons: ['Federal Pacific panel — high underwriting rejection risk', 'Roof exceeds 25 years'],
    },
  ]

  return (
    <section id="score" className="lp-section-pad">
      <div style={{ maxWidth: MAX, margin: '0 auto', padding: '0 24px' }}>

        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <div style={{ ...F.sans, fontSize: 12, fontWeight: 700, color: C.accent, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>The BindIQ Score</div>
          <h2 className="lp-h2" style={{ ...F.sans, fontWeight: 800, color: C.text, margin: '0 0 16px' }}>
            One number. Instant decision.
          </h2>
          <p style={{ ...F.sans, fontSize: 16, color: C.textMuted, maxWidth: 560, margin: '0 auto', lineHeight: 1.7 }}>
            Every report gets scored 0–100 based on real Florida underwriting rules.
            See exactly what moved the score — and what it means for placement.
          </p>
        </div>

        {/* Tier legend */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginBottom: 40, flexWrap: 'wrap' }}>
          {[['🟢', '70–100', 'Likely to Bind'], ['🟡', '40–69', 'Conditional Risk'], ['🔴', '0–39', 'Likely Decline']].map(([emoji, range, label]) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 16 }}>{emoji}</span>
              <span style={{ ...F.sans, fontSize: 14, fontWeight: 700, color: C.text }}>{range}</span>
              <span style={{ ...F.sans, fontSize: 14, color: C.textMuted }}>→ {label}</span>
            </div>
          ))}
        </div>

        {/* Three tier cards */}
        <div className="lp-three-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, marginBottom: 48 }}>
          {tiers.map(t => (
            <div key={t.label} style={{ background: t.bg, border: `1.5px solid ${t.border}`, borderRadius: 16, padding: '28px 24px' }}>
              <div style={{ ...F.sans, fontSize: 11, fontWeight: 700, color: t.scoreColor, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 6 }}>BindIQ Score</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 3, marginBottom: 10 }}>
                <span style={{ ...F.sans, fontSize: 48, fontWeight: 800, color: t.scoreColor, lineHeight: 1, letterSpacing: '-0.03em' }}>{t.score}</span>
                <span style={{ ...F.sans, fontSize: 13, color: t.scoreColor, opacity: 0.4, fontWeight: 600 }}>/100</span>
              </div>
              <div style={{ height: 6, background: 'rgba(0,0,0,0.07)', borderRadius: 3, overflow: 'hidden', marginBottom: 12 }}>
                <div style={{ height: '100%', width: `${t.score}%`, background: t.barColor, borderRadius: 3 }} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 16 }}>
                <span style={{ fontSize: 16 }}>{t.emoji}</span>
                <span style={{ ...F.sans, fontSize: 15, fontWeight: 800, color: t.scoreColor }}>{t.label}</span>
                <span style={{ ...F.sans, fontSize: 11, color: t.scoreColor, opacity: 0.55, marginLeft: 4 }}>{t.range}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                {t.reasons.map(r => (
                  <div key={r} style={{ display: 'flex', gap: 7, alignItems: 'flex-start' }}>
                    <span style={{ ...F.sans, fontSize: 11, color: t.scoreColor, flexShrink: 0, marginTop: 2 }}>·</span>
                    <span style={{ ...F.sans, fontSize: 12, color: t.scoreColor, lineHeight: 1.5, opacity: 0.85 }}>{r}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Score calculation table */}
        <div style={{ background: C.bgAlt, border: `1.5px solid ${C.border}`, borderRadius: 16, padding: '32px 36px', maxWidth: 720, margin: '0 auto' }}>
          <div style={{ ...F.sans, fontSize: 12, fontWeight: 700, color: C.accent, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>How the score is calculated</div>
          <p style={{ ...F.sans, fontSize: 14, color: C.textMuted, lineHeight: 1.7, margin: '0 0 20px' }}>
            Starts at 100. Risk penalties are subtracted based on what's found in the report. Any critical flag automatically caps the score at 40 — the Likely Decline range.
          </p>
          <div className="score-calc-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {[
              { label: 'Federal Pacific / Zinsco panel', pts: '−60 (cap at 40)', crit: true },
              { label: 'Knob-and-tube wiring',           pts: '−60 (cap at 40)', crit: true },
              { label: 'Aluminum branch wiring',         pts: '−50 (cap at 40)', crit: true },
              { label: 'Roof in poor condition',         pts: '−35' },
              { label: 'Polybutylene plumbing',          pts: '−30' },
              { label: 'Roof over 25 years',             pts: '−25' },
              { label: 'Open gable geometry',            pts: '−20' },
              { label: 'Impact / hurricane protection',  pts: '+10', positive: true },
            ].map(row => (
              <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px 10px', background: row.crit ? 'rgba(239,68,68,0.05)' : row.positive ? 'rgba(16,185,129,0.05)' : C.bg, borderRadius: 8 }}>
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

/* ─── What gets flagged ─── */

function WhatGetsFlagged() {
  const flags = [
    {
      severity: 'critical', title: 'Federal Pacific / Zinsco panels', impact: 'Likely decline',
      body: 'Most FL carriers will not bind on either panel brand. Both are known fire hazards — virtually every standard market requires replacement before quoting.',
    },
    {
      severity: 'critical', title: 'Aluminum branch wiring', impact: 'High underwriting risk',
      body: 'Aluminum wiring on branch circuits creates fire risk at connections. Requires remediation documentation or COPALUM connector certification before most carriers will write.',
    },
    {
      severity: 'critical', title: 'Knob-and-tube wiring', impact: 'Almost always uninsurable',
      body: 'Knob-and-tube is uninsurable with virtually all standard FL carriers. Catching this before the quote prevents a wasted submission entirely.',
    },
    {
      severity: 'warning', title: 'Polybutylene plumbing', impact: 'Carrier restrictions',
      body: 'Many FL carriers exclude water damage or require replacement. Catching this before submission prevents the client call no one wants to make.',
    },
    {
      severity: 'warning', title: 'Roof age and condition issues', impact: 'Inspection / replacement trigger',
      body: 'Most FL carriers require a roof inspection or condition letter for roofs over 20–25 years. Age and condition are flagged automatically so you can set expectations before the quote goes out.',
    },
  ]

  return (
    <section id="flags" className="lp-section-pad" style={{ background: C.bgAlt }}>
      <div style={{ maxWidth: MAX, margin: '0 auto', padding: '0 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{ ...F.sans, fontSize: 12, fontWeight: 700, color: C.accent, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>What gets flagged</div>
          <h2 className="lp-h2" style={{ ...F.sans, fontWeight: 800, color: C.text, margin: 0, marginBottom: 14 }}>
            Know what carriers will reject<br />before you quote
          </h2>
          <p style={{ ...F.sans, fontSize: 16, color: C.textMuted, maxWidth: 520, margin: '0 auto', lineHeight: 1.65 }}>
            These are the same issues that kill deals at underwriting. BindIQ catches every one of them — automatically.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxWidth: 780, margin: '0 auto' }}>
          {flags.map(f => (
            <div key={f.title} className={f.severity === 'critical' ? 'lp-flag-critical' : 'lp-flag-warning'}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, marginBottom: 8, flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 16 }}>{f.severity === 'critical' ? '🚨' : '⚠️'}</span>
                  <span style={{ ...F.sans, fontSize: 15, fontWeight: 700, color: f.severity === 'critical' ? '#991B1B' : '#92400E' }}>{f.title}</span>
                </div>
                <span style={{ ...F.sans, fontSize: 11, fontWeight: 700, color: f.severity === 'critical' ? '#991B1B' : '#92400E', background: f.severity === 'critical' ? 'rgba(239,68,68,0.12)' : 'rgba(245,158,11,0.15)', padding: '3px 10px', borderRadius: 20, whiteSpace: 'nowrap' }}>
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

/* ─── What gets extracted ─── */

function WhatGetsExtracted() {
  return (
    <section className="lp-section-pad">
      <div style={{ maxWidth: MAX, margin: '0 auto', padding: '0 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{ ...F.sans, fontSize: 12, fontWeight: 700, color: C.accent, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>What gets extracted</div>
          <h2 className="lp-h2" style={{ ...F.sans, fontWeight: 800, color: C.text, margin: 0, marginBottom: 12 }}>Every field. Structured instantly.</h2>
          <p style={{ ...F.sans, fontSize: 16, color: C.textMuted, maxWidth: 440, margin: '0 auto', lineHeight: 1.6 }}>No manual reading required.</p>
        </div>

        <div className="lp-extract-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          <div style={{ background: C.bgAlt, border: `1.5px solid ${C.border}`, borderRadius: 16, padding: 28 }}>
            <div style={{ ...F.sans, fontSize: 13, fontWeight: 700, color: C.accent, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>Wind Mitigation</div>
            <div style={{ ...F.sans, fontSize: 12, color: C.textSubtle, marginBottom: 20 }}>OIR-B1-1802</div>
            {[
              ['Roof Covering',           'Selection A–D + permit date'],
              ['Roof Deck Attachment',    'Selection A–G + description'],
              ['Roof-to-Wall Connection', 'Selection A–F (toe nails → structural)'],
              ['Roof Geometry',           'Hip / gable / flat + hip percentage'],
              ['Secondary Water Resist.', 'Yes / No + underlayment type'],
              ['Opening Protection',      'None / basic / hurricane / impact'],
            ].map(([label, detail]) => (
              <div key={label} style={{ padding: '9px 0', borderBottom: `1px solid ${C.border}` }}>
                <div style={{ ...F.sans, fontSize: 13, fontWeight: 600, color: C.text }}>{label}</div>
                <div style={{ ...F.sans, fontSize: 12, color: C.textMuted, marginTop: 2 }}>{detail}</div>
              </div>
            ))}
          </div>
          <div style={{ background: C.bgAlt, border: `1.5px solid ${C.border}`, borderRadius: 16, padding: 28 }}>
            <div style={{ ...F.sans, fontSize: 13, fontWeight: 700, color: C.accent, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>4-Point Inspection</div>
            <div style={{ ...F.sans, fontSize: 12, color: C.textSubtle, marginBottom: 20 }}>All four systems</div>
            {[
              ['Roof',       'Material, age, condition, estimated remaining life'],
              ['HVAC',       'Type, brand, age, condition, last service'],
              ['Plumbing',   'Supply material, drain material, water heater age'],
              ['Electrical', 'Panel brand, type, service amps, wiring type, condition'],
            ].map(([label, detail]) => (
              <div key={label} style={{ padding: '9px 0', borderBottom: `1px solid ${C.border}` }}>
                <div style={{ ...F.sans, fontSize: 13, fontWeight: 600, color: C.text }}>{label}</div>
                <div style={{ ...F.sans, fontSize: 12, color: C.textMuted, marginTop: 2 }}>{detail}</div>
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
      name: 'Starter',
      price: 79,
      volume: 'Up to 50 reports / month',
      highlight: false,
      badge: null,
      features: [
        'BindIQ Score + red flags on every scan',
        'Florida 4-point + wind mitigation',
        'Structured underwriting output',
        'PDF upload + paste mode',
        'Clipboard export',
      ],
      cta: 'Start free trial',
    },
    {
      name: 'Pro',
      price: 149,
      volume: 'Up to 200 reports / month',
      highlight: true,
      badge: 'Most popular',
      features: [
        'Everything in Starter',
        'Intake Links — async client submissions',
        'Client-facing 3-step intake form',
        'PDF upload in intake flow',
        'Enhanced underwriting explanations',
        'Submission history dashboard',
      ],
      cta: 'Start free trial',
    },
    {
      name: 'Agency',
      price: 299,
      volume: '500+ reports / month (fair use)',
      highlight: false,
      badge: null,
      features: [
        'Everything in Pro',
        'Multi-user access (3 included)',
        'Intake links with agency branding',
        'Exportable underwriting summaries',
        'Priority support',
      ],
      cta: 'Get started',
    },
  ]

  return (
    <section id="pricing" className="lp-section-pad" style={{ background: C.bgAlt }}>
      <div style={{ maxWidth: MAX, margin: '0 auto', padding: '0 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: 12 }}>
          <div style={{ ...F.sans, fontSize: 12, fontWeight: 700, color: C.accent, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>Pricing</div>
          <h2 className="lp-h2" style={{ ...F.sans, fontWeight: 800, color: C.text, margin: 0, marginBottom: 12 }}>
            Built for real agency workflows
          </h2>
          <p style={{ ...F.sans, fontSize: 16, color: C.textMuted, maxWidth: 440, margin: '0 auto 16px', lineHeight: 1.6 }}>
            No per-report charges. No friction. Just fast underwriting decisions.
          </p>
          <p style={{ ...F.sans, fontSize: 13, color: C.textSubtle, margin: '0 auto 40px' }}>
            Most Florida agents process 20–100 reports per month.
          </p>
        </div>

        <div className="lp-plans-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, maxWidth: 900, margin: '0 auto' }}>
          {plans.map(plan => (
            <div
              key={plan.name}
              style={{
                background: C.bg,
                border: plan.highlight ? `2px solid ${C.accent}` : `1.5px solid ${C.border}`,
                borderRadius: 16, padding: '32px 28px', position: 'relative',
                boxShadow: plan.highlight ? '0 10px 40px rgba(4,37,108,0.14)' : 'none',
              }}
            >
              {plan.badge && (
                <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', background: C.accent, color: '#fff', ...F.sans, fontSize: 10, fontWeight: 700, padding: '3px 14px', borderRadius: 20, letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>
                  {plan.badge.toUpperCase()}
                </div>
              )}

              <div style={{ ...F.sans, fontSize: 12, fontWeight: 700, color: plan.highlight ? C.accent : C.textMuted, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>{plan.name}</div>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, marginBottom: 4 }}>
                <span style={{ ...F.sans, fontSize: 40, fontWeight: 800, color: C.text, lineHeight: 1, letterSpacing: '-0.02em' }}>${plan.price}</span>
                <span style={{ ...F.sans, fontSize: 13, color: C.textMuted, paddingBottom: 6 }}>/mo</span>
              </div>
              <div style={{ ...F.sans, fontSize: 12, color: C.textMuted, marginBottom: 24, lineHeight: 1.4 }}>{plan.volume}</div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 9, marginBottom: 24 }}>
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
                to="/sign-up"
                style={{ ...F.sans, display: 'block', textAlign: 'center', textDecoration: 'none', padding: '12px 16px', borderRadius: 9, fontSize: 14, fontWeight: 700, background: plan.highlight ? C.accent : 'transparent', color: plan.highlight ? '#fff' : C.accent, border: plan.highlight ? 'none' : `1.5px solid ${C.accent}`, transition: 'all 0.15s' }}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── ROI ─── */

function ROI() {
  return (
    <section className="lp-section-pad">
      <div style={{ maxWidth: 680, margin: '0 auto', padding: '0 24px', textAlign: 'center' }}>
        <div style={{ ...F.sans, fontSize: 12, fontWeight: 700, color: C.accent, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>The math</div>
        <h2 className="lp-h2" style={{ ...F.sans, fontWeight: 800, color: C.text, margin: '0 0 16px' }}>
          Avoid one bad submission<br />and it pays for itself.
        </h2>
        <p style={{ ...F.sans, fontSize: 16, color: C.textMuted, lineHeight: 1.7, maxWidth: 520, margin: '0 auto 40px' }}>
          A declined policy means lost commission, wasted quoting time, and a delayed placement.
          BindIQ helps you identify those risks before you quote.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, textAlign: 'left' }} className="lp-three-grid">
          {[
            { icon: '💸', heading: 'Lost commission', body: 'Every declined bind is a commission that never happened — and time you can\'t get back.' },
            { icon: '⏱', heading: 'Wasted quoting time', body: 'Filling out carrier apps for properties that can\'t bind is pure overhead. BindIQ cuts it.' },
            { icon: '📉', heading: 'Delayed placement', body: 'Back-and-forth on a decline delays the whole deal. Catch issues early, keep the process moving.' },
          ].map(item => (
            <div key={item.heading} style={{ background: C.bgAlt, border: `1.5px solid ${C.border}`, borderRadius: 14, padding: '22px 20px' }}>
              <div style={{ fontSize: 24, marginBottom: 10 }}>{item.icon}</div>
              <div style={{ ...F.sans, fontSize: 14, fontWeight: 700, color: C.text, marginBottom: 6 }}>{item.heading}</div>
              <div style={{ ...F.sans, fontSize: 13, color: C.textMuted, lineHeight: 1.6 }}>{item.body}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── FAQ ─── */

function FAQ() {
  const items = [
    ['Does it work with any inspection PDF?',
     'Yes — BindIQ works with most standard Florida 4-point and wind mitigation reports. If the PDF contains selectable text, it processes instantly.'],
    ['What about scanned reports?',
     'Scanned PDFs are supported. BindIQ processes image-based files and continues to improve coverage.'],
    ['How accurate is it?',
     'Highly accurate for standard inspection formats. Built specifically for Florida underwriting workflows — critical risk indicators are detected using a rules engine, not guesswork.'],
    ['Is client data stored?',
     'No. Reports are processed securely and discarded after extraction. No inspection content is retained.'],
    ['Can I cancel anytime?',
     'Yes. No contracts. Cancel anytime from your billing dashboard.'],
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
        <h2 className="lp-h2" style={{ ...F.sans, fontWeight: 800, color: C.text, margin: '0 auto 16px', maxWidth: 480 }}>
          Know before you quote.
        </h2>
        <p style={{ ...F.sans, fontSize: 16, color: C.textMuted, maxWidth: 420, margin: '0 auto 32px', lineHeight: 1.65 }}>
          Stop wasting time on risks that won't bind.
        </p>
        <Link to="/inspect" className="lp-cta-primary" style={{ ...F.sans, fontSize: 16, padding: '16px 40px' }}>
          Try BindIQ free — no account needed
        </Link>
      </div>
    </section>
  )
}

/* ─── Footer ─── */

function Footer() {
  const linkStyle = { ...F.sans, fontSize: 13, color: C.textMuted, textDecoration: 'none', transition: 'color 0.12s' }

  const col = (heading, items) => (
    <div>
      <div style={{ ...F.sans, fontSize: 11, fontWeight: 700, color: C.text, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 14 }}>
        {heading}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {items.map(({ label, to, href }) => {
          if (href) return <a key={label} href={href} style={linkStyle}>{label}</a>
          return <Link key={label} to={to} style={linkStyle}>{label}</Link>
        })}
      </div>
    </div>
  )

  return (
    <footer style={{ borderTop: `1px solid ${C.border}`, background: C.bg, padding: '56px 24px 32px' }}>
      <div style={{ maxWidth: MAX, margin: '0 auto' }}>

        {/* Top grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 48, marginBottom: 48 }} className="lp-footer-grid">

          {/* Brand */}
          <div>
            <div style={{ ...F.sans, fontSize: 16, fontWeight: 800, color: C.text, letterSpacing: '-0.01em', marginBottom: 8 }}>BindIQ</div>
            <div style={{ ...F.sans, fontSize: 13, color: C.textMuted, lineHeight: 1.6, marginBottom: 20, maxWidth: 260 }}>
              Built for independent insurance agents.
            </div>
            <a href="mailto:support@usebindiq.com" style={linkStyle}>
              support@usebindiq.com
            </a>
          </div>

          {/* Product */}
          {col('Product', [
            { label: 'How it works',      href: '#how' },
            { label: 'What gets flagged', href: '#flags' },
            { label: 'BindIQ Score',      href: '#score' },
            { label: 'Pricing',           href: '#pricing' },
            { label: 'Sign in',           to: '/sign-in' },
          ])}

          {/* Resources */}
          {col('Resources', [
            { label: 'Help Center',   href: 'mailto:support@usebindiq.com' },
            { label: 'Support',       to: '/support' },
            { label: 'System Status', href: 'https://status.usebindiq.com' },
          ])}

          {/* Legal */}
          {col('Legal', [
            { label: 'Privacy Policy',   to: '/privacy' },
            { label: 'Terms of Service', to: '/terms' },
            { label: 'Data Handling',    to: '/privacy' },
          ])}
        </div>

        {/* Security trust line */}
        <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 24, marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, maxWidth: 680 }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0, marginTop: 2 }}>
              <path d="M7 1L2 3v4c0 3.31 2.24 5.96 5 6.5C9.76 12.96 12 10.31 12 7V3L7 1z" stroke={C.textSubtle} strokeWidth="1.2" strokeLinejoin="round"/>
            </svg>
            <span style={{ ...F.sans, fontSize: 12, color: C.textSubtle, lineHeight: 1.6 }}>
              Inspection reports are processed securely to generate underwriting insights. No client data is stored after processing.
            </span>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <span style={{ ...F.sans, fontSize: 12, color: C.textSubtle }}>© 2026 BindIQ. All rights reserved.</span>
          <div style={{ display: 'flex', gap: 20 }}>
            {[['Privacy Policy', '/privacy'], ['Terms of Service', '/terms'], ['Support', '/support']].map(([label, to]) => (
              <Link key={label} to={to} style={{ ...F.sans, fontSize: 12, color: C.textSubtle, textDecoration: 'none' }}>{label}</Link>
            ))}
          </div>
        </div>

      </div>
    </footer>
  )
}
