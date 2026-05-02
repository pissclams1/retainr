import { useState, useEffect, useCallback } from 'react'

// ── Constants ──────────────────────────────────────────────────────────────────
const ADMIN_STATS_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-stats`

const C = {
  bg:         '#F8FAFC',
  surface:    '#FFFFFF',
  border:     '#E2E8F0',
  borderMid:  '#CBD5E1',
  fg:         '#0F172A',
  fgMid:      '#334155',
  muted:      '#64748B',
  accent:     '#2563EB',
  accentBg:   'rgba(37,99,235,0.07)',
  green:      '#10B981',
  greenBg:    'rgba(16,185,129,0.08)',
  greenBorder:'rgba(16,185,129,0.2)',
  yellow:     '#F59E0B',
  yellowBg:   'rgba(245,158,11,0.08)',
  red:        '#EF4444',
  redBg:      'rgba(239,68,68,0.07)',
  sidebar:    '#0F172A',
  sidebarText:'#94A3B8',
  sidebarAct: '#FFFFFF',
}

const F = { sans: { fontFamily: "'DM Sans', sans-serif" } }

// ── Helpers ────────────────────────────────────────────────────────────────────
function fmtDate(iso) {
  if (!iso) return '—'
  const d = new Date(iso)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function fmtRelative(iso) {
  if (!iso) return '—'
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  return `${days}d ago`
}

function fmtMrr(cents) {
  return `$${(cents / 100).toLocaleString('en-US', { minimumFractionDigits: 0 })}`
}

function tierColor(tier) {
  if (!tier || tier === 'none') return C.muted
  if (tier === 'agency') return '#7C3AED'
  if (tier === 'growth') return C.accent
  return C.green
}

function statusBadge(status) {
  const map = {
    active:    { bg: C.greenBg,   color: C.green,   border: C.greenBorder, label: 'active' },
    trialing:  { bg: C.yellowBg,  color: C.yellow,  border: 'rgba(245,158,11,0.2)', label: 'trial' },
    canceled:  { bg: C.redBg,     color: C.red,      border: 'rgba(239,68,68,0.15)', label: 'canceled' },
    none:      { bg: '#F1F5F9',    color: C.muted,   border: C.border, label: 'none' },
  }
  return map[status] ?? map.none
}

// ── PasswordGate ───────────────────────────────────────────────────────────────
function PasswordGate({ onAuth }) {
  const [secret, setSecret] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError]   = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!secret.trim()) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`${ADMIN_STATS_URL}?key=${encodeURIComponent(secret.trim())}`)
      if (res.status === 403) throw new Error('Invalid secret')
      if (!res.ok) throw new Error(`Server error: ${res.status}`)
      const data = await res.json()
      sessionStorage.setItem('admin_secret', secret.trim())
      onAuth(secret.trim(), data)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: C.sidebar, display: 'flex', alignItems: 'center', justifyContent: 'center', ...F.sans }}>
      <div style={{ width: 360, padding: '40px 32px', background: C.surface, borderRadius: 16, boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}>
        {/* Logo */}
        <div style={{ marginBottom: 28, display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 9, background: C.sidebar, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: '#fff', fontWeight: 800, fontSize: 16, letterSpacing: '-0.02em' }}>B</span>
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 16, color: C.fg, letterSpacing: '-0.02em' }}>
              Bind<span style={{ color: '#DC2626' }}>IQ</span>
            </div>
            <div style={{ fontSize: 11, color: C.muted, fontWeight: 500 }}>Admin Console</div>
          </div>
        </div>

        <h2 style={{ margin: '0 0 6px', fontSize: 20, fontWeight: 700, color: C.fg }}>Access required</h2>
        <p style={{ margin: '0 0 24px', fontSize: 14, color: C.muted, lineHeight: 1.5 }}>
          Enter your admin secret to continue.
        </p>

        <form onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="Admin secret"
            value={secret}
            onChange={e => setSecret(e.target.value)}
            autoFocus
            style={{
              width: '100%', boxSizing: 'border-box', padding: '11px 13px',
              borderRadius: 9, border: `1.5px solid ${error ? C.red : C.border}`,
              fontSize: 14, color: C.fg, background: C.bg, outline: 'none',
              marginBottom: 12, ...F.sans,
            }}
          />
          {error && (
            <div style={{ marginBottom: 12, padding: '9px 13px', borderRadius: 8, background: C.redBg, border: `1.5px solid rgba(239,68,68,0.2)`, fontSize: 13, color: C.red }}>
              {error}
            </div>
          )}
          <button
            type="submit"
            disabled={loading || !secret.trim()}
            style={{
              width: '100%', padding: '11px', borderRadius: 9, border: 'none',
              background: loading || !secret.trim() ? '#94A3B8' : C.sidebar,
              color: '#fff', fontSize: 14, fontWeight: 600,
              cursor: loading || !secret.trim() ? 'not-allowed' : 'pointer', ...F.sans,
            }}
          >
            {loading ? 'Verifying…' : 'Enter'}
          </button>
        </form>
      </div>
    </div>
  )
}

// ── StatsHeader ────────────────────────────────────────────────────────────────
function StatsHeader({ stats }) {
  const cards = [
    { label: 'Total users',          value: stats.total_users,          sub: `${stats.total_agencies} with agency` },
    { label: 'Active subscriptions', value: stats.active_subscriptions, sub: `${stats.trialing} trialing` },
    { label: 'Scans (24h)',          value: stats.submissions_24h,       sub: `${stats.total_submissions} all time` },
    { label: 'MRR',                  value: fmtMrr(stats.mrr_cents),    sub: `${stats.active_subscriptions} paying` },
  ]
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 28 }}>
      {cards.map(c => (
        <div key={c.label} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: '18px 20px' }}>
          <div style={{ fontSize: 12, color: C.muted, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>{c.label}</div>
          <div style={{ fontSize: 26, fontWeight: 700, color: C.fg, letterSpacing: '-0.02em', lineHeight: 1 }}>{c.value}</div>
          <div style={{ fontSize: 12, color: C.muted, marginTop: 5 }}>{c.sub}</div>
        </div>
      ))}
    </div>
  )
}

// ── UserTable ──────────────────────────────────────────────────────────────────
function UserTable({ users, onSelect, selectedId }) {
  const [sortKey, setSortKey] = useState('auth_created_at')
  const [sortDir, setSortDir] = useState('desc')
  const [filter, setFilter]   = useState('')

  function toggleSort(key) {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortKey(key); setSortDir('desc') }
  }

  const filtered = users.filter(u => {
    if (!filter) return true
    const q = filter.toLowerCase()
    return (
      (u.owner_email ?? '').toLowerCase().includes(q) ||
      (u.name ?? '').toLowerCase().includes(q) ||
      (u.subscription_tier ?? '').toLowerCase().includes(q)
    )
  })

  const sorted = [...filtered].sort((a, b) => {
    let av = a[sortKey] ?? ''
    let bv = b[sortKey] ?? ''
    if (sortKey === 'intake_submission_count' || sortKey === 'intake_link_count' || sortKey === 'client_count') {
      av = Number(av); bv = Number(bv)
    }
    if (av < bv) return sortDir === 'asc' ? -1 : 1
    if (av > bv) return sortDir === 'asc' ? 1 : -1
    return 0
  })

  function SortIcon({ k }) {
    if (sortKey !== k) return <span style={{ color: C.border, marginLeft: 4 }}>↕</span>
    return <span style={{ color: C.accent, marginLeft: 4 }}>{sortDir === 'asc' ? '↑' : '↓'}</span>
  }

  const th = (label, key, align = 'left') => (
    <th
      onClick={() => toggleSort(key)}
      style={{ padding: '10px 14px', fontSize: 11, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: align, cursor: 'pointer', userSelect: 'none', whiteSpace: 'nowrap', background: C.bg, borderBottom: `1px solid ${C.border}` }}
    >
      {label}<SortIcon k={key} />
    </th>
  )

  return (
    <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, overflow: 'hidden' }}>
      {/* Search bar */}
      <div style={{ padding: '14px 16px', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: 10 }}>
        <input
          type="text"
          placeholder="Filter by email, name, or tier…"
          value={filter}
          onChange={e => setFilter(e.target.value)}
          style={{
            flex: 1, padding: '8px 12px', borderRadius: 8, border: `1.5px solid ${C.border}`,
            fontSize: 13, color: C.fg, background: C.bg, outline: 'none', ...F.sans,
          }}
        />
        <span style={{ fontSize: 12, color: C.muted, whiteSpace: 'nowrap' }}>{sorted.length} of {users.length}</span>
      </div>

      {/* Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', ...F.sans }}>
          <thead>
            <tr>
              {th('User', 'owner_email')}
              {th('Joined', 'auth_created_at')}
              {th('Last login', 'last_sign_in_at')}
              {th('Plan', 'subscription_tier')}
              {th('Status', 'subscription_status')}
              {th('Links', 'intake_link_count', 'right')}
              {th('Scans', 'intake_submission_count', 'right')}
              {th('Clients', 'client_count', 'right')}
            </tr>
          </thead>
          <tbody>
            {sorted.map((u, i) => {
              const badge = statusBadge(u.subscription_status)
              const isSelected = selectedId === (u.auth_user_id ?? u.id ?? u.owner_email)
              return (
                <tr
                  key={u.auth_user_id ?? u.owner_email ?? i}
                  onClick={() => onSelect(u)}
                  style={{
                    cursor: 'pointer',
                    background: isSelected ? C.accentBg : i % 2 === 0 ? C.surface : '#FAFBFC',
                    borderBottom: `1px solid ${C.border}`,
                    transition: 'background 0.1s',
                  }}
                  onMouseEnter={e => { if (!isSelected) e.currentTarget.style.background = '#F1F5F9' }}
                  onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background = i % 2 === 0 ? C.surface : '#FAFBFC' }}
                >
                  <td style={{ padding: '11px 14px', fontSize: 13 }}>
                    <div style={{ fontWeight: 600, color: C.fg }}>{u.name || <span style={{ color: C.muted }}>—</span>}</div>
                    <div style={{ fontSize: 12, color: C.muted }}>{u.owner_email}</div>
                  </td>
                  <td style={{ padding: '11px 14px', fontSize: 12, color: C.muted, whiteSpace: 'nowrap' }}>{fmtDate(u.auth_created_at)}</td>
                  <td style={{ padding: '11px 14px', fontSize: 12, color: C.muted, whiteSpace: 'nowrap' }}>{fmtRelative(u.last_sign_in_at)}</td>
                  <td style={{ padding: '11px 14px' }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: tierColor(u.subscription_tier), textTransform: 'capitalize' }}>
                      {u.subscription_tier || '—'}
                    </span>
                  </td>
                  <td style={{ padding: '11px 14px' }}>
                    <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 20, background: badge.bg, color: badge.color, border: `1px solid ${badge.border}`, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      {badge.label}
                    </span>
                  </td>
                  <td style={{ padding: '11px 14px', fontSize: 13, color: C.fgMid, textAlign: 'right' }}>{u.intake_link_count}</td>
                  <td style={{ padding: '11px 14px', fontSize: 13, color: C.fgMid, textAlign: 'right', fontWeight: u.intake_submission_count > 0 ? 600 : 400 }}>{u.intake_submission_count}</td>
                  <td style={{ padding: '11px 14px', fontSize: 13, color: C.fgMid, textAlign: 'right' }}>{u.client_count}</td>
                </tr>
              )
            })}
            {sorted.length === 0 && (
              <tr>
                <td colSpan={8} style={{ padding: '32px', textAlign: 'center', color: C.muted, fontSize: 14 }}>No users match your filter.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ── UserDetailPanel ────────────────────────────────────────────────────────────
function UserDetailPanel({ user, onClose, secret }) {
  const [copied, setCopied] = useState(false)
  const [flagging, setFlagging] = useState(false)
  const [flagged, setFlagged]   = useState(false)
  const [disabling, setDisabling] = useState(false)
  const [deleting, setDeleting]   = useState(false)
  const [disabled, setDisabled]   = useState(false)

  if (!user) return null

  const badge = statusBadge(user.subscription_status)
  const hasStripe = !!user.stripe_customer_id

  function copyEmail() {
    navigator.clipboard.writeText(user.owner_email).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  async function callAction(action, payload = {}) {
    const ADMIN_ACTION_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-action`
    const res = await fetch(ADMIN_ACTION_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-admin-secret': secret },
      body: JSON.stringify({ action, ...payload }),
    })
    if (!res.ok) throw new Error('Action failed')
    return res.json()
  }

  async function handleFlag() {
    setFlagging(true)
    try {
      await callAction('flag_support', { user_id: user.auth_user_id, email: user.owner_email })
      setFlagged(true)
    } catch {
      alert('Action failed — admin-action function not yet deployed.')
    } finally {
      setFlagging(false)
    }
  }

  async function handleDisable() {
    const action = disabled ? 'enable_user' : 'disable_user'
    const msg = disabled
      ? `Re-enable account for ${user.owner_email}?`
      : `Disable account for ${user.owner_email}? They won't be able to sign in.`
    if (!confirm(msg)) return
    setDisabling(true)
    try {
      await callAction(action, { user_id: user.auth_user_id })
      setDisabled(d => !d)
    } catch (e) {
      alert('Failed: ' + e.message)
    } finally {
      setDisabling(false)
    }
  }

  async function handleDelete() {
    if (!confirm(`Permanently delete account for ${user.owner_email}?\n\nThis cannot be undone. They can sign up again with the same email.`)) return
    if (!confirm(`Second confirmation — delete ${user.owner_email}?`)) return
    setDeleting(true)
    try {
      await callAction('delete_user', { user_id: user.auth_user_id })
      alert('Account deleted. Close this panel.')
      onClose()
    } catch (e) {
      alert('Failed: ' + e.message)
    } finally {
      setDeleting(false)
    }
  }

  const Row = ({ label, value, mono = false, children }) => (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, padding: '8px 0', borderBottom: `1px solid ${C.bg}` }}>
      <span style={{ fontSize: 12, color: C.muted, width: 110, flexShrink: 0 }}>{label}</span>
      {children ?? <span style={{ fontSize: 13, color: C.fg, fontFamily: mono ? 'monospace' : 'inherit', wordBreak: 'break-all' }}>{value ?? '—'}</span>}
    </div>
  )

  return (
    <>
      {/* Backdrop */}
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 40, background: 'rgba(15,23,42,0.3)' }} />

      {/* Panel */}
      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0, width: 420, zIndex: 50,
        background: C.surface, borderLeft: `1px solid ${C.border}`,
        display: 'flex', flexDirection: 'column', overflow: 'hidden',
        boxShadow: '-8px 0 30px rgba(0,0,0,0.08)', ...F.sans,
      }}>
        {/* Header */}
        <div style={{ padding: '20px 24px 16px', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: 16, color: C.fg }}>{user.name || 'Unnamed user'}</div>
            <div style={{ fontSize: 13, color: C.muted, marginTop: 2 }}>{user.owner_email}</div>
          </div>
          <button onClick={onClose} style={{ border: 'none', background: 'none', fontSize: 20, color: C.muted, cursor: 'pointer', padding: '2px 6px', lineHeight: 1 }}>×</button>
        </div>

        {/* Scrollable content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '0 24px 24px' }}>

          {/* Status badge */}
          <div style={{ padding: '16px 0 12px', display: 'flex', gap: 8, alignItems: 'center' }}>
            <span style={{ fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 20, background: badge.bg, color: badge.color, border: `1px solid ${badge.border}`, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {badge.label}
            </span>
            {user.subscription_tier && user.subscription_tier !== 'none' && (
              <span style={{ fontSize: 12, fontWeight: 600, color: tierColor(user.subscription_tier), textTransform: 'capitalize' }}>
                {user.subscription_tier} plan
              </span>
            )}
          </div>

          {/* Account details */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Account</div>
            <Row label="Email" value={user.owner_email} />
            <Row label="Agency" value={user.name} />
            <Row label="Auth user ID" value={user.auth_user_id} mono />
            <Row label="Joined" value={fmtDate(user.auth_created_at)} />
            <Row label="Last login" value={user.last_sign_in_at ? fmtRelative(user.last_sign_in_at) : '—'} />
            {user.trial_ends_at && <Row label="Trial ends" value={fmtDate(user.trial_ends_at)} />}
          </div>

          {/* Usage */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Usage</div>
            <Row label="Intake links" value={user.intake_link_count} />
            <Row label="Scans" value={user.intake_submission_count} />
            <Row label="Clients" value={user.client_count} />
            {user.last_submission_at && <Row label="Last scan" value={fmtRelative(user.last_submission_at)} />}
          </div>

          {/* Billing */}
          {(hasStripe || user.stripe_customer_id) && (
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Billing</div>
              <Row label="Stripe ID" value={user.stripe_customer_id} mono />
            </div>
          )}

          {/* Actions */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>Actions</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <button
                onClick={copyEmail}
                style={{ padding: '9px 14px', borderRadius: 8, border: `1.5px solid ${C.border}`, background: C.surface, color: C.fg, fontSize: 13, fontWeight: 600, cursor: 'pointer', textAlign: 'left', ...F.sans }}
              >
                {copied ? '✓ Copied' : '📋 Copy email'}
              </button>

              {hasStripe && (
                <a
                  href={`https://dashboard.stripe.com/customers/${user.stripe_customer_id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ padding: '9px 14px', borderRadius: 8, border: `1.5px solid ${C.border}`, background: C.surface, color: C.fg, fontSize: 13, fontWeight: 600, cursor: 'pointer', textDecoration: 'none', display: 'block' }}
                >
                  ↗ Open in Stripe
                </a>
              )}

              <button
                onClick={handleFlag}
                disabled={flagging || flagged}
                style={{ padding: '9px 14px', borderRadius: 8, border: `1.5px solid ${flagged ? C.greenBorder : C.border}`, background: flagged ? C.greenBg : C.surface, color: flagged ? C.green : C.fg, fontSize: 13, fontWeight: 600, cursor: flagging ? 'not-allowed' : 'pointer', textAlign: 'left', ...F.sans }}
              >
                {flagged ? '✓ Flagged for support' : flagging ? 'Flagging…' : '🚩 Flag for support'}
              </button>

              <button
                onClick={handleDisable}
                disabled={disabling}
                style={{ padding: '9px 14px', borderRadius: 8, border: `1.5px solid rgba(239,68,68,0.3)`, background: C.redBg, color: C.red, fontSize: 13, fontWeight: 600, cursor: disabling ? 'not-allowed' : 'pointer', textAlign: 'left', ...F.sans }}
              >
                {disabling ? (disabled ? 'Enabling…' : 'Disabling…') : disabled ? '✓ Re-enable account' : '🚫 Disable account'}
              </button>

              <button
                onClick={handleDelete}
                disabled={deleting}
                style={{ padding: '9px 14px', borderRadius: 8, border: `1.5px solid rgba(239,68,68,0.5)`, background: '#FEE2E2', color: '#B91C1C', fontSize: 13, fontWeight: 600, cursor: deleting ? 'not-allowed' : 'pointer', textAlign: 'left', ...F.sans }}
              >
                {deleting ? 'Deleting…' : '🗑 Delete account'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

// ── LogsList ───────────────────────────────────────────────────────────────────
function LogsList({ submissions }) {
  function scoreColor(score) {
    if (score === null || score === undefined) return C.muted
    if (score >= 75) return C.green
    if (score >= 50) return C.yellow
    return C.red
  }

  function scoreLabel(label) {
    if (!label) return '—'
    return label
  }

  return (
    <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, overflow: 'hidden' }}>
      <div style={{ padding: '16px 20px', borderBottom: `1px solid ${C.border}` }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: C.fg }}>Recent scans</div>
        <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>Last {submissions.length} submissions</div>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', ...F.sans }}>
          <thead>
            <tr>
              {['Address', 'Agent', 'Agency', 'Score', 'Label', 'Source', 'Submitted'].map(h => (
                <th key={h} style={{ padding: '10px 14px', fontSize: 11, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'left', background: C.bg, borderBottom: `1px solid ${C.border}`, whiteSpace: 'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {submissions.map((s, i) => (
              <tr key={s.id} style={{ borderBottom: `1px solid ${C.border}`, background: i % 2 === 0 ? C.surface : '#FAFBFC' }}>
                <td style={{ padding: '11px 14px', fontSize: 13, color: C.fg, maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.address || '—'}</td>
                <td style={{ padding: '11px 14px', fontSize: 12, color: C.fgMid, whiteSpace: 'nowrap' }}>{s.agent_name || '—'}</td>
                <td style={{ padding: '11px 14px', fontSize: 12, color: C.muted, whiteSpace: 'nowrap' }}>{s.agency_name || '—'}</td>
                <td style={{ padding: '11px 14px' }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: scoreColor(s.bind_score) }}>{s.bind_score ?? '—'}</span>
                </td>
                <td style={{ padding: '11px 14px', fontSize: 12, color: C.muted, whiteSpace: 'nowrap' }}>{scoreLabel(s.bind_label)}</td>
                <td style={{ padding: '11px 14px' }}>
                  <span style={{ fontSize: 11, fontWeight: 600, color: s.score_source === 'pdf' ? C.accent : C.muted }}>
                    {s.score_source || '—'}
                  </span>
                </td>
                <td style={{ padding: '11px 14px', fontSize: 12, color: C.muted, whiteSpace: 'nowrap' }}>{fmtRelative(s.submitted_at)}</td>
              </tr>
            ))}
            {submissions.length === 0 && (
              <tr>
                <td colSpan={7} style={{ padding: '32px', textAlign: 'center', color: C.muted, fontSize: 14 }}>No submissions yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ── Sidebar ────────────────────────────────────────────────────────────────────
function Sidebar({ tab, setTab, onRefresh, loading }) {
  const navItems = [
    { id: 'overview', label: 'Overview', icon: '◈' },
    { id: 'users',    label: 'Users',    icon: '⊙' },
    { id: 'logs',     label: 'Scan logs', icon: '≡' },
  ]

  return (
    <div style={{ width: 200, background: C.sidebar, display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
      {/* Logo */}
      <div style={{ padding: '22px 20px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ fontWeight: 800, fontSize: 18, letterSpacing: '-0.03em', color: '#fff' }}>
          Bind<span style={{ color: '#DC2626' }}>IQ</span>
        </div>
        <div style={{ fontSize: 11, color: C.sidebarText, marginTop: 2, fontWeight: 500 }}>Admin Console</div>
      </div>

      {/* Nav */}
      <nav style={{ padding: '12px 10px', flex: 1 }}>
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => setTab(item.id)}
            style={{
              display: 'flex', alignItems: 'center', gap: 10, width: '100%',
              padding: '9px 12px', borderRadius: 8, border: 'none',
              background: tab === item.id ? 'rgba(255,255,255,0.1)' : 'transparent',
              color: tab === item.id ? C.sidebarAct : C.sidebarText,
              fontSize: 13, fontWeight: tab === item.id ? 600 : 400,
              cursor: 'pointer', textAlign: 'left', marginBottom: 2, ...F.sans,
              transition: 'background 0.1s',
            }}
          >
            <span style={{ fontSize: 14, opacity: 0.8 }}>{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>

      {/* Refresh */}
      <div style={{ padding: '12px 10px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <button
          onClick={onRefresh}
          disabled={loading}
          style={{
            display: 'flex', alignItems: 'center', gap: 8, width: '100%',
            padding: '9px 12px', borderRadius: 8, border: 'none',
            background: 'transparent', color: C.sidebarText,
            fontSize: 13, cursor: loading ? 'not-allowed' : 'pointer', ...F.sans,
          }}
        >
          <span style={{ fontSize: 14, display: 'inline-block', transform: loading ? 'rotate(360deg)' : 'none', transition: 'transform 0.5s' }}>↺</span>
          {loading ? 'Refreshing…' : 'Refresh'}
        </button>
      </div>
    </div>
  )
}

// ── AdminPage ──────────────────────────────────────────────────────────────────
export default function AdminPage() {
  const [secret, setSecret]     = useState(() => sessionStorage.getItem('admin_secret') ?? null)
  const [data, setData]         = useState(null)
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState(null)
  const [tab, setTab]           = useState('overview')
  const [selected, setSelected] = useState(null)

  const load = useCallback(async (s) => {
    const key = s ?? secret
    if (!key) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`${ADMIN_STATS_URL}?key=${encodeURIComponent(key)}`)
      if (res.status === 403) {
        sessionStorage.removeItem('admin_secret')
        setSecret(null)
        return
      }
      if (!res.ok) throw new Error(`Server error: ${res.status}`)
      const d = await res.json()
      setData(d)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [secret])

  // Auto-load on mount if secret already in sessionStorage
  useEffect(() => {
    if (secret && !data) load(secret)
  }, [])

  function handleAuth(s, initialData) {
    setSecret(s)
    setData(initialData)
  }

  function handleSelect(user) {
    const uid = user.auth_user_id ?? user.id ?? user.owner_email
    setSelected(prev => (prev && (prev.auth_user_id ?? prev.id ?? prev.owner_email) === uid) ? null : user)
  }

  // Not authenticated yet
  if (!secret || !data) {
    return <PasswordGate onAuth={handleAuth} />
  }

  const { stats, users = [], submissions = [] } = data

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', ...F.sans }}>
      <Sidebar tab={tab} setTab={setTab} onRefresh={() => load()} loading={loading} />

      {/* Main */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: C.bg }}>
        {/* Topbar */}
        <div style={{ background: C.surface, borderBottom: `1px solid ${C.border}`, padding: '14px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          <div>
            <span style={{ fontSize: 16, fontWeight: 700, color: C.fg, textTransform: 'capitalize' }}>{tab}</span>
            {error && <span style={{ marginLeft: 12, fontSize: 13, color: C.red }}>{error}</span>}
          </div>
          <div style={{ fontSize: 12, color: C.muted }}>
            {loading ? 'Loading…' : `${users.length} users · ${submissions.length} recent scans`}
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '28px' }}>
          {tab === 'overview' && (
            <>
              <StatsHeader stats={stats} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                {/* Tier breakdown */}
                <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: '20px 24px' }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: C.fg, marginBottom: 16 }}>Subscription breakdown</div>
                  {[
                    { label: 'Agency',  count: users.filter(u => u.subscription_tier === 'agency').length,  color: '#7C3AED' },
                    { label: 'Growth',  count: users.filter(u => u.subscription_tier === 'growth').length,  color: C.accent },
                    { label: 'Starter', count: users.filter(u => u.subscription_tier === 'starter').length, color: C.green },
                    { label: 'Trial',   count: users.filter(u => u.subscription_status === 'trialing').length, color: C.yellow },
                    { label: 'None',    count: users.filter(u => !u.subscription_tier || u.subscription_tier === 'none').length, color: C.muted },
                  ].map(row => (
                    <div key={row.label} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: row.color, flexShrink: 0 }} />
                      <span style={{ fontSize: 13, color: C.fgMid, flex: 1 }}>{row.label}</span>
                      <span style={{ fontSize: 13, fontWeight: 600, color: C.fg }}>{row.count}</span>
                    </div>
                  ))}
                </div>

                {/* Recent activity */}
                <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: '20px 24px' }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: C.fg, marginBottom: 16 }}>Recent activity</div>
                  {submissions.slice(0, 6).map(s => (
                    <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                      <div style={{ width: 28, height: 28, borderRadius: 8, background: s.bind_score >= 75 ? C.greenBg : s.bind_score >= 50 ? C.yellowBg : C.redBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <span style={{ fontSize: 11, fontWeight: 700, color: s.bind_score >= 75 ? C.green : s.bind_score >= 50 ? C.yellow : C.red }}>
                          {s.bind_score ?? '?'}
                        </span>
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 12, fontWeight: 600, color: C.fg, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {s.address || 'Unknown address'}
                        </div>
                        <div style={{ fontSize: 11, color: C.muted }}>{s.agent_name || '—'}</div>
                      </div>
                      <div style={{ fontSize: 11, color: C.muted, flexShrink: 0 }}>{fmtRelative(s.submitted_at)}</div>
                    </div>
                  ))}
                  {submissions.length === 0 && <div style={{ fontSize: 13, color: C.muted }}>No scans yet.</div>}
                </div>
              </div>
            </>
          )}

          {tab === 'users' && (
            <UserTable users={users} onSelect={handleSelect} selectedId={selected ? (selected.auth_user_id ?? selected.id ?? selected.owner_email) : null} />
          )}

          {tab === 'logs' && (
            <LogsList submissions={submissions} />
          )}
        </div>
      </div>

      {/* Detail panel */}
      {selected && (
        <UserDetailPanel user={selected} onClose={() => setSelected(null)} secret={secret} />
      )}
    </div>
  )
}
