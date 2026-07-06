'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/hooks'
import { Button } from '@/components/ui/button'
import { Loader2, User, LogOut, CreditCard } from 'lucide-react'

interface AuthButtonsProps {
  direction?: 'row' | 'column'
}

export default function AuthButtons({ direction = 'row' }: AuthButtonsProps) {
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
      <div className={`flex ${direction === 'column' ? 'flex-col gap-3 w-full' : 'items-center gap-3'}`}>
        {profile?.rol_id === 3 && (
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="font-arcade text-zinc-300 hover:text-yellow-400"
          >
            <Link href="/mi-membresia">
              <CreditCard className="h-4 w-4 mr-1" />
              Mi Membresía
            </Link>
          </Button>
        )}
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
          className="font-arcade border-zinc-700 text-zinc-300 hover:border-yellow-400/60 hover:text-yellow-400"
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
    <div className={`flex ${direction === 'column' ? 'flex-col gap-3 w-full' : 'items-center gap-3'}`}>
      <Button
        asChild
        variant="outline"
        className="font-arcade border-zinc-700 text-zinc-950 hover:border-yellow-400/60 hover:text-yellow-400"
      >
        <Link href="/login">Iniciar Sesión</Link>
      </Button>
      <Button
        asChild
        className="font-arcade bg-yellow-400 text-zinc-950 hover:bg-yellow-300"
      >
        <Link href="/register">¡Regístrate!</Link>
      </Button>
    </div>
  )
}