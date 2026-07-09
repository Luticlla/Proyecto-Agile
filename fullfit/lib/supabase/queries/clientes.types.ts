import type { ProfileWithEmail } from '../types'

export type EstadoSuscripcion = 'todos' | 'activos' | 'vencidos' | 'sin_membresia'

export type ClienteFilters = {
  busqueda?: string
  activo?: boolean
  rol_id?: number
  estado_suscripcion?: EstadoSuscripcion
  page?: number
  limit?: number
  orderBy?: string
  orderDir?: 'asc' | 'desc'
  sedeId?: number
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
  membresia_fecha_inicio?: string
  membresia_dias_restantes?: number
  membresia_plan_nombre?: string
  membresia_precio?: number
}

export type MembresiaDetalle = {
  id: number
  plan_nombre: string
  plan_precio: number
  plan_duracion_dias: number
  fecha_inicio: string
  fecha_fin: string
  estado: string
  dias_restantes: number
}

export type ClienteConMembresiaCompleta = ProfileWithEmail & {
  membresia: MembresiaDetalle | null
}

export type PagoResumen = {
  id: number
  monto: number
  metodo_pago: string
  estado: string
  referencia: string | null
  fecha_pago: string
}
