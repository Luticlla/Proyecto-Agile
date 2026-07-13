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

    const { id } = await params
    const membresiaId = parseInt(id)

    if (isNaN(membresiaId) || membresiaId <= 0) {
      return NextResponse.json(
        { error: 'ID de membresía inválido' },
        { status: 400 }
      )
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
      accion: 'UPDATE',
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
