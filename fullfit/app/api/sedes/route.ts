import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { requireAuthenticatedRecepcionista } from '@/lib/auth/api-guard'
import type { CrearSedePayload } from '@/lib/supabase/queries/sedes.types'

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAuthenticatedRecepcionista(request)
    if (!auth.success) return auth.response

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { searchParams } = new URL(request.url)
    const busqueda = searchParams.get('busqueda') || undefined
    const estado = searchParams.get('estado') || undefined
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    let query = supabaseAdmin
      .from('sedes')
      .select('*', { count: 'exact' })

    if (busqueda) {
      query = query.or(`nombre.ilike.%${busqueda}%,direccion.ilike.%${busqueda}%`)
    }

    if (estado) {
      query = query.eq('estado', estado)
    }

    query = query.order('creado_en', { ascending: false })

    const from = (page - 1) * limit
    const to = from + limit - 1
    query = query.range(from, to)

    const { data, count, error } = await query

    if (error) {
      console.error('Error obteniendo sedes:', error)
      return NextResponse.json({ error: 'Error al obtener sede' }, { status: 500 })
    }

    return NextResponse.json({
      data: data || [],
      count: count || 0,
      page,
      totalPages: Math.ceil((count || 0) / limit)
    })
  } catch (error: any) {
    console.error('Error en GET /api/sedes:', error)
    return NextResponse.json({ error: error.message || 'Error interno del servidor' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAuthenticatedRecepcionista(request)
    if (!auth.success) return auth.response
    const { user, supabase } = auth

    const { data: profile } = await supabase
      .from('profiles')
      .select('rol_id')
      .eq('id', user.id)
      .single()

    if (profile?.rol_id !== 1) {
      return NextResponse.json({ error: 'Solo los administradores pueden crear sede' }, { status: 403 })
    }

    const body: CrearSedePayload = await request.json()
    const { nombre, direccion, telefono, email } = body

    if (!nombre || !direccion || !telefono || !email) {
      return NextResponse.json({ error: 'Faltan campos requeridos' }, { status: 400 })
    }

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { data: existingByName } = await supabaseAdmin
      .from('sedes')
      .select('id')
      .eq('nombre', nombre)
      .maybeSingle()

    if (existingByName) {
      return NextResponse.json({ error: 'Ya existe una sede con ese nombre' }, { status: 400 })
    }

    const { data: existingByAddress } = await supabaseAdmin
      .from('sedes')
      .select('id')
      .eq('direccion', direccion)
      .maybeSingle()

    if (existingByAddress) {
      return NextResponse.json({ error: 'Ya existe una sede con esa dirección' }, { status: 400 })
    }

    const { data: newSede, error: insertError } = await supabaseAdmin
      .from('sedes')
      .insert({
        nombre,
        direccion,
        telefono,
        email,
        imagen_url: body.imagen_url || null,
        latitud: body.latitud || null,
        longitud: body.longitud || null,
        apertura_lv: body.apertura_lv || '06:00',
        cierre_lv: body.cierre_lv || '22:00',
        apertura_sab: body.apertura_sab || '07:00',
        cierre_sab: body.cierre_sab || '22:00',
        apertura_dom: body.apertura_dom || null,
        cierre_dom: body.cierre_dom || null,
        estado: 'activa'
      } as any)
      .select()
      .single()

    if (insertError) {
      console.error('Error creando sede:', insertError)
      return NextResponse.json({ error: 'Error al crear la sede' }, { status: 500 })
    }

    await supabaseAdmin.from('auditoria').insert({
      usuario_id: user.id,
      tabla_afectada: 'sedes',
      accion: 'INSERT',
      detalle: { action: 'crear_sede', sede_id: newSede?.id, nombre }
    } as any)

    return NextResponse.json({ message: 'Sede creada exitosamente', sede: newSede }, { status: 201 })
  } catch (error: any) {
    console.error('Error en POST /api/sedes:', error)
    return NextResponse.json({ error: error.message || 'Error interno del servidor' }, { status: 500 })
  }
}
