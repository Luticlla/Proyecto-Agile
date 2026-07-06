import { supabase } from '../client'
import type { PlanFilters, PlanListResult, PlanAdmin, CrearPlanPayload, ActualizarPlanPayload } from './planes.types'
import type { SupabaseClient } from '@supabase/supabase-js'
import { Database } from '../types'

/**
 * Lista todos los planes para admin (activos + inactivos) con paginación y filtros
 */
export async function listarPlanesAdmin(
  filtros: PlanFilters,
  customSupabase?: SupabaseClient<Database>
): Promise<PlanListResult> {
  const client = customSupabase || supabase
  const limit = filtros.limit || 10
  const page = filtros.page || 1
  const from = (page - 1) * limit
  const to = from + limit - 1

  let query = client
    .from('planes_membresia')
    .select('*', { count: 'exact' })

  if (filtros.busqueda) {
    query = query.ilike('nombre', `%${filtros.busqueda}%`)
  }

  if (filtros.activo !== undefined) {
    query = query.eq('activo', filtros.activo)
  }

  query = query.order('creado_en', { ascending: false })
  query = query.range(from, to)

  const { data, count, error } = await query

  if (error) {
    console.error('Error obteniendo planes:', error)
    return { data: [], count: 0, page, totalPages: 0 }
  }

  return {
    data: (data || []) as PlanAdmin[],
    count: count || 0,
    page,
    totalPages: Math.ceil((count || 0) / limit)
  }
}

/**
 * Obtiene un plan por su ID
 */
export async function obtenerPlanPorId(
  id: number,
  customSupabase?: SupabaseClient<Database>
): Promise<PlanAdmin | null> {
  const client = customSupabase || supabase
  const { data, error } = await client
    .from('planes_membresia')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error obteniendo plan:', error)
    return null
  }

  return data as PlanAdmin
}

/**
 * Crea un nuevo plan
 */
export async function crearPlan(
  plan: CrearPlanPayload,
  customSupabase?: SupabaseClient<Database>
): Promise<PlanAdmin | null> {
  const client = customSupabase || supabase
  const { data, error } = await client
    .from('planes_membresia')
    .insert(plan as any)
    .select()
    .single()

  if (error) {
    console.error('Error creando plan:', error)
    return null
  }

  return data as PlanAdmin
}

/**
 * Actualiza un plan existente
 */
export async function actualizarPlan(
  id: number,
  plan: ActualizarPlanPayload,
  customSupabase?: SupabaseClient<Database>
): Promise<boolean> {
  const client = customSupabase || supabase
  const { error } = await client
    .from('planes_membresia')
    .update(plan as never)
    .eq('id', id)

  if (error) {
    console.error('Error actualizando plan:', error)
    return false
  }

  return true
}

/**
 * Activa/desactiva un plan
 */
export async function cambiarEstadoPlan(
  id: number,
  activo: boolean,
  customSupabase?: SupabaseClient<Database>
): Promise<boolean> {
  const client = customSupabase || supabase
  const { error } = await client
    .from('planes_membresia')
    .update({ activo } as never)
    .eq('id', id)

  if (error) {
    console.error('Error cambiando estado del plan:', error)
    return false
  }

  return true
}

/**
 * Cuenta suscripciones activas de un plan
 */
export async function contarSuscripcionesActivasPorPlan(
  planId: number,
  customSupabase?: SupabaseClient<Database>
): Promise<number> {
  const client = customSupabase || supabase
  const { count, error } = await client
    .from('suscripciones')
    .select('*', { count: 'exact', head: true })
    .eq('plan_id', planId)
    .eq('estado', 'activa')

  if (error) {
    console.error('Error contando suscripciones:', error)
    return 0
  }

  return count || 0
}
