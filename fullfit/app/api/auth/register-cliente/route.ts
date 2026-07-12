import { NextRequest, NextResponse } from 'next/server'
import { createServiceRoleClient } from '@/lib/supabase/server'
import { requireAuthenticatedRecepcionista } from '@/lib/auth/api-guard'

/**
 * POST /api/auth/register-cliente
 * Registra un nuevo cliente directamente desde la recepcionista.
 * A diferencia del registro público, NO requiere confirmación de correo:
 * el correo se confirma automáticamente (email_confirm: true).
 */
export async function POST(request: NextRequest) {
  try {
    const auth = await requireAuthenticatedRecepcionista(request)
    if (!auth.success) return auth.response

    const { email, password, metadata } = await request.json()

    if (!email || !password || !metadata) {
      return NextResponse.json(
        { error: 'Email, contraseña y datos son requeridos' },
        { status: 400 }
      )
    }

    const supabase = createServiceRoleClient()

    // Verificar si ya existe el correo
    const { data: existingUsers } = await supabase.auth.admin.listUsers()
    const userExists = existingUsers?.users?.some(u => u.email === email.toLowerCase().trim())

    if (userExists) {
      return NextResponse.json(
        { error: 'Este correo ya está registrado' },
        { status: 400 }
      )
    }

    // Verificar si el DNI ya está registrado
    if (metadata.dni) {
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('dni', metadata.dni)
        .maybeSingle()

      if (existingProfile) {
        return NextResponse.json(
          { error: 'Este DNI ya está registrado' },
          { status: 400 }
        )
      }
    }

    // Crear usuario con confirmación automática (sin email de verificación)
    const { data: userData, error: createError } = await supabase.auth.admin.createUser({
      email: email.toLowerCase().trim(),
      password,
      email_confirm: true, // Confirmado automáticamente
      user_metadata: metadata,
    })

    if (createError) {
      console.error('Error creando cliente:', createError)
      return NextResponse.json(
        { error: createError.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      usuario_id: userData.user.id,
    })
  } catch (error) {
    console.error('Error en register-cliente:', error)
    return NextResponse.json(
      { error: 'Error al registrar el cliente' },
      { status: 500 }
    )
  }
}
