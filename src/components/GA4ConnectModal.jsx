import { useState } from 'react'
import Button from './ui/Button'
import Input from './ui/Input'

export default function GA4ConnectModal({ clientId, onClose }) {
  const [propertyId, setPropertyId] = useState('')
  const [error, setError] = useState(null)

  const handleConnect = () => {
    const raw = propertyId.trim()
    if (!raw) return

    // Accept bare numeric ID or full "properties/XXXXXXXXX" format
    const normalized = raw.startsWith('properties/') ? raw : `properties/${raw}`
    const numericPart = normalized.replace('properties/', '')
    if (!/^\d+$/.test(numericPart)) {
      setError('Property ID should be numeric, e.g. 123456789')
      return
    }

    const state = btoa(JSON.stringify({ clientId, propertyId: normalized }))

    const params = new URLSearchParams({
      client_id:     import.meta.env.VITE_GOOGLE_CLIENT_ID,
      redirect_uri:  `${import.meta.env.VITE_APP_URL ?? window.location.origin}/auth/google/callback`,
      response_type: 'code',
      scope:         'https://www.googleapis.com/auth/analytics.readonly',
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
          Connect Google Analytics
        </h2>
        <p style={{ fontFamily: 'Geist, sans-serif', fontSize: '13px', color: 'var(--ink-5)', lineHeight: 1.6, marginBottom: '24px' }}>
          Enter the GA4 property ID for this client. You'll find it in Google Analytics under Admin → Property Settings.
        </p>

        <div style={{ marginBottom: '20px' }}>
          <Input
            label="GA4 Property ID"
            placeholder="123456789 or properties/123456789"
            value={propertyId}
            onChange={(e) => { setPropertyId(e.target.value); setError(null) }}
            error={error}
            hint="Numeric ID from Google Analytics → Admin → Property Settings"
          />
        </div>

        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button onClick={handleConnect} disabled={!propertyId.trim()}>
            Connect with Google
          </Button>
        </div>
      </div>
    </div>
  )
}
