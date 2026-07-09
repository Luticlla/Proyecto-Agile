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

    if (body.precio !== undefined && body.precio < 3) {
      return NextResponse.json({ error: 'El precio debe ser mayor a S/ 3.00' }, { status: 400 })
    }

    if (body.duracion_dias !== undefined && body.duracion_dias > 365) {
      return NextResponse.json({ error: 'La duración máxima es de 365 días' }, { status: 400 })
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

    const updateData: Record<string, unknown> = {}
    if (body.nombre !== undefined) updateData.nombre = body.nombre
    if (body.descripcion !== undefined) updateData.descripcion = body.descripcion
    if (body.precio !== undefined) updateData.precio = body.precio
    if (body.duracion_dias !== undefined) updateData.duracion_dias = body.duracion_dias
    if (body.activo !== undefined) updateData.activo = body.activo
    if (body.features !== undefined) updateData.features = body.features

    const { error: updateError } = await supabaseAdmin
      .from('planes_membresia')
      .update(updateData)
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

export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
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
      return NextResponse.json({ error: 'Solo los administradores pueden eliminar planes' }, { status: 403 })
    }

    let confirm = false
    try {
      const body = await request.json()
      confirm = body.confirm === true
    } catch {
      // GET/DELETE sin body
    }

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { data: plan, error: fetchError } = await supabaseAdmin
      .from('planes_membresia')
      .select('nombre')
      .eq('id', planId)
      .single()

    if (fetchError || !plan) {
      return NextResponse.json({ error: 'Plan no encontrado' }, { status: 404 })
    }

    if (!confirm) {
      const { count: suscripcionesActivas } = await supabaseAdmin
        .from('suscripciones')
        .select('*', { count: 'exact', head: true })
        .eq('plan_id', planId)
        .eq('estado', 'activa')

      if (suscripcionesActivas && suscripcionesActivas > 0) {
        return NextResponse.json({
          confirmRequired: true,
          suscripcionesActivas,
          warning: `Este plan tiene ${suscripcionesActivas} suscripción(es) activa(s). Los miembros actuales mantendrán su acceso hasta la fecha de vencimiento.`
        }, { status: 200 })
      }
    }

    const { error: deleteError } = await supabaseAdmin
      .from('planes_membresia')
      .delete()
      .eq('id', planId)

    if (deleteError) {
      console.error('Error eliminando plan:', deleteError)
      return NextResponse.json({ error: 'Error al eliminar el plan' }, { status: 500 })
    }

    await supabaseAdmin.from('auditoria').insert({
      usuario_id: user.id,
      tabla_afectada: 'planes_membresia',
      accion: 'DELETE',
      detalle: { action: 'eliminar_plan', plan_id: planId, nombre: plan.nombre }
    } as any)

    return NextResponse.json({ message: 'Plan eliminado exitosamente' })
  } catch (error: any) {
    console.error('Error en DELETE /api/planes/[id]:', error)
    return NextResponse.json({ error: error.message || 'Error interno del servidor' }, { status: 500 })
  }
}
