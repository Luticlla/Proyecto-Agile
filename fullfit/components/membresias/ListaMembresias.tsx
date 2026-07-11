'use client'

import { useState } from 'react'
import type { MembresiaConCliente, EstadoMembresia } from '@/lib/supabase/queries/membresias.types'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
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
  estado?: EstadoMembresia
  onEstadoChange?: (estado: EstadoMembresia) => void
  onAccion?: (id: number, accion: 'cancelar' | 'pausar' | 'reactivar' | 'renovar', usuarioId?: string) => void
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
  estado = 'todos',
  onEstadoChange,
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
        <div className="flex flex-1 gap-2 w-full sm:w-auto flex-wrap">
          <div className="relative flex-1 min-w-[200px] max-w-xs">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 size-4" />
            <Input
              placeholder="Buscar por nombre o DNI..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              className="pl-9 bg-black border-white/10 text-white placeholder:text-white/40 font-mono text-xs"
            />
          </div>
          <Select value={estado} onValueChange={(val) => onEstadoChange?.(val as EstadoMembresia)}>
            <SelectTrigger className="w-36 bg-black border-white/10 text-white font-mono text-xs uppercase">
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent className="bg-black border-white/10">
              <SelectItem value="todos" className="text-white hover:bg-white/5 font-mono text-xs uppercase">Todos</SelectItem>
              <SelectItem value="activas" className="text-white hover:bg-white/5 font-mono text-xs uppercase">Activas</SelectItem>
              <SelectItem value="por_vencer" className="text-white hover:bg-white/5 font-mono text-xs uppercase">Por Vencer</SelectItem>
              <SelectItem value="vencidas" className="text-white hover:bg-white/5 font-mono text-xs uppercase">Vencidas</SelectItem>
              <SelectItem value="suspendidas" className="text-white hover:bg-white/5 font-mono text-xs uppercase">Suspendidas</SelectItem>
              <SelectItem value="canceladas" className="text-white hover:bg-white/5 font-mono text-xs uppercase">Canceladas</SelectItem>
            </SelectContent>
          </Select>
          <Button
            onClick={handleSearch}
            variant="outline"
            className="border-white/10 text-white hover:bg-white/5 font-mono text-xs uppercase"
          >
            Buscar
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] text-white/40 font-mono uppercase tracking-wider">Mostrar:</span>
          <Select value={String(limit)} onValueChange={(val) => onLimitChange?.(Number(val))}>
            <SelectTrigger className="w-20 h-8 border-white/10 bg-black text-white font-mono text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-black border-white/10">
              <SelectItem value="10" className="text-white hover:bg-white/5 font-mono text-xs">10</SelectItem>
              <SelectItem value="25" className="text-white hover:bg-white/5 font-mono text-xs">25</SelectItem>
              <SelectItem value="50" className="text-white hover:bg-white/5 font-mono text-xs">50</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {membresias.length === 0 ? (
        <div className="text-center py-8 text-zinc-400">
          No se encontraron membresías
        </div>
      ) : (
        <div className="rounded-lg border border-white/10 overflow-hidden bg-black">
          <Table>
            <TableHeader>
              <TableRow className="border-white/10 hover:bg-transparent">
                <TableHead className="text-white/60 font-mono text-[10px] uppercase tracking-widest">Cliente</TableHead>
                <TableHead className="text-white/60 font-mono text-[10px] uppercase tracking-widest">DNI</TableHead>
                <TableHead className="text-white/60 font-mono text-[10px] uppercase tracking-widest">Plan</TableHead>
                <TableHead className="text-white/60 font-mono text-[10px] uppercase tracking-widest">Estado</TableHead>
                <TableHead className="text-white/60 font-mono text-[10px] uppercase tracking-widest">Inicio</TableHead>
                <TableHead className="text-white/60 font-mono text-[10px] uppercase tracking-widest">Vencimiento</TableHead>
                <TableHead className="text-white/60 font-mono text-[10px] uppercase tracking-widest">Restante</TableHead>
                <TableHead className="text-white/60 font-mono text-[10px] uppercase tracking-widest text-right">Acciones</TableHead>
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
                              onClick={() => onAccion?.(membresia.id, 'renovar', membresia.usuario_id)}
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
                            onClick={() => onAccion?.(membresia.id, 'renovar', membresia.usuario_id)}
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
          <p className="text-[10px] text-white/40 font-mono uppercase tracking-wider">
            Página {page} de {totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange?.(page - 1)}
              disabled={page <= 1}
              className="border-white/10 text-white/40 hover:bg-white/5 hover:text-white font-mono text-xs uppercase"
            >
              Anterior
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange?.(page + 1)}
              disabled={page >= totalPages}
              className="border-white/10 text-white/40 hover:bg-white/5 hover:text-white font-mono text-xs uppercase"
            >
              Siguiente
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
