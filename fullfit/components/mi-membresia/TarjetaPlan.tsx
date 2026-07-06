'use client'

import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Check } from 'lucide-react'
import type { PlanMembresia } from '@/lib/supabase/types'

type TarjetaPlanProps = {
  plan: PlanMembresia
  esPopular?: boolean
}

function formatPrice(price: number, days: number) {
  const perMonth = Math.round(price / (days / 30))
  return {
    total: `S/ ${price}`,
    perMonth: `S/ ${perMonth}/mes`,
  }
}

export function TarjetaPlan({ plan, esPopular }: TarjetaPlanProps) {
  const precios = formatPrice(plan.precio, plan.duracion_dias)
  const features = plan.features || []

  return (
    <Card className={cn(
      'relative bg-zinc-900 border-zinc-800 hover:border-yellow-400/50 transition-all duration-300',
      esPopular && 'border-yellow-400/50'
    )}>
      {esPopular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <Badge className="bg-yellow-400 text-zinc-950 font-bold px-3 py-1">
            Más Popular
          </Badge>
        </div>
      )}
      <CardHeader className="text-center pb-2">
        <CardTitle className="text-xl font-bold text-white">{plan.nombre}</CardTitle>
        <div className="mt-2">
          <span className="text-3xl font-bold text-yellow-400">{precios.total}</span>
          <span className="text-zinc-500 text-sm ml-2">{precios.perMonth}</span>
        </div>
        <p className="text-sm text-zinc-400 mt-1">
          {plan.duracion_dias} días de acceso
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {plan.descripcion && (
          <p className="text-sm text-zinc-400 text-center">{plan.descripcion}</p>
        )}

        {features.length > 0 && (
          <ul className="space-y-2">
            {features.map((feature, index) => (
              <li key={index} className="flex items-center gap-2 text-sm">
                <Check className="size-4 text-green-400 shrink-0" />
                <span className="text-zinc-300">{feature}</span>
              </li>
            ))}
          </ul>
        )}

        <Link href={`/pasarelapago?plan=${plan.id}`} className="w-full block pt-4">
          <Button className={cn(
            'w-full font-bold',
            esPopular
              ? 'bg-yellow-400 text-zinc-950 hover:bg-yellow-300'
              : 'bg-zinc-800 text-white hover:bg-zinc-700'
          )}>
            Elegir Plan
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}
