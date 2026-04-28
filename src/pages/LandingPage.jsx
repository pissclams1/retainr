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
  heroTint:     '#EFEAE0',     // soft cream gradient stop for hero backdrop
  text:         '#111111',
  textBody:     '#1F1F1F',
  textMuted:    '#5A5A5A',
  textFaint:    '#8A8A8A',
  border:       'rgba(17,17,17,0.08)',
  borderStrong: 'rgba(17,17,17,0.14)',
  accent:       '#0F1E40',
  accentTint:   'rgba(15,30,64,0.08)',
  highlight:    '#E8D7A8',     // warm sand — used only for headline accent underline
  highlightBg:  '#F5E8C8',
  positive:     '#15803D',
}

const MAX = 1180

/* ─────────── Page CSS (responsive + base) ─────────── */

const PAGE_CSS = `
  html, body { background: ${C.bg}; }
  * { box-sizing: border-box; }
  ::selection { background: ${C.accentTint}; color: ${C.text}; }

  .lp-hero-backdrop {
    background:
      radial-gradient(ellipse 1100px 460px at 50% 0%, ${C.heroTint} 0%, rgba(239,234,224,0) 70%),
      ${C.bg};
  }

  .lp-section-grid-3 {
    display: grid; grid-template-columns: repeat(3, 1fr); gap: 32px;
  }
  .lp-section-grid-4 {
    display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px;
  }
  .lp-section-grid-2 {
    display: grid; grid-template-columns: 1fr 1fr; gap: 32px;
  }
  .lp-pricing-grid {
    display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px;
    max-width: 1080px; margin: 28px auto 0;
  }
  .lp-section-pad { padding: 120px 32px; }

  .lp-h1 {
    font-size: 64px; line-height: 1.04; letter-spacing: -0.025em;
  }
  .lp-h2 { font-size: 44px; line-height: 1.12; letter-spacing: -0.02em; }
  .lp-cta-headline { font-size: 48px; line-height: 1.08; letter-spacing: -0.025em; }

  .lp-headline-accent {
    background-image: linear-gradient(transparent 64%, ${C.highlightBg} 64%, ${C.highlightBg} 92%, transparent 92%);
    background-size: 100% 100%;
    background-repeat: no-repeat;
    padding: 0 2px;
  }

  /* Logo strip greyscale */
  .lp-logo-strip span {
    color: ${C.textFaint};
    font-weight: 600;
    letter-spacing: -0.01em;
    transition: color 0.15s, opacity 0.15s;
    opacity: 0.7;
  }
  .lp-logo-strip span:hover { color: ${C.text}; opacity: 1; }

  /* Tablet */
  @media (max-width: 960px) {
    .lp-section-grid-4 { grid-template-columns: repeat(2, 1fr); }
    .lp-section-grid-2 { grid-template-columns: 1fr; gap: 32px; }
    .lp-h1 { font-size: 48px; }
    .lp-h2 { font-size: 34px; }
    .lp-cta-headline { font-size: 36px; }
    .lp-section-pad { padding: 96px 24px; }
    .lp-floating-card { display: none !important; }
  }
  /* Mobile */
  @media (max-width: 640px) {
    .lp-section-grid-3 { grid-template-columns: 1fr; gap: 36px; }
    .lp-section-grid-4 { grid-template-columns: 1fr; gap: 12px; }
    .lp-pricing-grid { grid-template-columns: 1fr; }
    .lp-h1 { font-size: 38px; }
    .lp-h2 { font-size: 28px; }
    .lp-cta-headline { font-size: 30px; }
    .lp-section-pad { padding: 72px 20px; }
    .lp-nav-links { display: none !important; }
  }

  /* Affordances */
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
      <StatsRow />
      <LogoStrip />
      <BeforeAfter />
      <HowItWorks />
      <Outputs />
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
          <Link to="/sample-report" className="lp-link" style={navLink}>Sample reports</Link>
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

/* ─────────── Hero (centered, dominant report, gradient backdrop, floating cards) ─────────── */

function Hero() {
  return (
    <section className="lp-hero-backdrop" style={{ padding: '88px 32px 60px' }}>
      <div style={{ maxWidth: MAX, margin: '0 auto', textAlign: 'center' }}>
        <div style={{
          ...F.body, fontSize: 13, fontWeight: 500,
          color: C.textMuted, marginBottom: 20,
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: C.surface, padding: '6px 14px',
          border: `1px solid ${C.border}`, borderRadius: 100,
        }}>
          <span style={{
            width: 6, height: 6, borderRadius: '50%',
            background: C.positive, flexShrink: 0,
          }} />
          Built for Google Ads agencies and performance marketing teams
        </div>

        <h1 className="lp-h1" style={{
          ...F.heading, fontWeight: 700, color: C.text,
          margin: 0, marginBottom: 22, maxWidth: 880,
          marginLeft: 'auto', marginRight: 'auto',
        }}>
          Every Account Manager becomes an{' '}
          <span className="lp-headline-accent">excellent</span>
          {' '}client communicator.
        </h1>

        <p style={{
          ...F.body, fontSize: 20, fontWeight: 400,
          lineHeight: 1.55, color: C.textMuted,
          margin: '0 auto 14px', maxWidth: 680,
        }}>
          Generate client-ready Google Ads updates, explanations, and
          talking points in seconds.
        </p>
        <p style={{
          ...F.body, fontSize: 15, fontWeight: 400,
          lineHeight: 1.6, color: C.textFaint,
          margin: '0 auto 36px', maxWidth: 540,
        }}>
          Replace the writing your account managers do manually every month.
        </p>

        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          gap: 14, flexWrap: 'wrap', marginBottom: 16,
        }}>
          <Link to="/checkout?plan=pro&billing=monthly" className="lp-cta-primary" style={btnPrimary}>
            Start Free Trial
          </Link>
          <Link to="/sample-report" className="lp-cta-ghost" style={btnGhost}>
            See Sample Report
          </Link>
        </div>
        <p style={{ ...F.body, fontSize: 13, color: C.textFaint, margin: 0, marginBottom: 64 }}>
          14-day free trial · No credit card required
        </p>

        {/* The product — large report doc, dominant */}
        <div style={{ maxWidth: 880, margin: '0 auto' }}>
          <ReportDocument />
        </div>
      </div>
    </section>
  )
}

const btnPrimary = {
  ...F.body, fontSize: 15, fontWeight: 500,
  color: '#FFFFFF', background: C.accent,
  padding: '14px 26px', borderRadius: 8,
  textDecoration: 'none',
  display: 'inline-flex', alignItems: 'center', gap: 8,
  border: 'none', cursor: 'pointer',
  transition: 'background 0.15s',
  boxShadow: '0 8px 16px -8px rgba(15,30,64,0.40)',
}
const btnGhost = {
  ...F.body, fontSize: 15, fontWeight: 500,
  color: C.text, background: C.surface,
  padding: '13px 24px', borderRadius: 8,
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
      borderRadius: 2,
      boxShadow: [
        '0 1px 0 rgba(255,255,255,0.7) inset',
        '0 1px 0 rgba(17,17,17,0.04)',
        '0 8px 16px -8px rgba(17,17,17,0.10)',
        '0 36px 80px -20px rgba(17,17,17,0.25)',
      ].join(', '),
      overflow: 'hidden',
      textAlign: 'left',
    }}>
      <div style={{ height: 4, background: C.accent }} />

      <header style={{ padding: '40px 48px 24px', borderBottom: `1px solid ${C.border}` }}>
        <div style={{
          ...F.body, fontSize: 11, fontWeight: 600,
          letterSpacing: '0.10em', textTransform: 'uppercase',
          color: C.textFaint, marginBottom: 10,
        }}>
          Monthly Performance Report · April 2025
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 24, flexWrap: 'wrap' }}>
          <h3 style={{
            ...F.heading, fontSize: 30, fontWeight: 700,
            lineHeight: 1.15, color: C.text,
            margin: 0,
          }}>
            Apex Digital
          </h3>
          <div style={{
            ...F.body, fontSize: 12, color: C.textFaint,
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: C.positive }} />
            Generated by retainr · 47 sec
          </div>
        </div>
      </header>

      {/* Performance metrics — communicates that real data is being pulled */}
      <div style={{ padding: '20px 48px 24px', borderBottom: `1px solid ${C.border}`, background: C.bg }}>
        <div style={{
          ...F.body, fontSize: 10, fontWeight: 600,
          letterSpacing: '0.10em', textTransform: 'uppercase',
          color: C.textFaint, marginBottom: 12,
        }}>
          Performance Summary · April vs March 2025
        </div>
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px',
        }}>
          {[
            { label: 'Impressions',  value: '284,512', delta: '+3%',   up: true  },
            { label: 'Clicks',       value: '8,204',   delta: '+7%',   up: true  },
            { label: 'CTR',          value: '2.88%',   delta: '+4%',   up: true  },
            { label: 'Conversions',  value: '1,284',   delta: '+18%',  up: true  },
            { label: 'Cost / Conv.', value: '$41.32',  delta: '+11%',  up: true  },
            { label: 'Spend',        value: '$53,056', delta: '+5%',   up: null  },
          ].map(m => (
            <div key={m.label} style={{
              padding: '10px 12px',
              background: C.surface, borderRadius: 6,
              border: `1px solid ${C.border}`,
            }}>
              <div style={{
                ...F.body, fontSize: 10, fontWeight: 500,
                color: C.textFaint, marginBottom: 4,
              }}>{m.label}</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 5 }}>
                <span style={{
                  ...F.heading, fontSize: 15, fontWeight: 600, color: C.text,
                }}>{m.value}</span>
                <span style={{
                  ...F.body, fontSize: 10, fontWeight: 600,
                  color: m.up === null ? C.textFaint : m.delta.startsWith('+') ? C.positive : '#DC2626',
                }}>{m.delta}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: '32px 48px 36px', display: 'flex', flexDirection: 'column', gap: 30 }}>
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
            paddingLeft: 16, borderLeft: `2px solid ${C.accent}`,
            background: C.accentTint, padding: '14px 16px',
            borderRadius: '0 4px 4px 0',
          }}>
            Performance gains were driven by efficiency improvements rather
            than increased spend.
          </p>
        </DocSection>

        {/* Internal divider */}
        <InternalDivider />

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

      <footer style={{
        padding: '14px 48px',
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

function InternalDivider() {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      margin: '4px 0',
    }}>
      <div style={{ flex: 1, borderTop: `1px dashed ${C.border}` }} />
      <div style={{
        ...F.body, fontSize: 10, fontWeight: 600,
        letterSpacing: '0.10em', textTransform: 'uppercase',
        color: C.textFaint,
        background: C.accentTint,
        padding: '3px 10px', borderRadius: 20,
        whiteSpace: 'nowrap',
      }}>
        For your team · not sent to client
      </div>
      <div style={{ flex: 1, borderTop: `1px dashed ${C.border}` }} />
    </div>
  )
}

const docProse = { ...F.body, fontSize: 15, lineHeight: 1.65, color: C.textBody }
const docList = {
  listStyle: 'none', padding: 0, margin: '14px 0 0 0',
  display: 'flex', flexDirection: 'column', gap: 6,
}
const docLi = { ...F.body, fontSize: 14, lineHeight: 1.6, color: C.textBody }
const docStrong = { fontWeight: 600, color: C.text }

/* ─────────── Stats row ─────────── */

function StatsRow() {
  const stats = [
    { num: '6h → 20m', label: 'Time per client report' },
    { num: '<60 sec',  label: 'First report after connecting' },
    { num: '100%',     label: 'AMs with consistent talking points' },
  ]
  return (
    <section style={{ padding: '32px', background: C.bg, borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}` }}>
      <div className="lp-section-grid-3" style={{ maxWidth: MAX, margin: '0 auto' }}>
        {stats.map((s, i) => (
          <div key={s.label} style={{
            textAlign: 'center', padding: '12px 16px',
            borderRight: i < stats.length - 1 ? `1px solid ${C.border}` : 'none',
          }}>
            <div style={{
              ...F.heading, fontSize: 32, fontWeight: 700,
              color: C.text, lineHeight: 1.1, marginBottom: 6,
              letterSpacing: '-0.02em',
            }}>
              {s.num}
            </div>
            <div style={{
              ...F.body, fontSize: 13, color: C.textMuted,
            }}>
              {s.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

/* ─────────── Logo strip (placeholder agency-types) ─────────── */

function LogoStrip() {
  const logos = ['NORTHSTAR', 'APEX DIGITAL', 'MERIDIAN ADS', 'BLUE PARTNERS', 'TIDEWATER GROWTH', 'COVALENT']
  return (
    <section style={{ padding: '52px 32px', background: C.bg }}>
      <div style={{ maxWidth: MAX, margin: '0 auto' }}>
        <div style={{
          ...F.body, fontSize: 12, fontWeight: 600,
          letterSpacing: '0.16em', textTransform: 'uppercase',
          color: C.textFaint, textAlign: 'center', marginBottom: 28,
        }}>
          Used by performance agencies on $500K–$50M in client spend
        </div>
        <div className="lp-logo-strip" style={{
          display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center',
          gap: '20px 56px',
        }}>
          {logos.map((l) => (
            <span key={l} style={{
              ...F.heading, fontSize: 15,
            }}>
              {l}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─────────── Before / After transformation ─────────── */

function BeforeAfter() {
  return (
    <section className="lp-section-pad" style={{ background: C.surfaceWarm }}>
      <div style={{ maxWidth: MAX, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <SectionEyebrow center>The transformation</SectionEyebrow>
          <h2 className="lp-h2" style={{
            ...F.heading, fontWeight: 700, color: C.text,
            margin: 0, textAlign: 'center',
            maxWidth: 760, marginLeft: 'auto', marginRight: 'auto',
          }}>
            From <span style={{ color: C.textMuted }}>90 minutes</span> to two.
          </h2>
        </div>

        <div className="lp-section-grid-2" style={{ maxWidth: 1040, margin: '0 auto' }}>
          {/* Before */}
          <div style={{
            background: C.surface,
            border: `1px solid ${C.border}`,
            borderRadius: 14,
            padding: '36px 36px 32px',
            position: 'relative',
            opacity: 0.92,
          }}>
            <div style={{
              ...F.body, fontSize: 11, fontWeight: 600,
              letterSpacing: '0.12em', textTransform: 'uppercase',
              color: C.textFaint, marginBottom: 14,
            }}>
              Before Retainr
            </div>
            <h3 style={{
              ...F.heading, fontSize: 22, fontWeight: 600,
              lineHeight: 1.3, color: C.textMuted,
              margin: 0, marginBottom: 16,
              textDecoration: 'line-through',
              textDecorationColor: 'rgba(17,17,17,0.20)',
              textDecorationThickness: 1,
            }}>
              Manual writing every month
            </h3>
            <p style={{
              ...F.body, fontSize: 15, lineHeight: 1.7,
              color: C.textMuted, margin: 0,
            }}>
              Your AM stares at a Google Ads dashboard for 90 minutes,
              copies five numbers into a Google Doc, hand-writes
              "performance is stable, here are the highlights" three
              different ways, and sends the email at 11pm before tomorrow's
              client call.
            </p>
          </div>

          {/* After */}
          <div style={{
            background: C.surface,
            border: `1px solid ${C.borderStrong}`,
            borderRadius: 14,
            padding: '36px 36px 32px',
            position: 'relative',
            boxShadow: '0 24px 50px -24px rgba(17,17,17,0.18)',
          }}>
            <div style={{
              position: 'absolute', top: -12, left: 24,
              ...F.body, fontSize: 10, fontWeight: 600,
              letterSpacing: '0.10em', textTransform: 'uppercase',
              color: C.accent, background: C.surface,
              padding: '4px 10px', borderRadius: 20,
              border: `1px solid ${C.borderStrong}`,
            }}>
              With retainr
            </div>
            <div style={{
              ...F.body, fontSize: 11, fontWeight: 600,
              letterSpacing: '0.12em', textTransform: 'uppercase',
              color: C.accent, marginBottom: 14,
            }}>
              After Retainr
            </div>
            <h3 style={{
              ...F.heading, fontSize: 22, fontWeight: 600,
              lineHeight: 1.3, color: C.text,
              margin: 0, marginBottom: 16,
            }}>
              One click, finished narrative
            </h3>
            <p style={{
              ...F.body, fontSize: 15, lineHeight: 1.7,
              color: C.textBody, margin: 0,
            }}>
              Connect the account, click Generate. Two minutes later your
              AM reviews a finished narrative with talking points, copies
              the share link to the client, and sends it before lunch —
              with the same quality every account, every month.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─────────── How it works ─────────── */

function HowItWorks() {
  const steps = [
    { n: '01', title: 'Connect Google Ads.', desc: 'Read-only OAuth. We never modify campaigns or budgets.' },
    { n: '02', title: 'Pick a client account.', desc: 'We pull the last 90 days and generate the first report immediately.' },
    { n: '03', title: 'Send the report.', desc: 'Share a read-only link, copy to email, or download a PDF.' },
  ]
  return (
    <section id="how" className="lp-section-pad">
      <div style={{ maxWidth: MAX, margin: '0 auto' }}>
        <SectionEyebrow>How it works</SectionEyebrow>
        <h2 className="lp-h2" style={{ ...F.heading, fontWeight: 700, color: C.text, margin: 0, maxWidth: 720 }}>
          Connected on Monday. <span style={{ color: C.textMuted }}>Sending reports by Tuesday.</span>
        </h2>

        <div className="lp-section-grid-3" style={{ marginTop: 72, maxWidth: 1080 }}>
          {steps.map((s) => (
            <div key={s.n} style={{ borderTop: `1px solid ${C.borderStrong}`, paddingTop: 22 }}>
              <div style={{
                ...F.heading, fontSize: 14, fontWeight: 700,
                color: C.accent, marginBottom: 14, letterSpacing: '0.04em',
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

/* ─────────── Outputs grid (4 zoomed-in section previews) ─────────── */

function Outputs() {
  return (
    <section className="lp-section-pad" style={{ background: C.surfaceWarm }}>
      <div style={{ maxWidth: MAX, margin: '0 auto', textAlign: 'center' }}>
        <SectionEyebrow center>Everything in one report</SectionEyebrow>
        <h2 className="lp-h2" style={{
          ...F.heading, fontWeight: 700, color: C.text,
          margin: '0 auto 14px', maxWidth: 720,
        }}>
          Four sections. Generated automatically.
        </h2>
        <p style={{
          ...F.body, fontSize: 16, lineHeight: 1.6,
          color: C.textMuted, margin: '0 auto 56px', maxWidth: 600,
        }}>
          Every Retainr report contains the same four sections, written from your
          actual Google Ads performance — no templates, no copy-paste.
        </p>

        <div className="lp-section-grid-4">
          <OutputCard
            label="01 · Narrative"
            title="Monthly Performance Narrative"
            preview={(
              <>
                <p style={{ ...docProse, fontSize: 12, margin: 0, lineHeight: 1.55 }}>
                  Performance improved this month, driven by stronger
                  efficiency in high-intent campaigns…
                </p>
              </>
            )}
          />
          <OutputCard
            label="02 · Takeaway"
            title="Key Takeaway"
            preview={(
              <p style={{
                ...docProse, fontSize: 12, margin: 0, lineHeight: 1.55,
                paddingLeft: 10, borderLeft: `2px solid ${C.accent}`,
              }}>
                Gains were driven by efficiency improvements, not increased spend.
              </p>
            )}
          />
          <OutputCard
            label="03 · Explanations"
            title="How to Explain to Client"
            preview={(
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
                <li style={{ ...docLi, fontSize: 12, lineHeight: 1.5 }}>"We improved efficiency this month…"</li>
                <li style={{ ...docLi, fontSize: 12, lineHeight: 1.5 }}>"Stronger higher-intent search traffic."</li>
              </ul>
            )}
          />
          <OutputCard
            label="04 · Talking points"
            title="Meeting Talking Points"
            preview={(
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
                <li style={{ ...docLi, fontSize: 12, lineHeight: 1.5, color: C.textBody }}>› Efficiency gains, not volume.</li>
                <li style={{ ...docLi, fontSize: 12, lineHeight: 1.5, color: C.textBody }}>› Allocation across intent levels.</li>
              </ul>
            )}
          />
        </div>
      </div>
    </section>
  )
}

function OutputCard({ label, title, preview }) {
  return (
    <div style={{
      background: C.surface, border: `1px solid ${C.border}`,
      borderRadius: 12, padding: '24px 22px',
      textAlign: 'left',
      boxShadow: '0 4px 14px -8px rgba(17,17,17,0.08)',
      display: 'flex', flexDirection: 'column', gap: 14,
      minHeight: 220,
    }}>
      <div style={{
        ...F.body, fontSize: 10, fontWeight: 600,
        letterSpacing: '0.10em', textTransform: 'uppercase',
        color: C.accent,
      }}>
        {label}
      </div>
      <div style={{
        ...F.heading, fontSize: 16, fontWeight: 600,
        color: C.text, lineHeight: 1.3, letterSpacing: '-0.01em',
      }}>
        {title}
      </div>
      <div style={{
        flex: 1,
        background: C.surfaceWarm,
        border: `1px solid ${C.border}`,
        borderRadius: 6,
        padding: '14px 14px',
      }}>
        {preview}
      </div>
    </div>
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
          ...F.heading, fontWeight: 700, color: C.text,
          margin: '14px 0 0 0',
        }}>
          Traditional reporting tools show what happened.<br />
          <span style={{ color: C.textMuted }}>Retainr helps your team explain it.</span>
        </h2>

        <ul style={{
          listStyle: 'none', padding: 0, margin: '56px auto 0', maxWidth: 540,
          display: 'flex', flexDirection: 'column', gap: 0, textAlign: 'left',
        }}>
          {tools.map((t) => (
            <li key={t.name} style={{
              ...F.body, fontSize: 17, lineHeight: 1.5,
              padding: '16px 0',
              borderBottom: `1px solid ${C.border}`,
              display: 'flex', justifyContent: 'space-between', gap: 16,
              color: t.highlight ? C.text : C.textMuted,
              fontWeight: t.highlight ? 600 : 400,
            }}>
              <span>{t.name} shows</span>
              <span style={{ textAlign: 'right' }}>{t.shows}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

/* ─────────── Testimonial ─────────── */

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
            ...F.heading, fontWeight: 700, color: C.text,
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
              <div key={p.key} style={{
                position: 'relative',
                background: p.featured ? C.surface : 'transparent',
                border: `1px solid ${p.featured ? C.borderStrong : C.border}`,
                borderRadius: 14,
                padding: '36px 32px',
                display: 'flex', flexDirection: 'column',
                boxShadow: p.featured ? '0 24px 50px -24px rgba(17,17,17,0.20)' : 'none',
              }}>
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
                    ...F.heading, fontSize: 44, fontWeight: 700,
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
  textDecoration: 'none', textAlign: 'center', border: 'none',
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
      <button key={key} onClick={() => setBilling(key)} style={{
        ...F.body, fontSize: 13, fontWeight: 500,
        padding: '8px 16px', border: 'none', cursor: 'pointer', borderRadius: 7,
        background: active ? C.text : 'transparent',
        color: active ? '#FFFFFF' : C.textMuted,
        display: 'inline-flex', alignItems: 'center', gap: 8,
        transition: 'background 0.15s, color 0.15s',
      }}>
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
    { q: 'Can I cancel any time?', a: 'Yes — from the billing portal. Service continues through the end of the period you have already paid for.' },
    { q: 'What if I exceed my client account limit?', a: 'You can add accounts above the cap on a per-account basis, or move up to the next tier. We never auto-upgrade you.' },
    { q: 'Do you support Meta or LinkedIn Ads?', a: 'Google Ads is fully supported today. Meta and LinkedIn are on the roadmap; reach out if either is critical to your workflow.' },
    { q: 'Is the client report white-labeled?', a: 'Yes. Each report is shareable as a clean read-only document under your agency name with no Retainr branding in the body.' },
  ]
  return (
    <section className="lp-section-pad" style={{ background: C.surfaceWarm, paddingTop: 96, paddingBottom: 96 }}>
      <div style={{ maxWidth: 760, margin: '0 auto' }}>
        <SectionEyebrow center>Common questions</SectionEyebrow>
        <h2 className="lp-h2" style={{
          ...F.heading, fontWeight: 700, color: C.text,
          margin: 0, textAlign: 'center', marginBottom: 56,
        }}>
          Before you ask.
        </h2>
        <div>
          {items.map((it) => (
            <details key={it.q} className="lp-faq" style={{
              borderTop: `1px solid ${C.border}`, padding: '20px 0',
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
                  transition: 'transform 0.2s', flexShrink: 0,
                }}>+</span>
              </summary>
              <p style={{
                ...F.body, fontSize: 15, lineHeight: 1.65,
                color: C.textMuted, margin: 0, marginTop: 14, maxWidth: 640,
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
          ...F.heading, fontWeight: 700,
          color: C.text, margin: 0, marginBottom: 22,
        }}>
          Connect Google Ads in two minutes.<br />
          Send your first client report tonight.
        </h2>
        <p style={{
          ...F.body, fontSize: 17, lineHeight: 1.6,
          color: C.textMuted, margin: '0 auto 36px', maxWidth: 540,
        }}>
          If you're not sending a real client report within your first
          week of using Retainr, we'll refund you — no questions asked.
        </p>
        <Link to="/checkout?plan=pro&billing=monthly" className="lp-cta-primary" style={btnPrimary}>
          Start Free Trial
        </Link>
        <p style={{ ...F.body, fontSize: 13, color: C.textFaint, margin: '20px 0 0 0' }}>
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
