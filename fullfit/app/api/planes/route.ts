import { NextRequest, NextResponse } from 'next/server'
import { requireAuthenticatedRecepcionista } from '@/lib/auth/api-guard'
import { createClient } from '@supabase/supabase-js'
import type { CrearPlanPayload } from '@/lib/supabase/queries/planes.types'

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
    const activo = searchParams.get('activo') || undefined
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    let query = supabaseAdmin
      .from('planes_membresia')
      .select('*', { count: 'exact' })

    if (busqueda) {
      query = query.ilike('nombre', `%${busqueda}%`)
    }

    if (activo !== undefined) {
      query = query.eq('activo', activo === 'true')
    }

    query = query.order('creado_en', { ascending: false })

    const from = (page - 1) * limit
    const to = from + limit - 1
    query = query.range(from, to)

    const { data, count, error } = await query

    if (error) {
      console.error('Error obteniendo planes:', error)
      return NextResponse.json({ error: 'Error al obtener planes' }, { status: 500 })
    }

    return NextResponse.json({
      data: data || [],
      count: count || 0,
      page,
      totalPages: Math.ceil((count || 0) / limit)
    })
  } catch (error: any) {
    console.error('Error en GET /api/planes:', error)
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
      return NextResponse.json({ error: 'Solo los administradores pueden crear planes' }, { status: 403 })
    }

    const body: CrearPlanPayload = await request.json()
    const { nombre, precio, duracion_dias } = body

    if (!nombre || precio === undefined || !duracion_dias) {
      return NextResponse.json({ error: 'Faltan campos requeridos (nombre, precio, duracion_dias)' }, { status: 400 })
    }

    if (precio < 0) {
      return NextResponse.json({ error: 'El precio no puede ser negativo' }, { status: 400 })
    }

    if (duracion_dias <= 0) {
      return NextResponse.json({ error: 'La duración debe ser mayor a 0 días' }, { status: 400 })
    }

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { data: existing } = await supabaseAdmin
      .from('planes_membresia')
      .select('id')
      .ilike('nombre', nombre)
      .maybeSingle()

    if (existing) {
      return NextResponse.json({ error: 'Ya existe un plan con ese nombre' }, { status: 400 })
    }

    const { data: newPlan, error: insertError } = await supabaseAdmin
      .from('planes_membresia')
      .insert({
        nombre,
        descripcion: body.descripcion || null,
        precio,
        duracion_dias,
        activo: body.activo !== undefined ? body.activo : true,
        features: body.features || []
      } as any)
      .select()
      .single()

    if (insertError) {
      console.error('Error creando plan:', insertError)
      return NextResponse.json({ error: 'Error al crear el plan' }, { status: 500 })
    }

    await supabaseAdmin.from('auditoria').insert({
      usuario_id: user.id,
      tabla_afectada: 'planes_membresia',
      accion: 'INSERT',
      detalle: { action: 'crear_plan', plan_id: newPlan?.id, nombre }
    } as any)

    return NextResponse.json({ message: 'Plan creado exitosamente', plan: newPlan }, { status: 201 })
  } catch (error: any) {
    console.error('Error en POST /api/planes:', error)
    return NextResponse.json({ error: error.message || 'Error interno del servidor' }, { status: 500 })
  }
}
