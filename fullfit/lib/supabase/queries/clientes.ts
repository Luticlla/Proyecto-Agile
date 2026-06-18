import { supabase } from '../client'
import type { ProfileUpdate, ProfileWithEmail } from '../types'

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
  data: ProfileWithEmail[]
  count: number
  page: number
  totalPages: number
}

type ClienteConMembresia = ProfileWithEmail & {
  membresia_estado?: string
  membresia_fecha_fin?: string
}

function addEmail(profile: Record<string, unknown>): ProfileWithEmail {
  return {
    id: profile.id as string,
    rol_id: profile.rol_id as number,
    nombre: profile.nombre as string,
    apellido: profile.apellido as string,
    dni: profile.dni as string | null,
    email: (profile.email as string) || '',
    telefono: profile.telefono as string | null,
    fecha_nacimiento: profile.fecha_nacimiento as string | null,
    genero: profile.genero as string | null,
    activo: profile.activo as boolean,
    creado_en: profile.creado_en as string,
    actualizado_en: profile.actualizado_en as string
  }
}

async function enrichConMembresia(clientes: ProfileWithEmail[]): Promise<ClienteConMembresia[]> {
  if (clientes.length === 0) return []

  const ids = clientes.map(c => c.id)
  const hoy = new Date().toISOString().split('T')[0]

  const { data: suscripciones } = await supabase
    .from('suscripciones')
    .select('usuario_id, estado, fecha_fin')
    .in('usuario_id', ids)
    .order('fecha_fin', { ascending: false })

  const membresiaMap = new Map<string, { estado: string; fecha_fin: string }>()
  for (const sub of (suscripciones || []) as { usuario_id: string; estado: string; fecha_fin: string }[]) {
    if (!membresiaMap.has(sub.usuario_id)) {
      let estadoVisual = sub.estado
      if (sub.estado === 'activa' && sub.fecha_fin < hoy) {
        estadoVisual = 'vencida'
      }
      membresiaMap.set(sub.usuario_id, { estado: estadoVisual, fecha_fin: sub.fecha_fin })
    }
  }

  return clientes.map(c => {
    const membresia = membresiaMap.get(c.id)
    return {
      ...c,
      membresia_estado: membresia?.estado,
      membresia_fecha_fin: membresia?.fecha_fin,
    }
  })
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
  const { busqueda, activo, rol_id = 3, estado_suscripcion = 'todos', page = 1, limit = 10 } = filtros
  const from = (page - 1) * limit
  const to = from + limit - 1

  // Para filtros de membresía, necesitamos un approach diferente
  if (estado_suscripcion === 'sin_membresia') {
    return listarClientesSinMembresia({ busqueda, activo, rol_id, page, limit })
  }

  if (estado_suscripcion === 'activos' || estado_suscripcion === 'vencidos') {
    return listarClientesPorEstadoMembresia({ busqueda, activo, rol_id, estado_suscripcion, page, limit })
  }

  // Query original para 'todos'
  let query = supabase
    .from('profiles')
    .select('*', { count: 'exact' })
    .eq('rol_id', rol_id)

  if (busqueda) {
    query = query.or(`nombre.ilike.%${busqueda}%,apellido.ilike.%${busqueda}%,dni.eq.${busqueda},telefono.ilike.%${busqueda}%`)
  }

  if (activo !== undefined) {
    query = query.eq('activo', activo)
  }

  const { data, count, error } = await query
    .order('nombre')
    .range(from, to)

  if (error) {
    console.error('Error listando clientes:', error)
    return { data: [], count: 0, page, totalPages: 0 }
  }

  const clientes = (data || []).map(addEmail)
  const clientesEnriquecidos = await enrichConMembresia(clientes)

  return {
    data: clientesEnriquecidos,
    count: count || 0,
    page,
    totalPages: Math.ceil((count || 0) / limit)
  }
}

async function listarClientesSinMembresia(filtros: {
  busqueda?: string
  activo?: boolean
  rol_id?: number
  page: number
  limit: number
}): Promise<ClienteListResult> {
  const { busqueda, activo, rol_id = 3, page, limit } = filtros
  const from = (page - 1) * limit
  const to = from + limit - 1

  // Primero obtenemos los IDs de clientes CON membresía
  const { data: clientesConMembresia } = await supabase
    .from('suscripciones')
    .select('usuario_id')

  const idsConMembresia = (clientesConMembresia || []).map((s: { usuario_id: string }) => s.usuario_id)
  const idsUnicos = [...new Set(idsConMembresia)]

  let query = supabase
    .from('profiles')
    .select('*', { count: 'exact' })
    .eq('rol_id', rol_id)

  if (idsUnicos.length > 0) {
    query = query.not('id', 'in', `(${idsUnicos.join(',')})`)
  }

  if (busqueda) {
    query = query.or(`nombre.ilike.%${busqueda}%,apellido.ilike.%${busqueda}%,dni.eq.${busqueda},telefono.ilike.%${busqueda}%`)
  }

  if (activo !== undefined) {
    query = query.eq('activo', activo)
  }

  const { data, count, error } = await query
    .order('nombre')
    .range(from, to)

  if (error) {
    console.error('Error listando clientes sin membresía:', error)
    return { data: [], count: 0, page, totalPages: 0 }
  }

  const clientes = (data || []).map(addEmail)
  const clientesEnriquecidos = await enrichConMembresia(clientes)

  return {
    data: clientesEnriquecidos,
    count: count || 0,
    page,
    totalPages: Math.ceil((count || 0) / limit)
  }
}

async function listarClientesPorEstadoMembresia(filtros: {
  busqueda?: string
  activo?: boolean
  rol_id?: number
  estado_suscripcion: 'activos' | 'vencidos'
  page: number
  limit: number
}): Promise<ClienteListResult> {
  const { busqueda, activo, rol_id = 3, estado_suscripcion, page, limit } = filtros
  const from = (page - 1) * limit
  const to = from + limit - 1

  const hoy = new Date().toISOString().split('T')[0]

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

  let query = supabase
    .from('profiles')
    .select('*', { count: 'exact' })
    .eq('rol_id', rol_id)
    .in('id', idsUnicos)

  if (busqueda) {
    query = query.or(`nombre.ilike.%${busqueda}%,apellido.ilike.%${busqueda}%,dni.eq.${busqueda},telefono.ilike.%${busqueda}%`)
  }

  if (activo !== undefined) {
    query = query.eq('activo', activo)
  }

  const { data, count, error } = await query
    .order('nombre')
    .range(from, to)

  if (error) {
    console.error('Error listando clientes por estado membresía:', error)
    return { data: [], count: 0, page, totalPages: 0 }
  }

  const clientes = (data || []).map(addEmail)
  const clientesEnriquecidos = await enrichConMembresia(clientes)

  return {
    data: clientesEnriquecidos,
    count: count || 0,
    page,
    totalPages: Math.ceil((count || 0) / limit)
  }
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
      .eq('rol_id', 3)
      .eq('activo', true),
    supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('rol_id', 3)
      .eq('activo', false)
  ])

  return {
    activos: activos.count || 0,
    inactivos: inactivos.count || 0,
    total: (activos.count || 0) + (inactivos.count || 0)
  }
}