'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2, Save } from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

interface ConfiguracionGymProps {
  sede: any
}

export default function ConfiguracionGym({ sede }: ConfiguracionGymProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    apertura_lv: sede.apertura_lv || '06:00',
    cierre_lv: sede.cierre_lv || '22:00',
    apertura_sab: sede.apertura_sab || '07:00',
    cierre_sab: sede.cierre_sab || '22:00',
    apertura_dom: sede.apertura_dom || '',
    cierre_dom: sede.cierre_dom || ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    // Si el usuario borra la hora y es fin de semana (domingo), se guarda como null
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  function timeToMinutes(time: string): number {
    const [h, m] = time.split(':').map(Number)
    return h * 60 + m
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validar que cada bloque tenga al menos 1 hora de diferencia
    const lvDiff = timeToMinutes(formData.cierre_lv) - timeToMinutes(formData.apertura_lv)
    if (lvDiff < 60) {
      toast.error('El horario de Lunes a Viernes debe tener al menos 1 hora de diferencia entre apertura y cierre')
      return
    }

    const sabDiff = timeToMinutes(formData.cierre_sab) - timeToMinutes(formData.apertura_sab)
    if (sabDiff < 60) {
      toast.error('El horario de Sábados debe tener al menos 1 hora de diferencia entre apertura y cierre')
      return
    }

    if (formData.apertura_dom && formData.cierre_dom) {
      const domDiff = timeToMinutes(formData.cierre_dom) - timeToMinutes(formData.apertura_dom)
      if (domDiff < 60) {
        toast.error('El horario de Domingos debe tener al menos 1 hora de diferencia entre apertura y cierre')
        return
      }
    }

    setLoading(true)

    try {
      const payload = {
        id: sede.id,
        ...formData
      }
      
      // Convertir strings vacíos a null para BD si es necesario
      if (!payload.apertura_dom) payload.apertura_dom = null
      if (!payload.cierre_dom) payload.cierre_dom = null

      const res = await fetch('/api/gerente/sedes/horarios', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (!res.ok) throw new Error('Error al actualizar')

      toast.success('Horarios actualizados', {
        description: 'El horario general de la sede ha sido guardado.',
      })
      router.refresh()
    } catch (error) {
      toast.error('No se pudieron guardar los horarios.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 max-w-2xl">
      <h2 className="text-xl font-bold text-white mb-6">Horario de Atención</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Lunes a Viernes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center p-4 bg-zinc-950 rounded-md border border-zinc-800">
          <Label className="text-zinc-300 font-semibold md:col-span-1 text-base">Lunes a Viernes</Label>
          <div className="flex items-center gap-2 md:col-span-2">
            <div className="flex-1 space-y-1">
              <Label className="text-xs text-zinc-500">Apertura</Label>
              <Input 
                type="time" 
                name="apertura_lv" 
                value={formData.apertura_lv} 
                onChange={handleChange}
                required
                className="bg-zinc-900 border-zinc-700 text-zinc-200"
              />
            </div>
            <span className="text-zinc-500 mt-5">-</span>
            <div className="flex-1 space-y-1">
              <Label className="text-xs text-zinc-500">Cierre</Label>
              <Input 
                type="time" 
                name="cierre_lv" 
                value={formData.cierre_lv} 
                onChange={handleChange}
                required
                className="bg-zinc-900 border-zinc-700 text-zinc-200"
              />
            </div>
          </div>
        </div>

        {/* Sábado */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center p-4 bg-zinc-950 rounded-md border border-zinc-800">
          <Label className="text-zinc-300 font-semibold md:col-span-1 text-base">Sábados</Label>
          <div className="flex items-center gap-2 md:col-span-2">
            <div className="flex-1 space-y-1">
              <Label className="text-xs text-zinc-500">Apertura</Label>
              <Input 
                type="time" 
                name="apertura_sab" 
                value={formData.apertura_sab} 
                onChange={handleChange}
                required
                className="bg-zinc-900 border-zinc-700 text-zinc-200"
              />
            </div>
            <span className="text-zinc-500 mt-5">-</span>
            <div className="flex-1 space-y-1">
              <Label className="text-xs text-zinc-500">Cierre</Label>
              <Input 
                type="time" 
                name="cierre_sab" 
                value={formData.cierre_sab} 
                onChange={handleChange}
                required
                className="bg-zinc-900 border-zinc-700 text-zinc-200"
              />
            </div>
          </div>
        </div>

        {/* Domingo */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center p-4 bg-zinc-950 rounded-md border border-zinc-800">
          <div className="md:col-span-1 space-y-1">
            <Label className="text-zinc-300 font-semibold text-base">Domingos</Label>
            <p className="text-xs text-zinc-500">Dejar vacío si está cerrado</p>
          </div>
          <div className="flex items-center gap-2 md:col-span-2">
            <div className="flex-1 space-y-1">
              <Label className="text-xs text-zinc-500">Apertura</Label>
              <Input 
                type="time" 
                name="apertura_dom" 
                value={formData.apertura_dom} 
                onChange={handleChange}
                className="bg-zinc-900 border-zinc-700 text-zinc-200"
              />
            </div>
            <span className="text-zinc-500 mt-5">-</span>
            <div className="flex-1 space-y-1">
              <Label className="text-xs text-zinc-500">Cierre</Label>
              <Input 
                type="time" 
                name="cierre_dom" 
                value={formData.cierre_dom} 
                onChange={handleChange}
                className="bg-zinc-900 border-zinc-700 text-zinc-200"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <Button 
            type="submit" 
            disabled={loading}
            className="bg-yellow-500 text-zinc-950 hover:bg-yellow-400"
          >
            {loading ? <Loader2 className="size-4 animate-spin mr-2" /> : <Save className="size-4 mr-2" />}
            Guardar Cambios
          </Button>
        </div>
      </form>
    </div>
  )
}
