import { SupabaseClient } from '@supabase/supabase-js'
import {
  ClaseConHorarios,
  ClaseGrupal,
  ClaseGrupalInsert,
  ClaseGrupalUpdate,
  HorarioClase,
  HorarioClaseInsert
} from './clases.types'
import type { Sede } from '../types'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnySupabase = SupabaseClient<any>

/**
 * Valida que los horarios de una clase estén dentro del horario de apertura del gym.
 * dia_semana: 0=Domingo, 1-5=Lunes-Viernes, 6=Sábado
 */
export function validarHorariosDentroDelGym(
  horarios: Omit<HorarioClaseInsert, 'clase_id'>[],
  sede: Sede
): void {
  for (const h of horarios) {
    let apertura: string | null = null
    let cierre: string | null = null

    if (h.dia_semana >= 1 && h.dia_semana <= 5) {
      // Lunes a Viernes
      apertura = sede.apertura_lv
      cierre = sede.cierre_lv
    } else if (h.dia_semana === 6) {
      // Sábado
      apertura = sede.apertura_sab
      cierre = sede.cierre_sab
    } else if (h.dia_semana === 0) {
      // Domingo
      apertura = sede.apertura_dom
      cierre = sede.cierre_dom
    }

    if (!apertura || !cierre) {
      const dia = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'][h.dia_semana]
      throw new Error(`El gym está cerrado los ${dia}s`)
    }

    // Convertir a minutos para comparar (hora_inicio/fin vienen como "HH:MM:SS")
    const inicioMin = timeStringToMinutes(h.hora_inicio)
    const finMin = timeStringToMinutes(h.hora_fin)
    const aperturaMin = timeStringToMinutes(apertura)
    const cierreMin = timeStringToMinutes(cierre)

    if (inicioMin < aperturaMin) {
      const dia = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'][h.dia_semana]
      throw new Error(`El horario ${dia} de ${formatTime(h.hora_inicio)} a ${formatTime(h.hora_fin)} empieza antes de la apertura del gym (${apertura})`)
    }

    if (finMin > cierreMin) {
      const dia = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'][h.dia_semana]
      throw new Error(`El horario ${dia} de ${formatTime(h.hora_inicio)} a ${formatTime(h.hora_fin)} termina después del cierre del gym (${cierre})`)
    }
  }
}

function timeStringToMinutes(time: string): number {
  // Acepta "HH:MM" o "HH:MM:SS"
  const [h, m] = time.split(':').map(Number)
  return h * 60 + m
}

function formatTime(time: string): string {
  // "HH:MM:SS" -> "HH:MM"
  return time.substring(0, 5)
}

export async function getClasesConHorarios(client: AnySupabase): Promise<ClaseConHorarios[]> {
  const { data, error } = await client
    .from('clases_grupales')
    .select(`
      *,
      horarios_clases (*)
    `)
    .order('creado_en', { ascending: false })

  if (error) {
    console.error('Error fetching clases:', error)
    return []
  }

  // Mapeamos los resultados al tipo ClaseConHorarios
  return (data || []).map((row: any) => ({
    id: row.id,
    nombre: row.nombre,
    descripcion: row.descripcion,
    entrenador: row.entrenador,
    capacidad: row.capacidad,
    color_hex: row.color_hex,
    activa: row.activa,
    creado_en: row.creado_en,
    horarios: row.horarios_clases || []
  }))
}

export async function createClaseConHorarios(
  client: AnySupabase,
  clase: ClaseGrupalInsert,
  horarios: Omit<HorarioClaseInsert, 'clase_id'>[]
): Promise<ClaseConHorarios | null> {
  // 1. Crear clase
  const { data: nuevaClase, error: claseError } = await client
    .from('clases_grupales')
    .insert(clase)
    .select()
    .single()

  if (claseError) {
    console.error('Error al crear clase:', claseError)
    throw new Error(claseError.message || 'Error al crear clase')
  }

  // 2. Crear horarios si los hay
  let nuevosHorarios: HorarioClase[] = []
  if (horarios.length > 0) {
    const horariosToInsert: HorarioClaseInsert[] = horarios.map(h => ({
      ...h,
      clase_id: nuevaClase.id
    }))

    const { data: dataHorarios, error: horariosError } = await client
      .from('horarios_clases')
      .insert(horariosToInsert)
      .select()

    if (horariosError) {
      console.error('Error al crear horarios:', horariosError)
      if (horariosError.code === '23505') {
        throw new Error('El horario está repetido')
      }
      throw new Error(horariosError.message || 'Error al crear horarios')
    }
    nuevosHorarios = dataHorarios || []
  }

  return {
    ...nuevaClase,
    horarios: nuevosHorarios
  }
}

export async function updateClaseConHorarios(
  client: AnySupabase,
  claseId: number,
  clase: ClaseGrupalUpdate,
  horarios: Omit<HorarioClaseInsert, 'clase_id'>[]
): Promise<ClaseConHorarios | null> {
  // 1. Actualizar clase
  const { data: claseActualizada, error: claseError } = await client
    .from('clases_grupales')
    .update(clase)
    .eq('id', claseId)
    .select()
    .single()

  if (claseError) {
    console.error('Error al actualizar clase:', claseError)
    throw new Error(claseError.message || 'Error al actualizar clase')
  }

  // 2. Actualizar horarios (borrar todos y recrear para más simpleza)
  const { error: deleteError } = await client
    .from('horarios_clases')
    .delete()
    .eq('clase_id', claseId)

  if (deleteError) {
    console.error('Error al limpiar horarios:', deleteError)
    throw new Error(deleteError.message || 'Error al actualizar horarios')
  }

  let nuevosHorarios: HorarioClase[] = []
  if (horarios.length > 0) {
    const horariosToInsert: HorarioClaseInsert[] = horarios.map(h => ({
      ...h,
      clase_id: claseId
    }))

    const { data: dataHorarios, error: horariosError } = await client
      .from('horarios_clases')
      .insert(horariosToInsert)
      .select()

    if (horariosError) {
      console.error('Error al recrear horarios:', horariosError)
      if (horariosError.code === '23505') {
        throw new Error('El horario está repetido')
      }
      throw new Error(horariosError.message || 'Error al actualizar horarios')
    }
    nuevosHorarios = dataHorarios || []
  }

  return {
    ...claseActualizada,
    horarios: nuevosHorarios
  }
}

export async function deleteClase(client: AnySupabase, claseId: number): Promise<boolean> {
  // horarios_clases tiene ON DELETE CASCADE, así que solo borramos la clase
  const { error } = await client
    .from('clases_grupales')
    .delete()
    .eq('id', claseId)

  if (error) {
    console.error('Error al eliminar clase:', error)
    throw new Error(error.message || 'Error al eliminar clase')
  }
  return true
}
