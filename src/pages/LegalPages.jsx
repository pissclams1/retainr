import { Link } from 'react-router-dom'

const serif = { fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }
const sans = { fontFamily: "'Inter', system-ui, sans-serif" }

const screen = {
  minHeight: '100vh',
  background: '#ffffff',
  display: 'flex', flexDirection: 'column',
  ...sans,
}
const navBar = {
  borderBottom: '1px solid var(--border)',
  padding: '14px 24px',
  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
  background: '#ffffff',
}
const wrap = { maxWidth: 720, margin: '0 auto', padding: '48px 24px 80px', flex: 1 }
const eyebrow = {
  ...sans, fontSize: 11, fontWeight: 600,
  textTransform: 'uppercase', letterSpacing: '0.10em',
  color: '#94A3B8', marginBottom: 8,
}
const h1 = { ...serif, fontSize: 38, fontWeight: 400, color: '#1A1A18', lineHeight: 1.15, marginBottom: 12 }
const h2 = { ...serif, fontSize: 22, fontWeight: 400, color: '#1A1A18', marginTop: 32, marginBottom: 8 }
const p = { ...sans, fontSize: 14, lineHeight: 1.7, color: '#3D3D3A', marginBottom: 12 }
const li = { ...sans, fontSize: 14, lineHeight: 1.7, color: '#3D3D3A', marginBottom: 6 }
const small = { ...sans, fontSize: 12, color: '#94A3B8', marginBottom: 24 }

function Shell({ eyebrowLabel, title, lastUpdated, children }) {
  return (
    <div style={screen}>
      <div style={navBar}>
        <Link to="/" style={{ ...serif, fontSize: 18, color: '#1A1A18', textDecoration: 'none', letterSpacing: '-0.3px' }}>
          retainr
        </Link>
        <Link to="/" style={{ ...sans, fontSize: 12, color: '#6B6B66', textDecoration: 'none' }}>
          ← Back to home
        </Link>
      </div>
      <div style={wrap}>
        <div style={eyebrow}>{eyebrowLabel}</div>
        <h1 style={h1}>{title}</h1>
        {lastUpdated && <div style={small}>Last updated {lastUpdated}</div>}
        {children}
      </div>
      <Footer />
    </div>
  )
}

