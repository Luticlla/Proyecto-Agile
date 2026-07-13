import { NextResponse } from 'next/server'
import { createServiceRoleClient } from '@/lib/supabase/server'
import { getFechaLima } from '@/lib/utils'
import { sendEmail } from '@/lib/mail'
import { getMembresiaPorVencerEmail } from '@/lib/mail-templates/membresia-por-vencer'
import { getMembresiaVencidaEmail } from '@/lib/mail-templates/membresia-vencida'

export async function GET() {
  const supabase = createServiceRoleClient()
  const hoy = getFechaLima()

  const resultado = {
    recordatorios_enviados: 0,
    vencidas_enviadas: 0,
    errores: [] as string[],
  }

  // --- 1. Membresías por vencer en exactamente 7 días ---
  const fechaLimite = new Date(hoy)
  fechaLimite.setDate(fechaLimite.getDate() + 7)
  const fechaFinStr = fechaLimite.toISOString().split('T')[0]

  const { data: porVencer } = await supabase
    .from('suscripciones')
    .select(`
      id,
      usuario_id,
      fecha_inicio,
      fecha_fin,
      profiles!suscripciones_usuario_id_fkey (nombre, apellido, email),
      planes_membresia!suscripciones_plan_id_fkey (nombre)
    `)
    .eq('estado', 'activa')
    .eq('fecha_fin', fechaFinStr)

  if (porVencer) {
    for (const sub of porVencer) {
      const perfil = sub.profiles as unknown as Record<string, string> | null
      const plan = sub.planes_membresia as unknown as Record<string, string> | null
      if (!perfil?.email) continue

      const { data: existing } = await supabase
        .from('notificaciones')
        .select('id')
        .eq('usuario_id', sub.usuario_id)
        .eq('tipo', 'recordatorio_7dias')
        .eq('mensaje', `suscripcion_${sub.id}`)
        .limit(1)

      if (existing && existing.length > 0) continue

      try {
        await sendEmail({
          to: perfil.email,
          subject: 'Tu membresía FULLFORMA está por vencer',
          html: getMembresiaPorVencerEmail(
            `${perfil.nombre ?? ''} ${perfil.apellido ?? ''}`.trim() || 'Cliente',
            plan?.nombre ?? 'Membresía',
            sub.fecha_fin,
            7,
          ),
        })

        await supabase.from('notificaciones').insert({
          usuario_id: sub.usuario_id,
          tipo: 'recordatorio_7dias',
          titulo: 'Membresía por vencer',
          mensaje: `suscripcion_${sub.id}`,
          leida: false,
        })

        resultado.recordatorios_enviados++
      } catch (e) {
        resultado.errores.push(`Error recordatorio ${perfil.email}: ${e}`)
      }
    }
  }

  // --- 2. Membresías vencidas (activas pasadas de fecha, o marcadas vencidas) ---
  const [activasVencidas, marcadasVencidas] = await Promise.all([
    supabase
      .from('suscripciones')
      .select(`
        id,
        usuario_id,
        fecha_inicio,
        fecha_fin,
        profiles!suscripciones_usuario_id_fkey (nombre, apellido, email),
        planes_membresia!suscripciones_plan_id_fkey (nombre)
      `)
      .eq('estado', 'activa')
      .lt('fecha_fin', hoy),
    supabase
      .from('suscripciones')
      .select(`
        id,
        usuario_id,
        fecha_inicio,
        fecha_fin,
        profiles!suscripciones_usuario_id_fkey (nombre, apellido, email),
        planes_membresia!suscripciones_plan_id_fkey (nombre)
      `)
      .eq('estado', 'vencida'),
  ])

  const vencidas = [
    ...(activasVencidas.data ?? []),
    ...(marcadasVencidas.data ?? []),
  ]

  const yaVistas = new Set<number>()
  for (const sub of vencidas) {
    if (yaVistas.has(sub.id)) continue
    yaVistas.add(sub.id)

    const perfil = sub.profiles as unknown as Record<string, string> | null
    const plan = sub.planes_membresia as unknown as Record<string, string> | null
    if (!perfil?.email) continue

    const { data: existing } = await supabase
      .from('notificaciones')
      .select('id')
      .eq('usuario_id', sub.usuario_id)
      .eq('tipo', 'vencimiento')
      .eq('mensaje', `suscripcion_${sub.id}`)
      .limit(1)

    if (existing && existing.length > 0) continue

    try {
      await sendEmail({
        to: perfil.email,
        subject: 'Tu membresía FULLFORMA ha vencido',
        html: getMembresiaVencidaEmail(
          `${perfil.nombre ?? ''} ${perfil.apellido ?? ''}`.trim() || 'Cliente',
          plan?.nombre ?? 'Membresía',
          sub.fecha_fin,
          sub.fecha_inicio,
        ),
      })

      await supabase.from('notificaciones').insert({
        usuario_id: sub.usuario_id,
        tipo: 'vencimiento',
        titulo: 'Membresía vencida',
        mensaje: `suscripcion_${sub.id}`,
        leida: false,
      })

      resultado.vencidas_enviadas++
    } catch (e) {
      resultado.errores.push(`Error vencimiento ${perfil.email}: ${e}`)
    }
  }

  return NextResponse.json(resultado)
}
