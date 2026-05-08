import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

const SESSION_STORAGE_KEY = 'auth_session_token'
const USER_STORAGE_KEY = 'auth_user'

export function useSessionAuth() {
  const [session, setSession] = useState(null)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Restore session from localStorage on mount
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const savedToken = localStorage.getItem(SESSION_STORAGE_KEY)
        if (!savedToken) {
          setLoading(false)
          return
        }

        // Verify session with backend
        const { data, error: checkErr } = await supabase.functions.invoke('auth-session', {
          body: { sessionToken: savedToken },
        })

        if (checkErr || !data?.authenticated) {
          // Invalid or expired session
          localStorage.removeItem(SESSION_STORAGE_KEY)
          localStorage.removeItem(USER_STORAGE_KEY)
          setLoading(false)
          return
        }

        // Session valid, restore it
        setSession({ user: { id: data.userId }, token: savedToken })
        setUser({ id: data.userId, email: data.email })
      } catch (err) {
        console.error('Session restoration error:', err)
      } finally {
        setLoading(false)
      }
    }

    restoreSession()
  }, [])

  const signup = useCallback(async (email, password, rememberMe = false) => {
    setError(null)
    try {
      const { data, error: signupErr } = await supabase.functions.invoke('auth-signup', {
        body: { email, password, rememberMe },
      })

      if (signupErr) throw new Error(signupErr.message)
      if (data?.error) throw new Error(data.error)

      // Store session
      localStorage.setItem(SESSION_STORAGE_KEY, data.sessionToken)
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify({ id: data.userId, email }))

      setSession({ user: { id: data.userId }, token: data.sessionToken })
      setUser({ id: data.userId, email })

      return { success: true }
    } catch (err) {
      const message = err.message || 'Signup failed'
      setError(message)
      return { success: false, error: message }
    }
  }, [])

  const login = useCallback(async (email, password, rememberMe = false) => {
    setError(null)
    try {
      const { data, error: loginErr } = await supabase.functions.invoke('auth-login', {
        body: { email, password, rememberMe },
      })

      if (loginErr) throw new Error(loginErr.message)
      if (data?.error) throw new Error(data.error)

      // Store session
      localStorage.setItem(SESSION_STORAGE_KEY, data.sessionToken)
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify({ id: data.userId, email }))

      setSession({ user: { id: data.userId }, token: data.sessionToken })
      setUser({ id: data.userId, email })

      return { success: true }
    } catch (err) {
      const message = err.message || 'Login failed'
      setError(message)
      return { success: false, error: message }
    }
  }, [])

  const logout = useCallback(async () => {
    try {
      const token = localStorage.getItem(SESSION_STORAGE_KEY)
      if (token) {
        await supabase.functions.invoke('auth-logout', {
          body: { sessionToken: token },
        })
      }

      localStorage.removeItem(SESSION_STORAGE_KEY)
      localStorage.removeItem(USER_STORAGE_KEY)
      setSession(null)
      setUser(null)
    } catch (err) {
      console.error('Logout error:', err)
    }
  }, [])

  // Get session token for API requests
  const getToken = useCallback(async () => {
    return localStorage.getItem(SESSION_STORAGE_KEY)
  }, [])

  return {
    session,
    user,
    loading,
    error,
    signup,
    login,
    logout,
    getToken,
  }
}
