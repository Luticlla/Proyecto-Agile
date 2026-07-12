import { SupabaseClient } from '@supabase/supabase-js'
import { Database } from '@/lib/supabase/database.types'
import {
  ClaseConHorarios,
  ClaseGrupal,
  ClaseGrupalInsert,
  ClaseGrupalUpdate,
  HorarioClase,
  HorarioClaseInsert
} from './clases.types'

export async function getClasesConHorarios(client: SupabaseClient<Database>): Promise<ClaseConHorarios[]> {
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
  client: SupabaseClient<Database>,
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
    throw new Error('Error al crear clase')
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
      throw new Error('Error al crear horarios')
    }
    nuevosHorarios = dataHorarios || []
  }

  return {
    ...nuevaClase,
    horarios: nuevosHorarios
  }
}

export async function updateClaseConHorarios(
  client: SupabaseClient<Database>,
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
    throw new Error('Error al actualizar clase')
  }

  // 2. Actualizar horarios (borrar todos y recrear para más simpleza)
  const { error: deleteError } = await client
    .from('horarios_clases')
    .delete()
    .eq('clase_id', claseId)

  if (deleteError) {
    console.error('Error al limpiar horarios:', deleteError)
    throw new Error('Error al actualizar horarios')
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
      throw new Error('Error al actualizar horarios')
    }
    nuevosHorarios = dataHorarios || []
  }

  return {
    ...claseActualizada,
    horarios: nuevosHorarios
  }
}

export async function deleteClase(client: SupabaseClient<Database>, claseId: number): Promise<boolean> {
  // horarios_clases tiene ON DELETE CASCADE, así que solo borramos la clase
  const { error } = await client
    .from('clases_grupales')
    .delete()
    .eq('id', claseId)

  if (error) {
    console.error('Error al eliminar clase:', error)
    return false
  }
  return true
}
