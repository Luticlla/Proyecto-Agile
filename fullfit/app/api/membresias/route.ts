import { NextRequest, NextResponse } from 'next/server'
import { listarMembresias, registrarMembresia } from '@/lib/supabase/queries/membresias'
import { crearPreferenciaPago } from '@/lib/mercadopago-preferencia'
import { generarBoletaBase64 } from '@/lib/utils/boleta'
import { requireAuthenticatedRecepcionista } from '@/lib/auth/api-guard'
import type { RegistrarMembresiaDTO, BoletaData } from '@/lib/supabase/queries/membresias.types'

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAuthenticatedRecepcionista(request)
    if (!auth.success) return auth.response
    const { supabase } = auth

    const { searchParams } = new URL(request.url)
    const buscar = searchParams.get('buscar') || undefined
    const estado = searchParams.get('estado') || 'todos'
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    const result = await listarMembresias({
      buscar,
      estado: estado as 'todos' | 'activas' | 'vencidas' | 'canceladas' | 'suspendidas',
      page,
      limit
    }, supabase)

    return NextResponse.json(result)

  } catch (error) {
    console.error('Error listando membresías:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAuthenticatedRecepcionista(request)
    if (!auth.success) return auth.response
    const { supabase, user } = auth

    const body = await request.json()
    const { usuario_id, plan_id, metodo_pago, monto } = body

    if (!usuario_id || !plan_id || !metodo_pago || monto === undefined) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos: usuario_id, plan_id, metodo_pago, monto' },
        { status: 400 }
      )
    }

    if (!['efectivo', 'mercadopago'].includes(metodo_pago)) {
      return NextResponse.json(
        { error: 'metodo_pago debe ser "efectivo" o "mercadopago"' },
        { status: 400 }
      )
    }

    if (typeof monto !== 'number' || monto < 0) {
      return NextResponse.json(
        { error: 'monto debe ser un número mayor o igual a 0' },
        { status: 400 }
      )
    }

    const dto: RegistrarMembresiaDTO = {
      usuario_id,
      plan_id,
      metodo_pago,
      monto
    }

    const result = await registrarMembresia(dto, user.id, supabase)

    if (result.error) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      )
    }

    if (metodo_pago === 'mercadopago' && result.pago) {
      const { data: plan } = await supabase
        .from('planes_membresia')
        .select('nombre')
        .eq('id', plan_id)
        .single()

      const preferenceResult = await crearPreferenciaPago({
        planId: plan_id,
        planNombre: plan?.nombre || '',
        userId: usuario_id,
        monto,
        metadata: {
          plan_id: String(plan_id),
          user_id: usuario_id,
          suscripcion_id: String(result.suscripcion?.id),
          pago_id: String(result.pago?.id),
        }
      })

      return NextResponse.json({
        suscripcion: result.suscripcion,
        pago: result.pago,
        init_point: preferenceResult.init_point
      })
    }

    if (metodo_pago === 'efectivo' && result.pago) {
      const { data: plan } = await supabase
        .from('planes_membresia')
        .select('nombre, precio, duracion_dias')
        .eq('id', plan_id)
        .single()

      const { data: cliente } = await supabase
        .from('profiles')
        .select('nombre, apellido, dni')
        .eq('id', usuario_id)
        .single()

      const fechaInicio = new Date().toISOString().split('T')[0]
      const fechaFinDate = new Date()
      fechaFinDate.setDate(fechaFinDate.getDate() + (plan?.duracion_dias || 30))

      const boletaData: BoletaData = {
        numero_boleta: (result.pago.referencia as string) || `BV-${Date.now()}`,
        fecha: fechaInicio,
        cliente: {
          nombre: `${cliente?.nombre || ''} ${cliente?.apellido || ''}`,
          dni: cliente?.dni || ''
        },
        plan: {
          nombre: plan?.nombre || '',
          precio: plan?.precio || monto
        },
        monto_total: monto,
        fecha_inicio: fechaInicio,
        fecha_fin: fechaFinDate.toISOString().split('T')[0]
      }

      const boletaBase64 = await generarBoletaBase64(boletaData)

      return NextResponse.json({
        suscripcion: result.suscripcion,
        pago: result.pago,
        boleta: boletaBase64,
        numero_boleta: boletaData.numero_boleta
      })
    }

    return NextResponse.json({
      suscripcion: result.suscripcion,
      pago: result.pago
    })

  } catch (error) {
    console.error('Error registrando membresía:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
