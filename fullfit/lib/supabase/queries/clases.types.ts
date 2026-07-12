export interface ClaseGrupal {
  id: number
  nombre: string
  descripcion: string | null
  entrenador: string | null
  capacidad: number | null
  color_hex: string
  activa: boolean
  creado_en: string
}

export interface HorarioClase {
  id: number
  clase_id: number
  dia_semana: number
  hora_inicio: string
  hora_fin: string
}

export interface ClaseConHorarios extends ClaseGrupal {
  horarios: HorarioClase[]
}

export interface ClaseGrupalInsert extends Omit<ClaseGrupal, 'id' | 'creado_en'> {}
export interface HorarioClaseInsert extends Omit<HorarioClase, 'id'> {}

export interface ClaseGrupalUpdate extends Partial<ClaseGrupalInsert> {}
