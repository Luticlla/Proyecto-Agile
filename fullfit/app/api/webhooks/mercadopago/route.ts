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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    if (body.type !== 'payment') {
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

    if (payment.status === 'approved') {
      const metadata = payment.metadata as Record<string, string> | undefined

      const { data: suscripcion, error: subError } = await supabaseAdmin
        .from('suscripciones')
        .insert({
          usuario_id: metadata?.user_id || '',
          plan_id: Number(metadata?.plan_id) || 0,
          fecha_inicio: metadata?.fecha_inicio || new Date().toISOString().split('T')[0],
          fecha_fin: metadata?.fecha_fin || new Date().toISOString().split('T')[0],
          estado: 'activa',
          creado_por: metadata?.user_id || '',
        })
        .select('id')
        .single()

      if (subError) {
        console.error('Error creating subscription:', subError)
      }

      if (suscripcion) {
        const { error: pagoError } = await supabaseAdmin
          .from('pagos')
          .insert({
            suscripcion_id: suscripcion.id,
            usuario_id: metadata?.user_id || '',
            monto: payment.transaction_amount || 0,
            metodo_pago: 'mercadopago',
            estado: 'completado',
            referencia: String(payment.id),
            observaciones: `Mercado Pago - ${payment.payment_type_id}`,
            registrado_por: metadata?.user_id || '',
          })

        if (pagoError) {
          console.error('Error creating payment record:', pagoError)
        }
      }

    } else if (payment.status === 'rejected') {
      const metadata = payment.metadata as Record<string, string> | undefined
      await supabaseAdmin
        .from('pagos')
        .insert({
          suscripcion_id: 0,
          usuario_id: metadata?.user_id || '',
          monto: payment.transaction_amount || 0,
          metodo_pago: 'mercadopago',
          estado: 'fallido',
          referencia: String(payment.id),
          observaciones: `Pago rechazado - ${payment.status_detail}`,
          registrado_por: metadata?.user_id || '',
        })
    }

    return NextResponse.json({ received: true })

  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 })
  }
}
