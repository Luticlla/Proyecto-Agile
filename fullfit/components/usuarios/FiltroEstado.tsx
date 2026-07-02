'use client'

import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

type FiltroEstadoProps = {
  value: boolean | undefined
  onChange: (activo: boolean | undefined) => void
}

export function FiltroEstado({ value, onChange }: FiltroEstadoProps) {
  return (
    <Select value={value === undefined ? 'todos' : value.toString()} onValueChange={(v) => onChange(v === 'todos' ? undefined : v === 'true')}>
      <SelectTrigger className="w-[180px] bg-zinc-900 border-zinc-700 text-white">
        <SelectValue placeholder="Estado" />
      </SelectTrigger>
      <SelectContent className="bg-zinc-900 border-zinc-700">
        <SelectGroup>
          <SelectItem value="todos" className="text-zinc-300 focus:bg-zinc-800 focus:text-white">Todos los estados</SelectItem>
          <SelectItem value="true" className="text-zinc-300 focus:bg-zinc-800 focus:text-white">Activos</SelectItem>
          <SelectItem value="false" className="text-zinc-300 focus:bg-zinc-800 focus:text-white">Inactivos</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
