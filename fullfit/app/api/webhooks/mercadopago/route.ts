import { Payment } from 'mercadopago'
import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { getMercadoPagoClient } from '@/lib/mercadopago'
import { createServiceRoleClient } from '@/lib/supabase/server'
import { processPaymentActivation } from '@/lib/supabase/queries/pagos'

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

  const sigBuf = Buffer.from(signature)
  const expectedBuf = Buffer.from(expectedSignature)
  if (sigBuf.length !== expectedBuf.length) return false

  return crypto.timingSafeEqual(sigBuf, expectedBuf)
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

    const client = getMercadoPagoClient()
    const payment = await new Payment(client).get({ id: body.data.id })
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

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 })
  }
}
