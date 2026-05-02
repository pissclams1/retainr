import { Link } from 'react-router-dom'

const sans = { fontFamily: "'DM Sans', system-ui, sans-serif" }

const screen  = { minHeight: '100vh', background: '#ffffff', display: 'flex', flexDirection: 'column', ...sans }
const navBar  = { borderBottom: '1px solid #E2E8F0', padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#ffffff' }
const wrap    = { maxWidth: 720, margin: '0 auto', padding: '48px 24px 80px', flex: 1 }
const eyebrow = { ...sans, fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.10em', color: '#94A3B8', marginBottom: 8 }
const h1style = { ...sans, fontSize: 38, fontWeight: 800, color: '#0F1F3D', lineHeight: 1.15, letterSpacing: '-0.025em', marginBottom: 12 }
const h2style = { ...sans, fontSize: 18, fontWeight: 700, color: '#0F1F3D', marginTop: 32, marginBottom: 8 }
const pstyle  = { ...sans, fontSize: 14, lineHeight: 1.7, color: '#3D3D3A', marginBottom: 12 }
const listyle = { ...sans, fontSize: 14, lineHeight: 1.7, color: '#3D3D3A', marginBottom: 6 }
const small   = { ...sans, fontSize: 12, color: '#94A3B8', marginBottom: 24 }
const link    = { color: '#04256C' }

function Shell({ eyebrowLabel, title, lastUpdated, children }) {
  return (
    <div style={screen}>
      <div style={navBar}>
        <Link to="/" style={{ ...sans, fontSize: 18, fontWeight: 800, color: '#0F1F3D', textDecoration: 'none', letterSpacing: '-0.025em' }}>
          Bind<span style={{ color: '#EF4444' }}>IQ</span>
        </Link>
        <Link to="/" style={{ ...sans, fontSize: 12, color: '#6B6B66', textDecoration: 'none' }}>← Back to home</Link>
      </div>
      <div style={wrap}>
        <div style={eyebrow}>{eyebrowLabel}</div>
        <h1 style={h1style}>{title}</h1>
        {lastUpdated && <div style={small}>Last updated {lastUpdated}</div>}
        {children}
      </div>
      <Footer />
    </div>
  )
}

function Footer() {
  return (
    <div style={{ borderTop: '1px solid #E2E8F0', padding: '20px 24px', textAlign: 'center', background: '#F8FAFC' }}>
      <div style={{ ...sans, fontSize: 11, color: '#94A3B8', display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
        <Link to="/privacy"  style={{ color: '#94A3B8', textDecoration: 'none' }}>Privacy</Link>
        <Link to="/terms"    style={{ color: '#94A3B8', textDecoration: 'none' }}>Terms</Link>
        <Link to="/security" style={{ color: '#94A3B8', textDecoration: 'none' }}>Security</Link>
        <Link to="/support"  style={{ color: '#94A3B8', textDecoration: 'none' }}>Support</Link>
        <span>© 2026 BindIQ</span>
      </div>
    </div>
  )
}

/* ─────────── Privacy ─────────── */

export function PrivacyPage() {
  return (
    <Shell eyebrowLabel="Legal" title="Privacy Policy" lastUpdated="May 1, 2026">
      <p style={pstyle}>
        BindIQ ("we", "us") is an underwriting intelligence tool for independent insurance agents.
        This policy describes what data we collect, how we use it, and the choices you have.
      </p>

      <h2 style={h2style}>What we collect</h2>
      <ul>
        <li style={listyle}><strong>Account data:</strong> your email and authentication identifiers.</li>
        <li style={listyle}><strong>Inspection report content:</strong> text you paste or PDF files you upload for extraction. This content is processed in real time and <strong>not stored</strong> after extraction is complete.</li>
        <li style={listyle}><strong>Usage data:</strong> number of reports run, free trial usage count, and basic product analytics (no personal browsing data).</li>
        <li style={listyle}><strong>Billing data:</strong> processed by Stripe. We never see or store your card details.</li>
      </ul>

      <h2 style={h2style}>How we use it</h2>
      <ul>
        <li style={listyle}>To extract underwriting fields and calculate the BindIQ Score from the inspection content you submit.</li>
        <li style={listyle}>To operate, secure, and improve the service.</li>
        <li style={listyle}>To bill your subscription and provide support.</li>
      </ul>

      <h2 style={h2style}>What we do not do</h2>
      <ul>
        <li style={listyle}>We do not sell your data.</li>
        <li style={listyle}>We do not store inspection report content after processing.</li>
        <li style={listyle}>We do not train AI models on your client data.</li>
      </ul>

      <h2 style={h2style}>Data retention &amp; deletion</h2>
      <p style={pstyle}>
        Inspection reports are discarded immediately after the BindIQ Score is returned.
        Account data (email, usage counts) is retained while your account is active.
        You can request deletion at any time — deleted data is removed from active systems
        within 30 days and from backups within 90 days.
      </p>

      <h2 style={h2style}>Contact</h2>
      <p style={pstyle}>
        Questions or requests? Email <a href="mailto:privacy@usebindiq.com" style={link}>privacy@usebindiq.com</a>.
      </p>
    </Shell>
  )
}

/* ─────────── Terms ─────────── */

export function TermsPage() {
  return (
    <Shell eyebrowLabel="Legal" title="Terms of Service" lastUpdated="May 1, 2026">
      <p style={pstyle}>
        These terms govern your use of BindIQ. By creating an account or using the service, you agree to them.
      </p>

      <h2 style={h2style}>The service</h2>
      <p style={pstyle}>
        BindIQ extracts underwriting-critical fields from 4-point and wind mitigation inspection
        reports and returns a BindIQ Score (0–100) with automated red flag detection. Outputs are
        intended to assist agents in evaluating insurability — they are not a binding commitment
        from any insurer.
      </p>

      <h2 style={h2style}>Your responsibilities</h2>
      <ul>
        <li style={listyle}>You must have the right to upload any inspection report you submit.</li>
        <li style={listyle}>You are responsible for verifying extracted data before using it in underwriting decisions or client communications.</li>
        <li style={listyle}>You will not use the service to process fraudulent or fabricated documents.</li>
      </ul>

      <h2 style={h2style}>Free trial &amp; subscription</h2>
      <ul>
        <li style={listyle}>3 free reports are available with no account required.</li>
        <li style={listyle}>Paid plans renew automatically at the listed cadence (monthly or annual).</li>
        <li style={listyle}>You can cancel any time from the billing portal. Service continues through the end of the paid period.</li>
        <li style={listyle}>Annual plans are billed up front and are not refunded for partial-year cancellations.</li>
      </ul>

      <h2 style={h2style}>AI-generated output</h2>
      <p style={pstyle}>
        Extraction and scoring are performed by AI. Results are highly accurate for standard
        inspection formats but are not infallible. Always verify critical fields against the
        source document before making coverage decisions.
      </p>

      <h2 style={h2style}>Termination</h2>
      <p style={pstyle}>
        We may suspend accounts that violate these terms or applicable law. You may close
        your account at any time.
      </p>

      <h2 style={h2style}>Contact</h2>
      <p style={pstyle}>
        Questions? Email <a href="mailto:legal@usebindiq.com" style={link}>legal@usebindiq.com</a>.
      </p>
    </Shell>
  )
}

/* ─────────── Security ─────────── */

export function SecurityPage() {
  return (
    <Shell eyebrowLabel="Trust" title="Security" lastUpdated="May 1, 2026">
      <p style={pstyle}>
        BindIQ handles sensitive property inspection data. Security is a product requirement,
        not an afterthought.
      </p>

      <h2 style={h2style}>Data protection</h2>
      <ul>
        <li style={listyle}><strong>Encryption in transit:</strong> all traffic uses TLS 1.2+.</li>
        <li style={listyle}><strong>Encryption at rest:</strong> database storage is encrypted at the disk level.</li>
        <li style={listyle}><strong>Inspection content:</strong> report text is sent to the AI extraction API and discarded — never written to disk or logged.</li>
        <li style={listyle}><strong>Card data:</strong> handled entirely by Stripe, never stored on our servers.</li>
      </ul>

      <h2 style={h2style}>Tenant isolation</h2>
      <p style={pstyle}>
        Every database query is enforced by Supabase Row Level Security policies scoped
        to the account owning the row. Signed-in users cannot read another account's data
        even if they bypass the application layer.
      </p>

      <h2 style={h2style}>Access control</h2>
      <ul>
        <li style={listyle}>Magic-link authentication via Supabase Auth — no passwords to leak.</li>
        <li style={listyle}>Service-role keys live only in server-side edge functions, never in the browser.</li>
        <li style={listyle}>The free trial gate is enforced server-side via email identity — not just localStorage.</li>
      </ul>

      <h2 style={h2style}>Reporting an issue</h2>
      <p style={pstyle}>
        Found something? Email <a href="mailto:security@usebindiq.com" style={link}>security@usebindiq.com</a>.
        We respond within one business day.
      </p>
    </Shell>
  )
}

/* ─────────── Support ─────────── */

export function SupportPage() {
  return (
    <Shell eyebrowLabel="Help" title="Support">
      <p style={pstyle}>We're a small team. We answer fast.</p>

      <h2 style={h2style}>Contact</h2>
      <ul>
        <li style={listyle}><strong>General questions:</strong> <a href="mailto:support@usebindiq.com" style={link}>support@usebindiq.com</a></li>
        <li style={listyle}><strong>Billing &amp; subscription:</strong> <a href="mailto:billing@usebindiq.com" style={link}>billing@usebindiq.com</a></li>
        <li style={listyle}><strong>Security reports:</strong> <a href="mailto:security@usebindiq.com" style={link}>security@usebindiq.com</a></li>
        <li style={listyle}><strong>Privacy requests:</strong> <a href="mailto:privacy@usebindiq.com" style={link}>privacy@usebindiq.com</a></li>
      </ul>

      <h2 style={h2style}>Common questions</h2>

      <p style={{ ...pstyle, fontWeight: 600, color: '#0F1F3D', marginBottom: 4, marginTop: 18 }}>How long does extraction take?</p>
      <p style={pstyle}>Under 20 seconds for most reports once submitted.</p>

      <p style={{ ...pstyle, fontWeight: 600, color: '#0F1F3D', marginBottom: 4, marginTop: 18 }}>What inspection formats does BindIQ support?</p>
      <p style={pstyle}>Any PDF or pasted text from a standard 4-point or wind mitigation report. Selectable-text PDFs process fastest; scanned PDFs are also supported.</p>

      <p style={{ ...pstyle, fontWeight: 600, color: '#0F1F3D', marginBottom: 4, marginTop: 18 }}>Which states are supported?</p>
      <p style={pstyle}>Florida, Texas, Louisiana, South Carolina, Alabama, Mississippi, and North Carolina — the seven states with state-mandated wind/hail inspection programs.</p>

      <p style={{ ...pstyle, fontWeight: 600, color: '#0F1F3D', marginBottom: 4, marginTop: 18 }}>Is client inspection data stored?</p>
      <p style={pstyle}>No. Report content is processed and discarded immediately. Nothing is retained after the score is returned.</p>

      <p style={{ ...pstyle, fontWeight: 600, color: '#0F1F3D', marginBottom: 4, marginTop: 18 }}>Can I cancel any time?</p>
      <p style={pstyle}>Yes, from the billing portal. Service continues through the end of the paid period.</p>

      <p style={{ ...pstyle, fontWeight: 600, color: '#0F1F3D', marginBottom: 4, marginTop: 18 }}>I need a custom plan or volume pricing.</p>
      <p style={pstyle}>
        Email <a href="mailto:support@usebindiq.com?subject=Volume%20pricing" style={link}>support@usebindiq.com</a> and
        we'll set something up.
      </p>
    </Shell>
  )
}
