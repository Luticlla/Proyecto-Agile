'use client'

import { useAuth } from '@/hooks'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Header from '@/components/layout/Header'

export default function MiMembresiaLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { profile, loading, signOut } = useAuth()
  const router = useRouter()

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black gap-4">
        <Loader2 className="size-10 text-gym-logo animate-spin" />
        <p className="font-mono text-white/40 text-xs tracking-widest uppercase">
          Cargando...
        </p>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center space-y-4">
          <Loader2 className="size-10 text-gym-logo animate-spin" />
          <p className="font-mono text-white/40 text-xs tracking-widest uppercase">
            Redirigiendo...
          </p>
        </div>
      </div>
    )
  }

  if (profile.activo === false) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center space-y-4">
          <p className="text-red-400 font-mono text-sm mb-2">Tu sesión está inhabilitada, no tienes acceso al sistema</p>
          <p className="text-white/40 font-mono text-xs mb-4">Comunícate con el administrador para más información.</p>
          <Button
            onClick={() => { signOut(); router.push('/login') }}
            className="bg-gym-logo text-black hover:bg-gym-logo/80 font-arcade text-xs tracking-widest uppercase"
          >
            Cerrar sesión
          </Button>
        </div>
      </div>
    )
  }

  if (profile.rol_id !== 3) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center space-y-4">
          <p className="text-white/60 font-mono text-sm mb-4">No tienes acceso a esta sección</p>
          <Button
            onClick={() => router.push('/')}
            className="bg-gym-logo text-black hover:bg-gym-logo/80 font-arcade text-xs tracking-widest uppercase"
          >
            Volver al inicio
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      <Header />

      {/* Main content */}
      <main className="container mx-auto px-4 py-8 md:py-12 max-w-4xl">
        {children}
      </main>
    </div>
  )
}
