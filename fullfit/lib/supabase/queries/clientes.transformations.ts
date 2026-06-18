import { supabase } from '../client'
import type { ProfileWithEmail } from '../types'
import type { ClienteConMembresia } from './clientes.types'
import { getFechaLima } from '@/lib/utils'

export function addEmail(profile: Record<string, unknown>): ProfileWithEmail {
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

export async function enrichConMembresia(clientes: ProfileWithEmail[]): Promise<ClienteConMembresia[]> {
  if (clientes.length === 0) return []

  const ids = clientes.map(c => c.id)
  const hoy = getFechaLima()

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

export function applyBusquedaFilter(
  query: ReturnType<typeof supabase.from>,
  busqueda: string
) {
  return query.or(
    `nombre.ilike.%${busqueda}%,apellido.ilike.%${busqueda}%,dni.eq.${busqueda},telefono.ilike.%${busqueda}%`
  )
}
