'use client'

import { useState, useEffect, createContext, useContext, ReactNode } from 'react'
import { supabase } from '@/lib/supabase/client'
import type { Profile } from '@/lib/supabase/types'
import type { User, Session } from '@supabase/supabase-js'

type AuthContextType = {
  user: User | null
  session: Session | null
  profile: Profile | null
  loading: boolean
  isRecovery: boolean
  signUp: (email: string, password: string, metadata: { nombre: string; apellido: string; telefono?: string }) => Promise<{ error: Error | null }>
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<{ error: Error | null }>
  updatePassword: (password: string) => Promise<{ error: Error | null }>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [isRecovery, setIsRecovery] = useState(false)

  const fetchProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) {
      console.error('Error fetching profile:', error)
      return null
    }
    return data as Profile
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchProfile(session.user.id).then(setProfile)
      }
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      if (event === 'PASSWORD_RECOVERY') {
        setIsRecovery(true)
      }
      if (session?.user) {
        fetchProfile(session.user.id).then(setProfile)
      } else {
        setProfile(null)
      }
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signUp = async (email: string, password: string, metadata: { nombre: string; apellido: string; telefono?: string }) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata
      }
    })
    return { error }
  }

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    return { error }
  }

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/update-password`
    })
    return { error }
  }

  const updatePassword = async (password: string) => {
    const { error } = await supabase.auth.updateUser({ password })
    if (!error) {
      setIsRecovery(false)
    }
    return { error }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    setProfile(null)
    setIsRecovery(false)
  }

  const refreshProfile = async () => {
    if (user) {
      const profileData = await fetchProfile(user.id)
      setProfile(profileData)
    }
  }

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
