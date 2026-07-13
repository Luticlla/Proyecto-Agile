import { NextRequest, NextResponse } from 'next/server'
import { requireAuthenticatedRecepcionista } from '@/lib/auth/api-guard'
import { createClient } from '@supabase/supabase-js'

type FiltroPeriodo = 'dia' | 'semana' | 'mes' | 'anio'

function pad(n: number): string {
  return n.toString().padStart(2, '0')
}

function calcularRangoFechas(filtro: FiltroPeriodo, fechaPeru: string): { inicio: string; fin: string } {
  const [year, month, day] = fechaPeru.split('-').map(Number)

  switch (filtro) {
    case 'dia': {
      const inicio = `${year}-${pad(month)}-${pad(day)} 00:00:00`
      const fin = `${year}-${pad(month)}-${pad(day)} 23:59:59.999`
      return { inicio, fin }
    }
    case 'semana': {
      const refDate = new Date(year, month - 1, day)
      const diaSemana = refDate.getDay()
      const diffLunes = diaSemana === 0 ? -6 : 1 - diaSemana
      const lunes = new Date(year, month - 1, day + diffLunes)
      const domingo = new Date(lunes)
      domingo.setDate(lunes.getDate() + 6)
      const inicio = `${lunes.getFullYear()}-${pad(lunes.getMonth() + 1)}-${pad(lunes.getDate())} 00:00:00`
      const fin = `${domingo.getFullYear()}-${pad(domingo.getMonth() + 1)}-${pad(domingo.getDate())} 23:59:59.999`
      return { inicio, fin }
    }
    case 'mes': {
      const inicio = `${year}-${pad(month)}-01 00:00:00`
      const ultimoDia = new Date(year, month, 0).getDate()
      const fin = `${year}-${pad(month)}-${pad(ultimoDia)} 23:59:59.999`
      return { inicio, fin }
    }
    case 'anio': {
      const inicio = `${year}-01-01 00:00:00`
      const fin = `${year}-12-31 23:59:59.999`
      return { inicio, fin }
    }
  }
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
    const fechaInicio = inicio.split(' ')[0]
    const fechaFin = fin.split(' ')[0]

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
      .gte('fecha_pago', inicio)
      .lte('fecha_pago', fin)

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
      fechaInicio,
      fechaFin,
    })
  } catch (error: any) {
    console.error('Error en GET /api/gerente/ingresos:', error)
    return NextResponse.json({ error: error.message || 'Error interno del servidor' }, { status: 500 })
  }
}
