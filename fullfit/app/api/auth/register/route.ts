import { NextRequest, NextResponse } from 'next/server'
import { SignJWT } from 'jose'
import { sendEmail } from '@/lib/mail'
import { getConfirmEmail } from '@/lib/mail-templates/confirm-email'
import { createServiceRoleClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const { email, password, metadata } = await request.json()

    if (!email || !password || !metadata) {
      return NextResponse.json(
        { error: 'Email, contraseña y datos son requeridos' },
        { status: 400 }
      )
    }

    const supabase = createServiceRoleClient()

    const { data: existingUsers } = await supabase.auth.admin.listUsers()
    const userExists = existingUsers?.users?.some(u => u.email === email.toLowerCase().trim())

    if (userExists) {
      return NextResponse.json(
        { error: 'Este correo ya está registrado' },
        { status: 400 }
      )
    }

    const { data: userData, error: createError } = await supabase.auth.admin.createUser({
      email: email.toLowerCase().trim(),
      password,
      email_confirm: false,
      user_metadata: metadata,
    })

    if (createError) {
      console.error('Error creando usuario:', createError)
      return NextResponse.json(
        { error: createError.message },
        { status: 500 }
      )
    }

    const userId = userData.user.id

    const secret = new TextEncoder().encode(process.env.JWT_SECRET)
    const token = await new SignJWT({
      userId,
      email: email.toLowerCase().trim(),
      type: 'email_confirm',
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('24h')
      .sign(secret)

    const confirmUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/confirm?token=${token}`

    await sendEmail({
      to: email,
      subject: 'Confirma tu cuenta — FULLFORMA',
      html: getConfirmEmail(metadata.nombre, confirmUrl),
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error en register:', error)
    return NextResponse.json(
      { error: 'Error al registrar el usuario' },
      { status: 500 }
    )
  }
}
