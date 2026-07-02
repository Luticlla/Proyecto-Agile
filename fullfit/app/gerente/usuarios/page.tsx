'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Plus, Search, Loader2 } from 'lucide-react'
import {
  ListaUsuarios,
  FiltroRol,
  FiltroEstado,
  FormularioCrearUsuario,
  FormularioEditarUsuario
} from '@/components/usuarios'
import { listarUsuarios } from '@/lib/supabase/queries/usuarios'
import type { UsuarioSistema, UsuarioSistemaListResult } from '@/lib/supabase/queries/usuarios.types'

const OPCIONES_LIMITE = [10, 25, 50, 100]
const DEBOUNCE_MS = 300

export default function UsuariosPage() {
  const [result, setResult] = useState<UsuarioSistemaListResult>({
    data: [],
    count: 0,
    page: 1,
    totalPages: 0,
  })

  const [loading, setLoading] = useState(true)
  const [busqueda, setBusqueda] = useState('')
  const [filtroRol, setFiltroRol] = useState<number | undefined>(undefined)
  const [filtroActivo, setFiltroActivo] = useState<boolean | undefined>(undefined)
  const [limite, setLimite] = useState(10)

  const [isCrearOpen, setIsCrearOpen] = useState(false)
  const [usuarioEditar, setUsuarioEditar] = useState<UsuarioSistema | null>(null)

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const cargarUsuarios = useCallback(async (opts: {
    busqueda?: string
    filtro_rol?: number
    filtro_activo?: boolean
    page?: number
    limit?: number
  }) => {
    setLoading(true)
    try {
      const data = await listarUsuarios({
        busqueda: opts.busqueda || undefined,
        rol_id: opts.filtro_rol,
        activo: opts.filtro_activo,
        page: opts.page ?? 1,
        limit: opts.limit ?? 10,
      })
      setResult(data)
    } catch (error) {
      console.error('Error al cargar usuarios:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    cargarUsuarios({ filtro_rol: filtroRol, filtro_activo: filtroActivo, limit: limite })
  }, [cargarUsuarios, filtroRol, filtroActivo, limite])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setBusqueda(value)

    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      cargarUsuarios({ busqueda: value, filtro_rol: filtroRol, filtro_activo: filtroActivo, page: 1, limit: limite })
    }, DEBOUNCE_MS)
  }

  const handlePageChange = (newPage: number) => {
    cargarUsuarios({ busqueda, filtro_rol: filtroRol, filtro_activo: filtroActivo, page: newPage, limit: limite })
  }

  const handleToggleEstado = async (id: string, activo: boolean) => {
    try {
      const res = await fetch(`/api/usuarios/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ activo })
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Error al cambiar estado')
      }
      cargarUsuarios({ busqueda, filtro_rol: filtroRol, filtro_activo: filtroActivo, page: result.page, limit: limite })
    } catch (error: any) {
      alert(error.message)
    }
  }

  const handleSuccessCrear = () => {
    setIsCrearOpen(false)
    cargarUsuarios({ busqueda, filtro_rol: filtroRol, filtro_activo: filtroActivo, page: 1, limit: limite })
  }

  const handleSuccessEditar = () => {
    setUsuarioEditar(null)
    cargarUsuarios({ busqueda, filtro_rol: filtroRol, filtro_activo: filtroActivo, page: result.page, limit: limite })
  }

  const textoResultados = result.count === 0
    ? 'Sin resultados'
    : `${result.count} usuario${result.count !== 1 ? 's' : ''} encontrado${result.count !== 1 ? 's' : ''}`

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Personal del Sistema</h1>
          <p className="text-gray-500 text-sm mt-0.5">Gestiona los administradores y recepcionistas</p>
        </div>
        <Button
          onClick={() => setIsCrearOpen(true)}
          className="bg-yellow-500 text-gray-900 hover:bg-yellow-400"
        >
          <Plus className="size-4 mr-2" />
          Nuevo Usuario
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[240px]">
          {loading ? (
            <Loader2 className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400 animate-spin" />
          ) : (
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-500" />
          )}
          <Input
            value={busqueda}
            onChange={handleSearch}
            placeholder="Buscar por nombre, DNI o email..."
            className="pl-10 bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400"
          />
        </div>
        <FiltroRol value={filtroRol} onChange={(rol) => setFiltroRol(rol)} />
        <FiltroEstado value={filtroActivo} onChange={(activo) => setFiltroActivo(activo)} />
        <div className="text-sm text-gray-500 min-w-[120px] text-right">
          {textoResultados}
        </div>
      </div>

      <ListaUsuarios
        usuarios={result.data}
        loading={loading}
        onEditar={setUsuarioEditar}
        onToggleEstado={handleToggleEstado}
      />

      {(result.totalPages > 1 || result.count > 10) && (
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>Mostrar</span>
            <Select value={String(limite)} onValueChange={(v) => setLimite(Number(v))}>
              <SelectTrigger className="w-20 h-8 border-gray-200 bg-gray-50 text-gray-700">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-200">
                {OPCIONES_LIMITE.map(n => (
                  <SelectItem key={n} value={String(n)} className="text-gray-700 hover:bg-gray-100">
                    {n}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span>por página</span>
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className="size-8 border-gray-200 text-gray-500 hover:bg-gray-100"
              onClick={() => handlePageChange(1)}
              disabled={result.page === 1 || loading}
            >
              <ChevronsLeft className="size-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="size-8 border-gray-200 text-gray-500 hover:bg-gray-100"
              onClick={() => handlePageChange(result.page - 1)}
              disabled={result.page === 1 || loading}
            >
              <ChevronLeft className="size-4" />
            </Button>

            <div className="flex items-center gap-2 text-sm text-gray-500 px-2">
              Página {result.page} de {result.totalPages}
            </div>

            <Button
              variant="outline"
              size="icon"
              className="size-8 border-gray-200 text-gray-500 hover:bg-gray-100"
              onClick={() => handlePageChange(result.page + 1)}
              disabled={result.page === result.totalPages || loading}
            >
              <ChevronRight className="size-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="size-8 border-gray-200 text-gray-500 hover:bg-gray-100"
              onClick={() => handlePageChange(result.totalPages)}
              disabled={result.page === result.totalPages || loading}
            >
              <ChevronsRight className="size-4" />
            </Button>
          </div>
        </div>
      )}

      <FormularioCrearUsuario
        isOpen={isCrearOpen}
        onClose={() => setIsCrearOpen(false)}
        onSuccess={handleSuccessCrear}
      />

      <FormularioEditarUsuario
        usuario={usuarioEditar}
        isOpen={!!usuarioEditar}
        onClose={() => setUsuarioEditar(null)}
        onSuccess={handleSuccessEditar}
      />
    </div>
  )
}
