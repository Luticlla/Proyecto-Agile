'use client'

import { useState } from 'react'
import { useAuth } from '@/hooks'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function RegisterPage() {
  const { signUp } = useAuth()
  const router = useRouter()
  
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    password: '',
    confirmPassword: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden')
      return
    }

    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres')
      return
    }

    setLoading(true)

    const { error } = await signUp(formData.email, formData.password, {
      nombre: formData.nombre,
      apellido: formData.apellido,
      telefono: formData.telefono
    })
    
    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      alert('¡Registro exitoso! Por favor verifica tu email para confirmar tu cuenta.')
      router.push('/login')
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-950 px-4 py-8">
      <Link href="/" className="flex items-center gap-2 text-zinc-400 hover:text-white mb-6 hoverEffect">
        <ArrowLeft className="w-4 h-4" />
        <span className="font-arcade text-xs">Volver al inicio</span>
      </Link>
      <Card className="w-full max-w-md bg-zinc-900 border-zinc-800">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-white">Crear Cuenta</CardTitle>
          <CardDescription className="text-zinc-400">
            Únete a Full Forma y alcanza tus metas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded">
                {error}
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="nombre" className="text-sm text-zinc-300">Nombre</label>
                <Input
                  id="nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  placeholder="Juan"
                  required
                  className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="apellido" className="text-sm text-zinc-300">Apellido</label>
                <Input
                  id="apellido"
                  name="apellido"
                  value={formData.apellido}
                  onChange={handleChange}
                  placeholder="Pérez"
                  required
                  className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm text-zinc-300">Email</label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="tu@email.com"
                required
                className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="telefono" className="text-sm text-zinc-300">Teléfono (opcional)</label>
              <Input
                id="telefono"
                name="telefono"
                type="tel"
                value={formData.telefono}
                onChange={handleChange}
                placeholder="+51 999 999 999"
                className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm text-zinc-300">Contraseña</label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="text-sm text-zinc-300">Confirmar Contraseña</label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
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
                  Creando cuenta...
                </>
              ) : (
                'Crear Cuenta'
              )}
            </Button>
          </form>

          <div className="mt-4 text-center text-sm text-zinc-400">
            ¿Ya tienes cuenta?{' '}
            <Link href="/login" className="text-yellow-400 hover:underline">
              Inicia sesión aquí
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}