import { useState, useEffect } from 'react'
import { useParams, Link, useSearchParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import HealthRing from '../components/ui/HealthRing'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import Callout from '../components/ui/Callout'
import GA4ConnectModal from '../components/GA4ConnectModal'
import Skeleton from '../components/ui/Skeleton'

export default function ClientDetailPage() {
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const [client, setClient]           = useState(null)
  const [reports, setReports]         = useState([])
  const [commitments, setCommitments] = useState([])
  const [alerts, setAlerts]           = useState([])
  const [loading, setLoading]         = useState(true)
  const [activeTab, setActiveTab]     = useState('overview')
  const [showGA4Modal, setShowGA4Modal] = useState(false)
  const [refreshing, setRefreshing]     = useState(false)
  const [refreshMsg, setRefreshMsg]     = useState(null)
  const ga4JustConnected = searchParams.get('ga4') === 'connected'

  async function load() {
    const [{ data: clientData }, { data: reportData }, { data: commitData }, { data: alertData }] = await Promise.all([
      supabase.from('clients').select('*').eq('id', id).single(),
      supabase.from('reports').select('id, period_month, generated_at, client_report_html, internal_briefing_json').eq('client_id', id).order('generated_at', { ascending: false }),
      supabase.from('commitments').select('*').eq('client_id', id).order('due_date'),
      supabase.from('alerts').select('*').eq('client_id', id).order('triggered_at', { ascending: false }).limit(10),
    ])
    setClient(clientData)
    setReports(reportData ?? [])
    setCommitments(commitData ?? [])
    setAlerts(alertData ?? [])
    setLoading(false)
  }

  useEffect(() => { load() }, [id])

  const handleRefresh = async () => {
    setRefreshing(true)
    setRefreshMsg(null)
    const { data, error } = await supabase.functions.invoke('ga4-refresh', { body: { client_id: id } })
    if (error || data?.error) {
      setRefreshMsg({ type: 'error', text: data?.error ?? error.message })
    } else {
      setRefreshMsg({ type: 'ok', text: `Data refreshed — health score updated to ${data.health_score}. Report generating…` })
      // Reload after a beat to pick up updated client + new report
      setTimeout(load, 2000)
    }
    setRefreshing(false)
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
        <Skeleton width="60px" height="12px" />
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px' }}>
          <Skeleton width="72px" height="72px" style={{ borderRadius: '50%', flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <Skeleton width="220px" height="28px" style={{ marginBottom: '10px' }} />
            <Skeleton width="160px" height="14px" />
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          {[1,2,3,4,5,6].map(i => (
            <div key={i} style={{ background: 'white', border: '1px solid var(--border)', borderRadius: '12px', padding: '14px 16px' }}>
              <Skeleton width="60px" height="10px" style={{ marginBottom: '10px' }} />
              <Skeleton width="120px" height="14px" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (!client) {
    return (
      <div>
        <p style={{ fontFamily: 'Geist, sans-serif', fontSize: '13px', color: 'var(--ink-5)' }}>Client not found.</p>
        <Link to="/clients"><Button variant="ghost" style={{ marginTop: '12px' }}>← Back to clients</Button></Link>
      </div>
    )
  }

  const tabs = ['overview', 'reports', 'briefings', 'commitments']

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>

      {/* Breadcrumb */}
      <Link to="/clients" style={{ fontFamily: 'Geist, sans-serif', fontSize: '12px', color: 'var(--ink-5)', textDecoration: 'none' }}>
        ← Clients
      </Link>

      {/* Client header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px', flexWrap: 'wrap' }}>
        <HealthRing score={client.health_score ?? 0} />
        <div style={{ flex: 1, minWidth: '200px' }}>
          <h1 style={{ fontFamily: 'Instrument Serif, serif', fontSize: '28px', color: 'var(--ink-2)', lineHeight: 1.2, marginBottom: '8px' }}>
            {client.name}
          </h1>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
            {client.industry && <Badge>{client.industry}</Badge>}
            {client.location && <span style={{ fontFamily: 'Geist, sans-serif', fontSize: '12px', color: 'var(--ink-5)' }}>{client.location}</span>}
            {client.retainer_amount && (
              <span style={{ fontFamily: 'Geist, sans-serif', fontSize: '12px', color: 'var(--ink-5)' }}>
                ${client.retainer_amount.toLocaleString()}/mo retainer
              </span>
            )}
            {client.ga4_property_id ? (
              <Badge variant="win">GA4 connected</Badge>
            ) : (
              <Badge variant="alert">GA4 not connected</Badge>
            )}
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
          <Button variant="outline" size="sm">Edit client</Button>
          {client.ga4_property_id
            ? <Button size="sm" onClick={handleRefresh} disabled={refreshing}>{refreshing ? 'Refreshing…' : 'Refresh now'}</Button>
            : <Button size="sm" onClick={() => setShowGA4Modal(true)}>Connect GA4</Button>
          }
        </div>
      </div>

      {/* Refresh feedback */}
      {refreshMsg && (
        <Callout variant={refreshMsg.type === 'ok' ? 'win' : 'danger'}>
          {refreshMsg.text}
        </Callout>
      )}

      {/* GA4 status callouts */}
      {ga4JustConnected && (
        <Callout variant="win" title="Google Analytics connected">
          GA4 is now connected. The first data pull will run at 6am tomorrow, or you can trigger a manual refresh.
        </Callout>
      )}
      {!client.ga4_property_id && !ga4JustConnected && (
        <Callout variant="alert" title="GA4 not connected">
          Connect this client's GA4 property to start pulling data and generating reports.
        </Callout>
      )}

      {showGA4Modal && <GA4ConnectModal clientId={id} onClose={() => setShowGA4Modal(false)} />}

      {/* Tabs */}
      <div style={{ borderBottom: '1px solid var(--border)', display: 'flex', gap: '4px' }}>
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              background: 'none',
              border: 'none',
              borderBottom: activeTab === tab ? '2px solid var(--ink-2)' : '2px solid transparent',
              padding: '8px 12px',
              fontFamily: 'Geist, sans-serif',
              fontSize: '13px',
              fontWeight: activeTab === tab ? 500 : 400,
              color: activeTab === tab ? 'var(--ink-2)' : 'var(--ink-4)',
              cursor: 'pointer',
              marginBottom: '-1px',
              textTransform: 'capitalize',
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === 'overview' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <InfoField label="Industry" value={client.industry} />
          <InfoField label="Location" value={client.location} />
          <InfoField label="Retainer" value={client.retainer_amount ? `$${client.retainer_amount.toLocaleString()}/mo` : null} />
          <InfoField label="Client since" value={client.start_date ? new Date(client.start_date).toLocaleDateString() : null} />
          <InfoField label="GA4 property" value={client.ga4_property_id} mono />
          <InfoField label="Last refreshed" value={client.last_refreshed ? new Date(client.last_refreshed).toLocaleString() : null} />
        </div>
      )}

      {activeTab === 'reports' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {reports.length === 0 ? (
            <EmptyState title="No reports yet" body="Click 'Refresh now' to pull GA4 data and generate the first report." />
          ) : reports.map((r) => (
            <ReportRow key={r.id} report={r} />
          ))}
        </div>
      )}

      {activeTab === 'briefings' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {reports.filter(r => r.internal_briefing_json).length === 0 ? (
            <EmptyState title="No briefing cards yet" body="Briefing cards generate alongside reports. Click 'Refresh now' to trigger the first one." />
          ) : reports.filter(r => r.internal_briefing_json).map((r) => (
            <BriefingCard key={r.id} briefing={r.internal_briefing_json} period={r.period_month} />
          ))}
        </div>
      )}

      {activeTab === 'commitments' && (
        <CommitmentsTab clientId={id} commitments={commitments} setCommitments={setCommitments} />
      )}

    </div>
  )
}

function InfoField({ label, value, mono }) {
  return (
    <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: '12px', padding: '14px 16px' }}>
      <p style={{ fontFamily: 'Geist, sans-serif', fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.10em', color: 'var(--ink-5)', marginBottom: '6px' }}>{label}</p>
      <p style={{ fontFamily: mono ? 'Courier New, monospace' : 'Geist, sans-serif', fontSize: mono ? '12px' : '14px', color: value ? 'var(--ink-2)' : 'var(--ink-5)' }}>
        {value ?? '—'}
      </p>
    </div>
  )
}

function EmptyState({ title, body }) {
  return (
    <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: '12px', padding: '48px 24px', textAlign: 'center' }}>
      <p style={{ fontFamily: 'Instrument Serif, serif', fontSize: '20px', color: 'var(--ink-4)', marginBottom: '8px' }}>{title}</p>
      <p style={{ fontFamily: 'Geist, sans-serif', fontSize: '13px', color: 'var(--ink-5)', maxWidth: '320px', margin: '0 auto', lineHeight: 1.6 }}>{body}</p>
    </div>
  )
}

