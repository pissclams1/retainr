import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Logo from '../components/Logo'

/* ─────────── Design tokens ─────────── */

const F = { sans: { fontFamily: "'DM Sans', system-ui, -apple-system, sans-serif" } }

const C = {
  bg:        '#FFFFFF',
  bgAlt:     '#F8FAFC',
  text:      '#0F1F3D',
  muted:     '#64748B',
  subtle:    '#94A3B8',
  border:    '#E2E8F0',
  accent:    '#04256c',
  positive:  '#10B981',
  amber:     '#F59E0B',
  navy:      '#0F1F3D',
}

const MAX = 1060

const PAGE_CSS = `
  html, body { background: ${C.bgAlt}; }
  * { box-sizing: border-box; }

  .pp-nav { background: rgba(255,255,255,0.8); border-bottom: 1px solid transparent; transition: background 0.2s, border-color 0.2s; }
  .pp-nav.scrolled { background: rgba(255,255,255,0.94); border-bottom-color: ${C.border}; backdrop-filter: blur(12px); }

  .pp-nav-link { padding: 6px 12px; border-radius: 7px; color: ${C.muted}; text-decoration: none; font-size: 14px; font-weight: 500; transition: background 0.15s, color 0.15s; }
  .pp-nav-link:hover { background: ${C.bgAlt}; color: ${C.text}; }

  .pp-plan-card { border-radius: 16px; border: 1.5px solid ${C.border}; padding: 32px 28px 28px; background: ${C.bg}; position: relative; transition: all 0.2s; display: flex; flex-direction: column; }
  .pp-plan-card:hover { border-color: rgba(4,37,108,0.45); box-shadow: 0 4px 20px rgba(0,0,0,0.07); }
  .pp-plan-card-featured { background: ${C.accent}; border-color: ${C.accent}; color: #fff; box-shadow: 0 12px 40px rgba(4,37,108,0.44); }
  .pp-plan-card-featured:hover { box-shadow: 0 16px 48px rgba(4,37,108,0.50); }

  .pp-faq-item { background: ${C.bg}; border-radius: 10px; border: 1px solid ${C.border}; overflow: hidden; }
  .pp-faq-btn { width: 100%; padding: 18px 20px; background: none; border: none; display: flex; justify-content: space-between; align-items: center; cursor: pointer; font-family: 'DM Sans', sans-serif; text-align: left; }
  .pp-faq-chevron { transition: transform 0.2s; }
  .pp-faq-chevron.open { transform: rotate(180deg); }

  .pp-cta-primary { background: ${C.bg}; color: ${C.accent}; border: none; border-radius: 10px; font-size: 15px; font-weight: 700; padding: 14px 32px; cursor: pointer; text-decoration: none; display: inline-block; box-shadow: 0 4px 20px rgba(0,0,0,0.15); transition: opacity 0.15s; }
  .pp-cta-primary:hover { opacity: 0.92; }
  .pp-cta-ghost { background: transparent; color: #fff; border: 2px solid rgba(255,255,255,0.3); border-radius: 10px; font-size: 15px; font-weight: 600; padding: 13px 28px; cursor: pointer; text-decoration: none; display: inline-block; transition: border-color 0.15s; }
  .pp-cta-ghost:hover { border-color: rgba(255,255,255,0.5); }

  .pp-plans-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; align-items: start; }
  .pp-testimonials-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }

  @media (max-width: 900px) {
    .pp-plans-grid { grid-template-columns: 1fr !important; max-width: 420px !important; margin-left: auto !important; margin-right: auto !important; }
    .pp-testimonials-grid { grid-template-columns: 1fr !important; max-width: 480px !important; margin-left: auto !important; margin-right: auto !important; }
  }
`

/* ─────────── Data ─────────── */

