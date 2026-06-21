'use client'

interface BadgeDiasRestantesProps {
  dias?: number
  estado?: string
}

export function BadgeDiasRestantes({ dias, estado }: BadgeDiasRestantesProps) {
  if (dias === undefined || !estado || estado === 'sin_membresia') {
    return <span className="text-zinc-500 text-sm">—</span>
  }

  if (estado === 'vencida' || dias < 0) {
    return (
      <span className="text-red-400 text-sm line-through">
        {Math.abs(dias)}d
      </span>
    )
  }

  if (dias === 0) {
    return (
      <span className="inline-flex items-center gap-1 text-sm font-semibold text-red-400">
        Hoy
      </span>
    )
  }

  if (dias <= 7) {
    return (
      <span className="inline-flex items-center gap-1 text-sm font-semibold text-yellow-400">
        {dias}d
      </span>
    )
  }

  if (dias <= 30) {
    return (
      <span className="inline-flex items-center gap-1 text-sm font-semibold text-amber-300">
        {dias}d
      </span>
    )
  }

  return (
    <span className="inline-flex items-center gap-1 text-sm font-semibold text-green-400">
      {dias}d
    </span>
  )
}
