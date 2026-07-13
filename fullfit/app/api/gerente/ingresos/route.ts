import { NextRequest, NextResponse } from 'next/server'
import { requireAuthenticatedRecepcionista } from '@/lib/auth/api-guard'
import { createClient } from '@supabase/supabase-js'

type FiltroPeriodo = 'dia' | 'semana' | 'mes' | 'anio'

// Peru offset: UTC-5 (no DST)
const PERU_OFFSET_HOURS = 5

function calcularRangoFechas(filtro: FiltroPeriodo, fechaPeru: string): { inicio: Date; fin: Date } {
  const [year, month, day] = fechaPeru.split('-').map(Number)

  switch (filtro) {
    case 'dia': {
      // Midnight Peru = 05:00 UTC
      const inicio = new Date(Date.UTC(year, month - 1, day, PERU_OFFSET_HOURS, 0, 0, 0))
      // Next day 04:59:59.999 UTC = end of day Peru
      const fin = new Date(Date.UTC(year, month - 1, day + 1, PERU_OFFSET_HOURS - 1, 59, 59, 999))
      return { inicio, fin }
    }
    case 'semana': {
      // Create date at midnight Peru, then find Monday
      const fechaUTC = new Date(Date.UTC(year, month - 1, day, PERU_OFFSET_HOURS, 0, 0, 0))
      const diaSemana = fechaUTC.getUTCDay() // 0=Sunday
      const diffLunes = diaSemana === 0 ? -6 : 1 - diaSemana
      const inicio = new Date(Date.UTC(year, month - 1, day + diffLunes, PERU_OFFSET_HOURS, 0, 0, 0))
      const fin = new Date(Date.UTC(year, month - 1, day + diffLunes + 6, PERU_OFFSET_HOURS - 1, 59, 59, 999))
      return { inicio, fin }
    }
    case 'mes': {
      const inicio = new Date(Date.UTC(year, month - 1, 1, PERU_OFFSET_HOURS, 0, 0, 0))
      const fin = new Date(Date.UTC(year, month, 0, PERU_OFFSET_HOURS - 1, 59, 59, 999))
      return { inicio, fin }
    }
    case 'anio': {
      const inicio = new Date(Date.UTC(year, 0, 1, PERU_OFFSET_HOURS, 0, 0, 0))
      const fin = new Date(Date.UTC(year, 11, 31, PERU_OFFSET_HOURS - 1, 59, 59, 999))
      return { inicio, fin }
    }
  }
}

function formatearFechaISO(fechaPeru: string): string {
  return fechaPeru
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

    const fechaPeru = fechaParam || new Intl.DateTimeFormat('sv-SE', { timeZone: 'America/Lima' }).format(new Date())
    const { inicio, fin } = calcularRangoFechas(filtro, fechaPeru)

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
      fechaInicio: formatearFechaISO(fechaPeru),
      fechaFin: formatearFechaISO(fechaPeru),
    })
  } catch (error: any) {
    console.error('Error en GET /api/gerente/ingresos:', error)
    return NextResponse.json({ error: error.message || 'Error interno del servidor' }, { status: 500 })
  }
}
