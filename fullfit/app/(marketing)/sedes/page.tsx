import React from 'react'
import { createClient } from '@supabase/supabase-js'
import Container from '@/components/layout/Container'
import SedesClient from '@/components/features/sedes/SedesClient'

export const metadata = {
  title: 'Sedes | Full Forma',
  description: 'Encuentra tu Full Forma más cercano. Múltiples sedes en Trujillo con equipamiento de primera.',
}

// Server-side data fetching
async function getSedes() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

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

const SedesPage = async () => {
  const sedes = await getSedes()

  return (
    <main className="min-h-screen bg-black">
      {/* Hero Header */}
      <section className="relative border-b-2 border-gym-logo/30 overflow-hidden">
        {/* Grid background pattern */}
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

            <h1 className="font-arcade text-white text-xl md:text-3xl lg:text-4xl tracking-wide uppercase leading-relaxed">
              Nuestras{' '}
              <span className="text-gym-logo [text-shadow:0_0_20px_rgba(255,223,0,0.5)]">
                Sedes
              </span>
            </h1>

            <p className="text-white/60 text-xs md:text-sm max-w-lg leading-relaxed font-mono">
              Múltiples puntos de entrenamiento en Trujillo.{' '}
              <span className="text-gym-logo/80">Tu membresía, todas las sedes.</span>
            </p>

            {/* Stats bar */}
            <div className="flex items-center gap-8 md:gap-16 mt-4 pt-4 border-t border-white/10 w-full max-w-sm md:max-w-md justify-center">
              <div className="flex flex-col items-center gap-1">
                <span className="font-arcade text-gym-logo text-lg md:text-2xl">{sedes.length}</span>
                <span className="text-white/40 text-[8px] md:text-[10px] font-arcade uppercase tracking-wider">Sedes</span>
              </div>
              <div className="h-8 w-px bg-white/10" />
              <div className="flex flex-col items-center gap-1">
                <span className="font-arcade text-gym-logo text-lg md:text-2xl">24/7</span>
                <span className="text-white/40 text-[8px] md:text-[10px] font-arcade uppercase tracking-wider">Soporte</span>
              </div>
              <div className="h-8 w-px bg-white/10" />
            </div>
          </div>
        </Container>
      </section>

      {/* Sedes Content (Client Component for interactivity) */}
      <SedesClient sedes={sedes} />
    </main>
  )
}

export default SedesPage
