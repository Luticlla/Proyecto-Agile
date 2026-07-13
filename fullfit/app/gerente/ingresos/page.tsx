'use client'

import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ChevronLeft, ChevronRight, DollarSign, TrendingUp, Receipt, Users, AlertCircle, Loader2 } from 'lucide-react'

type FiltroPeriodo = 'dia' | 'semana' | 'mes' | 'anio'

type IngresoRecepcionista = {
  id: string
  nombre: string
  apellido: string
  total_ingresado: number
  cantidad_pagos: number
}

type Resumen = {
  totalGeneral: number
  totalPagos: number
  totalRecepcionistas: number
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

export default function IngresosPage() {
  const [filtro, setFiltro] = useState<FiltroPeriodo>('mes')
  const [fecha, setFecha] = useState(new Date())
  const [data, setData] = useState<IngresoRecepcionista[]>([])
  const [resumen, setResumen] = useState<Resumen>({ totalGeneral: 0, totalPagos: 0, totalRecepcionistas: 0 })
  const [loading, setLoading] = useState(true)

  const cargarIngresos = useCallback(async () => {
    setLoading(true)
    try {
      const fechaPeru = new Intl.DateTimeFormat('sv-SE', { timeZone: 'America/Lima' }).format(fecha)
      const params = new URLSearchParams({ filtro, fecha: fechaPeru })
      const response = await fetch(`/api/gerente/ingresos?${params.toString()}`)
      if (response.ok) {
        const result = await response.json()
        setData(result.data)
        setResumen(result.resumen)
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

  const promedioPorPago = resumen.totalPagos > 0 ? resumen.totalGeneral / resumen.totalPagos : 0

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <DollarSign className="size-6" />
            Ingresos por Recepcionistas
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-4">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                  <TrendingUp className="size-5 text-yellow-500" />
                </div>
                <div>
                  <p className="text-zinc-400 text-sm">Total General</p>
                  <p className="text-white text-xl font-bold">{formatCurrency(resumen.totalGeneral)}</p>
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
                  <p className="text-white text-xl font-bold">{resumen.totalPagos}</p>
                </div>
              </div>
            </div>
            <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-4">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                  <Users className="size-5 text-green-400" />
                </div>
                <div>
                  <p className="text-zinc-400 text-sm">Recepcionistas</p>
                  <p className="text-white text-xl font-bold">{resumen.totalRecepcionistas}</p>
                </div>
              </div>
            </div>
          </div>

          {data.length === 0 ? (
            <div className="rounded-lg border border-zinc-800 bg-zinc-900/30 py-16 text-center">
              <AlertCircle className="size-12 text-zinc-600 mx-auto mb-4" />
              <p className="text-zinc-400 text-lg font-medium">No hubo ingresos</p>
              <p className="text-zinc-500 text-sm mt-1">No se registraron membresías en este período</p>
            </div>
          ) : (
            <div className="rounded-lg border border-zinc-800 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-zinc-900">
                    <TableHead className="text-zinc-300">Recepcionista</TableHead>
                    <TableHead className="text-zinc-300 text-right">Total Ingresado</TableHead>
                    <TableHead className="text-zinc-300 text-right">Pagos</TableHead>
                    <TableHead className="text-zinc-300 text-right hidden md:table-cell">Promedio/Pago</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.map((r) => (
                    <TableRow key={r.id} className="border-zinc-800 hover:bg-zinc-900/50">
                      <TableCell className="text-white font-medium">
                        {r.nombre} {r.apellido}
                      </TableCell>
                      <TableCell className="text-right font-mono text-yellow-400">
                        {formatCurrency(r.total_ingresado)}
                      </TableCell>
                      <TableCell className="text-right text-zinc-300">
                        {r.cantidad_pagos}
                      </TableCell>
                      <TableCell className="text-right text-zinc-400 font-mono hidden md:table-cell">
                        {formatCurrency(r.total_ingresado / r.cantidad_pagos)}
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="border-zinc-800 bg-zinc-900/80 font-bold">
                    <TableCell className="text-white">Total</TableCell>
                    <TableCell className="text-right font-mono text-yellow-400">
                      {formatCurrency(resumen.totalGeneral)}
                    </TableCell>
                    <TableCell className="text-right text-white">
                      {resumen.totalPagos}
                    </TableCell>
                    <TableCell className="text-right font-mono text-zinc-300 hidden md:table-cell">
                      {formatCurrency(promedioPorPago)}
                    </TableCell>
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
