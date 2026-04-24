import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import HealthRing from '../components/ui/HealthRing'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import AddClientModal from '../components/AddClientModal'
import Skeleton from '../components/ui/Skeleton'

export default function ClientsPage() {
  const [clients, setClients]       = useState([])
  const [loading, setLoading]       = useState(true)
  const [showModal, setShowModal]   = useState(false)

  useEffect(() => {
    supabase
      .from('clients')
      .select('*')
      .order('name')
      .then(({ data }) => {
        setClients(data ?? [])
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
          <div>
            <Skeleton width="50px" height="10px" style={{ marginBottom: '8px' }} />
            <Skeleton width="120px" height="28px" />
          </div>
          <Skeleton width="96px" height="34px" style={{ borderRadius: '8px' }} />
        </div>
        <div style={{ display: 'grid', gap: '8px' }}>
          {[1,2,3].map((i) => (
            <div key={i} style={{ background: 'white', border: '1px solid var(--border)', borderRadius: '12px', padding: '18px 20px', display: 'flex', alignItems: 'center', gap: '20px' }}>
              <Skeleton width="48px" height="48px" style={{ borderRadius: '50%', flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <Skeleton width="160px" height="15px" style={{ marginBottom: '8px' }} />
                <Skeleton width="100px" height="12px" />
              </div>
              <Skeleton width="80px" height="12px" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
        <div>
          <p style={{ fontFamily: 'Geist, sans-serif', fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--ink-5)', marginBottom: '4px' }}>
            Clients
          </p>
          <h1 style={{ fontFamily: 'Instrument Serif, serif', fontSize: '28px', color: 'var(--ink-2)', lineHeight: 1.2 }}>
            {clients.length} {clients.length === 1 ? 'client' : 'clients'}
          </h1>
        </div>
        <Button onClick={() => setShowModal(true)}>Add client</Button>
      </div>

      {/* List */}
      {clients.length === 0 ? (
        <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: '12px', padding: '64px 24px', textAlign: 'center' }}>
          <p style={{ fontFamily: 'Instrument Serif, serif', fontSize: '24px', color: 'var(--ink-4)', marginBottom: '8px' }}>No clients yet</p>
          <p style={{ fontFamily: 'Geist, sans-serif', fontSize: '13px', color: 'var(--ink-5)', maxWidth: '320px', margin: '0 auto 24px', lineHeight: 1.6 }}>
            Add a client, connect their GA4 account, and retainr will start pulling data automatically.
          </p>
          <Button onClick={() => setShowModal(true)}>Add first client</Button>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '8px' }}>
          {clients.map((client) => (
            <Link
              key={client.id}
              to={`/clients/${client.id}`}
              style={{ textDecoration: 'none' }}
            >
              <div
                style={{
                  background: 'white',
                  border: '1px solid var(--border)',
                  borderRadius: '12px',
                  padding: '18px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '20px',
                  cursor: 'pointer',
                  transition: 'border-color 0.15s ease',
                }}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--border-2)'}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border)'}
              >
                <HealthRing score={client.health_score ?? 0} />

                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontFamily: 'Geist, sans-serif', fontSize: '15px', fontWeight: 500, color: 'var(--ink-2)', marginBottom: '4px' }}>{client.name}</p>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                    {client.industry && <Badge>{client.industry}</Badge>}
                    {client.location && <span style={{ fontFamily: 'Geist, sans-serif', fontSize: '12px', color: 'var(--ink-5)' }}>{client.location}</span>}
                    {client.retainer_amount && (
                      <span style={{ fontFamily: 'Geist, sans-serif', fontSize: '12px', color: 'var(--ink-5)' }}>
                        ${client.retainer_amount.toLocaleString()}/mo
                      </span>
                    )}
                  </div>
                </div>

                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  {client.last_refreshed ? (
                    <p style={{ fontFamily: 'Geist, sans-serif', fontSize: '11px', color: 'var(--ink-5)' }}>
                      Refreshed {new Date(client.last_refreshed).toLocaleDateString()}
                    </p>
                  ) : (
                    <Badge variant="alert">Not connected</Badge>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

    </div>

    {showModal && <AddClientModal onClose={() => setShowModal(false)} />}
    </>
  )
}
