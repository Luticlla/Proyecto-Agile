import { Badge } from '@/components/ui/badge'

type BadgeEstadoProps = {
  estado: string
}

const ESTADO_CONFIG: Record<string, { label: string; className: string }> = {
  activa: {
    label: 'Activa',
    className: 'bg-green-500/20 text-green-400 border-green-500/30'
  },
  vencida: {
    label: 'Vencida',
    className: 'bg-red-500/20 text-red-400 border-red-500/30'
  },
  cancelada: {
    label: 'Cancelada',
    className: 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30'
  },
  suspendida: {
    label: 'Suspendida',
    className: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
  }
}

export function BadgeEstado({ estado }: BadgeEstadoProps) {
  const config = ESTADO_CONFIG[estado] || { label: estado, className: 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30' }

  return (
    <Badge variant="default" className={config.className}>
      {config.label}
    </Badge>
  )
}
