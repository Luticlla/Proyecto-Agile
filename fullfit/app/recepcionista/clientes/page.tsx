'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { BuscadorCliente, ListaClientes, FiltroMembresia, ResumenEstadistico, ExportarCSV, ModalRegistrarCliente } from '@/components/clientes'
import { listarClientes, ClienteListResult, EstadoSuscripcion, ClienteConMembresia } from '@/lib/supabase/queries/clientes'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, UserPlus2 } from 'lucide-react'

const OPCIONES_LIMITE = [10, 25, 50, 100]
const DEBOUNCE_MS = 300

export default function ClientesPage() {
  const router = useRouter()
  const [result, setResult] = useState<ClienteListResult>({
    data: [],
    count: 0,
    page: 1,
    totalPages: 0,
  })
  const [loading, setLoading] = useState(true)
  const [busqueda, setBusqueda] = useState('')
  const [filtroMembresia, setFiltroMembresia] = useState<EstadoSuscripcion>('todos')
  const [limite, setLimite] = useState(10)
  const [paginaInput, setPaginaInput] = useState('1')
  const [showModalRegistrar, setShowModalRegistrar] = useState(false)

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const latestRequestRef = useRef(0)

  // ── Carga central de datos ───────────────────────────────────────────────
  const cargarClientes = useCallback(async (opts: {
    busqueda?: string
    filtro?: EstadoSuscripcion
    page?: number
    limit?: number
  }) => {
    const requestId = ++latestRequestRef.current
    setLoading(true)

    const data = await listarClientes({
      busqueda: opts.busqueda || undefined,
      page: opts.page ?? 1,
      limit: opts.limit ?? 10,
      estado_suscripcion: opts.filtro ?? 'todos',
    })

    // Ignorar respuestas de requests anteriores (race condition)
    if (requestId !== latestRequestRef.current) return

    setResult(data)
    setPaginaInput(String(data.page))
    setLoading(false)
  }, [])

  // ── Carga inicial ────────────────────────────────────────────────────────
  useEffect(() => {
    cargarClientes({ filtro: filtroMembresia, limit: limite })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ── Búsqueda con debounce ────────────────────────────────────────────────
  const handleSearch = useCallback((value: string) => {
    setBusqueda(value)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      cargarClientes({ busqueda: value, filtro: filtroMembresia, page: 1, limit: limite })
    }, DEBOUNCE_MS)
  }, [filtroMembresia, limite, cargarClientes])

  // ── Cambio de filtro de membresía ────────────────────────────────────────
  const handleFiltroChange = useCallback((nuevoFiltro: EstadoSuscripcion) => {
    setFiltroMembresia(nuevoFiltro)
    setBusqueda('')
    cargarClientes({ filtro: nuevoFiltro, page: 1, limit: limite })
  }, [limite, cargarClientes])

  // ── Cambio de página ─────────────────────────────────────────────────────
  const handlePageChange = useCallback((newPage: number) => {
    cargarClientes({ busqueda, filtro: filtroMembresia, page: newPage, limit: limite })
  }, [busqueda, filtroMembresia, limite, cargarClientes])

  // ── Cambio de límite por página ──────────────────────────────────────────
  const handleLimiteChange = useCallback((val: string) => {
    const newLimit = Number(val)
    setLimite(newLimit)
    cargarClientes({ busqueda, filtro: filtroMembresia, page: 1, limit: newLimit })
  }, [busqueda, filtroMembresia, cargarClientes])

  // ── Salto directo de página ──────────────────────────────────────────────
  const handlePaginaInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPaginaInput(e.target.value)
  }

  const handlePaginaInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const parsed = parseInt(paginaInput, 10)
      if (!isNaN(parsed) && parsed >= 1 && parsed <= result.totalPages) {
        handlePageChange(parsed)
      } else {
        setPaginaInput(String(result.page))
      }
    }
  }

  // ── Acciones de membresía ────────────────────────────────────────────────
  const handleRegistrarMembresia = useCallback((clienteId: string) => {
    router.push(`/recepcionista/clientes/${clienteId}?action=registrar`)
  }, [router])

  const handleRenovarMembresia = useCallback((clienteId: string) => {
    router.push(`/recepcionista/clientes/${clienteId}?action=renovar`)
  }, [router])

  const textoResultados = result.count === 0
    ? 'Sin resultados'
    : `${result.count} cliente${result.count !== 1 ? 's' : ''} encontrado${result.count !== 1 ? 's' : ''}`

  return (
    <div className="flex flex-col gap-6">
      {/* Modal de registro de cliente */}
      <ModalRegistrarCliente
        open={showModalRegistrar}
        onClose={() => setShowModalRegistrar(false)}
        onSuccess={() => cargarClientes({ filtro: filtroMembresia, limit: limite })}
      />

      {/* ── Encabezado ────────────────────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-gym-logo/20 pb-4">
        <div>
          <h1 className="font-arcade text-2xl md:text-3xl text-white uppercase tracking-widest">Clientes</h1>
          <p className="font-mono text-white/40 text-xs md:text-sm mt-2">Gestiona los perfiles y membresías de los clientes</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={() => setShowModalRegistrar(true)}
            className="bg-yellow-400 text-zinc-950 hover:bg-yellow-300 font-mono text-xs uppercase tracking-wider gap-2"
          >
            <UserPlus2 className="size-4" />
            Registrar nuevo cliente
          </Button>
          <span className="font-mono text-gym-logo/80 text-xs uppercase tracking-wider">{textoResultados}</span>
        </div>
      </div>

      {/* ── Resumen estadístico ────────────────────────────────────────── */}
      <ResumenEstadistico />

      {/* ── Barra de herramientas ──────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex-1 min-w-60">
          <BuscadorCliente onSearch={handleSearch} isLoading={loading} />
        </div>
        <FiltroMembresia value={filtroMembresia} onChange={handleFiltroChange} />
        <ExportarCSV clientes={result.data as ClienteConMembresia[]} />
      </div>

      {/* ── Tabla ─────────────────────────────────────────────────────── */}
      <ListaClientes
        clientes={result.data}
        loading={loading}
        showMembresia
        onRegistrarMembresia={handleRegistrarMembresia}
        onRenovarMembresia={handleRenovarMembresia}
      />

      {/* ── Controles de paginación ────────────────────────────────────── */}
      {(result.totalPages > 1 || result.count > 10) && (
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Selector de cantidad por página */}
          <div className="flex items-center gap-2 text-sm text-white/40 font-mono uppercase tracking-wider text-[10px]">
            <span>Mostrar</span>
            <Select value={String(limite)} onValueChange={handleLimiteChange}>
              <SelectTrigger className="w-20 h-8 border-white/10 bg-black text-white font-mono text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-black border-white/10 font-mono text-xs">
                {OPCIONES_LIMITE.map(n => (
                  <SelectItem key={n} value={String(n)} className="text-white hover:bg-white/5 focus:bg-white/5">
                    {n}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span>por página</span>
          </div>

          {/* Navegación de páginas */}
          <div className="flex items-center gap-1">
            {/* Primera página */}
            <Button
              variant="outline"
              size="icon"
              className="size-8 border-white/10 text-white/40 hover:bg-white/5 hover:text-white"
              onClick={() => handlePageChange(1)}
              disabled={result.page === 1 || loading}
              title="Primera página"
            >
              <ChevronsLeft className="size-4" />
            </Button>
            {/* Anterior */}
            <Button
              variant="outline"
              size="icon"
              className="size-8 border-white/10 text-white/40 hover:bg-white/5 hover:text-white"
              onClick={() => handlePageChange(result.page - 1)}
              disabled={result.page === 1 || loading}
              title="Página anterior"
            >
              <ChevronLeft className="size-4" />
            </Button>

            {/* Input de salto directo */}
            <div className="flex items-center gap-1.5 text-white/40 px-1 font-mono uppercase tracking-wider text-[10px]">
              <span>Página</span>
              <Input
                type="number"
                min={1}
                max={result.totalPages}
                value={paginaInput}
                onChange={handlePaginaInputChange}
                onKeyDown={handlePaginaInputKeyDown}
                className="w-14 h-8 text-center border-white/10 bg-black text-white font-mono text-xs"
              />
              <span>de {result.totalPages}</span>
            </div>

            {/* Siguiente */}
            <Button
              variant="outline"
              size="icon"
              className="size-8 border-white/10 text-white/40 hover:bg-white/5 hover:text-white"
              onClick={() => handlePageChange(result.page + 1)}
              disabled={result.page === result.totalPages || loading}
              title="Página siguiente"
            >
              <ChevronRight className="size-4" />
            </Button>
            {/* Última página */}
            <Button
              variant="outline"
              size="icon"
              className="size-8 border-white/10 text-white/40 hover:bg-white/5 hover:text-white"
              onClick={() => handlePageChange(result.totalPages)}
              disabled={result.page === result.totalPages || loading}
              title="Última página"
            >
              <ChevronsRight className="size-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}