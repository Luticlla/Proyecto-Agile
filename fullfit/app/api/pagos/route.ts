import { MercadoPagoConfig, Preference } from 'mercadopago'
import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN!,
})

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const { planId, userId } = await request.json()

    if (!planId || !userId) {
      return NextResponse.json(
        { error: 'planId y userId son requeridos' },
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

    const fechaInicio = new Date()
    const fechaFin = new Date()
    fechaFin.setDate(fechaFin.getDate() + plan.duracion_dias)

    const preference = new Preference(client)
    const result = await preference.create({
      body: {
        items: [{
          id: String(plan.id),
          title: `Membresía ${plan.nombre} - Full Forma`,
          quantity: 1,
          unit_price: Number(plan.precio),
          currency_id: 'PEN',
        }],
        metadata: {
          plan_id: String(plan.id),
          user_id: userId,
          fecha_inicio: fechaInicio.toISOString(),
          fecha_fin: fechaFin.toISOString(),
        },
        back_urls: {
          success: `${process.env.NEXT_PUBLIC_SITE_URL}/pasarelapago?status=approved`,
          failure: `${process.env.NEXT_PUBLIC_SITE_URL}/pasarelapago?status=rejected`,
          pending: `${process.env.NEXT_PUBLIC_SITE_URL}/pasarelapago?status=pending`,
        },
        auto_return: 'approved',
      },
    })

    if (!result.init_point) {
      return NextResponse.json(
        { error: 'Error al crear preferencia de pago' },
        { status: 500 }
      )
    }

    return NextResponse.json({ init_point: result.init_point })

  } catch (error) {
    console.error('Error creating payment preference:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
