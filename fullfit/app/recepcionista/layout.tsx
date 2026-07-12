'use client'

import { useAuth } from '@/hooks'
import { useRouter, usePathname } from 'next/navigation'
import { Loader2, Users, CreditCard, LogOut } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export default function RecepcionistaLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { profile, loading, signOut } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

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

  if (profile.rol_id !== 1 && profile.rol_id !== 2) {
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

  const navLinks = [
    { href: '/recepcionista/clientes', label: 'Clientes', icon: Users },
    { href: '/recepcionista/membresias', label: 'Membresías', icon: CreditCard },
  ]

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="border-b-2 border-gym-logo/30 bg-black/90 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo + nav */}
            <div className="flex items-center gap-6">
              <Link
                href="/recepcionista"
                className="font-arcade text-gym-logo text-sm md:text-base tracking-widest uppercase [text-shadow:0_0_16px_rgba(255,223,0,0.4)] hover:opacity-80 transition-opacity"
              >
                FULLFORMA <span className="text-white/50 text-[10px]">ADMIN</span>
              </Link>
              <div className="h-5 w-px bg-white/10 hidden md:block" />
              <nav className="hidden md:flex items-center gap-1">
                {navLinks.map(({ href, label, icon: Icon }) => {
                  const isActive = pathname.startsWith(href)
                  return (
                    <Link key={href} href={href}>
                      <Button
                        variant="ghost"
                        size="sm"
                        className={cn(
                          "font-arcade text-[10px] tracking-widest uppercase gap-2 transition-all duration-200",
                          isActive 
                            ? "text-gym-logo bg-gym-logo/10" 
                            : "text-white/40 hover:text-white hover:bg-white/5"
                        )}
                      >
                        <Icon className="size-3" />
                        {label}
                      </Button>
                    </Link>
                  )
                })}
              </nav>
            </div>

            {/* User info + logout */}
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex flex-col items-end">
                <span className="font-mono text-white text-xs font-medium">
                  {profile.nombre} {profile.apellido}
                </span>
                <span className="font-mono text-gym-logo/80 text-[10px] uppercase tracking-wider">
                  {profile.rol_id === 1 ? 'Gerente' : 'Recepcionista'}
                </span>
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
      <main className="container mx-auto px-4 py-8 md:py-12">
        {children}
      </main>
    </div>
  )
}