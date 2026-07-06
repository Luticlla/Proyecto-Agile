'use client'

import { cn } from '@/lib/utils'

type ContadorDiasProps = {
  dias: number
  className?: string
}

function getColorDias(dias: number): string {
  if (dias > 30) return 'text-green-400'
  if (dias > 15) return 'text-yellow-200'
  if (dias > 7) return 'text-yellow-400'
  if (dias > 0) return 'text-red-400'
  return 'text-red-500'
}

function getMensajeDias(dias: number): string {
  if (dias > 1) return 'días restantes'
  if (dias === 1) return 'día restante'
  if (dias === 0) return 'Vence hoy'
  return 'Venció'
}

function getAnimacion(dias: number): string {
  if (dias >= 0 && dias <= 7) return 'animate-pulse'
  return ''
}

export function ContadorDias({ dias, className }: ContadorDiasProps) {
  const color = getColorDias(dias)
  const mensaje = getMensajeDias(dias)
  const animacion = getAnimacion(dias)

  return (
    <div className={cn('text-center', className)}>
      <div className={cn('text-5xl font-bold font-mono', color, animacion)}>
        {dias > 0 ? dias : dias === 0 ? '0' : Math.abs(dias)}
      </div>
      <div className={cn('text-sm mt-1', color)}>
        {dias < 0 && `Venció hace ${Math.abs(dias)} días`}
        {dias >= 0 && mensaje}
      </div>
    </div>
  )
}
