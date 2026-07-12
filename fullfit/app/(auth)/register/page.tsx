'use client'

import { useState } from 'react'
import { useAuth } from '@/hooks'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Loader2, ArrowLeft, ShieldCheck, CheckCircle2, XCircle, MailCheck, Eye, EyeOff } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
import Link from 'next/link'
import { toast } from 'sonner'

// ─── Validaciones ────────────────────────────────────────────────────────────
const validateEmail = (email: string) =>
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
    String(email).toLowerCase()
  )

function validatePassword(password: string): string | null {
  if (!password) return null
  if (password.length < 8) return 'La contraseña debe tener al menos 8 caracteres'
  if (/^\d+$/.test(password)) return 'La contraseña no puede contener solo números'
  return null
}

// ─── Componente ───────────────────────────────────────────────────────────────
export default function RegisterPage() {
  const { signUp } = useAuth()

  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    dni: '',
    email: '',
    telefono: '',
    fecha_nacimiento: '',
    genero: '',
    password: '',
    confirmPassword: '',
    aceptaTerminos: false,
  })

  const [error, setError] = useState('')
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [validating, setValidating] = useState(false)
  const [reniecValidado, setReniecValidado] = useState(false)
  const [registeredEmail, setRegisteredEmail] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // ─── Handlers ────────────────────────────────────────────────────────────────
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    // Campos bloqueados tras validación RENIEC
    if (reniecValidado && (name === 'nombre' || name === 'apellido')) return

    if (name === 'nombre' || name === 'apellido') {
      setFormData(prev => ({ ...prev, [name]: value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]/g, '') }))
      return
    }

    if (name === 'dni') {
      const digits = value.replace(/\D/g, '').slice(0, 8)
      // Si cambia el DNI después de validar → resetear validación
      if (reniecValidado) {
        setReniecValidado(false)
        setFormData(prev => ({ ...prev, dni: digits, nombre: '', apellido: '' }))
      } else {
        setFormData(prev => ({ ...prev, dni: digits }))
      }
      return
    }

    if (name === 'telefono') {
      const cleaned = value.replace(/\D/g, '').slice(0, 9)
      if (cleaned.length > 0 && cleaned[0] !== '9') return
      setFormData(prev => ({ ...prev, [name]: cleaned }))
      return
    }

    if (name === 'password') {
      setPasswordError(validatePassword(value))
    }

    setFormData(prev => ({ ...prev, [name]: value }))
  }

  // ─── Validar DNI con RENIEC ──────────────────────────────────────────────────
  const handleValidarReniec = async () => {
    setError('')
    if (formData.dni.length !== 8) {
      setError('Ingresa los 8 dígitos del DNI antes de validar')
      return
    }
    setValidating(true)
    try {
      const res = await fetch(`/api/reniec/public?dni=${formData.dni}`)
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Error al consultar RENIEC')
        return
      }

      setFormData(prev => ({
        ...prev,
        nombre: data.nombre,
        apellido: data.apellido,
        dni: data.dni,
      }))
      setReniecValidado(true)
    } catch {
      setError('No se pudo conectar con el servicio RENIEC. Intenta más tarde.')
    } finally {
      setValidating(false)
    }
  }

  // ─── Limpiar datos RENIEC ──────────────────────────────────────────────────
  const handleClearReniec = () => {
    setFormData(prev => ({ ...prev, dni: '', nombre: '', apellido: '' }))
    setReniecValidado(false)
    setError('')
  }

  // ─── Condiciones para habilitar "Crear Cuenta" ────────────────────────────────
  const allConditionsMet =
    reniecValidado &&
    validateEmail(formData.email) &&
    formData.password !== '' &&
    passwordError === null &&
    formData.password === formData.confirmPassword &&
    formData.fecha_nacimiento !== '' &&
    formData.genero !== '' &&
    formData.aceptaTerminos

  // ─── Submit ──────────────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!reniecValidado) {
      setError('Debes validar tu DNI con RENIEC antes de continuar')
      return
    }

    if (!validateEmail(formData.email)) {
      setError('El correo no es válido')
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
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) age--
    if (age < 18) {
      setError('Debes ser mayor de 18 años para registrarte')
      return
    }

    if (!formData.genero) {
      setError('Selecciona tu sexo')
      return
    }

    if (formData.telefono && !/^9\d{8}$/.test(formData.telefono)) {
      setError('El teléfono debe tener 9 dígitos y comenzar con 9')
      return
    }

    const pwdErr = validatePassword(formData.password)
    if (pwdErr) {
      setPasswordError(pwdErr)
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden')
      return
    }

    if (!formData.aceptaTerminos) {
      setError('Debes aceptar los Términos y Condiciones para continuar')
      return
    }

    setLoading(true)

    const { error } = await signUp(formData.email, formData.password, {
      nombre: formData.nombre,
      apellido: formData.apellido,
      telefono: formData.telefono || undefined,
      dni: formData.dni,
      fecha_nacimiento: formData.fecha_nacimiento,
      genero: formData.genero === 'prefiero no decirlo' ? null : formData.genero,
    })

    if (error) {
      if (error.message?.includes('DNI ya está registrado')) {
        toast.error('Este DNI ya está registrado en el sistema', {
          description: 'Verifica el número e intenta con otro DNI'
        })
      }
      setError(error.message)
      setLoading(false)
    } else {
      setRegisteredEmail(formData.email)
      setLoading(false)
    }
  }

  const getMaxBirthDate = () => {
    const d = new Date()
    d.setFullYear(d.getFullYear() - 18)
    return d.toISOString().split('T')[0]
  }

  const getMinBirthDate = () => {
    const d = new Date()
    d.setFullYear(d.getFullYear() - 100)
    return d.toISOString().split('T')[0]
  }

  // ─── UI ──────────────────────────────────────────────────────────────────────
  if (registeredEmail) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-950 px-4 py-8">
        <Link href="/" className="flex items-center gap-2 text-zinc-400 hover:text-white mb-6 hoverEffect">
          <ArrowLeft className="size-4" />
          <span className="font-arcade text-xs">Volver al inicio</span>
        </Link>

        <Card className="w-full max-w-md bg-zinc-900 border-zinc-800">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <MailCheck className="size-12 text-yellow-400" />
            </div>
            <CardTitle className="text-2xl font-bold text-white">Revisa tu correo</CardTitle>
            <CardDescription className="text-zinc-400">
              Te hemos enviado un enlace de confirmación a{' '}
              <span className="text-yellow-400">{registeredEmail}</span>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-center">
            <p className="text-sm text-zinc-500">
              Haz clic en el enlace del correo para activar tu cuenta y poder iniciar sesión.
            </p>
            <p className="text-xs text-zinc-600">
              ¿No recibiste el correo? Revisa tu bandeja de spam.
            </p>
            <Button
              asChild
              className="w-full bg-yellow-400 text-zinc-950 hover:bg-yellow-300"
            >
              <Link href="/login">
                Ir a Iniciar Sesión
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
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
            Únete a FULLFORMA y alcanza tus metas
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Error general */}
            {error && (
              <div className="flex items-start gap-2 p-3 text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded">
                <XCircle className="size-4 shrink-0 mt-0.5" />
                {error}
              </div>
            )}

            {/* DNI + botón Validar */}
            <div className="space-y-2">
              <label htmlFor="dni" className="text-sm text-zinc-300">
                DNI *{' '}
                {reniecValidado && (
                  <span className="inline-flex items-center gap-1 text-emerald-400 text-xs ml-1">
                    <CheckCircle2 className="size-3" /> Validado con RENIEC
                  </span>
                )}
              </label>
              <div className="flex gap-2">
                <Input
                    id="dni"
                    name="dni"
                    value={formData.dni}
                    onChange={handleChange}
                    placeholder="12345678"
                    required
                    pattern="[0-9]{8}"
                    maxLength={8}
                    inputMode="numeric"
                    disabled={validating || reniecValidado}
                  className={`bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 flex-1 ${
                    reniecValidado ? 'opacity-60 cursor-not-allowed' : ''
                  }`}
                />
                {reniecValidado ? (
                  <Button
                    type="button"
                    onClick={handleClearReniec}
                    className="shrink-0 bg-red-600 hover:bg-red-500 text-white"
                  >
                    <XCircle className="size-4" />
                  </Button>
                ) : (
                  <Button
                    type="button"
                    onClick={handleValidarReniec}
                    disabled={loading || validating || formData.dni.length !== 8}
                    className="shrink-0 bg-blue-600 hover:bg-blue-500 text-white disabled:opacity-40"
                  >
                    {validating ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      'Validar'
                    )}
                  </Button>
                )}
              </div>
            </div>

            {/* Nombre y Apellido — bloqueados tras validación RENIEC */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="nombre" className="text-sm text-zinc-300">Nombre *</label>
                <Input
                  id="nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  placeholder={reniecValidado ? '' : 'Valida tu DNI'}
                  required
                  disabled={reniecValidado}
                  className={`bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 ${
                    reniecValidado ? 'opacity-60 cursor-not-allowed' : ''
                  }`}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="apellido" className="text-sm text-zinc-300">Apellido *</label>
                <Input
                  id="apellido"
                  name="apellido"
                  value={formData.apellido}
                  onChange={handleChange}
                  placeholder={reniecValidado ? '' : 'Valida tu DNI'}
                  required
                  disabled={reniecValidado}
                  className={`bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 ${
                    reniecValidado ? 'opacity-60 cursor-not-allowed' : ''
                  }`}
                />
              </div>
            </div>

            {/* Email */}
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

            {/* Teléfono */}
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

            {/* Fecha de nacimiento */}
            <div className="space-y-2">
              <label htmlFor="fecha_nacimiento" className="text-sm text-zinc-300">
                Fecha de Nacimiento *
              </label>
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

            {/* Sexo */}
            <div className="space-y-2">
              <label htmlFor="genero" className="text-sm text-zinc-300">Sexo *</label>
              <Select
                value={formData.genero}
                onValueChange={(value) => setFormData(prev => ({ ...prev, genero: value }))}
              >
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

            {/* Contraseña */}
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm text-zinc-300">Contraseña *</label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Mínimo 8 caracteres, no solo números"
                  required
                  className={`bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 pr-10 ${
                    passwordError ? 'border-red-500' : ''
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-200 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
              {passwordError && (
                <p className="flex items-center gap-1 text-xs text-red-400">
                  <XCircle className="size-3 shrink-0" /> {passwordError}
                </p>
              )}
            </div>

            {/* Confirmar contraseña */}
            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="text-sm text-zinc-300">
                Confirmar Contraseña *
              </label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  className={`bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 pr-10 ${
                    formData.confirmPassword && formData.password !== formData.confirmPassword
                      ? 'border-red-500'
                      : ''
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-200 transition-colors"
                  tabIndex={-1}
                >
                  {showConfirmPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
              {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                <p className="flex items-center gap-1 text-xs text-red-400">
                  <XCircle className="size-3 shrink-0" /> Las contraseñas no coinciden
                </p>
              )}
            </div>

            {/* Términos y Condiciones */}
            <div className="flex items-start gap-3 pt-2">
              <Checkbox
                id="terminos"
                checked={formData.aceptaTerminos}
                onCheckedChange={(checked) =>
                  setFormData(prev => ({ ...prev, aceptaTerminos: checked === true }))
                }
                className="mt-0.5 border-zinc-600 data-[state=checked]:bg-yellow-400 data-[state=checked]:border-yellow-400"
              />
              <label htmlFor="terminos" className="text-sm text-zinc-400 leading-snug cursor-pointer">
                Acepto los{' '}
                <a
                  href="/terminos-y-condiciones"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-yellow-400 hover:underline"
                >
                  Términos y Condiciones
                </a>
              </label>
            </div>

            {/* Hint de condiciones pendientes */}
            {!allConditionsMet && (
              <p className="text-xs text-zinc-500">
                Para activar el registro: valida tu DNI con RENIEC, completa todos los campos, asegúrate de que las contraseñas coincidan y acepta los Términos y Condiciones.
              </p>
            )}

            <Button
              type="submit"
              disabled={loading || !allConditionsMet}
              title={!allConditionsMet ? 'Completa todos los campos, valida tu DNI y acepta los Términos' : ''}
              className="w-full bg-yellow-400 text-zinc-950 hover:bg-yellow-300 disabled:opacity-40 disabled:cursor-not-allowed"
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
