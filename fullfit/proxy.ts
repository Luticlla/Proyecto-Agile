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

  // Obtener profile UNA sola vez si hay usuario (reutilizar en todas las condiciones)
  let profile: { rol_id: number } | null = null
  if (user) {
    const { data } = await supabase
      .from('profiles')
      .select('rol_id')
      .eq('id', user.id)
      .single()
    profile = data
  }

  const isRecepcionista = profile && (profile.rol_id === 1 || profile.rol_id === 2)

  // 1. Proteger rutas de recepcionista
  if (pathname.startsWith('/recepcionista')) {
    if (!user) {
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      url.searchParams.set('redirect', pathname)
      return NextResponse.redirect(url)
    }
    if (!isRecepcionista) {
      const url = request.nextUrl.clone()
      url.pathname = '/'
      return NextResponse.redirect(url)
    }
    return supabaseResponse
  }

  // 2. Proteger rutas que requieren auth (excepto returns de MercadoPago)
  if (pathname.startsWith('/pasarelapago') && !user) {
    const hasStatusParam = request.nextUrl.searchParams.has('status')
    if (hasStatusParam) {
      return supabaseResponse
    }
    return NextResponse.redirect(new URL('/membresias', request.url))
  }

  // 3. Redirect de auth pages si ya está logueado
  if ((pathname === '/login' || pathname === '/register') && user) {
    const url = request.nextUrl.clone()
    url.pathname = isRecepcionista ? '/recepcionista' : '/'
    return NextResponse.redirect(url)
  }

  // 4. Redirect recepcionistas desde la página principal
  if (pathname === '/' && user && isRecepcionista) {
    const url = request.nextUrl.clone()
    url.pathname = '/recepcionista'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/recepcionista/:path*',
    '/pasarelapago/:path*',
    '/login',
    '/register',
    '/',
  ],
}