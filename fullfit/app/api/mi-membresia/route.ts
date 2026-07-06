import { NextRequest, NextResponse } from 'next/server'
import { requireAuthenticated } from '@/lib/auth/api-guard'
import { obtenerMiMembresia } from '@/lib/supabase/queries/mi-membresia'

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAuthenticated(request)
    if (!auth.success) return auth.response
    const { supabase, user } = auth

    // Verificar que sea miembro
    const { data: profile } = await supabase
      .from('profiles')
      .select('rol_id')
      .eq('id', user.id)
      .single()

    if (profile?.rol_id !== 3) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
    }

    const [membresiaData, pagosData] = await Promise.all([
      obtenerMiMembresia(user.id, supabase),
      supabase
        .from('pagos')
        .select('id, monto, metodo_pago, estado, referencia, observaciones, fecha_pago')
        .eq('usuario_id', user.id)
        .order('fecha_pago', { ascending: false })
        .limit(20),
    ])

    const historialPagos = (pagosData.data || []).map((p: Record<string, unknown>) => ({
      id: p.id as number,
      monto: p.monto as number,
      metodo_pago: p.metodo_pago as string,
      estado: p.estado as string,
      referencia: p.referencia as string | null,
      observaciones: p.observaciones as string | null,
      creado_en: p.fecha_pago as string,
    }))

    return NextResponse.json({ ...membresiaData, historialPagos })
  } catch (error) {
    console.error('Error en GET /api/mi-membresia:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
