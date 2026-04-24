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
    'Executive summary a CFO reads in 20 seconds — no context required',
    'Channel-by-channel performance with narrative, not just numbers',
    'White-label with your agency name and brand color',
    'Shareable link — no client login required',
  ],
  internal: [
    'Watch for: the metric they will challenge, surfaced first',
    'Lead with: the strongest win, ready to speak aloud',
    'Suggested call script, verbatim, for the opening',
    'Commitments tracker and expansion opportunities',
  ],
}

const priceFeatures = {
  starter: [
    'GA4 connection per client',
    'Monthly client report',
    'Internal briefing card',
    'White-label reports',
    'Threshold alerts',
  ],
  growth: [
    'Everything in Starter',
    'Commitments tracker',
    'Account health scores',
    'Daily data refresh',
    'Mobile briefing card',
  ],
  agency: [
    'Everything in Growth',
    'Priority support',
    'Early access to V2 features',
    'Google Ads integration (V2)',
    'Custom onboarding call',
  ],
}

export default function LandingPage() {
  return (
    <div style={{ fontFamily: "'Geist', sans-serif" }}>

      {/* NAV */}
      <nav style={S.nav}>
        <a href="/" style={S.navLogo}>retainr</a>
        <div style={S.navLinks}>
          <a href="#how-it-works" style={S.navLink}>Features</a>
          <a href="#pricing" style={S.navLink}>Pricing</a>
          <Link to="/login" style={S.navCTA}>Sign in</Link>
        </div>
      </nav>

      {/* HERO BAND */}
      <section style={S.heroBand}>
        <div style={S.heroInner}>

          {/* Left */}
          <div>
            <div style={S.heroEyebrow}>
              <span style={S.heroDot} />
              Agency intelligence platform
            </div>
            <h1 style={S.heroHeadline}>
              Know every client<br />
              <span style={S.heroItalic}>before</span> they call.
            </h1>
            <p style={S.heroSub}>
              Retainr connects to your clients' GA4 accounts and automatically
              generates two things: a branded report that justifies the retainer,
              and a private briefing card that tells your account manager exactly
              what the client will challenge — before they pick up the phone.
            </p>
            <div style={S.heroCTAs}>
              <Link to="/login" style={S.ctaPrimary}>Get started free →</Link>
              <a href="#how-it-works" style={S.ctaGhost}>See how it works</a>
            </div>
            <div style={S.heroTrust}>
              <span>5 clients free</span>
              <span>·</span>
              <span>No credit card</span>
              <span>·</span>
              <span>Setup in 10 minutes</span>
            </div>
          </div>

          {/* Right — transformation widget */}
          <div>
            <HeroTransformation />
          </div>

        </div>
      </section>

      {/* STATS BAR */}
      <div style={S.statsBar}>
        <div style={S.statsInner}>
          {[
            { num: '2 min', label: 'Average briefing generation time' },
            { num: '100%', label: 'Of account managers feel more prepared' },
            { num: '0', label: 'Surprise client calls you won\'t be ready for' },
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
          <div style={S.sectionEyebrow}>What retainr generates</div>
          <h2 style={S.sectionHeadline}>
            Two outputs. Both <span style={S.sectionItalic}>automatic.</span>
          </h2>
          <p style={S.sectionSub}>Every month, for every client, without lifting a finger.</p>
          <div style={S.outputsGrid}>

            <div style={S.outputCard}>
              <span style={{
                ...S.outputTag,
                background: '#EAF0FF', color: '#1A4A8A',
                border: '1px solid rgba(26,74,138,0.2)',
              }}>Client-facing</span>
              <div style={S.outputTitle}>Branded Monthly Report</div>
              <p style={S.outputDesc}>
                A white-labeled report designed to justify the retainer and
                survive the client's internal budget review. Your agency name,
                your brand color — delivered as a shareable link.
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
              <div style={S.outputTitle}>Pre-call Briefing Card</div>
              <p style={S.outputDesc}>
                A private card that prepares your account manager for the
                hardest version of every unexpected client call. The concern
                surfaces first. Always.
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
          <div style={S.sectionEyebrow}>How it works</div>
          <h2 style={S.sectionHeadline}>
            Connected on Monday.<br />
            <span style={S.sectionItalic}>Prepared</span> by Tuesday.
          </h2>
          <p style={S.sectionSub}>Three steps to a fully automated reporting and briefing workflow.</p>
          <div style={S.stepsGrid}>
            {[
              {
                num: '01', title: 'Connect GA4',
                desc: 'Add a client and connect their GA4 property via OAuth. Retainr pulls the first dataset immediately and generates an initial report and briefing.',
              },
              {
                num: '02', title: 'Automatic daily refresh',
                desc: 'Every morning at 6am, retainr pulls fresh data, recalculates the health score, and triggers threshold alerts if traffic drops or CPL spikes.',
              },
              {
                num: '03', title: 'Report + briefing ready',
                desc: 'Send the client their monthly report link. Open the internal briefing card before any call. Know the concern before the client raises it.',
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
          <p style={S.sectionSub}>One flat monthly fee per tier. No per-report charges, no hidden costs.</p>
          <div style={S.pricingGrid}>

            {[
              { tier: 'Starter', price: '$39', cadence: 'per month', clients: 'Up to 5 clients', features: priceFeatures.starter, featured: false },
              { tier: 'Growth', price: '$79', cadence: 'per month', clients: 'Up to 15 clients', features: priceFeatures.growth, featured: true },
              { tier: 'Agency', price: '$149', cadence: 'per month', clients: 'Unlimited clients', features: priceFeatures.agency, featured: false },
            ].map((plan) => (
              <div key={plan.tier} style={plan.featured ? S.priceCardFeatured : S.priceCard}>
                {plan.featured && <div style={S.priceBadge}>Most popular</div>}
                <div style={S.priceTier}>{plan.tier}</div>
                <div style={S.priceAmount}>{plan.price}</div>
                <div style={S.priceCadence}>{plan.cadence}</div>
                <div style={S.priceClients}>{plan.clients}</div>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 9, marginBottom: 24 }}>
                  {plan.features.map((f, i) => (
                    <li key={i} style={{
                      fontFamily: "'Geist', sans-serif", fontSize: 12,
                      fontWeight: 400, color: '#6B6B66',
                      display: 'flex', alignItems: 'flex-start', gap: 8, lineHeight: 1.4,
                    }}>
                      <span style={{ color: '#2D6A27', flexShrink: 0 }}>✓</span>{f}
                    </li>
                  ))}
                </ul>
                <Link
                  to="/login"
                  style={{
                    ...S.priceBtn,
                    ...(plan.featured ? S.priceBtnFilled : S.priceBtnOutline),
                  }}
                >
                  Get started
                </Link>
              </div>
            ))}

          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={S.ctaSection}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <div style={{ ...S.sectionEyebrow, color: 'rgba(245,245,243,0.50)' }}>Start today</div>
          <h2 style={S.ctaHeadline}>
            Know every client<br />
            <span style={{ fontStyle: 'italic', color: '#C8C8BE' }}>before</span> they call.
          </h2>
          <p style={S.ctaSub}>
            Connect your first client in under 10 minutes. The first report and briefing card generate automatically.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
            <Link to="/login" style={S.ctaPrimary}>Get started free →</Link>
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
