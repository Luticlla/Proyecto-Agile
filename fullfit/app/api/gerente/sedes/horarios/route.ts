import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { createServiceRoleClient } from '@/lib/supabase/server'
import { requireAuthenticatedRecepcionista } from '@/lib/auth/api-guard'

export async function PUT(request: NextRequest) {
  const auth = await requireAuthenticatedRecepcionista(request)
  if (!auth.success) return auth.response
  const { supabase } = auth

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

    revalidatePath('/')
    return NextResponse.json(data)
  } catch (error: any) {
    console.error('API Error PUT /sedes/horarios:', error)
    return new NextResponse(error.message || 'Internal Server Error', { status: 500 })
  }
}
