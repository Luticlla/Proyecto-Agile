import { Badge } from '@/components/ui/badge'

type BadgeDiasRestantesProps = {
  diasRestantes: number
  estado: string
}

export function BadgeDiasRestantes({ diasRestantes, estado }: BadgeDiasRestantesProps) {
  if (estado === 'cancelada') {
    return (
      <Badge variant="secondary" className="bg-zinc-500/20 text-zinc-400 border-zinc-500/30">
        N/A
      </Badge>
    )
  }

  if (estado === 'suspendida') {
    return (
      <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
        Pausada
      </Badge>
    )
  }

  if (diasRestantes <= 0) {
    return (
      <Badge variant="default" className="bg-red-600/20 text-red-300 border-red-600/30">
        Vencida
      </Badge>
    )
  }

  if (diasRestantes <= 7) {
    return (
      <Badge variant="default" className="bg-red-500/20 text-red-400 border-red-500/30">
        {diasRestantes} día{diasRestantes !== 1 ? 's' : ''}
      </Badge>
    )
  }

  if (diasRestantes <= 30) {
    return (
      <Badge variant="default" className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
        {diasRestantes} días
      </Badge>
    )
  }

  return (
    <Badge variant="default" className="bg-green-500/20 text-green-400 border-green-500/30">
      {diasRestantes} días
    </Badge>
  )
}
