import { Payment } from 'mercadopago'
import { NextRequest, NextResponse } from 'next/server'
import { getMercadoPagoClient } from '@/lib/mercadopago'
import { createServiceRoleClient } from '@/lib/supabase/server'
import { processPaymentActivation } from '@/lib/supabase/queries/pagos'

export async function POST(request: NextRequest) {
  try {
    const { payment_id } = await request.json()

    if (!payment_id) {
      return NextResponse.json(
        { error: 'payment_id es requerido' },
        { status: 400 }
      )
    }

    const client = getMercadoPagoClient()
    const payment = await new Payment(client).get({ id: String(payment_id) })

    if (payment.status !== 'approved') {
      return NextResponse.json(
        { error: 'Pago no aprobado', status: payment.status },
        { status: 400 }
      )
    }

    const supabaseAdmin = createServiceRoleClient()

    const result = await processPaymentActivation(supabaseAdmin, {
      id: String(payment.id),
      status: payment.status || '',
      transaction_amount: payment.transaction_amount || 0,
      payment_type_id: payment.payment_type_id || '',
      metadata: payment.metadata as Record<string, string> | undefined,
    })

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }

    return NextResponse.json({ success: true, subscription_id: result.subscription_id })
  } catch (error) {
    console.error('Verification handler error:', error)
    return NextResponse.json({ error: 'Verification handler failed' }, { status: 500 })
  }
}
