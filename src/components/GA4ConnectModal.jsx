import { useState } from 'react'
import Button from './ui/Button'
import Input from './ui/Input'

export default function GA4ConnectModal({ clientId, onClose }) {
  const [customerId, setCustomerId] = useState('')
  const [error, setError] = useState(null)

  const handleConnect = () => {
    const raw = customerId.trim().replace(/-/g, '')
    if (!raw) return

    if (!/^\d{8,12}$/.test(raw)) {
      setError('Customer ID should be a 10-digit number, e.g. 1234567890')
      return
    }

    const state = btoa(JSON.stringify({ clientId, customerId: raw }))

    const params = new URLSearchParams({
      client_id:     import.meta.env.VITE_GOOGLE_CLIENT_ID,
      redirect_uri:  `${import.meta.env.VITE_APP_URL ?? window.location.origin}/auth/google/callback`,
      response_type: 'code',
      scope:         'https://www.googleapis.com/auth/adwords',
      access_type:   'offline',
      prompt:        'consent',
      state,
    })

    window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${params}`
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(15,15,14,0.6)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '24px', zIndex: 200,
    }} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={{
        background: 'white', borderRadius: '14px',
        padding: '28px', width: '100%', maxWidth: '420px',
        boxShadow: '0 8px 32px rgba(15,15,14,0.12)',
      }}>
        <h2 style={{ fontFamily: 'Instrument Serif, serif', fontSize: '22px', color: 'var(--ink-2)', marginBottom: '6px' }}>
          Connect Google Ads
        </h2>
        <p style={{ fontFamily: 'Geist, sans-serif', fontSize: '13px', color: 'var(--ink-5)', lineHeight: 1.6, marginBottom: '24px' }}>
          Enter the Google Ads customer ID for this client. You'll find it in the top-right corner of Google Ads, formatted as XXX-XXX-XXXX.
        </p>

        <div style={{ marginBottom: '20px' }}>
          <Input
            label="Google Ads Customer ID"
            placeholder="1234567890 or 123-456-7890"
            value={customerId}
            onChange={(e) => { setCustomerId(e.target.value); setError(null) }}
            error={error}
            hint="10-digit ID from the top-right corner of Google Ads"
          />
        </div>

        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button onClick={handleConnect} disabled={!customerId.trim()}>
            Connect with Google
          </Button>
        </div>
      </div>
    </div>
  )
}
