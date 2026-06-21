'use client'

import { useAuth } from '@/hooks'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, CreditCard, AlertTriangle, Clock } from 'lucide-react'
import { useEffect, useState } from 'react'
import { BusquedaRapida } from '@/components/clientes'

interface ProximaAVencer {
  id: number
  nombre: string
  apellido: string
  plan: string
  dias_restantes: number
}

interface DashboardData {
  totalClientes: number
  membresiasActivas: number
  membresiasPorVencer: number
  proximasAVencer: ProximaAVencer[]
}

export default function RecepcionistaDashboard() {
  const { profile } = useAuth()
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const res = await fetch('/api/dashboard')
        if (res.ok) {
          const json = await res.json()
          setData(json)
        }
      } catch (error) {
        console.error('Error cargando dashboard:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchDashboard()
  }, [])

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">
            Bienvenido, {profile?.nombre}
          </h1>
          <p className="text-zinc-400">
            Panel de control del recepcionista
          </p>
        </div>
        <BusquedaRapida />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">
              Total Clientes
            </CardTitle>
            <Users className="size-4 text-zinc-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {loading ? '--' : data?.totalClientes ?? 0}
            </div>
            <p className="text-xs text-zinc-500">
              Usuarios registrados
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
            <div className="text-2xl font-bold text-[#ffdf00]">
              {loading ? '--' : data?.membresiasActivas ?? 0}
            </div>
            <p className="text-xs text-zinc-500">
              Con acceso vigente
            </p>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">
              Membresías por Vencer
            </CardTitle>
            <AlertTriangle className="size-4 text-zinc-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-400">
              {loading ? '--' : data?.membresiasPorVencer ?? 0}
            </div>
            <p className="text-xs text-zinc-500">
              Próximos 7 días
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-lg text-white">Membresías Próximas a Vencer</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-zinc-400 text-sm">Cargando...</p>
          ) : data?.proximasAVencer && data.proximasAVencer.length > 0 ? (
            <div className="space-y-3">
              {data.proximasAVencer.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-zinc-800/50 border border-zinc-700/50"
                >
                  <div className="flex items-center gap-3">
                    <div className="size-8 rounded-full bg-zinc-700 flex items-center justify-center">
                      <Clock className="size-4 text-zinc-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">
                        {item.nombre} {item.apellido}
                      </p>
                      <p className="text-xs text-zinc-400">{item.plan}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span
                      className={`text-sm font-semibold ${
                        item.dias_restantes <= 2
                          ? 'text-red-400'
                          : item.dias_restantes <= 5
                            ? 'text-orange-400'
                            : 'text-yellow-400'
                      }`}
                    >
                      {item.dias_restantes} {item.dias_restantes === 1 ? 'día' : 'días'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-zinc-400 text-sm">
              No hay membresías próximas a vencer en los próximos 7 días.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
