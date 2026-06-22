'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Loader2 } from 'lucide-react'
import type { CrearUsuarioPayload } from '@/lib/supabase/queries/usuarios.types'

interface FormularioCrearUsuarioProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function FormularioCrearUsuario({ isOpen, onClose, onSuccess }: FormularioCrearUsuarioProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [formData, setFormData] = useState<CrearUsuarioPayload>({
    nombre: '',
    apellido: '',
    dni: '',
    telefono: '',
    email: '',
    password: '',
    rol_id: 2 // Default to Recepcionista
  })

  const handleChange = (field: keyof CrearUsuarioPayload, value: any) => {
    if (field === 'nombre' || field === 'apellido') {
      value = (value as string).replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]/g, '')
    }
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    
    if (!formData.nombre || !formData.apellido || !formData.dni || !formData.email) {
      setError('Por favor completa todos los campos requeridos (*)')
      return
    }

    if (formData.dni.length !== 8) {
      setError('El DNI debe tener 8 dígitos')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/usuarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          password: formData.password || undefined // Only send if not empty
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Error al crear el usuario')
      }

      onSuccess()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !loading && !open && onClose()}>
      <DialogContent className="bg-zinc-900 border-zinc-800 text-white sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Crear Usuario de Sistema</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {error && (
            <div className="p-3 text-sm bg-red-500/10 border border-red-500/20 text-red-400 rounded-md">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">Nombre *</label>
              <Input
                value={formData.nombre}
                onChange={(e) => handleChange('nombre', e.target.value)}
                className="bg-zinc-950 border-zinc-800"
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">Apellido *</label>
              <Input
                value={formData.apellido}
                onChange={(e) => handleChange('apellido', e.target.value)}
                className="bg-zinc-950 border-zinc-800"
                disabled={loading}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">DNI *</label>
              <Input
                value={formData.dni}
                onChange={(e) => handleChange('dni', e.target.value)}
                maxLength={8}
                className="bg-zinc-950 border-zinc-800"
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">Teléfono</label>
              <Input
                value={formData.telefono}
                onChange={(e) => handleChange('telefono', e.target.value)}
                className="bg-zinc-950 border-zinc-800"
                disabled={loading}
              />
            </div>
          </div>

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

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300">Contraseña</label>
            <Input
              type="password"
              value={formData.password}
              onChange={(e) => handleChange('password', e.target.value)}
              placeholder="Dejar en blanco para auto-generar"
              className="bg-zinc-950 border-zinc-800"
              disabled={loading}
            />
          </div>

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

          <div className="flex justify-end gap-3 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
              className="bg-transparent border-zinc-700 text-white hover:bg-zinc-800"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-yellow-500 text-zinc-950 hover:bg-yellow-400"
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
