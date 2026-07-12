'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import type { ActualizarUsuarioPayload, UsuarioSistema } from '@/lib/supabase/queries/usuarios.types'

interface FormularioEditarUsuarioProps {
  usuario: UsuarioSistema | null
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function FormularioEditarUsuario({ usuario, isOpen, onClose, onSuccess }: FormularioEditarUsuarioProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [formData, setFormData] = useState<ActualizarUsuarioPayload & { email?: string }>({})

  useEffect(() => {
    if (usuario && isOpen) {
      setFormData({
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        dni: usuario.dni || '',
        telefono: usuario.telefono || '',
        email: usuario.email || '',
        rol_id: usuario.rol_id,
        fecha_nacimiento: (usuario as any).fecha_nacimiento || '',
        genero: (usuario as any).genero || '',
      })
      setError(null)
    }
  }, [usuario, isOpen])

  const handleChange = (field: keyof (ActualizarUsuarioPayload & { email?: string }), value: any) => {
    if (field === 'nombre' || field === 'apellido') {
      value = (value as string).replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]/g, '')
    }
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!usuario) return

    setError(null)
    
    if (!formData.nombre || !formData.apellido) {
      setError('Nombre y apellido son requeridos')
      return
    }

    if (formData.dni && formData.dni.length !== 8) {
      setError('El DNI debe tener 8 dígitos')
      return
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('El formato del correo electrónico no es válido')
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`/api/usuarios/${usuario.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Error al actualizar el usuario')
      }

      toast.success('Usuario actualizado exitosamente')
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
          <DialogTitle>Editar Usuario</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {error && (
            <div className="p-3 text-sm bg-red-500/10 border border-red-500/20 text-red-400 rounded-md">
              {error}
            </div>
          )}

          {/* Email editable */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300">Email</label>
            <Input
              type="email"
              value={formData.email || ''}
              onChange={(e) => handleChange('email', e.target.value)}
              className="bg-zinc-950 border-zinc-800"
              disabled={loading}
              placeholder="correo@ejemplo.com"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">Nombre *</label>
              <Input
                value={formData.nombre || ''}
                onChange={(e) => handleChange('nombre', e.target.value)}
                className="bg-zinc-950 border-zinc-800"
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">Apellido *</label>
              <Input
                value={formData.apellido || ''}
                onChange={(e) => handleChange('apellido', e.target.value)}
                className="bg-zinc-950 border-zinc-800"
                disabled={loading}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">DNI</label>
              <Input
                value={formData.dni || ''}
                onChange={(e) => handleChange('dni', e.target.value)}
                maxLength={8}
                className="bg-zinc-950 border-zinc-800"
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">Teléfono</label>
              <Input
                value={formData.telefono || ''}
                onChange={(e) => handleChange('telefono', e.target.value)}
                className="bg-zinc-950 border-zinc-800"
                disabled={loading}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">Fecha de Nacimiento</label>
              <Input
                type="date"
                value={formData.fecha_nacimiento || ''}
                onChange={(e) => handleChange('fecha_nacimiento', e.target.value)}
                className="bg-zinc-950 border-zinc-800"
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">Sexo</label>
              <Select
                value={formData.genero || ''}
                onValueChange={(value) => handleChange('genero', value)}
                disabled={loading}
              >
                <SelectTrigger className="bg-zinc-950 border-zinc-800">
                  <SelectValue placeholder="Selecciona sexo" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-zinc-800">
                  <SelectItem value="masculino" className="text-white hover:bg-zinc-800">Masculino</SelectItem>
                  <SelectItem value="femenino" className="text-white hover:bg-zinc-800">Femenino</SelectItem>
                  <SelectItem value="prefiero no decirlo" className="text-white hover:bg-zinc-800">Prefiero no decirlo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300">Rol *</label>
            <Select 
              value={formData.rol_id?.toString() || '2'} 
              onValueChange={(v) => handleChange('rol_id', Number(v))}
              disabled={loading}
            >
              <SelectTrigger className="bg-zinc-950 border-zinc-800">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-zinc-900 border-zinc-800">
                <SelectItem value="2" className="text-white hover:bg-zinc-800">Recepcionista</SelectItem>
                <SelectItem value="4" className="text-white hover:bg-zinc-800">Coach</SelectItem>
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
              Guardar Cambios
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
