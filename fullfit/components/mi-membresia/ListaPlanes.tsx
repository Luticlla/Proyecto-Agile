'use client'

import { TarjetaPlan } from './TarjetaPlan'
import { Loader2 } from 'lucide-react'
import type { PlanMembresia } from '@/lib/supabase/types'

type ListaPlanesProps = {
  planes: PlanMembresia[]
  loading?: boolean
}

export function ListaPlanes({ planes, loading }: ListaPlanesProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="size-8 text-zinc-400 animate-spin" />
      </div>
    )
  }

  if (planes.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-zinc-400">Próximamente tendremos nuevos planes</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {planes.map((plan, index) => (
        <TarjetaPlan
          key={plan.id}
          plan={plan}
          esPopular={plan.nombre === 'Trimestral' || index === 1}
        />
      ))}
    </div>
  )
}
