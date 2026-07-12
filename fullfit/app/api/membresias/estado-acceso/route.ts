import { NextRequest, NextResponse } from 'next/server'
import { createServiceRoleClient } from '@/lib/supabase/server'

/**
 * GET /api/membresias/estado-acceso?usuario_id=xxx
 * Verifica si el usuario tiene acceso al sistema según el estado de su membresía más reciente.
 * Si está suspendida o cancelada, retorna bloqueado = true.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const usuarioId = searchParams.get('usuario_id')

    if (!usuarioId) {
      return NextResponse.json({ bloqueado: false })
    }

    const supabase = createServiceRoleClient()

    // Buscar la membresía más reciente del usuario (sin importar estado)
    const { data: membresia } = await supabase
      .from('suscripciones')
      .select('estado')
      .eq('usuario_id', usuarioId)
      .order('creado_en', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (!membresia) {
      // Sin membresía: puede acceder normalmente
      return NextResponse.json({ bloqueado: false })
    }

    const bloqueado = membresia.estado === 'suspendida' || membresia.estado === 'cancelada'

    return NextResponse.json({ bloqueado, estado: membresia.estado })
  } catch (error) {
    console.error('Error verificando estado de acceso:', error)
    return NextResponse.json({ bloqueado: false })
  }
}
