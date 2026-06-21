'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CreditCard, Calendar, Clock } from 'lucide-react'
import type { MembresiaDetalle } from '@/lib/supabase/queries/clientes.types'
import { formatDate } from '@/lib/utils/dates'

type SeccionMembresiaProps = {
  membresia: MembresiaDetalle | null
  loading?: boolean
}

function BadgeEstado({ estado }: { estado: string }) {
  const config: Record<string, { label: string; className: string }> = {
    activa: { label: 'Activa', className: 'bg-green-500/20 text-green-400 border-green-500/30' },
    vencida: { label: 'Vencida', className: 'bg-red-500/20 text-red-400 border-red-500/30' },
    cancelada: { label: 'Cancelada', className: 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30' },
    suspendida: { label: 'Suspendida', className: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
  }
  const { label, className } = config[estado] || config.cancelada
  return <Badge variant="outline" className={className}>{label}</Badge>
}

function diasRestantesColor(dias: number): string {
  if (dias <= 7) return 'text-red-400'
  if (dias <= 30) return 'text-yellow-400'
  return 'text-green-400'
}

export function SeccionMembresia({ membresia, loading }: SeccionMembresiaProps) {
  if (loading) {
    return (
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg text-white flex items-center gap-2">
            <CreditCard className="size-5 text-zinc-400" />
            Membresía
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-zinc-400 text-sm">Cargando información de membresía...</p>
        </CardContent>
      </Card>
    )
  }

  if (!membresia) {
    return (
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg text-white flex items-center gap-2">
            <CreditCard className="size-5 text-zinc-400" />
            Membresía
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3 p-4 rounded-lg bg-zinc-800/50 border border-zinc-700/50">
            <div className="size-10 rounded-full bg-zinc-700 flex items-center justify-center">
              <CreditCard className="size-5 text-zinc-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-300">Sin membresía activa</p>
              <p className="text-xs text-zinc-500">Este cliente no tiene una suscripción registrada</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg text-white flex items-center gap-2">
            <CreditCard className="size-5 text-zinc-400" />
            Membresía
          </CardTitle>
          <BadgeEstado estado={membresia.estado} />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-4 rounded-lg bg-zinc-800/50 border border-zinc-700/50">
          <p className="text-sm font-semibold text-white mb-1">{membresia.plan_nombre}</p>
          <p className="text-xs text-zinc-400">
            S/ {membresia.plan_precio.toFixed(2)} — {membresia.plan_duracion_dias} días
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="size-4 text-zinc-500" />
            <div>
              <p className="text-xs text-zinc-500">Inicio</p>
              <p className="text-sm text-zinc-300">{formatDate(membresia.fecha_inicio)}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="size-4 text-zinc-500" />
            <div>
              <p className="text-xs text-zinc-500">Vencimiento</p>
              <p className="text-sm text-zinc-300">{formatDate(membresia.fecha_fin)}</p>
            </div>
          </div>
        </div>

        {membresia.estado === 'activa' && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-zinc-800/30 border border-zinc-700/30">
            <Clock className="size-4 text-zinc-500" />
            <p className={`text-sm font-medium ${diasRestantesColor(membresia.dias_restantes)}`}>
              {membresia.dias_restantes} {membresia.dias_restantes === 1 ? 'día restante' : 'días restantes'}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
