'use client'

import { useState } from 'react'
import type { ClienteConMembresia } from '@/lib/supabase/queries/clientes.types'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Eye, Edit, CreditCard, RefreshCw, ArrowUp, ArrowDown, ChevronsUpDown } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import Link from 'next/link'
import { BadgeDiasRestantes } from './BadgeDiasRestantes'
import { formatDate } from '@/lib/utils/dates'

type SortKey = 'nombre' | 'dni' | 'creado_en' | 'membresia_plan_nombre' | 'membresia_fecha_fin' | 'membresia_dias_restantes' | 'membresia_estado'
type SortDir = 'asc' | 'desc'

type ListaClientesProps = {
  clientes: ClienteConMembresia[]
  loading?: boolean
  showMembresia?: boolean
  onRegistrarMembresia?: (clienteId: string) => void
  onRenovarMembresia?: (clienteId: string) => void
}

function BadgeMembresia({ estado, fechaFin, diasRestantes, planNombre }: {
  estado?: string
  fechaFin?: string
  diasRestantes?: number
  planNombre?: string
}) {
  const tooltipContent = planNombre
    ? `${planNombre}${fechaFin ? ` · Vence: ${formatDate(fechaFin)}` : ''}`
    : undefined

  const badge = (() => {
    if (!estado) {
      return (
        <Badge variant="secondary" className="bg-zinc-500/20 text-zinc-400 border-zinc-500/30">
          Sin membresía
        </Badge>
      )
    }
    if (estado === 'activa' && diasRestantes !== undefined && diasRestantes >= 0) {
      if (diasRestantes === 0) {
        return (
          <Badge variant="default" className="bg-red-500/20 text-red-400 border-red-500/30">
            Venció hoy
          </Badge>
        )
      }
      if (diasRestantes <= 7) {
        return (
          <Badge variant="default" className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
            Por vencer
          </Badge>
        )
      }
      return (
        <Badge variant="default" className="bg-green-500/20 text-green-400 border-green-500/30">
          Activa
        </Badge>
      )
    }
    if (estado === 'vencida' || (fechaFin && new Date(fechaFin) < new Date())) {
      return (
        <Badge variant="default" className="bg-red-500/20 text-red-400 border-red-500/30">
          Vencida
        </Badge>
      )
    }
    return (
      <Badge variant="secondary" className="bg-zinc-500/20 text-zinc-400 border-zinc-500/30">
        {estado}
      </Badge>
    )
  })()

  if (tooltipContent) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="cursor-default">{badge}</span>
          </TooltipTrigger>
          <TooltipContent side="top" className="bg-zinc-800 border-zinc-700 text-zinc-200 text-xs">
            {tooltipContent}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  return badge
}

function SortIcon({ col, sortKey, sortDir }: { col: SortKey; sortKey: SortKey; sortDir: SortDir }) {
  if (col !== sortKey) return <ChevronsUpDown className="size-3 text-zinc-600 ml-1" />
  if (sortDir === 'asc') return <ArrowUp className="size-3 text-zinc-300 ml-1" />
  return <ArrowDown className="size-3 text-zinc-300 ml-1" />
}

function sortClientes(clientes: ClienteConMembresia[], key: SortKey, dir: SortDir): ClienteConMembresia[] {
  return [...clientes].sort((a, b) => {
    let va: string | number | boolean | null | undefined
    let vb: string | number | boolean | null | undefined

    switch (key) {
      case 'nombre': va = `${a.nombre} ${a.apellido}`; vb = `${b.nombre} ${b.apellido}`; break
      case 'dni': va = a.dni ?? ''; vb = b.dni ?? ''; break
      case 'creado_en': va = a.creado_en; vb = b.creado_en; break
      case 'membresia_plan_nombre': va = a.membresia_plan_nombre ?? ''; vb = b.membresia_plan_nombre ?? ''; break
      case 'membresia_fecha_fin': va = a.membresia_fecha_fin ?? ''; vb = b.membresia_fecha_fin ?? ''; break
      case 'membresia_dias_restantes': va = a.membresia_dias_restantes ?? -Infinity; vb = b.membresia_dias_restantes ?? -Infinity; break
      case 'membresia_estado': va = a.membresia_estado ?? ''; vb = b.membresia_estado ?? ''; break
    }

    if (va === vb) return 0
    const cmp = (va ?? '') < (vb ?? '') ? -1 : 1
    return dir === 'asc' ? cmp : -cmp
  })
}

