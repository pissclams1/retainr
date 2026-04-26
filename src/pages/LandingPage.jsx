import { useState } from 'react'
import { Link } from 'react-router-dom'

/* ─────────── Design tokens ─────────── */

const F = {
  heading: { fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif" },
  body:    { fontFamily: "'Inter', system-ui, -apple-system, sans-serif" },
}

const C = {
  bg:           '#FAFAFA',
  surface:      '#FFFFFF',
  surfaceWarm:  '#F5F4F0',
  text:         '#111111',
  textBody:     '#1F1F1F',
  textMuted:    '#5A5A5A',
  textFaint:    '#8A8A8A',
  border:       'rgba(17,17,17,0.08)',
  borderStrong: 'rgba(17,17,17,0.14)',
  accent:       '#0F1E40',
  accentTint:   'rgba(15,30,64,0.08)',
}

const MAX = 1180

/* ─────────── Page-level CSS (media queries + base reset) ─────────── */

const PAGE_CSS = `
  html, body { background: ${C.bg}; }
  * { box-sizing: border-box; }
  ::selection { background: ${C.accentTint}; color: ${C.text}; }

  .lp-hero-grid {
    display: grid;
    grid-template-columns: 0.95fr 1.05fr;
    gap: 72px;
    align-items: center;
  }
  .lp-section-grid-3 {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 32px;
  }
  .lp-pricing-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
    max-width: 1080px;
    margin: 28px auto 0;
  }
  .lp-section-pad { padding: 120px 32px; }
  .lp-h1 { font-size: 56px; line-height: 1.05; letter-spacing: -0.025em; }
  .lp-h2 { font-size: 44px; line-height: 1.12; letter-spacing: -0.02em; }
  .lp-cta-headline { font-size: 48px; line-height: 1.08; letter-spacing: -0.025em; }

  /* Tablet */
  @media (max-width: 960px) {
    .lp-hero-grid { grid-template-columns: 1fr; gap: 56px; }
    .lp-h1 { font-size: 44px; }
    .lp-h2 { font-size: 34px; }
    .lp-cta-headline { font-size: 36px; }
    .lp-section-pad { padding: 96px 24px; }
  }
  /* Mobile */
  @media (max-width: 640px) {
    .lp-section-grid-3 { grid-template-columns: 1fr; gap: 36px; }
    .lp-pricing-grid { grid-template-columns: 1fr; }
    .lp-h1 { font-size: 36px; }
    .lp-h2 { font-size: 28px; }
    .lp-cta-headline { font-size: 30px; }
    .lp-section-pad { padding: 72px 20px; }
    .lp-nav-links { display: none !important; }
    .lp-nav-cta { display: inline-flex !important; }
  }

  /* Hover affordances — kept extremely subtle */
  .lp-link:hover { color: ${C.text}; }
  .lp-cta-primary:hover { background: #142751; }
  .lp-cta-ghost:hover { border-color: ${C.text}; color: ${C.text}; }
  .lp-faq summary { list-style: none; cursor: pointer; }
  .lp-faq summary::-webkit-details-marker { display: none; }
  .lp-faq[open] .lp-faq-icon { transform: rotate(45deg); }
`

/* ─────────── Page ─────────── */

export default function LandingPage() {
  const [billing, setBilling] = useState('monthly')

  return (
    <div style={{
      ...F.body, color: C.textBody, background: C.bg,
      WebkitFontSmoothing: 'antialiased',
      MozOsxFontSmoothing: 'grayscale',
    }}>
      <style>{PAGE_CSS}</style>
      <Nav />
      <Hero />
      <TrustStrip />
      <HowItWorks />
      <Value />
      <CompetitorContrast />
      <Testimonial />
      <Pricing billing={billing} setBilling={setBilling} />
      <FAQ />
      <FinalCTA />
      <Footer />
    </div>
  )
}

/* ─────────── Nav ─────────── */

function Nav() {
  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 50,
      background: 'rgba(250,250,250,0.85)',
      backdropFilter: 'saturate(140%) blur(12px)',
      WebkitBackdropFilter: 'saturate(140%) blur(12px)',
      borderBottom: `1px solid ${C.border}`,
    }}>
      <div style={{
        maxWidth: MAX, margin: '0 auto', padding: '18px 32px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <a href="/" style={{
          ...F.heading, fontSize: 19, fontWeight: 600,
          color: C.text, letterSpacing: '-0.01em', textDecoration: 'none',
        }}>retainr</a>
        <div className="lp-nav-links" style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
          <a href="#how" className="lp-link" style={navLink}>How it works</a>
          <a href="#pricing" className="lp-link" style={navLink}>Pricing</a>
          <a href="#sample" className="lp-link" style={navLink}>Sample report</a>
          <Link to="/login" className="lp-link" style={navLink}>Sign in</Link>
          <Link to="/checkout?plan=pro&billing=monthly" className="lp-cta-primary" style={btnPrimarySmall}>
            Start Free Trial
          </Link>
        </div>
      </div>
    </nav>
  )
}

