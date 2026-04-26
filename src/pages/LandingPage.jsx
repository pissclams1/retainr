import { useState } from 'react'
import { Link } from 'react-router-dom'
import HeroTransformation from '../components/marketing/HeroTransformation'
import CompetitorComparison from '../components/marketing/CompetitorComparison'

const S = {
  // Typography
  serif: { fontFamily: "'Instrument Serif', serif" },
  sans: { fontFamily: "'Geist', sans-serif" },

  // Nav
  nav: {
    position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
    height: 52, display: 'flex', alignItems: 'center',
    justifyContent: 'space-between', padding: '0 24px',
    background: 'rgba(15,15,14,0.85)', backdropFilter: 'blur(12px)',
    borderBottom: '1px solid rgba(255,255,255,0.08)',
  },
  navLogo: {
    fontFamily: "'Instrument Serif', serif", fontSize: 20,
    color: '#F5F5F3', letterSpacing: '-0.3px', textDecoration: 'none',
  },
  navLinks: { display: 'flex', alignItems: 'center', gap: 4 },
  navLink: {
    fontFamily: "'Geist', sans-serif", fontSize: 13, fontWeight: 400,
    color: 'rgba(245,245,243,0.60)', padding: '6px 10px',
    borderRadius: 6, textDecoration: 'none', background: 'transparent',
    border: 'none', cursor: 'pointer',
  },
  navCTA: {
    fontFamily: "'Geist', sans-serif", fontSize: 13, fontWeight: 500,
    color: '#0F0F0E', background: '#F5F5F3', padding: '7px 16px',
    borderRadius: 7, textDecoration: 'none', border: 'none',
    cursor: 'pointer', marginLeft: 8,
  },

  // Hero band — dark
  heroBand: {
    background: '#0F0F0E', paddingTop: 100, paddingBottom: 80,
    paddingLeft: 24, paddingRight: 24,
  },
  heroInner: {
    maxWidth: 1100, margin: '0 auto',
    display: 'grid', gridTemplateColumns: '1fr 1fr',
    gap: 64, alignItems: 'center',
  },
  heroEyebrow: {
    fontFamily: "'Geist', sans-serif", fontSize: 10, fontWeight: 600,
    letterSpacing: '0.14em', textTransform: 'uppercase',
    color: 'rgba(245,245,243,0.50)', marginBottom: 20,
    display: 'flex', alignItems: 'center', gap: 7,
  },
  heroDot: {
    width: 5, height: 5, borderRadius: '50%',
    background: '#C8C8BE', opacity: 0.6, flexShrink: 0,
  },
  heroHeadline: {
    fontFamily: "'Instrument Serif', serif", fontSize: 48,
    fontWeight: 400, lineHeight: 1.08, letterSpacing: '-0.5px',
    color: '#F5F5F3', marginBottom: 20,
  },
  heroItalic: { fontStyle: 'italic', color: '#C8C8BE' },
  heroSub: {
    fontFamily: "'Geist', sans-serif", fontSize: 15, fontWeight: 300,
    color: 'rgba(245,245,243,0.50)', lineHeight: 1.65,
    marginBottom: 36, maxWidth: 420,
  },
  heroCTAs: { display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' },
  ctaPrimary: {
    fontFamily: "'Geist', sans-serif", fontSize: 13, fontWeight: 500,
    color: '#0F0F0E', background: '#F5F5F3', padding: '10px 20px',
    borderRadius: 7, textDecoration: 'none', border: 'none',
    cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6,
  },
  ctaGhost: {
    fontFamily: "'Geist', sans-serif", fontSize: 13, fontWeight: 500,
    color: 'rgba(245,245,243,0.50)', background: 'transparent',
    border: '1px solid rgba(255,255,255,0.08)', padding: '10px 20px',
    borderRadius: 7, textDecoration: 'none', cursor: 'pointer',
    display: 'inline-flex', alignItems: 'center', gap: 6,
  },
  heroTrust: {
    marginTop: 20, fontFamily: "'Geist', sans-serif", fontSize: 11,
    fontWeight: 300, color: 'rgba(245,245,243,0.30)',
    display: 'flex', alignItems: 'center', gap: 12,
  },

  // Stats bar — still on dark band
  statsBar: {
    background: '#0F0F0E',
    borderTop: '1px solid rgba(255,255,255,0.08)',
    borderBottom: '1px solid rgba(255,255,255,0.08)',
    padding: '32px 24px',
  },
  statsInner: {
    maxWidth: 1100, margin: '0 auto',
    display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
  },
  statItem: {
    padding: '0 32px', borderRight: '1px solid rgba(255,255,255,0.08)',
    textAlign: 'center',
  },
  statNumber: {
    fontFamily: "'Instrument Serif', serif", fontSize: 36,
    color: '#F5F5F3', lineHeight: 1, marginBottom: 6,
  },
  statLabel: {
    fontFamily: "'Geist', sans-serif", fontSize: 11, fontWeight: 300,
    color: 'rgba(245,245,243,0.50)',
  },

  // Light sections
  section: {
    background: '#FAFAF9', padding: '88px 24px',
  },
  sectionAlt: {
    background: '#F4F4F2', padding: '88px 24px',
  },
  sectionInner: { maxWidth: 1100, margin: '0 auto' },
  sectionEyebrow: {
    fontFamily: "'Geist', sans-serif", fontSize: 10, fontWeight: 600,
    letterSpacing: '0.14em', textTransform: 'uppercase',
    color: '#9A9A94', marginBottom: 16, textAlign: 'center',
  },
  sectionHeadline: {
    fontFamily: "'Instrument Serif', serif", fontSize: 34,
    fontWeight: 400, lineHeight: 1.15, letterSpacing: '-0.3px',
    color: '#1A1A18', textAlign: 'center', marginBottom: 12,
  },
  sectionItalic: { fontStyle: 'italic', color: '#6B6B66' },
  sectionSub: {
    fontFamily: "'Geist', sans-serif", fontSize: 15, fontWeight: 300,
    color: '#6B6B66', lineHeight: 1.6, textAlign: 'center',
    maxWidth: 520, margin: '0 auto 56px',
  },

  // Two outputs grid
  outputsGrid: {
    display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16,
  },
  outputCard: {
    background: '#FAFAF9', border: '1px solid rgba(15,15,14,0.10)',
    borderRadius: 12, padding: '28px',
  },
  outputTag: {
    display: 'inline-block', fontSize: 9, fontFamily: "'Geist', sans-serif",
    fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase',
    padding: '4px 10px', borderRadius: 20, marginBottom: 16,
  },
  outputTitle: {
    fontFamily: "'Instrument Serif', serif", fontSize: 22,
    color: '#1A1A18', marginBottom: 10, lineHeight: 1.2,
  },
  outputDesc: {
    fontFamily: "'Geist', sans-serif", fontSize: 13, fontWeight: 300,
    color: '#6B6B66', lineHeight: 1.65, marginBottom: 20,
  },

  // Steps grid
  stepsGrid: {
    display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 1, background: 'rgba(15,15,14,0.10)',
    border: '1px solid rgba(15,15,14,0.10)',
    borderRadius: 12, overflow: 'hidden',
  },
  stepItem: { padding: '32px 28px', background: '#FAFAF9' },
  stepNum: {
    fontFamily: "'Instrument Serif', serif", fontSize: 48,
    color: 'rgba(15,15,14,0.07)', lineHeight: 1, marginBottom: 20,
  },
  stepTitle: {
    fontFamily: "'Geist', sans-serif", fontSize: 16, fontWeight: 500,
    color: '#1A1A18', marginBottom: 8,
  },
  stepDesc: {
    fontFamily: "'Geist', sans-serif", fontSize: 13, fontWeight: 300,
    color: '#6B6B66', lineHeight: 1.6,
  },

  // Pricing
  pricingGrid: {
    display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 16, maxWidth: 900, margin: '0 auto',
  },
  priceCard: {
    background: '#FAFAF9', border: '1px solid rgba(15,15,14,0.10)',
    borderRadius: 12, padding: '28px 24px', position: 'relative',
  },
  priceCardFeatured: {
    background: '#F4F4F2', border: '1px solid rgba(15,15,14,0.18)',
    borderRadius: 12, padding: '28px 24px', position: 'relative',
  },
  priceBadge: {
    position: 'absolute', top: -11, left: '50%',
    transform: 'translateX(-50%)',
    fontFamily: "'Geist', sans-serif", fontSize: 9, fontWeight: 600,
    letterSpacing: '0.12em', textTransform: 'uppercase',
    padding: '4px 12px', background: '#1A1A18', color: '#FAFAF9',
    borderRadius: 20, whiteSpace: 'nowrap',
  },
  priceTier: {
    fontFamily: "'Geist', sans-serif", fontSize: 12, fontWeight: 600,
    letterSpacing: '0.08em', textTransform: 'uppercase',
    color: '#9A9A94', marginBottom: 12,
  },
  priceAmount: {
    fontFamily: "'Instrument Serif', serif", fontSize: 42,
    color: '#1A1A18', lineHeight: 1, marginBottom: 4,
  },
  priceCadence: {
    fontFamily: "'Geist', sans-serif", fontSize: 12, fontWeight: 300,
    color: '#6B6B66', marginBottom: 6,
  },
  priceClients: {
    fontFamily: "'Geist', sans-serif", fontSize: 12, fontWeight: 500,
    color: '#3D3D3A', marginBottom: 24,
    paddingBottom: 20, borderBottom: '1px solid rgba(15,15,14,0.10)',
  },
  priceBtn: {
    width: '100%', fontFamily: "'Geist', sans-serif", fontSize: 13,
    fontWeight: 500, padding: '10px', borderRadius: 7,
    cursor: 'pointer', textAlign: 'center', display: 'block',
    textDecoration: 'none',
  },
  priceBtnOutline: {
    background: 'transparent', color: '#6B6B66',
    border: '1px solid rgba(15,15,14,0.18)',
  },
  priceBtnFilled: {
    background: '#1A1A18', color: '#FAFAF9', border: 'none',
  },

  // CTA section
  ctaSection: {
    background: '#0F0F0E',
    borderTop: '1px solid rgba(255,255,255,0.08)',
    textAlign: 'center', padding: '96px 24px',
  },
  ctaHeadline: {
    fontFamily: "'Instrument Serif', serif", fontSize: 42,
    fontWeight: 400, color: '#F5F5F3', lineHeight: 1.1,
    letterSpacing: '-0.5px', marginBottom: 14,
  },
  ctaSub: {
    fontFamily: "'Geist', sans-serif", fontSize: 15, fontWeight: 300,
    color: 'rgba(245,245,243,0.50)', marginBottom: 36,
  },
  ctaTrust: {
    marginTop: 20, fontFamily: "'Geist', sans-serif", fontSize: 11,
    fontWeight: 300, color: 'rgba(245,245,243,0.28)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16,
  },

  // Footer
  footer: {
    background: '#0F0F0E',
    borderTop: '1px solid rgba(255,255,255,0.08)',
    padding: '24px', display: 'flex',
    alignItems: 'center', justifyContent: 'space-between',
  },
  footerLogo: {
    fontFamily: "'Instrument Serif', serif", fontSize: 16,
    color: '#F5F5F3', letterSpacing: '-0.3px',
  },
  footerCopy: {
    fontFamily: "'Geist', sans-serif", fontSize: 12, fontWeight: 300,
    color: 'rgba(245,245,243,0.28)',
  },
  footerLink: {
    fontFamily: "'Geist', sans-serif", fontSize: 12, fontWeight: 400,
    color: 'rgba(245,245,243,0.50)', textDecoration: 'none',
  },
}

const outputFeatures = {
  client: [
    'Monthly narrative — what changed and why, in plain English',
    'Plain-language explanations a client can read in 60 seconds',
    'White-label with your agency name and brand color',
    'Shareable link — no client login required',
  ],
  internal: [
    'Talking points the AM can speak aloud on the call',
    'Phrases for explaining gains, drops, and trade-offs',
    'Standardized language across every client, every month',
    'Suggested call script for the opening minute',
  ],
}

function BillingToggle({ billing, setBilling }) {
  const opt = (key, label, badge) => {
    const active = billing === key
    return (
      <button
        key={key}
        onClick={() => setBilling(key)}
        style={{
          fontFamily: "'Geist', sans-serif",
          fontSize: 12, fontWeight: 500,
          padding: '7px 14px',
          border: 'none', cursor: 'pointer',
          borderRadius: 7,
          background: active ? '#1A1A18' : 'transparent',
          color: active ? '#F5F5F3' : '#6B6B66',
          display: 'inline-flex', alignItems: 'center', gap: 6,
          transition: 'background 0.15s, color 0.15s',
        }}
      >
        {label}
        {badge && (
          <span style={{
            fontSize: 9, fontWeight: 600,
            padding: '2px 6px', borderRadius: 10,
            background: active ? 'rgba(45,106,39,0.25)' : '#EDF5EB',
            color: active ? '#86EFAC' : '#2D6A27',
            letterSpacing: '0.04em',
          }}>{badge}</span>
        )}
      </button>
    )
  }
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: 4, marginBottom: 28,
      background: '#F4F4F2', border: '1px solid rgba(15,15,14,0.08)',
      borderRadius: 10,
    }}>
      {opt('monthly', 'Monthly')}
      {opt('yearly', 'Yearly', 'Save 20%')}
    </div>
  )
}

