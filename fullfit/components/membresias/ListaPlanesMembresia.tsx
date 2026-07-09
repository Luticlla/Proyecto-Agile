'use client'

import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import { useAuth } from '@/hooks'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Check, Lock, Loader2 } from 'lucide-react'
import { planFeatures, formatPrice } from '@/constants/plans'

type Plan = {
  id: number
  nombre: string
  precio: number
  duracion_dias: number
  descripcion?: string
  features?: string[] | null
}

type MembresiaEstado = {
  autenticado: boolean
  tieneMembresiaActiva: boolean
  diasRestantes: number
  puedeComprar: boolean
  fechaFin?: string
}

const ESTADO_INICIAL: MembresiaEstado = {
  autenticado: false,
  tieneMembresiaActiva: false,
  diasRestantes: 0,
  puedeComprar: true,
}

export function ListaPlanesMembresia({ planes }: { planes: Plan[] }) {
  const { user, loading: authLoading } = useAuth()
  const [estado, setEstado] = useState<MembresiaEstado>(ESTADO_INICIAL)
  const [loadingEstado, setLoadingEstado] = useState(true)
  const fetchedRef = useRef(false)

  useEffect(() => {
    if (authLoading) return

    if (!user) {
      if (!fetchedRef.current) {
        fetchedRef.current = true
        setEstado(ESTADO_INICIAL)
        setLoadingEstado(false)
      }
      return
    }

    if (fetchedRef.current) return
    fetchedRef.current = true

    const fetchEstado = async () => {
      try {
        const response = await fetch('/api/membresias/estado')
        if (response.ok) {
          const data = await response.json()
          setEstado(data)
        } else {
          setEstado({ autenticado: true, tieneMembresiaActiva: false, diasRestantes: 0, puedeComprar: true })
        }
      } catch {
        setEstado({ autenticado: true, tieneMembresiaActiva: false, diasRestantes: 0, puedeComprar: true })
      } finally {
        setLoadingEstado(false)
      }
    }

    fetchEstado()
  }, [user, authLoading])

  const bloqueado = estado.tieneMembresiaActiva && !estado.puedeComprar

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto">
      {planes.map((plan) => {
        const prices = formatPrice(plan.precio, plan.duracion_dias)
        const isPopular = plan.nombre === 'Trimestral'
        const features = (plan.features && plan.features.length > 0)
          ? plan.features
          : (planFeatures[plan.nombre] || [])

        return (
          <div
            key={plan.id}
            className={`
              relative flex flex-col p-6 md:p-8 rounded-2xl border-2
              transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-gym-logo/10
              ${isPopular
                ? 'border-gym-logo bg-gym-logo/5'
                : 'border-white/10 bg-white/5 hover:border-gym-logo/50'
              }
            `}
          >
            {isPopular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge className="bg-gym-logo text-black font-arcade text-[8px] md:text-[10px] px-3 py-1 uppercase tracking-wider">
                  Más Popular
                </Badge>
              </div>
            )}

            <div className="text-center mb-6">
              <h3 className="font-arcade text-white text-lg md:text-xl uppercase tracking-wider mb-2">
                {plan.nombre}
              </h3>
              {bloqueado && (
                <span className="inline-block text-[9px] font-mono text-yellow-400/80 bg-yellow-400/10 px-2 py-0.5 rounded-full">
                  Renovar en {estado.diasRestantes} días
                </span>
              )}
              {plan.descripcion && (
                <p className="text-white/50 text-xs md:text-sm font-mono mt-2">
                  {plan.descripcion}
                </p>
              )}
            </div>

            <div className="text-center mb-6">
              <div className="flex items-baseline justify-center gap-1">
                <span className="font-arcade text-gym-logo text-3xl md:text-4xl">
                  {prices.total}
                </span>
              </div>
              <span className="text-white/40 text-xs font-mono">
                {plan.duracion_dias === 365 ? 'al año' : prices.perMonth}
              </span>
            </div>

            <div className="flex-1 mb-6">
              <ul className="space-y-3">
                {features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Check className="size-4 text-gym-logo shrink-0 mt-0.5" />
                    <span className="text-white/70 text-xs md:text-sm font-mono">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-auto">
              {loadingEstado ? (
                <Button
                  disabled
                  className="w-full font-arcade text-[10px] md:text-xs uppercase tracking-wider py-3 md:py-4 bg-white/10 text-white/50"
                >
                  <Loader2 className="size-4 animate-spin mr-2" />
                  Verificando...
                </Button>
              ) : bloqueado ? (
                <Button
                  disabled
                  className="w-full font-arcade text-[10px] md:text-xs uppercase tracking-wider py-3 md:py-4 bg-white/5 text-white/30 border border-white/10 cursor-not-allowed"
                >
                  <Lock className="w-3.5 h-3.5 mr-1.5" />
                  Membresía activa
                </Button>
              ) : (
                <Link
                  href={user ? `/pasarelapago?plan=${plan.id}` : `/login?redirect=${encodeURIComponent(`/pasarelapago?plan=${plan.id}`)}`}
                  className="block"
                >
                  <Button
                    className={`
                      w-full font-arcade text-[10px] md:text-xs uppercase tracking-wider py-3 md:py-4
                      ${isPopular
                        ? 'bg-gym-logo text-black hover:bg-gym-logo/80'
                        : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
                      }
                    `}
                  >
                    Elegir Plan
                  </Button>
                </Link>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
