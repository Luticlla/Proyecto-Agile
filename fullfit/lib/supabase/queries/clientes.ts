import { supabase } from '../client'
import type { ProfileUpdate, ProfileWithEmail } from '../types'
import type { ClienteFilters, ClienteListResult, ClienteConMembresia } from './clientes.types'
import { addEmail, enrichConMembresia, applyBusquedaFilter } from './clientes.transformations'
import { getFechaLima } from '@/lib/utils'

export type { EstadoSuscripcion, ClienteFilters, ClienteListResult, ClienteConMembresia } from './clientes.types'

const MIEMBRO_ROLE_ID = 3

function buildBaseQuery(filtros: {
  busqueda?: string
  activo?: boolean
  rol_id: number
  idsExcluidos?: string[]
  idsIncluidos?: string[]
}) {
  const { busqueda, activo, rol_id, idsExcluidos, idsIncluidos } = filtros

  let query = supabase
    .from('profiles')
    .select('*', { count: 'exact' })
    .eq('rol_id', rol_id)

  if (idsIncluidos && idsIncluidos.length > 0) {
    query = query.in('id', idsIncluidos)
  } else if (idsExcluidos && idsExcluidos.length > 0) {
    query = query.not('id', 'in', `(${idsExcluidos.join(',')})`)
  }

  if (busqueda) {
    query = applyBusquedaFilter(query, busqueda)
  }

  if (activo !== undefined) {
    query = query.eq('activo', activo)
  }

  return query
}

function paginateAndEnrich(
  data: Record<string, unknown>[],
  count: number | null,
  page: number,
  limit: number,
  enriquecer = true
): Promise<ClienteListResult> {
  const clientes = (data || []).map(addEmail)

  if (!enriquecer) {
    return Promise.resolve({
      data: clientes,
      count: count || 0,
      page,
      totalPages: Math.ceil((count || 0) / limit)
    })
  }

  return enrichConMembresia(clientes).then(clientesEnriquecidos => ({
    data: clientesEnriquecidos,
    count: count || 0,
    page,
    totalPages: Math.ceil((count || 0) / limit)
  }))
}

export async function buscarClientes(busqueda: string): Promise<ProfileWithEmail[]> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .or(`nombre.ilike.%${busqueda}%,apellido.ilike.%${busqueda}%,dni.eq.${busqueda},telefono.ilike.%${busqueda}%`)
    .order('nombre')
    .limit(20)

  if (error) {
    console.error('Error buscando clientes:', error)
    return []
  }

  return (data || []).map(addEmail)
}

export async function obtenerCliente(id: string): Promise<ProfileWithEmail | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error obteniendo cliente:', error)
    return null
  }

  return addEmail(data as Record<string, unknown>)
}

export async function actualizarCliente(id: string, datos: ProfileUpdate): Promise<{ success: boolean; error?: string }> {
  const { error } = await supabase
    .from('profiles')
    .update(datos as never)
    .eq('id', id)

  if (error) {
    console.error('Error actualizando cliente:', error)
    return { success: false, error: error.message }
  }

  return { success: true }
}

export async function listarClientes(filtros: ClienteFilters = {}): Promise<ClienteListResult> {
  const { busqueda, activo, rol_id = MIEMBRO_ROLE_ID, estado_suscripcion = 'todos', page = 1, limit = 10 } = filtros
  const from = (page - 1) * limit
  const to = from + limit - 1

  if (estado_suscripcion === 'sin_membresia') {
    return listarClientesSinMembresia({ busqueda, activo, rol_id, page, limit })
  }

  if (estado_suscripcion === 'activos' || estado_suscripcion === 'vencidos') {
    return listarClientesPorEstadoMembresia({ busqueda, activo, rol_id, estado_suscripcion, page, limit })
  }

  const query = buildBaseQuery({ busqueda, activo, rol_id })
  const { data, count, error } = await query.order('nombre').range(from, to)

  if (error) {
    console.error('Error listando clientes:', error)
    return { data: [], count: 0, page, totalPages: 0 }
  }

  return paginateAndEnrich(data, count, page, limit)
}

async function listarClientesSinMembresia(filtros: {
  busqueda?: string
  activo?: boolean
  rol_id?: number
  page: number
  limit: number
}): Promise<ClienteListResult> {
  const { busqueda, activo, rol_id = MIEMBRO_ROLE_ID, page, limit } = filtros
  const from = (page - 1) * limit
  const to = from + limit - 1

  const { data: clientesConMembresia } = await supabase
    .from('suscripciones')
    .select('usuario_id')

  const idsConMembresia = (clientesConMembresia || []).map((s: { usuario_id: string }) => s.usuario_id)
  const idsUnicos = [...new Set(idsConMembresia)]

  const query = buildBaseQuery({
    busqueda,
    activo,
    rol_id,
    idsExcluidos: idsUnicos.length > 0 ? idsUnicos : undefined
  })

  const { data, count, error } = await query.order('nombre').range(from, to)

  if (error) {
    console.error('Error listando clientes sin membresía:', error)
    return { data: [], count: 0, page, totalPages: 0 }
  }

  return paginateAndEnrich(data, count, page, limit)
}

async function listarClientesPorEstadoMembresia(filtros: {
  busqueda?: string
  activo?: boolean
  rol_id?: number
  estado_suscripcion: 'activos' | 'vencidos'
  page: number
  limit: number
}): Promise<ClienteListResult> {
  const { busqueda, activo, rol_id = MIEMBRO_ROLE_ID, estado_suscripcion, page, limit } = filtros
  const from = (page - 1) * limit
  const to = from + limit - 1

  const hoy = getFechaLima()

  let suscripcionQuery = supabase
    .from('suscripciones')
    .select('usuario_id')
    .eq('estado', 'activa')

  if (estado_suscripcion === 'activos') {
    suscripcionQuery = suscripcionQuery.gte('fecha_fin', hoy)
  } else {
    suscripcionQuery = suscripcionQuery.lt('fecha_fin', hoy)
  }

  const { data: suscripciones } = await suscripcionQuery
  const usuarioIds = (suscripciones || []).map((s: { usuario_id: string }) => s.usuario_id)
  const idsUnicos = [...new Set(usuarioIds)]

  if (idsUnicos.length === 0) {
    return { data: [], count: 0, page, totalPages: 0 }
  }

  const query = buildBaseQuery({
    busqueda,
    activo,
    rol_id,
    idsIncluidos: idsUnicos
  })

  const { data, count, error } = await query.order('nombre').range(from, to)

  if (error) {
    console.error('Error listando clientes por estado membresía:', error)
    return { data: [], count: 0, page, totalPages: 0 }
  }

  return paginateAndEnrich(data, count, page, limit)
}

export async function contarClientesPorEstado(): Promise<{
  activos: number
  inactivos: number
  total: number
}> {
  const [activos, inactivos] = await Promise.all([
    supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('rol_id', MIEMBRO_ROLE_ID)
      .eq('activo', true),
    supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('rol_id', MIEMBRO_ROLE_ID)
      .eq('activo', false)
  ])

  return {
    activos: activos.count || 0,
    inactivos: inactivos.count || 0,
    total: (activos.count || 0) + (inactivos.count || 0)
  }
}
