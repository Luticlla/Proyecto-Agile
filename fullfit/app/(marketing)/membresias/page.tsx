import React from 'react'
import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'
import Container from '@/components/layout/Container'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Check } from 'lucide-react'
import { planFeatures, formatPrice } from '@/constants/plans'

export const metadata = {
  title: 'Membresías | Full Forma',
  description: 'Elige tu plan de entrenamiento. Acceso a todas nuestras sedes en Trujillo.',
}

async function getPlanes() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const { data, error } = await supabase
    .from('planes_membresia')
    .select('*')
    .eq('activo', true)
    .order('duracion_dias', { ascending: true })

  if (error) {
    console.error('Error fetching planes:', error)
    return []
  }

  return data ?? []
}

const MembresiasPage = async () => {
  const planes = await getPlanes()

  return (
    <main className="min-h-screen bg-black">
      <section className="relative border-b-2 border-gym-logo/30 overflow-hidden">
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,223,0,0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,223,0,0.3) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
          }}
        />
        <Container className="py-16 md:py-24 relative z-10">
          <div className="flex flex-col items-center text-center gap-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-px w-8 md:w-16 bg-gym-logo" />
              <span className="font-arcade text-gym-logo text-[8px] md:text-xs tracking-widest uppercase">
                Planes
              </span>
              <div className="h-px w-8 md:w-16 bg-gym-logo" />
            </div>

            <h1 className="font-arcade text-white text-xl md:text-3xl lg:text-4xl tracking-wide uppercase leading-relaxed">
              Elige tu{' '}
              <span className="text-gym-logo [text-shadow:0_0_20px_rgba(255,223,0,0.5)]">
                Membresía
              </span>
            </h1>

            <p className="text-white/60 text-xs md:text-sm max-w-lg leading-relaxed font-mono">
              Entrena sin límites en cualquiera de nuestras sedes.{' '}
              <span className="text-gym-logo/80">Sin contratos largos, cancela cuando quieras.</span>
            </p>

            <div className="flex items-center gap-8 md:gap-16 mt-4 pt-4 border-t border-white/10 w-full max-w-xs justify-center">
              <div className="flex flex-col items-center gap-1">
                <span className="font-arcade text-gym-logo text-lg md:text-2xl">{planes.length}</span>
                <span className="text-white/40 text-[8px] md:text-[10px] font-arcade uppercase tracking-wider">Planes</span>
              </div>
              <div className="h-8 w-px bg-white/10" />
              <div className="flex flex-col items-center gap-1">
                <span className="font-arcade text-gym-logo text-lg md:text-2xl">100%</span>
                <span className="text-white/40 text-[8px] md:text-[10px] font-arcade uppercase tracking-wider">Flexible</span>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-12 md:py-20">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto">
            {planes.map((plan, index) => {
              const prices = formatPrice(plan.precio, plan.duracion_dias)
              const isPopular = plan.nombre === 'Trimestral'
              const features = planFeatures[plan.nombre] || []

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
                    {plan.descripcion && (
                      <p className="text-white/50 text-xs md:text-sm font-mono">
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
                          <Check className="w-4 h-4 text-gym-logo shrink-0 mt-0.5" />
                          <span className="text-white/70 text-xs md:text-sm font-mono">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Link href={`/pasarelapago?plan=${plan.id}`} className="mt-auto">
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
                </div>
              )
            })}
          </div>
        </Container>
      </section>

      <section className="py-12 border-t border-white/5">
        <Container>
          <div className="text-center">
            <p className="text-white/40 text-xs md:text-sm font-mono">
              ¿Tienes dudas sobre qué plan elegir?{' '}
              <Link href="/sedes" className="text-gym-logo hover:underline">
                Visítanos en cualquiera de nuestras sedes
              </Link>
            </p>
          </div>
        </Container>
      </section>
    </main>
  )
}

export default MembresiasPage