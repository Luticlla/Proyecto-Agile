'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Loader2, XCircle } from 'lucide-react'
import { toast } from 'sonner'
import { UploadImagenSede } from './UploadImagenSede'
import type { CrearSedePayload, ActualizarSedePayload, SedeAdmin } from '@/lib/supabase/queries/sedes.types'

interface FormularioSedeProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  sede?: SedeAdmin | null
}

const DEFAULT_VALUES: CrearSedePayload = {
  nombre: '',
  direccion: '',
  telefono: '',
  email: '',
  imagen_url: null,
  latitud: null,
  longitud: null,
  apertura_lv: '06:00',
  cierre_lv: '22:00',
  apertura_sab: '07:00',
  cierre_sab: '22:00',
  apertura_dom: null,
  cierre_dom: null,
}

export function FormularioSede({ isOpen, onClose, onSuccess, sede }: FormularioSedeProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<CrearSedePayload>(DEFAULT_VALUES)

  const isEditing = !!sede

  useEffect(() => {
    if (sede) {
      setFormData({
        nombre: sede.nombre,
        direccion: sede.direccion,
        telefono: sede.telefono,
        email: sede.email,
        imagen_url: sede.imagen_url,
        latitud: sede.latitud,
        longitud: sede.longitud,
        apertura_lv: sede.apertura_lv,
        cierre_lv: sede.cierre_lv,
        apertura_sab: sede.apertura_sab,
        cierre_sab: sede.cierre_sab,
        apertura_dom: sede.apertura_dom,
        cierre_dom: sede.cierre_dom,
      })
    } else {
      setFormData(DEFAULT_VALUES)
    }
    setError(null)
  }, [sede, isOpen])

  const handleChange = (field: keyof CrearSedePayload, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const validateHorarios = (): boolean => {
    if (formData.apertura_lv && formData.cierre_lv && formData.apertura_lv >= formData.cierre_lv) {
      setError('El horario de apertura de lunes a viernes debe ser anterior al de cierre')
      return false
    }
    if (formData.apertura_sab && formData.cierre_sab && formData.apertura_sab >= formData.cierre_sab) {
      setError('El horario de apertura del sábado debe ser anterior al de cierre')
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!formData.nombre.trim()) {
      setError('El nombre es requerido')
      return
    }
    if (!formData.direccion.trim()) {
      setError('La dirección es requerida')
      return
    }
    if (!formData.telefono.trim()) {
      setError('El teléfono es requerido')
      return
    }
    if (!formData.email.trim()) {
      setError('El email es requerido')
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setError('El email no tiene un formato válido')
      return
    }

    if (!validateHorarios()) return

    if (formData.latitud !== null && formData.latitud !== undefined) {
      if (formData.latitud < -90 || formData.latitud > 90) {
        setError('La latitud debe estar entre -90 y 90')
        return
      }
    }
    if (formData.longitud !== null && formData.longitud !== undefined) {
      if (formData.longitud < -180 || formData.longitud > 180) {
        setError('La longitud debe estar entre -180 y 180')
        return
      }
    }

    setLoading(true)
    try {
      const url = isEditing ? `/api/sedes/${sede.id}` : '/api/sedes'
      const method = isEditing ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || `Error al ${isEditing ? 'actualizar' : 'crear'} la sede`)
      }

      toast.success(`Sede ${isEditing ? 'actualizada' : 'creada'} exitosamente`)
      onSuccess()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    if (loading) return
    setFormData(DEFAULT_VALUES)
    setError(null)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="bg-zinc-900 border-zinc-800 text-white sm:max-w-[540px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Editar Sede' : 'Crear Nueva Sede'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {error && (
            <div className="flex items-start gap-2 p-3 text-sm bg-red-500/10 border border-red-500/20 text-red-400 rounded-md">
              <XCircle className="size-4 shrink-0 mt-0.5" />
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300">Nombre *</label>
            <Input
              value={formData.nombre}
              onChange={(e) => handleChange('nombre', e.target.value)}
              className="bg-zinc-950 border-zinc-800"
              disabled={loading}
              placeholder="Nombre de la sede"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300">Dirección *</label>
            <Input
              value={formData.direccion}
              onChange={(e) => handleChange('direccion', e.target.value)}
              className="bg-zinc-950 border-zinc-800"
              disabled={loading}
              placeholder="Dirección completa"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">Teléfono *</label>
              <Input
                value={formData.telefono}
                onChange={(e) => handleChange('telefono', e.target.value)}
                className="bg-zinc-950 border-zinc-800"
                disabled={loading}
                inputMode="tel"
                placeholder="999 999 999"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">Email *</label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className="bg-zinc-950 border-zinc-800"
                disabled={loading}
                placeholder="sede@fullfit.com"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">Horario Lunes a Viernes</label>
              <div className="flex items-center gap-2">
                <Input
                  type="time"
                  value={formData.apertura_lv}
                  onChange={(e) => handleChange('apertura_lv', e.target.value)}
                  className="bg-zinc-950 border-zinc-800 flex-1"
                  disabled={loading}
                />
                <span className="text-zinc-500">a</span>
                <Input
                  type="time"
                  value={formData.cierre_lv}
                  onChange={(e) => handleChange('cierre_lv', e.target.value)}
                  className="bg-zinc-950 border-zinc-800 flex-1"
                  disabled={loading}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">Horario Sábado</label>
              <div className="flex items-center gap-2">
                <Input
                  type="time"
                  value={formData.apertura_sab}
                  onChange={(e) => handleChange('apertura_sab', e.target.value)}
                  className="bg-zinc-950 border-zinc-800 flex-1"
                  disabled={loading}
                />
                <span className="text-zinc-500">a</span>
                <Input
                  type="time"
                  value={formData.cierre_sab}
                  onChange={(e) => handleChange('cierre_sab', e.target.value)}
                  className="bg-zinc-950 border-zinc-800 flex-1"
                  disabled={loading}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">Horario Domingo (opcional)</label>
              <div className="flex items-center gap-2">
                <Input
                  type="time"
                  value={formData.apertura_dom ?? ''}
                  onChange={(e) => handleChange('apertura_dom', e.target.value || null)}
                  className="bg-zinc-950 border-zinc-800 flex-1"
                  disabled={loading}
                  placeholder="Cerrado"
                />
                <span className="text-zinc-500">a</span>
                <Input
                  type="time"
                  value={formData.cierre_dom ?? ''}
                  onChange={(e) => handleChange('cierre_dom', e.target.value || null)}
                  className="bg-zinc-950 border-zinc-800 flex-1"
                  disabled={loading}
                  placeholder="Cerrado"
                />
              </div>
              <p className="text-xs text-zinc-500">Si se deja vacío, la sede estará cerrada los domingos</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">Latitud (opcional)</label>
              <Input
                type="number"
                step="any"
                min={-90}
                max={90}
                value={formData.latitud ?? ''}
                onChange={(e) => handleChange('latitud', e.target.value ? parseFloat(e.target.value) : null)}
                className="bg-zinc-950 border-zinc-800 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                disabled={loading}
                placeholder="-12.0464"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">Longitud (opcional)</label>
              <Input
                type="number"
                step="any"
                min={-180}
                max={180}
                value={formData.longitud ?? ''}
                onChange={(e) => handleChange('longitud', e.target.value ? parseFloat(e.target.value) : null)}
                className="bg-zinc-950 border-zinc-800 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                disabled={loading}
                placeholder="-77.0428"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300">Imagen (opcional)</label>
            <UploadImagenSede
              value={formData.imagen_url ?? null}
              onChange={(url) => handleChange('imagen_url', url)}
              disabled={loading}
            />
          </div>

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
              disabled={loading}
              className="bg-yellow-500 text-zinc-950 hover:bg-yellow-400 disabled:opacity-40"
            >
              {loading && <Loader2 className="size-4 animate-spin mr-2" />}
              {isEditing ? 'Guardar Cambios' : 'Crear Sede'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