function Footer() {
  return (
    <div style={{
      borderTop: '1px solid var(--border)',
      padding: '20px 24px',
      textAlign: 'center', background: '#FAFAF9',
    }}>
      <div style={{ ...sans, fontSize: 11, color: '#94A3B8', display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
        <Link to="/privacy" style={{ color: '#94A3B8', textDecoration: 'none' }}>Privacy</Link>
        <Link to="/terms"   style={{ color: '#94A3B8', textDecoration: 'none' }}>Terms</Link>
        <Link to="/security" style={{ color: '#94A3B8', textDecoration: 'none' }}>Security</Link>
        <Link to="/support" style={{ color: '#94A3B8', textDecoration: 'none' }}>Support</Link>
        <span>© 2026 Retainr</span>
      </div>
    </div>
  )
}

/* ─────────── Privacy ─────────── */

export function PrivacyPage() {
  return (
    <Shell eyebrowLabel="Legal" title="Privacy Policy" lastUpdated="April 26, 2026">
      <p style={p}>
        Retainr ("we", "us") is a performance communication system for agency teams.
        This policy describes what data we collect, how we use it, and the choices you have.
      </p>

      <h2 style={h2}>What we collect</h2>
      <ul>
        <li style={li}><strong>Account data:</strong> your email, agency name, and authentication identifiers.</li>
        <li style={li}><strong>Google Ads data:</strong> performance metrics, campaign names, and account structure for accounts you connect, fetched via the Google Ads API using read-only scopes.</li>
        <li style={li}><strong>Usage data:</strong> reports generated, share-link views, and basic product analytics.</li>
        <li style={li}><strong>Billing data:</strong> processed by Stripe. We never see or store your card details.</li>
      </ul>

      <h2 style={h2}>How we use it</h2>
      <ul>
        <li style={li}>To generate the client-ready reports, narratives, explanations, and talking points the product produces.</li>
        <li style={li}>To operate, secure, and improve the service.</li>
        <li style={li}>To bill your subscription and provide support.</li>
      </ul>

      <h2 style={h2}>What we do not do</h2>
      <ul>
        <li style={li}>We do not sell your data.</li>
        <li style={li}>We do not train shared models on your client data without explicit consent.</li>
        <li style={li}>We do not access your Google Ads account beyond the read-only scopes you grant.</li>
      </ul>

      <h2 style={h2}>Data retention &amp; deletion</h2>
      <p style={p}>
        You can disconnect any Google Ads account or delete your agency at any time.
        Deleted data is removed from active systems within 30 days and from backups within 90 days.
      </p>

      <h2 style={h2}>Contact</h2>
      <p style={p}>
        Questions or requests? Email <a href="mailto:privacy@retainr.io" style={{ color: '#1A1A18' }}>privacy@retainr.io</a>.
      </p>
    </Shell>
  )
}

/* ─────────── Terms ─────────── */

export function TermsPage() {
  return (
    <Shell eyebrowLabel="Legal" title="Terms of Service" lastUpdated="April 26, 2026">
      <p style={p}>
        These terms govern your use of Retainr. By creating an account, you agree to them.
      </p>

      <h2 style={h2}>The service</h2>
      <p style={p}>
        Retainr generates written client-ready performance communication from Google Ads
        data you connect. Outputs include monthly performance narratives, change explanations,
        and meeting talking points.
      </p>

      <h2 style={h2}>Your responsibilities</h2>
      <ul>
        <li style={li}>You must own or have authorization to connect the Google Ads accounts you bring into Retainr.</li>
        <li style={li}>You are responsible for what you send to clients. Review generated content before sharing.</li>
        <li style={li}>You will not use the service to send spam, mislead clients, or violate Google's policies.</li>
      </ul>

      <h2 style={h2}>Subscription &amp; billing</h2>
      <ul>
        <li style={li}>14-day free trial, no credit card required.</li>
        <li style={li}>Plans renew automatically at the listed cadence (monthly or annual).</li>
        <li style={li}>You can cancel any time from the billing portal. Service continues through the end of the paid period.</li>
        <li style={li}>Annual plans are billed up front and are not refunded for partial-year cancellations.</li>
      </ul>

      <h2 style={h2}>AI-generated content</h2>
      <p style={p}>
        Reports are generated by language models from your performance data. They are
        intended as drafts. You are responsible for verifying accuracy before sharing
        with clients.
      </p>

      <h2 style={h2}>Termination</h2>
      <p style={p}>
        We may suspend accounts that violate these terms or applicable law. You may close
        your account at any time.
      </p>

      <h2 style={h2}>Contact</h2>
      <p style={p}>
        Questions? Email <a href="mailto:legal@retainr.io" style={{ color: '#1A1A18' }}>legal@retainr.io</a>.
      </p>
    </Shell>
  )
}

/* ─────────── Security ─────────── */

export function SecurityPage() {
  return (
    <Shell eyebrowLabel="Trust" title="Security" lastUpdated="April 26, 2026">
      <p style={p}>
        Retainr handles the performance data of agency clients. Security is treated as a
        product requirement, not an afterthought.
      </p>

      <h2 style={h2}>Data protection</h2>
      <ul>
        <li style={li}><strong>Encryption in transit:</strong> all traffic uses TLS 1.2+.</li>
        <li style={li}><strong>Encryption at rest:</strong> Postgres storage is encrypted at the disk level.</li>
        <li style={li}><strong>OAuth tokens:</strong> Google refresh tokens are stored server-side only and never sent to the browser.</li>
        <li style={li}><strong>Card data:</strong> handled by Stripe, never stored on our servers.</li>
      </ul>

      <h2 style={h2}>Tenant isolation</h2>
      <p style={p}>
        Every database query is enforced by Supabase Row Level Security policies scoped
        to the agency owning the row. A signed-in user cannot read another agency's
        clients, reports, or accounts even if they bypass the application layer.
      </p>

      <h2 style={h2}>Access control</h2>
      <ul>
        <li style={li}>Magic-link authentication via Supabase Auth — no passwords to leak.</li>
        <li style={li}>Service-role keys live only in server-side edge functions.</li>
        <li style={li}>Public share links use unguessable tokens scoped to a single report.</li>
      </ul>

      <h2 style={h2}>Google API usage</h2>
      <p style={p}>
        We request only read-only Google Ads scopes. We never modify campaigns, budgets,
        or assets. You can revoke access at any time from your Google account settings.
      </p>

      <h2 style={h2}>Reporting an issue</h2>
      <p style={p}>
        Found something? Email <a href="mailto:security@retainr.io" style={{ color: '#1A1A18' }}>security@retainr.io</a>.
        We respond within one business day.
      </p>
    </Shell>
  )
}

/* ─────────── Support ─────────── */

export function SupportPage() {
  return (
    <Shell eyebrowLabel="Help" title="Support">
      <p style={p}>
        We're a small team. We answer fast.
      </p>

      <h2 style={h2}>Contact</h2>
      <ul>
        <li style={li}><strong>General questions:</strong> <a href="mailto:hello@retainr.io" style={{ color: '#1A1A18' }}>hello@retainr.io</a></li>
        <li style={li}><strong>Billing &amp; subscription:</strong> <a href="mailto:billing@retainr.io" style={{ color: '#1A1A18' }}>billing@retainr.io</a></li>
        <li style={li}><strong>Security reports:</strong> <a href="mailto:security@retainr.io" style={{ color: '#1A1A18' }}>security@retainr.io</a></li>
        <li style={li}><strong>Privacy requests:</strong> <a href="mailto:privacy@retainr.io" style={{ color: '#1A1A18' }}>privacy@retainr.io</a></li>
      </ul>

      <h2 style={h2}>Common questions</h2>

      <p style={{ ...p, fontWeight: 500, color: '#1A1A18', marginBottom: 4, marginTop: 18 }}>
        How long does it take to generate a report?
      </p>
      <p style={p}>Under 60 seconds for the first report after you connect your Google Ads account.</p>

      <p style={{ ...p, fontWeight: 500, color: '#1A1A18', marginBottom: 4, marginTop: 18 }}>
        Can I cancel any time?
      </p>
      <p style={p}>Yes, from the billing portal. Service continues through the end of the paid period.</p>

      <p style={{ ...p, fontWeight: 500, color: '#1A1A18', marginBottom: 4, marginTop: 18 }}>
        Can I export reports as PDF?
      </p>
      <p style={p}>Yes, every generated report has a Download PDF button.</p>

      <p style={{ ...p, fontWeight: 500, color: '#1A1A18', marginBottom: 4, marginTop: 18 }}>
        Can I share a report with a client without giving them a login?
      </p>
      <p style={p}>Yes, every report has a read-only share link. Anyone with the URL can view it.</p>

      <p style={{ ...p, fontWeight: 500, color: '#1A1A18', marginBottom: 4, marginTop: 18 }}>
        I need more than 75 client accounts.
      </p>
      <p style={p}>
        Email <a href="mailto:hello@retainr.io?subject=Enterprise%20pricing" style={{ color: '#1A1A18' }}>hello@retainr.io</a> and
        we'll set up a custom plan.
      </p>
    </Shell>
  )
}
