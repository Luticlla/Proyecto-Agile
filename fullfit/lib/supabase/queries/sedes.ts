import { supabase } from '../client'
import type { SedeFilters, SedeListResult, SedeAdmin } from './sedes.types'
import type { SupabaseClient } from '@supabase/supabase-js'
import { Database } from '../types'

/**
 * Lista todas las sedes para admin (activas + inactivas) con paginación y filtros
 */
export async function listarSedesAdmin(
  filtros: SedeFilters,
  customSupabase?: SupabaseClient<Database>
): Promise<SedeListResult> {
  const client = customSupabase || supabase
  const limit = filtros.limit || 10
  const page = filtros.page || 1
  const from = (page - 1) * limit
  const to = from + limit - 1

  let query = client
    .from('sedes')
    .select('*', { count: 'exact' })

  if (filtros.busqueda) {
    query = query.or(`nombre.ilike.%${filtros.busqueda}%,direccion.ilike.%${filtros.busqueda}%`)
  }

  if (filtros.estado) {
    query = query.eq('estado', filtros.estado)
  }

  if (filtros.orderBy) {
    const isAscending = filtros.orderDir === 'asc'
    query = query.order(filtros.orderBy, { ascending: isAscending })
  } else {
    query = query.order('creado_en', { ascending: false })
  }

  query = query.range(from, to)

  const { data, count, error } = await query

  if (error) {
    console.error('Error obteniendo sedes:', error)
    return { data: [], count: 0, page, totalPages: 0 }
  }

  return {
    data: data as SedeAdmin[],
    count: count || 0,
    page,
    totalPages: Math.ceil((count || 0) / limit)
  }
}

/**
 * Obtiene una sede por su ID
 */
export async function obtenerSedePorId(
  id: number,
  customSupabase?: SupabaseClient<Database>
): Promise<SedeAdmin | null> {
  const client = customSupabase || supabase
  const { data, error } = await client
    .from('sedes')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error obteniendo sede:', error)
    return null
  }

  return data as SedeAdmin
}

/**
 * Crea una nueva sede
 */
export async function crearSede(
  sede: import('./sedes.types').CrearSedePayload,
  customSupabase?: SupabaseClient<Database>
): Promise<SedeAdmin | null> {
  const client = customSupabase || supabase
  const { data, error } = await client
    .from('sedes')
    .insert(sede as any)
    .select()
    .single()

  if (error) {
    console.error('Error creando sede:', error)
    return null
  }

  return data as SedeAdmin
}

/**
 * Actualiza una sede existente
 */
export async function actualizarSede(
  id: number,
  sede: import('./sedes.types').ActualizarSedePayload,
  customSupabase?: SupabaseClient<Database>
): Promise<boolean> {
  const client = customSupabase || supabase
  const { error } = await client
    .from('sedes')
    .update(sede as never)
    .eq('id', id)

  if (error) {
    console.error('Error actualizando sede:', error)
    return false
  }

  return true
}

/**
 * Desactiva una sede (estado = 'inactiva')
 */
export async function desactivarSede(
  id: number,
  customSupabase?: SupabaseClient<Database>
): Promise<boolean> {
  const client = customSupabase || supabase
  const { error } = await client
    .from('sedes')
    .update({ estado: 'inactiva' } as never)
    .eq('id', id)

  if (error) {
    console.error('Error desactivando sede:', error)
    return false
  }

  return true
}

/**
 * Activa una sede (estado = 'activa')
 */
export async function activarSede(
  id: number,
  customSupabase?: SupabaseClient<Database>
): Promise<boolean> {
  const client = customSupabase || supabase
  const { error } = await client
    .from('sedes')
    .update({ estado: 'activa' } as never)
    .eq('id', id)

  if (error) {
    console.error('Error activando sede:', error)
    return false
  }

  return true
}