const PLANS = [
  {
    id: 'starter',
    name: 'Starter',
    monthly: 199,
    annual: 159,
    desc: 'For agencies getting started with automated client reporting.',
    highlight: false,
    features: [
      { label: 'Client accounts', value: 'Up to 5' },
      { label: 'AI report generation', value: true },
      { label: 'Client-facing reports', value: true },
      { label: 'Internal AM briefings', value: true },
      { label: 'Predicted client Q&A', value: true },
      { label: 'Email delivery to clients', value: true },
      { label: 'White-label branding', value: false },
      { label: 'Scheduled auto-delivery', value: false },
      { label: 'Custom templates', value: false },
      { label: 'Team seats', value: false },
      { label: 'API access', value: false },
    ],
    cta: 'Start free trial',
  },
  {
    id: 'growth',
    name: 'Growth',
    monthly: 499,
    annual: 399,
    desc: 'For growing agencies with larger portfolios and teams.',
    highlight: true,
    badge: 'Most Popular',
    features: [
      { label: 'Client accounts', value: 'Up to 25' },
      { label: 'AI report generation', value: true },
      { label: 'Client-facing reports', value: true },
      { label: 'Internal AM briefings', value: true },
      { label: 'Predicted client Q&A', value: true },
      { label: 'Email delivery to clients', value: true },
      { label: 'White-label branding', value: true },
      { label: 'Scheduled auto-delivery', value: true },
      { label: 'Custom templates', value: true },
      { label: 'Team seats', value: 'Up to 5' },
      { label: 'API access', value: false },
    ],
    cta: 'Start free trial',
  },
  {
    id: 'agency',
    name: 'Agency',
    monthly: 999,
    annual: 799,
    desc: 'Unlimited scale for enterprise teams with custom needs.',
    highlight: false,
    features: [
      { label: 'Client accounts', value: 'Unlimited' },
      { label: 'AI report generation', value: true },
      { label: 'Client-facing reports', value: true },
      { label: 'Internal AM briefings', value: true },
      { label: 'Predicted client Q&A', value: true },
      { label: 'Email delivery to clients', value: true },
      { label: 'White-label branding', value: true },
      { label: 'Scheduled auto-delivery', value: true },
      { label: 'Custom templates', value: true },
      { label: 'Team seats', value: 'Up to 10' },
      { label: 'API access', value: true },
    ],
    cta: 'Start free trial',
  },
]

const FAQS = [
  { q: 'What counts as a client account?', a: 'Each Google Ads account (or MCC sub-account) you connect counts as one client account. You can connect multiple accounts across different clients.' },
  { q: 'Can I switch plans later?', a: 'Yes — upgrade or downgrade at any time. Changes take effect at the start of your next billing cycle.' },
  { q: 'What happens after my free trial?', a: "After 14 days you'll be prompted to choose a plan. We won't charge you anything without confirmation." },
  { q: 'Do clients see retainr branding?', a: "On Starter, reports include a small 'Powered by retainr' footer. On Growth and Agency, reports are fully white-labeled with your agency branding." },
  { q: 'Is my Google Ads data safe?', a: 'retainr uses read-only OAuth access to Google Ads. We never store ad credentials and cannot make changes to your campaigns.' },
  { q: 'How does email delivery work?', a: 'Client-facing reports are automatically emailed directly to your client contacts after each reporting cycle — no login required for the client. You can also share a link for the web view.' },
  { q: 'Do you offer custom enterprise pricing?', a: 'Yes — for agencies with 50+ accounts or specific compliance requirements, contact us for a custom quote.' },
]

/* ─────────── Components ─────────── */

function CheckIcon({ highlight }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, marginTop: 1 }}>
      <circle cx="8" cy="8" r="7" fill={highlight ? 'rgba(255,255,255,0.22)' : `${C.accent}18`} />
      <path d="M5 8l2 2 4-4" stroke={highlight ? '#fff' : C.accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  )
}

function DashIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, marginTop: 1 }}>
      <circle cx="8" cy="8" r="7" fill="#F1F5F9" />
      <path d="M5.5 8h5" stroke="#CBD5E1" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function PlanCard({ plan, annual }) {
  const price = annual ? plan.annual : plan.monthly
  const { highlight } = plan

  return (
    <div className={`pp-plan-card${highlight ? ' pp-plan-card-featured' : ''}`}>
      {plan.badge && (
        <div style={{
          position: 'absolute', top: -13, left: '50%', transform: 'translateX(-50%)',
          background: C.amber, color: '#fff', fontSize: 11, fontWeight: 700,
          padding: '3px 14px', borderRadius: 20, letterSpacing: '0.05em',
          textTransform: 'uppercase', whiteSpace: 'nowrap',
        }}>
          {plan.badge}
        </div>
      )}

      <div style={{ ...F.sans, fontSize: 13, fontWeight: 600, marginBottom: 6, color: highlight ? 'rgba(255,255,255,0.65)' : C.muted }}>{plan.name}</div>

      <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 4 }}>
        <span style={{ ...F.sans, fontSize: 44, fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1 }}>${price}</span>
        <span style={{ ...F.sans, fontSize: 14, opacity: 0.55 }}>/mo</span>
      </div>

      {annual && (
        <div style={{ ...F.sans, fontSize: 12, marginBottom: 4, color: highlight ? 'rgba(255,255,255,0.6)' : C.positive, fontWeight: 600 }}>
          Save ${(plan.monthly - plan.annual) * 12}/yr
        </div>
      )}

      <div style={{ ...F.sans, fontSize: 13, lineHeight: 1.55, marginBottom: 24, opacity: 0.7, minHeight: 48 }}>{plan.desc}</div>

      <Link to="/sign-up" style={{
        display: 'block', textAlign: 'center', padding: '12px',
        borderRadius: 9, marginBottom: 24,
        border: highlight ? '2px solid rgba(255,255,255,0.35)' : `2px solid ${C.accent}`,
        background: highlight ? 'rgba(255,255,255,0.14)' : C.accent,
        color: '#fff', ...F.sans, fontSize: 14, fontWeight: 700,
        textDecoration: 'none',
      }}>
        {plan.cta}
      </Link>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 9 }}>
        {plan.features.map(({ label, value }) => (
          <div key={label} style={{ display: 'flex', alignItems: 'flex-start', gap: 9 }}>
            {value === false ? <DashIcon /> : <CheckIcon highlight={highlight} />}
            <span style={{ ...F.sans, fontSize: 13, lineHeight: 1.4, opacity: value === false ? 0.4 : 1 }}>
              {label}
              {typeof value === 'string' && <strong style={{ marginLeft: 4 }}>— {value}</strong>}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="pp-faq-item">
      <button className="pp-faq-btn" onClick={() => setOpen(o => !o)}>
        <span style={{ ...F.sans, fontSize: 15, fontWeight: 600, color: C.text }}>{q}</span>
        <svg className={`pp-faq-chevron${open ? ' open' : ''}`} width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M4.5 6.75L9 11.25L13.5 6.75" stroke={C.muted} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && (
        <div style={{ padding: '0 20px 18px' }}>
          <p style={{ ...F.sans, fontSize: 14, color: C.muted, lineHeight: 1.7, margin: 0 }}>{a}</p>
        </div>
      )}
    </div>
  )
}

/* ─────────── Page ─────────── */

