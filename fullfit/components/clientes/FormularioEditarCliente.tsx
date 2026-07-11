'use client'

import { useState } from 'react'
import type { ProfileWithEmail } from '@/lib/supabase/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Loader2, Save, X, ShieldCheck, CheckCircle2, XCircle } from 'lucide-react'

type FormularioEditarClienteProps = {
  cliente: ProfileWithEmail
  onSave: (cliente: ProfileWithEmail) => void
  onCancel: () => void
}

export function FormularioEditarCliente({ cliente, onSave, onCancel }: FormularioEditarClienteProps) {
  const [nombre, setNombre] = useState(cliente.nombre || '')
  const [apellido, setApellido] = useState(cliente.apellido || '')
  const [email, setEmail] = useState(cliente.email || '')
  const [telefono, setTelefono] = useState(cliente.telefono || '')
  const [dni, setDni] = useState(cliente.dni || '')
  const [reniecValidado, setReniecValidado] = useState(false)
  const [validating, setValidating] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleTelefonoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cleaned = e.target.value.replace(/\D/g, '').slice(0, 9)
    if (cleaned.length > 0 && cleaned[0] !== '9') return
    setTelefono(cleaned)
  }

  const handleDniChange = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 8)
    if (reniecValidado) {
      setReniecValidado(false)
      setNombre('')
      setApellido('')
      setDni(digits)
    } else {
      setDni(digits)
    }
    setError(null)
  }

  const handleValidarReniec = async () => {
    setError(null)
    if (dni.length !== 8) {
      setError('Ingresa los 8 dígitos del DNI antes de validar')
      return
    }
    setValidating(true)
    try {
      const res = await fetch(`/api/reniec?dni=${dni}`)
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Error al consultar RENIEC')
        return
      }

      setDni(data.dni)
      setNombre(data.nombre)
      setApellido(data.apellido)
      setReniecValidado(true)
    } catch {
      setError('No se pudo conectar con el servicio RENIEC. Intenta más tarde.')
    } finally {
      setValidating(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!email) {
      setError('El email es requerido')
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('El email no es válido')
      return
    }

    if (telefono && !/^9\d{8}$/.test(telefono)) {
      setError('El teléfono debe tener 9 dígitos y comenzar con 9')
      return
    }

    if (dni && !/^\d{8}$/.test(dni)) {
      setError('El DNI debe tener exactamente 8 dígitos')
      return
    }

    if (dni && !reniecValidado) {
      setError('Debes validar el DNI con RENIEC antes de guardar')
      return
    }

    if (!nombre || !apellido) {
      setError('Nombre y apellido son requeridos')
      return
    }

    setLoading(true)

    try {
      // Verificar email duplicado si cambió
      if (email.toLowerCase().trim() !== (cliente.email || '').toLowerCase()) {
        const checkRes = await fetch(`/api/clientes/check-email?email=${encodeURIComponent(email)}&excludeId=${cliente.id}`)
        const checkData = await checkRes.json()

        if (checkData.exists) {
          setError('Este correo ya está registrado en el sistema')
          setLoading(false)
          return
        }
      }

      const response = await fetch(`/api/clientes/${cliente.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, telefono, dni, nombre, apellido, reniecValidado })
      })

      if (response.ok) {
        onSave({ ...cliente, email, telefono, dni, nombre, apellido })
      } else {
        const data = await response.json()
        setError(data.error || 'Error al actualizar el cliente')
      }
    } catch {
      setError('Error al conectar con el servidor')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardHeader>
        <CardTitle className="text-lg text-white">Editar Cliente</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="flex items-start gap-2 p-3 text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded">
              <XCircle className="size-4 shrink-0 mt-0.5" />
              {error}
            </div>
          )}

          {/* DNI + botón Validar */}
          <div className="space-y-2">
            <Label htmlFor="dni" className="text-zinc-300">
              DNI
              {reniecValidado && (
                <span className="inline-flex items-center gap-1 text-emerald-400 text-xs ml-2">
                  <CheckCircle2 className="size-3" /> Validado con RENIEC
                </span>
              )}
            </Label>
            <div className="flex gap-2">
              <Input
                id="dni"
                name="dni"
                value={dni}
                onChange={(e) => handleDniChange(e.target.value)}
                maxLength={8}
                inputMode="numeric"
                placeholder="12345678"
                className={`bg-zinc-800 border-zinc-700 text-white flex-1 ${reniecValidado ? 'opacity-60 cursor-not-allowed' : ''}`}
                disabled={loading || validating || reniecValidado}
              />
              <Button
                type="button"
                onClick={handleValidarReniec}
                disabled={loading || validating || reniecValidado || dni.length !== 8}
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
              <Label htmlFor="nombre" className="text-zinc-300">Nombre *</Label>
              <Input
                id="nombre"
                name="nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                disabled={reniecValidado}
                placeholder={reniecValidado ? '' : 'Valida el DNI primero'}
                className={`bg-zinc-800 border-zinc-700 text-white ${reniecValidado ? 'opacity-60 cursor-not-allowed' : ''}`}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="apellido" className="text-zinc-300">Apellido *</Label>
              <Input
                id="apellido"
                name="apellido"
                value={apellido}
                onChange={(e) => setApellido(e.target.value)}
                disabled={reniecValidado}
                placeholder={reniecValidado ? '' : 'Valida el DNI primero'}
                className={`bg-zinc-800 border-zinc-700 text-white ${reniecValidado ? 'opacity-60 cursor-not-allowed' : ''}`}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-zinc-300">Email *</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-zinc-800 border-zinc-700 text-white"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="telefono" className="text-zinc-300">Teléfono</Label>
            <div className="flex">
              <span className="flex items-center px-3 bg-zinc-700 border border-zinc-600 border-r-0 rounded-l-md text-sm text-zinc-300 select-none">
                +51
              </span>
              <Input
                id="telefono"
                name="telefono"
                type="tel"
                value={telefono}
                onChange={handleTelefonoChange}
                placeholder="999 999 999"
                inputMode="numeric"
                maxLength={9}
                className="bg-zinc-800 border-zinc-700 text-white rounded-l-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={loading}
              className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
            >
              <X className="size-4 mr-2" />
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-yellow-400 text-zinc-950 hover:bg-yellow-300"
            >
              {loading ? (
                <Loader2 className="size-4 mr-2 animate-spin" />
              ) : (
                <Save className="size-4 mr-2" />
              )}
              Guardar Cambios
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