const navLink = {
  ...F.body, fontSize: 14, fontWeight: 500,
  color: C.textMuted, textDecoration: 'none',
  transition: 'color 0.15s',
}
const btnPrimarySmall = {
  ...F.body, fontSize: 14, fontWeight: 500,
  color: '#FFFFFF', background: C.accent,
  padding: '9px 18px', borderRadius: 8,
  textDecoration: 'none', border: 'none', cursor: 'pointer',
  transition: 'background 0.15s',
}

/* ─────────── Hero ─────────── */

function Hero() {
  return (
    <section style={{ padding: '120px 32px 80px' }}>
      <div style={{ maxWidth: MAX, margin: '0 auto' }}>
        <div className="lp-hero-grid">
          {/* LEFT */}
          <div>
            <h1 className="lp-h1" style={{
              ...F.heading, fontWeight: 600, color: C.text,
              margin: 0, marginBottom: 24, maxWidth: 560,
            }}>
              Turn every AM into a high-performing communicator.
            </h1>

            <p style={{
              ...F.body, fontSize: 19, fontWeight: 400,
              lineHeight: 1.55, color: C.textMuted,
              margin: 0, marginBottom: 18, maxWidth: 520,
            }}>
              Turn Google Ads performance data into client-ready updates,
              explanations, and talking points in seconds.
            </p>

            <p style={{
              ...F.body, fontSize: 15, fontWeight: 400,
              lineHeight: 1.6, color: C.textFaint,
              margin: 0, marginBottom: 36, maxWidth: 480,
            }}>
              Traditional reporting tools show performance.<br />
              Retainr helps your team explain it.
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
              <Link to="/checkout?plan=pro&billing=monthly" className="lp-cta-primary" style={btnPrimary}>
                Start Free Trial
              </Link>
              <a href="#sample" className="lp-cta-ghost" style={btnGhost}>
                See Sample Report
              </a>
            </div>

            <p style={{
              ...F.body, fontSize: 13, color: C.textFaint,
              margin: 0, marginTop: 22,
            }}>
              14-day free trial · No credit card required
            </p>
          </div>

          {/* RIGHT — the report (the product) */}
          <div id="sample">
            <ReportDocument />
          </div>
        </div>
      </div>
    </section>
  )
}

const btnPrimary = {
  ...F.body, fontSize: 15, fontWeight: 500,
  color: '#FFFFFF', background: C.accent,
  padding: '13px 24px', borderRadius: 8,
  textDecoration: 'none',
  display: 'inline-flex', alignItems: 'center', gap: 8,
  border: 'none', cursor: 'pointer',
  transition: 'background 0.15s',
}
const btnGhost = {
  ...F.body, fontSize: 15, fontWeight: 500,
  color: C.text, background: 'transparent',
  padding: '13px 22px', borderRadius: 8,
  textDecoration: 'none',
  display: 'inline-flex', alignItems: 'center', gap: 8,
  border: `1px solid ${C.borderStrong}`, cursor: 'pointer',
  transition: 'border-color 0.15s, color 0.15s',
}

/* ─────────── Report (paper-style, the product) ─────────── */

