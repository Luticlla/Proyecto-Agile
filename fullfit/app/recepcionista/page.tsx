'use client'

import { useAuth } from '@/hooks'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, CreditCard, TrendingUp } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function RecepcionistaDashboard() {
  const { profile } = useAuth()

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">
          Bienvenido, {profile?.nombre}
        </h1>
        <p className="text-zinc-400">
          Panel de control del recepcionista
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">
              Total Clientes
            </CardTitle>
            <Users className="size-4 text-zinc-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">--</div>
            <p className="text-xs text-zinc-500">
              Cargando...
            </p>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">
              Membresías Activas
            </CardTitle>
            <CreditCard className="size-4 text-zinc-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">--</div>
            <p className="text-xs text-zinc-500">
              Cargando...
            </p>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">
              Membresías por Vencer
            </CardTitle>
            <TrendingUp className="size-4 text-zinc-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">--</div>
            <p className="text-xs text-zinc-500">
              Próximos 7 días
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-lg text-white">Acciones Rápidas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/recepcionista/clientes">
              <Button className="w-full justify-start bg-zinc-800 hover:bg-zinc-700 text-white">
                <Users className="size-4 mr-2" />
                Gestionar Clientes
              </Button>
            </Link>
            <Link href="/recepcionista/membresias/nueva">
              <Button className="w-full justify-start bg-zinc-800 hover:bg-zinc-700 text-white">
                <CreditCard className="size-4 mr-2" />
                Nueva Membresía
              </Button>
            </Link>
            <Link href="/recepcionista/reportes">
              <Button className="w-full justify-start bg-zinc-800 hover:bg-zinc-700 text-white">
                <TrendingUp className="size-4 mr-2" />
                Ver Reportes
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-lg text-white">Membresías Próximas a Vencer</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-zinc-400 text-sm">
              No hay membresías próximas a vencer en los próximos 7 días.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}