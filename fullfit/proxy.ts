import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Obtener usuario una sola vez
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const pathname = request.nextUrl.pathname

  // Obtener profile UNA sola vez si hay usuario
  let profile: { rol_id: number; activo: boolean } | null = null
  if (user) {
    const { data } = await supabase
      .from('profiles')
      .select('rol_id, activo')
      .eq('id', user.id)
      .single()
    profile = data
  }

  // Variables de rol para reutilizar en todas las condiciones
  const isSoloAdmin = profile?.rol_id === 1
  const isSoloRecepcionista = profile?.rol_id === 2
  const isSoloMiembro = profile?.rol_id === 3
  const isSoloCoach = profile?.rol_id === 5

  // 0. Bloquear usuarios inactivos (excepto login, register y retornos MercadoPago)
  if (profile && profile.activo === false) {
    const isAllowed = pathname.startsWith('/login') ||
      pathname.startsWith('/register') ||
      pathname.startsWith('/pasarelapago')
    if (!isAllowed) {
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      url.searchParams.set('error', 'Tu sesión está inhabilitada, no tienes acceso al sistema')
      return NextResponse.redirect(url)
    }
  }

  // 0.1. Bloquear miembros con membresía suspendida/cancelada — solo permitir /mi-membresia y /login
  if (isSoloMiembro && profile?.activo !== false) {
    const { data: sub } = await supabase
      .from('suscripciones')
      .select('estado')
      .eq('usuario_id', user!.id)
      .order('creado_en', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (sub && (sub.estado === 'suspendida' || sub.estado === 'cancelada')) {
      const isAllowedBlocked = pathname.startsWith('/mi-membresia') ||
        pathname.startsWith('/login')
      if (!isAllowedBlocked) {
        const url = request.nextUrl.clone()
        url.pathname = '/mi-membresia'
        return NextResponse.redirect(url)
      }
    }
  }

  // 1. Proteger rutas de recepcionista (solo rol_id === 2)
  if (pathname.startsWith('/recepcionista')) {
    if (!user) {
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      url.searchParams.set('redirect', pathname)
      return NextResponse.redirect(url)
    }
    if (!isSoloRecepcionista) {
      const url = request.nextUrl.clone()
      url.pathname = isSoloAdmin ? '/gerente' : '/'
      return NextResponse.redirect(url)
    }
    return supabaseResponse
  }

  // 2. Proteger rutas de gerente (solo rol_id === 1)
  if (pathname.startsWith('/gerente')) {
    if (!user) {
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      url.searchParams.set('redirect', pathname)
      return NextResponse.redirect(url)
    }
    if (!isSoloAdmin) {
      const url = request.nextUrl.clone()
      url.pathname = isSoloRecepcionista ? '/recepcionista' : '/'
      return NextResponse.redirect(url)
    }
    return supabaseResponse
  }

  // 2.1 Proteger rutas de coach (rol_id === 5)
  if (pathname.startsWith('/coach')) {
    if (!user) {
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      url.searchParams.set('redirect', pathname)
      return NextResponse.redirect(url)
    }
    if (!isSoloCoach) {
      const url = request.nextUrl.clone()
      if (isSoloAdmin) url.pathname = '/gerente'
      else if (isSoloRecepcionista) url.pathname = '/recepcionista'
      else url.pathname = '/'
      return NextResponse.redirect(url)
    }
    return supabaseResponse
  }

  // 3. Proteger rutas de miembro (solo rol_id === 3)
  if (pathname.startsWith('/mi-membresia')) {
    if (!user) {
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      url.searchParams.set('redirect', pathname)
      return NextResponse.redirect(url)
    }
    if (!isSoloMiembro) {
      const url = request.nextUrl.clone()
      url.pathname = isSoloAdmin ? '/gerente' : '/recepcionista'
      return NextResponse.redirect(url)
    }
    return supabaseResponse
  }

  // 4. Proteger /pasarelapago según rol
  if (pathname.startsWith('/pasarelapago')) {
    const hasStatusParam = request.nextUrl.searchParams.has('status')
    const hasPlanParam = request.nextUrl.searchParams.has('plan')

    // Retorno de MercadoPago (?status=...)
    if (hasStatusParam) {
      if (!user) return supabaseResponse
      if (isSoloAdmin) {
        const url = request.nextUrl.clone()
        url.pathname = '/gerente'
        return NextResponse.redirect(url)
      }
      return supabaseResponse
    }

    // Página de auto-servicio (?plan=ID)
    if (hasPlanParam) {
      if (!user) {
        return NextResponse.redirect(new URL('/membresias', request.url))
      }
      if (profile?.rol_id !== 3) {
        const url = request.nextUrl.clone()
        url.pathname = isSoloAdmin ? '/gerente' : '/recepcionista'
        return NextResponse.redirect(url)
      }
      return supabaseResponse
    }

    // Sin parámetros → redirigir según rol
    if (!user) {
      return NextResponse.redirect(new URL('/membresias', request.url))
    }
    const url = request.nextUrl.clone()
    if (isSoloAdmin) {
      url.pathname = '/gerente'
    } else if (isSoloRecepcionista) {
      url.pathname = '/recepcionista'
    } else if (isSoloCoach) {
      url.pathname = '/coach'
    } else {
      url.pathname = '/membresias'
    }
    return NextResponse.redirect(url)
  }

  // 4. Proteger rutas marketing para usuarios logueados
  const rutasMarketing = ['/membresias', '/sedes']
  const esRutaMarketing = rutasMarketing.some(ruta => pathname.startsWith(ruta))

  if (esRutaMarketing && user && !isSoloMiembro) {
    const url = request.nextUrl.clone()
    if (isSoloAdmin) {
      url.pathname = '/gerente'
    } else if (isSoloRecepcionista) {
      url.pathname = '/recepcionista'
    } else if (isSoloCoach) {
      url.pathname = '/coach'
    }
    return NextResponse.redirect(url)
  }

  // 5. Redirect de auth pages si ya está logueado
  if ((pathname === '/login' || pathname === '/register') && user) {
    const url = request.nextUrl.clone()
    if (isSoloAdmin) {
      url.pathname = '/gerente'
    } else if (isSoloRecepcionista) {
      url.pathname = '/recepcionista'
    } else if (isSoloCoach) {
      url.pathname = '/coach'
    } else if (isSoloMiembro) {
      // Socios van al homepage con su sesión activa
      url.pathname = '/'
    } else {
      // Rol desconocido: dejar pasar sin redirigir
      return supabaseResponse
    }
    return NextResponse.redirect(url)
  }

  // 6. Redirect desde la página principal según rol
  if (pathname === '/' && user) {
    if (isSoloAdmin) {
      const url = request.nextUrl.clone()
      url.pathname = '/gerente'
      return NextResponse.redirect(url)
    }
    if (isSoloRecepcionista) {
      const url = request.nextUrl.clone()
      url.pathname = '/recepcionista'
      return NextResponse.redirect(url)
    }
    if (isSoloCoach) {
      const url = request.nextUrl.clone()
      url.pathname = '/coach'
      return NextResponse.redirect(url)
    }
    // Socios (rol_id=3) y roles desconocidos: quedan en el homepage con sesión activa
    return supabaseResponse
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/recepcionista/:path*',
    '/gerente/:path*',
    '/coach/:path*',
    '/mi-membresia/:path*',
    '/pasarelapago/:path*',
    '/membresias/:path*',
    '/login',
    '/register',
    '/',
  ],
}