function ReportDocument() {
  return (
    <article style={{
      background: C.surface,
      border: `1px solid ${C.border}`,
      borderRadius: 2,                                                 // crisp paper edge
      boxShadow: [
        '0 1px 0 rgba(255,255,255,0.7) inset',                         // top inner highlight
        '0 1px 0 rgba(17,17,17,0.04)',
        '0 6px 12px -6px rgba(17,17,17,0.10)',
        '0 28px 64px -16px rgba(17,17,17,0.22)',                       // sheet on a page
      ].join(', '),
      overflow: 'hidden',
    }}>
      {/* Slim navy rule (only place navy appears in the report) */}
      <div style={{ height: 3, background: C.accent }} />

      {/* Doc header */}
      <header style={{ padding: '34px 40px 22px', borderBottom: `1px solid ${C.border}` }}>
        <div style={{
          ...F.body, fontSize: 11, fontWeight: 600,
          letterSpacing: '0.10em', textTransform: 'uppercase',
          color: C.textFaint, marginBottom: 8,
        }}>
          Monthly Performance Report · April 2025
        </div>
        <h3 style={{
          ...F.heading, fontSize: 26, fontWeight: 600,
          lineHeight: 1.2, color: C.text,
          margin: 0, marginBottom: 6,
        }}>
          Apex Digital
        </h3>
        <div style={{ ...F.body, fontSize: 12, color: C.textFaint }}>
          Prepared by retainr · Read-only client view
        </div>
      </header>

      {/* Body */}
      <div style={{ padding: '30px 40px 32px', display: 'flex', flexDirection: 'column', gap: 28 }}>
        <DocSection label="Monthly Performance Narrative">
          <p style={{ ...docProse, margin: 0 }}>
            Performance improved this month, driven by stronger efficiency in
            high-intent campaigns and improved allocation of spend toward
            converting traffic.
          </p>
          <ul style={docList}>
            <li style={docLi}>Conversions increased <strong style={docStrong}>18%</strong></li>
            <li style={docLi}>CPA decreased <strong style={docStrong}>11%</strong></li>
            <li style={docLi}>Brand campaigns outperformed non-brand traffic</li>
          </ul>
        </DocSection>

        <DocSection label="Key Takeaway">
          <p style={{
            ...docProse, margin: 0,
            paddingLeft: 14, borderLeft: `2px solid ${C.accent}`,
          }}>
            Performance gains were driven by efficiency improvements rather
            than increased spend.
          </p>
        </DocSection>

        <DocSection label="How to Explain This to the Client">
          <ul style={{ ...docList, gap: 10 }}>
            <li style={docLi}>"We improved efficiency this month without increasing your budget."</li>
            <li style={docLi}>"We're seeing stronger performance from higher-intent search traffic."</li>
            <li style={docLi}>"The account is becoming more efficient as we refine spend allocation."</li>
          </ul>
        </DocSection>

        <DocSection label="Talking Points">
          <ul style={{ ...docList, gap: 10 }}>
            <li style={docLi}>This month is about efficiency gains, not just volume.</li>
            <li style={docLi}>We're improving how budget is allocated across intent levels.</li>
            <li style={docLi}>The account is trending toward higher-quality traffic overall.</li>
          </ul>
        </DocSection>
      </div>

      {/* Doc footer — page number sells the document framing */}
      <footer style={{
        padding: '14px 40px',
        borderTop: `1px solid ${C.border}`,
        display: 'flex', justifyContent: 'space-between',
        ...F.body, fontSize: 11, color: C.textFaint,
      }}>
        <span>retainr.io/r/apex-digital</span>
        <span>1 / 1</span>
      </footer>
    </article>
  )
}

function DocSection({ label, children }) {
  return (
    <section>
      <div style={{
        ...F.body, fontSize: 11, fontWeight: 600,
        letterSpacing: '0.08em', textTransform: 'uppercase',
        color: C.textFaint, marginBottom: 12,
      }}>
        {label}
      </div>
      {children}
    </section>
  )
}

const docProse = {
  ...F.body, fontSize: 14, lineHeight: 1.65, color: C.textBody,
}
const docList = {
  listStyle: 'none', padding: 0, margin: '12px 0 0 0',
  display: 'flex', flexDirection: 'column', gap: 6,
}
const docLi = {
  ...F.body, fontSize: 14, lineHeight: 1.6,
  color: C.textBody,
}
const docStrong = { fontWeight: 600, color: C.text }

/* ─────────── Trust strip — single restrained row of credibility ─────────── */

function TrustStrip() {
  const items = [
    'Read-only Google Ads access',
    'Stripe-secured billing',
    'SOC 2 controls (in progress)',
    'Built for agencies running $500K–$50M in client spend',
  ]
  return (
    <section style={{
      padding: '20px 32px',
      borderTop: `1px solid ${C.border}`,
      borderBottom: `1px solid ${C.border}`,
      background: C.bg,
    }}>
      <div style={{
        maxWidth: MAX, margin: '0 auto',
        display: 'flex', flexWrap: 'wrap', gap: '16px 36px',
        justifyContent: 'center', alignItems: 'center',
        ...F.body, fontSize: 12, color: C.textMuted,
      }}>
        {items.map((t, i) => (
          <span key={t} style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <span style={{
              width: 4, height: 4, borderRadius: '50%',
              background: C.textFaint, flexShrink: 0,
            }} />
            {t}
          </span>
        ))}
      </div>
    </section>
  )
}

