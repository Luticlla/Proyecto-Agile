'use client'

import type { EstadoSuscripcion } from '@/lib/supabase/queries/clientes'

type FiltroMembresiaProps = {
  value: EstadoSuscripcion
  onChange: (value: EstadoSuscripcion) => void
}

const OPCIONES: Array<{ value: EstadoSuscripcion; label: string }> = [
  { value: 'todos', label: 'Todos los clientes' },
  { value: 'activos', label: 'Con membresía activa' },
  { value: 'vencidos', label: 'Membresía vencida' },
  { value: 'sin_membresia', label: 'Sin membresía' }
]

export function FiltroMembresia({ value, onChange }: FiltroMembresiaProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as EstadoSuscripcion)}
      className="h-10 rounded-lg border border-zinc-700 bg-zinc-900 px-3 text-sm text-zinc-300 outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400"
    >
      {OPCIONES.map((opcion) => (
        <option key={opcion.value} value={opcion.value}>
          {opcion.label}
        </option>
      ))}
    </select>
  )
}