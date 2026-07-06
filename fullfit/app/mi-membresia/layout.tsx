'use client'

import { useAuth } from '@/hooks'
import { useRouter } from 'next/navigation'
import { Loader2, CreditCard, LogOut, Home } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

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
          <p className="text-white/60 font-mono text-sm mb-4">Error al cargar el perfil</p>
          <Button
            onClick={() => signOut()}
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

  const handleSignOut = async () => {
    await signOut()
    router.push('/login')
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="border-b-2 border-gym-logo/30 bg-black/90 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo + nav */}
            <div className="flex items-center gap-6">
              <Link
                href="/"
                className="font-arcade text-gym-logo text-sm md:text-base tracking-widest uppercase [text-shadow:0_0_16px_rgba(255,223,0,0.4)] hover:opacity-80 transition-opacity"
              >
                FullFit
              </Link>
              <div className="h-5 w-px bg-white/10 hidden md:block" />
              <nav className="hidden md:flex items-center gap-1">
                <Link href="/mi-membresia">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gym-logo/80 hover:text-gym-logo hover:bg-gym-logo/10 font-arcade text-[10px] tracking-widest uppercase gap-2"
                  >
                    <CreditCard className="size-3" />
                    Mi Membresía
                  </Button>
                </Link>
                <Link href="/">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white/40 hover:text-white hover:bg-white/5 font-arcade text-[10px] tracking-widest uppercase gap-2"
                  >
                    <Home className="size-3" />
                    Inicio
                  </Button>
                </Link>
              </nav>
            </div>

            {/* User info + logout */}
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex flex-col items-end">
                <span className="font-mono text-white text-xs font-medium">
                  {profile.nombre} {profile.apellido}
                </span>
                <span className="font-mono text-white/30 text-[10px] uppercase tracking-wider">Socio</span>
              </div>
              <div className="h-5 w-px bg-white/10" />
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSignOut}
                className="text-white/40 hover:text-red-400 hover:bg-red-500/10 font-arcade text-[10px] tracking-widest uppercase gap-2"
              >
                <LogOut className="size-3" />
                <span className="hidden sm:inline">Salir</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-4 py-8 md:py-12 max-w-4xl">
        {children}
      </main>
    </div>
  )
}
