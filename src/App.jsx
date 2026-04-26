import { BrowserRouter, Routes, Route } from 'react-router-dom'
import AuthGuard from './components/AuthGuard'
import AppBar from './components/AppBar'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import ClientsPage from './pages/ClientsPage'
import ClientDetailPage from './pages/ClientDetailPage'
import GoogleCallbackPage from './pages/GoogleCallbackPage'
import ReportViewPage from './pages/ReportViewPage'
import BillingPage from './pages/BillingPage'
import LandingPage from './pages/LandingPage'
import OnboardingPage from './pages/OnboardingPage'

function Placeholder({ label }) {
  return (
    <p style={{ fontFamily: 'Geist, sans-serif', fontSize: '14px', color: 'var(--ink-5)' }}>
      {label} — coming soon
    </p>
  )
}

function AppLayout({ children }) {
  return (
    <>
      <main style={{ paddingTop: 52 + 32, paddingBottom: 32, paddingLeft: 24, paddingRight: 24, maxWidth: 1200, margin: '0 auto' }}>
        {children}
      </main>
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      {/* AppBar reads the route internally and returns null on / and /login */}
      <AppBar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route path="/auth/google/callback" element={<GoogleCallbackPage />} />
        <Route path="/r/:id" element={<ReportViewPage />} />
        <Route path="/dashboard" element={
          <AuthGuard><AppLayout><DashboardPage /></AppLayout></AuthGuard>
        } />
        <Route path="/clients" element={
          <AuthGuard><AppLayout><ClientsPage /></AppLayout></AuthGuard>
        } />
        <Route path="/clients/:id" element={
          <AuthGuard><AppLayout><ClientDetailPage /></AppLayout></AuthGuard>
        } />
        <Route path="/reports" element={
          <AuthGuard><AppLayout><Placeholder label="Reports" /></AppLayout></AuthGuard>
        } />
        <Route path="/alerts" element={
          <AuthGuard><AppLayout><Placeholder label="Alerts" /></AppLayout></AuthGuard>
        } />
        <Route path="/billing" element={
          <AuthGuard><AppLayout><BillingPage /></AppLayout></AuthGuard>
        } />
      </Routes>
    </BrowserRouter>
  )
}
