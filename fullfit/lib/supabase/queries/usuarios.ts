import { supabase } from '../client'
import type { UsuarioSistemaFilters, UsuarioSistemaListResult, UsuarioSistema } from './usuarios.types'
import type { SupabaseClient } from '@supabase/supabase-js'
import { Database } from '../types'

/**
 * Lista recepcionistas (rol_id = 2) y coaches (rol_id = 4) con paginación y filtros
 */
export async function listarUsuarios(
  filtros: UsuarioSistemaFilters,
  customSupabase?: SupabaseClient<Database>
): Promise<UsuarioSistemaListResult> {
  const client = customSupabase || supabase
  const limit = filtros.limit || 10
  const page = filtros.page || 1
  const from = (page - 1) * limit
  const to = from + limit - 1

  let query = client
    .from('profiles')
    .select('*', { count: 'exact' })
    .in('rol_id', [2, 4]) // Recepcionista y Coach

  if (filtros.busqueda) {
    query = query.or(`nombre.ilike.%${filtros.busqueda}%,apellido.ilike.%${filtros.busqueda}%,dni.ilike.%${filtros.busqueda}%,email.ilike.%${filtros.busqueda}%`)
  }

  if (filtros.activo !== undefined) {
    query = query.eq('activo', filtros.activo)
  }

  if (filtros.rol_id !== undefined) {
    query = query.eq('rol_id', filtros.rol_id)
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
    console.error('Error obteniendo usuarios del sistema:', error)
    return { data: [], count: 0, page, totalPages: 0 }
  }

  return {
    data: data as UsuarioSistema[],
    count: count || 0,
    page,
    totalPages: Math.ceil((count || 0) / limit)
  }
}

/**
 * Verifica si es el último administrador activo en el sistema.
 * Utilizado para evitar auto-bloqueos al desactivar usuarios.
 */
export async function verificarUltimoAdmin(
  idExcluido: string,
  customSupabase?: SupabaseClient<Database>
): Promise<boolean> {
  const client = customSupabase || supabase

  const { count, error } = await client
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .eq('rol_id', 1)
    .eq('activo', true)
    .neq('id', idExcluido)

  if (error) {
    console.error('Error verificando último admin:', error)
    // En caso de duda, retornamos true para prevenir acciones destructivas
    return true
  }

  return (count || 0) === 0
}
