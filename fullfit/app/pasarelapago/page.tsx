import React from 'react'
import Container from '@/components/Container'

export const metadata = {
  title: 'Pasarela de Pago | Full Forma',
  description: 'Completa tu pago para activar tu membresía.',
}

const PasarelaPagoPage = () => {
  return (
    <main className="min-h-screen bg-black">
      <Container className="py-20">
        <div className="flex flex-col items-center justify-center text-center">
          <h1 className="font-arcade text-white text-xl md:text-2xl mb-4">
            Pasarela de Pago
          </h1>
          <p className="text-white/50 font-mono text-sm">
            Esta página está en construcción...
          </p>
        </div>
      </Container>
    </main>
  )
}

export default PasarelaPagoPage