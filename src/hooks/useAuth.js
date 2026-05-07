import { useAuth as useClerkAuth } from '@clerk/clerk-react'

export function useAuth() {
  const { isLoaded, userId, sessionId, getToken } = useClerkAuth()

  // For compatibility with existing code, return a session object if user is authenticated
  const session = userId ? { user: { id: userId } } : null
  const loading = !isLoaded

  return { session, loading, userId, sessionId, getToken }
}
