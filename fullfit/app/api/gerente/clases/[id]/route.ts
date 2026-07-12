import { NextResponse } from 'next/server'
import { createServiceRoleClient } from '@/lib/supabase/server'
import { updateClaseConHorarios, deleteClase } from '@/lib/supabase/queries/clases'

export async function PUT(request: Request, { params }: { params: { id: string } }) {
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
    const id = parseInt(params.id)
    if (isNaN(id)) return new NextResponse('Bad Request: Invalid ID', { status: 400 })

    const body = await request.json()
    const { clase, horarios } = body

    const updatedClase = await updateClaseConHorarios(supabase, id, clase, horarios || [])
    return NextResponse.json(updatedClase)
  } catch (error: any) {
    console.error(`API Error PUT /clases/${params.id}:`, error)
    return new NextResponse(error.message || 'Internal Server Error', { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
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
    const id = parseInt(params.id)
    if (isNaN(id)) return new NextResponse('Bad Request: Invalid ID', { status: 400 })

    const success = await deleteClase(supabase, id)
    if (!success) {
      return new NextResponse('Error deleting clase', { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error(`API Error DELETE /clases/${params.id}:`, error)
    return new NextResponse(error.message || 'Internal Server Error', { status: 500 })
  }
}
