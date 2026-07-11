import { NextRequest, NextResponse } from 'next/server'
import { requireAuthenticated } from '@/lib/auth/api-guard'
import { generarBoletaPDF, formatearFechaEmision, obtenerSiguienteComprobante } from '@/lib/utils/boleta'
import { montoEnLetras } from '@/lib/utils/numero-a-letras'
import { calcularIGV } from '@/lib/utils/boleta'
import type { BoletaData, BoletaItem } from '@/lib/supabase/queries/membresias.types'
import { createServiceRoleClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAuthenticated(request)
    if (!auth.success) return auth.response
    const { user } = auth

    const { searchParams } = new URL(request.url)
    const pagoId = searchParams.get('pago_id')

    if (!pagoId) {
      return NextResponse.json(
        { error: 'pago_id es requerido' },
        { status: 400 }
      )
    }

    const supabaseAdmin = createServiceRoleClient()

    const { data: pago, error: pagoError } = await supabaseAdmin
      .from('pagos')
      .select(`
        id,
        suscripcion_id,
        usuario_id,
        monto,
        metodo_pago,
        estado,
        referencia,
        observaciones,
        fecha_pago
      `)
      .eq('id', pagoId)
      .single()

    if (pagoError || !pago) {
      return NextResponse.json(
        { error: 'Pago no encontrado' },
        { status: 404 }
      )
    }

    const esStaff = user.rolId === 1 || user.rolId === 2
    if (pago.usuario_id !== user.id && !esStaff) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 403 }
      )
    }

    const { data: membresia } = await supabaseAdmin
      .from('suscripciones')
      .select(`
        id,
        fecha_inicio,
        fecha_fin,
        plan_id,
        profiles:usuario_id (nombre, apellido, dni),
        planes_membresia:plan_id (nombre, precio, duracion_dias)
      `)
      .eq('id', pago.suscripcion_id)
      .single()

    if (!membresia) {
      return NextResponse.json(
        { error: 'Membresía no encontrada' },
        { status: 404 }
      )
    }

    const perfil = membresia.profiles as unknown as Record<string, string> | null
    const plan = membresia.planes_membresia as unknown as Record<string, unknown> | null

    const clienteNombre = `${perfil?.nombre || ''} ${perfil?.apellido || ''}`.trim()
    const clienteDni = perfil?.dni || ''
    const planNombre = (plan?.nombre as string) || 'Membresía'
    const planPrecio = (plan?.precio as number) || pago.monto

    const { valorUnitario, igv, total } = calcularIGV(planPrecio)

    const item: BoletaItem = {
      descripcion: planNombre,
      cantidad: 1,
      valor_unitario: valorUnitario,
      precio_unitario: planPrecio,
      valor_total: valorUnitario
    }

    let numeroComprobante = pago.referencia
    if (!numeroComprobante || !/^B\d{2}-\d{4}$/.test(numeroComprobante)) {
      numeroComprobante = await obtenerSiguienteComprobante(supabaseAdmin)
      await supabaseAdmin
        .from('pagos')
        .update({ referencia: numeroComprobante })
        .eq('id', pago.id)
    }

    const boletaData: BoletaData = {
      numero_comprobante: numeroComprobante,
      fecha_emision: formatearFechaEmision(pago.fecha_pago.split('T')[0]),
      cliente: {
        nombre: clienteNombre,
        dni: clienteDni,
        codigo: pago.usuario_id.slice(0, 8)
      },
      moneda: 'SOL',
      metodo_pago: pago.metodo_pago,
      items: [item],
      subtotal: valorUnitario,
      igv: igv,
      total: total,
      total_letras: montoEnLetras(total),
      observaciones: pago.observaciones || `Periodo: ${membresia.fecha_inicio} al ${membresia.fecha_fin}`,
      fecha_inicio: membresia.fecha_inicio,
      fecha_fin: membresia.fecha_fin
    }

    const pdfBlob = generarBoletaPDF(boletaData)
    const buffer = await pdfBlob.arrayBuffer()

    return new Response(buffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="boleta_${numeroComprobante}.pdf"`
      }
    })

  } catch (error) {
    console.error('Error generando boleta:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
