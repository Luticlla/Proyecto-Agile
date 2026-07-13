'use client'

import { useAuth } from '@/hooks'
import { User, Mail, Phone, Calendar, IdCard, Shield } from 'lucide-react'
import { cn } from '@/lib/utils'

function formatFechaLarga(dateStr: string | null | undefined): string {
  if (!dateStr) return '—'
  try {
    const date = new Date(dateStr)
    return date.toLocaleDateString('es-PE', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    })
  } catch {
    return dateStr
  }
}

function formatGenero(genero: string | null | undefined): string {
  if (!genero) return '—'
  const map: Record<string, string> = {
    masculino: 'Masculino',
    femenino: 'Femenino',
    otro: 'Otro',
    otro: 'Otro',
  }
  return map[genero.toLowerCase()] || genero
}

export function DatosPersonales() {
  const { profile } = useAuth()

  if (!profile) return null

  const campos = [
    { label: 'Nombre', value: profile.nombre || '—', icon: User },
    { label: 'Apellido', value: profile.apellido || '—', icon: User },
    { label: 'DNI', value: profile.dni || '—', icon: IdCard },
    { label: 'Email', value: profile.email || '—', icon: Mail },
    { label: 'Teléfono', value: profile.telefono || '—', icon: Phone },
    { label: 'Fecha de Nacimiento', value: formatFechaLarga(profile.fecha_nacimiento), icon: Calendar },
    { label: 'Género', value: formatGenero(profile.genero), icon: User },
    { label: 'Fecha de Registro', value: formatFechaLarga(profile.creado_en), icon: Shield },
  ]

  return (
    <section className="space-y-4">
      {/* Section header */}
      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-white/10" />
        <div className="flex items-center gap-2">
          <User className="size-3.5 text-gym-logo" />
          <span className="font-arcade text-gym-logo text-[9px] md:text-[10px] tracking-widest uppercase">
            Datos Personales
          </span>
        </div>
        <div className="h-px flex-1 bg-white/10" />
      </div>

      {/* Grid de campos */}

      <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5 space-y-4">
        {campos.map((campo, index) => (
          <div
            key={campo.label}
            className={cn(
              'flex items-center gap-4 p-3 rounded-lg transition-all duration-200',
              index < campos.length - 1 ? 'border-b border-white/5' : ''
            )}
          >
            <div className="flex items-center justify-center size-9 rounded-lg bg-white/5 border border-white/10 shrink-0">
              <campo.icon className="size-4 text-white/40" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-mono text-white/30 text-[10px] uppercase tracking-widest">
                {campo.label}
              </p>
              <p className="font-mono text-white/70 text-sm mt-0.5 truncate">
                {campo.value}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}