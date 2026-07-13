'use client'

import { useState, useEffect, createContext, useContext, ReactNode, useRef, useCallback } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useInactivityLogout } from '@/hooks/useInactivityLogout'
import type { Profile } from '@/lib/supabase/types'
import type { User, Session } from '@supabase/supabase-js'

type AuthContextType = {
  user: User | null
  session: Session | null
  profile: Profile | null
  loading: boolean
  isRecovery: boolean
  signUp: (email: string, password: string, metadata: { nombre: string; apellido: string; telefono?: string; dni?: string; fecha_nacimiento?: string; genero?: string | null }) => Promise<{ error: Error | null }>
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<{ error: Error | null }>
  updatePassword: (password: string, token?: string) => Promise<{ error: Error | null }>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [isRecovery, setIsRecovery] = useState(false)
  const lastFetchedUserId = useRef<string | null>(null)

  const fetchProfile = useCallback(async (userId: string) => {
    // Evitar fetch duplicado para el mismo usuario
    if (lastFetchedUserId.current === userId && profile) {
      return profile
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) {
      console.error('Error fetching profile:', error)
      return null
    }

    lastFetchedUserId.current = userId
    return data as Profile
  }, [profile])

  useEffect(() => {
    let isMounted = true

    supabase.auth.getSession()
      .then(({ data: { session } }) => {
        if (!isMounted) return
        setSession(session)
        setUser(session?.user ?? null)
        setLoading(false)
        if (session?.user) {
          fetchProfile(session.user.id).then(profileData => {
            if (isMounted) setProfile(profileData)
          })
        }
      })
      .catch(() => {
        if (!isMounted) return
        setLoading(false)
      })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)

      if (event === 'PASSWORD_RECOVERY') {
        setIsRecovery(true)
      }

      if (session?.user) {
        if (session.user.id !== lastFetchedUserId.current) {
          fetchProfile(session.user.id).then(profileData => setProfile(profileData))
        }
      } else {
        setProfile(null)
        lastFetchedUserId.current = null
      }
    })

    const handlePageShow = (e: PageTransitionEvent) => {
      if (e.persisted) {
        supabase.auth.getSession().then(({ data: { session } }) => {
          if (!isMounted) return
          setSession(session)
          setUser(session?.user ?? null)
          if (session?.user) {
            fetchProfile(session.user.id).then(profileData => {
              if (isMounted) setProfile(profileData)
            })
          }
        })
      }
    }
    window.addEventListener('pageshow', handlePageShow)

    return () => {
      isMounted = false
      subscription.unsubscribe()
      window.removeEventListener('pageshow', handlePageShow)
    }
  }, [fetchProfile])

  const signUp = async (email: string, password: string, metadata: { nombre: string; apellido: string; telefono?: string; dni?: string; fecha_nacimiento?: string; genero?: string | null }) => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, metadata }),
      })

      const data = await response.json()

      if (!response.ok) {
        return { error: new Error(data.error || 'Error al registrar') }
      }

      return { error: null }
    } catch (error) {
      return { error: error as Error }
    }
  }

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    return { error }
  }

  const resetPassword = async (email: string) => {
    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        return { error: new Error(data.error || 'Error al enviar el correo') }
      }

      return { error: null }
    } catch (error) {
      return { error: error as Error }
    }
  }

  const updatePassword = async (password: string, token?: string) => {
    try {
      if (token) {
        const response = await fetch('/api/auth/update-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token, password }),
        })

        const data = await response.json()

        if (!response.ok) {
          return { error: new Error(data.error || 'Error al actualizar la contraseña') }
        }

        setIsRecovery(false)
        return { error: null }
      }

      const { error } = await supabase.auth.updateUser({ password })
      if (!error) {
        setIsRecovery(false)
      }
      return { error }
    } catch (error) {
      return { error: error as Error }
    }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    setProfile(null)
    setIsRecovery(false)
    lastFetchedUserId.current = null
    window.location.href = '/'
  }

  const refreshProfile = async () => {
    if (user) {
      lastFetchedUserId.current = null // Forzar refresh
      const profileData = await fetchProfile(user.id)
      setProfile(profileData)
    }
  }

  useInactivityLogout(session)

  return (
    <AuthContext.Provider value={{ user, session, profile, loading, isRecovery, signUp, signIn, signOut, resetPassword, updatePassword, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}