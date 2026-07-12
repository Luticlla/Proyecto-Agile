import { NextRequest, NextResponse } from 'next/server'
import { requireAuthenticatedRecepcionista } from '@/lib/auth/api-guard'
import { createClient } from '@supabase/supabase-js'

export async function PATCH(request: NextRequest, context: { params: Promise<{ id: string }> }) {
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
      return NextResponse.json({ error: 'Solo los administradores pueden cambiar estado de planes' }, { status: 403 })
    }

    const body = await request.json()
    const { activo, confirm } = body

    if (typeof activo !== 'boolean') {
      return NextResponse.json({ error: 'El campo "activo" debe ser un booleano' }, { status: 400 })
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

    const { count: suscripcionesActivas } = await supabaseAdmin
      .from('suscripciones')
      .select('*', { count: 'exact', head: true })
      .eq('plan_id', planId)
      .eq('estado', 'activa')

    if (!activo && suscripcionesActivas && suscripcionesActivas > 0 && !confirm) {
      return NextResponse.json({
        warning: `Este plan tiene ${suscripcionesActivas} suscripción(es) activa(s). Los miembros actuales mantendrán su acceso hasta la fecha de vencimiento.`,
        confirmRequired: true
      }, { status: 200 })
    }

    const { error: updateError } = await supabaseAdmin
      .from('planes_membresia')
      .update({ activo } as never)
      .eq('id', planId)

    if (updateError) {
      console.error('Error cambiando estado del plan:', updateError)
      return NextResponse.json({ error: 'Error al cambiar el estado del plan' }, { status: 500 })
    }

    await supabaseAdmin.from('auditoria').insert({
      usuario_id: user.id,
      tabla_afectada: 'planes_membresia',
      accion: 'UPDATE',
      detalle: { action: 'cambiar_estado_plan', plan_id: planId, nuevo_estado: activo }
    } as any)

    return NextResponse.json({ message: `Plan ${activo ? 'activado' : 'desactivado'} exitosamente` })
  } catch (error: any) {
    console.error('Error en PATCH /api/planes/[id]/estado:', error)
    return NextResponse.json({ error: error.message || 'Error interno del servidor' }, { status: 500 })
  }
}
