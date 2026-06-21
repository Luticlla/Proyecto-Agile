'use client'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

type FiltroRolProps = {
  value: number | undefined
  onChange: (rol: number | undefined) => void
}

export function FiltroRol({ value, onChange }: FiltroRolProps) {
  return (
    <Select value={value === undefined ? 'todos' : value.toString()} onValueChange={(v) => onChange(v === 'todos' ? undefined : Number(v))}>
      <SelectTrigger className="w-[180px] bg-zinc-900 border-zinc-700 text-white">
        <SelectValue placeholder="Rol" />
      </SelectTrigger>
      <SelectContent className="bg-zinc-900 border-zinc-700">
        <SelectItem value="todos" className="text-zinc-300 focus:bg-zinc-800 focus:text-white">Todos los roles</SelectItem>
        <SelectItem value="1" className="text-zinc-300 focus:bg-zinc-800 focus:text-white">Administrador</SelectItem>
        <SelectItem value="2" className="text-zinc-300 focus:bg-zinc-800 focus:text-white">Recepcionista</SelectItem>
      </SelectContent>
    </Select>
  )
}
