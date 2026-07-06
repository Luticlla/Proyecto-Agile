'use client'

import Link from 'next/link'
import { cn } from '@/lib/utils'
import { formatDate } from '@/lib/utils/dates'
import { ContadorDias } from './ContadorDias'
import { BarraProgreso } from './BarraProgreso'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CreditCard, Clock, Calendar, AlertTriangle } from 'lucide-react'
import type { MembresiaConCliente } from '@/lib/supabase/queries/membresias.types'

type TarjetaMembresiaProps = {
  membresia: MembresiaConCliente
  estado: 'activa' | 'vencida'
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

function getCardGradient(estado: string): string {
  if (estado === 'activa') return 'from-green-500/10 to-zinc-900'
  return 'from-red-500/10 to-zinc-900'
}

export function TarjetaMembresia({ membresia, estado }: TarjetaMembresiaProps) {
  const diasRestantes = membresia.dias_restantes
  const mostrarRenovar = estado === 'activa' && diasRestantes <= 7

  return (
    <Card className={cn('bg-gradient-to-br border-zinc-800', getCardGradient(estado))}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
            <CreditCard className="size-5 text-yellow-400" />
            Tu Membresía
          </CardTitle>
          <Badge className={cn('border', getBadgeVariant(estado))}>
            {estado === 'activa' ? 'Activa' : 'Vencida'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Información del plan */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-sm text-zinc-400">Plan</p>
            <p className="text-lg font-semibold text-white">{membresia.plan_nombre}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-zinc-400">Precio</p>
            <p className="text-lg font-semibold text-yellow-400">S/ {membresia.plan_precio}</p>
          </div>
        </div>

        {/* Fechas */}
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
              <p className={cn('text-sm', estado === 'vencida' ? 'text-red-400' : 'text-zinc-300')}>
                {formatDate(membresia.fecha_fin)}
              </p>
            </div>
          </div>
        </div>

        {/* Contador de días */}
        <div className="flex flex-col items-center py-4">
          <ContadorDias dias={diasRestantes} />
        </div>

        {/* Barra de progreso */}
        <BarraProgreso
          diasRestantes={diasRestantes}
          duracionTotal={membresia.plan_duracion_dias}
        />

        {/* Botón renovar */}
        {mostrarRenovar && (
          <div className="pt-4">
            <Link href={`/pasarelapago?plan=${membresia.plan_id}`} className="w-full">
              <Button className="w-full bg-yellow-400 text-zinc-950 hover:bg-yellow-300 font-bold">
                <AlertTriangle className="size-4 mr-2" />
                Renovar Membresía
              </Button>
            </Link>
          </div>
        )}

        {estado === 'vencida' && (
          <div className="pt-4">
            <Link href={`/pasarelapago?plan=${membresia.plan_id}`} className="w-full">
              <Button className="w-full bg-red-500 text-white hover:bg-red-400 font-bold">
                <Clock className="size-4 mr-2" />
                Renovar Ahora
              </Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
