import React from 'react'
import { createAnonServerClient } from '@/lib/supabase/server'
import { getClasesConHorarios } from '@/lib/supabase/queries/clases'
import Container from '@/components/layout/Container'
import HomeBanner from '@/components/sections/HomeBanner'
import InfiniteScroll from '@/components/sections/InfiniteScroll'
import SedesClient from '@/components/features/sedes/SedesClient'
import ClasesGrupalesHome from '@/components/features/clases/ClasesGrupalesHome'

export const metadata = {
  title: 'FULLFORMA | Gimnasio en Trujillo',
  description: 'Tu gimnasio en Trujillo. Encuentra tu mejor versión con nosotros.',
}

async function getSedes() {
  const supabase = createAnonServerClient()

  const { data, error } = await supabase
    .from('sedes')
    .select('*')
    .eq('estado', 'activa')
    .order('nombre', { ascending: true })

  if (error) {
    console.error('Error fetching sedes:', error)
    return []
  }

  return data ?? []
}

async function getClases() {
  const supabase = createAnonServerClient()
  const all = await getClasesConHorarios(supabase)
  return all.filter((c) => c.activa)
}

const Home = async () => {
  const [sedes, clases] = await Promise.all([getSedes(), getClases()])

  return (
    <main>
      <HomeBanner />
      <section className="w-full py-2 flex justify-center px-2">
        <h2 className="font-arcade text-yellow-400 text-center text-sm sm:text-base md:text-xl lg:text-2xl leading-relaxed">
          Encuentra tu mejor <span className="text-white">versión</span> con nosotros
        </h2>
      </section>
      <InfiniteScroll />

      {/* Sedes */}
      <section id="sedes" className="relative border-t-2 border-gym-logo/30 overflow-hidden mt-8">
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
                Encuéntranos
              </span>
              <div className="h-px w-8 md:w-16 bg-gym-logo" />
            </div>

            <h2 className="font-arcade text-white text-xl md:text-3xl lg:text-4xl tracking-wide uppercase leading-relaxed">
              Nuestra{' '}
              <span className="text-gym-logo [text-shadow:0_0_20px_rgba(255,223,0,0.5)]">
                Sede
              </span>
            </h2>

            <p className="text-white/60 text-xs md:text-sm max-w-lg leading-relaxed font-mono">
              Encuentra tu FULLFORMA más cercano. Nuestra sede en Trujillo con equipamiento de primera.
              <span className="text-gym-logo/80">Tu membresía, tu sede.</span>
            </p>

            <div className="mt-4 pt-4 border-t border-white/10 w-full max-w-sm md:max-w-md">
              <p className="font-arcade text-gym-logo text-[8px] md:text-xs tracking-widest uppercase text-center">
                Te ayudamos en nuestros horarios
              </p>
            </div>
          </div>
        </Container>
      </section>

      <SedesClient sedes={sedes} />

      {/* Clases Grupales */}
      <section id="clases" className="relative border-t-2 border-gym-logo/30 overflow-hidden mt-8">
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
                Nuestras Clases
              </span>
              <div className="h-px w-8 md:w-16 bg-gym-logo" />
            </div>

            <h2 className="font-arcade text-white text-xl md:text-3xl lg:text-4xl tracking-wide uppercase leading-relaxed">
              Clases{' '}
              <span className="text-gym-logo [text-shadow:0_0_20px_rgba(255,223,0,0.5)]">
                Grupales
              </span>
            </h2>

            <p className="text-white/60 text-xs md:text-sm max-w-lg leading-relaxed font-mono">
              Descubre nuestras clases grupales dirigidas por entrenadores certificados.
              <span className="text-gym-logo/80">Entrena con energía, entrena en grupo.</span>
            </p>

            <div className="flex items-center gap-8 md:gap-16 mt-4 pt-4 border-t border-white/10 w-full max-w-sm md:max-w-md justify-center">
              <div className="flex flex-col items-center gap-1">
                <span className="font-arcade text-gym-logo text-lg md:text-2xl">{clases.length}</span>
                <span className="text-white/40 text-[8px] md:text-[10px] font-arcade uppercase tracking-wider">Clases</span>
              </div>
              <div className="h-8 w-px bg-white/10" />
              <div className="flex flex-col items-center gap-1">
                <span className="font-arcade text-gym-logo text-lg md:text-2xl">Live</span>
                <span className="text-white/40 text-[8px] md:text-[10px] font-arcade uppercase tracking-wider">Grupales</span>
              </div>
              <div className="h-8 w-px bg-white/10" />
            </div>
          </div>
        </Container>
      </section>

      <ClasesGrupalesHome clases={clases} />
    </main>
  )
}
export default Home
