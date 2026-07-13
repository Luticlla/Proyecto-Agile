import { supabase } from '../client'
import type { ProfileUpdate, ProfileWithEmail } from '../types'
import type { ClienteFilters, ClienteListResult, ClienteConMembresia, ClienteConMembresiaCompleta, PagoResumen } from './clientes.types'
import { addEmail, enrichConMembresia, applyBusquedaFilter } from './clientes.transformations'
import { getFechaLima } from '@/lib/utils'
import { calcularDiasRestantes } from '@/lib/utils/dates'

export type { EstadoSuscripcion, ClienteFilters, ClienteListResult, ClienteConMembresia, ClienteConMembresiaCompleta, MembresiaDetalle, PagoResumen } from './clientes.types'

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

async function obtenerIdsCancelados(): Promise<string[]> {
  const { data } = await supabase
    .from('suscripciones')
    .select('usuario_id')
    .eq('estado', 'cancelada')

  return [...new Set((data || []).map((s: { usuario_id: string }) => s.usuario_id))]
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

  const idsCancelados = await obtenerIdsCancelados()
  const query = buildBaseQuery({
    busqueda, activo, rol_id,
    idsExcluidos: idsCancelados.length > 0 ? idsCancelados : undefined
  })
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

  if (estado_suscripcion === 'activos') {
    suscripcionQuery = suscripcionQuery
      .eq('estado', 'activa')
      .gte('fecha_fin', hoy)
  } else {
    suscripcionQuery = suscripcionQuery.or(
      `estado.eq.vencida,and(estado.eq.activa,fecha_fin.lt.${hoy})`
    )
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

export async function obtenerClienteConMembresia(id: string): Promise<ClienteConMembresiaCompleta | null> {
  const cliente = await obtenerCliente(id)
  if (!cliente) return null

  const hoy = getFechaLima()

  const { data: suscripcion } = await supabase
    .from('suscripciones')
    .select(`
      id,
      fecha_inicio,
      fecha_fin,
      estado,
      planes_membresia!suscripciones_plan_id_fkey (nombre, precio, duracion_dias)
    `)
    .eq('usuario_id', id)
    .order('fecha_fin', { ascending: false })
    .limit(1)
    .maybeSingle()

  const rawSuscripcion = suscripcion as Record<string, unknown> | null
  let membresia = null
  if (rawSuscripcion) {
    const plan = rawSuscripcion.planes_membresia as Record<string, unknown> | null
    const fechaFin = rawSuscripcion.fecha_fin as string
    let estado = rawSuscripcion.estado as string
    if (estado === 'activa' && fechaFin < hoy) {
      estado = 'vencida'
    }
    membresia = {
      id: rawSuscripcion.id as number,
      plan_nombre: (plan?.nombre as string) || '',
      plan_precio: (plan?.precio as number) || 0,
      plan_duracion_dias: (plan?.duracion_dias as number) || 0,
      fecha_inicio: rawSuscripcion.fecha_inicio as string,
      fecha_fin: fechaFin,
      estado,
      dias_restantes: Math.max(0, calcularDiasRestantes(fechaFin, hoy))
    }
  }

  return { ...cliente, membresia }
}

export async function obtenerHistorialPagos(
  usuarioId: string,
  limit = 5
): Promise<PagoResumen[]> {
  const { data, error } = await supabase
    .from('pagos')
    .select('id, monto, metodo_pago, estado, referencia, fecha_pago, observaciones')
    .eq('usuario_id', usuarioId)
    .order('fecha_pago', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Error obteniendo historial de pagos:', error)
    return []
  }

  return (data || []).map((p) => {
    const row = p as Record<string, unknown>
    return {
      id: row.id as number,
      monto: row.monto as number,
      metodo_pago: row.metodo_pago as string,
      estado: row.estado as string,
      referencia: row.referencia as string | null,
      fecha_pago: row.fecha_pago as string,
      observaciones: row.observaciones as string | null
    }
  })
}

export async function contarClientesPorEstado(): Promise<{
  activos: number
  inactivos: number
  total: number
}> {
  let queryActivos = supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .eq('rol_id', MIEMBRO_ROLE_ID)
    .eq('activo', true)

  let queryInactivos = supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .eq('rol_id', MIEMBRO_ROLE_ID)
    .eq('activo', false)

  const [activos, inactivos] = await Promise.all([queryActivos, queryInactivos])

  return {
    activos: activos.count || 0,
    inactivos: inactivos.count || 0,
    total: (activos.count || 0) + (inactivos.count || 0)
  }
}

export async function contarMembresiasPorEstado(): Promise<{
  activas: number
  vencidas: number
  por_vencer: number
  sin_membresia: number
}> {
  const hoy = getFechaLima()
  const hoyDate = new Date(hoy)
  const fechaLimite = new Date(hoyDate)
  fechaLimite.setDate(fechaLimite.getDate() + 7)
  const fechaLimiteStr = fechaLimite.toISOString().split('T')[0]

  let baseQuery = supabase.from('suscripciones').select('*', { count: 'exact' })

  const [activasResult, vencidasResult, porVencerResult, conMembresiaResult, totalMiembrosResult] = await Promise.all([
    baseQuery
      .eq('estado', 'activa')
      .gte('fecha_fin', hoy),
    supabase
      .from('suscripciones')
      .select('usuario_id')
      .or(`estado.eq.vencida,and(estado.eq.activa,fecha_fin.lt.${hoy})`),
    baseQuery
      .eq('estado', 'activa')
      .gte('fecha_fin', hoy)
      .lte('fecha_fin', fechaLimiteStr),
    supabase
      .from('suscripciones')
      .select('usuario_id'),
    supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('rol_id', MIEMBRO_ROLE_ID)
  ])

  const activas = activasResult.count || 0
  const por_vencer = porVencerResult.count || 0

  const idsVencidas = new Set((vencidasResult.data || []).map((r: { usuario_id: string }) => r.usuario_id))
  const vencidas = idsVencidas.size

  const idsConMembresia = new Set((conMembresiaResult.data || []).map((r: { usuario_id: string }) => r.usuario_id))
  const totalMiembros = totalMiembrosResult.count || 0
  const sin_membresia = Math.max(0, totalMiembros - idsConMembresia.size)

  return { activas, vencidas, por_vencer, sin_membresia }
}
