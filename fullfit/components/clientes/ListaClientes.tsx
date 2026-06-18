'use client'

import { ProfileWithEmail } from '@/lib/supabase/types'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Eye, Edit } from 'lucide-react'
import Link from 'next/link'

type ClienteConMembresia = ProfileWithEmail & {
  membresia_estado?: string
  membresia_fecha_fin?: string
}

type ListaClientesProps = {
  clientes: ClienteConMembresia[]
  loading?: boolean
  showMembresia?: boolean
}

function BadgeMembresia({ estado, fechaFin }: { estado?: string; fechaFin?: string }) {
  if (!estado) {
    return (
      <Badge variant="secondary" className="bg-zinc-500/20 text-zinc-400 border-zinc-500/30">
        Sin membresía
      </Badge>
    )
  }

  if (estado === 'activa') {
    return (
      <Badge variant="default" className="bg-green-500/20 text-green-400 border-green-500/30">
        Activa
      </Badge>
    )
  }

  if (estado === 'vencida' || (fechaFin && new Date(fechaFin) < new Date())) {
    const fechaFormateada = fechaFin
      ? new Date(fechaFin).toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' })
      : ''
    return (
      <div className="flex flex-col gap-1">
        <Badge variant="default" className="bg-red-500/20 text-red-400 border-red-500/30 w-fit">
          Vencida
        </Badge>
        {fechaFormateada && (
          <span className="text-xs text-zinc-500">{fechaFormateada}</span>
        )}
      </div>
    )
  }

  return (
    <Badge variant="secondary" className="bg-zinc-500/20 text-zinc-400 border-zinc-500/30">
      {estado}
    </Badge>
  )
}

export function ListaClientes({ clientes, loading, showMembresia = false }: ListaClientesProps) {
  if (loading) {
    return (
      <div className="text-center py-8 text-zinc-400">
        Cargando clientes...
      </div>
    )
  }

  if (clientes.length === 0) {
    return (
      <div className="text-center py-8 text-zinc-400">
        No se encontraron clientes
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-zinc-800 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-zinc-900">
            <TableHead className="text-zinc-300">Nombre</TableHead>
            <TableHead className="text-zinc-300">DNI</TableHead>
            <TableHead className="text-zinc-300">Email</TableHead>
            <TableHead className="text-zinc-300">Teléfono</TableHead>
            {showMembresia && (
              <TableHead className="text-zinc-300">Membresía</TableHead>
            )}
            <TableHead className="text-zinc-300">Estado</TableHead>
            <TableHead className="text-zinc-300 text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clientes.map((cliente) => (
            <TableRow key={cliente.id} className="border-zinc-800 hover:bg-zinc-900/50">
              <TableCell className="text-white font-medium">
                {cliente.nombre} {cliente.apellido}
              </TableCell>
              <TableCell className="text-zinc-300">
                {cliente.dni || '-'}
              </TableCell>
              <TableCell className="text-zinc-300">
                {cliente.email || '-'}
              </TableCell>
              <TableCell className="text-zinc-300">
                {cliente.telefono || '-'}
              </TableCell>
              {showMembresia && (
                <TableCell>
                  <BadgeMembresia
                    estado={cliente.membresia_estado}
                    fechaFin={cliente.membresia_fecha_fin}
                  />
                </TableCell>
              )}
              <TableCell>
                <Badge
                  variant={cliente.activo ? 'default' : 'secondary'}
                  className={cliente.activo
                    ? 'bg-green-500/20 text-green-400 border-green-500/30'
                    : 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30'
                  }
                >
                  {cliente.activo ? 'Activo' : 'Inactivo'}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Link href={`/recepcionista/clientes/${cliente.id}`}>
                    <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white">
                      <Eye className="size-4" />
                    </Button>
                  </Link>
                  <Link href={`/recepcionista/clientes/${cliente.id}?edit=true`}>
                    <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white">
                      <Edit className="size-4" />
                    </Button>
                  </Link>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}