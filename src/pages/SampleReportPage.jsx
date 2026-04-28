import { useState } from 'react'
import { Link } from 'react-router-dom'

/* ─────────── Design tokens (mirrored from LandingPage) ─────────── */

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
  positive:     '#15803D',
  negative:     '#DC2626',
}

const PAGE_CSS = `
  html, body { background: ${C.bg}; }
  * { box-sizing: border-box; }

  .sr-tab-btn {
    background: transparent;
    border: 1px solid ${C.border};
    border-radius: 8px;
    padding: 10px 20px;
    cursor: pointer;
    transition: background 0.15s, border-color 0.15s, color 0.15s;
    color: ${C.textMuted};
  }
  .sr-tab-btn:hover { border-color: ${C.borderStrong}; color: ${C.text}; }
  .sr-tab-btn.active {
    background: ${C.accent};
    border-color: ${C.accent};
    color: #FFFFFF;
  }

  @media (max-width: 640px) {
    .sr-metrics-grid { grid-template-columns: repeat(2, 1fr) !important; }
    .sr-report-pad { padding: 24px 20px !important; }
    .sr-report-header { padding: 28px 20px 20px !important; }
    .sr-report-footer { padding: 12px 20px !important; }
    .sr-tabs { flex-direction: column !important; align-items: stretch !important; }
    .sr-tab-btn { text-align: left; }
  }
`

/* ─────────── Sample data ─────────── */

