import { Preference } from 'mercadopago'
import { NextRequest, NextResponse } from 'next/server'
import { getMercadoPagoClient } from '@/lib/mercadopago'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { getFechaLima, parsearFechaLima } from '@/lib/utils'

export async function POST(request: NextRequest) {
  try {
    let supabaseResponse = NextResponse.next({ request })
    const supabase = createServerSupabaseClient(request, supabaseResponse)

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

    let fechaInicio = getFechaLima()
    let fechaFin = getFechaLima()
    let diasRestantes = 0

    if (membresiaActiva) {
      const hoy = parsearFechaLima(getFechaLima())
      const fechaFinActual = parsearFechaLima(membresiaActiva.fecha_fin)
      const diffMs = fechaFinActual.getTime() - hoy.getTime()
      const diffDias = Math.ceil(diffMs / (1000 * 60 * 60 * 24))

      if (diffDias > 0) {
        diasRestantes = diffDias
        const nuevaFin = new Date(fechaFinActual)
        nuevaFin.setDate(nuevaFin.getDate() + plan.duracion_dias)
        fechaInicio = membresiaActiva.fecha_fin
        fechaFin = nuevaFin.toISOString().split('T')[0]
      }
    }

    const client = getMercadoPagoClient()
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
          fecha_inicio: fechaInicio,
          fecha_fin: fechaFin,
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
