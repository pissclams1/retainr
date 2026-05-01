import { useState, useEffect } from 'react'
import { SUPPORTED_STATES, DEFAULT_STATE } from '../config/states'

const STORAGE_KEY = 'bindiq_state'

export function useDetectedState() {
  const [stateCode, setStateCode] = useState(() => {
    try { return localStorage.getItem(STORAGE_KEY) || null } catch { return null }
  })

  useEffect(() => {
    if (stateCode) return
    const controller = new AbortController()
    fetch('https://ipapi.co/json/', { signal: controller.signal })
      .then(r => r.json())
      .then(d => {
        const detected = d?.region_code
        const resolved = SUPPORTED_STATES.includes(detected) ? detected : DEFAULT_STATE
        try { localStorage.setItem(STORAGE_KEY, resolved) } catch {}
        setStateCode(resolved)
      })
      .catch(() => {
        setStateCode(DEFAULT_STATE)
      })
    return () => controller.abort()
  }, [stateCode])

  return stateCode || DEFAULT_STATE
}