function ReportRow({ report: r }) {
  const [copied, setCopied] = useState(false)

  const copyLink = () => {
    const url = `${window.location.origin}/r/${r.id}`
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: '12px', overflow: 'hidden' }}>
      <div style={{
        padding: '14px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '10px',
        borderBottom: r.client_report_html ? '1px solid var(--border)' : 'none',
      }}>
        <div>
          <p style={{ fontFamily: 'Geist, sans-serif', fontSize: '14px', fontWeight: 500, color: 'var(--ink-2)' }}>{r.period_month}</p>
          <p style={{ fontFamily: 'Geist, sans-serif', fontSize: '12px', color: 'var(--ink-5)' }}>
            Generated {new Date(r.generated_at).toLocaleDateString()}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {r.client_report_html ? (
            <button
              onClick={copyLink}
              style={{
                background: copied ? 'var(--win-bg)' : 'var(--surface-3)',
                border: 'none',
                borderRadius: '7px',
                padding: '5px 10px',
                fontFamily: 'Geist, sans-serif',
                fontSize: '11px',
                fontWeight: 500,
                color: copied ? 'var(--win)' : 'var(--ink-3)',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              {copied ? 'Link copied' : 'Copy share link'}
            </button>
          ) : (
            <Badge variant="alert">Generating…</Badge>
          )}
        </div>
      </div>

      {r.client_report_html && (
        <div
          style={{ padding: '28px 24px', fontSize: '14px', lineHeight: 1.6 }}
          dangerouslySetInnerHTML={{ __html: r.client_report_html }}
        />
      )}
    </div>
  )
}

