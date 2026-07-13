import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { createServiceRoleClient } from '@/lib/supabase/server'
import { updateClaseConHorarios, deleteClase } from '@/lib/supabase/queries/clases'
import { requireAuthenticatedRecepcionista } from '@/lib/auth/api-guard'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAuthenticatedRecepcionista(request)
  if (!auth.success) return auth.response
  const { supabase } = auth

  try {
    const resolvedParams = await params
    const id = parseInt(resolvedParams.id)
    if (isNaN(id)) return new NextResponse('Bad Request: Invalid ID', { status: 400 })

    const body = await request.json()
    const { clase, horarios } = body

    const updatedClase = await updateClaseConHorarios(supabase, id, clase, horarios || [])
    revalidatePath('/')
    return NextResponse.json(updatedClase)
  } catch (error: any) {
    console.error(`API Error PUT /clases:`, error)
    return new NextResponse(error.message || 'Internal Server Error', { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAuthenticatedRecepcionista(request)
  if (!auth.success) return auth.response
  const { supabase } = auth

  try {
    const resolvedParams = await params
    const id = parseInt(resolvedParams.id)
    if (isNaN(id)) return new NextResponse('Bad Request: Invalid ID', { status: 400 })

    const success = await deleteClase(supabase, id)
    if (!success) {
      return new NextResponse('Error deleting clase', { status: 500 })
    }

    revalidatePath('/')
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error(`API Error DELETE /clases:`, error)
    return new NextResponse(error.message || 'Internal Server Error', { status: 500 })
  }
}
