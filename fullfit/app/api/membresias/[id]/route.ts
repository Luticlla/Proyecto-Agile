import { NextRequest, NextResponse } from 'next/server'
import { cambiarEstadoMembresia, obtenerMembresia } from '@/lib/supabase/queries/membresias'
import { requireAuthenticatedRecepcionista } from '@/lib/auth/api-guard'
import type { CambiarEstadoDTO } from '@/lib/supabase/queries/membresias.types'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAuthenticatedRecepcionista(request)
    if (!auth.success) return auth.response
    const { supabase, user } = auth
    const { sedeId, rolId } = user

    const { id } = await params
    const membresiaId = parseInt(id)

    if (isNaN(membresiaId) || membresiaId <= 0) {
      return NextResponse.json(
        { error: 'ID de membresía inválido' },
        { status: 400 }
      )
    }

    // Verificar que la membresía pertenece a la sede del recepcionista (admin ve todo)
    if (rolId !== 1 && sedeId) {
      const membresia = await obtenerMembresia(membresiaId, supabase)
      if (!membresia) {
        return NextResponse.json(
          { error: 'Membresía no encontrada' },
          { status: 404 }
        )
      }
      // Verificar vía suscripciones.sede_id (no profiles.sede_id)
      const { data: sub } = await supabase
        .from('suscripciones')
        .select('sede_id')
        .eq('id', membresiaId)
        .single()
      
      if (sub?.sede_id !== sedeId) {
        return NextResponse.json(
          { error: 'No tienes permisos para modificar esta membresía' },
          { status: 403 }
        )
      }
    }

    const body = await request.json()
    const { accion } = body

    if (!accion || !['cancelar', 'pausar', 'reactivar'].includes(accion)) {
      return NextResponse.json(
        { error: 'accion es requerida y debe ser "cancelar", "pausar" o "reactivar"' },
        { status: 400 }
      )
    }

    const dto: CambiarEstadoDTO = { accion }
    const result = await cambiarEstadoMembresia(membresiaId, dto, supabase)

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      )
    }

    await supabase.from('auditoria').insert({
      usuario_id: user.id,
      tabla_afectada: 'suscripciones',
      accion: accion.toUpperCase(),
      registro_id: membresiaId,
      detalle: { accion, membresia_id: membresiaId }
    })

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Error cambiando estado de membresía:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
