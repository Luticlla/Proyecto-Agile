import type { PlanMembresia } from '../types'

export type PlanAdmin = PlanMembresia & { features: string[] }

export type PlanFilters = {
  busqueda?: string
  activo?: boolean
  page?: number
  limit?: number
}

export type PlanListResult = {
  data: PlanAdmin[]
  count: number
  page: number
  totalPages: number
}

export type CrearPlanPayload = {
  nombre: string
  descripcion?: string
  precio: number
  duracion_dias: number
  activo?: boolean
  features?: string[]
}

export type ActualizarPlanPayload = {
  nombre?: string
  descripcion?: string
  precio?: number
  duracion_dias?: number
  activo?: boolean
  features?: string[]
}
