import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Logo from '../components/Logo'

/* ─────────── Design tokens ─────────── */

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
  negative:     '#EF4444',
  navy:         '#0F1F3D',
}

const MAX = 1180

/* ─────────── Page CSS ─────────── */

const PAGE_CSS = `
  html, body { background: ${C.bg}; }
  * { box-sizing: border-box; }
  ::selection { background: rgba(4,37,108,0.10); }

  .lp-nav { background: rgba(255,255,255,0.8); border-bottom: 1px solid transparent; transition: background 0.2s, border-color 0.2s; }
  .lp-nav.scrolled { background: rgba(255,255,255,0.94); border-bottom-color: ${C.border}; backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); }

  .lp-nav-link { padding: 6px 12px; border-radius: 7px; color: ${C.textMuted}; text-decoration: none; font-size: 14px; font-weight: 500; transition: background 0.15s, color 0.15s; }
  .lp-nav-link:hover { background: ${C.bgAlt}; color: ${C.text}; }

  .lp-feature-card { padding: 28px; border-radius: 14px; border: 1px solid ${C.border}; background: ${C.bg}; transition: border-color 0.18s, background 0.18s; }
  .lp-feature-card:hover { border-color: rgba(4,37,108,0.28); background: #FAFBFF; }
  .lp-feature-card-hero { border-color: ${C.accentBorder}; background: ${C.accentBg}; }
  .lp-feature-card-hero:hover { border-color: rgba(4,37,108,0.40); background: rgba(4,37,108,0.09); }

  .lp-pricing-card { border-radius: 16px; border: 1.5px solid ${C.border}; padding: 32px 28px; background: ${C.bg}; transition: border-color 0.2s, box-shadow 0.2s; position: relative; }
  .lp-pricing-card:hover { border-color: rgba(4,37,108,0.45); box-shadow: 0 4px 20px rgba(0,0,0,0.07); }
  .lp-pricing-card-featured { background: ${C.accent}; border-color: ${C.accent}; color: #fff; box-shadow: 0 8px 32px rgba(4,37,108,0.35); }
  .lp-pricing-card-featured:hover { border-color: ${C.accent}; box-shadow: 0 12px 40px rgba(4,37,108,0.45); }

  .lp-faq summary { list-style: none; cursor: pointer; }
  .lp-faq summary::-webkit-details-marker { display: none; }
  .lp-faq[open] .lp-faq-icon { transform: rotate(45deg); }

  .lp-cta-primary { background: ${C.accent}; color: #fff; border: none; border-radius: 10px; font-size: 15px; font-weight: 700; padding: 14px 28px; cursor: pointer; text-decoration: none; display: inline-flex; align-items: center; box-shadow: 0 4px 16px rgba(4,37,108,0.35); transition: box-shadow 0.15s, opacity 0.15s; }
  .lp-cta-primary:hover { opacity: 0.92; box-shadow: 0 6px 24px rgba(4,37,108,0.45); }
  .lp-cta-ghost { background: ${C.bg}; color: ${C.text}; border: 1.5px solid ${C.border}; border-radius: 10px; font-size: 15px; font-weight: 600; padding: 13px 24px; cursor: pointer; text-decoration: none; display: inline-flex; align-items: center; transition: border-color 0.15s; }
  .lp-cta-ghost:hover { border-color: ${C.borderMid}; }

  .lp-section-pad { padding: 96px 24px; }

  .lp-h1 { font-size: 58px; line-height: 1.07; letter-spacing: -0.03em; }
  .lp-h2 { font-size: 40px; line-height: 1.12; letter-spacing: -0.025em; }

  .lp-hero-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 64px; align-items: center; }
  .lp-features-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
  .lp-how-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 32px; }
  .lp-testimonials-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
  .lp-pricing-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; max-width: 940px; margin: 56px auto 0; }
  .lp-stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1px; background: ${C.border}; border-radius: 14px; overflow: hidden; margin-top: 48px; }

  @media (max-width: 960px) {
    .lp-hero-grid { grid-template-columns: 1fr !important; }
    .lp-hero-mockup { display: none !important; }
    .lp-features-grid { grid-template-columns: repeat(2, 1fr) !important; }
    .lp-how-grid { gap: 40px !important; }
    .lp-testimonials-grid { grid-template-columns: 1fr !important; }
    .lp-pricing-grid { grid-template-columns: 1fr !important; max-width: 420px !important; }
    .lp-stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
    .lp-h1 { font-size: 42px !important; }
    .lp-h2 { font-size: 32px !important; }
    .lp-section-pad { padding: 72px 24px !important; }
  }
  @media (max-width: 640px) {
    .lp-features-grid { grid-template-columns: 1fr !important; }
    .lp-how-grid { grid-template-columns: 1fr !important; }
    .lp-stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
    .lp-h1 { font-size: 34px !important; }
    .lp-h2 { font-size: 26px !important; }
    .lp-section-pad { padding: 56px 20px !important; }
    .lp-nav-links { display: none !important; }
  }
`

/* ─────────── Page ─────────── */

export default function LandingPage() {
  const [billing, setBilling] = useState('monthly')
  return (
    <div style={{ ...F.sans, color: C.text, background: C.bg, WebkitFontSmoothing: 'antialiased' }}>
      <style>{PAGE_CSS}</style>
      <Nav />
      <Hero />
      <LogoStrip />
      <AIEngineBanner />
      <Features />
      <HowItWorks />
      <PredictedQuestions />
      <CompetitorContrast />
      <SocialProof />
      <Pricing billing={billing} setBilling={setBilling} />
      <FAQ />
      <FinalCTA />
      <Footer />
    </div>
  )
}

