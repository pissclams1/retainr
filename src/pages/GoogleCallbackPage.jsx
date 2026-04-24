import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function GoogleCallbackPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [status, setStatus] = useState('connecting') // 'connecting' | 'error'
  const [errorMsg, setErrorMsg] = useState(null)

  useEffect(() => {
    async function handleCallback() {
      const code  = searchParams.get('code')
      const state = searchParams.get('state')
      const oauthError = searchParams.get('error')

      if (oauthError) {
        setErrorMsg(oauthError === 'access_denied' ? 'You declined the Google permissions request.' : oauthError)
        setStatus('error')
        return
      }

      if (!code || !state) {
        setErrorMsg('Missing OAuth parameters.')
        setStatus('error')
        return
      }

      let parsed
      try {
        parsed = JSON.parse(atob(state))
      } catch {
        setErrorMsg('Invalid state parameter.')
        setStatus('error')
        return
      }

      const { clientId, propertyId } = parsed

      const { data, error } = await supabase.functions.invoke('ga4-connect', {
        body: {
          code,
          client_id:    clientId,
          property_id:  propertyId,
          redirect_uri: `${import.meta.env.VITE_APP_URL ?? window.location.origin}/auth/google/callback`,
        },
      })

      if (error || data?.error) {
        setErrorMsg(data?.error ?? error.message)
        setStatus('error')
        return
      }

      // Fire-and-forget: kick off first data pull immediately
      supabase.functions.invoke('ga4-refresh', { body: { client_id: clientId } })

      navigate(`/clients/${clientId}?ga4=connected`, { replace: true })
    }

    handleCallback()
  }, [])

  const containerStyle = {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#ffffff',
    padding: '24px',
  }

  if (status === 'connecting') {
    return (
      <div style={containerStyle}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontFamily: 'Instrument Serif, serif', fontSize: '24px', color: 'var(--ink-2)', marginBottom: '8px' }}>
            Connecting Google Analytics…
          </p>
          <p style={{ fontFamily: 'Geist, sans-serif', fontSize: '13px', color: 'var(--ink-5)' }}>
            Hang tight, this takes a moment.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div style={containerStyle}>
      <div style={{ textAlign: 'center', maxWidth: '360px' }}>
        <div style={{ borderLeft: '3px solid var(--danger)', background: 'var(--danger-bg)', padding: '14px 16px', marginBottom: '20px', textAlign: 'left' }}>
          <p style={{ fontFamily: 'Geist, sans-serif', fontSize: '12px', fontWeight: 600, color: 'var(--danger)', marginBottom: '4px' }}>Connection failed</p>
          <p style={{ fontFamily: 'Geist, sans-serif', fontSize: '12px', color: 'var(--ink-3)' }}>{errorMsg}</p>
        </div>
        <button
          onClick={() => navigate(-1)}
          style={{ fontFamily: 'Geist, sans-serif', fontSize: '13px', color: 'var(--ink-4)', background: 'none', border: 'none', cursor: 'pointer' }}
        >
          ← Go back
        </button>
      </div>
    </div>
  )
}
