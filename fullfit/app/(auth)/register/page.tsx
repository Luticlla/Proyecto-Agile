'use client'

import { useState } from 'react'
import { useAuth } from '@/hooks'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Loader2, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const validateEmail = (email: string) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    )
}

export default function RegisterPage() {
  const { signUp } = useAuth()
  const router = useRouter()

  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    dni: '',
    email: '',
    telefono: '',
    fecha_nacimiento: '',
    genero: '',
    password: '',
    confirmPassword: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    if (name === 'nombre' || name === 'apellido') {
      const onlyLetters = value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]/g, '')
      setFormData(prev => ({ ...prev, [name]: onlyLetters }))
      return
    }

    if (name === 'dni') {
      const onlyDigits = value.replace(/\D/g, '').slice(0, 8)
      setFormData(prev => ({ ...prev, [name]: onlyDigits }))
      return
    }

    if (name === 'telefono') {
      const cleaned = value.replace(/\D/g, '').slice(0, 9)
      if (cleaned.length > 0 && cleaned[0] !== '9') return
      setFormData(prev => ({ ...prev, [name]: cleaned }))
      return
    }

    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const getMaxBirthDate = () => {
    const today = new Date()
    today.setFullYear(today.getFullYear() - 18)
    return today.toISOString().split('T')[0]
  }

  const getMinBirthDate = () => {
    const today = new Date()
    today.setFullYear(today.getFullYear() - 100)
    return today.toISOString().split('T')[0]
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!validateEmail(formData.email)) {
      setError('El correo no es válido')
      return
    }

    if (!/^\d{8}$/.test(formData.dni)) {
      setError('El DNI debe tener exactamente 8 dígitos')
      return
    }

    if (!formData.fecha_nacimiento) {
      setError('La fecha de nacimiento es obligatoria')
      return
    }

    const birthDate = new Date(formData.fecha_nacimiento + 'T00:00:00')
    const today = new Date()
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    if (age < 18) {
      setError('Debes ser mayor de 18 años para registrarte')
      return
    }

    if (!formData.genero) {
      setError('Selecciona tu sexo')
      return
    }

    if (formData.telefono) {
      if (!/^9\d{8}$/.test(formData.telefono)) {
        setError('El teléfono debe tener 9 dígitos y comenzar con 9')
        return
      }
    }

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
      telefono: formData.telefono || undefined,
      dni: formData.dni,
      fecha_nacimiento: formData.fecha_nacimiento,
      genero: formData.genero === 'prefiero no decirlo' ? null : formData.genero
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
        <ArrowLeft className="size-4" />
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
                <label htmlFor="nombre" className="text-sm text-zinc-300">Nombre *</label>
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
                <label htmlFor="apellido" className="text-sm text-zinc-300">Apellido *</label>
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
              <label htmlFor="dni" className="text-sm text-zinc-300">DNI *</label>
              <Input
                id="dni"
                name="dni"
                value={formData.dni}
                onChange={handleChange}
                placeholder="12345678"
                required
                maxLength={8}
                pattern="[0-9]{8}"
                inputMode="numeric"
                className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm text-zinc-300">Email *</label>
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
              <div className="flex">
                <span className="flex items-center px-3 bg-zinc-700 border border-zinc-600 border-r-0 rounded-l-md text-sm text-zinc-300 select-none">
                  +51
                </span>
                <Input
                  id="telefono"
                  name="telefono"
                  type="tel"
                  value={formData.telefono}
                  onChange={handleChange}
                  placeholder="999 999 999"
                  inputMode="numeric"
                  maxLength={9}
                  className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 rounded-l-none"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="fecha_nacimiento" className="text-sm text-zinc-300">Fecha de Nacimiento *</label>
              <Input
                id="fecha_nacimiento"
                name="fecha_nacimiento"
                type="date"
                value={formData.fecha_nacimiento}
                onChange={handleChange}
                required
                max={getMaxBirthDate()}
                min={getMinBirthDate()}
                className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="genero" className="text-sm text-zinc-300">Sexo *</label>
              <Select value={formData.genero} onValueChange={(value) => setFormData(prev => ({ ...prev, genero: value }))}>
                <SelectTrigger className="w-full bg-zinc-800 border-zinc-700 text-white">
                  <SelectValue placeholder="Selecciona tu sexo" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-800 border-zinc-700">
                  <SelectItem value="masculino">Masculino</SelectItem>
                  <SelectItem value="femenino">Femenino</SelectItem>
                  <SelectItem value="prefiero no decirlo">Prefiero no decirlo</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm text-zinc-300">Contraseña *</label>
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
              <label htmlFor="confirmPassword" className="text-sm text-zinc-300">Confirmar Contraseña *</label>
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
