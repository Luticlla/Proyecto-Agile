'use client'

import { useState } from 'react'
import { useAuth } from '@/hooks'
import { Button } from '@/components/ui/button'
import { Loader2, User, LogOut } from 'lucide-react'

export default function AuthButtons() {
  const { user, profile, loading, signOut } = useAuth()
  const [isLoading, setIsLoading] = useState(false)

  const handleSignOut = async () => {
    setIsLoading(true)
    await signOut()
    setIsLoading(false)
  }

  if (loading) {
    return (
      <div className="flex items-center gap-2">
        <Loader2 className="h-4 w-4 animate-spin text-yellow-400" />
      </div>
    )
  }

  if (user) {
    return (
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-zinc-300">
          <User className="h-4 w-4" />
          <span className="text-sm hidden sm:inline">
            {profile?.nombre || user.email}
          </span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleSignOut}
          disabled={isLoading}
          className="border-zinc-700 text-zinc-300 hover:border-yellow-400/60 hover:text-yellow-400"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <LogOut className="h-4 w-4 mr-1" />
              Salir
            </>
          )}
        </Button>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-3">
      <Button
        asChild
        variant="outline"
        className="border-zinc-700 text-zinc-950 hover:border-yellow-400/60 hover:text-yellow-400"
      >
        <a href="/login">Iniciar Sesión</a>
      </Button>
      <Button
        asChild
        className="bg-yellow-400 text-zinc-950 hover:bg-yellow-300"
      >
        <a href="/register">¡Regístrate!</a>
      </Button>
    </div>
  )
}