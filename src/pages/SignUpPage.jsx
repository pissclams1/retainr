import { SignUp } from '@clerk/clerk-react'
import { Link } from 'react-router-dom'

const F = { sans: { fontFamily: "'DM Sans', system-ui, -apple-system, sans-serif" } }
const C = {
  bg:     '#F8FAFC',
  bg2:    '#FFFFFF',
  text:   '#0F1F3D',
  danger: '#EF4444',
}

export default function SignUpPage() {
  return (
    <div style={{ ...F.sans, minHeight: '100vh', background: C.bg, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '48px 24px 80px', WebkitFontSmoothing: 'antialiased' }}>
      <Link to="/" style={{ ...F.sans, fontSize: 18, fontWeight: 800, color: C.text, textDecoration: 'none', marginBottom: 40, letterSpacing: '-0.02em' }}>
        Bind<span style={{ color: C.danger }}>IQ</span>
      </Link>

      <div style={{ width: '100%', maxWidth: 400 }}>
        <div style={{ background: C.bg2, borderRadius: 16, border: '1px solid #E2E8F0', padding: '36px 32px', boxShadow: '0 4px 24px rgba(15,31,61,0.06)' }}>
          <SignUp
            appearance={{
              baseTheme: undefined,
              elements: {
                rootBox: { width: '100%' },
                card: { border: 'none', boxShadow: 'none' },
                headerTitle: { fontSize: '24px', fontWeight: 800, color: C.text, letterSpacing: '-0.025em', marginBottom: 6 },
                headerSubtitle: { fontSize: '14px', color: '#64748B', marginBottom: 28 },
                formButtonPrimary: { background: '#04256c', fontSize: 15, fontWeight: 700, padding: '13px 14px', borderRadius: 10, boxShadow: '0 4px 14px rgba(4,37,108,0.28)' },
                formFieldInput: { fontSize: 15, padding: '12px 14px', borderRadius: 9, border: '1.5px solid #E2E8F0' },
                footerActionLink: { color: '#04256c', fontWeight: 600, fontSize: 13 },
              }
            }}
            routing="hash"
            afterSignUpUrl="/dashboard"
          />
        </div>
      </div>
    </div>
  )
}
