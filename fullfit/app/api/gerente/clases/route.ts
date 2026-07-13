import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { createServiceRoleClient } from '@/lib/supabase/server'
import { getClasesConHorarios, createClaseConHorarios } from '@/lib/supabase/queries/clases'
import { requireAuthenticatedRecepcionista } from '@/lib/auth/api-guard'

export async function GET() {
  const supabase = createServiceRoleClient()
  const clases = await getClasesConHorarios(supabase)
  return NextResponse.json(clases, {
    headers: { 'Cache-Control': 'no-store, must-revalidate' }
  })
}

export async function POST(request: NextRequest) {
  const auth = await requireAuthenticatedRecepcionista(request)
  if (!auth.success) return auth.response
  const { supabase } = auth

  try {
    const body = await request.json()
    const { clase, horarios } = body

    if (!clase || !clase.nombre) {
      return new NextResponse('Bad Request: nombre requerido', { status: 400 })
    }

    const newClase = await createClaseConHorarios(supabase, clase, horarios || [])
    revalidatePath('/')
    return NextResponse.json(newClase)
  } catch (error: any) {
    console.error('API Error POST /clases:', error)
    return new NextResponse(error.message || 'Internal Server Error', { status: 500 })
  }
}
