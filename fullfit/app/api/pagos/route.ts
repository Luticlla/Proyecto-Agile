import { NextRequest, NextResponse } from 'next/server'
import { crearPreferenciaPago } from '@/lib/mercadopago-preferencia'
import { requireAuthenticated } from '@/lib/auth/api-guard'
import { getFechaLima, parsearFechaLima } from '@/lib/utils'
import { calcularDiasRestantes } from '@/lib/utils/dates'
import { VENTANA_RENOVACION_DIAS } from '@/constants/memberships'

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAuthenticated(request)
    if (!auth.success) return auth.response
    const { supabase, user } = auth

    const { planId } = await request.json()
    const userId = user.id

    if (!planId || typeof planId !== 'number' || planId <= 0) {
      return NextResponse.json(
        { error: 'planId es requerido y debe ser un número válido' },
        { status: 400 }
      )
    }

    const { data: plan, error: planError } = await supabase
      .from('planes_membresia')
      .select('*')
      .eq('id', planId)
      .eq('activo', true)
      .single()

    if (planError || !plan) {
      return NextResponse.json(
        { error: 'Plan no encontrado o inactivo' },
        { status: 404 }
      )
    }

    const { data: membresiaActiva } = await supabase
      .from('suscripciones')
      .select('fecha_fin')
      .eq('usuario_id', userId)
      .eq('estado', 'activa')
      .order('fecha_fin', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (membresiaActiva) {
      const diffDias = calcularDiasRestantes(membresiaActiva.fecha_fin, getFechaLima())

      if (diffDias > VENTANA_RENOVACION_DIAS) {
        return NextResponse.json(
          { error: `Tu membresía está activa y vence en ${diffDias} días. Solo puedes renovar cuando falten ${VENTANA_RENOVACION_DIAS} días o menos.` },
          { status: 400 }
        )
      }
    }

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
      userId,
      monto: Number(plan.precio),
      metadata: {
        plan_id: String(plan.id),
        user_id: userId,
        fecha_inicio: fechaInicio,
        fecha_fin: fechaFin,
        dias_restantes: String(diasRestantes),
      }
    })

    if (!preferenceResult.init_point) {
      return NextResponse.json(
        { error: preferenceResult.error || 'Error al crear preferencia de pago' },
        { status: 500 }
      )
    }

    return NextResponse.json({ init_point: preferenceResult.init_point })

  } catch (error) {
    console.error('Error creating payment preference:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
