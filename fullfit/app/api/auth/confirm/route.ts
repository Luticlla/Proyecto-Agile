import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'
import { createServiceRoleClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json()

    if (!token) {
      return NextResponse.json(
        { error: 'Token es requerido' },
        { status: 400 }
      )
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET)
    const { payload } = await jwtVerify(token, secret)

    if (payload.type !== 'email_confirm') {
      return NextResponse.json(
        { error: 'Token inválido' },
        { status: 400 }
      )
    }

    const supabase = createServiceRoleClient()

    const { error } = await supabase.auth.admin.updateUserById(
      payload.userId as string,
      { email_confirm: true }
    )

    if (error) {
      console.error('Error confirmando usuario:', error)
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error en confirm:', error)
    return NextResponse.json(
      { error: 'Token inválido o expirado' },
      { status: 400 }
    )
  }
}
