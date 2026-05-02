import { Navigate, useSearchParams } from 'react-router-dom'

// Sign-in and sign-up are the same flow with magic links.
// Redirect to /sign-up, preserving any ?redirect= param.
export default function SignInPage() {
  const [params] = useSearchParams()
  const redirect = params.get('redirect')
  const to = redirect ? `/sign-up?redirect=${encodeURIComponent(redirect)}` : '/sign-up'
  return <Navigate to={to} replace />
}
