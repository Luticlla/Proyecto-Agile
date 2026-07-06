import { NextRequest, NextResponse } from 'next/server'
import { requireAuthenticated } from '@/lib/auth/api-guard'
import { calcularDiasRestantes } from '@/lib/utils/dates'
import { getFechaLima } from '@/lib/utils'
import type { MembresiaConCliente } from '@/lib/supabase/queries/membresias.types'

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

    const hoy = getFechaLima()

    const { data, error } = await supabase
      .from('suscripciones')
      .select(`
        id,
        usuario_id,
        plan_id,
        fecha_inicio,
        fecha_fin,
        estado,
        creado_en,
        profiles:usuario_id (nombre, apellido, dni),
        planes_membresia:plan_id (nombre, precio, duracion_dias)
      `)
      .eq('usuario_id', user.id)
      .order('fecha_inicio', { ascending: false })
      .limit(10)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const historial: MembresiaConCliente[] = (data || []).map((row: Record<string, unknown>) => {
      const profiles = row.profiles as Record<string, string> | null
      const planes = row.planes_membresia as Record<string, unknown> | null
      const fechaFin = row.fecha_fin as string

      return {
        id: row.id as number,
        usuario_id: row.usuario_id as string,
        cliente_nombre: profiles?.nombre || '',
        cliente_apellido: profiles?.apellido || '',
        cliente_dni: profiles?.dni || '',
        plan_id: row.plan_id as number,
        plan_nombre: (planes?.nombre as string) || '',
        plan_precio: (planes?.precio as number) || 0,
        plan_duracion_dias: (planes?.duracion_dias as number) || 0,
        estado: row.estado as string,
        fecha_inicio: row.fecha_inicio as string,
        fecha_fin: fechaFin,
        dias_restantes: calcularDiasRestantes(fechaFin, hoy),
        creado_en: row.creado_en as string,
      }
    })

    return NextResponse.json({ historial })
  } catch (error) {
    console.error('Error en GET /api/mi-membresia/historial:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
