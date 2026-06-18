import type { SupabaseClient } from '@supabase/supabase-js'

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

function formatearFecha(date: Date): string {
  return date.toISOString().split('T')[0]
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
    return { success: false, error: 'User not found' }
  }

  const { data: plan } = await supabaseAdmin
    .from('planes_membresia')
    .select('*')
    .eq('id', planId)
    .eq('activo', true)
    .maybeSingle()

  if (!plan) {
    return { success: false, error: 'Plan not found' }
  }

  const { data: membresiaActiva } = await supabaseAdmin
    .from('suscripciones')
    .select('id')
    .eq('usuario_id', userId)
    .eq('estado', 'activa')
    .maybeSingle()

  if (membresiaActiva) {
    await supabaseAdmin.from('pagos').insert({
      suscripcion_id: null,
      usuario_id: userId,
      monto: payment.transaction_amount || 0,
      metodo_pago: 'mercadopago',
      estado: 'completado',
      referencia,
      observaciones: 'Ya posee membresía activa - pago registrado sin suscripción',
      registrado_por: userId,
    })
    return { success: true, message: 'Active membership exists' }
  }

  const diasRestantes = Number(metadata.dias_restantes) || 0
  let fechaInicio = new Date()
  const fechaFin = new Date()

  if (diasRestantes > 0) {
    const fechaFinReferencia = new Date(metadata.fecha_fin)
    fechaInicio = new Date(fechaFinReferencia)
    fechaFin.setTime(fechaFinReferencia.getTime())
    fechaFin.setDate(fechaFin.getDate() + plan.duracion_dias)
  } else {
    fechaFin.setDate(fechaFin.getDate() + plan.duracion_dias)
  }

  const { data: suscripcion, error: subError } = await supabaseAdmin
    .from('suscripciones')
    .insert({
      usuario_id: userId,
      plan_id: plan.id,
      fecha_inicio: formatearFecha(fechaInicio),
      fecha_fin: formatearFecha(fechaFin),
      estado: 'activa',
      creado_por: userId,
    })
    .select('id')
    .single()

  if (subError) {
    return { success: false, error: 'Failed to create subscription' }
  }

  const { error: pagoError } = await supabaseAdmin.from('pagos').insert({
    suscripcion_id: suscripcion.id,
    usuario_id: userId,
    monto: payment.transaction_amount || 0,
    metodo_pago: 'mercadopago',
    estado: 'completado',
    referencia,
    observaciones: `MercadoPago - ${payment.payment_type_id}${diasRestantes > 0 ? ` - ${diasRestantes} días acumulados` : ''}`,
    registrado_por: userId,
  })

  if (pagoError) {
    console.error('Error creating payment record:', pagoError)
  }

  const mensaje = diasRestantes > 0
    ? `Tu membresía ${plan.nombre} está activa hasta el ${formatearFecha(fechaFin)} (${diasRestantes} días de tu membresía anterior fueron acumulados).`
    : `Tu membresía ${plan.nombre} está activa hasta el ${formatearFecha(fechaFin)}.`

  await supabaseAdmin.from('notificaciones').insert({
    usuario_id: userId,
    tipo: 'bienvenida',
    titulo: '¡Membresía activada!',
    mensaje,
  })

  return { success: true, subscription_id: suscripcion.id }
}
