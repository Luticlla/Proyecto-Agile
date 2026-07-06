'use client'

import { useAuth } from '@/hooks'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Users, Building2, CreditCard, LogOut } from 'lucide-react'

export default function GerenteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { profile, loading, signOut } = useAuth()
  const router = useRouter()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="size-8 text-gray-400 animate-spin" />
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Error al cargar el perfil</p>
          <Button
            onClick={() => signOut()}
            className="bg-yellow-500 text-gray-900 hover:bg-yellow-400"
          >
            Cerrar sesión
          </Button>
        </div>
      </div>
    )
  }

  if (profile.rol_id !== 1) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <p className="text-gray-500 mb-4">No tienes acceso a esta sección</p>
          <Button
            onClick={() => router.push('/')}
            className="bg-yellow-500 text-gray-900 hover:bg-yellow-400"
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
      <header className="border-b border-zinc-800 bg-zinc-950">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Link href="/gerente" className="text-xl font-bold text-white">
                FullFit
              </Link>
              <nav className="flex items-center gap-4">
                <Link href="/gerente/usuarios">
                  <Button variant="ghost" className="text-zinc-300 hover:text-white hover:bg-zinc-800">
                    <Users className="size-4 mr-2" />
                    Usuarios del Sistema
                  </Button>
                </Link>
                <Link href="/gerente/sedes">
                  <Button variant="ghost" className="text-zinc-300 hover:text-white hover:bg-zinc-800">
                    <Building2 className="size-4 mr-2" />
                    Sedes
                  </Button>
                </Link>
                <Link href="/gerente/planes">
                  <Button variant="ghost" className="text-zinc-300 hover:text-white hover:bg-zinc-800">
                    <CreditCard className="size-4 mr-2" />
                    Planes
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
