import { NextRequest, NextResponse } from 'next/server'
import { requireAuthenticatedRecepcionista } from '@/lib/auth/api-guard'
import { createClient } from '@supabase/supabase-js'

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAuthenticatedRecepcionista(request)
    if (!auth.success) return auth.response

    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')
    const excludeId = searchParams.get('excludeId')

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Email es requerido' }, { status: 400 })
    }

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const query = supabaseAdmin
      .from('profiles')
      .select('id')
      .eq('email', email.toLowerCase().trim())

    if (excludeId) {
      query.neq('id', excludeId)
    }

    const { data, error } = await query.maybeSingle()

    if (error) {
      console.error('Error verificando email:', error)
      return NextResponse.json({ error: 'Error al verificar el email' }, { status: 500 })
    }

    return NextResponse.json({ exists: !!data })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error interno del servidor'
    console.error('Error en GET /api/clientes/check-email:', error)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
