import { NextRequest, NextResponse } from 'next/server'
import { requireAuthenticatedRecepcionista } from '@/lib/auth/api-guard'

export async function GET(request: NextRequest) {
  try {
    // Verificar que el usuario esté autenticado
    const auth = await requireAuthenticatedRecepcionista(request)
    if (!auth.success) return auth.response

    const { searchParams } = new URL(request.url)
    const dni = searchParams.get('dni')

    if (!dni || dni.length !== 8 || !/^\d{8}$/.test(dni)) {
      return NextResponse.json({ error: 'El DNI debe tener exactamente 8 dígitos numéricos' }, { status: 400 })
    }

    const apiUrl = process.env.RENIEC_API_URL
    const apiKey = process.env.RENIEC_API_KEY

    if (!apiUrl || !apiKey) {
      console.error('RENIEC API URL o API KEY no configurados en .env.local')
      return NextResponse.json({ error: 'Servicio RENIEC no configurado' }, { status: 503 })
    }

    const response = await fetch(`${apiUrl}/${dni}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      // Timeout de 10 segundos
      signal: AbortSignal.timeout(10000),
    })

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json({ error: 'DNI no encontrado en RENIEC' }, { status: 404 })
      }
      if (response.status === 401 || response.status === 403) {
        console.error('RENIEC: API Key inválida o sin permisos')
        return NextResponse.json({ error: 'Error de autenticación con RENIEC' }, { status: 502 })
      }
      return NextResponse.json({ error: 'Error al consultar RENIEC' }, { status: 502 })
    }

    const data = await response.json()

    // La API de apiperu.dev devuelve: { success: true, data: { nombres, apellido_paterno, apellido_materno, numero_documento, ... } }
    if (!data.success || !data.data) {
      return NextResponse.json({ error: 'DNI no encontrado en RENIEC' }, { status: 404 })
    }

    const persona = data.data

    return NextResponse.json({
      success: true,
      nombre: persona.nombres ?? '',
      apellido: `${persona.apellido_paterno ?? ''} ${persona.apellido_materno ?? ''}`.trim(),
      dni: persona.numero_documento ?? dni,
    })
  } catch (error: any) {
    if (error.name === 'TimeoutError' || error.name === 'AbortError') {
      return NextResponse.json({ error: 'Tiempo de espera agotado al consultar RENIEC' }, { status: 504 })
    }
    console.error('Error en GET /api/reniec:', error)
    return NextResponse.json({ error: error.message || 'Error interno del servidor' }, { status: 500 })
  }
}