export default function LandingPage() {
  const [billing, setBilling] = useState('monthly')
  return (
    <div style={{ fontFamily: "'Geist', sans-serif" }}>

      {/* NAV */}
      <nav style={S.nav}>
        <a href="/" style={S.navLogo}>retainr</a>
        <div style={S.navLinks}>
          <a href="#how-it-works" style={S.navLink}>Features</a>
          <a href="#comparison" style={S.navLink}>Compare</a>
          <a href="#pricing" style={S.navLink}>Pricing</a>
          <Link to="/login" style={S.navCTA}>Sign in</Link>
        </div>
      </nav>

      {/* HERO BAND */}
      <section style={S.heroBand} id="sample">
        <div style={S.heroInner}>

          {/* Left */}
          <div>
            <div style={S.heroEyebrow}>
              <span style={S.heroDot} />
              Performance communication system
            </div>
            <h1 style={S.heroHeadline}>
              Turn every account manager into a<br />
              <span style={S.heroItalic}>high-performing</span> communicator.
            </h1>
            <p style={S.heroSub}>
              Turn Google Ads performance data into client-ready updates,
              explanations, and talking points in seconds.
            </p>
            <div style={S.heroCTAs}>
              <Link to="/login" style={S.ctaPrimary}>Start Free Trial →</Link>
              <a href="#sample" style={S.ctaGhost}>See Sample Report</a>
            </div>
            <div style={S.heroTrust}>
              <span>5 clients free</span>
              <span>·</span>
              <span>No credit card</span>
              <span>·</span>
              <span>Setup in 10 minutes</span>
            </div>
          </div>

          {/* Right — full client-ready report (the primary hero asset) */}
          <div>
            <HeroTransformation />
          </div>

        </div>
      </section>

      {/* STATS BAR */}
      <div style={S.statsBar}>
        <div style={S.statsInner}>
          {[
            { num: '2 min', label: 'Average narrative generation time' },
            { num: '100%', label: 'Of account managers feel more prepared' },
            { num: '0', label: 'Client calls without a clear talking script' },
          ].map((s, i) => (
            <div key={i} style={{
              ...S.statItem,
              ...(i === 2 ? { borderRight: 'none', paddingRight: 0 } : {}),
              ...(i === 0 ? { paddingLeft: 0 } : {}),
            }}>
              <div style={S.statNumber}>{s.num}</div>
              <div style={S.statLabel}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* TWO OUTPUTS */}
      <section style={S.section} id="outputs">
        <div style={S.sectionInner}>
          <div style={S.sectionEyebrow}>What this replaces</div>
          <h2 style={S.sectionHeadline}>
            Not a dashboard.<br />
            Not reporting <span style={S.sectionItalic}>software.</span>
          </h2>
          <p style={S.sectionSub}>
            We standardize how your team explains performance to clients —
            so every account manager communicates clearly, consistently, and confidently.
          </p>
          <div style={S.outputsGrid}>

            <div style={S.outputCard}>
              <span style={{
                ...S.outputTag,
                background: '#EAF0FF', color: '#1A4A8A',
                border: '1px solid rgba(26,74,138,0.2)',
              }}>Client-facing</span>
              <div style={S.outputTitle}>Monthly Performance Narrative</div>
              <p style={S.outputDesc}>
                A written explanation of what changed in the account, why it changed,
                and what it means — delivered to the client as a white-labeled,
                shareable link. No dashboard required.
              </p>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
                {outputFeatures.client.map((f, i) => (
                  <li key={i} style={{
                    fontFamily: "'Geist', sans-serif", fontSize: 12,
                    fontWeight: 400, color: '#6B6B66',
                    display: 'flex', alignItems: 'flex-start', gap: 8, lineHeight: 1.45,
                  }}>
                    <span style={{ color: '#9A9A94', flexShrink: 0 }}>→</span>{f}
                  </li>
                ))}
              </ul>
            </div>

            <div style={S.outputCard}>
              <span style={{
                ...S.outputTag,
                background: '#FFF5E6', color: '#B86A14',
                border: '1px solid rgba(184,106,20,0.2)',
              }}>Internal only</span>
              <div style={S.outputTitle}>Meeting Talking Points</div>
              <p style={S.outputDesc}>
                Phrases your account manager can speak aloud on the call —
                consistent across every client and every AM, so performance is
                explained the same way every time.
              </p>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
                {outputFeatures.internal.map((f, i) => (
                  <li key={i} style={{
                    fontFamily: "'Geist', sans-serif", fontSize: 12,
                    fontWeight: 400, color: '#6B6B66',
                    display: 'flex', alignItems: 'flex-start', gap: 8, lineHeight: 1.45,
                  }}>
                    <span style={{ color: '#9A9A94', flexShrink: 0 }}>→</span>{f}
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={S.sectionAlt} id="how-it-works">
        <div style={S.sectionInner}>
          <div style={S.sectionEyebrow}>Why agencies use it</div>
          <h2 style={S.sectionHeadline}>
            Connected on Monday.<br />
            <span style={S.sectionItalic}>Prepared</span> by Tuesday.
          </h2>
          <p style={S.sectionSub}>Three steps to a fully automated client communication workflow.</p>
          <div style={S.stepsGrid}>
            {[
              {
                num: '01', title: 'Connect Google Ads',
                desc: 'Add an account and connect Google Ads via OAuth. Retainr pulls the first month of data immediately and generates an initial narrative and talking points.',
              },
              {
                num: '02', title: 'Automatic daily refresh',
                desc: 'Every morning at 6am, retainr pulls fresh performance data, regenerates explanations, and flags spend or CPA shifts worth raising with the client.',
              },
              {
                num: '03', title: 'Narrative + talking points ready',
                desc: 'Send the client their monthly narrative link. Open the internal talking points before any call. Every AM speaks the same language about performance.',
              },
            ].map((step, i) => (
              <div key={i} style={S.stepItem}>
                <div style={S.stepNum}>{step.num}</div>
                <div style={S.stepTitle}>{step.title}</div>
                <p style={S.stepDesc}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COMPETITOR COMPARISON */}
      <section style={S.section} id="comparison">
        <div style={S.sectionInner}>
          <CompetitorComparison />
        </div>
      </section>

      {/* PRICING */}
      <section style={S.sectionAlt} id="pricing">
        <div style={S.sectionInner}>
          <div style={S.sectionEyebrow}>Pricing</div>
          <h2 style={S.sectionHeadline}>Scales with your agency.</h2>
          <p style={S.sectionSub}>14-day free trial. No credit card required. Cancel any time.</p>

          {/* Billing period toggle */}
          <BillingToggle billing={billing} setBilling={setBilling} />

          <div style={S.pricingGrid}>

            {[
              { key: 'growth', tier: 'Growth',     monthly: 199, yearly: 159, clients: 'Up to 10 client accounts', featured: false },
              { key: 'pro',    tier: 'Pro Agency', monthly: 499, yearly: 399, clients: 'Up to 30 client accounts', featured: true },
              { key: 'scale',  tier: 'Scale',      monthly: 999, yearly: 799, clients: 'Up to 75 client accounts', featured: false },
            ].map((plan) => {
              const price = billing === 'yearly' ? plan.yearly : plan.monthly
              return (
                <div key={plan.tier} style={plan.featured ? S.priceCardFeatured : S.priceCard}>
                  {plan.featured && <div style={S.priceBadge}>Most popular</div>}
                  <div style={S.priceTier}>{plan.tier}</div>
                  <div style={S.priceAmount}>${price}</div>
                  <div style={S.priceCadence}>
                    per month{billing === 'yearly' ? ', billed annually' : ''}
                  </div>
                  <div style={{ ...S.priceClients, marginBottom: 24 }}>{plan.clients}</div>
                  <Link
                    to={`/checkout?plan=${plan.key}&billing=${billing}`}
                    style={{
                      ...S.priceBtn,
                      ...(plan.featured ? S.priceBtnFilled : S.priceBtnOutline),
                    }}
                  >
                    Get started
                  </Link>
                </div>
              )
            })}

          </div>

          {/* Enterprise / contact-us footer */}
          <div style={{
            marginTop: 28, textAlign: 'center',
            fontFamily: "'Geist', sans-serif", fontSize: 13, color: '#6B6B66',
          }}>
            Need more than 75 accounts?{' '}
            <a href="mailto:hello@retainr.io?subject=Enterprise%20pricing" style={{
              color: '#1A1A18', textDecoration: 'underline', textUnderlineOffset: 3,
            }}>
              Contact us
            </a>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={S.ctaSection}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <div style={{ ...S.sectionEyebrow, color: 'rgba(245,245,243,0.50)' }}>See your first report in 60 seconds</div>
          <h2 style={S.ctaHeadline}>
            Connect Google Ads.<br />
            Get a finished <span style={{ fontStyle: 'italic', color: '#C8C8BE' }}>client report.</span>
          </h2>
          <p style={S.ctaSub}>
            One click to connect, ~60 seconds to a written narrative, drivers, client explanations, and meeting talking points.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
            <Link to="/login" style={S.ctaPrimary}>Start Free Trial →</Link>
            <a href="mailto:hello@retainr.io" style={S.ctaGhost}>Talk to us</a>
          </div>
          <div style={S.ctaTrust}>
            <span>Cancel anytime</span><span>·</span>
            <span>Secure Stripe checkout</span><span>·</span>
            <span>Instant access</span>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={S.footer}>
        <span style={S.footerLogo}>retainr</span>
        <span style={S.footerCopy}>© 2026 Retainr. Agency intelligence for account managers.</span>
        <div style={{ display: 'flex', gap: 16 }}>
          <Link to="/login" style={S.footerLink}>Sign in</Link>
          <a href="mailto:hello@retainr.io" style={S.footerLink}>Contact</a>
        </div>
      </footer>

    </div>
  )
}
