import { NextResponse } from 'next/server'
import { createServiceRoleClient } from '@/lib/supabase/server'
import { getClasesConHorarios, createClaseConHorarios } from '@/lib/supabase/queries/clases'

export async function GET() {
  const supabase = createServiceRoleClient()
  const clases = await getClasesConHorarios(supabase)
  return NextResponse.json(clases)
}

export async function POST(request: Request) {
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
    const { clase, horarios } = body

    if (!clase || !clase.nombre) {
      return new NextResponse('Bad Request: nombre requerido', { status: 400 })
    }

    const newClase = await createClaseConHorarios(supabase, clase, horarios || [])
    return NextResponse.json(newClase)
  } catch (error: any) {
    console.error('API Error POST /clases:', error)
    return new NextResponse(error.message || 'Internal Server Error', { status: 500 })
  }
}
