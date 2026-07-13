'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ChevronLeft, ChevronRight, DollarSign, TrendingUp, Receipt, AlertCircle, Loader2, Download } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { toPng } from 'html-to-image'

type FiltroPeriodo = 'dia' | 'semana' | 'mes' | 'anio'

type TimeSeriesPoint = {
  label: string
  total: number
}

type PagoItem = {
  id: number
  fecha: string
  hora: string
  monto: number
  metodo: string
}

const FILTROS: { value: FiltroPeriodo; label: string }[] = [
  { value: 'dia', label: 'S/ Día' },
  { value: 'semana', label: 'S/ Semana' },
  { value: 'mes', label: 'S/ Mes' },
  { value: 'anio', label: 'S/ Año' },
]

function formatCurrency(amount: number): string {
  return `S/ ${amount.toFixed(2)}`
}

function formatFecha(fecha: Date, filtro: FiltroPeriodo): string {
  const opciones: Intl.DateTimeFormatOptions = { timeZone: 'America/Lima' }
  switch (filtro) {
    case 'dia':
      return fecha.toLocaleDateString('es-PE', { ...opciones, weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
    case 'semana': {
      const fechaLima = new Date(fecha.toLocaleString('en-US', { timeZone: 'America/Lima' }))
      const diaSemana = fechaLima.getDay()
      const diffLunes = diaSemana === 0 ? -6 : 1 - diaSemana
      const inicio = new Date(fechaLima)
      inicio.setDate(fechaLima.getDate() + diffLunes)
      const fin = new Date(inicio)
      fin.setDate(inicio.getDate() + 6)
      return `${inicio.toLocaleDateString('es-PE', { ...opciones, day: 'numeric', month: 'short' })} - ${fin.toLocaleDateString('es-PE', { ...opciones, day: 'numeric', month: 'short', year: 'numeric' })}`
    }
    case 'mes':
      return fecha.toLocaleDateString('es-PE', { ...opciones, month: 'long', year: 'numeric' })
    case 'anio':
      return fecha.getFullYear().toString()
  }
}

function navegarFecha(fecha: Date, filtro: FiltroPeriodo, direccion: number): Date {
  const nueva = new Date(fecha)
  switch (filtro) {
    case 'dia':
      nueva.setDate(nueva.getDate() + direccion)
      break
    case 'semana':
      nueva.setDate(nueva.getDate() + (direccion * 7))
      break
    case 'mes':
      nueva.setMonth(nueva.getMonth() + direccion)
      break
    case 'anio':
      nueva.setFullYear(nueva.getFullYear() + direccion)
      break
  }
  const minDate = new Date(2026, 0, 1)
  if (nueva < minDate) return minDate
  return nueva
}

function estaEnLimiteInferior(fecha: Date, filtro: FiltroPeriodo): boolean {
  const minDate = new Date(2026, 0, 1)
  switch (filtro) {
    case 'dia': return fecha <= minDate
    case 'semana': return fecha <= minDate
    case 'mes': return fecha.getFullYear() === 2026 && fecha.getMonth() === 0
    case 'anio': return fecha.getFullYear() === 2026
  }
}

function metodoLabel(metodo: string): string {
  const map: Record<string, string> = {
    efectivo: 'Efectivo',
    mercadopago: 'MercadoPago',
    tarjeta_debito: 'Tarjeta Débito',
    tarjeta_credito: 'Tarjeta Crédito',
    transferencia: 'Transferencia',
    yape: 'Yape',
    plin: 'Plin',
  }
  return map[metodo] || metodo
}

const CHART_COLORS = {
  line: '#eab308',
  grid: 'rgba(255,255,255,0.06)',
  text: 'rgba(255,255,255,0.4)',
}

export default function IngresosPage() {
  const [filtro, setFiltro] = useState<FiltroPeriodo>('mes')
  const [fecha, setFecha] = useState(new Date())
  const [timeSeries, setTimeSeries] = useState<TimeSeriesPoint[]>([])
  const [pagos, setPagos] = useState<PagoItem[]>([])
  const [totalGeneral, setTotalGeneral] = useState(0)
  const [totalPagos, setTotalPagos] = useState(0)
  const [loading, setLoading] = useState(true)
  const [chartLoading, setChartLoading] = useState(false)
  const chartRef = useRef<HTMLDivElement>(null)

  const cargarIngresos = useCallback(async () => {
    setLoading(true)
    try {
      const fechaPeru = new Intl.DateTimeFormat('sv-SE', { timeZone: 'America/Lima' }).format(fecha)
      const params = new URLSearchParams({ filtro, fecha: fechaPeru })
      const response = await fetch(`/api/gerente/ingresos?${params.toString()}`)
      if (response.ok) {
        const result = await response.json()
        setTimeSeries(result.timeSeries || [])
        setPagos(result.pagos || [])
        setTotalGeneral(result.resumen?.totalGeneral || 0)
        setTotalPagos(result.resumen?.totalPagos || 0)
      }
    } catch (error) {
      console.error('Error al cargar ingresos:', error)
    } finally {
      setLoading(false)
    }
  }, [filtro, fecha])

  useEffect(() => {
    cargarIngresos()
  }, [cargarIngresos])

  const handleDownloadChart = async () => {
    if (!chartRef.current) return
    setChartLoading(true)
    try {
      const dataUrl = await toPng(chartRef.current, {
        backgroundColor: '#09090b',
        pixelRatio: 2,
      })
      const link = document.createElement('a')
      link.download = `ingresos-${filtro}-${fecha.toISOString().split('T')[0]}.png`
      link.href = dataUrl
      link.click()
    } catch (err) {
      console.error('Error al descargar gráfico:', err)
    } finally {
      setChartLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <DollarSign className="size-6" />
            Ingresos
          </h1>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {FILTROS.map(({ value, label }) => (
          <Button
            key={value}
            variant={filtro === value ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFiltro(value)}
            className={filtro === value
              ? 'bg-yellow-500 text-zinc-950 hover:bg-yellow-400'
              : 'border-zinc-700 text-zinc-300 hover:bg-zinc-800'
            }
          >
            {label}
          </Button>
        ))}
      </div>

      <div className="flex items-center justify-center gap-4">
        <Button
          variant="outline"
          size="icon"
          className="size-8 border-zinc-700 text-zinc-400 hover:bg-zinc-800"
          onClick={() => setFecha(navegarFecha(fecha, filtro, -1))}
          disabled={estaEnLimiteInferior(fecha, filtro)}
        >
          <ChevronLeft className="size-4" />
        </Button>
        <span className="text-white font-medium min-w-[200px] text-center capitalize">
          {formatFecha(fecha, filtro)}
        </span>
        <Button
          variant="outline"
          size="icon"
          className="size-8 border-zinc-700 text-zinc-400 hover:bg-zinc-800"
          onClick={() => setFecha(navegarFecha(fecha, filtro, 1))}
        >
          <ChevronRight className="size-4" />
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="size-8 text-yellow-500 animate-spin" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-4">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                  <TrendingUp className="size-5 text-yellow-500" />
                </div>
                <div>
                  <p className="text-zinc-400 text-sm">Total General</p>
                  <p className="text-white text-xl font-bold">{formatCurrency(totalGeneral)}</p>
                </div>
              </div>
            </div>
            <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-4">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <Receipt className="size-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-zinc-400 text-sm">Total Pagos</p>
                  <p className="text-white text-xl font-bold">{totalPagos}</p>
                </div>
              </div>
            </div>
          </div>

          {timeSeries.length > 0 && (
            <div className="rounded-lg border border-zinc-800 bg-zinc-900/30 p-4 md:p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-zinc-300 uppercase tracking-wider">
                  Evolución de Ingresos
                </h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDownloadChart}
                  disabled={chartLoading}
                  className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 gap-2 text-xs"
                >
                  <Download className="size-3.5" />
                  {chartLoading ? 'Generando...' : 'Descargar gráfico'}
                </Button>
              </div>
              <div ref={chartRef} className="w-full">
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={timeSeries} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} />
                    <XAxis
                      dataKey="label"
                      stroke={CHART_COLORS.text}
                      tick={{ fill: CHART_COLORS.text, fontSize: 11 }}
                      tickLine={false}
                      interval="preserveStartEnd"
                    />
                    <YAxis
                      stroke={CHART_COLORS.text}
                      tick={{ fill: CHART_COLORS.text, fontSize: 11 }}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(v: number) => `S/${v}`}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#18181b',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '8px',
                        color: '#fff',
                        fontSize: '12px',
                      }}
                      formatter={(value: number) => [formatCurrency(value), 'Ingresos']}
                      labelStyle={{ color: 'rgba(255,255,255,0.6)', marginBottom: '4px' }}
                    />
                    <Line
                      type="monotone"
                      dataKey="total"
                      stroke={CHART_COLORS.line}
                      strokeWidth={2}
                      dot={{ r: 3, fill: CHART_COLORS.line, strokeWidth: 0 }}
                      activeDot={{ r: 5, fill: CHART_COLORS.line, strokeWidth: 2, stroke: '#09090b' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {pagos.length === 0 ? (
            <div className="rounded-lg border border-zinc-800 bg-zinc-900/30 py-16 text-center">
              <AlertCircle className="size-12 text-zinc-600 mx-auto mb-4" />
              <p className="text-zinc-400 text-lg font-medium">No hubo ingresos</p>
              <p className="text-zinc-500 text-sm mt-1">No se registraron pagos en este período</p>
            </div>
          ) : (
            <div className="rounded-lg border border-zinc-800 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-zinc-900">
                    <TableHead className="text-zinc-300">Fecha</TableHead>
                    <TableHead className="text-zinc-300 hidden sm:table-cell">Hora</TableHead>
                    <TableHead className="text-zinc-300 text-right">Monto</TableHead>
                    <TableHead className="text-zinc-300 hidden md:table-cell">Método</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pagos.map((p) => (
                    <TableRow key={p.id} className="border-zinc-800 hover:bg-zinc-900/50">
                      <TableCell className="text-white font-mono text-sm">
                        {p.fecha}
                      </TableCell>
                      <TableCell className="text-zinc-400 font-mono text-sm hidden sm:table-cell">
                        {p.hora}
                      </TableCell>
                      <TableCell className="text-right font-mono text-yellow-400">
                        {formatCurrency(p.monto)}
                      </TableCell>
                      <TableCell className="text-zinc-400 text-sm hidden md:table-cell">
                        {metodoLabel(p.metodo)}
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="border-zinc-800 bg-zinc-900/80 font-bold">
                    <TableCell className="text-white" colSpan={2}>Total</TableCell>
                    <TableCell className="text-right font-mono text-yellow-400">
                      {formatCurrency(totalGeneral)}
                    </TableCell>
                    <TableCell className="hidden md:table-cell" />
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          )}
        </>
      )}
    </div>
  )
}
