import { MercadoPagoConfig, Payment } from 'mercadopago'
import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN!,
})

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

function formatearFecha(date: Date): string {
  return date.toISOString().split('T')[0]
}

export async function POST(request: NextRequest) {
  console.log('=== VERIFICAR PAGO: INICIO ===')

  try {
    const { payment_id } = await request.json()
    console.log('1. payment_id recibido:', payment_id)

    if (!payment_id) {
      console.log('1a. ERROR: payment_id es null/undefined')
      return NextResponse.json(
        { error: 'payment_id es requerido' },
        { status: 400 }
      )
    }

    console.log('2. Consultando MercadoPago API...')
    const payment = await new Payment(client).get({ id: String(payment_id) })
    console.log('2a. MercadoPago response:', {
      id: payment.id,
      status: payment.status,
      status_detail: payment.status_detail,
      transaction_amount: payment.transaction_amount,
      metadata: payment.metadata,
    })

    if (payment.status !== 'approved') {
      console.log('2b. Pago NO aprobado. Status:', payment.status)
      return NextResponse.json(
        { error: 'Pago no aprobado', status: payment.status },
        { status: 400 }
      )
    }

    console.log('3. Pago aprobado. Verificando si ya fue procesado...')
    const { data: existingPago, error: existingError } = await supabaseAdmin
      .from('pagos')
      .select('id')
      .eq('referencia', String(payment.id))
      .maybeSingle()

    console.log('3a. Resultado deduplicación:', { existingPago, existingError })

    if (existingPago) {
      console.log('3b. Pago YA procesado. ID:', existingPago.id)
      return NextResponse.json({ success: true, message: 'Already processed' })
    }

    const metadata = payment.metadata as Record<string, string> | undefined
    console.log('4. Metadata del pago:', metadata)

    if (!metadata?.user_id || !metadata?.plan_id) {
      console.error('4a. ERROR: Metadata incompleta. user_id:', metadata?.user_id, 'plan_id:', metadata?.plan_id)
      return NextResponse.json({ error: 'Invalid metadata' }, { status: 400 })
    }

    const userId = metadata.user_id
    const planId = Number(metadata.plan_id)
    console.log('4b. userId:', userId, 'planId:', planId)

    console.log('5. Buscando perfil del usuario...')
    const { data: perfil, error: perfilError } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .eq('id', userId)
      .maybeSingle()

    console.log('5a. Resultado perfil:', { perfil, perfilError })

    if (!perfil) {
      console.error('5b. ERROR: Usuario no encontrado en profiles:', userId)
      return NextResponse.json({ error: 'User not found' }, { status: 400 })
    }

    console.log('6. Buscando plan de membresía...')
    const { data: plan, error: planError } = await supabaseAdmin
      .from('planes_membresia')
      .select('*')
      .eq('id', planId)
      .eq('activo', true)
      .maybeSingle()

    console.log('6a. Resultado plan:', { plan, planError })

    if (!plan) {
      console.error('6b. ERROR: Plan no encontrado o inactivo:', planId)
      return NextResponse.json({ error: 'Plan not found' }, { status: 400 })
    }

    console.log('7. Verificando membresía activa existente...')
    const { data: membresiaActiva, error: membresiaError } = await supabaseAdmin
      .from('suscripciones')
      .select('id')
      .eq('usuario_id', userId)
      .eq('estado', 'activa')
      .maybeSingle()

    console.log('7a. Membresía activa:', { membresiaActiva, membresiaError })

    if (membresiaActiva) {
      console.log('7b. Usuario YA tiene membresía activa. Registrando pago sin suscripción...')
      const { error: pagoExistenteError } = await supabaseAdmin.from('pagos').insert({
        suscripcion_id: null,
        usuario_id: userId,
        monto: payment.transaction_amount || 0,
        metodo_pago: 'mercadopago',
        estado: 'completado',
        referencia: String(payment.id),
        observaciones: 'Ya posee membresía activa - pago registrado sin suscripción',
        registrado_por: userId,
      })
      console.log('7c. Resultado insert pago existente:', { pagoExistenteError })
      return NextResponse.json({ success: true, message: 'Active membership exists' })
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

    console.log('8. Creando suscripción...', {
      userId,
      planId: plan.id,
      fechaInicio: formatearFecha(fechaInicio),
      fechaFin: formatearFecha(fechaFin),
      diasRestantes,
    })

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

    console.log('8a. Resultado insert suscripción:', { suscripcion, subError })

    if (subError) {
      console.error('8b. ERROR creando suscripción:', subError)
      return NextResponse.json({ error: 'Failed to create subscription' }, { status: 500 })
    }

    console.log('9. Creando registro de pago...')
    const { error: pagoError } = await supabaseAdmin.from('pagos').insert({
      suscripcion_id: suscripcion.id,
      usuario_id: userId,
      monto: payment.transaction_amount || 0,
      metodo_pago: 'mercadopago',
      estado: 'completado',
      referencia: String(payment.id),
      observaciones: `MercadoPago - ${payment.payment_type_id}${diasRestantes > 0 ? ` - ${diasRestantes} días acumulados` : ''}`,
      registrado_por: userId,
    })

    console.log('9a. Resultado insert pago:', { pagoError })

    if (pagoError) {
      console.error('9b. ERROR creando pago:', pagoError)
    }

    const mensaje = diasRestantes > 0
      ? `Tu membresía ${plan.nombre} está activa hasta el ${formatearFecha(fechaFin)} (${diasRestantes} días de tu membresía anterior fueron acumulados).`
      : `Tu membresía ${plan.nombre} está activa hasta el ${formatearFecha(fechaFin)}.`

    console.log('10. Creando notificación...')
    const { error: notifError } = await supabaseAdmin.from('notificaciones').insert({
      usuario_id: userId,
      tipo: 'bienvenida',
      titulo: '¡Membresía activada!',
      mensaje,
    })

    console.log('10a. Resultado insert notificación:', { notifError })

    console.log('=== VERIFICAR PAGO: ÉXITO ===')
    return NextResponse.json({ success: true, subscription_id: suscripcion.id })

  } catch (error) {
    console.error('=== VERIFICAR PAGO: ERROR GENERAL ===', error)
    return NextResponse.json({ error: 'Verification handler failed' }, { status: 500 })
  }
}
