'use client'

import Link from 'next/link'
import { useAuth } from '@/hooks'
import { Button } from '@/components/ui/button'
import { CreditCard, ArrowRight } from 'lucide-react'

export function BannerSocioLogueado() {
  const { profile, loading } = useAuth()

  if (loading || profile?.rol_id !== 3) return null

  return (
    <div className="w-full bg-yellow-400/10 border border-yellow-400/30 rounded-lg px-5 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 mb-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <CreditCard className="size-5 text-yellow-400 shrink-0" />
        <p className="text-sm text-zinc-200 font-mono">
          Ya tienes una cuenta activa.{' '}
          <span className="text-yellow-400 font-semibold">
            Consulta el estado de tu membresía.
          </span>
        </p>
      </div>
      <Button
        asChild
        size="sm"
        className="bg-yellow-400 text-zinc-950 hover:bg-yellow-300 font-arcade text-xs shrink-0"
      >
        <Link href="/mi-membresia">
          Ver mi membresía
          <ArrowRight className="ml-2 size-3" />
        </Link>
      </Button>
    </div>
  )
}
