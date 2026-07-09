'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loader2, CheckCircle2, XCircle } from 'lucide-react'
import Link from 'next/link'

function ConfirmForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>(() => token ? 'loading' : 'error')
  const [errorMessage, setErrorMessage] = useState(() => token ? '' : 'Token no válido')

  useEffect(() => {
    if (!token) return

    let cancelled = false

    const confirmAccount = async () => {
      try {
        const response = await fetch('/api/auth/confirm', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        })

        const data = await response.json()

        if (cancelled) return

        if (!response.ok) {
          setStatus('error')
          setErrorMessage(data.error || 'Error al confirmar la cuenta')
          return
        }

        setStatus('success')
      } catch {
        if (!cancelled) {
          setStatus('error')
          setErrorMessage('Error de conexión')
        }
      }
    }

    confirmAccount()

    return () => { cancelled = true }
  }, [token])

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950">
        <Loader2 className="size-8 text-zinc-400 animate-spin" />
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950 px-4">
        <Card className="w-full max-w-md bg-zinc-900 border-zinc-800">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <XCircle className="size-12 text-red-400" />
            </div>
            <CardTitle className="text-2xl font-bold text-white">Error de Confirmación</CardTitle>
            <CardDescription className="text-zinc-400">
              {errorMessage}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-center">
            <p className="text-sm text-zinc-500">
              El enlace puede haber expirado o ser inválido.
            </p>
            <Button
              asChild
              className="w-full bg-yellow-400 text-zinc-950 hover:bg-yellow-300"
            >
              <Link href="/register">
                Crear Nueva Cuenta
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="w-full border-zinc-700 text-zinc-300 hover:border-yellow-400/60 hover:text-yellow-400"
            >
              <Link href="/login">
                Iniciar Sesión
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 px-4">
      <Card className="w-full max-w-md bg-zinc-900 border-zinc-800">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle2 className="size-12 text-green-400" />
          </div>
          <CardTitle className="text-2xl font-bold text-white">Cuenta Confirmada</CardTitle>
          <CardDescription className="text-zinc-400">
            Tu cuenta ha sido activada correctamente
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <p className="text-sm text-zinc-500">
            Ya puedes iniciar sesión en FULLFORMA.
          </p>
          <Button
            onClick={() => router.push('/login')}
            className="w-full bg-yellow-400 text-zinc-950 hover:bg-yellow-300"
          >
            Iniciar Sesión
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

export default function ConfirmPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-zinc-950">
        <Loader2 className="size-8 text-zinc-400 animate-spin" />
      </div>
    }>
      <ConfirmForm />
    </Suspense>
  )
}
