import { supabase } from '../client'
import { getFechaLima } from '@/lib/utils'
import { calcularDiasRestantes } from '@/lib/utils/dates'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { MembresiaConCliente } from './membresias.types'

export type MiMembresiaData = {
  tieneMembresia: boolean
  membresiaActiva: MembresiaConCliente | null
  membresiaVencida: MembresiaConCliente | null
  historial: MembresiaConCliente[]
}

/**
 * Obtiene la membresía del miembro actual (activa, vencida o null).
 * También retorna el historial de membresías.
 */
export async function obtenerMiMembresia(
  usuarioId: string,
  client?: SupabaseClient
): Promise<MiMembresiaData> {
  const db = client || supabase
  const hoy = getFechaLima()

  // Buscar membresía activa (estado = 'activa' Y fecha_fin >= hoy)
  const { data: activaData } = await db
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
    .eq('usuario_id', usuarioId)
    .eq('estado', 'activa')
    .gte('fecha_fin', hoy)
    .order('fecha_fin', { ascending: false })
    .limit(1)
    .maybeSingle()

  // Buscar membresía vencida más reciente (estado = 'activa' pero fecha_fin < hoy)
  const { data: vencidaData } = await db
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
    .eq('usuario_id', usuarioId)
    .eq('estado', 'activa')
    .lt('fecha_fin', hoy)
    .order('fecha_fin', { ascending: false })
    .limit(1)
    .maybeSingle()

  // Obtener historial (últimas 5 membresías)
  const { data: historialData } = await db
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
    .eq('usuario_id', usuarioId)
    .order('fecha_inicio', { ascending: false })
    .limit(5)

  const mapRow = (row: Record<string, unknown>): MembresiaConCliente => {
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
  }

  const membresiaActiva = activaData ? mapRow(activaData as Record<string, unknown>) : null
  const membresiaVencida = vencidaData ? mapRow(vencidaData as Record<string, unknown>) : null
  const historial = (historialData || []).map((row) => mapRow(row as Record<string, unknown>))

  return {
    tieneMembresia: !!membresiaActiva || !!membresiaVencida,
    membresiaActiva,
    membresiaVencida,
    historial,
  }
}
