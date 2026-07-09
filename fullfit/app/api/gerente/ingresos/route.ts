import { NextRequest, NextResponse } from 'next/server'
import { requireAuthenticatedRecepcionista } from '@/lib/auth/api-guard'
import { createClient } from '@supabase/supabase-js'

type FiltroPeriodo = 'dia' | 'semana' | 'mes' | 'anio'

function calcularRangoFechas(filtro: FiltroPeriodo, fechaRef: Date): { inicio: Date; fin: Date } {
  const fecha = new Date(fechaRef)

  switch (filtro) {
    case 'dia': {
      const inicio = new Date(fecha)
      inicio.setHours(0, 0, 0, 0)
      const fin = new Date(fecha)
      fin.setHours(23, 59, 59, 999)
      return { inicio, fin }
    }
    case 'semana': {
      const diaSemana = fecha.getDay()
      const diffLunes = diaSemana === 0 ? -6 : 1 - diaSemana
      const inicio = new Date(fecha)
      inicio.setDate(fecha.getDate() + diffLunes)
      inicio.setHours(0, 0, 0, 0)
      const fin = new Date(inicio)
      fin.setDate(inicio.getDate() + 6)
      fin.setHours(23, 59, 59, 999)
      return { inicio, fin }
    }
    case 'mes': {
      const inicio = new Date(fecha.getFullYear(), fecha.getMonth(), 1)
      const fin = new Date(fecha.getFullYear(), fecha.getMonth() + 1, 0, 23, 59, 59, 999)
      return { inicio, fin }
    }
    case 'anio': {
      const inicio = new Date(fecha.getFullYear(), 0, 1)
      const fin = new Date(fecha.getFullYear(), 11, 31, 23, 59, 59, 999)
      return { inicio, fin }
    }
  }
}

function formatearFechaISO(fecha: Date): string {
  return fecha.toISOString().split('T')[0]
}

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAuthenticatedRecepcionista(request)
    if (!auth.success) return auth.response
    const { user } = auth

    const { searchParams } = new URL(request.url)
    const filtro = (searchParams.get('filtro') as FiltroPeriodo) || 'mes'
    const fechaParam = searchParams.get('fecha')

    if (!['dia', 'semana', 'mes', 'anio'].includes(filtro)) {
      return NextResponse.json({ error: 'Filtro inválido' }, { status: 400 })
    }

    const fechaRef = fechaParam ? new Date(fechaParam) : new Date()
    const { inicio, fin } = calcularRangoFechas(filtro, fechaRef)

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { data, error } = await supabaseAdmin
      .from('pagos')
      .select(`
        monto,
        registrado_por:profiles!pagos_registrado_por_fkey(id, nombre, apellido, rol_id)
      `)
      .eq('estado', 'completado')
      .gte('fecha_pago', inicio.toISOString())
      .lte('fecha_pago', fin.toISOString())

    if (error) {
      console.error('Error obteniendo ingresos:', error)
      return NextResponse.json({ error: 'Error al obtener ingresos' }, { status: 500 })
    }

    const ingresosPorRecepcionista = new Map<string, {
      id: string
      nombre: string
      apellido: string
      total_ingresado: number
      cantidad_pagos: number
    }>()

    let totalGeneral = 0
    let totalPagos = 0

    for (const pago of data || []) {
      const perfil = pago.registrado_por as unknown as Record<string, unknown> | null
      if (!perfil) continue
      if (perfil.rol_id !== 2) continue

      const perfilId = perfil.id as string
      const existing = ingresosPorRecepcionista.get(perfilId)

      if (existing) {
        existing.total_ingresado += pago.monto
        existing.cantidad_pagos += 1
      } else {
        ingresosPorRecepcionista.set(perfilId, {
          id: perfilId,
          nombre: perfil.nombre as string,
          apellido: perfil.apellido as string,
          total_ingresado: pago.monto,
          cantidad_pagos: 1,
        })
      }

      totalGeneral += pago.monto
      totalPagos += 1
    }

    const dataResultado = Array.from(ingresosPorRecepcionista.values())
      .sort((a, b) => b.total_ingresado - a.total_ingresado)

    return NextResponse.json({
      data: dataResultado,
      resumen: {
        totalGeneral,
        totalPagos,
        totalRecepcionistas: dataResultado.length,
      },
      filtro,
      fechaInicio: formatearFechaISO(inicio),
      fechaFin: formatearFechaISO(fin),
    })
  } catch (error: any) {
    console.error('Error en GET /api/gerente/ingresos:', error)
    return NextResponse.json({ error: error.message || 'Error interno del servidor' }, { status: 500 })
  }
}
