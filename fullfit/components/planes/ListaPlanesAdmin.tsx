'use client'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Edit, Power, PowerOff, Trash2 } from 'lucide-react'
import { formatDate } from '@/lib/utils/dates'
import { BadgeEstadoPlan } from './BadgeEstadoPlan'
import { ConfirmarDesactivarPlan } from './ConfirmarDesactivarPlan'
import { ConfirmarEliminarPlan } from './ConfirmarEliminarPlan'
import { useState } from 'react'
import type { PlanAdmin } from '@/lib/supabase/queries/planes.types'

interface ListaPlanesAdminProps {
  planes: PlanAdmin[]
  loading?: boolean
  onEditar: (plan: PlanAdmin) => void
  onToggleEstado: (id: number, activo: boolean) => Promise<void>
  onEliminar: (id: number) => Promise<void>
}

export function ListaPlanesAdmin({ planes, loading, onEditar, onToggleEstado, onEliminar }: ListaPlanesAdminProps) {
  const [planConfirmar, setPlanConfirmar] = useState<{ id: number; nombre: string; activo: boolean } | null>(null)
  const [planEliminar, setPlanEliminar] = useState<{ id: number; nombre: string } | null>(null)

  if (loading) {
    return (
      <div className="rounded-lg border border-zinc-800 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-zinc-900">
              {['Nombre', 'Descripción', 'Precio', 'Duración', 'Estado', 'Creado', 'Acciones'].map(h => (
                <TableHead key={h} className="text-zinc-300">{h}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(5)].map((_, i) => (
              <TableRow key={i} className="border-zinc-800">
                {[...Array(7)].map((__, j) => (
                  <TableCell key={j}>
                    <div className="h-4 bg-zinc-800 rounded animate-pulse" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    )
  }

  if (planes.length === 0) {
    return (
      <div className="text-center py-12 text-zinc-400 rounded-lg border border-zinc-800 bg-zinc-900/30">
        <p className="text-lg font-medium">No hay planes configurados</p>
        <p className="text-sm text-zinc-500 mt-1">Crea un nuevo plan para comenzar</p>
      </div>
    )
  }

  const handleConfirm = async () => {
    if (!planConfirmar) return
    await onToggleEstado(planConfirmar.id, !planConfirmar.activo)
    setPlanConfirmar(null)
  }

  const handleConfirmEliminar = async () => {
    if (!planEliminar) return
    await onEliminar(planEliminar.id)
    setPlanEliminar(null)
  }

  const formatDuracion = (dias: number) => {
    if (dias === 365) return '1 año'
    if (dias === 30) return '1 mes'
    if (dias === 90) return '3 meses'
    return `${dias} días`
  }

  return (
    <>
      <div className="rounded-lg border border-zinc-800 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-zinc-900">
              <TableHead className="text-zinc-300">Nombre</TableHead>
              <TableHead className="text-zinc-300 hidden md:table-cell">Descripción</TableHead>
              <TableHead className="text-zinc-300">Precio</TableHead>
              <TableHead className="text-zinc-300">Duración</TableHead>
              <TableHead className="text-zinc-300">Estado</TableHead>
              <TableHead className="text-zinc-300 hidden lg:table-cell">Creado</TableHead>
              <TableHead className="text-zinc-300 text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {planes.map((plan) => (
              <TableRow key={plan.id} className="border-zinc-800 hover:bg-zinc-900/50">
                <TableCell className="text-white font-medium">
                  {plan.nombre}
                </TableCell>
                <TableCell className="text-zinc-300 text-sm hidden md:table-cell max-w-[200px] truncate">
                  {plan.descripcion || '—'}
                </TableCell>
                <TableCell className="text-zinc-300 font-mono text-sm">
                  S/ {plan.precio}
                </TableCell>
                <TableCell className="text-zinc-300 text-sm">
                  {formatDuracion(plan.duracion_dias)}
                </TableCell>
                <TableCell>
                  <BadgeEstadoPlan activo={plan.activo} />
                </TableCell>
                <TableCell className="text-zinc-400 text-sm hidden lg:table-cell">
                  {plan.creado_en ? formatDate(plan.creado_en.split('T')[0]) : '—'}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8 text-zinc-400 hover:text-white"
                      onClick={() => onEditar(plan)}
                      title="Editar"
                    >
                      <Edit className="size-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={`size-8 ${plan.activo ? 'text-red-400 hover:bg-red-500/10' : 'text-green-400 hover:bg-green-500/10'}`}
                      onClick={() => setPlanConfirmar({ id: plan.id, nombre: plan.nombre, activo: plan.activo })}
                      title={plan.activo ? 'Desactivar' : 'Activar'}
                    >
                      {plan.activo ? <PowerOff className="size-4" /> : <Power className="size-4" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8 text-red-400 hover:bg-red-500/10"
                      onClick={() => setPlanEliminar({ id: plan.id, nombre: plan.nombre })}
                      title="Eliminar"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <ConfirmarDesactivarPlan
        isOpen={!!planConfirmar}
        onClose={() => setPlanConfirmar(null)}
        onConfirm={handleConfirm}
        nombrePlan={planConfirmar?.nombre || ''}
        activo={planConfirmar?.activo || false}
      />

      <ConfirmarEliminarPlan
        isOpen={!!planEliminar}
        onClose={() => setPlanEliminar(null)}
        onConfirm={handleConfirmEliminar}
        nombrePlan={planEliminar?.nombre || ''}
      />
    </>
  )
}
