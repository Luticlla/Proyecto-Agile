import { NextRequest, NextResponse } from 'next/server'
import { requireAuthenticatedRecepcionista } from '@/lib/auth/api-guard'
export async function GET(request: NextRequest) {
  try {
    const auth = await requireAuthenticatedRecepcionista(request)
    if (!auth.success) return auth.response
    const { supabase } = auth
    const { searchParams } = new URL(request.url)
    const q = searchParams.get('q') || ''

    if (q.trim().length < 2) {
      return NextResponse.json({ clientes: [] })
    }

    let query = supabase
      .from('profiles')
      .select('id, nombre, apellido, dni')
      .or(`nombre.ilike.%${q}%,apellido.ilike.%${q}%,dni.ilike.%${q}%`)
      .eq('rol_id', 3)
      .order('nombre')
      .limit(5)

    const { data, error } = await query

    if (error) {
      console.error('Error buscando clientes:', error)
      return NextResponse.json({ clientes: [] })
    }

    const clienteIds = (data || []).map((c) => c.id)

    const membresiaMap = new Map<string, string>()
    if (clienteIds.length > 0) {
      const { data: suscripciones } = await supabase
        .from('suscripciones')
        .select('usuario_id, estado, fecha_fin')
        .in('usuario_id', clienteIds)
        .order('fecha_fin', { ascending: false })

      const hoy = new Date().toISOString().split('T')[0]
      for (const sub of (suscripciones || []) as { usuario_id: string; estado: string; fecha_fin: string }[]) {
        if (!membresiaMap.has(sub.usuario_id)) {
          let estado = sub.estado
          if (estado === 'activa' && sub.fecha_fin < hoy) {
            estado = 'vencida'
          }
          membresiaMap.set(sub.usuario_id, estado)
        }
      }
    }

    const clientes = (data || []).map((c) => ({
      id: c.id,
      nombre: c.nombre,
      apellido: c.apellido,
      dni: c.dni,
      membresia_estado: membresiaMap.get(c.id) || null
    }))

    return NextResponse.json({ clientes })

  } catch (error) {
    console.error('Error en búsqueda de clientes:', error)
    return NextResponse.json({ clientes: [] })
  }
}
