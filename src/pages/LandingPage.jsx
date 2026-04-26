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
  surfaceWarm:  '#F5F4F0',     // pricing-section background tint, very subtle
  text:         '#111111',
  textBody:     '#1F1F1F',
  textMuted:    '#5A5A5A',
  textFaint:    '#8A8A8A',
  border:       'rgba(17,17,17,0.08)',
  borderStrong: 'rgba(17,17,17,0.14)',
  accent:       '#0F1E40',     // deep navy — CTAs and report rule only
}

const MAX = 1180

/* ─────────── Page ─────────── */

export default function LandingPage() {
  const [billing, setBilling] = useState('monthly')

  return (
    <div style={{
      ...F.body,
      color: C.textBody,
      background: C.bg,
      WebkitFontSmoothing: 'antialiased',
      MozOsxFontSmoothing: 'grayscale',
    }}>
      <Nav />
      <Hero />
      <WhatThisReplaces />
      <Value />
      <CompetitorContrast />
      <Pricing billing={billing} setBilling={setBilling} />
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
      borderBottom: `1px solid ${C.border}`,
    }}>
      <div style={{
        maxWidth: MAX, margin: '0 auto',
        padding: '18px 32px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <a href="/" style={{
          ...F.heading, fontSize: 19, fontWeight: 600,
          color: C.text, letterSpacing: '-0.01em', textDecoration: 'none',
        }}>
          retainr
        </a>
        <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
          <a href="#pricing" style={navLink}>Pricing</a>
          <a href="#sample" style={navLink}>Sample report</a>
          <Link to="/login" style={navLink}>Sign in</Link>
          <Link
            to="/checkout?plan=pro&billing=monthly"
            style={btnPrimarySmall}
          >
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
}
const btnPrimarySmall = {
  ...F.body, fontSize: 14, fontWeight: 500,
  color: '#FFFFFF', background: C.accent,
  padding: '9px 18px', borderRadius: 8,
  textDecoration: 'none',
  border: 'none', cursor: 'pointer',
}

/* ─────────── Hero ─────────── */