/* ─────────── How it works ─────────── */

function HowItWorks() {
  const steps = [
    {
      n: '01',
      title: 'Connect Google Ads.',
      desc: 'Read-only OAuth. We never modify campaigns or budgets.',
    },
    {
      n: '02',
      title: 'Pick a client account.',
      desc: 'We pull the last 90 days and generate the first report immediately.',
    },
    {
      n: '03',
      title: 'Send the report.',
      desc: 'Share a read-only link, copy to email, or download a PDF — your AM has talking points before the call.',
    },
  ]
  return (
    <section id="how" className="lp-section-pad">
      <div style={{ maxWidth: MAX, margin: '0 auto' }}>
        <SectionEyebrow>How it works</SectionEyebrow>
        <h2 className="lp-h2" style={{ ...F.heading, fontWeight: 600, color: C.text, margin: 0, maxWidth: 720 }}>
          Connected on Monday. <span style={{ color: C.textMuted }}>Sending reports by Tuesday.</span>
        </h2>

        <div className="lp-section-grid-3" style={{ marginTop: 72, maxWidth: 1080 }}>
          {steps.map((s) => (
            <div key={s.n} style={{
              borderTop: `1px solid ${C.borderStrong}`,
              paddingTop: 22,
            }}>
              <div style={{
                ...F.heading, fontSize: 14, fontWeight: 600,
                color: C.textFaint, marginBottom: 14,
                letterSpacing: '0.04em',
              }}>
                {s.n}
              </div>
              <h3 style={{
                ...F.heading, fontSize: 22, fontWeight: 600,
                lineHeight: 1.3, letterSpacing: '-0.01em',
                color: C.text, margin: 0, marginBottom: 12,
              }}>
                {s.title}
              </h3>
              <p style={{
                ...F.body, fontSize: 15, lineHeight: 1.6,
                color: C.textMuted, margin: 0,
              }}>
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─────────── Value (3 outcomes) ─────────── */

function Value() {
  const items = [
    'Standardize client communication.',
    'Save account manager time.',
    'Improve client-facing consistency.',
  ]
  return (
    <section className="lp-section-pad" style={{ background: C.surfaceWarm }}>
      <div style={{ maxWidth: MAX, margin: '0 auto' }}>
        <SectionEyebrow>Why agencies use it</SectionEyebrow>
        <h2 className="lp-h2" style={{ ...F.heading, fontWeight: 600, color: C.text, margin: 0, maxWidth: 720 }}>
          Three outcomes. Nothing extra.
        </h2>

        <div className="lp-section-grid-3" style={{ marginTop: 72, gap: 64, maxWidth: 1000 }}>
          {items.map((line, i) => (
            <div key={line}>
              <div style={{
                ...F.heading, fontSize: 14, fontWeight: 600,
                color: C.textFaint, marginBottom: 14,
              }}>
                0{i + 1}
              </div>
              <p style={{
                ...F.heading, fontSize: 22, fontWeight: 600,
                lineHeight: 1.3, letterSpacing: '-0.01em',
                color: C.text, margin: 0,
              }}>
                {line}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─────────── Competitor contrast ─────────── */

function CompetitorContrast() {
  const tools = [
    { name: 'AgencyAnalytics', shows: 'charts.' },
    { name: 'DashThis',        shows: 'dashboards.' },
    { name: 'Whatagraph',      shows: 'reports.' },
    { name: 'Retainr',         shows: 'writes the explanation.', highlight: true },
  ]
  return (
    <section className="lp-section-pad" style={{ background: C.bg }}>
      <div style={{ maxWidth: 920, margin: '0 auto', textAlign: 'center' }}>
        <SectionEyebrow center>Compared to reporting tools</SectionEyebrow>
        <h2 className="lp-h2" style={{
          ...F.heading, fontWeight: 600, color: C.text,
          margin: '24px 0 0 0',
        }}>
          Traditional reporting tools show what happened.<br />
          <span style={{ color: C.textMuted }}>Retainr helps your team explain it.</span>
        </h2>

        <ul style={{
          listStyle: 'none', padding: 0, margin: '56px auto 0', maxWidth: 540,
          display: 'flex', flexDirection: 'column', gap: 0,
          textAlign: 'left',
        }}>
          {tools.map((t) => (
            <li
              key={t.name}
              style={{
                ...F.body, fontSize: 17, lineHeight: 1.5,
                padding: '16px 0',
                borderBottom: `1px solid ${C.border}`,
                display: 'flex', justifyContent: 'space-between', gap: 16,
                color: t.highlight ? C.text : C.textMuted,
                fontWeight: t.highlight ? 600 : 400,
              }}
            >
              <span>{t.name} shows</span>
              <span style={{ textAlign: 'right' }}>{t.shows}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

/* ─────────── Single testimonial ─────────── */

function Testimonial() {
  return (
    <section className="lp-section-pad" style={{ background: C.surfaceWarm, paddingTop: 100, paddingBottom: 100 }}>
      <div style={{ maxWidth: 820, margin: '0 auto', textAlign: 'center' }}>
        <blockquote style={{
          ...F.heading, fontSize: 30, fontWeight: 500,
          lineHeight: 1.35, letterSpacing: '-0.015em',
          color: C.text, margin: 0,
        }}>
          "Cut our monthly reporting from six hours to twenty minutes —
          and our account managers actually have something to say
          on the client call."
        </blockquote>
        <div style={{
          ...F.body, fontSize: 14, color: C.textMuted,
          marginTop: 32,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
        }}>
          <span style={{ fontWeight: 500, color: C.text }}>Sarah K.</span>
          <span style={{ width: 3, height: 3, borderRadius: '50%', background: C.textFaint }} />
          <span>Director of Performance, mid-size paid-search agency</span>
        </div>
      </div>
    </section>
  )
}

/* ─────────── Pricing ─────────── */

function Pricing({ billing, setBilling }) {
  const plans = [
    { key: 'growth', tier: 'Growth',     monthly: 199, yearly: 159, capacity: 'Up to 10 client accounts' },
    { key: 'pro',    tier: 'Pro Agency', monthly: 499, yearly: 399, capacity: 'Up to 30 client accounts', featured: true },
    { key: 'scale',  tier: 'Scale',      monthly: 999, yearly: 799, capacity: 'Up to 75 client accounts' },
  ]
  return (
    <section id="pricing" className="lp-section-pad" style={{ background: C.bg }}>
      <div style={{ maxWidth: MAX, margin: '0 auto' }}>
        <div style={{ textAlign: 'center' }}>
          <SectionEyebrow center>Pricing</SectionEyebrow>
          <h2 className="lp-h2" style={{
            ...F.heading, fontWeight: 600, color: C.text,
            margin: 0, textAlign: 'center',
          }}>
            Simple plans. No usage games.
          </h2>
          <p style={{
            ...F.body, fontSize: 16, lineHeight: 1.6,
            color: C.textMuted, margin: '14px auto 0', maxWidth: 540,
          }}>
            14-day free trial. No credit card required. Cancel any time.
          </p>

          <BillingToggle billing={billing} setBilling={setBilling} />
        </div>

        <div className="lp-pricing-grid">
          {plans.map((p) => {
            const price = billing === 'yearly' ? p.yearly : p.monthly
            return (
              <div
                key={p.key}
                style={{
                  position: 'relative',
                  background: p.featured ? C.surface : 'transparent',
                  border: `1px solid ${p.featured ? C.borderStrong : C.border}`,
                  borderRadius: 12,
                  padding: '36px 32px',
                  display: 'flex', flexDirection: 'column',
                  boxShadow: p.featured
                    ? '0 18px 40px -20px rgba(17,17,17,0.18)'
                    : 'none',
                }}
              >
                {p.featured && (
                  <div style={{
                    position: 'absolute', top: -12, left: 24,
                    ...F.body, fontSize: 10, fontWeight: 600,
                    letterSpacing: '0.10em', textTransform: 'uppercase',
                    color: C.accent, background: C.surface,
                    padding: '4px 10px', borderRadius: 20,
                    border: `1px solid ${C.borderStrong}`,
                  }}>
                    Most popular
                  </div>
                )}
                <div style={{
                  ...F.body, fontSize: 12, fontWeight: 600,
                  letterSpacing: '0.10em', textTransform: 'uppercase',
                  color: p.featured ? C.accent : C.textMuted,
                  marginBottom: 16,
                }}>
                  {p.tier}
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 8 }}>
                  <div style={{
                    ...F.heading, fontSize: 44, fontWeight: 600,
                    lineHeight: 1, color: C.text, letterSpacing: '-0.02em',
                  }}>
                    ${price}
                  </div>
                  <div style={{ ...F.body, fontSize: 14, color: C.textFaint }}>
                    /mo{billing === 'yearly' ? ', billed annually' : ''}
                  </div>
                </div>
                <div style={{
                  ...F.body, fontSize: 14, lineHeight: 1.5,
                  color: C.textMuted, marginBottom: 32,
                }}>
                  {p.capacity}
                </div>
                <Link
                  to={`/checkout?plan=${p.key}&billing=${billing}`}
                  className={p.featured ? 'lp-cta-primary' : 'lp-cta-ghost'}
                  style={p.featured ? planCTAFilled : planCTAOutline}
                >
                  Start Free Trial
                </Link>
              </div>
            )
          })}
        </div>

        <div style={{
          marginTop: 32, textAlign: 'center',
          ...F.body, fontSize: 14, color: C.textMuted,
        }}>
          Need more than 75 accounts?{' '}
          <a href="mailto:hello@retainr.io?subject=Enterprise" style={{
            color: C.text, textDecoration: 'underline', textUnderlineOffset: 3,
          }}>
            Contact us
          </a>
        </div>
      </div>
    </section>
  )
}

const planCTAFilled = {
  ...F.body, fontSize: 14, fontWeight: 500,
  color: '#FFFFFF', background: C.accent,
  padding: '12px 0', borderRadius: 8,
  textDecoration: 'none', textAlign: 'center',
  border: 'none',
  transition: 'background 0.15s',
}
const planCTAOutline = {
  ...F.body, fontSize: 14, fontWeight: 500,
  color: C.text, background: 'transparent',
  padding: '12px 0', borderRadius: 8,
  textDecoration: 'none', textAlign: 'center',
  border: `1px solid ${C.borderStrong}`,
  transition: 'border-color 0.15s, color 0.15s',
}

function BillingToggle({ billing, setBilling }) {
  const opt = (key, label, badge) => {
    const active = billing === key
    return (
      <button
        key={key}
        onClick={() => setBilling(key)}
        style={{
          ...F.body, fontSize: 13, fontWeight: 500,
          padding: '8px 16px',
          border: 'none', cursor: 'pointer',
          borderRadius: 7,
          background: active ? C.text : 'transparent',
          color: active ? '#FFFFFF' : C.textMuted,
          display: 'inline-flex', alignItems: 'center', gap: 8,
          transition: 'background 0.15s, color 0.15s',
        }}
      >
        {label}
        {badge && (
          <span style={{
            ...F.body, fontSize: 10, fontWeight: 600,
            padding: '2px 7px', borderRadius: 10,
            background: active ? 'rgba(255,255,255,0.18)' : C.accentTint,
            color: active ? '#FFFFFF' : C.accent,
            letterSpacing: '0.04em',
          }}>{badge}</span>
        )}
      </button>
    )
  }
  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: 28 }}>
      <div style={{
        display: 'inline-flex', gap: 4, padding: 4,
        background: C.surface, border: `1px solid ${C.border}`,
        borderRadius: 10,
      }}>
        {opt('monthly', 'Monthly')}
        {opt('yearly', 'Yearly', 'Save 20%')}
      </div>
    </div>
  )
}

/* ─────────── FAQ ─────────── */

function FAQ() {
  const items = [
    {
      q: 'Can I cancel any time?',
      a: 'Yes — from the billing portal. Service continues through the end of the period you have already paid for.',
    },
    {
      q: 'What if I exceed my client account limit?',
      a: 'You can add accounts above the cap on a per-account basis, or move up to the next tier. We never auto-upgrade you.',
    },
    {
      q: 'Do you support Meta or LinkedIn Ads?',
      a: 'Google Ads is fully supported today. Meta and LinkedIn are on the roadmap; reach out if either is critical to your workflow.',
    },
    {
      q: 'Is the client report white-labeled?',
      a: 'Yes. Each report is shareable as a clean read-only document under your agency name with no Retainr branding in the body.',
    },
  ]
  return (
    <section className="lp-section-pad" style={{ background: C.surfaceWarm, paddingTop: 96, paddingBottom: 96 }}>
      <div style={{ maxWidth: 760, margin: '0 auto' }}>
        <SectionEyebrow center>Common questions</SectionEyebrow>
        <h2 className="lp-h2" style={{
          ...F.heading, fontWeight: 600, color: C.text,
          margin: 0, textAlign: 'center', marginBottom: 56,
        }}>
          Before you ask.
        </h2>

        <div>
          {items.map((it) => (
            <details key={it.q} className="lp-faq" style={{
              borderTop: `1px solid ${C.border}`,
              padding: '20px 0',
            }}>
              <summary style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                gap: 16,
                ...F.heading, fontSize: 18, fontWeight: 600,
                color: C.text, lineHeight: 1.4,
              }}>
                <span>{it.q}</span>
                <span className="lp-faq-icon" style={{
                  ...F.body, fontSize: 18, color: C.textMuted,
                  transition: 'transform 0.2s',
                  flexShrink: 0,
                }}>+</span>
              </summary>
              <p style={{
                ...F.body, fontSize: 15, lineHeight: 1.65,
                color: C.textMuted, margin: 0, marginTop: 14,
                maxWidth: 640,
              }}>
                {it.a}
              </p>
            </details>
          ))}
          <div style={{ borderTop: `1px solid ${C.border}` }} />
        </div>
      </div>
    </section>
  )
}

/* ─────────── Final CTA ─────────── */

function FinalCTA() {
  return (
    <section style={{
      padding: '120px 32px', background: C.bg,
      borderTop: `1px solid ${C.border}`,
    }}>
      <div style={{ maxWidth: 760, margin: '0 auto', textAlign: 'center' }}>
        <h2 className="lp-cta-headline" style={{
          ...F.heading, fontWeight: 600,
          color: C.text, margin: 0, marginBottom: 22,
        }}>
          Connect Google Ads in two minutes.<br />
          Send your first client report tonight.
        </h2>
        <p style={{
          ...F.body, fontSize: 17, lineHeight: 1.6,
          color: C.textMuted,
          margin: '0 auto 36px', maxWidth: 540,
        }}>
          If you're not sending a real client report within your first
          week of using Retainr, we'll refund you — no questions asked.
        </p>
        <Link to="/checkout?plan=pro&billing=monthly" className="lp-cta-primary" style={btnPrimary}>
          Start Free Trial
        </Link>
        <p style={{
          ...F.body, fontSize: 13, color: C.textFaint,
          margin: '20px 0 0 0',
        }}>
          14-day free trial · No credit card required
        </p>
      </div>
    </section>
  )
}

/* ─────────── Section primitives ─────────── */

function SectionEyebrow({ children, center }) {
  return (
    <div style={{
      ...F.body, fontSize: 12, fontWeight: 600,
      letterSpacing: '0.12em', textTransform: 'uppercase',
      color: C.textFaint,
      textAlign: center ? 'center' : 'left',
      marginBottom: 16,
    }}>
      {children}
    </div>
  )
}

/* ─────────── Footer ─────────── */

function Footer() {
  return (
    <footer style={{
      padding: '48px 32px',
      borderTop: `1px solid ${C.border}`,
      background: C.bg,
    }}>
      <div style={{
        maxWidth: MAX, margin: '0 auto',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: 16,
      }}>
        <div style={{
          ...F.heading, fontSize: 16, fontWeight: 600,
          color: C.text, letterSpacing: '-0.01em',
        }}>
          retainr
        </div>
        <div style={{
          display: 'flex', flexWrap: 'wrap', gap: 24,
          ...F.body, fontSize: 13, color: C.textMuted,
        }}>
          <Link to="/privacy"  className="lp-link" style={footerLink}>Privacy</Link>
          <Link to="/terms"    className="lp-link" style={footerLink}>Terms</Link>
          <Link to="/security" className="lp-link" style={footerLink}>Security</Link>
          <Link to="/support"  className="lp-link" style={footerLink}>Support</Link>
          <Link to="/login"    className="lp-link" style={footerLink}>Sign in</Link>
          <a href="mailto:hello@retainr.io" className="lp-link" style={footerLink}>Contact</a>
        </div>
        <div style={{ ...F.body, fontSize: 12, color: C.textFaint }}>
          © 2026 Retainr
        </div>
      </div>
    </footer>
  )
}

const footerLink = { color: C.textMuted, textDecoration: 'none', transition: 'color 0.15s' }
