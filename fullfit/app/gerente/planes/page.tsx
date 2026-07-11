'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Plus, Search, Loader2, CreditCard, AlertTriangle } from 'lucide-react'
import { ListaPlanesAdmin, FormularioPlan, ConfirmarEliminarPlan } from '@/components/planes'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { toast } from 'sonner'
import type { PlanAdmin } from '@/lib/supabase/queries/planes.types'

const OPCIONES_LIMITE = [10, 25, 50, 100]
const DEBOUNCE_MS = 300

export default function PlanesPage() {
  const [planes, setPlanes] = useState<PlanAdmin[]>([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [busqueda, setBusqueda] = useState('')
  const [filtroEstado, setFiltroEstado] = useState<string>('todos')
  const [limite, setLimite] = useState(10)

  const [isCrearOpen, setIsCrearOpen] = useState(false)
  const [planEditar, setPlanEditar] = useState<PlanAdmin | null>(null)
  const [planEliminarConfirmar, setPlanEliminarConfirmar] = useState<{
    id: number
    nombre: string
    suscripcionesActivas?: number
  } | null>(null)
  const [errorEliminar, setErrorEliminar] = useState<string | null>(null)

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const cargarPlanes = useCallback(async (opts: {
    busqueda?: string
    activo?: boolean
    page?: number
    limit?: number
  }) => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (opts.busqueda) params.set('busqueda', opts.busqueda)
      if (opts.activo !== undefined) params.set('activo', String(opts.activo))
      params.set('page', String(opts.page ?? 1))
      params.set('limit', String(opts.limit ?? 10))

      const response = await fetch(`/api/planes?${params.toString()}`)
      const data = await response.json()

      if (response.ok) {
        setPlanes(data.data)
        setTotal(data.count)
        setTotalPages(data.totalPages)
        setPage(data.page)
      }
    } catch (error) {
      console.error('Error al cargar planes:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const activo = filtroEstado === 'todos' ? undefined : filtroEstado === 'activos'
    cargarPlanes({ busqueda, activo, limit: limite })
  }, [cargarPlanes, filtroEstado, limite])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setBusqueda(value)

    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      const activo = filtroEstado === 'todos' ? undefined : filtroEstado === 'activos'
      cargarPlanes({ busqueda: value, activo, page: 1, limit: limite })
    }, DEBOUNCE_MS)
  }

  const handlePageChange = (newPage: number) => {
    const activo = filtroEstado === 'todos' ? undefined : filtroEstado === 'activos'
    cargarPlanes({ busqueda, activo, page: newPage, limit: limite })
  }

  const handleToggleEstado = async (id: number, nuevoActivo: boolean) => {
    try {
      const response = await fetch(`/api/planes/${id}/estado`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ activo: nuevoActivo }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Error al cambiar estado')
      }

      if (data.confirmRequired) {
        const confirmResponse = await fetch(`/api/planes/${id}/estado`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ activo: nuevoActivo, confirm: true }),
        })

        if (!confirmResponse.ok) {
          const confirmData = await confirmResponse.json()
          throw new Error(confirmData.error || 'Error al cambiar estado')
        }
      }

      const activoFilter = filtroEstado === 'todos' ? undefined : filtroEstado === 'activos'
      cargarPlanes({ busqueda, activo: activoFilter, page, limit: limite })
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  const handleSuccessCrear = () => {
    setIsCrearOpen(false)
    const activo = filtroEstado === 'todos' ? undefined : filtroEstado === 'activos'
    cargarPlanes({ busqueda, activo, page: 1, limit: limite })
  }

  const handleSuccessEditar = () => {
    setPlanEditar(null)
    const activo = filtroEstado === 'todos' ? undefined : filtroEstado === 'activos'
    cargarPlanes({ busqueda, activo, page, limit: limite })
  }

  const handleEliminar = async (id: number) => {
    try {
      const response = await fetch(`/api/planes/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      })

      const data = await response.json()

      if (!response.ok) {
        setErrorEliminar(data.error || 'Error al eliminar el plan')
        return
      }

      toast.success('Plan eliminado exitosamente')
      const activo = filtroEstado === 'todos' ? undefined : filtroEstado === 'activos'
      cargarPlanes({ busqueda, activo, page, limit: limite })
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  const textoResultados = total === 0
    ? 'Sin resultados'
    : `${total} plan${total !== 1 ? 'es' : ''} encontrado${total !== 1 ? 's' : ''}`

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <CreditCard className="size-6" />
            Gestión de Planes de Membresía
          </h1>
          <p className="text-zinc-400 mt-1">Administra los planes disponibles para los socios</p>
        </div>
        <Button
          onClick={() => setIsCrearOpen(true)}
          className="bg-yellow-500 text-zinc-950 hover:bg-yellow-400"
        >
          <Plus className="size-4 mr-2" />
          Nuevo Plan
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[240px]">
          {loading ? (
            <Loader2 className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-400 animate-spin" />
          ) : (
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-500" />
          )}
          <Input
            value={busqueda}
            onChange={handleSearch}
            placeholder="Buscar por nombre..."
            className="pl-10 bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-500"
          />
        </div>
        <Select value={filtroEstado} onValueChange={setFiltroEstado}>
          <SelectTrigger className="w-[150px] bg-zinc-900 border-zinc-800 text-white">
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent className="bg-zinc-900 border-zinc-800">
            <SelectItem value="todos" className="text-white">Todos</SelectItem>
            <SelectItem value="activos" className="text-white">Activos</SelectItem>
            <SelectItem value="inactivos" className="text-white">Inactivos</SelectItem>
          </SelectContent>
        </Select>
        <div className="text-sm text-zinc-400 min-w-[120px] text-right">
          {textoResultados}
        </div>
      </div>

      <ListaPlanesAdmin
        planes={planes}
        loading={loading}
        onEditar={setPlanEditar}
        onToggleEstado={handleToggleEstado}
        onEliminar={handleEliminar}
      />

      {(totalPages > 1 || total > limite) && (
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-zinc-400">
            <span>Mostrar</span>
            <Select value={String(limite)} onValueChange={(v) => setLimite(Number(v))}>
              <SelectTrigger className="w-20 h-8 border-zinc-800 bg-zinc-900 text-zinc-300">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-zinc-900 border-zinc-800">
                {OPCIONES_LIMITE.map(n => (
                  <SelectItem key={n} value={String(n)} className="text-white">
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
              className="size-8 border-zinc-800 text-zinc-400 hover:bg-zinc-800"
              onClick={() => handlePageChange(1)}
              disabled={page === 1 || loading}
            >
              <ChevronsLeft className="size-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="size-8 border-zinc-800 text-zinc-400 hover:bg-zinc-800"
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1 || loading}
            >
              <ChevronLeft className="size-4" />
            </Button>

            <div className="flex items-center gap-2 text-sm text-zinc-400 px-2">
              Página {page} de {totalPages}
            </div>

            <Button
              variant="outline"
              size="icon"
              className="size-8 border-zinc-800 text-zinc-400 hover:bg-zinc-800"
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPages || loading}
            >
              <ChevronRight className="size-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="size-8 border-zinc-800 text-zinc-400 hover:bg-zinc-800"
              onClick={() => handlePageChange(totalPages)}
              disabled={page === totalPages || loading}
            >
              <ChevronsRight className="size-4" />
            </Button>
          </div>
        </div>
      )}

      <FormularioPlan
        isOpen={isCrearOpen}
        onClose={() => setIsCrearOpen(false)}
        onSuccess={handleSuccessCrear}
      />

      <FormularioPlan
        plan={planEditar}
        isOpen={!!planEditar}
        onClose={() => setPlanEditar(null)}
        onSuccess={handleSuccessEditar}
      />

      <ConfirmarEliminarPlan
        isOpen={!!planEliminarConfirmar}
        onClose={() => setPlanEliminarConfirmar(null)}
        onConfirm={() => {
          if (planEliminarConfirmar) {
            handleEliminar(planEliminarConfirmar.id)
          }
        }}
        nombrePlan={planEliminarConfirmar?.nombre || ''}
        suscripcionesActivas={planEliminarConfirmar?.suscripcionesActivas}
      />

      {/* Dialog de error al eliminar */}
      <AlertDialog open={!!errorEliminar} onOpenChange={(open) => !open && setErrorEliminar(null)}>
        <AlertDialogContent className="bg-zinc-900 border-zinc-800">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white flex items-center gap-2">
              <AlertTriangle className="size-5 text-yellow-400" />
              No se puede eliminar
            </AlertDialogTitle>
            <AlertDialogDescription className="text-zinc-400">
              {errorEliminar}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction
              onClick={() => setErrorEliminar(null)}
              className="bg-zinc-700 text-white hover:bg-zinc-600"
            >
              Entendido
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
