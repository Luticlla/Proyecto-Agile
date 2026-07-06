'use client'

import { useState } from 'react'
import { ListaMembresias } from '@/components/membresias'
import { ConfirmarAccion } from '@/components/membresias'
import { downloadBoleta } from '@/lib/utils/boleta'
import { base64ToBlob } from '@/lib/utils/blob'
import { usePaginatedFetch } from '@/hooks'
import type { MembresiaConCliente, EstadoMembresia } from '@/lib/supabase/queries/membresias.types'
import { useSearchParams } from 'next/navigation'

export default function MembresiasPage() {
  const searchParams = useSearchParams()
  const estadoInicial = (searchParams.get('estado') as EstadoMembresia) || 'todos'
  
  const [buscar, setBuscar] = useState('')
  const [estado, setEstado] = useState<EstadoMembresia>(estadoInicial)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [accionPendiente, setAccionPendiente] = useState<{
    id: number
    accion: 'cancelar' | 'pausar' | 'reactivar' | 'renovar'
  } | null>(null)
  const [loadingAccion, setLoadingAccion] = useState(false)

  const {
    data: membresias,
    loading,
    page,
    totalPages,
    limit,
    setPage,
    setLimit,
    refresh
  } = usePaginatedFetch<MembresiaConCliente>({
    url: '/api/membresias',
    params: { buscar, estado }
  })

  const handleBuscar = () => {
    setPage(1)
  }

  const handleAccion = (id: number, accion: 'cancelar' | 'pausar' | 'reactivar' | 'renovar') => {
    setAccionPendiente({ id, accion })
    setConfirmOpen(true)
  }

  const confirmarAccion = async () => {
    if (!accionPendiente) return

    setLoadingAccion(true)
    try {
      const { id, accion } = accionPendiente

      if (accion === 'renovar') {
        const response = await fetch(`/api/membresias/${id}/renovar`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            plan_id: 1,
            metodo_pago: 'efectivo',
            monto: 100
          })
        })

        if (response.ok) {
          const data = await response.json()
          if (data.boleta) {
            const blob = base64ToBlob(data.boleta, 'application/pdf')
            downloadBoleta(blob, data.numero_boleta)
          }
        }
      } else {
        const response = await fetch(`/api/membresias/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ accion })
        })

        if (!response.ok) {
          const data = await response.json()
          alert(data.error || 'Error al procesar la acción')
          return
        }
      }

      refresh()
    } catch (error) {
      console.error('Error executing action:', error)
      alert('Error al procesar la solicitud')
    } finally {
      setLoadingAccion(false)
      setConfirmOpen(false)
      setAccionPendiente(null)
    }
  }

  const getTituloConfirmacion = () => {
    if (!accionPendiente) return ''
    const titulos = {
      cancelar: 'Cancelar Membresía',
      pausar: 'Pausar Membresía',
      reactivar: 'Reactivar Membresía',
      renovar: 'Renovar Membresía'
    }
    return titulos[accionPendiente.accion]
  }

  const getDescripcionConfirmacion = () => {
    if (!accionPendiente) return ''
    const descripciones = {
      cancelar: '¿Estás seguro de cancelar esta membresía? El cliente perderá el acceso.',
      pausar: '¿Estás seguro de pausar esta membresía? El acceso será suspendido temporalmente.',
      reactivar: '¿Estás seguro de reactivar esta membresía? El cliente recuperará el acceso.',
      renovar: '¿Confirmar la renovación de esta membresía?'
    }
    return descripciones[accionPendiente.accion]
  }

  const getVarianteConfirmacion = () => {
    if (!accionPendiente) return 'default'
    if (accionPendiente.accion === 'cancelar') return 'danger'
    if (accionPendiente.accion === 'pausar') return 'warning'
    return 'default'
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-gym-logo/20 pb-4">
        <div>
          <h1 className="font-arcade text-2xl md:text-3xl text-white uppercase tracking-widest">Membresías</h1>
          <p className="font-mono text-white/40 text-xs md:text-sm mt-2">
            Gestiona las membresías de los clientes
          </p>
        </div>
      </div>

      <ListaMembresias
        membresias={membresias}
        loading={loading}
        buscar={buscar}
        onBuscarChange={setBuscar}
        onBuscar={handleBuscar}
        estado={estado}
        onEstadoChange={(nuevoEstado) => {
          setEstado(nuevoEstado)
          setPage(1)
        }}
        onAccion={handleAccion}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        limit={limit}
        onLimitChange={(newLimit) => {
          setLimit(newLimit)
          setPage(1)
        }}
      />

      <ConfirmarAccion
        open={confirmOpen}
        onClose={() => {
          setConfirmOpen(false)
          setAccionPendiente(null)
        }}
        onConfirm={confirmarAccion}
        titulo={getTituloConfirmacion()}
        descripcion={getDescripcionConfirmacion()}
        loading={loadingAccion}
        variante={getVarianteConfirmacion()}
      />
    </div>
  )
}