export default function PricingPage() {
  const [annual, setAnnual] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', h)
    return () => window.removeEventListener('scroll', h)
  }, [])

  return (
    <div style={{ ...F.sans, color: C.text, background: C.bgAlt, WebkitFontSmoothing: 'antialiased', minHeight: '100vh' }}>
      <style>{PAGE_CSS}</style>

      {/* Nav */}
      <nav className={`pp-nav${scrolled ? ' scrolled' : ''}`} style={{ position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: MAX, margin: '0 auto', padding: '0 32px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
            <Logo />
            <div style={{ display: 'flex', gap: 4 }}>
              {[['/', 'Home'], ['/sample-reports', 'Sample reports'], ['/#features', 'Features']].map(([href, label]) => (
                href.startsWith('/') && !href.startsWith('/#') ? (
                  <Link key={href} to={href} className="pp-nav-link" style={F.sans}>{label}</Link>
                ) : (
                  <a key={href} href={href} className="pp-nav-link" style={F.sans}>{label}</a>
                )
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <Link to="/sign-in" style={{ ...F.sans, fontSize: 14, fontWeight: 500, color: C.muted, padding: '8px 14px', textDecoration: 'none' }}>Sign in</Link>
            <Link to="/sign-up" style={{ ...F.sans, fontSize: 14, fontWeight: 700, color: '#fff', background: C.accent, textDecoration: 'none', padding: '9px 20px', borderRadius: 8 }}>Start Free Trial</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <div style={{ background: C.bg, borderBottom: `1px solid ${C.border}`, padding: '56px 32px 48px', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: `${C.accent}12`, border: `1px solid ${C.accent}25`, borderRadius: 20, padding: '4px 14px', marginBottom: 20, ...F.sans, fontSize: 13, fontWeight: 600, color: C.accent }}>
          Pricing
        </div>
        <h1 style={{ ...F.sans, fontSize: 44, fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: 14 }}>
          Simple, transparent pricing
        </h1>
        <p style={{ ...F.sans, fontSize: 17, color: C.muted, lineHeight: 1.65, maxWidth: 480, margin: '0 auto 28px' }}>
          Start free for 14 days. No credit card required. Cancel anytime.
        </p>

        {/* Billing toggle */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12, background: '#F1F5F9', borderRadius: 10, padding: '5px 6px' }}>
          {[['Monthly', false], ['Annual', true]].map(([label, val]) => (
            <button key={label} onClick={() => setAnnual(val)} style={{
              ...F.sans, padding: '7px 20px', borderRadius: 7, border: 'none', cursor: 'pointer',
              background: annual === val ? C.bg : 'transparent',
              color: annual === val ? C.text : C.muted,
              fontSize: 14, fontWeight: 600,
              boxShadow: annual === val ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
              transition: 'all 0.15s',
            }}>
              {label}
              {val && <span style={{ marginLeft: 6, fontSize: 11, fontWeight: 700, color: C.positive, background: `${C.positive}18`, padding: '1px 6px', borderRadius: 4 }}>Save 20%</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Pricing cards */}
      <div style={{ maxWidth: MAX, margin: '0 auto', padding: '56px 32px' }}>
        <div className="pp-plans-grid">
          {PLANS.map(plan => <PlanCard key={plan.id} plan={plan} annual={annual} />)}
        </div>

        {/* Enterprise callout */}
        <div style={{
          marginTop: 20, background: C.bg, borderRadius: 14, border: `1px solid ${C.border}`,
          padding: '24px 32px', display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', flexWrap: 'wrap', gap: 16,
        }}>
          <div>
            <div style={{ ...F.sans, fontSize: 15, fontWeight: 700, marginBottom: 4 }}>Need more than 10 team seats or 50+ accounts?</div>
            <div style={{ ...F.sans, fontSize: 14, color: C.muted }}>Custom enterprise plans with volume pricing, SSO, dedicated onboarding, and a named account manager.</div>
          </div>
          <a href="mailto:hello@retainr.io" style={{ ...F.sans, padding: '11px 22px', borderRadius: 9, border: `1.5px solid ${C.border}`, background: C.bg, color: C.text, fontSize: 14, fontWeight: 700, textDecoration: 'none', whiteSpace: 'nowrap' }}>
            Talk to sales →
          </a>
        </div>

        {/* ROI context */}
        <div style={{ marginTop: 48, background: `${C.accent}08`, border: `1px solid ${C.accent}18`, borderRadius: 14, padding: '28px 32px' }}>
          <div style={{ ...F.sans, fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: C.accent, marginBottom: 10 }}>The math is simple</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 32 }}>
            {[
              { stat: '1 retained client', label: `= 12× the cost of the Growth plan per year` },
              { stat: '4.8 hrs/mo saved', label: 'per account × 25 accounts = 120 hrs/mo freed' },
              { stat: '$0 extra tools', label: 'retainr replaces your reporting stack entirely' },
            ].map(({ stat, label }) => (
              <div key={stat}>
                <div style={{ ...F.sans, fontSize: 18, fontWeight: 800, color: C.accent, letterSpacing: '-0.02em', marginBottom: 4 }}>{stat}</div>
                <div style={{ ...F.sans, fontSize: 13, color: C.muted }}>{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials */}
        <div style={{ marginTop: 56 }}>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <div style={{ ...F.sans, fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: C.accent, marginBottom: 10 }}>What agencies say about pricing</div>
            <h2 style={{ ...F.sans, fontSize: 32, fontWeight: 800, letterSpacing: '-0.025em' }}>The ROI is immediate</h2>
          </div>
          <div className="pp-testimonials-grid" style={{ display: 'grid' }}>
            {[
              { quote: "We used to pay a junior AM just to write reports. retainr costs less than a day of that salary and saves 20+ hours a month.", name: "Marcus T.", role: "Agency Director · Growth Labs", initials: "MT" },
              { quote: "The Growth plan pays for itself in the first client renewal it helps us win. The ROI is embarrassingly obvious.", name: "Priya N.", role: "Head of Client Success · ClickWise", initials: "PN" },
              { quote: "I was skeptical about another SaaS subscription, but this one actually replaced real labor cost. No-brainer.", name: "Sarah K.", role: "Head of PPC · Apex Digital", initials: "SK" },
            ].map(({ quote, name, role, initials }) => (
              <div key={name} style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 14, padding: '24px' }}>
                <div style={{ display: 'flex', gap: 2, marginBottom: 12 }}>
                  {[1, 2, 3, 4, 5].map(s => <span key={s} style={{ color: C.amber, fontSize: 13 }}>★</span>)}
                </div>
                <p style={{ ...F.sans, fontSize: 14, color: '#334155', lineHeight: 1.65, fontStyle: 'italic', marginBottom: 16 }}>"{quote}"</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                  <div style={{ width: 34, height: 34, borderRadius: '50%', background: `${C.accent}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: C.accent }}>{initials}</div>
                  <div>
                    <div style={{ ...F.sans, fontSize: 13, fontWeight: 700 }}>{name}</div>
                    <div style={{ ...F.sans, fontSize: 12, color: C.muted }}>{role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div style={{ marginTop: 56 }}>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <div style={{ ...F.sans, fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: C.accent, marginBottom: 10 }}>FAQ</div>
            <h2 style={{ ...F.sans, fontSize: 32, fontWeight: 800, letterSpacing: '-0.025em' }}>Common questions</h2>
          </div>
          <div style={{ maxWidth: 680, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 2 }}>
            {FAQS.map(faq => <FaqItem key={faq.q} {...faq} />)}
          </div>
        </div>

        {/* CTA */}
        <div style={{ marginTop: 56, background: C.accent, borderRadius: 16, padding: '48px', textAlign: 'center' }}>
          <h2 style={{ ...F.sans, fontSize: 32, fontWeight: 800, color: '#fff', letterSpacing: '-0.025em', marginBottom: 10 }}>
            Start your free 14-day trial
          </h2>
          <p style={{ ...F.sans, fontSize: 16, color: 'rgba(255,255,255,0.65)', marginBottom: 28, lineHeight: 1.6 }}>
            No credit card required. Get your first report in under 60 seconds.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
            <Link to="/sign-up" className="pp-cta-primary" style={F.sans}>Start Free Trial</Link>
            <Link to="/sample-reports" className="pp-cta-ghost" style={F.sans}>See Sample Reports</Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer style={{ padding: '40px 32px', background: C.navy, color: 'rgba(255,255,255,0.5)' }}>
        <div style={{ maxWidth: MAX, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <Logo dark />
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
            {[['/', 'Product'], ['/pricing', 'Pricing'], ['/sample-reports', 'Sample Reports'], ['/privacy', 'Privacy'], ['/terms', 'Terms']].map(([href, label]) => (
              <Link key={href} to={href} style={{ ...F.sans, fontSize: 13, color: 'rgba(255,255,255,0.45)', textDecoration: 'none' }}>{label}</Link>
            ))}
          </div>
          <span style={{ ...F.sans, fontSize: 12 }}>© 2025 retainr. All rights reserved.</span>
        </div>
      </footer>
    </div>
  )
}
