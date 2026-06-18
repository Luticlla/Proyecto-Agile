import type { ProfileWithEmail } from '../types'

export type EstadoSuscripcion = 'todos' | 'activos' | 'vencidos' | 'sin_membresia'

export type ClienteFilters = {
  busqueda?: string
  activo?: boolean
  rol_id?: number
  estado_suscripcion?: EstadoSuscripcion
  page?: number
  limit?: number
}

export type ClienteListResult = {
  data: ClienteConMembresia[]
  count: number
  page: number
  totalPages: number
}

export type ClienteConMembresia = ProfileWithEmail & {
  membresia_estado?: string
  membresia_fecha_fin?: string
}
