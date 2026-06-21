import { supabase } from '../client'
import { getFechaLima } from '@/lib/utils'
import { calcularDiasRestantes } from '@/lib/utils/dates'
import { VENTANA_RENOVACION_DIAS } from '@/constants/memberships'
import { generarNumeroBoleta } from './membresias.helpers'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { RegistrarMembresiaDTO, CambiarEstadoDTO, RenovarMembresiaDTO } from './membresias.types'

type RegistroResult = {
  suscripcion: Record<string, unknown> | null
  pago: Record<string, unknown> | null
  error?: string
  esRenovacion?: boolean
}

/**
 * Registra una nueva membresía o renueva una existente.
 * Si el usuario tiene una membresía activa dentro de la ventana de renovación,
 * extiende la suscripción. Si no, crea una nueva.
 */
export async function registrarMembresia(
  dto: RegistrarMembresiaDTO,
  registradoPor: string,
  client?: SupabaseClient
): Promise<RegistroResult> {
  const db = client || supabase
  const hoy = getFechaLima()

  const { data: plan, error: planError } = await db
    .from('planes_membresia')
    .select('duracion_dias')
    .eq('id', dto.plan_id)
    .single()

  if (planError || !plan) {
    return { suscripcion: null, pago: null, error: 'Plan no encontrado o inactivo' }
  }

  const { data: membresiaExistente } = await db
    .from('suscripciones')
    .select('id, fecha_fin')
    .eq('usuario_id', dto.usuario_id)
    .eq('estado', 'activa')
    .gte('fecha_fin', hoy)
    .order('fecha_fin', { ascending: false })
    .limit(1)
    .maybeSingle()

  let suscripcion: Record<string, unknown> | null = null
  let esRenovacion = false

  if (membresiaExistente) {
    const resultadoExtension = await extenderSuscripcion(
      db, membresiaExistente.id, membresiaExistente.fecha_fin, plan.duracion_dias
    )

    if (resultadoExtension.error) {
      const diasRestantes = calcularDiasRestantes(membresiaExistente.fecha_fin, hoy)
      if (diasRestantes > VENTANA_RENOVACION_DIAS) {
        return {
          suscripcion: null,
          pago: null,
          error: `Su membresía aún tiene ${diasRestantes} días restantes. Solo puede renovar ${VENTANA_RENOVACION_DIAS} días antes del vencimiento.`
        }
      }
      return { suscripcion: null, pago: null, error: resultadoExtension.error }
    }

    suscripcion = resultadoExtension.suscripcion
    esRenovacion = true
  } else {
    const resultadoCreacion = await crearSuscripcion(
      db, dto.usuario_id, dto.plan_id, hoy, plan.duracion_dias, registradoPor
    )

    if (resultadoCreacion.error) {
      return { suscripcion: null, pago: null, error: resultadoCreacion.error }
    }

    suscripcion = resultadoCreacion.suscripcion
  }

  if (!suscripcion) {
    return { suscripcion: null, pago: null, error: 'Error al crear suscripción' }
  }

  const pago = await crearPago(db, suscripcion.id as number, dto, registradoPor)

  return { suscripcion, pago, error: undefined, esRenovacion }
}

/**
 * Cambia el estado de una membresía (cancelar, pausar, reactivar).
 * Valida las transiciones permitidas antes de actualizar.
 */
export async function cambiarEstadoMembresia(
  id: number,
  dto: CambiarEstadoDTO,
  client?: SupabaseClient
): Promise<{ success: boolean; error?: string }> {
  const db = client || supabase

  const { data: membresia, error: fetchError } = await db
    .from('suscripciones')
    .select('estado')
    .eq('id', id)
    .single()

  if (fetchError || !membresia) {
    return { success: false, error: 'Membresía no encontrada' }
  }

  const transicionesPermitidas: Record<string, string[]> = {
    'activa': ['cancelar', 'pausar'],
    'suspendida': ['reactivar', 'cancelar'],
    'cancelada': ['reactivar']
  }

  const accionesPermitidas = transicionesPermitidas[membresia.estado] || []
  if (!accionesPermitidas.includes(dto.accion)) {
    return {
      success: false,
      error: `No se puede ${dto.accion} una membresía con estado "${membresia.estado}"`
    }
  }

  const estadoMap: Record<string, string> = {
    'cancelar': 'cancelada',
    'pausar': 'suspendida',
    'reactivar': 'activa'
  }

  const nuevoEstado = estadoMap[dto.accion]

  const { error } = await db
    .from('suscripciones')
    .update({ estado: nuevoEstado })
    .eq('id', id)

  if (error) {
    console.error('Error cambiando estado de membresía:', error)
    return { success: false, error: error.message }
  }

  return { success: true }
}

/**
 * Renueva una membresía existente.
 * Solo permite renovar membresías activas dentro de la ventana de renovación.
 */
