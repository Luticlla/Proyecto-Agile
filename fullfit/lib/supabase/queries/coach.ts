import { supabase } from '../client'
import type { SupabaseClient } from '@supabase/supabase-js'
import { Database } from '../types'

export type ClienteCoach = {
  id: string
  nombre: string
  apellido: string
  email: string | null
  telefono: string | null
  dni: string | null
  activo: boolean
  creado_en: string
  plan_nombre?: string
  fecha_fin?: string
  estado_suscripcion?: string
}

export type ClienteCoachListResult = {
  data: ClienteCoach[]
  count: number
  page: number
  totalPages: number
}

/**
 * Lista clientes (rol_id = 3) cuya membresía activa tenga "Clases grupales" o "Clases grupales ilimitadas"
 * Pensado para ser ejecutado por un usuario con rol coach (rol_id = 4)
 */
export async function listarClientesCoach(
  filtros: {
    busqueda?: string
    page?: number
    limit?: number
  },
  customSupabase?: SupabaseClient<Database>
): Promise<ClienteCoachListResult> {
  const client = customSupabase || supabase
  const limit = filtros.limit || 20
  const page = filtros.page || 1
  const from = (page - 1) * limit
  const to = from + limit - 1

  // Primero obtenemos los IDs de clientes con membresía activa de clases grupales
  const { data: subs } = await client
    .from('suscripciones')
    .select('usuario_id, fecha_fin, estado, planes_membresia!inner(nombre, features)')
    .eq('estado', 'activa')
    .gte('fecha_fin', new Date().toISOString().split('T')[0])

  if (!subs || subs.length === 0) {
    return { data: [], count: 0, page, totalPages: 0 }
  }

  // Filtrar por feature de clases grupales
  const subsConClases = subs.filter((s: any) => {
    const features: string[] = s.planes_membresia?.features || []
    return features.includes('Clases grupales ilimitadas') || features.includes('Clases grupales')
  })

  if (subsConClases.length === 0) {
    return { data: [], count: 0, page, totalPages: 0 }
  }

  const usuarioIds = [...new Set(subsConClases.map((s: any) => s.usuario_id))]

  // Construir mapa de plan info por usuario
  const planPorUsuario: Record<string, { plan_nombre: string; fecha_fin: string; estado: string }> = {}
  subsConClases.forEach((s: any) => {
    if (!planPorUsuario[s.usuario_id]) {
      planPorUsuario[s.usuario_id] = {
        plan_nombre: s.planes_membresia?.nombre || '',
        fecha_fin: s.fecha_fin,
        estado: s.estado,
      }
    }
  })

  // Consultar perfiles filtrados por esos IDs
  let query = client
    .from('profiles')
    .select('*', { count: 'exact' })
    .eq('rol_id', 3)
    .in('id', usuarioIds)

  if (filtros.busqueda) {
    query = query.or(
      `nombre.ilike.%${filtros.busqueda}%,apellido.ilike.%${filtros.busqueda}%,dni.ilike.%${filtros.busqueda}%,email.ilike.%${filtros.busqueda}%`
    )
  }

  query = query.order('nombre', { ascending: true }).range(from, to)

  const { data, count, error } = await query

  if (error) {
    console.error('Error listando clientes coach:', error)
    return { data: [], count: 0, page, totalPages: 0 }
  }

  const result: ClienteCoach[] = (data || []).map((p: any) => ({
    id: p.id,
    nombre: p.nombre,
    apellido: p.apellido,
    email: p.email,
    telefono: p.telefono,
    dni: p.dni,
    activo: p.activo,
    creado_en: p.creado_en,
    plan_nombre: planPorUsuario[p.id]?.plan_nombre,
    fecha_fin: planPorUsuario[p.id]?.fecha_fin,
    estado_suscripcion: planPorUsuario[p.id]?.estado,
  }))

  return {
    data: result,
    count: count || 0,
    page,
    totalPages: Math.ceil((count || 0) / limit),
  }
}
