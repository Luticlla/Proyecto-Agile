'use client'

import { useState } from 'react'
import { ProfileWithEmail, ProfileUpdate } from '@/lib/supabase/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Loader2, Save, X } from 'lucide-react'
import { actualizarCliente } from '@/lib/supabase/queries/clientes'

type FormularioEditarClienteProps = {
  cliente: ProfileWithEmail
  onSave: (cliente: ProfileWithEmail) => void
  onCancel: () => void
}

export function FormularioEditarCliente({ cliente, onSave, onCancel }: FormularioEditarClienteProps) {
  const [formData, setFormData] = useState<ProfileUpdate>({
    nombre: cliente.nombre,
    apellido: cliente.apellido,
    dni: cliente.dni || '',
    telefono: cliente.telefono || '',
    fecha_nacimiento: cliente.fecha_nacimiento || '',
    genero: cliente.genero || '',
    activo: cliente.activo
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target

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

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
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

    if (!formData.nombre || !formData.apellido) {
      setError('Nombre y apellido son requeridos')
      return
    }

    if (formData.dni && !/^\d{8}$/.test(formData.dni)) {
      setError('El DNI debe tener exactamente 8 dígitos')
      return
    }

    if (formData.telefono && !/^9\d{8}$/.test(formData.telefono)) {
      setError('El teléfono debe tener 9 dígitos y comenzar con 9')
      return
    }

    setLoading(true)

    const result = await actualizarCliente(cliente.id, {
      ...formData,
      genero: formData.genero === 'prefiero no decirlo' ? null : formData.genero
    })

    if (result.success) {
      onSave({ ...cliente, ...formData, email: formData.email || cliente.email || '' })
    } else {
      setError(result.error || 'Error al actualizar el cliente')
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
            <div className="p-3 text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nombre" className="text-zinc-300">Nombre *</Label>
              <Input
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                required
                className="bg-zinc-800 border-zinc-700 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="apellido" className="text-zinc-300">Apellido *</Label>
              <Input
                id="apellido"
                name="apellido"
                value={formData.apellido}
                onChange={handleChange}
                required
                className="bg-zinc-800 border-zinc-700 text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dni" className="text-zinc-300">DNI</Label>
              <Input
                id="dni"
                name="dni"
                value={formData.dni || ''}
                onChange={handleChange}
                maxLength={8}
                pattern="[0-9]{8}"
                inputMode="numeric"
                placeholder="12345678"
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
                  value={formData.telefono || ''}
                  onChange={handleChange}
                  placeholder="999 999 999"
                  inputMode="numeric"
                  maxLength={9}
                  className="bg-zinc-800 border-zinc-700 text-white rounded-l-none"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fecha_nacimiento" className="text-zinc-300">Fecha de Nacimiento</Label>
              <Input
                id="fecha_nacimiento"
                name="fecha_nacimiento"
                type="date"
                value={formData.fecha_nacimiento || ''}
                onChange={handleChange}
                max={getMaxBirthDate()}
                min={getMinBirthDate()}
                className="bg-zinc-800 border-zinc-700 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="genero" className="text-zinc-300">Género</Label>
              <Select
                value={formData.genero || ''}
                onValueChange={(value) => setFormData(prev => ({ ...prev, genero: value }))}
              >
                <SelectTrigger className="w-full bg-zinc-800 border-zinc-700 text-white">
                  <SelectValue placeholder="Seleccionar..." />
                </SelectTrigger>
                <SelectContent className="bg-zinc-800 border-zinc-700">
                  <SelectItem value="masculino">Masculino</SelectItem>
                  <SelectItem value="femenino">Femenino</SelectItem>
                  <SelectItem value="prefiero no decirlo">Prefiero no decirlo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="activo"
              name="activo"
              checked={formData.activo}
              onChange={handleChange}
              className="size-4 rounded bg-zinc-800 border-zinc-700"
            />
            <Label htmlFor="activo" className="text-zinc-300">Cliente activo</Label>
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
