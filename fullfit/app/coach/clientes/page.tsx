'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { listarClientesCoach, ClienteCoach } from '@/lib/supabase/queries/coach'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Search, Loader2, Users, ChevronLeft, ChevronRight,
  ChevronsLeft, ChevronsRight, Dumbbell
} from 'lucide-react'
import { formatDate } from '@/lib/utils/dates'

const OPCIONES_LIMITE = [10, 25, 50]
const DEBOUNCE_MS = 300

export default function CoachClientesPage() {
  const [data, setData] = useState<ClienteCoach[]>([])
  const [count, setCount] = useState(0)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [loading, setLoading] = useState(true)
  const [busqueda, setBusqueda] = useState('')
  const [limite, setLimite] = useState(10)

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const latestRef = useRef(0)

  const cargar = useCallback(async (opts: {
    busqueda?: string
    page?: number
    limit?: number
  }) => {
    const reqId = ++latestRef.current
    setLoading(true)
    const result = await listarClientesCoach({
      busqueda: opts.busqueda,
      page: opts.page ?? 1,
      limit: opts.limit ?? 10,
    })
    if (reqId !== latestRef.current) return
    setData(result.data)
    setCount(result.count)
    setPage(result.page)
    setTotalPages(result.totalPages)
    setLoading(false)
  }, [])

  useEffect(() => {
    cargar({ limit: limite })
  }, [cargar, limite])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setBusqueda(value)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      cargar({ busqueda: value, page: 1, limit: limite })
    }, DEBOUNCE_MS)
  }

  const handlePageChange = (newPage: number) => {
    cargar({ busqueda, page: newPage, limit: limite })
  }

  const diasRestantes = (fechaFin: string) => {
    const diff = Math.ceil((new Date(fechaFin).getTime() - Date.now()) / 86400000)
    return diff
  }

  const textoResultados = count === 0
    ? 'Sin clientes con clases grupales'
    : `${count} cliente${count !== 1 ? 's' : ''} encontrado${count !== 1 ? 's' : ''}`

  return (
    <div className="flex flex-col gap-6">
      {/* Encabezado */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-emerald-500/20 pb-4">
        <div>
          <h1 className="font-arcade text-2xl md:text-3xl text-white uppercase tracking-widest flex items-center gap-3">
            <Dumbbell className="size-7 text-emerald-400" />
            Mis Clientes
          </h1>
          <p className="font-mono text-white/40 text-xs md:text-sm mt-2">
            Clientes con membresía de clases grupales activa
          </p>
        </div>
        <span className="font-mono text-emerald-400/80 text-xs uppercase tracking-wider">
          {textoResultados}
        </span>
      </div>

      {/* Barra de búsqueda */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[240px]">
          {loading ? (
            <Loader2 className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-emerald-400 animate-spin" />
          ) : (
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-white/30" />
          )}
          <Input
            value={busqueda}
            onChange={handleSearch}
            placeholder="Buscar por nombre, DNI o email..."
            className="pl-10 bg-black border-white/10 text-white placeholder:text-white/30 focus:border-emerald-500/50"
          />
        </div>
      </div>

      {/* Tabla */}
      {loading ? (
        <div className="rounded-lg border border-white/10 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-white/5 border-white/10">
                {['Nombre', 'DNI', 'Email', 'Teléfono', 'Plan', 'Vence', 'Estado'].map(h => (
                  <TableHead key={h} className="text-white/50 font-mono text-xs uppercase tracking-wider">{h}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...Array(5)].map((_, i) => (
                <TableRow key={i} className="border-white/10">
                  {[...Array(7)].map((__, j) => (
                    <TableCell key={j}>
                      <div className="h-4 bg-white/10 rounded animate-pulse" />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : data.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 py-20 text-center rounded-lg border border-white/10 bg-white/5">
          <Users className="size-10 text-white/20" />
          <div>
            <p className="font-arcade text-white/40 text-sm uppercase tracking-wider">Sin resultados</p>
            <p className="font-mono text-white/25 text-xs mt-1">
              No se encontraron clientes con membresía de clases grupales activa
            </p>
          </div>
        </div>
      ) : (
        <div className="rounded-lg border border-white/10 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-white/5 border-white/10">
                <TableHead className="text-white/50 font-mono text-xs uppercase tracking-wider">Nombre</TableHead>
                <TableHead className="text-white/50 font-mono text-xs uppercase tracking-wider hidden md:table-cell">DNI</TableHead>
                <TableHead className="text-white/50 font-mono text-xs uppercase tracking-wider hidden lg:table-cell">Email</TableHead>
                <TableHead className="text-white/50 font-mono text-xs uppercase tracking-wider hidden md:table-cell">Teléfono</TableHead>
                <TableHead className="text-white/50 font-mono text-xs uppercase tracking-wider">Plan</TableHead>
                <TableHead className="text-white/50 font-mono text-xs uppercase tracking-wider">Vence</TableHead>
                <TableHead className="text-white/50 font-mono text-xs uppercase tracking-wider">Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((cliente) => {
                const dias = cliente.fecha_fin ? diasRestantes(cliente.fecha_fin) : null
                const urgente = dias !== null && dias <= 7

                return (
                  <TableRow key={cliente.id} className="border-white/10 hover:bg-white/5 transition-colors">
                    <TableCell className="text-white font-medium">
                      {cliente.nombre} {cliente.apellido}
                    </TableCell>
                    <TableCell className="text-white/50 font-mono text-sm hidden md:table-cell">
                      {cliente.dni || '—'}
                    </TableCell>
                    <TableCell className="text-white/50 text-sm hidden lg:table-cell">
                      {cliente.email || '—'}
                    </TableCell>
                    <TableCell className="text-white/50 text-sm hidden md:table-cell">
                      {cliente.telefono || '—'}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className="border-emerald-500/30 bg-emerald-500/10 text-emerald-400 font-mono text-[10px] uppercase tracking-wide"
                      >
                        {cliente.plan_nombre || '—'}
                      </Badge>
                    </TableCell>
                    <TableCell className={`text-sm font-mono ${urgente ? 'text-amber-400' : 'text-white/50'}`}>
                      {cliente.fecha_fin
                        ? <>
                            {formatDate(cliente.fecha_fin)}
                            {dias !== null && (
                              <span className="block text-[10px] text-white/30">
                                {dias > 0 ? `${dias}d restantes` : 'Vence hoy'}
                              </span>
                            )}
                          </>
                        : '—'
                      }
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={cliente.activo
                          ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                          : 'border-red-500/30 bg-red-500/10 text-red-400'
                        }
                      >
                        {cliente.activo ? 'Activo' : 'Inactivo'}
                      </Badge>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Paginación */}
      {(totalPages > 1 || count > 10) && (
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-white/40 font-mono uppercase tracking-wider">
            <span>Mostrar</span>
            <Select value={String(limite)} onValueChange={(v) => setLimite(Number(v))}>
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

          <div className="flex items-center gap-1">
            <Button variant="outline" size="icon" className="size-8 border-white/10 text-white/40 hover:bg-white/5"
              onClick={() => handlePageChange(1)} disabled={page === 1 || loading}>
              <ChevronsLeft className="size-4" />
            </Button>
            <Button variant="outline" size="icon" className="size-8 border-white/10 text-white/40 hover:bg-white/5"
              onClick={() => handlePageChange(page - 1)} disabled={page === 1 || loading}>
              <ChevronLeft className="size-4" />
            </Button>
            <span className="font-mono text-white/40 text-xs px-3">
              {page} / {totalPages}
            </span>
            <Button variant="outline" size="icon" className="size-8 border-white/10 text-white/40 hover:bg-white/5"
              onClick={() => handlePageChange(page + 1)} disabled={page === totalPages || loading}>
              <ChevronRight className="size-4" />
            </Button>
            <Button variant="outline" size="icon" className="size-8 border-white/10 text-white/40 hover:bg-white/5"
              onClick={() => handlePageChange(totalPages)} disabled={page === totalPages || loading}>
              <ChevronsRight className="size-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
