import { NextRequest, NextResponse } from 'next/server'
import { requireAuthenticatedRecepcionista } from '@/lib/auth/api-guard'
import { createClient } from '@supabase/supabase-js'
import type { ActualizarPlanPayload } from '@/lib/supabase/queries/planes.types'

export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const auth = await requireAuthenticatedRecepcionista(request)
    if (!auth.success) return auth.response
    const { id } = await context.params
    const planId = parseInt(id)

    if (isNaN(planId)) {
      return NextResponse.json({ error: 'ID de plan inválido' }, { status: 400 })
    }

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { data: plan, error } = await supabaseAdmin
      .from('planes_membresia')
      .select('*')
      .eq('id', planId)
      .single()

    if (error || !plan) {
      return NextResponse.json({ error: 'Plan no encontrado' }, { status: 404 })
    }

    return NextResponse.json({ plan })
  } catch (error: any) {
    console.error('Error en GET /api/planes/[id]:', error)
    return NextResponse.json({ error: error.message || 'Error interno del servidor' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const auth = await requireAuthenticatedRecepcionista(request)
    if (!auth.success) return auth.response
    const { user, supabase } = auth
    const { id } = await context.params
    const planId = parseInt(id)

    if (isNaN(planId)) {
      return NextResponse.json({ error: 'ID de plan inválido' }, { status: 400 })
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('rol_id')
      .eq('id', user.id)
      .single()

    if (profile?.rol_id !== 1) {
      return NextResponse.json({ error: 'Solo los administradores pueden actualizar planes' }, { status: 403 })
    }

    const body: ActualizarPlanPayload = await request.json()

    if (body.precio !== undefined && body.precio <= 0) {
      return NextResponse.json({ error: 'El precio debe ser mayor a 0' }, { status: 400 })
    }

    if (body.duracion_dias !== undefined && body.duracion_dias <= 0) {
      return NextResponse.json({ error: 'La duración debe ser mayor a 0 días' }, { status: 400 })
    }

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    if (body.nombre) {
      const { data: existing } = await supabaseAdmin
        .from('planes_membresia')
        .select('id')
        .ilike('nombre', body.nombre)
        .neq('id', planId)
        .maybeSingle()

      if (existing) {
        return NextResponse.json({ error: 'Ya existe otro plan con ese nombre' }, { status: 400 })
      }
    }

    const { error: updateError } = await supabaseAdmin
      .from('planes_membresia')
      .update(body as never)
      .eq('id', planId)

    if (updateError) {
      console.error('Error actualizando plan:', updateError)
      return NextResponse.json({ error: 'Error al actualizar el plan' }, { status: 500 })
    }

    await supabaseAdmin.from('auditoria').insert({
      usuario_id: user.id,
      tabla_afectada: 'planes_membresia',
      accion: 'UPDATE',
      detalle: { action: 'actualizar_plan', plan_id: planId, changes: body }
    } as any)

    return NextResponse.json({ message: 'Plan actualizado exitosamente' })
  } catch (error: any) {
    console.error('Error en PUT /api/planes/[id]:', error)
    return NextResponse.json({ error: error.message || 'Error interno del servidor' }, { status: 500 })
  }
}
