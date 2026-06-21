'use client'

import { useState } from 'react'
import type { MembresiaConCliente } from '@/lib/supabase/queries/membresias.types'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Pause, Play, X, RefreshCw, Search } from 'lucide-react'
import { BadgeEstado } from './BadgeEstado'
import { BadgeDiasRestantes } from './BadgeDiasRestantes'
import { formatDate } from '@/lib/utils/dates'

type ListaMembresiasProps = {
  membresias: MembresiaConCliente[]
  loading?: boolean
  buscar?: string
  onBuscarChange?: (valor: string) => void
  onBuscar?: () => void
  onAccion?: (id: number, accion: 'cancelar' | 'pausar' | 'reactivar' | 'renovar') => void
  page?: number
  totalPages?: number
  onPageChange?: (page: number) => void
  limit?: number
  onLimitChange?: (limit: number) => void
}

export function ListaMembresias({
  membresias,
  loading = false,
  buscar = '',
  onBuscarChange,
  onBuscar,
  onAccion,
  page = 1,
  totalPages = 1,
  onPageChange,
  limit = 10,
  onLimitChange
}: ListaMembresiasProps) {
  const [inputValue, setInputValue] = useState(buscar)

  const handleSearch = () => {
    onBuscarChange?.(inputValue)
    onBuscar?.()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  if (loading) {
    return (
      <div className="text-center py-8 text-zinc-400">
        Cargando membresías...
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-1 gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-500 size-4" />
            <Input
              placeholder="Buscar por nombre o DNI..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              className="pl-9 bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-500"
            />
          </div>
          <Button
            onClick={handleSearch}
            variant="secondary"
            className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300"
          >
            Buscar
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-zinc-400">Mostrar:</span>
          <select
            value={limit}
            onChange={(e) => onLimitChange?.(Number(e.target.value))}
            className="bg-zinc-900 border border-zinc-800 rounded-md px-2 py-1 text-sm text-zinc-300"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>

      {membresias.length === 0 ? (
        <div className="text-center py-8 text-zinc-400">
          No se encontraron membresías
        </div>
      ) : (
        <div className="rounded-lg border border-zinc-800 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-zinc-900">
                <TableHead className="text-zinc-300">Cliente</TableHead>
                <TableHead className="text-zinc-300">DNI</TableHead>
                <TableHead className="text-zinc-300">Plan</TableHead>
                <TableHead className="text-zinc-300">Estado</TableHead>
                <TableHead className="text-zinc-300">Inicio</TableHead>
                <TableHead className="text-zinc-300">Vencimiento</TableHead>
                <TableHead className="text-zinc-300">Restante</TableHead>
                <TableHead className="text-zinc-300 text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {membresias.map((membresia) => (
                <TableRow key={membresia.id} className="border-zinc-800 hover:bg-zinc-900/50">
                  <TableCell className="text-white font-medium">
                    {membresia.cliente_nombre} {membresia.cliente_apellido}
                  </TableCell>
                  <TableCell className="text-zinc-300">
                    {membresia.cliente_dni || '-'}
                  </TableCell>
                  <TableCell className="text-zinc-300">
                    {membresia.plan_nombre}
                  </TableCell>
                  <TableCell>
                    <BadgeEstado estado={membresia.estado} />
                  </TableCell>
                  <TableCell className="text-zinc-300 text-sm">
                    {formatDate(membresia.fecha_inicio)}
                  </TableCell>
                  <TableCell className="text-zinc-300 text-sm">
                    {formatDate(membresia.fecha_fin)}
                  </TableCell>
                  <TableCell>
                    <BadgeDiasRestantes
                      diasRestantes={membresia.dias_restantes}
                      estado={membresia.estado}
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      {membresia.estado === 'activa' && (
                        <>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-yellow-400 hover:text-yellow-300 hover:bg-yellow-500/10"
                            onClick={() => onAccion?.(membresia.id, 'pausar')}
                            title="Pausar"
                          >
                            <Pause className="size-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                            onClick={() => onAccion?.(membresia.id, 'cancelar')}
                            title="Cancelar"
                          >
                            <X className="size-4" />
                          </Button>
                          {membresia.dias_restantes <= 7 && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-green-400 hover:text-green-300 hover:bg-green-500/10"
                              onClick={() => onAccion?.(membresia.id, 'renovar')}
                              title="Renovar"
                            >
                              <RefreshCw className="size-4" />
                            </Button>
                          )}
                        </>
                      )}
                      {membresia.estado === 'suspendida' && (
                        <>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-green-400 hover:text-green-300 hover:bg-green-500/10"
                            onClick={() => onAccion?.(membresia.id, 'reactivar')}
                            title="Reactivar"
                          >
                            <Play className="size-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                            onClick={() => onAccion?.(membresia.id, 'cancelar')}
                            title="Cancelar"
                          >
                            <X className="size-4" />
                          </Button>
                        </>
                      )}
                      {membresia.estado === 'cancelada' && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-green-400 hover:text-green-300 hover:bg-green-500/10"
                          onClick={() => onAccion?.(membresia.id, 'reactivar')}
                          title="Reactivar"
                        >
                          <Play className="size-4" />
                        </Button>
                      )}
                      {membresia.estado === 'vencida' && (
                        <>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-green-400 hover:text-green-300 hover:bg-green-500/10"
                            onClick={() => onAccion?.(membresia.id, 'renovar')}
                            title="Renovar"
                          >
                            <RefreshCw className="size-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-yellow-400 hover:text-yellow-300 hover:bg-yellow-500/10"
                            onClick={() => onAccion?.(membresia.id, 'reactivar')}
                            title="Reactivar"
                          >
                            <Play className="size-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-zinc-400">
            Página {page} de {totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange?.(page - 1)}
              disabled={page <= 1}
              className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
            >
              Anterior
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange?.(page + 1)}
              disabled={page >= totalPages}
              className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
            >
              Siguiente
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
