'use client'

import { useAuth } from '@/hooks'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Users, CreditCard, BarChart3, LogOut } from 'lucide-react'

export default function RecepcionistaLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { profile, loading, signOut } = useAuth()
  const router = useRouter()

  // El proxy ya valida el rol server-side, solo mostramos loading mientras carga
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950">
        <Loader2 className="size-8 text-zinc-400 animate-spin" />
      </div>
    )
  }

  // Si no hay perfil después de cargar, algo falló
  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950">
        <div className="text-center">
          <p className="text-zinc-400 mb-4">Error al cargar el perfil</p>
          <Button
            onClick={() => signOut()}
            className="bg-yellow-400 text-zinc-950 hover:bg-yellow-300"
          >
            Cerrar sesión
          </Button>
        </div>
      </div>
    )
  }

  // Si el proxy falló y un usuario no-recepcionista llegó aquí
  if (profile.rol_id !== 1 && profile.rol_id !== 2) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950">
        <div className="text-center">
          <p className="text-zinc-400 mb-4">No tienes acceso a esta sección</p>
          <Button
            onClick={() => router.push('/')}
            className="bg-yellow-400 text-zinc-950 hover:bg-yellow-300"
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
    <div className="min-h-screen bg-zinc-950">
      <header className="border-b border-zinc-800 bg-zinc-900">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Link href="/recepcionista" className="text-xl font-bold text-yellow-400">
                FullFit Admin
              </Link>
              <nav className="flex items-center gap-4">
                <Link href="/recepcionista/clientes">
                  <Button variant="ghost" className="text-zinc-300 hover:text-white hover:bg-zinc-800">
                    <Users className="size-4 mr-2" />
                    Clientes
                  </Button>
                </Link>
                <Link href="/recepcionista/membresias">
                  <Button variant="ghost" className="text-zinc-300 hover:text-white hover:bg-zinc-800">
                    <CreditCard className="size-4 mr-2" />
                    Membresías
                  </Button>
                </Link>
                <Link href="/recepcionista/reportes">
                  <Button variant="ghost" className="text-zinc-300 hover:text-white hover:bg-zinc-800">
                    <BarChart3 className="size-4 mr-2" />
                    Reportes
                  </Button>
                </Link>
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-zinc-400 text-sm">
                {profile.nombre} {profile.apellido}
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleSignOut}
                className="text-zinc-400 hover:text-white"
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