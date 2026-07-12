'use client'

import { useEffect, useRef } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase/client'

const TIMEOUT_MS = 30 * 60 * 1000 // 30 minutos
const STORAGE_KEY = 'fullfit:lastActivity'

function logout() {
  localStorage.removeItem(STORAGE_KEY)
  supabase.auth.signOut().then(() => {
    window.location.href = '/login'
  })
}

export function useInactivityLogout(session: Session | null) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (!session) {
      // Si no hay sesión, limpiar storage
      localStorage.removeItem(STORAGE_KEY)
      return
    }

    // ── Al montar: verificar si ya pasaron 30 min ──
    const lastActivity = localStorage.getItem(STORAGE_KEY)
    if (lastActivity) {
      const elapsed = Date.now() - parseInt(lastActivity, 10)
      if (elapsed > TIMEOUT_MS) {
        logout()
        return
      }
    }

    // ── Resetear el timer de inactividad ──
    const resetTimer = () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)

      timeoutRef.current = setTimeout(() => {
        logout()
      }, TIMEOUT_MS)

      localStorage.setItem(STORAGE_KEY, Date.now().toString())
    }

    // ── Eventos de actividad del usuario ──
    const activityEvents = ['mousedown', 'keydown', 'touchstart', 'scroll']
    activityEvents.forEach((event) =>
      document.addEventListener(event, resetTimer, { passive: true })
    )

    // ── visibilitychange: al volver a la pestaña, verificar tiempo ──
    const handleVisibility = () => {
      if (document.visibilityState !== 'visible') return

      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored && Date.now() - parseInt(stored, 10) > TIMEOUT_MS) {
        logout()
      }
    }
    document.addEventListener('visibilitychange', handleVisibility)

    // ── beforeunload: guardar timestamp como backup ──
    const handleBeforeUnload = () => {
      localStorage.setItem(STORAGE_KEY, Date.now().toString())
    }
    window.addEventListener('beforeunload', handleBeforeUnload)

    // Iniciar timer
    resetTimer()

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      activityEvents.forEach((event) =>
        document.removeEventListener(event, resetTimer)
      )
      document.removeEventListener('visibilitychange', handleVisibility)
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [session])
}
