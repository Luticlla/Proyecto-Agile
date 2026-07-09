import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'
import { createServiceRoleClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const { token, password } = await request.json()

    if (!token || !password) {
      return NextResponse.json(
        { error: 'Token y contraseña son requeridos' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'La contraseña debe tener al menos 6 caracteres' },
        { status: 400 }
      )
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET)
    const { payload } = await jwtVerify(token, secret)

    if (payload.type !== 'password_reset') {
      return NextResponse.json(
        { error: 'Token inválido' },
        { status: 400 }
      )
    }

    const supabase = createServiceRoleClient()

    const { error } = await supabase.auth.admin.updateUserById(
      payload.userId as string,
      { password }
    )

    if (error) {
      console.error('Error actualizando contraseña:', error)
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error en update-password:', error)
    return NextResponse.json(
      { error: 'Token inválido o expirado' },
      { status: 400 }
    )
  }
}
