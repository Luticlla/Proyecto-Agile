import { NextRequest, NextResponse } from 'next/server'
import { requireAuthenticated } from '@/lib/auth/api-guard'

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAuthenticated(request)
    if (!auth.success) return auth.response
    const { supabase } = auth

    const { data: planes, error } = await supabase
      .from('planes_membresia')
      .select('*')
      .eq('activo', true)
      .order('precio', { ascending: true })

    if (error) {
      console.error('Error listing planes:', error)
      return NextResponse.json(
        { error: 'Error al listar planes' },
        { status: 500 }
      )
    }

    return NextResponse.json({ planes: planes || [] })

  } catch (error) {
    console.error('Error listing planes:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
