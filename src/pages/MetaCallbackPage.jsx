import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function MetaCallbackPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [status, setStatus]   = useState('connecting')
  const [errorMsg, setErrorMsg] = useState(null)

  useEffect(() => {
    async function handleCallback() {
      const code       = searchParams.get('code')
      const state      = searchParams.get('state')
      const oauthError = searchParams.get('error')

      if (oauthError) {
        const desc = searchParams.get('error_description') ?? oauthError
        setErrorMsg(oauthError === 'access_denied' ? 'You declined the Meta permissions request.' : desc)
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

      const { clientId, adAccountId } = parsed

      const { data, error } = await supabase.functions.invoke('meta-connect', {
        body: {
          code,
          client_id:     clientId,
          ad_account_id: adAccountId,
          redirect_uri:  `${import.meta.env.VITE_APP_URL ?? window.location.origin}/auth/meta/callback`,
        },
      })

      if (error || data?.error) {
        setErrorMsg(data?.error ?? error.message)
        setStatus('error')
        return
      }

      // Fire-and-forget: kick off first Meta data pull
      supabase.functions.invoke('meta-refresh', { body: { client_id: clientId } })

      navigate(`/clients/${clientId}?meta=connected`, { replace: true })
    }

    handleCallback()
  }, [])

  const containerStyle = {
    minHeight: '100vh', display: 'flex', alignItems: 'center',
    justifyContent: 'center', background: '#ffffff', padding: '24px',
  }

  if (status === 'connecting') {
    return (
      <div style={containerStyle}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontFamily: 'Instrument Serif, serif', fontSize: '24px', color: 'var(--ink-2)', marginBottom: '8px' }}>
            Connecting Meta Ads…
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
        <button onClick={() => navigate(-1)}
          style={{ fontFamily: 'Geist, sans-serif', fontSize: '13px', color: 'var(--ink-4)', background: 'none', border: 'none', cursor: 'pointer' }}>
          ← Go back
        </button>
      </div>
    </div>
  )
}
