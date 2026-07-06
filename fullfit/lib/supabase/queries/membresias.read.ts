import { supabase } from '../client'
import { getFechaLima } from '@/lib/utils'
import { calcularDiasRestantes } from '@/lib/utils/dates'
import type { SupabaseClient } from '@supabase/supabase-js'
import { mapRowToMembresiaConCliente, MEMBRESIA_SELECT_WITH_JOINS } from './membresias.helpers'
import type { MembresiaFilters, MembresiaListResult, MembresiaConCliente } from './membresias.types'

export type { MembresiaFilters, MembresiaListResult, MembresiaConCliente }

/**
 * Lista membresías con filtros, paginación y búsqueda.
 * Incluye datos del cliente y plan via joins.
 */
export async function listarMembresias(
  filtros: MembresiaFilters = {},
  client?: SupabaseClient
): Promise<MembresiaListResult> {
  const db = client || supabase
  const { buscar, estado = 'todos', page = 1, limit = 10 } = filtros
  const from = (page - 1) * limit
  const to = from + limit - 1

  let query = db
    .from('suscripciones')
    .select(MEMBRESIA_SELECT_WITH_JOINS, { count: 'exact' })

  if (buscar) {
  const palabras = buscar.trim().split(/\s+/).filter(Boolean)

  for (const palabra of palabras) {
    const escapada = palabra.replace(/[%,()]/g, '')
    query = query.or(
      `nombre.ilike.%${escapada}%,apellido.ilike.%${escapada}%,dni.ilike.%${escapada}%`,
      { referencedTable: 'profiles' }
    )
  }
}

  if (estado === 'por_vencer') {
    const hoy = getFechaLima()
    const hoyDate = new Date(hoy)
    const fechaLimite = new Date(hoyDate)
    fechaLimite.setDate(fechaLimite.getDate() + 7)
    const fechaLimiteStr = fechaLimite.toISOString().split('T')[0]
    
    query = query
      .eq('estado', 'activa')
      .gte('fecha_fin', hoy)
      .lte('fecha_fin', fechaLimiteStr)
  } else if (estado !== 'todos') {
    const estadoMap: Record<string, string> = {
      'activas': 'activa',
      'vencidas': 'vencida',
      'canceladas': 'cancelada',
      'suspendidas': 'suspendida'
    }
    query = query.eq('estado', estadoMap[estado] || estado)
  }

  const { data, count, error } = await query
    .order('fecha_fin', { ascending: false })
    .range(from, to)

  if (error) {
    console.error('Error listando membresías:', error)
    return { data: [], count: 0, page, totalPages: 0 }
  }

  const hoy = getFechaLima()
  const membresias: MembresiaConCliente[] = (data || []).map(
    (m: Record<string, unknown>) => mapRowToMembresiaConCliente(m, hoy)
  )

  return {
    data: membresias,
    count: count || 0,
    page,
    totalPages: Math.ceil((count || 0) / limit)
  }
}

/**
 * Obtiene una membresía por ID con datos del cliente y plan.
 */
export async function obtenerMembresia(
  id: number,
  client?: SupabaseClient
): Promise<MembresiaConCliente | null> {
  const db = client || supabase

  const { data, error } = await db
    .from('suscripciones')
    .select(MEMBRESIA_SELECT_WITH_JOINS)
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error obteniendo membresía:', error)
    return null
  }

  const hoy = getFechaLima()
  return mapRowToMembresiaConCliente(data as Record<string, unknown>, hoy)
}

/**
 * Obtiene la membresía activa de un usuario.
 * Retorna null si no tiene membresía activa o si ya venció.
 */
export async function obtenerMembresiaActiva(
  usuarioId: string,
  client?: SupabaseClient
): Promise<MembresiaConCliente | null> {
  const db = client || supabase
  const hoy = getFechaLima()

  const { data, error } = await db
    .from('suscripciones')
    .select(MEMBRESIA_SELECT_WITH_JOINS)
    .eq('usuario_id', usuarioId)
    .eq('estado', 'activa')
    .gte('fecha_fin', hoy)
    .order('fecha_fin', { ascending: false })
    .limit(1)
    .single()

  if (error || !data) {
    return null
  }

  return mapRowToMembresiaConCliente(data as Record<string, unknown>, hoy)
}