function Hero() {
  return (
    <section style={{ padding: '120px 32px 100px' }}>
      <div style={{
        maxWidth: MAX, margin: '0 auto',
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80,
        alignItems: 'center',
      }}>
        {/* LEFT — copy + CTAs */}
        <div>
          <h1 style={{
            ...F.heading,
            fontSize: 56, fontWeight: 600,
            lineHeight: 1.05, letterSpacing: '-0.025em',
            color: C.text, margin: 0, marginBottom: 24,
            maxWidth: 560,
          }}>
            Turn every account manager into a high-performing communicator.
          </h1>

          <p style={{
            ...F.body,
            fontSize: 19, fontWeight: 400,
            lineHeight: 1.55, color: C.textMuted,
            margin: 0, marginBottom: 20, maxWidth: 520,
          }}>
            Turn Google Ads performance data into client-ready updates,
            explanations, and talking points in seconds.
          </p>

          <p style={{
            ...F.body,
            fontSize: 15, fontWeight: 400,
            lineHeight: 1.6, color: C.textFaint,
            margin: 0, marginBottom: 36, maxWidth: 480,
          }}>
            Traditional reporting tools show performance.<br />
            Retainr helps your team explain it.
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <Link to="/checkout?plan=pro&billing=monthly" style={btnPrimary}>
              Start Free Trial
            </Link>
            <a href="#sample" style={btnGhost}>
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

        {/* RIGHT — the report document (the hero asset) */}
        <div id="sample">
          <ReportDocument />
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
}
const btnGhost = {
  ...F.body, fontSize: 15, fontWeight: 500,
  color: C.text, background: 'transparent',
  padding: '13px 22px', borderRadius: 8,
  textDecoration: 'none',
  display: 'inline-flex', alignItems: 'center', gap: 8,
  border: `1px solid ${C.borderStrong}`, cursor: 'pointer',
}

/* ─────────── Report document (hero right column) ─────────── */

function ReportDocument() {
  return (
    <article style={{
      background: C.surface,
      border: `1px solid ${C.border}`,
      borderRadius: 4,                   // editorial / paper feel, not pill
      boxShadow: '0 24px 60px -24px rgba(17,17,17,0.18), 0 2px 6px rgba(17,17,17,0.04)',
      overflow: 'hidden',
    }}>
      {/* Slim navy rule (only place navy appears in the report) */}
      <div style={{ height: 3, background: C.accent }} />

      {/* Doc header */}
      <header style={{ padding: '32px 36px 22px', borderBottom: `1px solid ${C.border}` }}>
        <div style={{
          ...F.body, fontSize: 11, fontWeight: 600,
          letterSpacing: '0.10em', textTransform: 'uppercase',
          color: C.textFaint, marginBottom: 8,
        }}>
          Monthly Performance Report · April 2025
        </div>
        <h3 style={{
          ...F.heading, fontSize: 24, fontWeight: 600,
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
      <div style={{ padding: '28px 36px 32px', display: 'flex', flexDirection: 'column', gap: 26 }}>

        {/* 1. Narrative */}
        <DocSection label="Monthly Performance Narrative">
          <p style={{
            ...F.body, fontSize: 14, lineHeight: 1.65,
            color: C.textBody, margin: 0,
          }}>
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

        {/* 2. Key takeaway */}
        <DocSection label="Key Takeaway">
          <p style={{
            ...F.body, fontSize: 14, lineHeight: 1.65,
            color: C.textBody, margin: 0,
            paddingLeft: 14, borderLeft: `2px solid ${C.accent}`,
          }}>
            Performance gains were driven by efficiency improvements rather
            than increased spend.
          </p>
        </DocSection>

        {/* 3. Client explanations */}
        <DocSection label="How to Explain This to the Client">
          <ul style={{ ...docList, gap: 10 }}>
            <li style={docLi}>"We improved efficiency this month without increasing your budget."</li>
            <li style={docLi}>"We're seeing stronger performance from higher-intent search traffic."</li>
            <li style={docLi}>"The account is becoming more efficient as we refine spend allocation."</li>
          </ul>
        </DocSection>

        {/* 4. Talking points */}
        <DocSection label="Talking Points">
          <ul style={{ ...docList, gap: 10 }}>
            <li style={docLi}>This month is about efficiency gains, not just volume.</li>
            <li style={docLi}>We're improving how budget is allocated across intent levels.</li>
            <li style={docLi}>The account is trending toward higher-quality traffic overall.</li>
          </ul>
        </DocSection>

      </div>
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

const docList = {
  listStyle: 'none', padding: 0, margin: '12px 0 0 0',
  display: 'flex', flexDirection: 'column', gap: 6,
}
const docLi = {
  ...F.body, fontSize: 14, lineHeight: 1.6,
  color: C.textBody,
  paddingLeft: 16, position: 'relative',
}
const docStrong = { fontWeight: 600, color: C.text }

// Bullet markers via :before — done inline by appending a span instead
// (kept simple: just left-padding plus visual rhythm; the prose carries weight)

/* ─────────── What this replaces ─────────── */

function WhatThisReplaces() {
  const items = [
    'Writing monthly client updates manually',
    'Preparing account manager talking points',
    'Inconsistent client communication across teams',
  ]
  return (
    <section style={{ padding: '120px 32px', background: C.bg }}>
      <div style={{ maxWidth: MAX, margin: '0 auto' }}>
        <SectionEyebrow>What this replaces</SectionEyebrow>
        <h2 style={sectionH2}>The work your team does today.</h2>

        <ul style={{
          listStyle: 'none', padding: 0, margin: '64px 0 0 0',
          display: 'flex', flexDirection: 'column',
          maxWidth: 760,
        }}>
          {items.map((it) => (
            <li key={it} style={{
              ...F.body, fontSize: 22, fontWeight: 400,
              lineHeight: 1.5, color: C.text,
              padding: '24px 0',
              borderBottom: `1px solid ${C.border}`,
            }}>
              {it}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

/* ─────────── Value ─────────── */

function Value() {
  const items = [
    'Standardize client communication.',
    'Save account manager time.',
    'Improve client-facing consistency.',
  ]
  return (
    <section style={{ padding: '120px 32px', background: C.surfaceWarm }}>
      <div style={{ maxWidth: MAX, margin: '0 auto' }}>
        <SectionEyebrow>Why agencies use it</SectionEyebrow>
        <h2 style={sectionH2}>Three outcomes. Nothing extra.</h2>

        <div style={{
          marginTop: 80,
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 64,
          maxWidth: 1000,
        }}>
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
  return (
    <section style={{ padding: '140px 32px', background: C.bg }}>
      <div style={{
        maxWidth: 880, margin: '0 auto',
        textAlign: 'center',
      }}>
        <SectionEyebrow center>Compared to reporting tools</SectionEyebrow>
        <h2 style={{
          ...F.heading, fontSize: 44, fontWeight: 600,
          lineHeight: 1.15, letterSpacing: '-0.02em',
          color: C.text, margin: '24px 0 0 0',
        }}>
          Traditional reporting tools show what happened.<br />
          <span style={{ color: C.textMuted }}>Retainr helps your team explain it.</span>
        </h2>
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
    <section id="pricing" style={{ padding: '120px 32px', background: C.surfaceWarm }}>
      <div style={{ maxWidth: MAX, margin: '0 auto' }}>
        <div style={{ textAlign: 'center' }}>
          <SectionEyebrow center>Pricing</SectionEyebrow>
          <h2 style={{ ...sectionH2, textAlign: 'center', marginLeft: 'auto', marginRight: 'auto' }}>
            Simple plans. No usage games.
          </h2>
          <p style={{
            ...F.body, fontSize: 16, lineHeight: 1.6,
            color: C.textMuted, margin: '14px auto 0',
            maxWidth: 540,
          }}>
            14-day free trial. No credit card required. Cancel any time.
          </p>

          <BillingToggle billing={billing} setBilling={setBilling} />
        </div>

        <div style={{
          marginTop: 28,
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20,
          maxWidth: 1080, margin: '28px auto 0',
        }}>
          {plans.map((p) => {
            const price = billing === 'yearly' ? p.yearly : p.monthly
            return (
              <div
                key={p.key}
                style={{
                  background: p.featured ? C.surface : 'transparent',
                  border: `1px solid ${p.featured ? C.borderStrong : C.border}`,
                  borderRadius: 12,
                  padding: '36px 32px',
                  display: 'flex', flexDirection: 'column',
                }}
              >
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
}
const planCTAOutline = {
  ...F.body, fontSize: 14, fontWeight: 500,
  color: C.text, background: 'transparent',
  padding: '12px 0', borderRadius: 8,
  textDecoration: 'none', textAlign: 'center',
  border: `1px solid ${C.borderStrong}`,
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
            background: active ? 'rgba(255,255,255,0.18)' : 'rgba(15,30,64,0.10)',
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

/* ─────────── Final CTA ─────────── */

function FinalCTA() {
  return (
    <section style={{
      padding: '140px 32px',
      background: C.bg,
      borderTop: `1px solid ${C.border}`,
    }}>
      <div style={{
        maxWidth: 760, margin: '0 auto',
        textAlign: 'center',
      }}>
        <h2 style={{
          ...F.heading, fontSize: 48, fontWeight: 600,
          lineHeight: 1.1, letterSpacing: '-0.025em',
          color: C.text, margin: 0, marginBottom: 24,
        }}>
          See your first client-ready report in 60 seconds.
        </h2>
        <p style={{
          ...F.body, fontSize: 17, lineHeight: 1.6,
          color: C.textMuted,
          margin: '0 auto 36px', maxWidth: 520,
        }}>
          Connect Google Ads, generate a finished narrative, and send it
          to your client — without writing a word.
        </p>
        <Link to="/checkout?plan=pro&billing=monthly" style={btnPrimary}>
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

const sectionH2 = {
  ...F.heading, fontSize: 44, fontWeight: 600,
  lineHeight: 1.12, letterSpacing: '-0.02em',
  color: C.text, margin: 0, maxWidth: 720,
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
          <Link to="/privacy"  style={footerLink}>Privacy</Link>
          <Link to="/terms"    style={footerLink}>Terms</Link>
          <Link to="/security" style={footerLink}>Security</Link>
          <Link to="/support"  style={footerLink}>Support</Link>
          <Link to="/login"    style={footerLink}>Sign in</Link>
          <a href="mailto:hello@retainr.io" style={footerLink}>Contact</a>
        </div>
        <div style={{ ...F.body, fontSize: 12, color: C.textFaint }}>
          © 2026 Retainr
        </div>
      </div>
    </footer>
  )
}

const footerLink = { color: C.textMuted, textDecoration: 'none' }
