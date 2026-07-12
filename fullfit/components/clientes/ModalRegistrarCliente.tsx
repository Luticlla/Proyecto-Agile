'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Loader2, ShieldCheck, CheckCircle2, XCircle, UserPlus2
} from 'lucide-react'
import { toast } from 'sonner'

// ─── Validaciones ─────────────────────────────────────────────────────────────
const validateEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).toLowerCase())

function validatePassword(password: string): string | null {
  if (!password) return null
  if (password.length < 8) return 'La contraseña debe tener al menos 8 caracteres'
  if (/^\d+$/.test(password)) return 'La contraseña no puede contener solo números'
  return null
}

interface ModalRegistrarClienteProps {
  open: boolean
  onClose: () => void
  onSuccess: () => void
}

export function ModalRegistrarCliente({ open, onClose, onSuccess }: ModalRegistrarClienteProps) {
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
  const [success, setSuccess] = useState(false)
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [validating, setValidating] = useState(false)
  const [reniecValidado, setReniecValidado] = useState(false)

  const resetForm = () => {
    setFormData({
      nombre: '', apellido: '', dni: '', email: '', telefono: '',
      fecha_nacimiento: '', genero: '', password: '', confirmPassword: '',
      aceptaTerminos: false,
    })
    setError('')
    setSuccess(false)
    setPasswordError(null)
    setReniecValidado(false)
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  // ─── Handlers ──────────────────────────────────────────────────────────────
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    if (reniecValidado && (name === 'nombre' || name === 'apellido')) return

    if (name === 'nombre' || name === 'apellido') {
      setFormData(prev => ({ ...prev, [name]: value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]/g, '') }))
      return
    }

    if (name === 'dni') {
      const digits = value.replace(/\D/g, '').slice(0, 8)
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

    if (name === 'password') setPasswordError(validatePassword(value))

    setFormData(prev => ({ ...prev, [name]: value }))
  }

  // ─── Validar DNI con RENIEC ────────────────────────────────────────────────
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
      setFormData(prev => ({ ...prev, nombre: data.nombre, apellido: data.apellido, dni: data.dni }))
      setReniecValidado(true)
    } catch {
      setError('No se pudo conectar con RENIEC. Intenta más tarde.')
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

  const getMaxBirthDate = () => {
    const d = new Date(); d.setFullYear(d.getFullYear() - 18); return d.toISOString().split('T')[0]
  }
  const getMinBirthDate = () => {
    const d = new Date(); d.setFullYear(d.getFullYear() - 100); return d.toISOString().split('T')[0]
  }

  const allConditionsMet =
    reniecValidado &&
    validateEmail(formData.email) &&
    formData.password !== '' &&
    passwordError === null &&
    formData.password === formData.confirmPassword &&
    formData.fecha_nacimiento !== '' &&
    formData.genero !== '' &&
    formData.aceptaTerminos

  // ─── Submit ────────────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!reniecValidado) { setError('Debes validar el DNI con RENIEC'); return }
    if (!validateEmail(formData.email)) { setError('El correo no es válido'); return }
    if (!formData.fecha_nacimiento) { setError('La fecha de nacimiento es obligatoria'); return }

    const birthDate = new Date(formData.fecha_nacimiento + 'T00:00:00')
    const today = new Date()
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) age--
    if (age < 18) { setError('El cliente debe ser mayor de 18 años'); return }

    if (!formData.genero) { setError('Selecciona el sexo'); return }

    if (formData.telefono && !/^9\d{8}$/.test(formData.telefono)) {
      setError('El teléfono debe tener 9 dígitos y comenzar con 9'); return
    }

    const pwdErr = validatePassword(formData.password)
    if (pwdErr) { setPasswordError(pwdErr); return }

    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden'); return
    }

    if (!formData.aceptaTerminos) { setError('Debes aceptar los Términos y Condiciones'); return }

    setLoading(true)
    try {
      const res = await fetch('/api/auth/register-cliente', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          metadata: {
            nombre: formData.nombre,
            apellido: formData.apellido,
            telefono: formData.telefono || undefined,
            dni: formData.dni,
            fecha_nacimiento: formData.fecha_nacimiento,
            genero: formData.genero === 'prefiero no decirlo' ? null : formData.genero,
          },
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        if (data.error?.includes('DNI ya está registrado')) {
          toast.error('Este DNI ya está registrado en el sistema', {
            description: 'Verifica el número e intenta con otro DNI'
          })
        }
        setError(data.error || 'Error al registrar el cliente')
      } else {
        setSuccess(true)
        setTimeout(() => {
          resetForm()
          onSuccess()
          onClose()
        }, 1500)
      }
    } catch {
      setError('Error de red. Intenta nuevamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) handleClose() }}>
      <DialogContent className="bg-zinc-900 border-zinc-800 max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <UserPlus2 className="size-5 text-yellow-400" />
            Registrar Nuevo Cliente
          </DialogTitle>
        </DialogHeader>

        {success ? (
          <div className="flex flex-col items-center gap-3 py-8">
            <CheckCircle2 className="size-12 text-green-400" />
            <p className="text-green-400 font-medium">¡Cliente registrado exitosamente!</p>
            <p className="text-zinc-400 text-sm text-center">
              El cliente puede iniciar sesión inmediatamente con sus credenciales.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Error general */}
            {error && (
              <div className="flex items-start gap-2 p-3 text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded">
                <XCircle className="size-4 shrink-0 mt-0.5" />
                {error}
              </div>
            )}

            {/* DNI + Validar */}
            <div className="space-y-2">
              <label className="text-sm text-zinc-300">
                DNI *{' '}
                {reniecValidado && (
                  <span className="inline-flex items-center gap-1 text-emerald-400 text-xs ml-1">
                    <CheckCircle2 className="size-3" /> Validado con RENIEC
                  </span>
                )}
              </label>
              <div className="flex gap-2">
                <Input
                  name="dni"
                  value={formData.dni}
                  onChange={handleChange}
                  placeholder="12345678"
                  required
                  maxLength={8}
                  inputMode="numeric"
                  disabled={validating || reniecValidado}
                  className={`bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 flex-1 ${reniecValidado ? 'opacity-60 cursor-not-allowed' : ''}`}
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
                    {validating ? <Loader2 className="size-4 animate-spin" /> : 'Validar'}
                  </Button>
                )}
              </div>
            </div>

            {/* Nombre y Apellido */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm text-zinc-300">Nombre *</label>
                <Input
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  placeholder={reniecValidado ? '' : 'Valida tu DNI'}
                  required
                  disabled={reniecValidado}
                  className={`bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 ${reniecValidado ? 'opacity-60 cursor-not-allowed' : ''}`}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-zinc-300">Apellido *</label>
                <Input
                  name="apellido"
                  value={formData.apellido}
                  onChange={handleChange}
                  placeholder={reniecValidado ? '' : 'Valida tu DNI'}
                  required
                  disabled={reniecValidado}
                  className={`bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 ${reniecValidado ? 'opacity-60 cursor-not-allowed' : ''}`}
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-sm text-zinc-300">Email *</label>
              <Input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="cliente@email.com"
                required
                className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
              />
            </div>

            {/* Teléfono */}
            <div className="space-y-2">
              <label className="text-sm text-zinc-300">Teléfono (opcional)</label>
              <div className="flex">
                <span className="flex items-center px-3 bg-zinc-700 border border-zinc-600 border-r-0 rounded-l-md text-sm text-zinc-300 select-none">+51</span>
                <Input
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
              <label className="text-sm text-zinc-300">Fecha de Nacimiento *</label>
              <Input
                name="fecha_nacimiento"
                type="date"
                value={formData.fecha_nacimiento}
                onChange={handleChange}
                required
                max={getMaxBirthDate()}
                min={getMinBirthDate()}
                className="bg-zinc-800 border-zinc-700 text-white"
              />
            </div>

            {/* Sexo */}
            <div className="space-y-2">
              <label className="text-sm text-zinc-300">Sexo *</label>
              <Select value={formData.genero} onValueChange={(value) => setFormData(prev => ({ ...prev, genero: value }))}>
                <SelectTrigger className="w-full bg-zinc-800 border-zinc-700 text-white">
                  <SelectValue placeholder="Selecciona el sexo" />
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
              <label className="text-sm text-zinc-300">Contraseña *</label>
              <Input
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Mínimo 8 caracteres, no solo números"
                required
                className={`bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 ${passwordError ? 'border-red-500' : ''}`}
              />
              {passwordError && (
                <p className="flex items-center gap-1 text-xs text-red-400">
                  <XCircle className="size-3 shrink-0" /> {passwordError}
                </p>
              )}
            </div>

            {/* Confirmar contraseña */}
            <div className="space-y-2">
              <label className="text-sm text-zinc-300">Confirmar Contraseña *</label>
              <Input
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className={`bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 ${formData.confirmPassword && formData.password !== formData.confirmPassword ? 'border-red-500' : ''}`}
              />
              {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                <p className="flex items-center gap-1 text-xs text-red-400">
                  <XCircle className="size-3 shrink-0" /> Las contraseñas no coinciden
                </p>
              )}
            </div>

            {/* Términos */}
            <div className="flex items-start gap-3 pt-1">
              <Checkbox
                id="terminos-modal"
                checked={formData.aceptaTerminos}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, aceptaTerminos: checked === true }))}
                className="mt-0.5 border-zinc-600 data-[state=checked]:bg-yellow-400 data-[state=checked]:border-yellow-400"
              />
              <label htmlFor="terminos-modal" className="text-sm text-zinc-400 leading-snug cursor-pointer">
                Acepto los{' '}
                <a href="/terminos-y-condiciones" target="_blank" rel="noopener noreferrer" className="text-yellow-400 hover:underline">
                  Términos y Condiciones
                </a>
              </label>
            </div>

            {!allConditionsMet && (
              <p className="text-xs text-zinc-500">
                Valida el DNI con RENIEC, completa todos los campos y acepta los Términos para continuar.
              </p>
            )}

            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="flex-1 border-zinc-700 text-zinc-300 hover:bg-zinc-800"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={loading || !allConditionsMet}
                className="flex-1 bg-yellow-400 text-zinc-950 hover:bg-yellow-300 disabled:opacity-40"
              >
                {loading ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Registrando...</>
                ) : (
                  'Registrar Cliente'
                )}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
