import { calcularDiasRestantes } from '@/lib/utils/dates'
import type { MembresiaConCliente } from './membresias.types'

/**
 * Mapea una fila de Supabase con join de profiles y planes_membresia
 * a un objeto MembresiaConCliente tipado.
 */
export function mapRowToMembresiaConCliente(
  row: Record<string, unknown>,
  hoy: string
): MembresiaConCliente {
  const perfil = row.profiles as Record<string, string> | null
  const plan = row.planes_membresia as Record<string, unknown> | null
  const fechaFin = row.fecha_fin as string
  const estadoDb = row.estado as string

  let estadoVisual = estadoDb
  if (estadoDb === 'activa' && fechaFin < hoy) {
    estadoVisual = 'vencida'
  }

  return {
    id: row.id as number,
    usuario_id: row.usuario_id as string,
    cliente_nombre: perfil?.nombre || '',
    cliente_apellido: perfil?.apellido || '',
    cliente_dni: perfil?.dni || '',
    plan_id: row.plan_id as number,
    plan_nombre: (plan?.nombre as string) || '',
    plan_precio: (plan?.precio as number) || 0,
    plan_duracion_dias: (plan?.duracion_dias as number) || 0,
    estado: estadoVisual,
    fecha_inicio: row.fecha_inicio as string,
    fecha_fin: fechaFin,
    dias_restantes: Math.max(0, calcularDiasRestantes(fechaFin, hoy)),
    creado_en: row.creado_en as string,
    freeze_inicio: (row.freeze_inicio as string) || null,
    freeze_fin: (row.freeze_fin as string) || null,
    veces_pausada: (row.veces_pausada as number) ?? 0,
    dias_freeze_maximo: (plan?.dias_freeze_maximo as number) || 0,
  }
}

/**
 * Select clause compartido para queries de membresías con joins.
 */
export const MEMBRESIA_SELECT_WITH_JOINS = `
  id,
  usuario_id,
  plan_id,
  fecha_inicio,
  fecha_fin,
  estado,
  creado_en,
  veces_pausada,
  freeze_inicio,
  freeze_fin,
  profiles!suscripciones_usuario_id_fkey!inner (nombre, apellido, dni),
  planes_membresia!suscripciones_plan_id_fkey (nombre, precio, duracion_dias, dias_freeze_maximo)
`

/**
 * Genera un número de boleta único basado en timestamp.
 */
export function generarNumeroBoleta(): string {
  const timestamp = Date.now()
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
  return `BV-${timestamp}${random}`
}
