import { NextRequest, NextResponse } from 'next/server'
import { listarMembresias, registrarMembresia } from '@/lib/supabase/queries/membresias'
import { crearPreferenciaPago } from '@/lib/mercadopago-preferencia'
import { generarBoletaBase64, calcularIGV, obtenerSiguienteComprobante, formatearFechaEmision } from '@/lib/utils/boleta'
import { montoEnLetras } from '@/lib/utils/numero-a-letras'
import { requireAuthenticatedRecepcionista } from '@/lib/auth/api-guard'
import { createServiceRoleClient } from '@/lib/supabase/server'
import { getFechaLima, parsearFechaLima } from '@/lib/utils'
import { calcularDiasRestantes } from '@/lib/utils/dates'
import type { RegistrarMembresiaDTO, BoletaData, BoletaItem } from '@/lib/supabase/queries/membresias.types'

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAuthenticatedRecepcionista(request)
    if (!auth.success) return auth.response
    const { supabase } = auth
    const { searchParams } = new URL(request.url)
    const buscar = searchParams.get('buscar') || undefined
    const estado = searchParams.get('estado') || 'todos'
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    const result = await listarMembresias({
      buscar,
      estado: estado as 'todos' | 'activas' | 'vencidas' | 'canceladas' | 'suspendidas' | 'por_vencer',
      page,
      limit
    }, supabase)

    return NextResponse.json(result)

  } catch (error) {
    console.error('Error listando membresías:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAuthenticatedRecepcionista(request)
    if (!auth.success) return auth.response
    const { supabase, user } = auth
    const body = await request.json()
    const { usuario_id, plan_id, metodo_pago, monto, return_to } = body

    if (!usuario_id || !plan_id || !metodo_pago || monto === undefined) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos: usuario_id, plan_id, metodo_pago, monto' },
        { status: 400 }
      )
    }

    if (!['efectivo', 'mercadopago'].includes(metodo_pago)) {
      return NextResponse.json(
        { error: 'metodo_pago debe ser "efectivo" o "mercadopago"' },
        { status: 400 }
      )
    }

    if (typeof monto !== 'number' || monto < 0) {
      return NextResponse.json(
        { error: 'monto debe ser un número mayor o igual a 0' },
        { status: 400 }
      )
    }

    if (metodo_pago === 'mercadopago') {
      const { data: plan } = await supabase
        .from('planes_membresia')
        .select('*')
        .eq('id', plan_id)
        .eq('activo', true)
        .single()

      if (!plan) {
        return NextResponse.json(
          { error: 'Plan no encontrado o inactivo' },
          { status: 404 }
        )
      }

      const { data: membresiaActiva } = await supabase
        .from('suscripciones')
        .select('fecha_fin')
        .eq('usuario_id', usuario_id)
        .eq('estado', 'activa')
        .order('fecha_fin', { ascending: false })
        .limit(1)
        .maybeSingle()

      let fechaInicio = getFechaLima()
      let fechaFin = getFechaLima()
      let diasRestantes = 0

      if (membresiaActiva) {
        const diffDias = calcularDiasRestantes(membresiaActiva.fecha_fin, getFechaLima())
        if (diffDias > 0) {
          diasRestantes = diffDias
          const fechaFinActual = parsearFechaLima(membresiaActiva.fecha_fin)
          const nuevaFin = new Date(fechaFinActual)
          nuevaFin.setDate(nuevaFin.getDate() + plan.duracion_dias)
          fechaInicio = membresiaActiva.fecha_fin
          fechaFin = nuevaFin.toISOString().split('T')[0]
        }
      }

      const preferenceResult = await crearPreferenciaPago({
        planId: plan.id,
        planNombre: plan.nombre,
        userId: usuario_id,
        monto: Number(plan.precio),
        siteUrl: request.nextUrl.origin,
        returnTo: return_to,
        metadata: {
          plan_id: String(plan.id),
          user_id: usuario_id,
          fecha_inicio: fechaInicio,
          fecha_fin: fechaFin,
          dias_restantes: String(diasRestantes),
          registrado_por: user.id,
        }
      })

      if (!preferenceResult.init_point) {
        return NextResponse.json(
          { error: preferenceResult.error || 'Error al crear preferencia de pago' },
          { status: 500 }
        )
      }

      return NextResponse.json({ init_point: preferenceResult.init_point })
    }

    const dto: RegistrarMembresiaDTO = {
      usuario_id,
      plan_id,
      metodo_pago,
      monto
    }

    const result = await registrarMembresia(dto, user.id, supabase)

    if (result.error) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      )
    }

    const { data: plan } = await supabase
      .from('planes_membresia')
      .select('nombre, precio, duracion_dias')
      .eq('id', plan_id)
      .single()

    const { data: cliente } = await supabase
      .from('profiles')
      .select('nombre, apellido, dni')
      .eq('id', usuario_id)
      .single()

    const fechaInicio = new Date().toISOString().split('T')[0]
    const fechaFinDate = new Date()
    fechaFinDate.setDate(fechaFinDate.getDate() + (plan?.duracion_dias || 30))

    const planPrecio = plan?.precio || monto
    const { valorUnitario, igv, total } = calcularIGV(planPrecio)

    const item: BoletaItem = {
      descripcion: plan?.nombre || '',
      cantidad: 1,
      valor_unitario: valorUnitario,
      precio_unitario: planPrecio,
      valor_total: valorUnitario
    }

    const numeroComprobante = await obtenerSiguienteComprobante()

    const boletaData: BoletaData = {
      numero_comprobante: numeroComprobante,
      fecha_emision: formatearFechaEmision(fechaInicio),
      cliente: {
        nombre: `${cliente?.nombre || ''} ${cliente?.apellido || ''}`.trim(),
        dni: cliente?.dni || '',
        codigo: usuario_id.slice(0, 8)
      },
      moneda: 'SOL',
      metodo_pago: metodo_pago,
      items: [item],
      subtotal: valorUnitario,
      igv: igv,
      total: total,
      total_letras: montoEnLetras(total),
      observaciones: `Periodo: ${fechaInicio} al ${fechaFinDate.toISOString().split('T')[0]}`,
      fecha_inicio: fechaInicio,
      fecha_fin: fechaFinDate.toISOString().split('T')[0]
    }

    const boletaBase64 = await generarBoletaBase64(boletaData)

    const supabaseAdmin = createServiceRoleClient()
    await supabaseAdmin
      .from('pagos')
      .update({ referencia: numeroComprobante })
      .eq('id', result.pago.id)

    return NextResponse.json({
      suscripcion: result.suscripcion,
      pago: result.pago,
      boleta: boletaBase64,
      numero_comprobante: numeroComprobante
    })

  } catch (error) {
    console.error('Error registrando membresía:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
