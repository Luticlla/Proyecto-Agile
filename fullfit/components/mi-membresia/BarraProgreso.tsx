'use client'

import { cn } from '@/lib/utils'

type BarraProgresoProps = {
  diasRestantes: number
  duracionTotal: number
  className?: string
}

function getColorBarra(diasRestantes: number): string {
  if (diasRestantes > 30) return 'bg-green-400'
  if (diasRestantes > 15) return 'bg-yellow-200'
  if (diasRestantes > 7) return 'bg-yellow-400'
  if (diasRestantes > 0) return 'bg-red-400'
  return 'bg-red-500'
}

export function BarraProgreso({ diasRestantes, duracionTotal, className }: BarraProgresoProps) {
  const porcentajeTranscurrido = Math.max(0, Math.min(100, ((duracionTotal - diasRestantes) / duracionTotal) * 100))
  const color = getColorBarra(diasRestantes)

  return (
    <div className={cn('w-full', className)}>
      <div className="h-3 bg-zinc-800 rounded-full overflow-hidden">
        <div
          className={cn('h-full rounded-full transition-all duration-1000 ease-out', color)}
          style={{ width: `${porcentajeTranscurrido}%` }}
        />
      </div>
      <div className="flex justify-between mt-1 text-xs text-zinc-500">
        <span>Inicio</span>
        <span>{Math.round(porcentajeTranscurrido)}% transcurrido</span>
        <span>Fin</span>
      </div>
    </div>
  )
}
