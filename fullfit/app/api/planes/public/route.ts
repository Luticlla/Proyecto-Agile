import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const { data, error } = await supabase
      .from('planes_membresia')
      .select('*')
      .eq('activo', true)
      .order('precio', { ascending: true })

    if (error) {
      console.error('Error obteniendo planes:', error)
      return NextResponse.json({ error: 'Error al obtener planes' }, { status: 500 })
    }

    return NextResponse.json({ planes: data || [] })
  } catch (error) {
    console.error('Error en GET /api/planes/public:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