function BriefingCard({ briefing, period }) {
  if (!briefing || briefing.parse_error) {
    return (
      <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: '12px', padding: '20px' }}>
        <p style={{ fontFamily: 'Geist, sans-serif', fontSize: '12px', color: 'var(--ink-5)' }}>Briefing data unavailable for {period}.</p>
      </div>
    )
  }

  const sentimentColor = { strong: 'var(--win)', cautious: 'var(--alert)', concerning: 'var(--danger)' }[briefing.overall_sentiment] ?? 'var(--ink-5)'

  return (
    <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: '12px', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ background: 'var(--hero-bg)', padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <p style={{ fontFamily: 'Instrument Serif, serif', fontSize: '18px', color: 'var(--hero-text)' }}>Internal briefing — {period}</p>
        {briefing.overall_sentiment && (
          <span style={{ fontFamily: 'Geist, sans-serif', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: sentimentColor }}>
            {briefing.overall_sentiment}
          </span>
        )}
      </div>

      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Watch for — always first */}
        {briefing.watch_for && (
          <div style={{ borderLeft: '3px solid var(--danger)', background: 'var(--danger-bg)', padding: '14px 16px' }}>
            <p style={{ fontFamily: 'Geist, sans-serif', fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--danger)', marginBottom: '6px' }}>Watch for</p>
            <p style={{ fontFamily: 'Geist, sans-serif', fontSize: '13px', fontWeight: 500, color: 'var(--ink-2)', marginBottom: '4px' }}>{briefing.watch_for.metric} — {briefing.watch_for.value}</p>
            {briefing.watch_for.why_they_will_notice && (
              <p style={{ fontFamily: 'Geist, sans-serif', fontSize: '12px', color: 'var(--ink-3)', marginBottom: '8px' }}>{briefing.watch_for.why_they_will_notice}</p>
            )}
            {briefing.watch_for.talking_point && (
              <p style={{ fontFamily: 'Geist, sans-serif', fontSize: '12px', fontStyle: 'italic', color: 'var(--ink-4)' }}>"{briefing.watch_for.talking_point}"</p>
            )}
          </div>
        )}

        {/* Strongest win */}
        {briefing.strongest_win && (
          <div style={{ borderLeft: '3px solid var(--win)', background: 'var(--win-bg)', padding: '14px 16px' }}>
            <p style={{ fontFamily: 'Geist, sans-serif', fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--win)', marginBottom: '6px' }}>Strongest win</p>
            <p style={{ fontFamily: 'Geist, sans-serif', fontSize: '13px', fontWeight: 500, color: 'var(--ink-2)', marginBottom: '4px' }}>{briefing.strongest_win.metric} — {briefing.strongest_win.value}</p>
            {briefing.strongest_win.talking_point && (
              <p style={{ fontFamily: 'Geist, sans-serif', fontSize: '12px', fontStyle: 'italic', color: 'var(--ink-4)' }}>"{briefing.strongest_win.talking_point}"</p>
            )}
          </div>
        )}

        {/* Suggested script */}
        {briefing.suggested_script && (
          <div style={{ background: 'var(--surface-2)', borderRadius: '8px', padding: '14px 16px' }}>
            <p style={{ fontFamily: 'Geist, sans-serif', fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--ink-5)', marginBottom: '8px' }}>Suggested script</p>
            <p style={{ fontFamily: 'Geist, sans-serif', fontSize: '13px', color: 'var(--ink-2)', lineHeight: 1.7 }}>{briefing.suggested_script}</p>
          </div>
        )}

        {/* Expansion opportunity */}
        {briefing.expansion_opportunity && (
          <div style={{ borderLeft: '3px solid var(--info)', background: 'var(--info-bg)', padding: '14px 16px' }}>
            <p style={{ fontFamily: 'Geist, sans-serif', fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--info)', marginBottom: '6px' }}>Expansion opportunity</p>
            <p style={{ fontFamily: 'Geist, sans-serif', fontSize: '12px', color: 'var(--ink-3)' }}>{briefing.expansion_opportunity}</p>
          </div>
        )}
      </div>
    </div>
  )
}

function CommitmentsTab({ clientId, commitments, setCommitments }) {
  const [newText, setNewText]     = useState('')
  const [newDue, setNewDue]       = useState('')
  const [adding, setAdding]       = useState(false)
  const [showForm, setShowForm]   = useState(false)

  const statusColors = {
    done:        { color: 'var(--win)',   bg: 'var(--win-bg)' },
    in_progress: { color: 'var(--alert)', bg: 'var(--alert-bg)' },
    pending:     { color: 'var(--ink-5)', bg: 'var(--surface-3)' },
  }

  const handleAdd = async (e) => {
    e.preventDefault()
    if (!newText.trim()) return
    setAdding(true)
    const { data } = await supabase
      .from('commitments')
      .insert({ client_id: clientId, text: newText, due_date: newDue || null, status: 'pending' })
      .select()
      .single()
    if (data) setCommitments((prev) => [...prev, data])
    setNewText('')
    setNewDue('')
    setShowForm(false)
    setAdding(false)
  }

  const cycleStatus = async (commitment) => {
    const next = { pending: 'in_progress', in_progress: 'done', done: 'pending' }
    const newStatus = next[commitment.status]
    await supabase.from('commitments').update({ status: newStatus, completed_at: newStatus === 'done' ? new Date().toISOString() : null }).eq('id', commitment.id)
    setCommitments((prev) => prev.map((c) => c.id === commitment.id ? { ...c, status: newStatus } : c))
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button size="sm" onClick={() => setShowForm(!showForm)}>Add commitment</Button>
      </div>

      {showForm && (
        <form onSubmit={handleAdd} style={{ background: 'white', border: '1px solid var(--border)', borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <input
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            placeholder="What did you commit to?"
            required
            style={{ height: '36px', border: '1px solid var(--border-2)', borderRadius: '7px', padding: '8px 12px', fontFamily: 'Geist, sans-serif', fontSize: '13px', outline: 'none' }}
          />
          <input
            type="date"
            value={newDue}
            onChange={(e) => setNewDue(e.target.value)}
            style={{ height: '36px', border: '1px solid var(--border-2)', borderRadius: '7px', padding: '8px 12px', fontFamily: 'Geist, sans-serif', fontSize: '13px', outline: 'none' }}
          />
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
            <Button type="button" variant="ghost" size="sm" onClick={() => setShowForm(false)}>Cancel</Button>
            <Button type="submit" size="sm" disabled={adding}>{adding ? 'Saving…' : 'Save'}</Button>
          </div>
        </form>
      )}

      {commitments.length === 0 && !showForm ? (
        <EmptyState title="No commitments tracked" body="Log what you promised the client so you're never caught off guard." />
      ) : (
        commitments.map((c) => {
          const sc = statusColors[c.status] ?? statusColors.pending
          return (
            <div key={c.id} style={{ background: 'white', border: '1px solid var(--border)', borderRadius: '12px', padding: '14px 20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button
                onClick={() => cycleStatus(c)}
                style={{ width: '20px', height: '20px', borderRadius: '50%', border: `2px solid ${sc.color}`, background: c.status === 'done' ? sc.color : 'transparent', cursor: 'pointer', flexShrink: 0 }}
              />
              <div style={{ flex: 1 }}>
                <p style={{ fontFamily: 'Geist, sans-serif', fontSize: '13px', color: c.status === 'done' ? 'var(--ink-5)' : 'var(--ink-2)', textDecoration: c.status === 'done' ? 'line-through' : 'none' }}>
                  {c.text}
                </p>
                {c.due_date && (
                  <p style={{ fontFamily: 'Geist, sans-serif', fontSize: '11px', color: 'var(--ink-5)', marginTop: '2px' }}>
                    Due {new Date(c.due_date).toLocaleDateString()}
                  </p>
                )}
              </div>
              <span style={{ fontFamily: 'Geist, sans-serif', fontSize: '11px', fontWeight: 500, color: sc.color, background: sc.bg, padding: '2px 8px', borderRadius: '20px', textTransform: 'capitalize' }}>
                {c.status.replace('_', ' ')}
              </span>
            </div>
          )
        })
      )}
    </div>
  )
}
