import { MercadoPagoConfig, Payment } from 'mercadopago'
import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN!,
})

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

function verificarFirma(request: NextRequest, body: string): boolean {
  const secret = process.env.MP_WEBHOOK_SECRET
  if (!secret) {
    console.warn('MP_WEBHOOK_SECRET not set, skipping signature verification')
    return true
  }

  const signature = request.headers.get('x-signature')
  if (!signature) return false

  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(body)
    .digest('hex')

  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  )
}

function formatearFecha(date: Date): string {
  return date.toISOString().split('T')[0]
}

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text()

    if (!verificarFirma(request, rawBody)) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    }

    const body = JSON.parse(rawBody)

    if (body.type !== 'payment' || !body.data?.id) {
      return NextResponse.json({ received: true })
    }

    const payment = await new Payment(client).get({ id: body.data.id })

    const { data: existingPago } = await supabaseAdmin
      .from('pagos')
      .select('id')
      .eq('referencia', String(payment.id))
      .maybeSingle()

    if (existingPago) {
      return NextResponse.json({ received: true, message: 'Already processed' })
    }

    if (payment.status !== 'approved') {
      const metadata = payment.metadata as Record<string, string> | undefined
      if (metadata?.user_id) {
        await supabaseAdmin.from('pagos').insert({
          suscripcion_id: null,
          usuario_id: metadata.user_id,
          monto: payment.transaction_amount || 0,
          metodo_pago: 'mercadopago',
          estado: 'fallido',
          referencia: String(payment.id),
          observaciones: `Pago rechazado - ${payment.status_detail}`,
          registrado_por: metadata.user_id,
        })
      }
      return NextResponse.json({ received: true })
    }

    const metadata = payment.metadata as Record<string, string> | undefined
    if (!metadata?.user_id || !metadata?.plan_id) {
      console.error('Missing metadata in payment:', payment.id)
      return NextResponse.json({ error: 'Invalid metadata' }, { status: 400 })
    }

    const userId = metadata.user_id
    const planId = Number(metadata.plan_id)

    const { data: perfil } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .eq('id', userId)
      .maybeSingle()

    if (!perfil) {
      console.error('User not found:', userId)
      return NextResponse.json({ error: 'User not found' }, { status: 400 })
    }

    const { data: plan } = await supabaseAdmin
      .from('planes_membresia')
      .select('*')
      .eq('id', planId)
      .eq('activo', true)
      .maybeSingle()

    if (!plan) {
      console.error('Plan not found or inactive:', planId)
      return NextResponse.json({ error: 'Plan not found' }, { status: 400 })
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
        referencia: String(payment.id),
        observaciones: 'Ya posee membresía activa - pago registrado sin suscripción',
        registrado_por: userId,
      })
      return NextResponse.json({ received: true, message: 'Active membership exists' })
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
      console.error('Error creating subscription:', subError)
      return NextResponse.json({ error: 'Failed to create subscription' }, { status: 500 })
    }

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

    return NextResponse.json({ received: true })

  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 })
  }
}
