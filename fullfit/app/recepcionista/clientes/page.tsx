'use client'

import { useState, useEffect, useCallback } from 'react'
import { BuscadorCliente, ListaClientes, FiltroMembresia } from '@/components/clientes'
import { listarClientes, ClienteListResult, EstadoSuscripcion } from '@/lib/supabase/queries/clientes'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function ClientesPage() {
  const [result, setResult] = useState<ClienteListResult>({
    data: [],
    count: 0,
    page: 1,
    totalPages: 0
  })
  const [loading, setLoading] = useState(true)
  const [busqueda, setBusqueda] = useState('')
  const [filtroMembresia, setFiltroMembresia] = useState<EstadoSuscripcion>('todos')

  useEffect(() => {
    let cancelled = false

    async function loadInitialData() {
      const data = await listarClientes({ page: 1, limit: 10, estado_suscripcion: filtroMembresia })
      if (!cancelled) {
        setResult(data)
        setLoading(false)
      }
    }

    loadInitialData()

    return () => {
      cancelled = true
    }
  }, [filtroMembresia])

  const handleSearch = useCallback(async (value: string) => {
    setBusqueda(value)
    setLoading(true)
    const data = await listarClientes({
      busqueda: value || undefined,
      page: 1,
      limit: 10,
      estado_suscripcion: filtroMembresia
    })
    setResult(data)
    setLoading(false)
  }, [filtroMembresia])

  const handleFiltroChange = useCallback(async (nuevoFiltro: EstadoSuscripcion) => {
    setFiltroMembresia(nuevoFiltro)
    setBusqueda('')
    setLoading(true)
    const data = await listarClientes({
      page: 1,
      limit: 10,
      estado_suscripcion: nuevoFiltro
    })
    setResult(data)
    setLoading(false)
  }, [])

  const handlePageChange = useCallback(async (newPage: number) => {
    setLoading(true)
    const data = await listarClientes({
      busqueda: busqueda || undefined,
      page: newPage,
      limit: 10,
      estado_suscripcion: filtroMembresia
    })
    setResult(data)
    setLoading(false)
  }, [busqueda, filtroMembresia])

  const showMembresia = filtroMembresia !== 'todos'

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Clientes</h1>
          <p className="text-zinc-400">
            Gestiona los perfiles de los clientes
          </p>
        </div>
        <div className="text-zinc-400 text-sm">
          {result.count} cliente{result.count !== 1 ? 's' : ''} encontrado{result.count !== 1 ? 's' : ''}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <BuscadorCliente onSearch={handleSearch} />
        <FiltroMembresia value={filtroMembresia} onChange={handleFiltroChange} />
      </div>

      <ListaClientes clientes={result.data} loading={loading} showMembresia={showMembresia} />

      {result.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-zinc-400 text-sm">
            Página {result.page} de {result.totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(result.page - 1)}
              disabled={result.page === 1}
              className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
            >
              <ChevronLeft className="size-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(result.page + 1)}
              disabled={result.page === result.totalPages}
              className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
            >
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}