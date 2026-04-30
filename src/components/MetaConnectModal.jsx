import { useState } from 'react'
import Button from './ui/Button'
import Input from './ui/Input'

export default function MetaConnectModal({ clientId, onClose }) {
  const [adAccountId, setAdAccountId] = useState('')
  const [error, setError] = useState(null)

  const handleConnect = () => {
    const raw = adAccountId.trim().replace(/^act_/, '').replace(/\D/g, '')
    if (!raw) return

    if (!/^\d+$/.test(raw)) {
      setError('Ad account ID should be numeric, e.g. 1234567890')
      return
    }

    const state = btoa(JSON.stringify({ clientId, adAccountId: raw }))

    const params = new URLSearchParams({
      client_id:     import.meta.env.VITE_META_APP_ID,
      redirect_uri:  `${import.meta.env.VITE_APP_URL ?? window.location.origin}/auth/meta/callback`,
      response_type: 'code',
      scope:         'ads_read',
      state,
    })

    window.location.href = `https://www.facebook.com/v19.0/dialog/oauth?${params}`
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
          <div style={{ width: 28, height: 28, borderRadius: '6px', background: '#1877F2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
          </div>
          <h2 style={{ fontFamily: 'Instrument Serif, serif', fontSize: '22px', color: 'var(--ink-2)', margin: 0 }}>
            Connect Meta Ads
          </h2>
          <span style={{ fontFamily: 'Geist, sans-serif', fontSize: '10px', fontWeight: 700, padding: '2px 8px', borderRadius: '10px', background: '#FFF7ED', color: '#C2410C', border: '1px solid #FED7AA', marginLeft: 'auto' }}>
            Beta
          </span>
        </div>
        <p style={{ fontFamily: 'Geist, sans-serif', fontSize: '13px', color: 'var(--ink-5)', lineHeight: 1.6, marginBottom: '8px' }}>
          Enter the Meta ad account ID for this client. You'll find it in Meta Ads Manager — it starts with <code style={{ background: '#F1F5F9', padding: '1px 5px', borderRadius: 4 }}>act_</code>.
        </p>
        <p style={{ fontFamily: 'Geist, sans-serif', fontSize: '12px', color: '#C2410C', background: '#FFF7ED', border: '1px solid #FED7AA', borderRadius: '8px', padding: '8px 12px', lineHeight: 1.55, marginBottom: '20px' }}>
          Meta Ads is in beta — reports are free and include a "Powered by retainr" watermark. Upgrade to remove branding.
        </p>

        <div style={{ marginBottom: '20px' }}>
          <Input
            label="Meta Ad Account ID"
            placeholder="act_1234567890 or 1234567890"
            value={adAccountId}
            onChange={(e) => { setAdAccountId(e.target.value); setError(null) }}
            error={error}
            hint="Found in Meta Ads Manager → top-left account switcher"
          />
        </div>

        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button onClick={handleConnect} disabled={!adAccountId.trim()}
            style={{ background: '#1877F2', borderColor: '#1877F2' }}>
            Connect with Meta
          </Button>
        </div>
      </div>
    </div>
  )
}
