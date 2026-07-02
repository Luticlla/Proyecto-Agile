'use client'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface FiltroEstadoSedeProps {
  value: string
  onChange: (value: string) => void
}

export function FiltroEstadoSede({ value, onChange }: FiltroEstadoSedeProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-[160px] bg-zinc-900 border-zinc-800 text-white">
        <SelectValue placeholder="Estado" />
      </SelectTrigger>
      <SelectContent className="bg-zinc-900 border-zinc-800">
        <SelectItem value="todos" className="text-white hover:bg-zinc-800">Todas</SelectItem>
        <SelectItem value="activa" className="text-white hover:bg-zinc-800">Activas</SelectItem>
        <SelectItem value="inactiva" className="text-white hover:bg-zinc-800">Inactivas</SelectItem>
      </SelectContent>
    </Select>
  )
}
