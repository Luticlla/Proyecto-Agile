import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { requireAuthenticatedRecepcionista } from '@/lib/auth/api-guard'
import type { ActualizarUsuarioPayload } from '@/lib/supabase/queries/usuarios.types'
import { Database } from '@/lib/supabase/types'
import { verificarUltimoAdmin } from '@/lib/supabase/queries/usuarios'

export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const auth = await requireAuthenticatedRecepcionista(request)
    if (!auth.success) return auth.response
    const { user, supabase } = auth
    const { id } = await context.params

    // Validar Admin (rol_id = 1)
    const { data: profile } = await supabase
      .from('profiles')
      .select('rol_id')
      .eq('id', user.id)
      .single()

    if (profile?.rol_id !== 1) {
      return NextResponse.json({ error: 'Solo los administradores pueden actualizar usuarios' }, { status: 403 })
    }

    // Un administrador no puede desactivarse a sí mismo por seguridad (debe hacerlo otro admin)
    const body: ActualizarUsuarioPayload = await request.json()
    
    if (id === user.id && body.activo === false) {
      return NextResponse.json({ error: 'No puedes desactivar tu propia cuenta' }, { status: 400 })
    }
    
    if (id === user.id && body.rol_id !== undefined && body.rol_id !== 1) {
      return NextResponse.json({ error: 'No puedes degradar tu propio rol' }, { status: 400 })
    }

    // Validar que no se bloquee al último admin
    if (body.activo === false || (body.rol_id !== undefined && body.rol_id !== 1)) {
      const { data: targetUser } = await supabase.from('profiles').select('rol_id').eq('id', id).single()
      if (targetUser?.rol_id === 1) {
        const esUltimoAdmin = await verificarUltimoAdmin(id, supabase)
        if (esUltimoAdmin) {
          return NextResponse.json({ error: 'No se puede degradar o desactivar al último administrador del sistema.' }, { status: 400 })
        }
      }
    }

    // Inicializar cliente Service Role
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Actualizar el profile
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .update(body as any)
      .eq('id', id)

    if (profileError) {
      console.error('Error actualizando perfil:', profileError)
      return NextResponse.json({ error: 'Error al actualizar el perfil' }, { status: 500 })
    }

    // Registrar auditoría
    await supabaseAdmin.from('auditoria').insert({
      usuario_id: user.id,
      tabla_afectada: 'profiles',
      accion: 'UPDATE',
      detalle: { action: 'actualizar_usuario', target_user_id: id, changes: body }
    } as any)

    return NextResponse.json({ message: 'Usuario actualizado exitosamente' })
  } catch (error: any) {
    console.error('Error en PUT /api/usuarios/[id]:', error)
    return NextResponse.json({ error: error.message || 'Error interno del servidor' }, { status: 500 })
  }
}
