import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
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

function AppLayout({ children }) {
  return (
    <>
      <AppBar />
      <main style={{ padding: '32px 24px', maxWidth: '1200px', margin: '0 auto' }}>
        {children}
      </main>
    </>
  )
}

function Placeholder({ label }) {
  return (
    <p style={{ fontFamily: 'Geist, sans-serif', fontSize: '14px', color: 'var(--ink-5)' }}>
      {label} — coming soon
    </p>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/auth/google/callback" element={<GoogleCallbackPage />} />
        <Route path="/r/:id" element={<ReportViewPage />} />
        <Route path="/" element={<LandingPage />} />

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
