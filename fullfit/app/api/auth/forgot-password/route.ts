import { NextRequest, NextResponse } from 'next/server'
import { SignJWT } from 'jose'
import { sendEmail } from '@/lib/mail'
import { getResetPasswordEmail } from '@/lib/mail-templates/reset-password'
import { createServiceRoleClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: 'Email es requerido' },
        { status: 400 }
      )
    }

    const supabase = createServiceRoleClient()

    const { data: { users }, error: usersError } = await supabase.auth.admin.listUsers()

    if (usersError) {
      console.error('Error listando usuarios:', usersError)
      return NextResponse.json({ success: true })
    }

    const user = users?.find(u => u.email === email.toLowerCase().trim())

    if (!user) {
      return NextResponse.json({ success: true })
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('nombre')
      .eq('id', user.id)
      .single()

    const userName = profile?.nombre || 'Usuario'

    const secret = new TextEncoder().encode(process.env.JWT_SECRET)
    const token = await new SignJWT({
      userId: user.id,
      email: user.email,
      type: 'password_reset',
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('1h')
      .sign(secret)

    const resetUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/update-password?token=${token}`

    await sendEmail({
      to: email,
      subject: 'Restablecer contraseña — FULLFORMA',
      html: getResetPasswordEmail(userName, resetUrl),
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error en forgot-password:', error)
    return NextResponse.json(
      { error: 'Error al enviar el correo' },
      { status: 500 }
    )
  }
}
