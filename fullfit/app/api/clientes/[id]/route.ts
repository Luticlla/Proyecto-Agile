import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { requireAuthenticatedRecepcionista } from '@/lib/auth/api-guard'

export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const auth = await requireAuthenticatedRecepcionista(request)
    if (!auth.success) return auth.response

    const { id } = await context.params
    const body = await request.json()
    const { email, telefono, dni, nombre, apellido, reniecValidado } = body

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Email es requerido' }, { status: 400 })
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Email no válido' }, { status: 400 })
    }

    if (telefono && !/^9\d{8}$/.test(telefono)) {
      return NextResponse.json({ error: 'El teléfono debe tener 9 dígitos y comenzar con 9' }, { status: 400 })
    }

    if (dni && !/^\d{8}$/.test(dni)) {
      return NextResponse.json({ error: 'El DNI debe tener exactamente 8 dígitos' }, { status: 400 })
    }

    if (dni && !reniecValidado) {
      return NextResponse.json({ error: 'Debes validar el DNI con RENIEC antes de guardar' }, { status: 400 })
    }

    if (!nombre || typeof nombre !== 'string' || !apellido || typeof apellido !== 'string') {
      return NextResponse.json({ error: 'Nombre y apellido son requeridos' }, { status: 400 })
    }

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Verificar que el usuario existe
    const { data: profile, error: fetchError } = await supabaseAdmin
      .from('profiles')
      .select('id, email, dni')
      .eq('id', id)
      .single()

    if (fetchError || !profile) {
      return NextResponse.json({ error: 'Cliente no encontrado' }, { status: 404 })
    }

    // Verificar email duplicado si cambió
    if (email.toLowerCase().trim() !== profile.email?.toLowerCase()) {
      const { data: emailExistente } = await supabaseAdmin
        .from('profiles')
        .select('id')
        .eq('email', email.toLowerCase().trim())
        .neq('id', id)
        .maybeSingle()

      if (emailExistente) {
        return NextResponse.json({ 
          error: 'Este correo ya está registrado en el sistema',
          code: 'EMAIL_EXISTS'
        }, { status: 409 })
      }
    }

    // Verificar DNI duplicado si cambió
    if (dni && dni !== profile.dni) {
      const { data: dniExistente } = await supabaseAdmin
        .from('profiles')
        .select('id')
        .eq('dni', dni)
        .neq('id', id)
        .maybeSingle()

      if (dniExistente) {
        return NextResponse.json({ 
          error: 'Este DNI ya está registrado en el sistema',
          code: 'DNI_EXISTS'
        }, { status: 409 })
      }
    }

    // Preparar datos de actualización
    const updateData: Record<string, string | null> = { email, telefono, nombre, apellido }
    if (dni && reniecValidado) {
      updateData.dni = dni
    }

    // Actualizar profiles
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .update(updateData)
      .eq('id', id)

    if (profileError) {
      console.error('Error actualizando profile:', profileError)
      return NextResponse.json({ error: 'Error al actualizar el perfil' }, { status: 500 })
    }

    // Actualizar auth.users email si cambió
    if (email.toLowerCase().trim() !== profile.email?.toLowerCase()) {
      const { error: authError } = await supabaseAdmin.auth.admin.updateUserById(
        id,
        { email }
      )

      if (authError) {
        console.error('Error actualizando auth.users:', authError)
      }
    }

    return NextResponse.json({ message: 'Cliente actualizado exitosamente' })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error interno del servidor'
    console.error('Error en PUT /api/clientes/[id]:', error)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
