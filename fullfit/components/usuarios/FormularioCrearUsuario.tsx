'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Loader2, ShieldCheck, CheckCircle2, XCircle } from 'lucide-react'
import { toast } from 'sonner'
import type { CrearUsuarioPayload } from '@/lib/supabase/queries/usuarios.types'

interface FormularioCrearUsuarioProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

// ─── Validación de contraseña ────────────────────────────────────────────────
function validatePassword(password: string | undefined): string | null {
  if (!password) return null // campo vacío se maneja aparte
  if (password.length < 8) return 'La contraseña debe tener al menos 8 caracteres'
  if (/^\d+$/.test(password)) return 'La contraseña no puede contener solo números'
  return null
}

export function FormularioCrearUsuario({ isOpen, onClose, onSuccess }: FormularioCrearUsuarioProps) {
  const [loading, setLoading] = useState(false)
  const [validating, setValidating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [passwordError, setPasswordError] = useState<string | null>(null)

  /** true cuando RENIEC ya devolvió datos válidos */
  const [reniecValidado, setReniecValidado] = useState(false)

  const [formData, setFormData] = useState<CrearUsuarioPayload>({
    nombre: '',
    apellido: '',
    dni: '',
    telefono: '',
    email: '',
    password: '',
    rol_id: 2, // Default: Recepcionista
  })

  // ─── Helpers ────────────────────────────────────────────────────────────────
  const handleChange = (field: keyof CrearUsuarioPayload, value: any) => {
    // Si el campo está bloqueado por RENIEC, ignorar cambios en nombre/apellido/dni
    if (reniecValidado && (field === 'nombre' || field === 'apellido' || field === 'dni')) return

    if (field === 'nombre' || field === 'apellido') {
      value = (value as string).replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]/g, '')
    }
    if (field === 'password') {
      setPasswordError(validatePassword(value as string))
    }
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  /** Cuando el DNI cambia, reseteamos la validación RENIEC */
  const handleDniChange = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 8)
    if (reniecValidado) {
      // El usuario borró/cambió el DNI → reset
      setReniecValidado(false)
      setFormData(prev => ({ ...prev, dni: digits, nombre: '', apellido: '' }))
    } else {
      setFormData(prev => ({ ...prev, dni: digits }))
    }
    setError(null)
  }

  // ─── Validar con RENIEC ──────────────────────────────────────────────────────
  const handleValidarReniec = async () => {
    setError(null)
    if (formData.dni.length !== 8) {
      setError('Ingresa los 8 dígitos del DNI antes de validar')
      return
    }
    setValidating(true)
    try {
      const res = await fetch(`/api/reniec?dni=${formData.dni}`)
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

  // ─── Condiciones para habilitar el botón Registrar ──────────────────────────
  const allConditionsMet =
    reniecValidado &&
    formData.email.trim() !== '' &&
    (formData.password ?? '').trim() !== '' &&
    passwordError === null &&
    formData.rol_id != null

  // ─── Submit ──────────────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Validar contraseña en submit
    const pwdErr = validatePassword(formData.password)
    if (pwdErr) {
      setPasswordError(pwdErr)
      return
    }

    if (!formData.email) {
      setError('El correo electrónico es requerido')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/usuarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Error al crear el usuario')
      }

      toast.success('Usuario creado exitosamente')
      onSuccess()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // ─── Reset al cerrar ─────────────────────────────────────────────────────────
  const handleClose = () => {
    if (loading) return
    setFormData({ nombre: '', apellido: '', dni: '', telefono: '', email: '', password: '', rol_id: 2 })
    setReniecValidado(false)
    setError(null)
    setPasswordError(null)
    onClose()
  }

  // ─── UI ──────────────────────────────────────────────────────────────────────
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="bg-zinc-900 border-zinc-800 text-white sm:max-w-[440px]">
        <DialogHeader>
          <DialogTitle>Crear Usuario de Sistema</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {/* Error general */}
          {error && (
            <div className="flex items-start gap-2 p-3 text-sm bg-red-500/10 border border-red-500/20 text-red-400 rounded-md">
              <XCircle className="size-4 shrink-0 mt-0.5" />
              {error}
            </div>
          )}

          {/* DNI + botón Validar */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300">
              DNI *{' '}
              {reniecValidado && (
                <span className="inline-flex items-center gap-1 text-emerald-400 text-xs ml-1">
                  <CheckCircle2 className="size-3" /> Validado con RENIEC
                </span>
              )}
            </label>
            <div className="flex gap-2">
              <Input
                value={formData.dni}
                onChange={(e) => handleDniChange(e.target.value)}
                maxLength={8}
                inputMode="numeric"
                placeholder="12345678"
                className={`bg-zinc-950 border-zinc-800 flex-1 ${reniecValidado ? 'opacity-60 cursor-not-allowed' : ''}`}
                disabled={loading || validating || reniecValidado}
              />
              <Button
                type="button"
                onClick={handleValidarReniec}
                disabled={loading || validating || reniecValidado || formData.dni.length !== 8}
                className="shrink-0 bg-blue-600 hover:bg-blue-500 text-white disabled:opacity-40"
              >
                {validating
                  ? <Loader2 className="size-4 animate-spin" />
                  : reniecValidado
                    ? <ShieldCheck className="size-4" />
                    : 'Validar'}
              </Button>
            </div>
          </div>

          {/* Nombre y Apellido — bloqueados tras validación */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">Nombre *</label>
              <Input
                value={formData.nombre}
                onChange={(e) => handleChange('nombre', e.target.value)}
                className={`bg-zinc-950 border-zinc-800 ${reniecValidado ? 'opacity-60 cursor-not-allowed' : ''}`}
                disabled={loading || reniecValidado}
                placeholder={reniecValidado ? '' : 'Valida el DNI primero'}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">Apellido *</label>
              <Input
                value={formData.apellido}
                onChange={(e) => handleChange('apellido', e.target.value)}
                className={`bg-zinc-950 border-zinc-800 ${reniecValidado ? 'opacity-60 cursor-not-allowed' : ''}`}
                disabled={loading || reniecValidado}
                placeholder={reniecValidado ? '' : 'Valida el DNI primero'}
              />
            </div>
          </div>

          {/* Teléfono (siempre editable) */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300">Teléfono</label>
            <Input
              value={formData.telefono}
              onChange={(e) => handleChange('telefono', e.target.value)}
              className="bg-zinc-950 border-zinc-800"
              disabled={loading}
              inputMode="tel"
              placeholder="999 999 999"
            />
          </div>

          {/* Email (siempre editable) */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300">Email *</label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              className="bg-zinc-950 border-zinc-800"
              disabled={loading}
            />
          </div>

          {/* Contraseña con validación en tiempo real */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300">Contraseña *</label>
            <Input
              type="password"
              value={formData.password}
              onChange={(e) => handleChange('password', e.target.value)}
              placeholder="Mínimo 8 caracteres, no solo números"
              className={`bg-zinc-950 border-zinc-800 ${passwordError ? 'border-red-500' : ''}`}
              disabled={loading}
            />
            {passwordError && (
              <p className="flex items-center gap-1 text-xs text-red-400">
                <XCircle className="size-3 shrink-0" /> {passwordError}
              </p>
            )}
          </div>

          {/* Rol */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300">Rol *</label>
            <Select
              value={formData.rol_id.toString()}
              onValueChange={(v) => handleChange('rol_id', Number(v))}
              disabled={loading}
            >
              <SelectTrigger className="bg-zinc-950 border-zinc-800">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-zinc-900 border-zinc-800">
                <SelectItem value="1" className="text-white hover:bg-zinc-800">Administrador</SelectItem>
                <SelectItem value="2" className="text-white hover:bg-zinc-800">Recepcionista</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Hint de condiciones pendientes */}
          {!allConditionsMet && (
            <p className="text-xs text-zinc-500">
              Para habilitar el registro: valida el DNI con RENIEC, completa el email, la contraseña y el rol.
            </p>
          )}

          {/* Acciones */}
          <div className="flex justify-end gap-3 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={loading}
              className="bg-transparent border-zinc-700 text-white hover:bg-zinc-800"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading || !allConditionsMet}
              title={!allConditionsMet ? 'Completa todos los campos requeridos y valida el DNI' : ''}
              className="bg-yellow-500 text-zinc-950 hover:bg-yellow-400 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {loading && <Loader2 className="size-4 animate-spin mr-2" />}
              Crear Usuario
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
