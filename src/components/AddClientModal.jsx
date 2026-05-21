import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { TIER_LIMIT } from '../lib/plans'
import { useSessionAuth } from '../hooks/useSessionAuth'
import Button from './ui/Button'
import Input from './ui/Input'

export default function AddClientModal({ onClose }) {
  const navigate = useNavigate()
  const { user, loading: authLoading } = useSessionAuth()
  const [saving, setSaving]       = useState(false)
  const [error, setError]         = useState(null)
  const [limitCheck, setLimitCheck] = useState({ loading: true, atLimit: false, tier: 'trial', count: 0 })
  const [form, setForm]     = useState({
    name:             '',
    industry:         '',
    location:         '',
    retainer_amount:  '',
    start_date:       '',
  })

  useEffect(() => {
    async function checkLimit() {
      if (authLoading) return
      if (!user?.email) {
        setLimitCheck({ loading: false, atLimit: true, tier: 'trial', count: 0 })
        return
      }
      const [{ data: agency }, { count }] = await Promise.all([
        supabase.from('agencies').select('subscription_tier').eq('owner_email', user.email).single(),
        supabase.from('clients').select('id', { count: 'exact', head: true }),
      ])
      const tier  = agency?.subscription_tier ?? 'trial'
      const limit = TIER_LIMIT[tier] ?? 3
      setLimitCheck({ loading: false, atLimit: (count ?? 0) >= limit, tier, count: count ?? 0 })
    }
    checkLimit()
  }, [authLoading, user?.email])

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name.trim()) return
    setSaving(true)
    setError(null)

    if (!user?.email) {
      setError('Please sign in again before adding a client.')
      setSaving(false)
      return
    }

    // Get or create agency for this user
    let agencyId
    const { data: existing } = await supabase
      .from('agencies')
      .select('id')
      .eq('owner_email', user.email)
      .single()

    if (existing) {
      agencyId = existing.id
    } else {
      const domain = user.email.split('@')[1]?.split('.')[0] ?? 'My Agency'
      const agencyName = domain.charAt(0).toUpperCase() + domain.slice(1)

      const { data: newAgency, error: agencyErr } = await supabase
        .from('agencies')
        .insert({ name: agencyName, owner_email: user.email })
        .select('id')
        .single()

      if (agencyErr) { setError('Failed to create agency record.'); setSaving(false); return }
      agencyId = newAgency.id
    }

    // Create client
    const { data: client, error: clientErr } = await supabase
      .from('clients')
      .insert({
        agency_id:       agencyId,
        name:            form.name.trim(),
        industry:        form.industry.trim() || null,
        location:        form.location.trim() || null,
        retainer_amount: form.retainer_amount ? parseInt(form.retainer_amount) : null,
        start_date:      form.start_date || null,
      })
      .select('id')
      .single()

    if (clientErr) { setError('Failed to create client.'); setSaving(false); return }

    navigate(`/clients/${client.id}`)
  }

  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(15,15,14,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', zIndex: 200 }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div style={{ background: 'white', borderRadius: '14px', padding: '28px', width: '100%', maxWidth: '460px', boxShadow: '0 8px 32px rgba(15,15,14,0.12)', maxHeight: '90vh', overflowY: 'auto' }}>
        <h2 style={{ fontFamily: 'Instrument Serif, serif', fontSize: '22px', color: 'var(--ink-2)', marginBottom: '6px' }}>
          Add client
        </h2>
        <p style={{ fontFamily: 'Geist, sans-serif', fontSize: '13px', color: 'var(--ink-5)', marginBottom: '24px', lineHeight: 1.5 }}>
          You'll connect their GA4 account on the next screen.
        </p>

        {!limitCheck.loading && limitCheck.atLimit && (
          <div style={{ borderLeft: '3px solid var(--alert)', background: 'var(--alert-bg)', padding: '14px 16px', marginBottom: '20px' }}>
            <p style={{ fontFamily: 'Geist, sans-serif', fontSize: '12px', fontWeight: 600, color: 'var(--alert)', marginBottom: '4px' }}>
              Client limit reached
            </p>
            <p style={{ fontFamily: 'Geist, sans-serif', fontSize: '12px', color: 'var(--ink-3)', lineHeight: 1.6, marginBottom: '10px' }}>
              Your {limitCheck.tier === 'trial' ? 'free trial' : limitCheck.tier} plan supports up to {TIER_LIMIT[limitCheck.tier]} client{TIER_LIMIT[limitCheck.tier] === 1 ? '' : 's'}.
              Upgrade to add more.
            </p>
            <Link to="/billing" onClick={onClose}>
              <Button size="sm">View plans</Button>
            </Link>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Input
            label="Client name"
            placeholder="Acme Corp"
            value={form.name}
            onChange={set('name')}
            required
          />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <Input
              label="Industry"
              placeholder="E-commerce"
              value={form.industry}
              onChange={set('industry')}
            />
            <Input
              label="Location"
              placeholder="New York, NY"
              value={form.location}
              onChange={set('location')}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <Input
              label="Monthly retainer ($)"
              placeholder="5000"
              type="number"
              min="0"
              value={form.retainer_amount}
              onChange={set('retainer_amount')}
            />
            <Input
              label="Client since"
              type="date"
              value={form.start_date}
              onChange={set('start_date')}
            />
          </div>

          {error && (
            <div style={{ borderLeft: '3px solid var(--danger)', background: 'var(--danger-bg)', padding: '10px 14px' }}>
              <p style={{ fontFamily: 'Geist, sans-serif', fontSize: '12px', color: 'var(--danger)' }}>{error}</p>
            </div>
          )}

          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', paddingTop: '4px' }}>
            <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={saving || !form.name.trim() || limitCheck.atLimit || limitCheck.loading}>
              {saving ? 'Creating…' : 'Create client'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
