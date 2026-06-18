import { MercadoPagoConfig, Preference } from 'mercadopago'
import { createServerClient } from '@supabase/ssr'
import { NextRequest, NextResponse } from 'next/server'

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN!,
})

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll() {},
        },
      }
    )

    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      )
    }

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

    let fechaInicio = new Date()
    let fechaFin = new Date()
    let diasRestantes = 0

    if (membresiaActiva) {
      const hoy = new Date()
      const fechaFinActual = new Date(membresiaActiva.fecha_fin)
      const diffMs = fechaFinActual.getTime() - hoy.getTime()
      const diffDias = Math.ceil(diffMs / (1000 * 60 * 60 * 24))

      if (diffDias <= 7 && diffDias > 0) {
        diasRestantes = diffDias
        fechaInicio = new Date(fechaFinActual)
        fechaFin = new Date(fechaFinActual)
        fechaFin.setDate(fechaFin.getDate() + plan.duracion_dias)
      }
    }

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
          dias_restantes: String(diasRestantes),
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