/* ─────────── Nav ─────────── */

function Nav() {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])
  return (
    <nav className={`lp-nav${scrolled ? ' scrolled' : ''}`} style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100 }}>
      <div style={{ maxWidth: MAX, margin: '0 auto', padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
          <Logo />
          <div className="lp-nav-links" style={{ display: 'flex', gap: 4 }}>
            {[['#how', 'How it works'], ['#features', 'Features']].map(([href, label]) => (
              <a key={href} href={href} className="lp-nav-link" style={F.sans}>{label}</a>
            ))}
            <Link to="/pricing" className="lp-nav-link" style={F.sans}>Pricing</Link>
            <Link to="/sample-reports" className="lp-nav-link" style={F.sans}>Sample reports</Link>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Link to="/sign-in" style={{ ...F.sans, fontSize: 14, fontWeight: 500, color: C.textMuted, padding: '8px 16px', textDecoration: 'none' }}>Sign in</Link>
          <Link to="/sign-up" className="lp-cta-primary" style={{ ...F.sans, fontSize: 14, fontWeight: 700, padding: '9px 20px', borderRadius: 8, boxShadow: '0 4px 12px rgba(4,37,108,0.30)' }}>
            Start Free Trial
          </Link>
        </div>
      </div>
    </nav>
  )
}

/* ─────────── Hero ─────────── */

