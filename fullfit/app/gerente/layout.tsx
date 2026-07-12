'use client'

import { useAuth } from '@/hooks'
import { useRouter, usePathname } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Users, CreditCard, LogOut, Dumbbell, ShieldCheck, DollarSign } from 'lucide-react'

export default function GerenteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { profile, loading, signOut } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950">
        <div className="flex flex-col items-center gap-3">
          <Dumbbell className="size-10 text-yellow-500 animate-pulse" />
          <Loader2 className="size-6 text-zinc-400 animate-spin" />
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950">
        <div className="text-center">
          <p className="text-zinc-400 mb-4">Error al cargar el perfil</p>
          <Button
            onClick={() => signOut()}
            className="bg-yellow-500 text-zinc-900 hover:bg-yellow-400"
          >
            Cerrar sesión
          </Button>
        </div>
      </div>
    )
  }

  if (profile.activo === false) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950">
        <div className="text-center">
          <p className="text-red-400 text-lg font-semibold mb-2">Tu sesión está inhabilitada, no tienes acceso al sistema</p>
          <p className="text-zinc-500 mb-4">Comunícate con el administrador para más información.</p>
          <Button
            onClick={() => { signOut(); router.push('/login') }}
            className="bg-yellow-500 text-zinc-900 hover:bg-yellow-400"
          >
            Cerrar sesión
          </Button>
        </div>
      </div>
    )
  }

  if (profile.rol_id !== 1) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950">
        <div className="text-center">
          <p className="text-zinc-400 mb-4">No tienes acceso a esta sección</p>
          <Button
            onClick={() => router.push('/')}
            className="bg-yellow-500 text-zinc-900 hover:bg-yellow-400"
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
    { href: '/gerente/usuarios', label: 'Usuarios', icon: Users },
    { href: '/gerente/planes', label: 'Planes', icon: CreditCard },
    { href: '/gerente/ingresos', label: 'Ingresos', icon: DollarSign },
  ]

  return (
    <div className="min-h-screen bg-zinc-950">
      <header className="border-b border-zinc-800 bg-zinc-950/95 backdrop-blur sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <Link href="/gerente" className="flex items-center gap-2 group">
                <Dumbbell className="size-6 text-yellow-500 group-hover:rotate-12 transition-transform duration-200" />
                <span className="text-lg font-black tracking-tight text-white">
                  FULL<span className="text-yellow-500">FORMA</span>
                </span>
              </Link>
              <nav className="flex items-center gap-1">
                {navLinks.map(({ href, label, icon: Icon }) => {
                  const isActive = pathname.startsWith(href)
                  return (
                    <Link key={href} href={href}>
                      <Button
                        variant="ghost"
                        size="sm"
                        className={`transition-all duration-200 ${
                          isActive
                            ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                            : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                        }`}
                      >
                        <Icon className="size-4 mr-2" />
                        {label}
                      </Button>
                    </Link>
                  )
                })}
              </nav>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-zinc-800/50 border border-zinc-700">
                <ShieldCheck className="size-3.5 text-yellow-500" />
                <span className="text-zinc-300 text-sm font-medium">
                  {profile.nombre} {profile.apellido}
                </span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleSignOut}
                className="text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                title="Cerrar sesión"
              >
                <LogOut className="size-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  )
}
