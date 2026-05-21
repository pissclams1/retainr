import { useSessionAuth } from './useSessionAuth'

export function useAuth() {
  const { session, user, loading, getToken, logout } = useSessionAuth()

  return {
    session,
    user,
    loading,
    userId: user?.id ?? null,
    sessionId: session?.token ?? null,
    getToken,
    logout,
  }
}