function Hero() {
  return (
    <section style={{ paddingTop: 120, paddingBottom: 80, background: 'linear-gradient(180deg, #F0F4FF 0%, #fff 65%)' }}>
      <div style={{ maxWidth: MAX, margin: '0 auto', padding: '0 24px' }}>
        <div className="lp-hero-grid">
          {/* Left: Copy */}
          <div>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: C.accentBg, border: `1px solid ${C.accentBorder}`,
              borderRadius: 20, padding: '5px 14px 5px 8px', marginBottom: 24,
            }}>
              <span style={{
                width: 18, height: 18, borderRadius: '50%', background: C.accent,
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path d="M2 5h6M5 2v6" stroke="#fff" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </span>
              <span style={{ ...F.sans, fontSize: 13, fontWeight: 600, color: C.accent }}>AI-powered reporting for Google Ads agencies</span>
            </div>

            <h1 className="lp-h1" style={{ ...F.sans, fontWeight: 800, color: C.text, margin: 0, marginBottom: 20 }}>
              Make every AM your{' '}
              <span style={{ color: C.accent }}>best AM.</span>
            </h1>

            <p style={{ ...F.sans, fontSize: 18, color: C.textMuted, lineHeight: 1.65, marginBottom: 14, maxWidth: 480 }}>
              AI reads your Google Ads data and writes three documents in under 60 seconds: a polished client report, an internal AM brief, and the exact questions your client is about to ask — with prepared answers.
            </p>
            <p style={{ ...F.sans, fontSize: 15, color: C.textSubtle, lineHeight: 1.6, marginBottom: 36, maxWidth: 460 }}>
              The agencies that retain clients longest don't have better dashboards. They have account managers who can explain what happened — and what it means.
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
              <Link to="/sign-up" className="lp-cta-primary" style={F.sans}>
                Start Free Trial
              </Link>
              <Link to="/sample-reports" className="lp-cta-ghost" style={F.sans}>
                See Sample Reports →
              </Link>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
              {['14-day free trial', 'No credit card', 'Set up in 5 min'].map(t => (
                <span key={t} style={{ ...F.sans, fontSize: 13, color: C.textSubtle, display: 'flex', alignItems: 'center', gap: 5 }}>
                  <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                    <circle cx="6.5" cy="6.5" r="5.5" fill={C.accentBg}/>
                    <path d="M4 6.5l1.8 1.8L9 4.5" stroke={C.accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Right: Browser mockup */}
          <div className="lp-hero-mockup" style={{ display: 'flex', justifyContent: 'center' }}>
            <HeroBrowserMockup />
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─────────── Hero browser mockup ─────────── */

function HeroBrowserMockup() {
  return (
    <div style={{
      background: '#F8FAFC', borderRadius: 16,
      border: `1px solid ${C.border}`, overflow: 'hidden',
      boxShadow: '0 24px 60px rgba(15,31,61,0.12), 0 4px 16px rgba(15,31,61,0.06)',
      width: '100%', maxWidth: 560,
    }}>
      {/* Browser chrome */}
      <div style={{ background: '#fff', borderBottom: `1px solid ${C.border}`, padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ display: 'flex', gap: 5 }}>
          {['#FF5F57','#FFBD2E','#28C840'].map(c => (
            <div key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c }} />
          ))}
        </div>
        <div style={{ flex: 1, background: '#F1F5F9', borderRadius: 6, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ ...F.sans, fontSize: 10, color: C.textSubtle }}>retainr.io — Apex Digital · April 2025</span>
        </div>
      </div>

      <div style={{ padding: '16px 18px 18px' }}>
        {/* Report header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
          <div>
            <div style={{ ...F.sans, fontSize: 10, color: C.textSubtle, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 3 }}>Monthly Performance Report</div>
            <div style={{ ...F.sans, fontSize: 16, fontWeight: 700, color: C.text }}>Apex Digital Co.</div>
            <div style={{ ...F.sans, fontSize: 11, color: C.textMuted }}>April 1 – April 30, 2025</div>
          </div>
          <div style={{ background: C.accentBg, borderRadius: 8, padding: '5px 10px', ...F.sans, fontSize: 11, fontWeight: 600, color: C.accent }}>
            Generated by AI
          </div>
        </div>

        {/* Metric badges */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6, marginBottom: 12 }}>
          {[
            { label: 'Impressions', value: '284K', delta: '+3%', color: C.positive },
            { label: 'Clicks', value: '8.2K', delta: '+7%', color: C.positive },
            { label: 'Conversions', value: '1,284', delta: '+18%', color: C.positive },
            { label: 'CPA', value: '$41', delta: '+11%', color: C.positive },
          ].map(m => (
            <div key={m.label} style={{ background: '#fff', border: `1px solid #E8ECF2`, borderRadius: 8, padding: '8px 10px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <div style={{ ...F.sans, fontSize: 9, color: C.textSubtle, fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 2 }}>{m.label}</div>
              <div style={{ ...F.sans, fontSize: 15, fontWeight: 700, color: C.text, lineHeight: 1.2 }}>{m.value}</div>
              <div style={{ ...F.sans, fontSize: 10, color: m.color, fontWeight: 600 }}>{m.delta}</div>
            </div>
          ))}
        </div>

        {/* Sparkline */}
        <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 8, padding: '10px 12px 8px', marginBottom: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span style={{ ...F.sans, fontSize: 11, fontWeight: 600, color: C.text }}>Conversion Trend</span>
            <div style={{ display: 'flex', gap: 4 }}>
              {['7d','30d','90d'].map((t, i) => (
                <span key={t} style={{ ...F.sans, fontSize: 9, padding: '2px 6px', borderRadius: 4, background: i === 1 ? C.accent : '#F1F5F9', color: i === 1 ? '#fff' : C.textMuted, fontWeight: 600, cursor: 'pointer' }}>{t}</span>
              ))}
            </div>
          </div>
          <svg width="100%" height="38" viewBox="0 0 400 38" preserveAspectRatio="none">
            <defs>
              <linearGradient id="sg" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={C.accent} stopOpacity="0.15"/>
                <stop offset="100%" stopColor={C.accent} stopOpacity="0"/>
              </linearGradient>
            </defs>
            <polygon points="0,38 0,30 50,26 100,22 150,24 200,16 250,13 300,9 350,6 400,3 400,38" fill="url(#sg)"/>
            <polyline points="0,30 50,26 100,22 150,24 200,16 250,13 300,9 350,6 400,3" fill="none" stroke={C.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 3 }}>
            {['Apr 1','Apr 8','Apr 15','Apr 22','Apr 30'].map(d => (
              <span key={d} style={{ ...F.sans, fontSize: 8, color: '#CBD5E1' }}>{d}</span>
            ))}
          </div>
        </div>

        {/* AI narrative snippet */}
        <div style={{ background: C.accentBg, border: `1px solid ${C.accentBorder}`, borderRadius: 8, padding: '10px 12px', marginBottom: 10 }}>
          <div style={{ ...F.sans, fontSize: 10, fontWeight: 700, color: C.accent, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 6 }}>
            AI Executive Summary
          </div>
          <p style={{ ...F.sans, fontSize: 11, color: '#334155', lineHeight: 1.6, margin: 0 }}>
            <strong>April was a strong month.</strong> Conversions jumped 18% while CPA dropped — the account is doing more with the same budget. Shopping campaigns drove the lift...
          </p>
        </div>

        {/* Internal divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '10px 0' }}>
          <div style={{ flex: 1, borderTop: `1px dashed ${C.borderMid}` }} />
          <span style={{ ...F.sans, fontSize: 9, fontWeight: 600, color: C.textSubtle, letterSpacing: '0.08em', textTransform: 'uppercase', background: '#fff', padding: '2px 8px', borderRadius: 10, border: `1px solid ${C.border}` }}>
            For your team · not sent to client
          </span>
          <div style={{ flex: 1, borderTop: `1px dashed ${C.borderMid}` }} />
        </div>

        {/* Predicted question preview */}
        <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 8, padding: '10px 12px' }}>
          <div style={{ ...F.sans, fontSize: 9, fontWeight: 700, color: C.accent, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 6 }}>
            Client will likely ask
          </div>
          <div style={{ ...F.sans, fontSize: 11, fontWeight: 600, color: C.text, marginBottom: 4 }}>
            "Why did our impressions drop while conversions went up?"
          </div>
          <div style={{ ...F.sans, fontSize: 11, color: C.textMuted, lineHeight: 1.55 }}>
            → "We shifted budget toward higher-intent keywords. Fewer impressions, better conversions — that's efficiency improving, not volume falling."
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─────────── Logo strip ─────────── */

function LogoStrip() {
  const logos = ['Apex Digital', 'Growth Labs', 'Northstar Media', 'Blue Partners', 'ClickWise', 'Thrive Agency']
  return (
    <section style={{ borderTop: `1px solid #F1F5F9`, borderBottom: `1px solid #F1F5F9`, padding: '28px 24px', background: '#fff' }}>
      <div style={{ maxWidth: MAX, margin: '0 auto' }}>
        <div style={{ ...F.sans, textAlign: 'center', fontSize: 12, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: C.textSubtle, marginBottom: 20 }}>
          Trusted by performance agencies managing $500K–$50M in client spend
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px 48px', flexWrap: 'wrap' }}>
          {logos.map(name => (
            <span key={name} style={{ ...F.sans, fontSize: 14, fontWeight: 700, color: '#CBD5E1', letterSpacing: '-0.01em' }}>{name}</span>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─────────── AI engine banner ─────────── */

function AIEngineBanner() {
  const outputs = [
    { label: 'Client Report', desc: 'Plain-English narrative your client reads', icon: '📄' },
    { label: 'AM Briefing', desc: 'Talking points + how to frame every result', icon: '🎯' },
    { label: 'Predicted Q&A', desc: '3 questions your client will ask — answered', icon: '💬' },
  ]
  return (
    <section style={{ background: C.accent, padding: '48px 24px' }}>
      <div style={{ maxWidth: MAX, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 48, flexWrap: 'wrap', justifyContent: 'center' }}>
          {/* Input */}
          <div style={{ textAlign: 'center', flexShrink: 0 }}>
            <div style={{ width: 52, height: 52, borderRadius: 14, background: 'rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, margin: '0 auto 8px' }}>📊</div>
            <div style={{ ...F.sans, fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Your Google Ads data</div>
          </div>

          {/* Arrow + AI label */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, flexShrink: 0 }}>
            <div style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 10, padding: '6px 16px', ...F.sans, fontSize: 13, fontWeight: 700, color: '#fff' }}>
              AI · &lt; 60 seconds
            </div>
            <div style={{ ...F.sans, fontSize: 20, color: 'rgba(255,255,255,0.35)' }}>→</div>
          </div>

          {/* Outputs */}
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
            {outputs.map(o => (
              <div key={o.label} style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 12, padding: '14px 18px', minWidth: 170 }}>
                <div style={{ ...F.sans, fontSize: 18, marginBottom: 6 }}>{o.icon}</div>
                <div style={{ ...F.sans, fontSize: 14, fontWeight: 700, color: '#fff', marginBottom: 3 }}>{o.label}</div>
                <div style={{ ...F.sans, fontSize: 12, color: 'rgba(255,255,255,0.55)', lineHeight: 1.45 }}>{o.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─────────── Features ─────────── */

function Features() {
  const features = [
    {
      icon: '📊',
      title: 'Automated Google Ads data',
      desc: 'Connects directly to the Google Ads API. Last 90 days pulled instantly — no CSV exports, no manual entry, always current.',
      hero: false,
    },
    {
      icon: '✍️',
      title: 'AI-written client narrative',
      desc: 'Plain-English performance summary written by AI from your actual account data. Explains what happened, why it matters, and what it means — in your client\'s language.',
      hero: false,
    },
    {
      icon: '🎯',
      title: 'AI-generated AM brief',
      desc: 'A separate internal document your AM reads before the call. AI calibrates the talking points to this specific client, account, and month — not a generic template.',
      hero: false,
    },
    {
      icon: '💬',
      title: 'Predicted client questions + prepared answers',
      desc: 'AI identifies the 3 questions your client is most likely to ask this month — based on the data — and prepares a confident, accurate answer for each. Every AM walks in ready.',
      hero: true,
    },
    {
      icon: '🎨',
      title: 'White-label branding',
      desc: 'Your agency name, logo, and domain on every report. Clients experience your brand, not ours.',
      hero: false,
    },
    {
      icon: '📅',
      title: 'Scheduled AI generation',
      desc: 'Set monthly or weekly cadences. AI runs the reports automatically — no reminders, no last-minute scrambles. You review and share when ready.',
      hero: false,
    },
  ]

  return (
    <section id="features" className="lp-section-pad" style={{ background: C.bgAlt }}>
      <div style={{ maxWidth: MAX, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <SectionLabel accent>Powered by AI</SectionLabel>
          <h2 className="lp-h2" style={{ ...F.sans, fontWeight: 800, color: C.text, margin: 0, marginBottom: 14 }}>
            Everything your team needs to keep clients
          </h2>
          <p style={{ ...F.sans, fontSize: 17, color: C.textMuted, maxWidth: 480, margin: '0 auto' }}>
            Built for the way performance agencies actually work — and the conversations they have to win.
          </p>
        </div>

        <div className="lp-features-grid">
          {features.map(f => (
            <div key={f.title} className={`lp-feature-card${f.hero ? ' lp-feature-card-hero' : ''}`}>
              <div style={{ width: 42, height: 42, borderRadius: 10, background: f.hero ? 'rgba(4,37,108,0.12)' : '#EEF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14, fontSize: 20 }}>
                {f.icon}
              </div>
              {f.hero && (
                <div style={{ ...F.sans, fontSize: 10, fontWeight: 700, color: C.accent, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 }}>
                  Signature feature
                </div>
              )}
              <div style={{ ...F.sans, fontSize: 15, fontWeight: 700, color: C.text, marginBottom: 8, lineHeight: 1.3 }}>{f.title}</div>
              <div style={{ ...F.sans, fontSize: 14, color: C.textMuted, lineHeight: 1.65 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─────────── How it works ─────────── */

function HowItWorks() {
  const steps = [
    { n: '01', icon: '🔗', title: 'Connect Google Ads.', desc: 'Read-only OAuth. We never touch campaigns or budgets. Takes 60 seconds.' },
    { n: '02', icon: '🤖', title: 'AI writes three reports.', desc: 'In under 60 seconds: a polished client narrative, an internal AM briefing with talking points, and predicted Q&A for the call. All from your live account data.' },
    { n: '03', icon: '✉️', title: 'Share when you\'re ready.', desc: 'Copy a link, send via email, or download as PDF. You control when the client sees it.' },
  ]
  return (
    <section id="how" className="lp-section-pad" style={{ background: C.bg }}>
      <div style={{ maxWidth: MAX, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <SectionLabel accent>How it works</SectionLabel>
          <h2 className="lp-h2" style={{ ...F.sans, fontWeight: 800, color: C.text, margin: 0, marginBottom: 14 }}>
            Reports in 3 steps, not 3 hours.
          </h2>
          <p style={{ ...F.sans, fontSize: 17, color: C.textMuted, maxWidth: 500, margin: '0 auto' }}>
            From Google Ads data to a client-ready report and full AM call brief — in under 60 seconds.
          </p>
        </div>

        <div className="lp-how-grid">
          {steps.map((s, i) => (
            <div key={s.n} style={{ position: 'relative' }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: C.accentBg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16, fontSize: 22 }}>
                {s.icon}
              </div>
              {i < steps.length - 1 && (
                <div style={{ position: 'absolute', top: 23, left: 52, right: 0, height: 1, background: `linear-gradient(to right, ${C.accentBorder}, transparent)` }} />
              )}
              <div style={{ ...F.sans, fontSize: 11, fontWeight: 800, letterSpacing: '0.08em', color: C.accent, marginBottom: 8 }}>STEP {s.n}</div>
              <div style={{ ...F.sans, fontSize: 17, fontWeight: 700, color: C.text, marginBottom: 8 }}>{s.title}</div>
              <div style={{ ...F.sans, fontSize: 14, color: C.textMuted, lineHeight: 1.65 }}>{s.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─────────── Predicted questions showcase ─────────── */

function PredictedQuestions() {
  const questions = [
    {
      q: 'Our impressions dropped — should we be worried?',
      a: 'Total impressions fell slightly as we shifted budget toward higher-intent keywords. Your conversion volume went up 18% as a result. We\'re reaching fewer people, but the right ones.',
    },
    {
      q: 'The cost per conversion seems high compared to last quarter.',
      a: 'Your April CPA of $41 is actually 11% lower than March\'s $46. The number you may be comparing to is from Q4 when we ran awareness campaigns at lower CPAs but generating lower-quality leads.',
    },
    {
      q: 'What should we focus on differently next month?',
      a: 'Continue the Shopping campaign allocation that drove the conversion lift. Test one new audience segment in brand. Keep spend flat — we\'re in an efficiency upswing, not a volume push.',
    },
  ]

  return (
    <section className="lp-section-pad" style={{ background: C.bgAlt }}>
      <div style={{ maxWidth: MAX, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }}>

          {/* Left: copy */}
          <div>
            <SectionLabel accent>AI · Before every client call</SectionLabel>
            <h2 className="lp-h2" style={{ ...F.sans, fontWeight: 800, color: C.text, margin: 0, marginBottom: 20 }}>
              Your AMs know what's coming.
            </h2>
            <p style={{ ...F.sans, fontSize: 17, color: C.textMuted, lineHeight: 1.65, marginBottom: 16, maxWidth: 420 }}>
              AI analyzes each account's data and identifies the 3 questions your client is most likely to ask — before the call. Every AM arrives with a confident, data-grounded answer already written.
            </p>
            <p style={{ ...F.sans, fontSize: 15, color: C.textMuted, lineHeight: 1.65, maxWidth: 420, marginBottom: 32 }}>
              No more being caught flat-footed. No more "let me get back to you." Junior AMs sound like your most senior one, every month, on every account.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                'Questions predicted from this month\'s actual data — not generic templates',
                'Answers written for this account, this client, this month',
                'Included automatically in every AM brief',
              ].map(point => (
                <div key={point} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                  <span style={{ width: 18, height: 18, borderRadius: '50%', background: C.accentBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path d="M2 5.5L4 7.5L8 3" stroke={C.accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                  <span style={{ ...F.sans, fontSize: 14, color: C.textMuted, lineHeight: 1.55 }}>{point}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Q&A cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ ...F.sans, fontSize: 11, fontWeight: 700, color: C.accent, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 4 }}>
              Based on Apex Digital's April data, your client will likely ask:
            </div>
            {questions.map((item, i) => (
              <div key={i} style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 12, padding: '16px 18px' }}>
                <div style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
                  <span style={{ ...F.sans, fontSize: 10, fontWeight: 700, color: C.accent, background: C.accentBg, padding: '2px 8px', borderRadius: 10, whiteSpace: 'nowrap', flexShrink: 0 }}>
                    Q{i + 1}
                  </span>
                  <div style={{ ...F.sans, fontSize: 14, fontWeight: 600, color: C.text, lineHeight: 1.4 }}>
                    "{item.q}"
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 10, paddingLeft: 2 }}>
                  <span style={{ ...F.sans, fontSize: 13, fontWeight: 700, color: C.positive, flexShrink: 0 }}>→</span>
                  <div style={{ ...F.sans, fontSize: 13, color: C.textMuted, lineHeight: 1.6 }}>{item.a}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─────────── Competitor contrast ─────────── */

function CompetitorContrast() {
  const rows = [
    { name: 'AgencyAnalytics', shows: 'charts.' },
    { name: 'DashThis',        shows: 'dashboards.' },
    { name: 'Whatagraph',      shows: 'reports.' },
    { name: 'Retainr',         shows: 'uses AI to prepare your team for every conversation.', highlight: true },
  ]
  return (
    <section className="lp-section-pad" style={{ background: C.bg }}>
      <div style={{ maxWidth: 860, margin: '0 auto', textAlign: 'center' }}>
        <SectionLabel center accent>Compared to reporting tools</SectionLabel>
        <h2 className="lp-h2" style={{ ...F.sans, fontWeight: 800, color: C.text, margin: '14px 0 0' }}>
          Every tool shows what happened.<br />
          <span style={{ color: C.textMuted }}>Only retainr helps your team explain it.</span>
        </h2>
        <ul style={{ listStyle: 'none', padding: 0, margin: '56px auto 0', maxWidth: 560, textAlign: 'left' }}>
          {rows.map(r => (
            <li key={r.name} style={{
              ...F.sans, fontSize: 17, lineHeight: 1.5,
              padding: '16px 0', borderBottom: `1px solid ${C.border}`,
              display: 'flex', justifyContent: 'space-between', gap: 16,
              color: r.highlight ? C.text : C.textMuted,
              fontWeight: r.highlight ? 700 : 400,
            }}>
              <span>{r.name} shows</span>
              <span style={{ textAlign: 'right', color: r.highlight ? C.accent : undefined }}>{r.shows}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

/* ─────────── Social proof ─────────── */

function SocialProof() {
  const testimonials = [
    {
      quote: 'We used to spend 4–6 hours per client writing monthly recaps. Now it takes 10 minutes. Our clients think we levelled up overnight — because we did.',
      name: 'Sarah K.', role: 'Head of PPC', company: 'Apex Digital', initials: 'SK',
    },
    {
      quote: 'The predicted questions are the feature I didn\'t know I needed. My junior AMs go into calls confident now. Not one "I\'ll check and get back to you" last quarter.',
      name: 'Marcus T.', role: 'Account Manager', company: 'Growth Labs', initials: 'MT',
    },
    {
      quote: 'Client retention went up 22% in the six months after we started using retainr. Clients feel genuinely informed and they credit our team for it.',
      name: 'Priya N.', role: 'Agency Director', company: 'ClickWise', initials: 'PN',
    },
  ]
  const stats = [
    { value: '22%',   label: 'Average client retention lift' },
    { value: '4–6 hrs', label: 'Saved per client per month' },
    { value: '<60 sec', label: 'To generate a full report' },
    { value: '100%',  label: 'Of client questions predicted' },
  ]
  return (
    <section className="lp-section-pad" style={{ background: C.bgAlt }}>
      <div style={{ maxWidth: MAX, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <SectionLabel center accent>What agencies say</SectionLabel>
          <h2 className="lp-h2" style={{ ...F.sans, fontWeight: 800, color: C.text, margin: 0 }}>
            Account managers love it. Agency owners keep it.
          </h2>
        </div>

        <div className="lp-testimonials-grid">
          {testimonials.map(t => (
            <div key={t.name} style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 14, padding: '28px' }}>
              <div style={{ display: 'flex', gap: 2, marginBottom: 14 }}>
                {[1,2,3,4,5].map(s => <span key={s} style={{ color: C.amber, fontSize: 14 }}>★</span>)}
              </div>
              <p style={{ ...F.sans, fontSize: 15, color: '#334155', lineHeight: 1.65, marginBottom: 20, fontStyle: 'italic' }}>"{t.quote}"</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: C.accentBg, display: 'flex', alignItems: 'center', justifyContent: 'center', ...F.sans, fontSize: 13, fontWeight: 700, color: C.accent }}>
                  {t.initials}
                </div>
                <div>
                  <div style={{ ...F.sans, fontSize: 13, fontWeight: 700, color: C.text }}>{t.name}</div>
                  <div style={{ ...F.sans, fontSize: 12, color: C.textSubtle }}>{t.role} · {t.company}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="lp-stats-grid">
          {stats.map(s => (
            <div key={s.label} style={{ background: C.bg, padding: '28px 24px', textAlign: 'center' }}>
              <div style={{ ...F.sans, fontSize: 34, fontWeight: 800, color: C.accent, letterSpacing: '-0.03em', marginBottom: 4 }}>{s.value}</div>
              <div style={{ ...F.sans, fontSize: 13, color: C.textSubtle, fontWeight: 500 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─────────── Pricing ─────────── */

function Pricing({ billing, setBilling }) {
  const plans = [
    {
      key: 'growth', name: 'Growth', monthly: 199, yearly: 159,
      desc: 'For agencies managing up to 10 client accounts.',
      features: [
        'Up to 10 client accounts',
        'Client report + AM internal brief',
        'Predicted questions (3 per report)',
        'White-label branding',
        'Email delivery',
      ],
    },
    {
      key: 'pro', name: 'Pro Agency', monthly: 499, yearly: 399,
      desc: 'For growing agencies with larger portfolios.',
      featured: true,
      features: [
        'Up to 30 client accounts',
        'Everything in Growth',
        'Extended Q&A (5 questions per report)',
        'Scheduled auto-delivery',
        'Team access (up to 5 seats)',
        'Custom templates',
      ],
    },
    {
      key: 'scale', name: 'Scale', monthly: 999, yearly: 799,
      desc: 'Unlimited scale for enterprise teams.',
      features: [
        'Up to 75 client accounts',
        'Everything in Pro Agency',
        'Unlimited team seats',
        'Custom domain',
        'API access',
        'Priority support + custom onboarding',
      ],
    },
  ]

  return (
    <section id="pricing" className="lp-section-pad" style={{ background: C.bgAlt }}>
      <div style={{ maxWidth: MAX, margin: '0 auto' }}>
        <div style={{ textAlign: 'center' }}>
          <SectionLabel center accent>Pricing</SectionLabel>
          <h2 className="lp-h2" style={{ ...F.sans, fontWeight: 800, color: C.text, margin: 0, marginBottom: 10 }}>
            Simple, transparent pricing.
          </h2>
          <p style={{ ...F.sans, fontSize: 17, color: C.textMuted }}>Start free. Scale as your agency grows.</p>
          <BillingToggle billing={billing} setBilling={setBilling} />
        </div>

        <div className="lp-pricing-grid">
          {plans.map(p => {
            const price = billing === 'yearly' ? p.yearly : p.monthly
            return (
              <div key={p.key} className={`lp-pricing-card${p.featured ? ' lp-pricing-card-featured' : ''}`} style={{ display: 'flex', flexDirection: 'column' }}>
                {p.featured && (
                  <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', background: C.amber, color: '#fff', ...F.sans, fontSize: 11, fontWeight: 700, padding: '3px 12px', borderRadius: 20, letterSpacing: '0.05em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                    Most Popular
                  </div>
                )}
                <div style={{ ...F.sans, fontSize: 13, fontWeight: 600, marginBottom: 6, color: p.featured ? 'rgba(255,255,255,0.75)' : C.textMuted }}>
                  {p.name}
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 6 }}>
                  <span style={{ ...F.sans, fontSize: 42, fontWeight: 800, lineHeight: 1, color: p.featured ? '#fff' : C.text }}>${price}</span>
                  <span style={{ ...F.sans, fontSize: 15, color: p.featured ? 'rgba(255,255,255,0.6)' : C.textSubtle, fontWeight: 400 }}>/mo{billing === 'yearly' ? ', billed annually' : ''}</span>
                </div>
                <div style={{ ...F.sans, fontSize: 13, color: p.featured ? 'rgba(255,255,255,0.7)' : C.textMuted, marginBottom: 24, lineHeight: 1.5 }}>
                  {p.desc}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28, flex: 1 }}>
                  {p.features.map(f => (
                    <div key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, ...F.sans, fontSize: 14 }}>
                      <svg width="16" height="16" viewBox="0 0 16 16" style={{ marginTop: 1, flexShrink: 0 }}>
                        <circle cx="8" cy="8" r="7" fill={p.featured ? 'rgba(255,255,255,0.2)' : '#EEF2FF'}/>
                        <path d="M5 8l2 2 4-4" stroke={p.featured ? '#fff' : C.accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                      </svg>
                      <span style={{ color: p.featured ? 'rgba(255,255,255,0.9)' : C.textMuted }}>{f}</span>
                    </div>
                  ))}
                </div>
                <Link
                  to={`/sign-up?plan=${p.key}&billing=${billing}`}
                  style={{
                    ...F.sans, fontSize: 14, fontWeight: 700,
                    display: 'block', textAlign: 'center', textDecoration: 'none',
                    padding: '12px', borderRadius: 9,
                    border: p.featured ? '2px solid rgba(255,255,255,0.35)' : `2px solid ${C.accent}`,
                    background: p.featured ? 'rgba(255,255,255,0.15)' : C.accent,
                    color: '#fff',
                    transition: 'opacity 0.15s',
                  }}
                >
                  Start Free Trial
                </Link>
              </div>
            )
          })}
        </div>

        <div style={{ marginTop: 28, textAlign: 'center', ...F.sans, fontSize: 14, color: C.textMuted }}>
          Need more than 75 accounts?{' '}
          <a href="mailto:hello@retainr.io?subject=Enterprise" style={{ color: C.text, textDecoration: 'underline', textUnderlineOffset: 3 }}>
            Contact us
          </a>
        </div>
      </div>
    </section>
  )
}

function BillingToggle({ billing, setBilling }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: 28 }}>
      <div style={{ display: 'inline-flex', gap: 4, padding: 4, background: C.bg, border: `1px solid ${C.border}`, borderRadius: 10 }}>
        {[['monthly', 'Monthly', null], ['yearly', 'Yearly', 'Save 20%']].map(([key, label, badge]) => {
          const active = billing === key
          return (
            <button key={key} onClick={() => setBilling(key)} style={{ ...F.sans, fontSize: 13, fontWeight: 500, padding: '8px 16px', border: 'none', cursor: 'pointer', borderRadius: 7, background: active ? C.text : 'transparent', color: active ? '#fff' : C.textMuted, display: 'inline-flex', alignItems: 'center', gap: 8, transition: 'background 0.15s, color 0.15s' }}>
              {label}
              {badge && <span style={{ ...F.sans, fontSize: 10, fontWeight: 600, padding: '2px 7px', borderRadius: 10, background: active ? 'rgba(255,255,255,0.18)' : C.accentBg, color: active ? '#fff' : C.accent }}>{badge}</span>}
            </button>
          )
        })}
      </div>
    </div>
  )
}

/* ─────────── FAQ ─────────── */

function FAQ() {
  const items = [
    { q: 'Can I cancel any time?', a: 'Yes — from the billing portal. Service continues through the end of the period you have already paid for. No questions, no friction.' },
    { q: 'What if I exceed my client account limit?', a: 'You can add accounts above the cap on a per-account basis, or move to the next tier. We never auto-upgrade you.' },
    { q: 'How does retainr predict client questions?', a: 'The AI analyzes your actual account data each month — looking at what changed, by how much, and what a client would naturally notice — then surfaces the most likely questions and drafts accurate answers. It\'s account-specific, not generic templates.' },
    { q: 'Do you support Meta or LinkedIn Ads?', a: 'Google Ads is fully supported today. Meta and LinkedIn are on the roadmap — reach out if either is critical to your workflow.' },
    { q: 'Is the client report white-labeled?', a: 'Yes. Every client-facing report carries your agency name and branding — no retainr mention in the body. The AM internal brief is only ever visible to your team.' },
  ]
  return (
    <section className="lp-section-pad" style={{ background: C.bg, paddingTop: 80, paddingBottom: 80 }}>
      <div style={{ maxWidth: 760, margin: '0 auto' }}>
        <SectionLabel center accent>Common questions</SectionLabel>
        <h2 className="lp-h2" style={{ ...F.sans, fontWeight: 800, color: C.text, margin: 0, textAlign: 'center', marginBottom: 56 }}>
          Before you ask.
        </h2>
        {items.map(it => (
          <details key={it.q} className="lp-faq" style={{ borderTop: `1px solid ${C.border}`, padding: '20px 0' }}>
            <summary style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, ...F.sans, fontSize: 17, fontWeight: 700, color: C.text, lineHeight: 1.4 }}>
              <span>{it.q}</span>
              <span className="lp-faq-icon" style={{ ...F.sans, fontSize: 18, color: C.textSubtle, transition: 'transform 0.2s', flexShrink: 0 }}>+</span>
            </summary>
            <p style={{ ...F.sans, fontSize: 15, lineHeight: 1.65, color: C.textMuted, margin: 0, marginTop: 14, maxWidth: 640 }}>{it.a}</p>
          </details>
        ))}
        <div style={{ borderTop: `1px solid ${C.border}` }} />
      </div>
    </section>
  )
}

/* ─────────── Final CTA ─────────── */

function FinalCTA() {
  return (
    <section style={{ padding: '96px 24px', background: C.navy, textAlign: 'center' }}>
      <div style={{ maxWidth: 640, margin: '0 auto' }}>
        <h2 style={{ ...F.sans, fontSize: 44, fontWeight: 800, color: '#fff', letterSpacing: '-0.03em', lineHeight: 1.1, margin: 0, marginBottom: 16 }}>
          Stop losing clients to poor communication.
        </h2>
        <p style={{ ...F.sans, fontSize: 18, color: 'rgba(255,255,255,0.72)', marginBottom: 36, lineHeight: 1.6 }}>
          Connect Google Ads in two minutes. Your first AM brief — complete with predicted questions and answers — generates in under 60 seconds.
        </p>
        <p style={{ ...F.sans, fontSize: 15, color: 'rgba(255,255,255,0.60)', marginBottom: 36, lineHeight: 1.6 }}>
          If you're not sending a real client report within your first week, we'll refund you — no questions asked.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
          <Link to="/sign-up" style={{ ...F.sans, fontSize: 16, fontWeight: 700, color: C.accent, background: '#fff', border: 'none', padding: '15px 32px', borderRadius: 10, textDecoration: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.15)', display: 'inline-block' }}>
            Start Free Trial
          </Link>
          <Link to="/sample-reports" style={{ ...F.sans, fontSize: 16, fontWeight: 600, color: '#fff', background: 'transparent', border: '2px solid rgba(255,255,255,0.32)', padding: '13px 28px', borderRadius: 10, textDecoration: 'none', display: 'inline-block' }}>
            See Sample Reports
          </Link>
        </div>
        <p style={{ ...F.sans, marginTop: 18, fontSize: 13, color: 'rgba(255,255,255,0.45)' }}>14-day free trial · No credit card required · Cancel anytime</p>
      </div>
    </section>
  )
}

/* ─────────── Footer ─────────── */

function Footer() {
  return (
    <footer style={{ padding: '48px 24px', background: C.navy }}>
      <div style={{ maxWidth: MAX, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <Logo dark />
        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
          {[['/pricing','Pricing'], ['/sample-reports','Sample Reports'], ['/privacy','Privacy'], ['/terms','Terms'], ['/security','Security'], ['/support','Support']].map(([href, label]) => (
            href.startsWith('/') ? (
              <Link key={href} to={href} style={{ ...F.sans, fontSize: 13, color: 'rgba(255,255,255,0.45)', textDecoration: 'none' }}>{label}</Link>
            ) : (
              <a key={href} href={href} style={{ ...F.sans, fontSize: 13, color: 'rgba(255,255,255,0.45)', textDecoration: 'none' }}>{label}</a>
            )
          ))}
        </div>
        <span style={{ ...F.sans, fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>© 2026 retainr. All rights reserved.</span>
      </div>
    </footer>
  )
}

/* ─────────── Shared primitives ─────────── */

function SectionLabel({ children, center, accent: isAccent }) {
  return (
    <div style={{
      ...F.sans, fontSize: 12, fontWeight: 700,
      letterSpacing: '0.10em', textTransform: 'uppercase',
      color: isAccent ? C.accent : C.textSubtle,
      textAlign: center ? 'center' : 'left',
      marginBottom: 12,
    }}>
      {children}
    </div>
  )
}
