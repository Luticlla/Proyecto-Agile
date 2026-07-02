'use client'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Edit, Power, PowerOff, Trash2 } from 'lucide-react'
import type { SedeAdmin } from '@/lib/supabase/queries/sedes.types'
import { ConfirmarDesactivarSede } from './ConfirmarDesactivarSede'
import { ConfirmarEliminarSede } from './ConfirmarEliminarSede'
import { useState } from 'react'

interface ListaSedesAdminProps {
  sedes: SedeAdmin[]
  loading?: boolean
  onEditar: (sede: SedeAdmin) => void
  onToggleEstado: (id: number, estado: string) => Promise<void>
  onEliminar: (id: number) => Promise<void>
}

export function ListaSedesAdmin({ sedes, loading, onEditar, onToggleEstado, onEliminar }: ListaSedesAdminProps) {
  const [sedeConfirmar, setSedeConfirmar] = useState<{ id: number; nombre: string; estado: string } | null>(null)
  const [sedeEliminar, setSedeEliminar] = useState<{ id: number; nombre: string } | null>(null)

  if (loading) {
    return (
      <div className="rounded-lg border border-zinc-800 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-zinc-900">
              {['Nombre', 'Dirección', 'Teléfono', 'Estado', 'Horario LV', 'Horario Sáb', 'Acciones'].map(h => (
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

  if (sedes.length === 0) {
    return (
      <div className="text-center py-12 text-zinc-400 rounded-lg border border-zinc-800 bg-zinc-900/30">
        <p className="text-lg font-medium">Sin resultados</p>
        <p className="text-sm text-zinc-500 mt-1">No se encontraron sedes con los filtros actuales</p>
      </div>
    )
  }

  const handleConfirm = async () => {
    if (!sedeConfirmar) return
    const nuevoEstado = sedeConfirmar.estado === 'activa' ? 'inactiva' : 'activa'
    await onToggleEstado(sedeConfirmar.id, nuevoEstado)
    setSedeConfirmar(null)
  }

  const handleConfirmEliminar = async () => {
    if (!sedeEliminar) return
    await onEliminar(sedeEliminar.id)
    setSedeEliminar(null)
  }

  return (
    <>
      <div className="rounded-lg border border-zinc-800 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-zinc-900">
              <TableHead className="text-zinc-300">Nombre</TableHead>
              <TableHead className="text-zinc-300 hidden md:table-cell">Dirección</TableHead>
              <TableHead className="text-zinc-300">Teléfono</TableHead>
              <TableHead className="text-zinc-300">Estado</TableHead>
              <TableHead className="text-zinc-300 hidden lg:table-cell">Horario LV</TableHead>
              <TableHead className="text-zinc-300 hidden lg:table-cell">Horario Sáb</TableHead>
              <TableHead className="text-zinc-300 hidden lg:table-cell">Horario Dom</TableHead>
              <TableHead className="text-zinc-300 text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sedes.map((sede) => (
              <TableRow key={sede.id} className="border-zinc-800 hover:bg-zinc-900/50">
                <TableCell className="text-white font-medium">
                  {sede.nombre}
                </TableCell>
                <TableCell className="text-zinc-300 text-sm hidden md:table-cell max-w-[200px] truncate">
                  {sede.direccion}
                </TableCell>
                <TableCell className="text-zinc-300 text-sm">
                  {sede.telefono}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={sede.estado === 'activa' ? 'default' : 'secondary'}
                    className={sede.estado === 'activa'
                      ? 'bg-green-500/20 text-green-400 border-green-500/30'
                      : 'bg-red-500/20 text-red-400 border-red-500/30'
                    }
                  >
                    {sede.estado === 'activa' ? 'Activa' : 'Inactiva'}
                  </Badge>
                </TableCell>
                <TableCell className="text-zinc-300 text-sm hidden lg:table-cell">
                  {sede.apertura_lv} - {sede.cierre_lv}
                </TableCell>
                <TableCell className="text-zinc-300 text-sm hidden lg:table-cell">
                  {sede.apertura_sab} - {sede.cierre_sab}
                </TableCell>
                <TableCell className="text-zinc-300 text-sm hidden lg:table-cell">
                  {sede.apertura_dom && sede.cierre_dom
                    ? `${sede.apertura_dom} - ${sede.cierre_dom}`
                    : 'Cerrado'
                  }
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8 text-zinc-400 hover:text-white"
                      onClick={() => onEditar(sede)}
                      title="Editar"
                    >
                      <Edit className="size-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={`size-8 ${sede.estado === 'activa' ? 'text-red-400 hover:bg-red-500/10' : 'text-green-400 hover:bg-green-500/10'}`}
                      onClick={() => setSedeConfirmar({ id: sede.id, nombre: sede.nombre, estado: sede.estado })}
                      title={sede.estado === 'activa' ? 'Desactivar' : 'Activar'}
                    >
                      {sede.estado === 'activa' ? <PowerOff className="size-4" /> : <Power className="size-4" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8 text-red-400 hover:bg-red-500/10"
                      onClick={() => setSedeEliminar({ id: sede.id, nombre: sede.nombre })}
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

      <ConfirmarDesactivarSede
        isOpen={!!sedeConfirmar}
        onClose={() => setSedeConfirmar(null)}
        onConfirm={handleConfirm}
        nombreSede={sedeConfirmar?.nombre || ''}
        activa={sedeConfirmar?.estado === 'activa'}
      />

      <ConfirmarEliminarSede
        isOpen={!!sedeEliminar}
        onClose={() => setSedeEliminar(null)}
        onConfirm={handleConfirmEliminar}
        nombreSede={sedeEliminar?.nombre || ''}
      />
    </>
  )
}
