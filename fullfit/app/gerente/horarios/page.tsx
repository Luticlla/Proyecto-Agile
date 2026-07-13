'use client'

import React, { useState, useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import ConfiguracionGym from '@/components/gerente/horarios/ConfiguracionGym'
import GestorClases from '@/components/gerente/horarios/GestorClases'
import { Loader2 } from 'lucide-react'

export default function HorariosPage() {
  const [loading, setLoading] = useState(true)
  const [sede, setSede] = useState<any>(null)
  const [clases, setClases] = useState<any[]>([])

  const loadData = async () => {
    setLoading(true)
    try {
      const [resSedes, resClases] = await Promise.all([
        fetch('/api/sedes', { credentials: 'include', cache: 'no-store' }),
        fetch('/api/gerente/clases', { cache: 'no-store' })
      ])
      
      const sedesData = await resSedes.json()
      // /api/sedes returns { data: [...], count, page, totalPages }
      const sedesArray = sedesData?.data ?? sedesData
      if (Array.isArray(sedesArray) && sedesArray.length > 0) {
        setSede(sedesArray[0])
      }

      const clasesData = await resClases.json()
      setClases(clasesData || [])
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="size-8 text-yellow-500 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-arcade text-white uppercase tracking-wider mb-2">
          Gestión de <span className="text-yellow-500">Horarios</span>
        </h1>
        <p className="text-zinc-400">
          Configura los horarios de apertura del gimnasio y administra el calendario de clases grupales.
        </p>
      </div>

      <Tabs defaultValue="clases" className="w-full">
        <TabsList className="bg-zinc-900 border border-zinc-800">
          <TabsTrigger 
            value="clases"
            className="data-[state=active]:bg-yellow-500 data-[state=active]:text-zinc-950"
          >
            Clases Grupales
          </TabsTrigger>
          <TabsTrigger 
            value="gym"
            className="data-[state=active]:bg-yellow-500 data-[state=active]:text-zinc-950"
          >
            Horario General (Sede)
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="clases" className="mt-6">
          <GestorClases clases={clases} onReload={loadData} sede={sede} />
        </TabsContent>
        
        <TabsContent value="gym" className="mt-6">
          {sede ? (
            <ConfiguracionGym sede={sede} onReload={loadData} />
          ) : (
            <div className="p-8 text-center text-zinc-500 border border-zinc-800 rounded-lg bg-zinc-900/50">
              No se encontró una sede activa.
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
