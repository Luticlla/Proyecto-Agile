'use client'

import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, Search, Building2 } from 'lucide-react'
import { toast } from 'sonner'
import { ListaSedesAdmin } from '@/components/sedes/ListaSedesAdmin'
import { FormularioSede } from '@/components/sedes/FormularioSede'
import { FiltroEstadoSede } from '@/components/sedes/FiltroEstadoSede'
import type { SedeAdmin } from '@/lib/supabase/queries/sedes.types'

export default function SedesPage() {
  const [sedes, setSedes] = useState<SedeAdmin[]>([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [busqueda, setBusqueda] = useState('')
  const [filtroEstado, setFiltroEstado] = useState('todos')
  const [formularioAbierto, setFormularioAbierto] = useState(false)
  const [sedeEditar, setSedeEditar] = useState<SedeAdmin | null>(null)

  const fetchSedes = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (busqueda) params.set('busqueda', busqueda)
      if (filtroEstado !== 'todos') params.set('estado', filtroEstado)
      params.set('page', page.toString())
      params.set('limit', '10')

      const response = await fetch(`/api/sedes?${params.toString()}`)
      const data = await response.json()

      if (response.ok) {
        setSedes(data.data)
        setTotal(data.count)
        setTotalPages(data.totalPages)
      }
    } catch (error) {
      console.error('Error fetching sedes:', error)
    } finally {
      setLoading(false)
    }
  }, [busqueda, filtroEstado, page])

  useEffect(() => {
    fetchSedes()
  }, [fetchSedes])

  useEffect(() => {
    setPage(1)
  }, [busqueda, filtroEstado])

  const handleBuscar = (value: string) => {
    setBusqueda(value)
  }

  const handleToggleEstado = async (id: number, estado: string) => {
    try {
      const response = await fetch(`/api/sedes/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado }),
      })

      if (response.ok) {
        fetchSedes()
      }
    } catch (error) {
      console.error('Error toggling estado:', error)
    }
  }

  const handleEditar = (sede: SedeAdmin) => {
    setSedeEditar(sede)
    setFormularioAbierto(true)
  }

  const handleCrearNueva = () => {
    setSedeEditar(null)
    setFormularioAbierto(true)
  }

  const handleExito = () => {
    setFormularioAbierto(false)
    setSedeEditar(null)
    fetchSedes()
  }

  const handleEliminar = async (id: number) => {
    try {
      const response = await fetch(`/api/sedes/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast.success('Sede eliminada exitosamente')
        fetchSedes()
      } else {
        const data = await response.json()
        toast.error(data.error || 'Error al eliminar la sede')
      }
    } catch (error) {
      toast.error('Error al eliminar la sede')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Building2 className="size-6" />
            Gestión de Sedes
          </h1>
          <p className="text-zinc-400 mt-1">Administra las sedes del gimnasio</p>
        </div>
        <Button
          onClick={handleCrearNueva}
          className="bg-yellow-500 text-zinc-950 hover:bg-yellow-400"
        >
          <Plus className="size-4 mr-2" />
          Nueva Sede
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
          <Input
            placeholder="Buscar por nombre o dirección..."
            value={busqueda}
            onChange={(e) => handleBuscar(e.target.value)}
            className="pl-10 bg-zinc-900 border-zinc-800 text-white"
          />
        </div>
        <FiltroEstadoSede value={filtroEstado} onChange={setFiltroEstado} />
      </div>

      <div className="text-sm text-zinc-400">
        {total} sede(s) encontrado(s)
      </div>

      <ListaSedesAdmin
        sedes={sedes}
        loading={loading}
        onEditar={handleEditar}
        onToggleEstado={handleToggleEstado}
        onEliminar={handleEliminar}
      />

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-zinc-400">
            Página {page} de {totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="bg-transparent border-zinc-700 text-white hover:bg-zinc-800 disabled:opacity-40"
            >
              Anterior
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="bg-transparent border-zinc-700 text-white hover:bg-zinc-800 disabled:opacity-40"
            >
              Siguiente
            </Button>
          </div>
        </div>
      )}

      <FormularioSede
        isOpen={formularioAbierto}
        onClose={() => {
          setFormularioAbierto(false)
          setSedeEditar(null)
        }}
        onSuccess={handleExito}
        sede={sedeEditar}
      />
    </div>
  )
}
