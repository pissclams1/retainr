const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL

export async function requestMagicLink(email, redirectTo) {
  if (!email?.trim()) {
    throw new Error('Email is required')
  }

  const res = await fetch(
    `${SUPABASE_URL}/functions/v1/request-magic-link`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({
        email: email.trim(),
        redirectTo: redirectTo || undefined,
      }),
    }
  )

  const data = await res.json()

  if (!res.ok) {
    throw new Error(data.error || 'Failed to send magic link')
  }

  return data
}
