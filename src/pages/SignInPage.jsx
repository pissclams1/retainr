import { SignIn } from '@clerk/clerk-react'
import { Link } from 'react-router-dom'

const T = {
  navy:    '#04256C',
  navy2:   '#0F1F3D',
  red:     '#DC2626',
  text:    '#0F1F3D',
  muted:   '#64748B',
  border:  '#E2E8F0',
  font:    "'DM Sans', system-ui, sans-serif",
}

function Logo({ size = 24 }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
      <div style={{ fontSize: size, fontWeight: 800, letterSpacing: '-0.04em', color: T.navy2, lineHeight: 1 }}>
        Bind<span style={{ color: T.red }}>IQ</span>
      </div>
      <div style={{ display: 'flex', gap: 3 }}>
        <div style={{ height: 3, width: 28, borderRadius: 2, background: 'rgba(15,31,61,0.18)' }} />
        <div style={{ height: 3, width: 10, borderRadius: 2, background: T.red }} />
      </div>
    </div>
  )
}

export default function SignInPage() {
  return (
    <div style={{ fontFamily: T.font, minHeight: '100vh', display: 'flex', flexDirection: 'column', WebkitFontSmoothing: 'antialiased' }}>
      {/* Top nav */}
      <nav style={{ height: 64, background: '#fff', borderBottom: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', padding: '0 32px', justifyContent: 'space-between', flexShrink: 0 }}>
        <Link to="/" style={{ textDecoration: 'none' }}><Logo size={24} /></Link>
        <span style={{ fontSize: 14, color: T.muted }}>
          Don't have an account?{' '}
          <Link to="/sign-up" style={{ fontSize: 14, fontWeight: 700, color: T.navy, textDecoration: 'none', marginLeft: 4 }}>Sign up</Link>
        </span>
      </nav>

      {/* Body */}
      <div style={{ flex: 1, display: 'flex' }}>

        {/* Left form panel */}
        <div style={{ flex: '0 0 480px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 56px', background: '#fff' }}>
          <div style={{ width: '100%', maxWidth: 340 }}>
            <SignIn
              appearance={{
                baseTheme: undefined,
                elements: {
                  rootBox: { width: '100%' },
                  card: { border: 'none', boxShadow: 'none' },
                  headerTitle: { fontSize: '26px', fontWeight: 800, color: T.text, letterSpacing: '-0.03em', margin: '0 0 6px' },
                  headerSubtitle: { fontSize: '14px', color: T.muted, margin: '0 0 32px' },
                  formButtonPrimary: { background: T.navy, fontSize: 15, fontWeight: 700, padding: '13px 14px', borderRadius: 10, boxShadow: '0 3px 12px rgba(4,37,108,0.28)' },
                  formFieldInput: { fontSize: 14, padding: '11px 14px', borderRadius: 9, border: `1.5px solid ${T.border}` },
                  footerActionLink: { color: T.navy, fontWeight: 600, fontSize: 13 },
                }
              }}
              routing="hash"
              afterSignInUrl="/dashboard"
            />
          </div>
        </div>

        {/* Right dark panel */}
        <div style={{ flex: 1, background: T.navy2, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 48px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: -100, right: -100, width: 400, height: 400, borderRadius: '50%', background: 'rgba(255,255,255,0.03)' }} />
          <div style={{ position: 'absolute', bottom: -150, left: -80, width: 480, height: 480, borderRadius: '50%', background: 'rgba(255,255,255,0.025)' }} />

          <div style={{ maxWidth: 380, position: 'relative', zIndex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: 28 }}>
              Why agents use BindIQ
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 24, marginBottom: 36 }}>
              {[
                { val: '3+', desc: 'hours saved per week on quotes that wouldn\'t bind anyway' },
                { val: '<60s', desc: 'from upload to underwriting decision on any report' },
                { val: '87%', desc: 'of critical underwriting issues flagged before submission' },
              ].map(item => (
                <div key={item.val} style={{ display: 'flex', gap: 18, alignItems: 'flex-start' }}>
                  <div style={{ fontSize: 28, fontWeight: 800, color: '#fff', letterSpacing: '-0.03em', minWidth: 72, lineHeight: 1 }}>{item.val}</div>
                  <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', lineHeight: 1.6, paddingTop: 4 }}>{item.desc}</div>
                </div>
              ))}
            </div>

            <div style={{ padding: '20px 24px', background: 'rgba(255,255,255,0.07)', borderRadius: 14, border: '1px solid rgba(255,255,255,0.1)' }}>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.78)', lineHeight: 1.65, fontStyle: 'italic', margin: '0 0 14px' }}>
                "BindIQ paid for itself the first week. Caught a Federal Pacific panel before I wasted two hours submitting."
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'rgba(255,255,255,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: '#fff' }}>MR</div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>Mike R.</div>
                  <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>Independent Agent · Tampa, FL</div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
