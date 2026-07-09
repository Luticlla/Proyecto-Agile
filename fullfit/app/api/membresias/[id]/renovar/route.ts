import { NextRequest, NextResponse } from 'next/server'
import { renovarMembresia, obtenerMembresia } from '@/lib/supabase/queries/membresias'
import { crearPreferenciaPago } from '@/lib/mercadopago-preferencia'
import { generarBoletaBase64 } from '@/lib/utils/boleta'
import { requireAuthenticatedRecepcionista } from '@/lib/auth/api-guard'
import type { RenovarMembresiaDTO, BoletaData } from '@/lib/supabase/queries/membresias.types'

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

      const boletaData: BoletaData = {
        numero_boleta: `BV-${Date.now()}`,
        fecha: fechaInicio,
        cliente: {
          nombre: `${cliente?.nombre || ''} ${cliente?.apellido || ''}`,
          dni: cliente?.dni || ''
        },
        plan: {
          nombre: plan?.nombre || '',
          precio: plan?.precio || monto
        },
        monto_total: monto,
        fecha_inicio: membresia?.fecha_fin || fechaInicio,
        fecha_fin: fechaFinDate.toISOString().split('T')[0]
      }

      const boletaBase64 = await generarBoletaBase64(boletaData)

      return NextResponse.json({
        success: true,
        boleta: boletaBase64,
        numero_boleta: boletaData.numero_boleta
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
