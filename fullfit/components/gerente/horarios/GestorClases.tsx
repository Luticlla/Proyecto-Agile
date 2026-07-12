'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Plus, Trash2, Edit, Clock, CalendarDays } from 'lucide-react'
import FormularioClase from './FormularioClase'
import { useToast } from '@/components/ui/use-toast'

interface GestorClasesProps {
  clases: any[]
  onReload: () => void
}

const DIAS_SEMANA = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']

export default function GestorClases({ clases, onReload }: GestorClasesProps) {
  const { toast } = useToast()
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [claseEditar, setClaseEditar] = useState<any | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)

  const handleEdit = (clase: any) => {
    setClaseEditar(clase)
    setIsFormOpen(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('¿Estás seguro de eliminar esta clase y todos sus horarios?')) return

    setDeletingId(id)
    try {
      const res = await fetch(`/api/gerente/clases/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Error al eliminar')
      
      toast({ title: 'Clase eliminada exitosamente' })
      onReload()
    } catch (error) {
      toast({ title: 'Error', description: 'No se pudo eliminar la clase', variant: 'destructive' })
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-zinc-900 border border-zinc-800 p-4 rounded-lg">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <CalendarDays className="size-5 text-yellow-500" />
            Clases Programadas
          </h2>
          <p className="text-sm text-zinc-400">Gestiona las disciplinas y sus horarios semanales</p>
        </div>
        <Button 
          onClick={() => { setClaseEditar(null); setIsFormOpen(true) }}
          className="bg-yellow-500 text-zinc-950 hover:bg-yellow-400"
        >
          <Plus className="size-4 mr-2" />
          Nueva Clase
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {clases.map((clase) => (
          <div key={clase.id} className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden flex flex-col">
            <div 
              className="h-2 w-full" 
              style={{ backgroundColor: clase.color_hex || '#facc15' }}
            />
            <div className="p-5 flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold text-white uppercase font-arcade tracking-wider">
                    {clase.nombre}
                  </h3>
                  {clase.entrenador && (
                    <p className="text-sm text-zinc-400 mt-1">Prof: {clase.entrenador}</p>
                  )}
                </div>
                {!clase.activa && (
                  <span className="text-[10px] bg-red-500/20 text-red-400 px-2 py-1 rounded border border-red-500/30 uppercase font-mono">
                    Inactiva
                  </span>
                )}
              </div>
              
              <div className="space-y-3 flex-1 mb-6">
                <div className="flex items-center gap-2 text-zinc-500 text-xs uppercase tracking-wider mb-2 border-b border-zinc-800 pb-2">
                  <Clock className="size-3" />
                  <span>Horarios</span>
                </div>
                {clase.horarios?.length > 0 ? (
                  <div className="space-y-1.5 max-h-32 overflow-y-auto pr-2 custom-scrollbar">
                    {clase.horarios.sort((a:any,b:any) => a.dia_semana - b.dia_semana).map((h: any) => (
                      <div key={h.id} className="flex justify-between items-center text-sm p-1.5 bg-zinc-950 rounded border border-zinc-800/50">
                        <span className="text-zinc-300 font-medium">{DIAS_SEMANA[h.dia_semana]}</span>
                        <span className="text-zinc-400 font-mono text-xs">
                          {h.hora_inicio.substring(0, 5)} - {h.hora_fin.substring(0, 5)}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-zinc-600 italic">No tiene horarios asignados</p>
                )}
              </div>

              <div className="flex gap-2 mt-auto pt-4 border-t border-zinc-800">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1 bg-zinc-950 border-zinc-700 hover:bg-zinc-800 text-zinc-300"
                  onClick={() => handleEdit(clase)}
                >
                  <Edit className="size-3 mr-2" />
                  Editar
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="bg-zinc-950 border-red-900/50 hover:bg-red-500/10 text-red-400 hover:text-red-300"
                  onClick={() => handleDelete(clase.id)}
                  disabled={deletingId === clase.id}
                >
                  <Trash2 className="size-3" />
                </Button>
              </div>
            </div>
          </div>
        ))}
        {clases.length === 0 && (
          <div className="col-span-full py-12 text-center text-zinc-500 bg-zinc-900 border border-zinc-800 rounded-lg border-dashed">
            No hay clases registradas. Usa el botón "Nueva Clase" para crear una.
          </div>
        )}
      </div>

      {isFormOpen && (
        <FormularioClase
          claseExistente={claseEditar}
          onClose={() => setIsFormOpen(false)}
          onSuccess={() => {
            setIsFormOpen(false)
            onReload()
          }}
        />
      )}
    </div>
  )
}
