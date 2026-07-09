import { NextRequest, NextResponse } from 'next/server'
import { requireAuthenticatedRecepcionista } from '@/lib/auth/api-guard'
import { getFechaLima } from '@/lib/utils'
import { calcularDiasRestantes } from '@/lib/utils/dates'
import { MIEMBRO_ROLE_ID, VENTANA_RENOVACION_DIAS } from '@/constants/memberships'
import { applySedeFilterToMiembros, applySedeFilterDirect } from '@/lib/supabase/queries/sede-filters'

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAuthenticatedRecepcionista(request)
    if (!auth.success) return auth.response
    const { supabase, user } = auth
    const { sedeId, rolId } = user

    const hoy = getFechaLima()
    const hoyDate = new Date(hoy)
    const fechaLimite = new Date(hoyDate)
    fechaLimite.setDate(fechaLimite.getDate() + VENTANA_RENOVACION_DIAS)
    const fechaLimiteStr = fechaLimite.toISOString().split('T')[0]

    // Admin ve todas las sedes, recepcionista solo su sede
    const isAdmin = rolId === 1
    const sedeFilter = isAdmin ? undefined : sedeId

    const [totalClientesResult, activasResult, porVencerResult] = await Promise.all([
      supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('rol_id', MIEMBRO_ROLE_ID)
        .then(q => sedeFilter ? applySedeFilterToMiembros(q, sedeFilter) : q),
      supabase
        .from('suscripciones')
        .select('*', { count: 'exact', head: true })
        .eq('estado', 'activa')
        .gte('fecha_fin', hoy)
        .then(q => sedeFilter ? applySedeFilterDirect(q, sedeFilter) : q),
      supabase
        .from('suscripciones')
        .select(`
          id,
          usuario_id,
          fecha_fin,
          profiles!suscripciones_usuario_id_fkey (nombre, apellido),
          planes_membresia!suscripciones_plan_id_fkey (nombre)
        `)
        .eq('estado', 'activa')
        .gte('fecha_fin', hoy)
        .lte('fecha_fin', fechaLimiteStr)
        .order('fecha_fin', { ascending: true })
        .then(q => sedeFilter ? applySedeFilterDirect(q, sedeFilter) : q)
    ])

    const totalClientes = totalClientesResult.count || 0
    const membresiasActivas = activasResult.count || 0

    const proximasAVencer = (porVencerResult.data || []).map((row: Record<string, unknown>) => {
      const perfil = row.profiles as Record<string, string> | null
      const plan = row.planes_membresia as Record<string, string> | null
      const fechaFin = row.fecha_fin as string
      return {
        id: row.id as number,
        nombre: perfil?.nombre || '',
        apellido: perfil?.apellido || '',
        plan: plan?.nombre || '',
        dias_restantes: calcularDiasRestantes(fechaFin, hoy)
      }
    })

    return NextResponse.json({
      totalClientes,
      membresiasActivas,
      membresiasPorVencer: proximasAVencer.length,
      proximasAVencer
    })

  } catch (error) {
    console.error('Error obteniendo estadísticas del dashboard:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
