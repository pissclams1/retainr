import { Link } from 'react-router-dom'
import { useSessionAuth } from '../hooks/useSessionAuth'

const colors = {
  navy: '#04256C',
  ink: '#0F1F3D',
  muted: '#64748B',
  light: '#F8FAFC',
  border: '#E2E8F0',
  red: '#DC2626',
  amber: '#B45309',
  green: '#047857',
}

const sampleFlags = [
  { label: 'Federal Pacific panel detected', severity: 'High', detail: 'Often creates underwriting friction before a carrier will bind.' },
  { label: 'Roof age may exceed preferred appetite', severity: 'Review', detail: 'Roof age and remaining useful life should be checked before quoting.' },
  { label: 'Polybutylene plumbing language found', severity: 'High', detail: 'Commonly treated as an issue by Florida property underwriters.' },
]

const objections = [
  ['Do I need another dashboard?', 'No. BindIQ is built around one workflow: upload an inspection report, get underwriting concerns, move on.'],
  ['Is this replacing underwriting?', 'No. It is a pre-submission triage tool to help agents catch obvious inspection issues earlier.'],
  ['What reports does it support?', 'Florida 4-point and wind mitigation reports. The output is designed for property agents, not generic document review.'],
  ['Why not just read the PDF myself?', 'You can. BindIQ is for the moments when you are busy, the file is long, and you want the red flags surfaced before spending time quoting.'],
]

function Logo() {
  return (
    <div style={{ fontWeight: 900, fontSize: 24, letterSpacing: '-0.04em', color: colors.ink }}>
      Bind<span style={{ color: colors.red }}>IQ</span>
    </div>
  )
}

function ButtonLink({ to, children, secondary = false }) {
  return (
    <Link
      to={to}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 48,
        padding: '0 22px',
        borderRadius: 10,
        textDecoration: 'none',
        fontWeight: 800,
        fontSize: 15,
        color: secondary ? colors.ink : '#fff',
        background: secondary ? '#fff' : colors.navy,
        border: secondary ? `1px solid ${colors.border}` : `1px solid ${colors.navy}`,
        boxShadow: secondary ? 'none' : '0 10px 24px rgba(4,37,108,.22)',
      }}
    >
      {children}
    </Link>
  )
}

