import { Badge } from '@/components/ui/badge'

interface BadgeEstadoPlanProps {
  activo: boolean
}

export function BadgeEstadoPlan({ activo }: BadgeEstadoPlanProps) {
  return (
    <Badge
      variant={activo ? 'default' : 'secondary'}
      className={
        activo
          ? 'bg-green-500/20 text-green-400 border-green-500/30'
          : 'bg-red-500/20 text-red-400 border-red-500/30'
      }
    >
      {activo ? 'Activo' : 'Inactivo'}
    </Badge>
  )
}
