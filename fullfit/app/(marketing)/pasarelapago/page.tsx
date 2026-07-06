'use client'

import { useEffect, useState, useCallback, useRef, Suspense } from 'react'
import { useAuth } from '@/hooks'
import { useRouter, useSearchParams } from 'next/navigation'
import { Loader2, ArrowLeft, Check, CreditCard, Lock } from 'lucide-react'
import Link from 'next/link'
import Container from '@/components/layout/Container'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { planFeatures, formatPrice } from '@/constants/plans'

function PaymentSummary({ plan, prices, features }: {
  plan: { nombre: string; precio: number; duracion_dias: number; descripcion?: string }
  prices: { total: string; perMonth: string }
  features: string[]
}) {
  return (
    <Card className="w-full max-w-md bg-zinc-900 border-zinc-800">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-white">{plan.nombre}</CardTitle>
        {plan.descripcion && (
          <CardDescription className="text-zinc-400">{plan.descripcion}</CardDescription>
        )}
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="text-center flex flex-col gap-1">
          <span className="font-arcade text-gym-logo text-3xl">{prices.total}</span>
          <span className="text-white/40 text-xs font-mono">
            {plan.duracion_dias === 365 ? 'al año' : prices.perMonth}
          </span>
        </div>

        <div className="flex flex-col gap-3">
          {features.map((feature, i) => (
            <div key={i} className="flex items-start gap-3">
              <Check className="size-4 text-gym-logo shrink-0 mt-0.5" />
              <span className="text-white/70 text-sm font-mono">{feature}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function PaymentStatus({ status, verificationResult, verificationLoading }: { 
  status: string
  verificationResult: { success: boolean; message?: string; error?: string } | null
  verificationLoading: boolean
}) {
  const config: Record<string, { title: string; desc: string; color: string }> = {
    approved: { title: '¡Pago aprobado!', desc: 'Tu membresía está activa.', color: 'text-green-400' },
    rejected: { title: 'Pago no procesado', desc: 'El pago no pudo ser completado.', color: 'text-red-400' },
    pending: { title: 'Pago pendiente', desc: 'Tu pago está siendo procesado.', color: 'text-yellow-400' },
  }
  const { title, desc, color } = config[status] || config.pending

  if (verificationLoading) {
    return (
      <Card className="w-full max-w-md bg-zinc-900 border-zinc-800">
        <CardContent className="flex flex-col items-center gap-4 pt-6">
          <Loader2 className="size-8 text-gym-logo animate-spin" />
          <p className="text-white/60 text-sm font-mono text-center">Verificando tu pago...</p>
        </CardContent>
      </Card>
    )
  }

  if (verificationResult && !verificationResult.success) {
    return (
      <Card className="w-full max-w-md bg-zinc-900 border-zinc-800">
        <CardContent className="flex flex-col items-center gap-4 pt-6">
          <h2 className="font-arcade text-xl text-red-400">Error al activar membresía</h2>
          <p className="text-white/60 text-sm font-mono text-center">{verificationResult.error || 'No se pudo procesar el pago'}</p>
          <Link href="/membresias">
            <Button className="font-arcade bg-gym-logo text-black hover:bg-gym-logo/80">
              Volver a planes
            </Button>
          </Link>
        </CardContent>
      </Card>
    )
  }

  if (verificationResult && verificationResult.success) {
    return (
      <Card className="w-full max-w-md bg-zinc-900 border-zinc-800">
        <CardContent className="flex flex-col items-center gap-4 pt-6">
          <h2 className="font-arcade text-xl text-green-400">¡Membresía activada!</h2>
          <p className="text-white/60 text-sm font-mono text-center">{verificationResult.message || 'Tu membresía está activa.'}</p>
          <Link href="/">
            <Button className="font-arcade bg-gym-logo text-black hover:bg-gym-logo/80">
              Volver al inicio
            </Button>
          </Link>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md bg-zinc-900 border-zinc-800">
      <CardContent className="flex flex-col items-center gap-4 pt-6">
        <h2 className={`font-arcade text-xl ${color}`}>{title}</h2>
        <p className="text-white/60 text-sm font-mono text-center">{desc}</p>
        <Link href="/">
          <Button className="font-arcade bg-gym-logo text-black hover:bg-gym-logo/80">
            Volver al inicio
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}

function PasarelaPagoContent() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()

  const planId = searchParams.get('plan')
  const status = searchParams.get('status')
  const paymentId = searchParams.get('payment_id')

  const [plan, setPlan] = useState<{ id: number; nombre: string; precio: number; duracion_dias: number; descripcion?: string } | null>(null)
  const [paymentLoading, setPaymentLoading] = useState(false)
  const [planLoading, setPlanLoading] = useState(true)
  const [verificationLoading, setVerificationLoading] = useState(false)
  const [verificationResult, setVerificationResult] = useState<{ success: boolean; message?: string; error?: string } | null>(null)
  const [membresiaBloqueada, setMembresiaBloqueada] = useState(false)
  const [diasRestantes, setDiasRestantes] = useState(0)
  const [checkingMembresia, setCheckingMembresia] = useState(true)
  const membresiaCheckedRef = useRef(false)

  useEffect(() => {
    let isMounted = true
    if (!loading && !user && !status && isMounted) {
      const currentPath = window.location.pathname + window.location.search
      router.replace(`/login?redirect=${encodeURIComponent(currentPath)}`)
    }
    return () => { isMounted = false }
  }, [user, loading, router, status])

  useEffect(() => {
    document.title = 'Pasarela de Pago | FULLFORMA'
  }, [])

  useEffect(() => {
    if (membresiaCheckedRef.current) return

    if (!user) {
      setCheckingMembresia(false)
      return
    }

    membresiaCheckedRef.current = true

    const checkMembresia = async () => {
      try {
        const response = await fetch('/api/membresias/estado')
        if (response.ok) {
          const data = await response.json()
          if (data.tieneMembresiaActiva && !data.puedeComprar) {
            setMembresiaBloqueada(true)
            setDiasRestantes(data.diasRestantes)
          }
        }
      } catch {
        // Si hay error, permitir continuar
      } finally {
        setCheckingMembresia(false)
      }
    }

    checkMembresia()
  }, [user])

  useEffect(() => {
    if (!planId) {
      setPlanLoading(false)
      return
    }

    const fetchPlan = async () => {
      const { supabase } = await import('@/lib/supabase/client')
      const { data } = await supabase
        .from('planes_membresia')
        .select('*')
        .eq('id', planId)
        .eq('activo', true)
        .single()

      setPlan(data)
      setPlanLoading(false)
    }

    fetchPlan()
  }, [planId])

  // Verificar el pago cuando regresa de MercadoPago con status=approved y payment_id
  useEffect(() => {
    if (status === 'approved' && paymentId && !verificationResult) {
      const verificarPago = async () => {
        setVerificationLoading(true)
        try {
          const response = await fetch('/api/pagos/verificar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ payment_id: paymentId }),
          })

          const data = await response.json()
          setVerificationResult(data)
        } catch (error) {
          console.error('Error verifying payment:', error)
          setVerificationResult({ success: false, error: 'Error al verificar el pago' })
        } finally {
          setVerificationLoading(false)
        }
      }

      verificarPago()
    }
  }, [status, paymentId, verificationResult])

  const handlePayment = useCallback(async () => {
    if (!plan || !user) return
    setPaymentLoading(true)

    try {
      const response = await fetch('/api/pagos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId: plan.id, userId: user.id }),
      })

      const data = await response.json()

      if (data.init_point) {
        window.location.href = data.init_point
      } else {
        setPaymentLoading(false)
      }
    } catch {
      setPaymentLoading(false)
    }
  }, [plan, user])

  if (loading || planLoading || checkingMembresia) {
    return (
      <main className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="size-8 text-gym-logo animate-spin" />
      </main>
    )
  }

  if (status) {
    return (
      <main className="min-h-screen bg-black">
        <Container className="py-20 flex flex-col items-center">
          <PaymentStatus 
            status={status} 
            verificationResult={verificationResult} 
            verificationLoading={verificationLoading}
          />
        </Container>
      </main>
    )
  }

  if (!user) return null

  if (membresiaBloqueada) {
    return (
      <main className="min-h-screen bg-black">
        <Container className="py-20 flex flex-col items-center gap-8">
          <Link href="/membresias" className="flex items-center gap-2 text-zinc-400 hover:text-white hoverEffect">
            <ArrowLeft className="size-4" />
            <span className="font-arcade text-xs">Volver a planes</span>
          </Link>

          <Card className="w-full max-w-md bg-zinc-900 border-zinc-800">
            <CardContent className="flex flex-col items-center gap-4 pt-6">
              <div className="size-12 rounded-full bg-yellow-400/10 flex items-center justify-center">
                <Lock className="size-6 text-yellow-400" />
              </div>
              <h2 className="font-arcade text-xl text-yellow-400">Membresía Activa</h2>
              <p className="text-white/60 text-sm font-mono text-center">
                Tu membresía está activa y vence en <span className="text-white font-bold">{diasRestantes} días</span>.
              </p>
              <p className="text-white/40 text-xs font-mono text-center">
                Podrás renovar cuando falten 7 días o menos.
              </p>
              <Link href="/membresias" className="mt-4">
                <Button className="font-arcade bg-gym-logo text-black hover:bg-gym-logo/80">
                  Volver a planes
                </Button>
              </Link>
            </CardContent>
          </Card>
        </Container>
      </main>
    )
  }

  if (!plan) {
    return (
      <main className="min-h-screen bg-black">
        <Container className="py-20 flex flex-col items-center gap-6">
          <p className="text-white/50 font-mono text-sm">Plan no encontrado.</p>
          <Link href="/membresias">
            <Button variant="outline" className="font-arcade">Ver planes</Button>
          </Link>
        </Container>
      </main>
    )
  }

  const prices = formatPrice(plan.precio, plan.duracion_dias)
  const features = planFeatures[plan.nombre] || []

  return (
    <main className="min-h-screen bg-black">
      <Container className="py-20 flex flex-col items-center gap-8">
        <Link href="/membresias" className="flex items-center gap-2 text-zinc-400 hover:text-white hoverEffect">
          <ArrowLeft className="size-4" />
          <span className="font-arcade text-xs">Volver a planes</span>
        </Link>

        <PaymentSummary plan={plan} prices={prices} features={features} />

        <Button
          onClick={handlePayment}
          disabled={paymentLoading}
          className="font-arcade bg-gym-logo text-black hover:bg-gym-logo/80 w-full max-w-md py-6"
        >
          {paymentLoading ? (
            <Loader2 className="size-5 animate-spin" />
          ) : (
            <>
              <CreditCard className="size-5 mr-2" />
              Pagar con Mercado Pago
            </>
          )}
        </Button>
      </Container>
    </main>
  )
}

export default function PasarelaPagoPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="size-8 text-gym-logo animate-spin" />
      </main>
    }>
      <PasarelaPagoContent />
    </Suspense>
  )
}
