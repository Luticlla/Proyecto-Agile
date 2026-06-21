import { NextRequest, NextResponse } from 'next/server'
import { obtenerMembresiaActiva } from '@/lib/supabase/queries/membresias'
import { requireAuthenticatedRecepcionista } from '@/lib/auth/api-guard'

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAuthenticatedRecepcionista(request)
    if (!auth.success) return auth.response
    const { supabase } = auth

    const { searchParams } = new URL(request.url)
    const usuarioId = searchParams.get('usuario_id')

    if (!usuarioId) {
      return NextResponse.json(
        { error: 'Falta el parámetro usuario_id' },
        { status: 400 }
      )
    }

    const membresia = await obtenerMembresiaActiva(usuarioId, supabase)

    return NextResponse.json({ membresia })

  } catch (error) {
    console.error('Error obteniendo membresía activa:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
