import type { Sede } from '../types'

export type SedeAdmin = Sede

export type SedeFilters = {
  busqueda?: string
  estado?: string
  page?: number
  limit?: number
  orderBy?: string
  orderDir?: 'asc' | 'desc'
}

export type SedeListResult = {
  data: SedeAdmin[]
  count: number
  page: number
  totalPages: number
}

export type CrearSedePayload = {
  nombre: string
  direccion: string
  telefono: string
  email: string
  imagen_url?: string | null
  latitud?: number | null
  longitud?: number | null
  apertura_lv?: string
  cierre_lv?: string
  apertura_sab?: string
  cierre_sab?: string
  apertura_dom?: string | null
  cierre_dom?: string | null
}

export type ActualizarSedePayload = {
  nombre?: string
  direccion?: string
  telefono?: string
  email?: string
  imagen_url?: string | null
  latitud?: number | null
  longitud?: number | null
  apertura_lv?: string
  cierre_lv?: string
  apertura_sab?: string
  cierre_sab?: string
  apertura_dom?: string | null
  cierre_dom?: string | null
  estado?: string
}
