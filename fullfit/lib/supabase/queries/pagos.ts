import type { SupabaseClient } from '@supabase/supabase-js'
import { formatearFechaLima, getFechaLima, parsearFechaLima } from '@/lib/utils'

type PaymentData = {
  id: string | number
  status: string
  transaction_amount: number
  payment_type_id: string
  metadata: Record<string, string> | undefined
}

type ProcessResult = {
  success: boolean
  message?: string
  subscription_id?: number
  error?: string
}

export async function processPaymentActivation(
  supabaseAdmin: SupabaseClient,
  payment: PaymentData
): Promise<ProcessResult> {
  const referencia = String(payment.id)

  const { data: existingPago } = await supabaseAdmin
    .from('pagos')
    .select('id')
    .eq('referencia', referencia)
    .maybeSingle()

  if (existingPago) {
    return { success: true, message: 'Already processed' }
  }

  if (payment.status !== 'approved') {
    const metadata = payment.metadata
    if (metadata?.user_id) {
      await supabaseAdmin.from('pagos').insert({
        suscripcion_id: null,
        usuario_id: metadata.user_id,
        monto: payment.transaction_amount || 0,
        metodo_pago: 'mercadopago',
        estado: 'fallido',
        referencia,
        observaciones: `Pago rechazado - ${payment.status || 'unknown'}`,
        registrado_por: metadata.user_id,
      })
    }
    return { success: true, message: 'Payment not approved' }
  }

  const metadata = payment.metadata
  if (!metadata?.user_id || !metadata?.plan_id) {
    console.error('[processPaymentActivation] Invalid metadata:', metadata)
    return { success: false, error: 'Invalid metadata' }
  }

  const userId = metadata.user_id
  const planId = Number(metadata.plan_id)

  const { data: perfil } = await supabaseAdmin
    .from('profiles')
    .select('id')
    .eq('id', userId)
    .maybeSingle()

  if (!perfil) {
    console.error('[processPaymentActivation] User not found:', userId)
    return { success: false, error: 'User not found' }
  }

  const { data: plan } = await supabaseAdmin
    .from('planes_membresia')
    .select('*')
    .eq('id', planId)
    .eq('activo', true)
    .maybeSingle()

  if (!plan) {
    console.error('[processPaymentActivation] Plan not found:', planId)
    return { success: false, error: 'Plan not found' }
  }

  const { data: membresiaActiva } = await supabaseAdmin
    .from('suscripciones')
    .select('id, fecha_fin')
    .eq('usuario_id', userId)
    .eq('estado', 'activa')
    .order('fecha_fin', { ascending: false })
    .maybeSingle()

  if (membresiaActiva) {
    const fechaFinActual = parsearFechaLima(membresiaActiva.fecha_fin)
    const nuevaFechaFin = new Date(fechaFinActual)
    nuevaFechaFin.setDate(nuevaFechaFin.getDate() + plan.duracion_dias)

    const { error: updateError } = await supabaseAdmin
      .from('suscripciones')
      .update({ fecha_fin: formatearFechaLima(nuevaFechaFin) })
      .eq('id', membresiaActiva.id)

    if (updateError) {
      console.error('[processPaymentActivation] Failed to extend subscription:', updateError)
      return { success: false, error: 'Failed to extend subscription' }
    }

    await supabaseAdmin.from('pagos').insert({
      suscripcion_id: membresiaActiva.id,
      usuario_id: userId,
      monto: payment.transaction_amount || 0,
      metodo_pago: 'mercadopago',
      estado: 'completado',
      referencia,
      observaciones: `Extensión de membresía - ${plan.duracion_dias} días añadidos`,
      registrado_por: userId,
    })

    await supabaseAdmin.from('notificaciones').insert({
      usuario_id: userId,
      tipo: 'bienvenida',
      titulo: '¡Membresía extendida!',
      mensaje: `Tu membresía ${plan.nombre} ahora está activa hasta el ${formatearFechaLima(nuevaFechaFin)}.`,
    })

    return { success: true, subscription_id: membresiaActiva.id }
  }

  const hoy = parsearFechaLima(getFechaLima())
  const fechaFin = new Date(hoy)
  fechaFin.setDate(fechaFin.getDate() + plan.duracion_dias)

  const { data: suscripcion, error: subError } = await supabaseAdmin
    .from('suscripciones')
    .insert({
      usuario_id: userId,
      plan_id: plan.id,
      fecha_inicio: getFechaLima(),
      fecha_fin: formatearFechaLima(fechaFin),
      estado: 'activa',
      creado_por: userId,
    })
    .select('id')
    .maybeSingle()

  if (subError || !suscripcion) {
    console.error('[processPaymentActivation] Failed to create subscription:', subError, { userId, planId })
    return { success: false, error: 'Failed to create subscription' }
  }

  await supabaseAdmin.from('pagos').insert({
    suscripcion_id: suscripcion.id,
    usuario_id: userId,
    monto: payment.transaction_amount || 0,
    metodo_pago: 'mercadopago',
    estado: 'completado',
    referencia,
    observaciones: `MercadoPago - ${payment.payment_type_id}`,
    registrado_por: userId,
  })

  await supabaseAdmin.from('notificaciones').insert({
    usuario_id: userId,
    tipo: 'bienvenida',
    titulo: '¡Membresía activada!',
    mensaje: `Tu membresía ${plan.nombre} está activa hasta el ${formatearFechaLima(fechaFin)}.`,
  })

  return { success: true, subscription_id: suscripcion.id }
}
