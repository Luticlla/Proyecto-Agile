'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Loader2, XCircle, Plus, X } from 'lucide-react'
import { toast } from 'sonner'
import type { CrearPlanPayload, ActualizarPlanPayload, PlanAdmin } from '@/lib/supabase/queries/planes.types'

interface FormularioPlanProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  plan?: PlanAdmin | null
}

const DEFAULT_VALUES: CrearPlanPayload = {
  nombre: '',
  descripcion: '',
  precio: 0,
  duracion_dias: 30,
  activo: true,
  features: [],
}

export function FormularioPlan({ isOpen, onClose, onSuccess, plan }: FormularioPlanProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<CrearPlanPayload>(DEFAULT_VALUES)
  const [newFeature, setNewFeature] = useState('')

  const isEditing = !!plan

  useEffect(() => {
    if (plan) {
      setFormData({
        nombre: plan.nombre,
        descripcion: plan.descripcion || '',
        precio: plan.precio,
        duracion_dias: plan.duracion_dias,
        activo: plan.activo,
        features: plan.features || [],
      })
    } else {
      setFormData(DEFAULT_VALUES)
    }
    setError(null)
    setNewFeature('')
  }, [plan, isOpen])

  const handleChange = (field: keyof CrearPlanPayload, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleAddFeature = () => {
    if (!newFeature.trim()) return
    if (formData.features?.includes(newFeature.trim())) {
      setError('Esta feature ya existe')
      return
    }
    setFormData(prev => ({
      ...prev,
      features: [...(prev.features || []), newFeature.trim()]
    }))
    setNewFeature('')
  }

  const handleRemoveFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features?.filter((_, i) => i !== index) || []
    }))
  }

  const handleKeyDownFeature = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddFeature()
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!formData.nombre.trim()) {
      setError('El nombre es requerido')
      return
    }
    if (formData.precio <= 0) {
      setError('El precio debe ser mayor a 0')
      return
    }
    if (formData.duracion_dias <= 0) {
      setError('La duración debe ser mayor a 0 días')
      return
    }

    setLoading(true)
    try {
      const url = isEditing ? `/api/planes/${plan.id}` : '/api/planes'
      const method = isEditing ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || `Error al ${isEditing ? 'actualizar' : 'crear'} el plan`)
      }

      toast.success(`Plan ${isEditing ? 'actualizado' : 'creado'} exitosamente`)
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
    setNewFeature('')
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="bg-zinc-900 border-zinc-800 text-white sm:max-w-[540px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Editar Plan' : 'Crear Nuevo Plan'}</DialogTitle>
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
              placeholder="Nombre del plan"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300">Descripción</label>
            <Input
              value={formData.descripcion || ''}
              onChange={(e) => handleChange('descripcion', e.target.value)}
              className="bg-zinc-950 border-zinc-800"
              disabled={loading}
              placeholder="Descripción breve del plan"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">Precio (S/) *</label>
              <Input
                type="number"
                step="0.01"
                min="0.01"
                value={formData.precio || ''}
                onChange={(e) => {
                  const val = e.target.value
                  handleChange('precio', val === '' ? 0 : parseFloat(val))
                }}
                className="bg-zinc-950 border-zinc-800 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                disabled={loading}
                placeholder="Ej: 89.90"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">Duración (días) *</label>
              <Input
                type="number"
                min="1"
                value={formData.duracion_dias}
                onChange={(e) => handleChange('duracion_dias', parseInt(e.target.value) || 30)}
                className="bg-zinc-950 border-zinc-800 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                disabled={loading}
                placeholder="30"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300">Features / Beneficios</label>
            <div className="flex gap-2">
              <Input
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                onKeyDown={handleKeyDownFeature}
                className="bg-zinc-950 border-zinc-800 flex-1"
                disabled={loading}
                placeholder="Agregar feature..."
              />
              <Button
                type="button"
                variant="outline"
                onClick={handleAddFeature}
                disabled={loading || !newFeature.trim()}
                className="bg-transparent border-zinc-700 text-white hover:bg-zinc-800"
              >
                <Plus className="size-4" />
              </Button>
            </div>
            {formData.features && formData.features.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.features.map((feature, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-zinc-800 text-zinc-300 rounded-md"
                  >
                    {feature}
                    <button
                      type="button"
                      onClick={() => handleRemoveFeature(index)}
                      className="text-zinc-500 hover:text-red-400"
                      disabled={loading}
                    >
                      <X className="size-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="activo"
              checked={formData.activo}
              onChange={(e) => handleChange('activo', e.target.checked)}
              disabled={loading}
              className="rounded border-zinc-700 bg-zinc-950"
            />
            <label htmlFor="activo" className="text-sm font-medium text-zinc-300">
              Plan activo (visible en la página pública)
            </label>
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
              {isEditing ? 'Guardar Cambios' : 'Crear Plan'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
