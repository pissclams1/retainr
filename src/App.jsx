import { BrowserRouter, Routes, Route } from 'react-router-dom'
import AuthGuard from './components/AuthGuard'
import AppBar from './components/AppBar'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import ClientsPage from './pages/ClientsPage'
import ClientDetailPage from './pages/ClientDetailPage'
import GoogleCallbackPage from './pages/GoogleCallbackPage'
import MetaCallbackPage from './pages/MetaCallbackPage'
import ReportViewPage from './pages/ReportViewPage'
import BillingPage from './pages/BillingPage'
import LandingPage from './pages/LandingPage'
import OnboardingPage from './pages/OnboardingPage'
import CheckoutPage from './pages/CheckoutPage'
import { PrivacyPage, TermsPage, SecurityPage, SupportPage } from './pages/LegalPages'
import SampleReportPage from './pages/SampleReportPage'
import PricingPage from './pages/PricingPage'
import SignInPage from './pages/SignInPage'
import SignUpPage from './pages/SignUpPage'
import BriefGeneratorPage from './pages/BriefGeneratorPage'
import InspectionPage from './pages/InspectionPage'
import GenerateLinkPage from './pages/GenerateLinkPage'
import IntakePage from './pages/IntakePage'

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
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/sample-report" element={<SampleReportPage />} />
        <Route path="/sample-reports" element={<SampleReportPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/sign-in" element={<SignInPage />} />
        <Route path="/sign-up" element={<SignUpPage />} />
        <Route path="/generate" element={<BriefGeneratorPage />} />
        <Route path="/propose"  element={<BriefGeneratorPage />} />
        <Route path="/inspect"  element={<InspectionPage />} />
        <Route path="/generate-link" element={<GenerateLinkPage />} />
        <Route path="/intake/:slug"  element={<IntakePage />} />
        <Route path="/privacy"  element={<PrivacyPage />} />
        <Route path="/terms"    element={<TermsPage />} />
        <Route path="/security" element={<SecurityPage />} />
        <Route path="/support"  element={<SupportPage />} />
        <Route path="/auth/google/callback" element={<GoogleCallbackPage />} />
        <Route path="/auth/meta/callback"   element={<MetaCallbackPage />} />
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
