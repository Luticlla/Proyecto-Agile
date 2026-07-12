import type { ProfileWithEmail } from '../types'

export type UsuarioSistema = ProfileWithEmail

export type UsuarioSistemaFilters = {
  busqueda?: string
  activo?: boolean
  rol_id?: number // 1: Admin, 2: Recepcionista
  page?: number
  limit?: number
  orderBy?: string
  orderDir?: 'asc' | 'desc'
}

export type UsuarioSistemaListResult = {
  data: UsuarioSistema[]
  count: number
  page: number
  totalPages: number
}

export type CrearUsuarioPayload = {
  nombre: string
  apellido: string
  dni: string
  telefono?: string
  email: string
  password?: string
  rol_id: number
  fecha_nacimiento?: string
  genero?: string
}

export type ActualizarUsuarioPayload = {
  nombre?: string
  apellido?: string
  dni?: string
  telefono?: string
  email?: string
  rol_id?: number
  activo?: boolean
  fecha_nacimiento?: string | null
  genero?: string | null
}
