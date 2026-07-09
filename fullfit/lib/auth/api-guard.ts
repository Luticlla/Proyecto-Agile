import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { RECEPCIONISTA_ROLES } from '@/constants/memberships'
import type { SupabaseClient } from '@supabase/supabase-js'

interface AuthUser {
  id: string
  sedeId: number | null
  rolId: number
}

type AuthGuardResult =
  | { success: true; supabase: SupabaseClient; user: AuthUser; supabaseResponse: NextResponse }
  | { success: false; response: NextResponse }

/**
 * Verifica autenticación y permisos de recepcionista/admin para API routes.
 * Retorna el cliente supabase, usuario autenticado con sedeId y rolId.
 */
export async function requireAuthenticatedRecepcionista(
  request: NextRequest
): Promise<AuthGuardResult> {
  const supabaseResponse = NextResponse.next({ request })
  const supabase = createServerSupabaseClient(request, supabaseResponse)

  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return {
      success: false,
      response: NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      )
    }
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('rol_id, sede_id')
    .eq('id', user.id)
    .single()

  if (!profile || !RECEPCIONISTA_ROLES.includes(profile.rol_id)) {
    return {
      success: false,
      response: NextResponse.json(
        { error: 'No tiene permisos de recepcionista' },
        { status: 403 }
      )
    }
  }

  return { 
    success: true, 
    supabase, 
    user: { 
      id: user.id, 
      sedeId: profile.sede_id, 
      rolId: profile.rol_id 
    }, 
    supabaseResponse 
  }
}

/**
 * Verifica solo autenticación (sin verificación de rol).
 * Útil para rutas que requieren cualquier usuario autenticado.
 */
export async function requireAuthenticated(
  request: NextRequest
): Promise<AuthGuardResult> {
  const supabaseResponse = NextResponse.next({ request })
  const supabase = createServerSupabaseClient(request, supabaseResponse)

  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return {
      success: false,
      response: NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      )
    }
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('rol_id, sede_id')
    .eq('id', user.id)
    .single()

  return { 
    success: true, 
    supabase, 
    user: { 
      id: user.id, 
      sedeId: profile?.sede_id ?? null, 
      rolId: profile?.rol_id ?? 3 
    }, 
    supabaseResponse 
  }
}