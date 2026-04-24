import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function ReportViewPage() {
  const { id } = useParams()
  const [report, setReport] = useState(null)
  const [status, setStatus]  = useState('loading') // 'loading' | 'ready' | 'not_found' | 'not_ready'

  useEffect(() => {
    supabase
      .from('reports')
      .select('period_month, generated_at, client_report_html')
      .eq('id', id)
      .single()
      .then(({ data, error }) => {
        if (error || !data) { setStatus('not_found'); return }
        if (!data.client_report_html) { setStatus('not_ready'); return }
        setReport(data)
        setStatus('ready')
      })
  }, [id])

  if (status === 'loading') {
    return <Shell><LoadingState /></Shell>
  }

  if (status === 'not_found') {
    return (
      <Shell>
        <div style={{ textAlign: 'center', padding: '64px 24px' }}>
          <p style={{ fontFamily: 'Instrument Serif, serif', fontSize: '24px', color: 'var(--ink-4)', marginBottom: '8px' }}>Report not found</p>
          <p style={{ fontFamily: 'Geist, sans-serif', fontSize: '13px', color: 'var(--ink-5)' }}>This link may be invalid or the report may have been removed.</p>
        </div>
      </Shell>
    )
  }

  if (status === 'not_ready') {
    return (
      <Shell>
        <div style={{ textAlign: 'center', padding: '64px 24px' }}>
          <p style={{ fontFamily: 'Instrument Serif, serif', fontSize: '24px', color: 'var(--ink-4)', marginBottom: '8px' }}>Report is being generated</p>
          <p style={{ fontFamily: 'Geist, sans-serif', fontSize: '13px', color: 'var(--ink-5)' }}>Check back in a moment — this usually takes under a minute.</p>
        </div>
      </Shell>
    )
  }

  return (
    <Shell>
      {/* Report header bar */}
      <div style={{
        borderBottom: '1px solid var(--border)',
        padding: '16px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'white',
        position: 'sticky',
        top: 0,
        zIndex: 10,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontFamily: 'Instrument Serif, serif', fontSize: '18px', color: 'var(--ink)', letterSpacing: '-0.3px' }}>
            retainr
          </span>
          <span style={{ width: '1px', height: '16px', background: 'var(--border-2)' }} />
          <span style={{ fontFamily: 'Geist, sans-serif', fontSize: '12px', color: 'var(--ink-5)' }}>
            {report.period_month} performance report
          </span>
        </div>
        <span style={{ fontFamily: 'Geist, sans-serif', fontSize: '11px', color: 'var(--ink-5)' }}>
          Generated {new Date(report.generated_at).toLocaleDateString()}
        </span>
      </div>

      {/* Report content */}
      <div style={{ maxWidth: '760px', margin: '0 auto', padding: '40px 24px 80px' }}>
        <div dangerouslySetInnerHTML={{ __html: report.client_report_html }} />
      </div>

      {/* Footer */}
      <div style={{
        borderTop: '1px solid var(--border)',
        padding: '20px 24px',
        textAlign: 'center',
        background: 'white',
      }}>
        <p style={{ fontFamily: 'Geist, sans-serif', fontSize: '11px', color: 'var(--ink-5)' }}>
          Prepared with{' '}
          <span style={{ fontFamily: 'Instrument Serif, serif', fontSize: '12px', color: 'var(--ink-4)' }}>retainr</span>
        </p>
      </div>
    </Shell>
  )
}

function Shell({ children }) {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--surface)', display: 'flex', flexDirection: 'column' }}>
      {children}
    </div>
  )
}

function LoadingState() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1, minHeight: '100vh' }}>
      <p style={{ fontFamily: 'Geist, sans-serif', fontSize: '13px', color: 'var(--ink-5)' }}>Loading report…</p>
    </div>
  )
}
