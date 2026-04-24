import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import MetricCard from '../components/ui/MetricCard'
import HealthRing from '../components/ui/HealthRing'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import Skeleton from '../components/ui/Skeleton'

export default function DashboardPage() {
  const [clients, setClients]       = useState([])
  const [alerts, setAlerts]         = useState([])
  const [agency, setAgency]         = useState(null)
  const [reportCount, setReportCount] = useState(0)
  const [loading, setLoading]       = useState(true)

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()

      const [{ data: agencyData }, { data: clientData }, { data: alertData }, { count: reportCount }] = await Promise.all([
        supabase.from('agencies').select('*').eq('owner_email', user.email).single(),
        supabase.from('clients').select('id, name, industry, health_score, last_refreshed').order('name'),
        supabase.from('alerts').select('*').eq('seen', false).order('triggered_at', { ascending: false }).limit(5),
        supabase.from('reports').select('id', { count: 'exact', head: true }).not('client_report_html', 'is', null),
      ])

      setAgency(agencyData)
      setClients(clientData ?? [])
      setAlerts(alertData ?? [])
      setReportCount(reportCount ?? 0)
      setLoading(false)
    }
    load()
  }, [])

  const unseenAlerts = alerts.length

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
        <div>
          <Skeleton width="60px" height="10px" style={{ marginBottom: '8px' }} />
          <Skeleton width="200px" height="28px" />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
          {[1,2,3].map(i => (
            <div key={i} style={{ background: 'white', border: '1px solid var(--border)', borderRadius: '12px', padding: '20px' }}>
              <Skeleton width="80px" height="10px" style={{ marginBottom: '12px' }} />
              <Skeleton width="60px" height="32px" />
            </div>
          ))}
        </div>
        <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: '12px', overflow: 'hidden' }}>
          {[1,2,3].map((i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '14px 20px', borderTop: i > 1 ? '1px solid var(--border)' : 'none' }}>
              <Skeleton width="48px" height="48px" style={{ borderRadius: '50%', flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <Skeleton width="140px" height="14px" style={{ marginBottom: '6px' }} />
                <Skeleton width="80px" height="12px" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>

      {/* Header */}
      <div>
        <p style={{ fontFamily: 'Geist, sans-serif', fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--ink-5)', marginBottom: '4px' }}>
          Dashboard
        </p>
        <h1 style={{ fontFamily: 'Instrument Serif, serif', fontSize: '28px', color: 'var(--ink-2)', lineHeight: 1.2 }}>
          {agency ? `${agency.name}` : 'Welcome to retainr'}
        </h1>
      </div>

      {/* Agency setup prompt */}
      {!agency && (
        <div style={{ borderLeft: '3px solid var(--info)', background: 'var(--info-bg)', padding: '14px 16px' }}>
          <p style={{ fontFamily: 'Geist, sans-serif', fontSize: '12px', fontWeight: 600, color: 'var(--info)', marginBottom: '4px' }}>Finish setting up your agency</p>
          <p style={{ fontFamily: 'Geist, sans-serif', fontSize: '12px', color: 'var(--ink-3)', lineHeight: 1.6 }}>
            Add your agency name and brand color so reports are properly white-labeled.
          </p>
        </div>
      )}

      {/* Metrics row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
        <MetricCard label="Total clients" value={clients.length} />
        <MetricCard label="Unseen alerts" value={unseenAlerts} />
        <MetricCard label="Reports generated" value={reportCount} />
      </div>

      {/* Clients */}
      <section>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <p style={{ fontFamily: 'Instrument Serif, serif', fontSize: '20px', color: 'var(--ink-2)' }}>Clients</p>
          <Link to="/clients">
            <Button variant="outline" size="sm">View all</Button>
          </Link>
        </div>

        {clients.length === 0 ? (
          <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: '12px', padding: '40px 24px', textAlign: 'center' }}>
            <p style={{ fontFamily: 'Instrument Serif, serif', fontSize: '20px', color: 'var(--ink-4)', marginBottom: '8px' }}>No clients yet</p>
            <p style={{ fontFamily: 'Geist, sans-serif', fontSize: '13px', color: 'var(--ink-5)', marginBottom: '20px' }}>
              Add your first client to start generating reports and briefing cards.
            </p>
            <Link to="/clients"><Button>Add first client</Button></Link>
          </div>
        ) : (
          <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: '12px', overflow: 'hidden' }}>
            {clients.slice(0, 5).map((client, i) => (
              <Link
                key={client.id}
                to={`/clients/${client.id}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  padding: '14px 20px',
                  borderTop: i > 0 ? '1px solid var(--border)' : 'none',
                  textDecoration: 'none',
                  transition: 'background 0.1s ease',
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'var(--surface-2)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <HealthRing score={client.health_score ?? 0} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontFamily: 'Geist, sans-serif', fontSize: '14px', fontWeight: 500, color: 'var(--ink-2)', marginBottom: '2px' }}>{client.name}</p>
                  <p style={{ fontFamily: 'Geist, sans-serif', fontSize: '12px', color: 'var(--ink-5)' }}>{client.industry ?? 'No industry set'}</p>
                </div>
                {client.last_refreshed && (
                  <p style={{ fontFamily: 'Geist, sans-serif', fontSize: '11px', color: 'var(--ink-5)', flexShrink: 0 }}>
                    {new Date(client.last_refreshed).toLocaleDateString()}
                  </p>
                )}
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Recent alerts */}
      {alerts.length > 0 && (
        <section>
          <p style={{ fontFamily: 'Instrument Serif, serif', fontSize: '20px', color: 'var(--ink-2)', marginBottom: '16px' }}>Recent alerts</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {alerts.map((alert) => (
              <div key={alert.id} style={{ borderLeft: `3px solid var(--alert)`, background: 'var(--alert-bg)', padding: '14px 16px' }}>
                <p style={{ fontFamily: 'Geist, sans-serif', fontSize: '12px', fontWeight: 600, color: 'var(--alert)', marginBottom: '2px' }}>
                  {alert.type === 'traffic_drop' ? 'Traffic drop' : alert.type === 'cpl_spike' ? 'CPL spike' : alert.type}
                </p>
                <p style={{ fontFamily: 'Geist, sans-serif', fontSize: '12px', color: 'var(--ink-3)' }}>
                  {alert.threshold_pct}% threshold triggered · {new Date(alert.triggered_at).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

    </div>
  )
}
