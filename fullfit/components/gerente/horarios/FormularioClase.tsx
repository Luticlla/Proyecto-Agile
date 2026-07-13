'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Loader2, Plus, Trash2, X } from 'lucide-react'
import { toast } from 'sonner'
interface FormularioClaseProps {
  claseExistente: any | null
  onClose: () => void
  onSuccess: () => void
}

const DIAS = [
  { value: 1, label: 'Lunes' },
  { value: 2, label: 'Martes' },
  { value: 3, label: 'Miércoles' },
  { value: 4, label: 'Jueves' },
  { value: 5, label: 'Viernes' },
  { value: 6, label: 'Sábado' },
  { value: 0, label: 'Domingo' },
]

export default function FormularioClase({ claseExistente, onClose, onSuccess }: FormularioClaseProps) {
  const [loading, setLoading] = useState(false)
  
  const [clase, setClase] = useState({
    nombre: claseExistente?.nombre || '',
    entrenador: claseExistente?.entrenador || '',
    descripcion: claseExistente?.descripcion || '',
    color_hex: claseExistente?.color_hex || '#facc15',
    activa: claseExistente ? claseExistente.activa : true,
    capacidad: claseExistente?.capacidad || ''
  })

  // Format existing schedules
  const [horarios, setHorarios] = useState<any[]>(
    claseExistente?.horarios?.map((h:any) => ({
      dia_semana: h.dia_semana,
      hora_inicio: h.hora_inicio.substring(0, 5),
      hora_fin: h.hora_fin.substring(0, 5)
    })) || []
  )

  const handleClaseChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    setClase(prev => ({ ...prev, [name]: val }))
  }

  const addHorario = () => {
    setHorarios(prev => [...prev, { dia_semana: 1, hora_inicio: '10:00', hora_fin: '11:00' }])
  }

  const updateHorario = (index: number, field: string, value: string | number) => {
    setHorarios(prev => {
      const newHorarios = [...prev]
      newHorarios[index] = { ...newHorarios[index], [field]: value }
      return newHorarios
    })
  }

  const removeHorario = (index: number) => {
    setHorarios(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const payload = {
        clase: {
          ...clase,
          capacidad: clase.capacidad ? parseInt(clase.capacidad as string) : null
        },
        horarios: horarios.map(h => ({
          ...h,
          hora_inicio: h.hora_inicio + ':00',
          hora_fin: h.hora_fin + ':00'
        }))
      }

      const url = claseExistente 
        ? `/api/gerente/clases/${claseExistente.id}`
        : `/api/gerente/clases`
      
      const method = claseExistente ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (!res.ok) {
        const text = await res.text()
        throw new Error(text || 'Error al guardar')
      }

      toast.success(`Clase ${claseExistente ? 'actualizada' : 'creada'} exitosamente`)
      onSuccess()
    } catch (error: any) {
      toast.error('Error', { description: error.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg shadow-2xl w-full max-w-2xl flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center p-6 border-b border-zinc-800">
          <h2 className="text-xl font-bold font-arcade tracking-wide text-white">
            {claseExistente ? 'Editar Clase' : 'Nueva Clase'}
          </h2>
          <button onClick={onClose} className="text-zinc-400 hover:text-white transition-colors">
            <X className="size-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 custom-scrollbar space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5 md:col-span-2">
              <Label className="text-zinc-300">Nombre de la Clase *</Label>
              <Input 
                name="nombre" 
                value={clase.nombre} 
                onChange={handleClaseChange} 
                required 
                placeholder="Ej: Crossfit, Yoga, Funcional..."
                className="bg-zinc-950 border-zinc-700 font-arcade uppercase tracking-wider"
              />
            </div>
            
            <div className="space-y-1.5">
              <Label className="text-zinc-300">Profesor / Entrenador</Label>
              <Input 
                name="entrenador" 
                value={clase.entrenador} 
                onChange={handleClaseChange} 
                className="bg-zinc-950 border-zinc-700"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-zinc-300">Capacidad Max. (Opcional)</Label>
              <Input 
                name="capacidad" 
                type="number"
                value={clase.capacidad} 
                onChange={handleClaseChange} 
                placeholder="Ej: 20"
                className="bg-zinc-950 border-zinc-700"
              />
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <Label className="text-zinc-300">Descripción</Label>
              <Textarea 
                name="descripcion" 
                value={clase.descripcion} 
                onChange={handleClaseChange} 
                className="bg-zinc-950 border-zinc-700 resize-none h-20"
              />
            </div>

            <div className="flex items-center gap-4 md:col-span-2 p-4 bg-zinc-950 rounded-lg border border-zinc-800">
              <div className="space-y-1.5 flex-1">
                <Label className="text-zinc-300">Color (UI)</Label>
                <div className="flex gap-2 items-center">
                  <Input 
                    type="color" 
                    name="color_hex" 
                    value={clase.color_hex} 
                    onChange={handleClaseChange}
                    className="w-12 h-10 p-1 bg-zinc-900 border-zinc-700 rounded cursor-pointer"
                  />
                  <span className="text-zinc-500 font-mono text-sm">{clase.color_hex}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-2 pr-4 pt-6">
                <input 
                  type="checkbox" 
                  name="activa" 
                  id="activa"
                  checked={clase.activa} 
                  onChange={handleClaseChange}
                  className="w-4 h-4 rounded accent-yellow-500 bg-zinc-800 border-zinc-700"
                />
                <Label htmlFor="activa" className="text-zinc-300 cursor-pointer">Clase Activa</Label>
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-zinc-800">
            <div className="flex justify-between items-center">
              <Label className="text-zinc-200 text-base font-semibold">Horarios Semanales</Label>
              <Button type="button" variant="outline" size="sm" onClick={addHorario} className="bg-zinc-950 border-zinc-700 text-yellow-500 hover:text-yellow-400 hover:bg-zinc-900">
                <Plus className="size-4 mr-2" />
                Agregar Horario
              </Button>
            </div>

            {horarios.length === 0 ? (
              <p className="text-zinc-500 text-sm italic text-center py-4 bg-zinc-950 rounded border border-zinc-800/50">
                No hay horarios definidos. Agrega al menos uno para que la clase aparezca en el calendario.
              </p>
            ) : (
              <div className="space-y-3">
                {horarios.map((h, i) => (
                  <div key={i} className="flex flex-col md:flex-row gap-3 p-3 bg-zinc-950 rounded-lg border border-zinc-800 items-start md:items-end">
                    <div className="space-y-1.5 flex-1 w-full">
                      <Label className="text-xs text-zinc-500">Día</Label>
                      <select 
                        value={h.dia_semana}
                        onChange={(e) => updateHorario(i, 'dia_semana', parseInt(e.target.value))}
                        className="w-full h-10 rounded-md border border-zinc-700 bg-zinc-900 px-3 text-sm text-zinc-200 focus:outline-none focus:ring-1 focus:ring-yellow-500"
                      >
                        {DIAS.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
                      </select>
                    </div>
                    <div className="space-y-1.5 flex-1 w-full">
                      <Label className="text-xs text-zinc-500">Inicio</Label>
                      <Input 
                        type="time" 
                        value={h.hora_inicio} 
                        onChange={(e) => updateHorario(i, 'hora_inicio', e.target.value)}
                        required
                        className="bg-zinc-900 border-zinc-700 h-10"
                      />
                    </div>
                    <div className="space-y-1.5 flex-1 w-full">
                      <Label className="text-xs text-zinc-500">Fin</Label>
                      <Input 
                        type="time" 
                        value={h.hora_fin} 
                        onChange={(e) => updateHorario(i, 'hora_fin', e.target.value)}
                        required
                        className="bg-zinc-900 border-zinc-700 h-10"
                      />
                    </div>
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="icon"
                      onClick={() => removeHorario(i)}
                      className="shrink-0 bg-red-500/10 border-red-900/50 text-red-400 hover:bg-red-500/20 hover:text-red-300 h-10 w-10 mt-2 md:mt-0"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </form>

        <div className="p-6 border-t border-zinc-800 flex justify-end gap-3 bg-zinc-900/50">
          <Button type="button" variant="ghost" onClick={onClose} className="text-zinc-400 hover:text-white">
            Cancelar
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={loading}
            className="bg-yellow-500 text-zinc-950 hover:bg-yellow-400 min-w-[120px]"
          >
            {loading ? <Loader2 className="size-4 animate-spin" /> : 'Guardar'}
          </Button>
        </div>
      </div>
    </div>
  )
}
