import { NextRequest, NextResponse } from 'next/server'
import { requireAuthenticated } from '@/lib/auth/api-guard'
import { getFechaLima } from '@/lib/utils'
import { autoReactivarFreezesExpirados, cambiarEstadoMembresia } from '@/lib/supabase/queries/membresias'

export async function PATCH(request: NextRequest) {
  try {
    const auth = await requireAuthenticated(request)
    if (!auth.success) return auth.response
    const { supabase, user } = auth

    const body = await request.json()
    const { accion } = body

    if (!accion || !['pausar', 'reactivar'].includes(accion)) {
      return NextResponse.json(
        { error: 'accion debe ser "pausar" o "reactivar"' },
        { status: 400 }
      )
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('rol_id')
      .eq('id', user.id)
      .single()

    if (profile?.rol_id !== 3) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
    }

    // Asegurar que freezes expirados se reactiven antes
    await autoReactivarFreezesExpirados(supabase)

    const hoy = getFechaLima()

    const estadoBuscado = accion === 'pausar' ? 'activa' : 'suspendida'
    const { data: suscripcion } = await supabase
      .from('suscripciones')
      .select('id')
      .eq('usuario_id', user.id)
      .eq('estado', estadoBuscado)
      .gte('fecha_fin', hoy)
      .order('fecha_fin', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (!suscripcion) {
      const mensaje = accion === 'pausar'
        ? 'No tienes una membresía activa para pausar.'
        : 'No tienes una membresía suspendida para reactivar.'
      return NextResponse.json({ error: mensaje }, { status: 400 })
    }

    const result = await cambiarEstadoMembresia(suscripcion.id as number, { accion }, supabase)

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error en PATCH /api/mi-membresia/freeze:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
