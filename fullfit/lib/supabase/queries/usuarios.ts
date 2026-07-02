import { supabase } from '../client'
import type { UsuarioSistemaFilters, UsuarioSistemaListResult, UsuarioSistema } from './usuarios.types'
import type { SupabaseClient } from '@supabase/supabase-js'
import { Database } from '../types'

/**
 * Lista los usuarios del sistema (roles 1 y 2) con paginación y filtros
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
    .in('rol_id', [1, 2]) // Admin y Recepcionista

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
 * Obtiene un usuario del sistema por su ID
 */
export async function obtenerUsuarioPorId(
  id: string,
  customSupabase?: SupabaseClient<Database>
): Promise<UsuarioSistema | null> {
  const client = customSupabase || supabase
  const { data, error } = await client
    .from('profiles')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error obteniendo usuario del sistema:', error)
    return null
  }

  return data as UsuarioSistema
}

/**
 * Verifica si es el último administrador activo en el sistema
 * Utilizado para evitar auto-bloqueos
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

/**
 * Desactiva un usuario del sistema (activo = false)
 */
export async function desactivarUsuario(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('profiles')
    .update({ activo: false } as never)
    .eq('id', id)

  if (error) {
    console.error('Error desactivando usuario:', error)
    return false
  }

  return true
}

/**
 * Activa un usuario del sistema (activo = true)
 */
export async function activarUsuario(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('profiles')
    .update({ activo: true } as never)
    .eq('id', id)

  if (error) {
    console.error('Error activando usuario:', error)
    return false
  }

  return true
}

/**
 * Verifica si un usuario está activo
 */
export async function verificarUsuarioActivo(id: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('profiles')
    .select('activo')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error verificando si usuario está activo:', error)
    return false
  }

  return (data as Record<string, unknown>)?.activo === true
}
