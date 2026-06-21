import { NextRequest, NextResponse } from 'next/server'
import { getFechaLima } from '@/lib/utils'
import { calcularDiasRestantes } from '@/lib/utils/dates'
import { VENTANA_RENOVACION_DIAS } from '@/constants/memberships'
import { requireAuthenticated } from '@/lib/auth/api-guard'

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAuthenticated(request)
    if (!auth.success) {
      return NextResponse.json({
        autenticado: false,
        tieneMembresiaActiva: false,
        diasRestantes: 0,
        puedeComprar: true,
      })
    }
    const { supabase, user } = auth

    const { data: membresia } = await supabase
      .from('suscripciones')
      .select('fecha_fin')
      .eq('usuario_id', user.id)
      .eq('estado', 'activa')
      .order('fecha_fin', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (!membresia) {
      return NextResponse.json({
        autenticado: true,
        tieneMembresiaActiva: false,
        diasRestantes: 0,
        puedeComprar: true,
      })
    }

    const diasRestantes = Math.max(0, calcularDiasRestantes(membresia.fecha_fin, getFechaLima()))

    const tieneMembresiaActiva = true
    const puedeComprar = diasRestantes <= VENTANA_RENOVACION_DIAS

    return NextResponse.json({
      autenticado: true,
      tieneMembresiaActiva,
      diasRestantes,
      puedeComprar,
      fechaFin: membresia.fecha_fin,
    })

  } catch (error) {
    console.error('Error checking membership status:', error)
    return NextResponse.json(
      { error: 'Error al verificar estado de membresía' },
      { status: 500 }
    )
  }
}