export async function renovarMembresia(
  id: number,
  dto: RenovarMembresiaDTO,
  registradoPor: string,
  client?: SupabaseClient
): Promise<{ success: boolean; error?: string }> {
  const db = client || supabase
  const hoy = getFechaLima()

  const { data: membresia, error: fetchError } = await db
    .from('suscripciones')
    .select('estado, fecha_fin, usuario_id')
    .eq('id', id)
    .single()

  if (fetchError || !membresia) {
    return { success: false, error: 'Membresía no encontrada' }
  }

  if (membresia.estado !== 'activa') {
    return { success: false, error: 'Solo se pueden renovar membresías activas' }
  }

  const diasRestantes = calcularDiasRestantes(membresia.fecha_fin, hoy)

  if (diasRestantes > VENTANA_RENOVACION_DIAS) {
    return {
      success: false,
      error: `La membresía vence en ${diasRestantes} días. Solo se puede renovar ${VENTANA_RENOVACION_DIAS} días antes del vencimiento`
    }
  }

  const { data: plan, error: planError } = await db
    .from('planes_membresia')
    .select('duracion_dias')
    .eq('id', dto.plan_id)
    .single()

  if (planError || !plan) {
    return { success: false, error: 'Plan no encontrado o inactivo' }
  }

  const fechaFinActual = new Date(membresia.fecha_fin)
  const nuevaFechaFin = new Date(fechaFinActual)
  nuevaFechaFin.setDate(nuevaFechaFin.getDate() + plan.duracion_dias)
  const fechaFinStr = nuevaFechaFin.toISOString().split('T')[0]

  const { error: updateError } = await db
    .from('suscripciones')
    .update({
      plan_id: dto.plan_id,
      fecha_fin: fechaFinStr
    })
    .eq('id', id)

  if (updateError) {
    console.error('Error renovando membresía:', updateError)
    return { success: false, error: updateError.message }
  }

  const referencia = dto.metodo_pago === 'efectivo' ? generarNumeroBoleta() : null

  const { error: pagoError } = await db
    .from('pagos')
    .insert({
      suscripcion_id: id,
      usuario_id: membresia.usuario_id || '',
      monto: dto.monto,
      metodo_pago: dto.metodo_pago,
      estado: dto.metodo_pago === 'efectivo' ? 'completado' : 'pendiente',
      referencia,
      registrado_por: registradoPor
    })

  if (pagoError) {
    console.error('Error creando pago de renovación:', pagoError)
  }

  return { success: true }
}

// --- Helpers internos ---

async function extenderSuscripcion(
  db: SupabaseClient,
  suscripcionId: number,
  fechaFinActual: string,
  duracionDias: number
): Promise<{ suscripcion: Record<string, unknown> | null; error?: string }> {
  const fechaFinDate = new Date(fechaFinActual)
  fechaFinDate.setDate(fechaFinDate.getDate() + duracionDias)
  const nuevaFechaFinStr = fechaFinDate.toISOString().split('T')[0]

  const { data, error } = await db
    .from('suscripciones')
    .update({
      fecha_fin: nuevaFechaFinStr
    })
    .eq('id', suscripcionId)
    .select()
    .single()

  if (error) {
    console.error('Error extendiendo membresía:', error)
    return { suscripcion: null, error: error.message }
  }

  return { suscripcion: data }
}

async function crearSuscripcion(
  db: SupabaseClient,
  usuarioId: string,
  planId: number,
  hoy: string,
  duracionDias: number,
  registradoPor: string
): Promise<{ suscripcion: Record<string, unknown> | null; error?: string }> {
  const fechaInicioDate = new Date(hoy)
  const fechaFinDate = new Date(fechaInicioDate)
  fechaFinDate.setDate(fechaFinDate.getDate() + duracionDias)
  const fechaFin = fechaFinDate.toISOString().split('T')[0]

  const { data, error } = await db
    .from('suscripciones')
    .insert({
      usuario_id: usuarioId,
      plan_id: planId,
      fecha_inicio: hoy,
      fecha_fin: fechaFin,
      estado: 'activa',
      creado_por: registradoPor
    })
    .select()
    .single()

  if (error) {
    console.error('Error creando suscripción:', error)
    return { suscripcion: null, error: error.message }
  }

  return { suscripcion: data }
}

async function crearPago(
  db: SupabaseClient,
  suscripcionId: number,
  dto: RegistrarMembresiaDTO,
  registradoPor: string
): Promise<Record<string, unknown> | null> {
  const referencia = dto.metodo_pago === 'efectivo' ? generarNumeroBoleta() : null

  const { data, error } = await db
    .from('pagos')
    .insert({
      suscripcion_id: suscripcionId,
      usuario_id: dto.usuario_id,
      monto: dto.monto,
      metodo_pago: dto.metodo_pago,
      estado: dto.metodo_pago === 'efectivo' ? 'completado' : 'pendiente',
      referencia,
      registrado_por: registradoPor
    })
    .select()
    .single()

  if (error) {
    console.error('Error creando pago:', error)
  }

  return data || null
}
