import { NextResponse } from 'next/server'
import { createServiceRoleClient } from '@/lib/supabase/server'

export async function PUT(request: Request) {
  const supabase = createServiceRoleClient()
  
  // Basic Auth Check
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return new NextResponse('Unauthorized', { status: 401 })

  const { data: profile } = await supabase
    .from('profiles')
    .select('rol_id')
    .eq('id', user.id)
    .single()
    
  if (profile?.rol_id !== 1 && profile?.rol_id !== 2) {
    return new NextResponse('Forbidden', { status: 403 })
  }

  try {
    const body = await request.json()
    const { apertura_lv, cierre_lv, apertura_sab, cierre_sab, apertura_dom, cierre_dom, id } = body
    
    if (!id) {
        return new NextResponse('Bad Request: sede id required', { status: 400 })
    }

    const { data, error } = await supabase
      .from('sedes')
      .update({
        apertura_lv,
        cierre_lv,
        apertura_sab,
        cierre_sab,
        apertura_dom,
        cierre_dom
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating sede horarios:', error)
      return new NextResponse('Error al actualizar horarios', { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error: any) {
    console.error('API Error PUT /sedes/horarios:', error)
    return new NextResponse(error.message || 'Internal Server Error', { status: 500 })
  }
}
