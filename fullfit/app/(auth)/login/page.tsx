'use client'

import { useState, Suspense } from 'react'
import { useAuth } from '@/hooks'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'

function LoginForm() {
  const { signIn } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirect')
  
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const isEmail = (input: string) => input.includes('@')
  const isDNI = (input: string) => /^\d{8}$/.test(input)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    let loginEmail = email

    // Si no es email, buscar por DNI
    if (!isEmail(email)) {
      if (!isDNI(email)) {
        setError('Ingrese un email válido o DNI de 8 dígitos')
        setLoading(false)
        return
      }
      
      // Buscar email por DNI usando función RPC segura
      const { data: emailData, error: rpcError } = await supabase.rpc('get_email_by_dni' as never, { p_dni: email } as never)
      
      if (rpcError || !emailData) {
        setError('DNI no encontrado')
        setLoading(false)
        return
      }
      
      loginEmail = emailData as string
    }

    const { error } = await signIn(loginEmail, password)
    
    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      if (redirectTo) {
        router.replace(redirectTo)
        return
      }
      window.location.href = '/'
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-950 px-4">
      <Link href="/" className="flex items-center gap-2 text-zinc-400 hover:text-white mb-6 hoverEffect">
        <ArrowLeft className="w-4 h-4" />
        <span className="font-arcade text-xs">Volver al inicio</span>
      </Link>
      <Card className="w-full max-w-md bg-zinc-900 border-zinc-800">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-white">Bienvenido de nuevo</CardTitle>
          <CardDescription className="text-zinc-400">
            Inicia sesión para acceder a tu cuenta
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded">
                {error}
              </div>
            )}
            
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm text-zinc-300">Email o DNI</label>
              <Input
                id="email"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com o 12345678"
                required
                className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-sm text-zinc-300">Contraseña</label>
                <Link href="/forgot-password" className="text-xs text-yellow-400 hover:underline">
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-yellow-400 text-zinc-950 hover:bg-yellow-300"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Iniciando sesión...
                </>
              ) : (
                'Iniciar Sesión'
              )}
            </Button>
          </form>

          <div className="mt-4 text-center text-sm text-zinc-400">
            ¿No tienes cuenta?{' '}
            <Link href="/register" className="text-yellow-400 hover:underline">
              Regístrate aquí
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-zinc-950">
        <Loader2 className="w-8 h-8 text-zinc-400 animate-spin" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  )
}