const REPORTS = [
  {
    id: 'apex',
    client: 'Apex Digital',
    industry: 'E-commerce',
    period: 'April 2025 vs March 2025',
    generatedIn: '52 sec',
    shareUrl: 'retainr.io/r/apex-digital',
    metrics: [
      { label: 'Impressions',  value: '284,512', delta: '+3%',    up: true  },
      { label: 'Clicks',       value: '8,204',   delta: '+7%',    up: true  },
      { label: 'CTR',          value: '2.88%',   delta: '+0.1pt', up: true  },
      { label: 'Conversions',  value: '1,284',   delta: '+18%',   up: true  },
      { label: 'Cost / Conv.', value: '$41.32',  delta: '−11%',   up: true  },
      { label: 'Spend',        value: '$53,056', delta: '+5%',    up: null  },
    ],
    narrative: `April was a strong month for Apex Digital. Conversion volume increased 18% over March while cost-per-conversion dropped 11%, indicating the campaign is converting more efficiently rather than simply spending more. Shopping campaigns drove the majority of the improvement, with brand search continuing to outperform non-brand on both CTR and conversion rate. Total spend increased only 5% against an 18% lift in conversions — a meaningful efficiency gain heading into the summer season.`,
    takeaway: `Performance gains this month are driven by efficiency improvements — the account is doing more with roughly the same budget.`,
    explanations: [
      `"We got 18% more conversions this month without meaningfully increasing your budget — your cost per sale dropped to $41."`,
      `"Your Shopping campaigns are outperforming the market average right now. We've been reallocating budget toward the highest-converting product categories."`,
      `"Brand search is pulling a higher share of your conversions, which typically signals strong customer intent and healthy repeat purchase behavior."`,
    ],
    talkingPoints: [
      'Conversions up 18%, CPA down 11% — the account is getting more efficient, not just bigger.',
      'Shopping campaigns are the key driver; we\'ve shifted more budget there over the past 4 weeks.',
      'Brand search is healthy — up in volume and converting at a premium rate.',
      'Heading into Q2 with strong momentum. Recommend maintaining current budget through May.',
    ],
  },
  {
    id: 'northstar',
    client: 'Northstar Marketing',
    industry: 'B2B SaaS — lead gen',
    period: 'March 2025 vs February 2025',
    generatedIn: '44 sec',
    shareUrl: 'retainr.io/r/northstar-mktg',
    metrics: [
      { label: 'Impressions',  value: '142,840', delta: '−4%',    up: false },
      { label: 'Clicks',       value: '3,891',   delta: '+2%',    up: true  },
      { label: 'CTR',          value: '2.73%',   delta: '+0.16pt',up: true  },
      { label: 'Conversions',  value: '94',      delta: '−6%',    up: false },
      { label: 'Cost / Conv.', value: '$312.40', delta: '+8%',    up: false },
      { label: 'Spend',        value: '$29,366', delta: '+2%',    up: null  },
    ],
    narrative: `March shows the typical Q1-end softness expected in B2B SaaS — decision-makers are finalising budget cycles and conversion latency increases. Conversion volume dipped 6% and cost-per-lead rose 8%, both within the expected seasonal range for this vertical. Crucially, CTR improved 0.16 percentage points despite lower impression volume, indicating the audience targeting refinements made in February are holding. Pipeline velocity from paid leads — tracked via the CRM integration — remained consistent with February, suggesting lead quality has not deteriorated.`,
    takeaway: `The CPL increase reflects seasonal B2B buying patterns in March, not a structural problem. Lead quality metrics remain strong.`,
    explanations: [
      `"March is historically soft in B2B SaaS — decision cycles slow at quarter-end. We expected this and the account performed in line with that pattern."`,
      `"Even with slightly fewer conversions, the leads that did convert are going through the pipeline at the same rate as February — quality is holding."`,
      `"We kept spend nearly flat and used the lower-volume period to refine audience targeting. Those refinements are showing up in a higher CTR heading into Q2."`,
    ],
    talkingPoints: [
      'CPL increase is seasonal — March is consistently the softest month in B2B SaaS lead gen.',
      'Lead quality is stable; pipeline velocity from paid is unchanged vs. February.',
      'CTR improved despite fewer impressions — the targeting work is paying off.',
      'April and May are typically the strongest months in this vertical. We\'re well-positioned.',
    ],
  },
  {
    id: 'meridian',
    client: 'Meridian Home Services',
    industry: 'Local services — HVAC',
    period: 'April 2025 vs March 2025',
    generatedIn: '38 sec',
    shareUrl: 'retainr.io/r/meridian-hvac',
    metrics: [
      { label: 'Impressions',  value: '98,220',  delta: '+12%',   up: true  },
      { label: 'Clicks',       value: '4,108',   delta: '+19%',   up: true  },
      { label: 'CTR',          value: '4.18%',   delta: '+0.28pt',up: true  },
      { label: 'Conversions',  value: '187',     delta: '+24%',   up: true  },
      { label: 'Cost / Conv.', value: '$68.40',  delta: '−9%',    up: true  },
      { label: 'Spend',        value: '$12,791', delta: '+13%',   up: null  },
    ],
    narrative: `April marks the start of peak season for Meridian Home Services, and the account responded strongly. Conversion volume jumped 24% — driven by the seasonal demand surge for AC tune-ups and maintenance — while cost-per-conversion fell 9% as click quality improved. The service-area targeting refinements implemented in late March (tightening the radius around high-value zip codes and excluding low-conversion rural zones) contributed meaningfully to the CTR lift and conversion efficiency. Call volume is tracking 28% ahead of the same period last year.`,
    takeaway: `Peak season is delivering: conversions up 24%, cost per job down 9%, and call volume ahead of last year's Q2.`,
    explanations: [
      `"April is your busiest season — people turn on AC units and call immediately when they don't work. We planned for this volume and the account is delivering."`,
      `"We tightened your service-area targeting in late March to focus on zip codes with the best close rates. That's showing up as lower cost per job this month."`,
      `"Call volume is 28% ahead of April last year. The combination of seasonal demand and better targeting is driving that."`,
    ],
    talkingPoints: [
      'Conversions up 24%, cost per job down 9% — peak season is performing above expectations.',
      'Service-area targeting refinements from March are measurably improving conversion efficiency.',
      'Call volume tracking 28% ahead of same period last year.',
      'Recommend increasing budget 15–20% in May to capture continued seasonal demand.',
    ],
  },
]

/* ─────────── Page ─────────── */

