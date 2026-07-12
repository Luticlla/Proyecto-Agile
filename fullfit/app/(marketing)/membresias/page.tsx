import React from 'react'
import { createAnonServerClient } from '@/lib/supabase/server'
import Link from 'next/link'
import Container from '@/components/layout/Container'
import { ListaPlanesMembresia } from '@/components/membresias'

export const metadata = {
  title: 'Membresías | FULLFORMA',
  description: 'Elige tu plan de entrenamiento. Acceso a toda nuestra sede en Trujillo.',
}

async function getPlanes() {
  const supabase = createAnonServerClient()

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
              Entrena sin límites en nuestra sede.{' '}
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
          {planes.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-white/60 text-lg font-mono mb-2">Próximamente</p>
              <p className="text-white/40 text-sm font-mono">
                Estamos preparando los mejores planes para ti. Vuelve pronto.
              </p>
            </div>
          ) : (
            <ListaPlanesMembresia planes={planes} />
          )}
        </Container>
      </section>

      <section className="py-12 border-t border-white/5">
        <Container>
          <div className="text-center">
            <p className="text-white/40 text-xs md:text-sm font-mono">
              ¿Tienes dudas sobre qué plan elegir?{' '}
              <Link href="/sedes" className="text-gym-logo hover:underline">
                Visítanos en nuestra sede
              </Link>
            </p>
          </div>
        </Container>
      </section>
    </main>
  )
}

export default MembresiasPage