export function ListaClientes({
  clientes,
  loading,
  showMembresia = false,
  onRegistrarMembresia,
  onRenovarMembresia,
}: ListaClientesProps) {
  const [sortKey, setSortKey] = useState<SortKey>('nombre')
  const [sortDir, setSortDir] = useState<SortDir>('asc')

  function handleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  if (loading) {
    return (
      <div className="rounded-lg border border-zinc-800 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-zinc-900">
              {['Nombre', 'DNI', 'Teléfono', 'F. Registro', 'Plan', 'Vencimiento', 'Días', 'Membresía', 'Acciones'].map(h => (
                <TableHead key={h} className="text-zinc-300">{h}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(5)].map((_, i) => (
              <TableRow key={i} className="border-zinc-800">
                {[...Array(9)].map((__, j) => (
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

  if (clientes.length === 0) {
    return (
      <div className="text-center py-12 text-zinc-400 rounded-lg border border-zinc-800 bg-zinc-900/30">
        <p className="text-lg font-medium">Sin resultados</p>
        <p className="text-sm text-zinc-500 mt-1">No se encontraron clientes con los filtros actuales</p>
      </div>
    )
  }

  const clientesOrdenados = sortClientes(clientes, sortKey, sortDir)

  function SortableHead({ col, label, className }: { col: SortKey; label: string; className?: string }) {
    return (
      <TableHead
        className={`text-zinc-300 cursor-pointer select-none hover:text-white transition-colors ${className ?? ''}`}
        onClick={() => handleSort(col)}
      >
        <span className="inline-flex items-center">
          {label}
          <SortIcon col={col} sortKey={sortKey} sortDir={sortDir} />
        </span>
      </TableHead>
    )
  }

  return (
    <div className="rounded-lg border border-zinc-800 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-zinc-900">
            <SortableHead col="nombre" label="Nombre" />
            <SortableHead col="dni" label="DNI" />
            <TableHead className="text-zinc-300 hidden md:table-cell">Email</TableHead>
            <TableHead className="text-zinc-300">Teléfono</TableHead>
            <SortableHead col="creado_en" label="F. Registro" className="hidden lg:table-cell text-right" />
            {showMembresia && (
              <>
                <SortableHead col="membresia_plan_nombre" label="Plan" className="hidden lg:table-cell" />
                <SortableHead col="membresia_fecha_fin" label="Vencimiento" className="hidden xl:table-cell text-right" />
                <SortableHead col="membresia_dias_restantes" label="Días" className="text-right" />
                <SortableHead col="membresia_estado" label="Membresía" />
              </>
            )}
            <TableHead className="text-zinc-300 text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clientesOrdenados.map((cliente) => {
            const isVencidaHoy = cliente.membresia_dias_restantes === 0 && cliente.membresia_estado === 'activa'
            const isVencida = cliente.membresia_estado === 'vencida' || (cliente.membresia_dias_restantes !== undefined && cliente.membresia_dias_restantes < 0)
            const rowClass = isVencidaHoy
              ? 'border-zinc-800 bg-red-500/5 hover:bg-red-500/10'
              : isVencida
                ? 'border-zinc-800 bg-red-500/[0.03] hover:bg-zinc-900/50'
                : 'border-zinc-800 hover:bg-zinc-900/50'

            const puedeRegistrar = !cliente.membresia_estado ||
              cliente.membresia_estado === 'cancelada' ||
              cliente.membresia_estado === 'vencida'

            const puedeRenovar = cliente.membresia_estado === 'activa' &&
              cliente.membresia_dias_restantes !== undefined &&
              cliente.membresia_dias_restantes <= 7

            return (
              <TableRow key={cliente.id} className={rowClass}>
                <TableCell className="text-white font-medium">
                  {cliente.nombre} {cliente.apellido}
                </TableCell>
                <TableCell className="text-zinc-300 font-mono text-sm">
                  {cliente.dni || '—'}
                </TableCell>
                <TableCell className="text-zinc-300 text-sm hidden md:table-cell">
                  {cliente.email || '—'}
                </TableCell>
                <TableCell className="text-zinc-300 text-sm">
                  {cliente.telefono || '—'}
                </TableCell>
                <TableCell className="text-zinc-400 text-sm text-right hidden lg:table-cell">
                  {cliente.creado_en ? formatDate(cliente.creado_en.split('T')[0]) : '—'}
                </TableCell>
                {showMembresia && (
                  <>
                    <TableCell className="text-zinc-300 text-sm hidden lg:table-cell">
                      {cliente.membresia_plan_nombre || <span className="text-zinc-600">Sin plan</span>}
                    </TableCell>
                    <TableCell className="text-zinc-400 text-sm text-right hidden xl:table-cell">
                      {cliente.membresia_fecha_fin ? formatDate(cliente.membresia_fecha_fin) : '—'}
                    </TableCell>
                    <TableCell className="text-right">
                      <BadgeDiasRestantes
                        dias={cliente.membresia_dias_restantes}
                        estado={cliente.membresia_estado}
                      />
                    </TableCell>
                    <TableCell>
                      <BadgeMembresia
                        estado={cliente.membresia_estado}
                        fechaFin={cliente.membresia_fecha_fin}
                        diasRestantes={cliente.membresia_dias_restantes}
                        planNombre={cliente.membresia_plan_nombre}
                      />
                    </TableCell>
                  </>
                )}
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    {puedeRenovar && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-8 text-yellow-400 hover:text-yellow-300 hover:bg-yellow-500/10"
                        onClick={() => onRenovarMembresia?.(cliente.id)}
                        title="Renovar Membresía"
                      >
                        <RefreshCw className="size-4" />
                      </Button>
                    )}
                    {puedeRegistrar && !puedeRenovar && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-8 text-green-400 hover:text-green-300 hover:bg-green-500/10"
                        onClick={() => onRegistrarMembresia?.(cliente.id)}
                        title="Registrar Membresía"
                      >
                        <CreditCard className="size-4" />
                      </Button>
                    )}
                    <Link href={`/recepcionista/clientes/${cliente.id}`}>
                      <Button variant="ghost" size="icon" className="size-8 text-zinc-400 hover:text-white">
                        <Eye className="size-4" />
                      </Button>
                    </Link>
                    <Link href={`/recepcionista/clientes/${cliente.id}?edit=true`}>
                      <Button variant="ghost" size="icon" className="size-8 text-zinc-400 hover:text-white">
                        <Edit className="size-4" />
                      </Button>
                    </Link>
                  </div>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}