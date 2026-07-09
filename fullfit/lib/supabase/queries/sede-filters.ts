import type { SupabaseClient } from '@supabase/supabase-js'
import { Database } from '../types'

type SupabaseClientTyped = SupabaseClient<Database>

/**
 * Filtra STAFF (admin/recepcionista) — sí tienen profiles.sede_id.
 */
export function applySedeFilterToStaff(
  query: ReturnType<SupabaseClientTyped['from']>,
  sedeId: number,
  rolId: number
) {
  return query.eq('sede_id', sedeId).eq('rol_id', rolId)
}

/**
 * Filtra MIEMBROS por sede — indirecto vía sus suscripciones.
 * Los miembros tienen profiles.sede_id = NULL, su sede se infiere
 * a través de suscripciones.sede_id (asignado por trigger).
 */
export function applySedeFilterToMiembros(
  query: ReturnType<SupabaseClientTyped['from']>,
  sedeId: number
) {
  return query.filter('id', 'in',
    `(SELECT usuario_id FROM suscripciones WHERE sede_id = ${sedeId})`
  )
}

/**
 * Filtra tablas transaccionales directamente (suscripciones/pagos/accesos).
 * Estas tablas sí tienen sede_id en la fila.
 */
export function applySedeFilterDirect(
  query: ReturnType<SupabaseClientTyped['from']>,
  sedeId: number
) {
  return query.eq('sede_id', sedeId)
}

export async function getUserSedeId(
  client: SupabaseClientTyped,
  userId: string
): Promise<number | null> {
  const { data } = await client
    .from('profiles')
    .select('sede_id')
    .eq('id', userId)
    .single()

  return (data as { sede_id: number | null } | null)?.sede_id ?? null
}

export function canManageAllSedes(rolId: number): boolean {
  return rolId === 1
}

export function getSedeFilterForRole(
  rolId: number,
  userSedeId: number | null
): { allSedes: boolean; sedeId: number | null } {
  if (rolId === 1) {
    return { allSedes: true, sedeId: null }
  }
  return { allSedes: false, sedeId: userSedeId }
}
