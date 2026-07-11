import { NextRequest, NextResponse } from 'next/server'
import { renovarMembresia } from '@/lib/supabase/queries/membresias'
import { crearPreferenciaPago } from '@/lib/mercadopago-preferencia'
import { generarBoletaBase64, calcularIGV, obtenerSiguienteComprobante, formatearFechaEmision } from '@/lib/utils/boleta'
import { montoEnLetras } from '@/lib/utils/numero-a-letras'
import { requireAuthenticatedRecepcionista } from '@/lib/auth/api-guard'
import { createServiceRoleClient } from '@/lib/supabase/server'
import type { RenovarMembresiaDTO, BoletaData, BoletaItem } from '@/lib/supabase/queries/membresias.types'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAuthenticatedRecepcionista(request)
    if (!auth.success) return auth.response
    const { supabase, user } = auth

    const { id } = await params
    const membresiaId = parseInt(id)

    if (isNaN(membresiaId) || membresiaId <= 0) {
      return NextResponse.json(
        { error: 'ID de membresía inválido' },
        { status: 400 }
      )
    }

    const body = await request.json()
    const { plan_id, metodo_pago, monto } = body

    if (!plan_id || !metodo_pago || monto === undefined) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos: plan_id, metodo_pago, monto' },
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

    const dto: RenovarMembresiaDTO = {
      plan_id,
      metodo_pago,
      monto
    }

    const result = await renovarMembresia(membresiaId, dto, user.id, supabase)

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      )
    }

    await supabase.from('auditoria').insert({
      usuario_id: user.id,
      tabla_afectada: 'suscripciones',
      accion: 'RENOVAR',
      registro_id: membresiaId,
      detalle: { accion: 'renovar', membresia_id: membresiaId, plan_id }
    })

    if (metodo_pago === 'mercadopago') {
      const { data: plan } = await supabase
        .from('planes_membresia')
        .select('nombre')
        .eq('id', plan_id)
        .single()

      const { data: membresia } = await supabase
        .from('suscripciones')
        .select('usuario_id')
        .eq('id', membresiaId)
        .single()

      const preferenceResult = await crearPreferenciaPago({
        planId: plan_id,
        planNombre: plan?.nombre || '',
        userId: membresia?.usuario_id || '',
        monto,
        siteUrl: request.nextUrl.origin,
        metadata: {
          plan_id: String(plan_id),
          user_id: membresia?.usuario_id || '',
          suscripcion_id: String(membresiaId),
          tipo: 'renovacion'
        }
      })

      return NextResponse.json({
        success: true,
        init_point: preferenceResult.init_point
      })
    }

    if (metodo_pago === 'efectivo') {
      const { data: plan } = await supabase
        .from('planes_membresia')
        .select('nombre, precio, duracion_dias')
        .eq('id', plan_id)
        .single()

      const { data: membresia } = await supabase
        .from('suscripciones')
        .select('usuario_id, fecha_fin')
        .eq('id', membresiaId)
        .single()

      const { data: cliente } = await supabase
        .from('profiles')
        .select('nombre, apellido, dni')
        .eq('id', membresia?.usuario_id)
        .single()

      const fechaInicio = new Date().toISOString().split('T')[0]
      const fechaFinDate = new Date(membresia?.fecha_fin || new Date())
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
          codigo: membresia?.usuario_id?.slice(0, 8)
        },
        moneda: 'SOL',
        metodo_pago: metodo_pago,
        items: [item],
        subtotal: valorUnitario,
        igv: igv,
        total: total,
        total_letras: montoEnLetras(total),
        observaciones: `Renovación - Periodo: ${fechaInicio} al ${fechaFinDate.toISOString().split('T')[0]}`,
        fecha_inicio: membresia?.fecha_fin || fechaInicio,
        fecha_fin: fechaFinDate.toISOString().split('T')[0]
      }

      const boletaBase64 = await generarBoletaBase64(boletaData)

      const supabaseAdmin = createServiceRoleClient()
      await supabaseAdmin
        .from('pagos')
        .update({ referencia: numeroComprobante })
        .eq('suscripcion_id', membresiaId)
        .order('id', { ascending: false })
        .limit(1)

      return NextResponse.json({
        success: true,
        boleta: boletaBase64,
        numero_comprobante: numeroComprobante
      })
    }

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Error renovando membresía:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
