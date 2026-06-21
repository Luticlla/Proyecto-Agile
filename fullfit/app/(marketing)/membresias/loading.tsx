import { Loader2 } from 'lucide-react'
import Container from '@/components/layout/Container'

export default function MembresiasLoading() {
  return (
    <main className="min-h-screen bg-black">
      <section className="relative border-b-2 border-gym-logo/30 overflow-hidden">
        <Container className="py-16 md:py-24 relative z-10">
          <div className="flex flex-col items-center text-center gap-6">
            <Loader2 className="size-8 text-gym-logo animate-spin" />
            <p className="font-arcade text-white/40 text-xs uppercase tracking-wider">
              Cargando planes...
            </p>
          </div>
        </Container>
      </section>
    </main>
  )
}
