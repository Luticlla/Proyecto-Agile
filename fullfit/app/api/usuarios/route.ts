import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { requireAuthenticatedRecepcionista } from '@/lib/auth/api-guard'
import type { CrearUsuarioPayload } from '@/lib/supabase/queries/usuarios.types'
import { Database } from '@/lib/supabase/types'

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAuthenticatedRecepcionista(request)
    if (!auth.success) return auth.response
    const { user, supabase } = auth

    // Validar que el creador sea Admin (rol_id = 1)
    const { data: profile } = await supabase
      .from('profiles')
      .select('rol_id')
      .eq('id', user.id)
      .single()

    if (profile?.rol_id !== 1) {
      return NextResponse.json({ error: 'Solo los administradores pueden crear usuarios' }, { status: 403 })
    }

    const body: CrearUsuarioPayload = await request.json()
    const { nombre, apellido, dni, telefono, email, password, rol_id } = body

    if (!nombre || !apellido || !dni || !email || !rol_id) {
      return NextResponse.json({ error: 'Faltan campos requeridos' }, { status: 400 })
    }

    // Inicializar cliente Service Role para bypassing RLS
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // 1. Crear usuario en auth.users
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password: password || 'DefaultPass123!', 
      email_confirm: true,
      user_metadata: {
        nombre,
        apellido,
        dni,
      }
    })

    if (authError) {
      console.error('Error creando usuario auth:', authError)
      return NextResponse.json({ error: authError.message }, { status: 400 })
    }

    const newUserId = authData.user.id

    // 2. Esperar que el trigger termine de crear el profile por defecto
    await new Promise(resolve => setTimeout(resolve, 800))

    // 3. Actualizar el profile con los datos correctos
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .update({
        nombre,
        apellido,
        dni,
        telefono,
        rol_id,
        activo: true,
        fecha_nacimiento: body.fecha_nacimiento || null,
        genero: body.genero || null,
      } as any)
      .eq('id', newUserId)

    if (profileError) {
      console.error('Error actualizando perfil:', profileError)
      return NextResponse.json({ error: 'Error al actualizar el perfil' }, { status: 500 })
    }

    // 4. Registrar auditoría
    await supabaseAdmin.from('auditoria').insert({
      usuario_id: user.id,
      tabla_afectada: 'profiles',
      accion: 'INSERT',
      detalle: { action: 'crear_usuario', new_user_id: newUserId, rol_id }
    } as any)

    return NextResponse.json({ message: 'Usuario creado exitosamente', userId: newUserId }, { status: 201 })
  } catch (error: any) {
    console.error('Error en POST /api/usuarios:', error)
    return NextResponse.json({ error: error.message || 'Error interno del servidor' }, { status: 500 })
  }
}
