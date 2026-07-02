import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { requireAuthenticatedRecepcionista } from '@/lib/auth/api-guard'
import type { ActualizarSedePayload } from '@/lib/supabase/queries/sedes.types'

export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const auth = await requireAuthenticatedRecepcionista(request)
    if (!auth.success) return auth.response
    const { user, supabase } = auth
    const { id } = await context.params
    const sedeId = parseInt(id)

    if (isNaN(sedeId)) {
      return NextResponse.json({ error: 'ID de sede inválido' }, { status: 400 })
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('rol_id')
      .eq('id', user.id)
      .single()

    if (profile?.rol_id !== 1) {
      return NextResponse.json({ error: 'Solo los administradores pueden actualizar sedes' }, { status: 403 })
    }

    const body: ActualizarSedePayload = await request.json()

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    if (body.nombre) {
      const { data: existing } = await supabaseAdmin
        .from('sedes')
        .select('id')
        .eq('nombre', body.nombre)
        .neq('id', sedeId)
        .maybeSingle()

      if (existing) {
        return NextResponse.json({ error: 'Ya existe otra sede con ese nombre' }, { status: 400 })
      }
    }

    if (body.direccion) {
      const { data: existing } = await supabaseAdmin
        .from('sedes')
        .select('id')
        .eq('direccion', body.direccion)
        .neq('id', sedeId)
        .maybeSingle()

      if (existing) {
        return NextResponse.json({ error: 'Ya existe otra sede con esa dirección' }, { status: 400 })
      }
    }

    const { error: updateError } = await supabaseAdmin
      .from('sedes')
      .update(body as never)
      .eq('id', sedeId)

    if (updateError) {
      console.error('Error actualizando sede:', updateError)
      return NextResponse.json({ error: 'Error al actualizar la sede' }, { status: 500 })
    }

    await supabaseAdmin.from('auditoria').insert({
      usuario_id: user.id,
      tabla_afectada: 'sedes',
      accion: 'UPDATE',
      detalle: { action: 'actualizar_sede', sede_id: sedeId, changes: body }
    } as any)

    return NextResponse.json({ message: 'Sede actualizada exitosamente' })
  } catch (error: any) {
    console.error('Error en PUT /api/sedes/[id]:', error)
    return NextResponse.json({ error: error.message || 'Error interno del servidor' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const auth = await requireAuthenticatedRecepcionista(request)
    if (!auth.success) return auth.response
    const { user, supabase } = auth
    const { id } = await context.params
    const sedeId = parseInt(id)

    if (isNaN(sedeId)) {
      return NextResponse.json({ error: 'ID de sede inválido' }, { status: 400 })
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('rol_id')
      .eq('id', user.id)
      .single()

    if (profile?.rol_id !== 1) {
      return NextResponse.json({ error: 'Solo los administradores pueden cambiar estado de sedes' }, { status: 403 })
    }

    const body = await request.json()
    const { estado } = body

    if (!estado || !['activa', 'inactiva'].includes(estado)) {
      return NextResponse.json({ error: 'Estado inválido. Use "activa" o "inactiva"' }, { status: 400 })
    }

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { error: updateError } = await supabaseAdmin
      .from('sedes')
      .update({ estado } as never)
      .eq('id', sedeId)

    if (updateError) {
      console.error('Error cambiando estado de sede:', updateError)
      return NextResponse.json({ error: 'Error al cambiar el estado de la sede' }, { status: 500 })
    }

    await supabaseAdmin.from('auditoria').insert({
      usuario_id: user.id,
      tabla_afectada: 'sedes',
      accion: 'UPDATE',
      detalle: { action: 'cambiar_estado_sede', sede_id: sedeId, nuevo_estado: estado }
    } as any)

    return NextResponse.json({ message: `Sede ${estado === 'activa' ? 'activada' : 'desactivada'} exitosamente` })
  } catch (error: any) {
    console.error('Error en PATCH /api/sedes/[id]:', error)
    return NextResponse.json({ error: error.message || 'Error interno del servidor' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const auth = await requireAuthenticatedRecepcionista(request)
    if (!auth.success) return auth.response
    const { user, supabase } = auth
    const { id } = await context.params
    const sedeId = parseInt(id)

    if (isNaN(sedeId)) {
      return NextResponse.json({ error: 'ID de sede inválido' }, { status: 400 })
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('rol_id')
      .eq('id', user.id)
      .single()

    if (profile?.rol_id !== 1) {
      return NextResponse.json({ error: 'Solo los administradores pueden eliminar sedes' }, { status: 403 })
    }

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { data: sede, error: fetchError } = await supabaseAdmin
      .from('sedes')
      .select('imagen_url')
      .eq('id', sedeId)
      .single()

    if (fetchError || !sede) {
      return NextResponse.json({ error: 'Sede no encontrada' }, { status: 404 })
    }

    if (sede.imagen_url) {
      const filePath = sede.imagen_url.split('/Fotos_Sedes/')[1]
      console.log('[DELETE sede] imagen_url:', sede.imagen_url)
      console.log('[DELETE sede] filePath extraído:', filePath)

      if (filePath) {
        const { data: removeData, error: removeError } = await supabaseAdmin.storage
          .from('Fotos_Sedes')
          .remove([filePath])

        console.log('[DELETE sede] remove result:', { data: removeData, error: removeError })

        if (removeError) {
          console.error('[DELETE sede] Error eliminando imagen del storage:', removeError)
        }
      } else {
        console.error('[DELETE sede] No se pudo extraer path de:', sede.imagen_url)
      }
    } else {
      console.log('[DELETE sede] La sede no tiene imagen_url')
    }

    const { error: deleteError } = await supabaseAdmin
      .from('sedes')
      .delete()
      .eq('id', sedeId)

    if (deleteError) {
      console.error('Error eliminando sede:', deleteError)
      return NextResponse.json({ error: 'Error al eliminar la sede' }, { status: 500 })
    }

    await supabaseAdmin.from('auditoria').insert({
      usuario_id: user.id,
      tabla_afectada: 'sedes',
      accion: 'DELETE',
      detalle: { action: 'eliminar_sede', sede_id: sedeId }
    } as any)

    return NextResponse.json({ message: 'Sede eliminada exitosamente' })
  } catch (error: any) {
    console.error('Error en DELETE /api/sedes/[id]:', error)
    return NextResponse.json({ error: error.message || 'Error interno del servidor' }, { status: 500 })
  }
}
