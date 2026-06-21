'use client'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Edit, Power, PowerOff } from 'lucide-react'
import { formatDate } from '@/lib/utils/dates'
import type { UsuarioSistema } from '@/lib/supabase/queries/usuarios.types'
import { ConfirmarDesactivacion } from './ConfirmarDesactivacion'
import { useState } from 'react'

interface ListaUsuariosProps {
  usuarios: UsuarioSistema[]
  loading?: boolean
  onEditar: (usuario: UsuarioSistema) => void
  onToggleEstado: (id: string, activo: boolean) => Promise<void>
}

export function ListaUsuarios({ usuarios, loading, onEditar, onToggleEstado }: ListaUsuariosProps) {
  const [usuarioConfirmar, setUsuarioConfirmar] = useState<{ id: string, nombre: string, activo: boolean } | null>(null)

  if (loading) {
    return (
      <div className="rounded-lg border border-zinc-800 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-zinc-900">
              {['Nombre', 'DNI', 'Email', 'Rol', 'Estado', 'Registro', 'Acciones'].map(h => (
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

  if (usuarios.length === 0) {
    return (
      <div className="text-center py-12 text-zinc-400 rounded-lg border border-zinc-800 bg-zinc-900/30">
        <p className="text-lg font-medium">Sin resultados</p>
        <p className="text-sm text-zinc-500 mt-1">No se encontraron usuarios con los filtros actuales</p>
      </div>
    )
  }

  const handleConfirm = async () => {
    if (!usuarioConfirmar) return
    await onToggleEstado(usuarioConfirmar.id, !usuarioConfirmar.activo)
    setUsuarioConfirmar(null)
  }

  return (
    <>
      <div className="rounded-lg border border-zinc-800 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-zinc-900">
              <TableHead className="text-zinc-300">Nombre</TableHead>
              <TableHead className="text-zinc-300">DNI</TableHead>
              <TableHead className="text-zinc-300 hidden md:table-cell">Email</TableHead>
              <TableHead className="text-zinc-300">Teléfono</TableHead>
              <TableHead className="text-zinc-300">Rol</TableHead>
              <TableHead className="text-zinc-300">Estado</TableHead>
              <TableHead className="text-zinc-300 hidden lg:table-cell">Registro</TableHead>
              <TableHead className="text-zinc-300 text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {usuarios.map((usuario) => (
              <TableRow key={usuario.id} className="border-zinc-800 hover:bg-zinc-900/50">
                <TableCell className="text-white font-medium">
                  {usuario.nombre} {usuario.apellido}
                </TableCell>
                <TableCell className="text-zinc-300 font-mono text-sm">
                  {usuario.dni || '—'}
                </TableCell>
                <TableCell className="text-zinc-300 text-sm hidden md:table-cell">
                  {usuario.email || '—'}
                </TableCell>
                <TableCell className="text-zinc-300 text-sm">
                  {usuario.telefono || '—'}
                </TableCell>
                <TableCell>
                  <Badge 
                    variant="outline" 
                    className={usuario.rol_id === 1 
                      ? 'border-yellow-500/30 bg-yellow-500/20 text-yellow-400' 
                      : 'border-blue-500/30 bg-blue-500/20 text-blue-400'}
                  >
                    {usuario.rol_id === 1 ? 'Admin' : 'Recepcionista'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={usuario.activo ? 'default' : 'secondary'}
                    className={usuario.activo
                      ? 'bg-green-500/20 text-green-400 border-green-500/30'
                      : 'bg-red-500/20 text-red-400 border-red-500/30'
                    }
                  >
                    {usuario.activo ? 'Activo' : 'Inactivo'}
                  </Badge>
                </TableCell>
                <TableCell className="text-zinc-400 text-sm hidden lg:table-cell">
                  {usuario.creado_en ? formatDate(usuario.creado_en.split('T')[0]) : '—'}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="size-8 text-zinc-400 hover:text-white"
                      onClick={() => onEditar(usuario)}
                      title="Editar"
                    >
                      <Edit className="size-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className={`size-8 ${usuario.activo ? 'text-red-400 hover:bg-red-500/10' : 'text-green-400 hover:bg-green-500/10'}`}
                      onClick={() => setUsuarioConfirmar({ id: usuario.id, nombre: `${usuario.nombre} ${usuario.apellido}`, activo: usuario.activo })}
                      title={usuario.activo ? "Desactivar" : "Activar"}
                    >
                      {usuario.activo ? <PowerOff className="size-4" /> : <Power className="size-4" />}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <ConfirmarDesactivacion
        isOpen={!!usuarioConfirmar}
        onClose={() => setUsuarioConfirmar(null)}
        onConfirm={handleConfirm}
        nombreUsuario={usuarioConfirmar?.nombre || ''}
        activo={usuarioConfirmar?.activo || false}
      />
    </>
  )
}