export default function SampleReportPage() {
  const [active, setActive] = useState('apex')
  const report = REPORTS.find(r => r.id === active)

  return (
    <div style={{
      ...F.body, color: C.textBody, background: C.bg,
      WebkitFontSmoothing: 'antialiased',
      MozOsxFontSmoothing: 'grayscale',
      minHeight: '100vh',
    }}>
      <style>{PAGE_CSS}</style>

      {/* Nav */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: 'rgba(250,250,250,0.85)',
        backdropFilter: 'saturate(140%) blur(12px)',
        WebkitBackdropFilter: 'saturate(140%) blur(12px)',
        borderBottom: `1px solid ${C.border}`,
      }}>
        <div style={{
          maxWidth: 1080, margin: '0 auto', padding: '18px 32px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <Link to="/" style={{
            ...F.heading, fontSize: 19, fontWeight: 600,
            color: C.text, letterSpacing: '-0.01em', textDecoration: 'none',
          }}>retainr</Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <Link to="/" style={{
              ...F.body, fontSize: 14, fontWeight: 500,
              color: C.textMuted, textDecoration: 'none',
            }}>← Back to home</Link>
            <Link to="/checkout?plan=pro&billing=monthly" style={{
              ...F.body, fontSize: 14, fontWeight: 500,
              color: '#FFFFFF', background: C.accent,
              padding: '9px 18px', borderRadius: 8,
              textDecoration: 'none',
            }}>
              Start Free Trial
            </Link>
          </div>
        </div>
      </nav>

      {/* Header */}
      <div style={{
        maxWidth: 1080, margin: '0 auto',
        padding: '72px 32px 48px',
        textAlign: 'center',
      }}>
        <div style={{
          ...F.body, fontSize: 12, fontWeight: 600,
          letterSpacing: '0.12em', textTransform: 'uppercase',
          color: C.textFaint, marginBottom: 16,
        }}>
          Sample reports
        </div>
        <h1 style={{
          ...F.heading, fontSize: 44, fontWeight: 700,
          lineHeight: 1.1, letterSpacing: '-0.02em',
          color: C.text, margin: 0, marginBottom: 16,
        }}>
          What your clients receive.
        </h1>
        <p style={{
          ...F.body, fontSize: 18, lineHeight: 1.6,
          color: C.textMuted, margin: '0 auto',
          maxWidth: 560,
        }}>
          Three real-scenario reports across different agency types.
          Every section is written by AI from live Google Ads data — no templates.
        </p>
      </div>

      {/* Tab switcher */}
      <div style={{ maxWidth: 1080, margin: '0 auto', padding: '0 32px 48px' }}>
        <div className="sr-tabs" style={{
          display: 'flex', alignItems: 'center', gap: 10,
          justifyContent: 'center', flexWrap: 'wrap',
        }}>
          {REPORTS.map(r => (
            <button
              key={r.id}
              onClick={() => setActive(r.id)}
              className={`sr-tab-btn ${active === r.id ? 'active' : ''}`}
              style={{
                ...F.body, fontSize: 14, fontWeight: 500,
              }}
            >
              <span style={{ fontWeight: 600 }}>{r.client}</span>
              <span style={{
                marginLeft: 8, fontSize: 12, opacity: active === r.id ? 0.75 : 0.6,
              }}>
                {r.industry}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Report */}
      <div style={{ maxWidth: 860, margin: '0 auto', padding: '0 32px 120px' }}>
        <FullReport report={report} />

        {/* CTA */}
        <div style={{
          marginTop: 64, padding: '48px', textAlign: 'center',
          background: C.surface, border: `1px solid ${C.border}`,
          borderRadius: 16,
        }}>
          <h2 style={{
            ...F.heading, fontSize: 28, fontWeight: 700,
            lineHeight: 1.2, color: C.text,
            margin: 0, marginBottom: 12, letterSpacing: '-0.015em',
          }}>
            Generate your first report in under a minute.
          </h2>
          <p style={{
            ...F.body, fontSize: 16, lineHeight: 1.6,
            color: C.textMuted, margin: '0 auto 32px', maxWidth: 440,
          }}>
            Connect Google Ads, pick a client, click Generate.
            Your report looks exactly like this.
          </p>
          <Link
            to="/checkout?plan=pro&billing=monthly"
            style={{
              ...F.body, fontSize: 15, fontWeight: 500,
              color: '#FFFFFF', background: C.accent,
              padding: '14px 28px', borderRadius: 8,
              textDecoration: 'none', display: 'inline-block',
              boxShadow: '0 8px 16px -8px rgba(15,30,64,0.40)',
            }}
          >
            Start Free Trial — 14 days free
          </Link>
          <p style={{
            ...F.body, fontSize: 13, color: C.textFaint,
            margin: '14px 0 0 0',
          }}>
            No credit card required
          </p>
        </div>
      </div>
    </div>
  )
}

/* ─────────── Full report component ─────────── */

function FullReport({ report }) {
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
      {/* Top accent bar */}
      <div style={{ height: 4, background: C.accent }} />

      {/* Header */}
      <header className="sr-report-header" style={{
        padding: '40px 48px 24px',
        borderBottom: `1px solid ${C.border}`,
      }}>
        <div style={{
          ...F.body, fontSize: 11, fontWeight: 600,
          letterSpacing: '0.10em', textTransform: 'uppercase',
          color: C.textFaint, marginBottom: 10,
        }}>
          Monthly Performance Report · {report.period.split(' vs ')[0]}
        </div>
        <div style={{
          display: 'flex', alignItems: 'flex-start',
          justifyContent: 'space-between', gap: 24, flexWrap: 'wrap',
        }}>
          <div>
            <h2 style={{
              ...F.heading, fontSize: 30, fontWeight: 700,
              lineHeight: 1.15, color: C.text, margin: 0, marginBottom: 4,
            }}>
              {report.client}
            </h2>
            <div style={{
              ...F.body, fontSize: 13, color: C.textFaint,
            }}>
              {report.industry}
            </div>
          </div>
          <div style={{
            ...F.body, fontSize: 12, color: C.textFaint,
            display: 'flex', alignItems: 'center', gap: 8,
            paddingTop: 4,
          }}>
            <span style={{
              width: 6, height: 6, borderRadius: '50%',
              background: C.positive, flexShrink: 0,
            }} />
            Generated by retainr · {report.generatedIn}
          </div>
        </div>
      </header>

      {/* Metrics grid */}
      <div style={{
        padding: '20px 48px 24px',
        borderBottom: `1px solid ${C.border}`,
        background: C.bg,
      }}>
        <div style={{
          ...F.body, fontSize: 10, fontWeight: 600,
          letterSpacing: '0.10em', textTransform: 'uppercase',
          color: C.textFaint, marginBottom: 12,
        }}>
          Performance Summary · {report.period}
        </div>
        <div
          className="sr-metrics-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '8px',
          }}
        >
          {report.metrics.map(m => (
            <div key={m.label} style={{
              padding: '12px 14px',
              background: C.surface, borderRadius: 6,
              border: `1px solid ${C.border}`,
            }}>
              <div style={{
                ...F.body, fontSize: 10, fontWeight: 500,
                color: C.textFaint, marginBottom: 5,
              }}>
                {m.label}
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                <span style={{
                  ...F.heading, fontSize: 17, fontWeight: 600, color: C.text,
                }}>
                  {m.value}
                </span>
                <span style={{
                  ...F.body, fontSize: 11, fontWeight: 600,
                  color: m.up === true ? C.positive : m.up === false ? C.negative : C.textFaint,
                }}>
                  {m.delta}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Narrative sections */}
      <div className="sr-report-pad" style={{
        padding: '32px 48px 36px',
        display: 'flex', flexDirection: 'column', gap: 32,
      }}>
        <Section label="Monthly Performance Narrative">
          <p style={prose}>{report.narrative}</p>
        </Section>

        <Section label="Key Takeaway">
          <p style={{
            ...prose,
            margin: 0,
            paddingLeft: 16, borderLeft: `2px solid ${C.accent}`,
            background: C.accentTint, padding: '14px 16px',
            borderRadius: '0 4px 4px 0',
          }}>
            {report.takeaway}
          </p>
        </Section>

        <Section label="How to Explain This to the Client">
          <ul style={list}>
            {report.explanations.map((e, i) => (
              <li key={i} style={li}>{e}</li>
            ))}
          </ul>
        </Section>

        <Section label="Meeting Talking Points">
          <ul style={list}>
            {report.talkingPoints.map((t, i) => (
              <li key={i} style={{ ...li, display: 'flex', gap: 8 }}>
                <span style={{ color: C.textFaint, flexShrink: 0 }}>›</span>
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </Section>
      </div>

      {/* Footer */}
      <footer className="sr-report-footer" style={{
        padding: '14px 48px',
        borderTop: `1px solid ${C.border}`,
        display: 'flex', justifyContent: 'space-between',
        ...F.body, fontSize: 11, color: C.textFaint,
      }}>
        <span>{report.shareUrl}</span>
        <span>1 / 1</span>
      </footer>
    </article>
  )
}

function Section({ label, children }) {
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

const prose = { ...F.body, fontSize: 15, lineHeight: 1.7, color: '#2A2A2A', margin: 0 }
const list = {
  listStyle: 'none', padding: 0, margin: 0,
  display: 'flex', flexDirection: 'column', gap: 10,
}
const li = { ...F.body, fontSize: 15, lineHeight: 1.6, color: '#2A2A2A' }
