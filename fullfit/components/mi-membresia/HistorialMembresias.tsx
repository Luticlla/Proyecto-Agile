'use client'

import { cn } from '@/lib/utils'
import { formatDate } from '@/lib/utils/dates'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { History } from 'lucide-react'
import type { MembresiaConCliente } from '@/lib/supabase/queries/membresias.types'

type HistorialMembresiasProps = {
  historial: MembresiaConCliente[]
}

function getBadgeVariant(estado: string) {
  switch (estado) {
    case 'activa':
      return 'bg-green-500/20 text-green-400 border-green-500/30'
    case 'vencida':
      return 'bg-red-500/20 text-red-400 border-red-500/30'
    case 'cancelada':
      return 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30'
    case 'suspendida':
      return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
    default:
      return 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30'
  }
}

function getEstadoLabel(estado: string) {
  switch (estado) {
    case 'activa':
      return 'Activa'
    case 'vencida':
      return 'Vencida'
    case 'cancelada':
      return 'Cancelada'
    case 'suspendida':
      return 'Suspendida'
    default:
      return estado
  }
}

export function HistorialMembresias({ historial }: HistorialMembresiasProps) {
  if (historial.length === 0) {
    return (
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
            <History className="size-5 text-yellow-400" />
            Historial de Membresías
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-zinc-400 text-center py-4">No hay membresías registradas</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
          <History className="size-5 text-yellow-400" />
          Historial de Membresías
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {historial.map((membresia) => (
            <div
              key={membresia.id}
              className="flex items-center justify-between p-3 rounded-lg bg-zinc-800/50 border border-zinc-700/50"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-white">{membresia.plan_nombre}</span>
                  <Badge className={cn('border text-xs', getBadgeVariant(membresia.estado))}>
                    {getEstadoLabel(membresia.estado)}
                  </Badge>
                </div>
                <p className="text-sm text-zinc-400 mt-1">
                  {formatDate(membresia.fecha_inicio)} - {formatDate(membresia.fecha_fin)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-yellow-400">S/ {membresia.plan_precio}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
