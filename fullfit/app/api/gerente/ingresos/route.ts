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

function generarLabels(filtro: FiltroPeriodo, fechaPeru: string): string[] {
  const [year, month, day] = fechaPeru.split('-').map(Number)

  switch (filtro) {
    case 'dia':
      return Array.from({ length: 24 }, (_, i) => `${pad(i)}:00`)
    case 'semana': {
      const refDate = new Date(year, month - 1, day)
      const diaSemana = refDate.getDay()
      const diffLunes = diaSemana === 0 ? -6 : 1 - diaSemana
      const lunes = new Date(year, month - 1, day + diffLunes)
      const dias: string[] = []
      const nombres = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
      for (let i = 0; i < 7; i++) {
        const d = new Date(lunes)
        d.setDate(lunes.getDate() + i)
        dias.push(`${nombres[d.getDay()]} ${pad(d.getDate())}`)
      }
      return dias
    }
    case 'mes': {
      const ultimoDia = new Date(year, month, 0).getDate()
      return Array.from({ length: ultimoDia }, (_, i) => `${pad(i + 1)}`)
    }
    case 'anio':
      return ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
  }
}

function extraerPeriodoKey(fecha: string, filtro: FiltroPeriodo): number {
  const d = new Date(fecha)
  switch (filtro) {
    case 'dia': return d.getHours()
    case 'semana': return d.getDay()
    case 'mes': return d.getDate() - 1
    case 'anio': return d.getMonth()
  }
}

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAuthenticatedRecepcionista(request)
    if (!auth.success) return auth.response

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
        id,
        monto,
        metodo_pago,
        fecha_pago,
        suscripcion_id,
        usuario_id,
        registrado_por
      `)
      .eq('estado', 'completado')
      .gte('fecha_pago', inicio)
      .lte('fecha_pago', fin)
      .order('fecha_pago', { ascending: true })

    if (error) {
      console.error('Error obteniendo ingresos:', error)
      return NextResponse.json({ error: 'Error al obtener ingresos' }, { status: 500 })
    }

    const labels = generarLabels(filtro, fechaPeru)
    const timeSeriesMap = new Map<number, number>()
    labels.forEach((_, i) => timeSeriesMap.set(i, 0))

    let totalGeneral = 0
    let totalPagos = 0

    const pagos: Array<{
      id: number
      fecha: string
      hora: string
      monto: number
      metodo: string
    }> = []

    for (const pago of data || []) {
      const monto = pago.monto as number
      totalGeneral += monto
      totalPagos += 1

      const fechaPago = pago.fecha_pago as string
      const fechaDate = new Date(fechaPago)
      const fechaLocal = fechaDate.toLocaleDateString('es-PE', { timeZone: 'America/Lima', day: '2-digit', month: '2-digit', year: 'numeric' })
      const horaLocal = fechaDate.toLocaleTimeString('es-PE', { timeZone: 'America/Lima', hour: '2-digit', minute: '2-digit', hour12: false })

      pagos.push({
        id: pago.id as number,
        fecha: fechaLocal,
        hora: horaLocal,
        monto,
        metodo: pago.metodo_pago as string,
      })

      const periodoIdx = extraerPeriodoKey(fechaPago, filtro)
      const current = timeSeriesMap.get(periodoIdx) || 0
      timeSeriesMap.set(periodoIdx, current + monto)
    }

    const timeSeries = labels.map((label, i) => ({
      label,
      total: timeSeriesMap.get(i) || 0,
    }))

    return NextResponse.json({
      resumen: { totalGeneral, totalPagos },
      timeSeries,
      pagos,
      filtro,
      fechaInicio,
      fechaFin,
    })
  } catch (error: any) {
    console.error('Error en GET /api/gerente/ingresos:', error)
    return NextResponse.json({ error: error.message || 'Error interno del servidor' }, { status: 500 })
  }
}