function SampleOutputCard() {
  return (
    <div style={{ background: '#fff', border: `1px solid ${colors.border}`, borderRadius: 22, boxShadow: '0 24px 70px rgba(15,31,61,.10)', overflow: 'hidden' }}>
      <div style={{ padding: '18px 20px', borderBottom: `1px solid ${colors.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
        <div>
          <div style={{ fontSize: 13, color: colors.muted, fontWeight: 700 }}>Sample BindIQ output</div>
          <div style={{ fontSize: 18, fontWeight: 900, color: colors.ink }}>4-point inspection review</div>
        </div>
        <span style={{ background: '#FEF2F2', color: colors.red, border: '1px solid #FECACA', padding: '6px 10px', borderRadius: 999, fontSize: 12, fontWeight: 900 }}>
          Issues found
        </span>
      </div>
      <div style={{ padding: 20 }}>
        <div style={{ fontSize: 13, color: colors.muted, fontWeight: 800, marginBottom: 12 }}>Detected underwriting concerns</div>
        <div style={{ display: 'grid', gap: 12 }}>
          {sampleFlags.map((flag) => (
            <div key={flag.label} style={{ border: '1px solid #F1F5F9', background: '#FBFDFF', borderRadius: 14, padding: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'start' }}>
                <div style={{ fontWeight: 900, color: colors.ink }}>{flag.label}</div>
                <span style={{ flexShrink: 0, fontSize: 11, fontWeight: 900, color: flag.severity === 'High' ? colors.red : colors.amber, background: flag.severity === 'High' ? '#FEF2F2' : '#FFFBEB', borderRadius: 999, padding: '4px 8px' }}>{flag.severity}</span>
              </div>
              <div style={{ marginTop: 6, color: colors.muted, fontSize: 14, lineHeight: 1.5 }}>{flag.detail}</div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 18, padding: 14, borderRadius: 14, background: '#F8FAFC', border: `1px solid ${colors.border}` }}>
          <div style={{ fontWeight: 900, color: colors.ink, marginBottom: 6 }}>Likely underwriting friction</div>
          <div style={{ color: colors.muted, fontSize: 14, lineHeight: 1.55 }}>
            Standard market appetite may be limited. Review before spending time quoting or submitting to a carrier/MGA.
          </div>
        </div>
      </div>
    </div>
  )
}

export default function LandingPage() {
  const { session, loading } = useSessionAuth()
  const accountTarget = !loading && session ? '/inspect' : '/inspect?mode=sample'

  return (
    <main style={{ fontFamily: "'DM Sans', system-ui, -apple-system, Segoe UI, sans-serif", color: colors.ink, background: '#fff' }}>
      <header style={{ position: 'sticky', top: 0, zIndex: 20, background: 'rgba(255,255,255,.94)', backdropFilter: 'blur(14px)', borderBottom: `1px solid ${colors.border}` }}>
        <div style={{ maxWidth: 1120, margin: '0 auto', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16 }}>
          <Link to="/" style={{ textDecoration: 'none' }}><Logo /></Link>
          <nav style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <a href="#pricing" style={{ color: colors.muted, textDecoration: 'none', fontWeight: 700, fontSize: 14 }}>Pricing</a>
            <Link to="/sign-in" style={{ color: colors.muted, textDecoration: 'none', fontWeight: 700, fontSize: 14 }}>Sign in</Link>
            <ButtonLink to={accountTarget}>Try sample report</ButtonLink>
          </nav>
        </div>
      </header>

      <section style={{ background: `linear-gradient(180deg, ${colors.light} 0%, #fff 78%)`, borderBottom: `1px solid ${colors.border}` }}>
        <div style={{ maxWidth: 1120, margin: '0 auto', padding: '76px 24px 64px', display: 'grid', gridTemplateColumns: 'minmax(0,1.05fr) minmax(320px,.95fr)', gap: 42, alignItems: 'center' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, border: `1px solid ${colors.border}`, background: '#fff', color: colors.navy, borderRadius: 999, padding: '8px 12px', fontSize: 13, fontWeight: 900, marginBottom: 22 }}>
              Built for Florida property agents
            </div>
            <h1 style={{ fontSize: 'clamp(40px, 6vw, 68px)', lineHeight: .94, letterSpacing: '-0.065em', margin: 0, maxWidth: 720 }}>
              Stop quoting Florida property risks that will not bind.
            </h1>
            <p style={{ fontSize: 20, lineHeight: 1.55, color: colors.muted, margin: '24px 0 0', maxWidth: 660 }}>
              Upload a 4-point or wind mitigation report and instantly surface underwriting red flags before you spend time quoting or submitting the risk.
            </p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 30 }}>
              <ButtonLink to="/inspect">Upload inspection report</ButtonLink>
              <ButtonLink to="/inspect?mode=sample" secondary>View sample output</ButtonLink>
            </div>
            <div style={{ marginTop: 22, color: colors.muted, fontSize: 14, lineHeight: 1.6 }}>
              No generic AI dashboard. No CRM. Just pre-submission inspection triage for busy Florida agents.
            </div>
          </div>
          <SampleOutputCard />
        </div>
      </section>

      <section style={{ maxWidth: 1120, margin: '0 auto', padding: '64px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18 }}>
          {[
            ['1', 'Upload the report', 'Drop in a PDF or DOCX 4-point / wind mitigation report.'],
            ['2', 'BindIQ reads for red flags', 'The tool extracts inspection details and normalizes common underwriting issue language.'],
            ['3', 'Decide before quoting', 'Get specific concerns and likely friction so you can move faster.'],
          ].map(([num, title, body]) => (
            <div key={num} style={{ border: `1px solid ${colors.border}`, borderRadius: 18, padding: 22, background: '#fff' }}>
              <div style={{ width: 34, height: 34, borderRadius: 10, background: '#EEF2FF', color: colors.navy, display: 'grid', placeItems: 'center', fontWeight: 900, marginBottom: 16 }}>{num}</div>
              <h3 style={{ margin: 0, fontSize: 20, letterSpacing: '-0.02em' }}>{title}</h3>
              <p style={{ margin: '8px 0 0', color: colors.muted, lineHeight: 1.55 }}>{body}</p>
            </div>
          ))}
        </div>
      </section>

      <section style={{ background: colors.light, borderTop: `1px solid ${colors.border}`, borderBottom: `1px solid ${colors.border}` }}>
        <div style={{ maxWidth: 1120, margin: '0 auto', padding: '64px 24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 38, alignItems: 'start' }}>
          <div>
            <h2 style={{ margin: 0, fontSize: 38, lineHeight: 1.05, letterSpacing: '-0.04em' }}>Built for busy Florida agents.</h2>
            <p style={{ margin: '16px 0 0', color: colors.muted, lineHeight: 1.65, fontSize: 17 }}>
              Busy agents will not read a long software pitch. This page shows the problem, the upload workflow, and the output immediately.
            </p>
          </div>
          <div style={{ display: 'grid', gap: 12 }}>
            {['Federal Pacific / FPE panel language', 'Polybutylene plumbing references', 'Roof age and remaining useful life concerns', 'HVAC, electrical, plumbing, roof condition notes', 'Wind mitigation features and missing protections'].map((item) => (
              <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 12, background: '#fff', border: `1px solid ${colors.border}`, padding: 14, borderRadius: 14 }}>
                <span style={{ width: 22, height: 22, display: 'grid', placeItems: 'center', borderRadius: 999, background: '#ECFDF5', color: colors.green, fontWeight: 900 }}>✓</span>
                <span style={{ fontWeight: 800 }}>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" style={{ maxWidth: 1120, margin: '0 auto', padding: '70px 24px' }}>
        <div style={{ textAlign: 'center', maxWidth: 720, margin: '0 auto 30px' }}>
          <h2 style={{ margin: 0, fontSize: 38, lineHeight: 1.05, letterSpacing: '-0.04em' }}>Simple pricing for a simple workflow.</h2>
          <p style={{ margin: '14px 0 0', color: colors.muted, fontSize: 17, lineHeight: 1.6 }}>Start with per-upload pricing. Upgrade only when inspection review becomes a regular part of your agency workflow.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18 }}>
          {[
            ['Single Upload', '$5', 'For one-off inspection checks before quoting.', 'Buy upload credits'],
            ['Starter', '$99/mo', 'For agents who review inspection reports every week.', 'Start monthly plan'],
            ['Agency', '$299/mo', 'For teams that want larger upload volume and shared history.', 'Contact for agency'],
          ].map(([name, price, desc, cta], index) => (
            <div key={name} style={{ border: `1px solid ${index === 1 ? colors.navy : colors.border}`, borderRadius: 20, padding: 24, boxShadow: index === 1 ? '0 18px 50px rgba(4,37,108,.12)' : 'none' }}>
              <div style={{ fontWeight: 900, color: colors.navy }}>{name}</div>
              <div style={{ fontSize: 36, fontWeight: 950, marginTop: 10, letterSpacing: '-0.04em' }}>{price}</div>
              <p style={{ color: colors.muted, lineHeight: 1.55, minHeight: 74 }}>{desc}</p>
              <ButtonLink to="/inspect" secondary={index !== 1}>{cta}</ButtonLink>
            </div>
          ))}
        </div>
      </section>

      <section style={{ background: colors.light, borderTop: `1px solid ${colors.border}` }}>
        <div style={{ maxWidth: 920, margin: '0 auto', padding: '60px 24px' }}>
          <h2 style={{ margin: '0 0 22px', fontSize: 34, letterSpacing: '-0.04em' }}>Questions agents ask before trying it</h2>
          <div style={{ display: 'grid', gap: 12 }}>
            {objections.map(([q, a]) => (
              <details key={q} style={{ background: '#fff', border: `1px solid ${colors.border}`, borderRadius: 14, padding: '16px 18px' }}>
                <summary style={{ cursor: 'pointer', fontWeight: 900 }}>{q}</summary>
                <p style={{ color: colors.muted, lineHeight: 1.6, margin: '10px 0 0' }}>{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section style={{ maxWidth: 1120, margin: '0 auto', padding: '66px 24px', textAlign: 'center' }}>
        <h2 style={{ margin: 0, fontSize: 42, lineHeight: 1.05, letterSpacing: '-0.05em' }}>Send agents here.</h2>
        <p style={{ margin: '14px auto 26px', maxWidth: 640, color: colors.muted, fontSize: 18, lineHeight: 1.6 }}>
          The job is not to explain insurance software. The job is to get one agent to upload one report and see the red flags.
        </p>
        <ButtonLink to="/inspect?mode=sample">Try sample report</ButtonLink>
      </section>

      <footer style={{ borderTop: `1px solid ${colors.border}`, padding: '26px 24px', color: colors.muted }}>
        <div style={{ maxWidth: 1120, margin: '0 auto', display: 'flex', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', fontSize: 14 }}>
          <div><Logo /></div>
          <div>Florida property inspection triage for agents. Not a carrier, MGA, or replacement for underwriting judgment.</div>
        </div>
      </footer>
    </main>
  )
}
