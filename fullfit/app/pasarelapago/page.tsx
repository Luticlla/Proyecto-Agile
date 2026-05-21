'use client'

import { useEffect } from 'react'
import { useAuth } from '@/hooks'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import Container from '@/components/Container'

const PasarelaPagoPage = () => {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      const currentPath = window.location.pathname + window.location.search
      router.replace(`/login?redirect=${encodeURIComponent(currentPath)}`)
    }
  }, [user, loading, router])

  useEffect(() => {
    document.title = 'Pasarela de Pago | Full Forma'
  }, [])

  if (loading) {
    return (
      <main className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-gym-logo animate-spin" />
      </main>
    )
  }

  if (!user) return null

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
