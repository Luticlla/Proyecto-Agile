import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { RECEPCIONISTA_ROLES } from '@/constants/memberships'
import type { SupabaseClient } from '@supabase/supabase-js'

type AuthGuardResult =
  | { success: true; supabase: SupabaseClient; user: { id: string }; supabaseResponse: NextResponse }
  | { success: false; response: NextResponse }

/**
 * Verifica autenticación y permisos de recepcionista para API routes.
 * Retorna el cliente supabase y usuario autenticado, o una respuesta de error.
 *
 * @example
 * ```ts
 * const auth = await requireAuthenticatedRecepcionista(request)
 * if (!auth.success) return auth.response
 * const { supabase, user } = auth
 * ```
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
    .select('rol_id')
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

  return { success: true, supabase, user, supabaseResponse }
}

/**
 * Verifica solo autenticación (sin verificación de rol).
 * Útil para rutas que requieren cualquier usuario autenticado.
 *
 * @example
 * ```ts
 * const auth = await requireAuthenticated(request)
 * if (!auth.success) return auth.response
 * const { supabase, user } = auth
 * ```
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

  return { success: true, supabase, user, supabaseResponse }
}