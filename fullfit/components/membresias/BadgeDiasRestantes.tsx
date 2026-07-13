import { Badge } from '@/components/ui/badge'
import { calcularDiasRestantes } from '@/lib/utils/dates'

type BadgeDiasRestantesProps = {
  diasRestantes: number
  estado: string
  freezeInicio?: string | null
  freezeFin?: string | null
  diasFreezeMaximo?: number
  vecesPausada?: number
}

export function BadgeDiasRestantes({
  diasRestantes,
  estado,
  freezeInicio,
  freezeFin,
  diasFreezeMaximo = 0,
  vecesPausada = 0,
}: BadgeDiasRestantesProps) {
  if (estado === 'cancelada') {
    return (
      <Badge variant="secondary" className="bg-zinc-500/20 text-zinc-400 border-zinc-500/30">
        N/A
      </Badge>
    )
  }

  if (estado === 'suspendida') {
    const hoy = new Date().toISOString().split('T')[0]
    const freezeInicioStr = freezeInicio || hoy
    const freezeFinStr = freezeFin || hoy
    const transcurridos = Math.max(0, Math.abs(calcularDiasRestantes(freezeInicioStr, hoy)))
    const restantes = Math.max(0, calcularDiasRestantes(freezeFinStr, hoy))

    return (
      <div className="flex flex-col gap-0.5">
        <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
          Freeze {transcurridos}/{diasFreezeMaximo}d
        </Badge>
        {restantes > 0 && (
          <span className="text-[10px] text-white/30 font-mono text-center">
            quedan {restantes}d
          </span>
        )}
        {restantes <= 0 && (
          <span className="text-[10px] text-yellow-400/50 font-mono text-center">
            por vencer
          </span>
        )}
      </div>
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
