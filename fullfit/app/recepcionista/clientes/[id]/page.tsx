'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { obtenerClienteConMembresia, obtenerHistorialPagos } from '@/lib/supabase/queries/clientes'
import type { ClienteConMembresiaCompleta, PagoResumen } from '@/lib/supabase/queries/clientes.types'
import { ProfileWithEmail, PlanMembresia } from '@/lib/supabase/types'
import { MembresiaConCliente } from '@/lib/supabase/queries/membresias.types'
import { TarjetaCliente, FormularioEditarCliente, SeccionMembresia, HistorialPagos } from '@/components/clientes'
import { FormularioRegistrarMembresia } from '@/components/membresias'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Edit, Loader2, CreditCard, RefreshCw } from 'lucide-react'
import Link from 'next/link'
import { downloadBoleta } from '@/lib/utils/boleta'
import { base64ToBlob } from '@/lib/utils/blob'

export default function ClienteDetailPage() {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [cliente, setCliente] = useState<ProfileWithEmail | null>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(searchParams.get('edit') === 'true')
  const [showMembresiaForm, setShowMembresiaForm] = useState(false)
  const [planes, setPlanes] = useState<PlanMembresia[]>([])
  const [loadingPlanes, setLoadingPlanes] = useState(false)
  const [submittingMembresia, setSubmittingMembresia] = useState(false)
  const [membresiaActiva, setMembresiaActiva] = useState<MembresiaConCliente | null>(null)
  const [loadingMembresiaActiva, setLoadingMembresiaActiva] = useState(false)
  const [membresiaDetalle, setMembresiaDetalle] = useState<ClienteConMembresiaCompleta | null>(null)
  const [loadingMembresiaDetalle, setLoadingMembresiaDetalle] = useState(false)
  const [pagos, setPagos] = useState<PagoResumen[]>([])
  const [loadingPagos, setLoadingPagos] = useState(false)

  const action = searchParams.get('action')
  const esRenovacion = action === 'renovar'

  const fetchPlanes = useCallback(async () => {
    setLoadingPlanes(true)
    try {
      const response = await fetch('/api/planes')
      if (response.ok) {
        const data = await response.json()
        setPlanes(data.data || [])
      }
    } catch (error) {
      console.error('Error fetching planes:', error)
    } finally {
      setLoadingPlanes(false)
    }
  }, [])

  const fetchMembresiaActiva = useCallback(async (usuarioId: string) => {
    setLoadingMembresiaActiva(true)
    try {
      const response = await fetch(`/api/membresias/activa?usuario_id=${usuarioId}`)
      if (response.ok) {
        const data = await response.json()
        setMembresiaActiva(data.membresia)
      }
    } catch (error) {
      console.error('Error fetching membresía activa:', error)
    } finally {
      setLoadingMembresiaActiva(false)
    }
  }, [])

  useEffect(() => {
    const fetchCliente = async () => {
      if (params.id) {
        setLoadingMembresiaDetalle(true)
        setLoadingPagos(true)
        const [clienteData, pagosData] = await Promise.all([
          obtenerClienteConMembresia(params.id as string),
          obtenerHistorialPagos(params.id as string, 5)
        ])
        setCliente(clienteData)
        setMembresiaDetalle(clienteData)
        setPagos(pagosData)
        setLoading(false)
        setLoadingMembresiaDetalle(false)
        setLoadingPagos(false)
      }
    }

    fetchCliente()
  }, [params.id])

  useEffect(() => {
    if (action === 'registrar' || action === 'renovar') {
      if (planes.length === 0) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchPlanes()
      }
      setShowMembresiaForm(true)

      if (action === 'renovar' && params.id) {
        fetchMembresiaActiva(params.id as string)
      }
    }
  }, [action, params.id, planes.length, fetchPlanes, fetchMembresiaActiva])

  const handleShowMembresiaForm = () => {
    if (planes.length === 0) {
      fetchPlanes()
    }
    setShowMembresiaForm(true)
  }

  const handleRegistrarMembresia = async (datos: {
    plan_id: number
    metodo_pago: 'efectivo' | 'mercadopago'
    monto: number
  }) => {
    if (!cliente) return

    setSubmittingMembresia(true)
    try {
      let response

      if (esRenovacion && membresiaActiva) {
        response = await fetch(`/api/membresias/${membresiaActiva.id}/renovar`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            plan_id: datos.plan_id,
            metodo_pago: datos.metodo_pago,
            monto: datos.monto
          })
        })
      } else {
        response = await fetch('/api/membresias', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            usuario_id: cliente.id,
            ...datos
          })
        })
      }

      if (response.ok) {
        const data = await response.json()

        if (data.boleta) {
          const blob = base64ToBlob(data.boleta, 'application/pdf')
          downloadBoleta(blob, data.numero_boleta)
        }

        if (data.init_point) {
          window.location.href = data.init_point
          return
        }

        setShowMembresiaForm(false)
        const mensaje = esRenovacion
          ? 'Membresía renovada exitosamente'
          : 'Membresía registrada exitosamente'
        alert(mensaje)
        router.refresh()
      } else {
        const error = await response.json()
        alert(error.error || 'Error al procesar la membresía')
      }
    } catch (error) {
      console.error('Error processing membresía:', error)
      alert('Error al procesar la solicitud')
    } finally {
      setSubmittingMembresia(false)
    }
  }

  const handleSave = (updatedCliente: ProfileWithEmail) => {
    setCliente(updatedCliente)
    setEditing(false)
  }

  const handleCancel = () => {
    setEditing(false)
    setShowMembresiaForm(false)
    router.replace(`/recepcionista/clientes/${params.id}`)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="size-8 text-zinc-400 animate-spin" />
      </div>
    )
  }

  if (!cliente) {
    return (
      <div className="text-center py-12">
        <p className="text-zinc-400">Cliente no encontrado</p>
        <Link href="/recepcionista/clientes">
          <Button variant="link" className="text-yellow-400 mt-4">
            Volver a la lista
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-gym-logo/20 pb-4">
        <div className="flex items-center gap-4">
          <Link href="/recepcionista/clientes">
            <Button variant="ghost" size="icon" className="text-white/40 hover:text-white hover:bg-white/5">
              <ArrowLeft className="size-5" />
            </Button>
          </Link>
          <div>
            <h1 className="font-arcade text-2xl md:text-3xl text-white uppercase tracking-widest">
              {cliente.nombre} {cliente.apellido}
            </h1>
            <p className="font-mono text-white/40 text-xs md:text-sm mt-2">Detalle del cliente</p>
          </div>
        </div>
        <div className="flex gap-2">
          {!editing && !showMembresiaForm && (
            <>
              <Button
                onClick={handleShowMembresiaForm}
                className="bg-green-600 text-white hover:bg-green-700 font-mono text-xs uppercase tracking-wider"
              >
                <CreditCard className="size-4 mr-2" />
                Registrar Membresía
              </Button>
              <Button
                onClick={() => setEditing(true)}
                className="bg-gym-logo text-black hover:bg-gym-logo/80 font-mono text-xs uppercase tracking-wider"
              >
                <Edit className="size-4 mr-2" />
                Editar
              </Button>
            </>
          )}
        </div>
      </div>

      {editing ? (
        <FormularioEditarCliente
          cliente={cliente}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      ) : showMembresiaForm ? (
        <div className="bg-black border border-white/10 rounded-lg p-6 relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{
              backgroundImage: 'linear-gradient(rgba(255,223,0,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,223,0,0.5) 1px, transparent 1px)',
              backgroundSize: '40px 40px',
            }}
          />
          <div className="relative z-10">
          {loadingPlanes || loadingMembresiaActiva ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="size-6 text-zinc-400 animate-spin" />
              <span className="ml-2 text-zinc-400">
                {loadingPlanes ? 'Cargando planes...' : 'Obteniendo membresía activa...'}
              </span>
            </div>
          ) : (
            <>
              {esRenovacion && membresiaActiva && (
                <div className="mb-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                  <div className="flex items-center gap-2 text-yellow-400">
                    <RefreshCw className="size-4" />
                    <span className="font-medium">Modo Renovación</span>
                  </div>
                  <p className="text-sm text-zinc-400 mt-1">
                    La membresía actual vence el {new Date(membresiaActiva.fecha_fin).toLocaleDateString('es-PE')}. 
                    Los días restantes se sumarán al nuevo plan.
                  </p>
                </div>
              )}
              <FormularioRegistrarMembresia
                clienteNombre={`${cliente.nombre} ${cliente.apellido}`}
                planes={planes}
                onSubmit={handleRegistrarMembresia}
                loading={submittingMembresia}
              />
            </>
          )}
            <div className="mt-4 flex justify-end">
              <Button
                variant="outline"
                onClick={() => setShowMembresiaForm(false)}
                className="border-white/10 text-white/40 hover:bg-white/5 hover:text-white font-mono text-xs uppercase tracking-wider"
              >
                Cancelar
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <>
          <TarjetaCliente cliente={cliente} />
          <SeccionMembresia
            membresia={membresiaDetalle?.membresia || null}
            loading={loadingMembresiaDetalle}
          />
          <HistorialPagos pagos={pagos} loading={loadingPagos} />
        </>
      )}
    </div>
  )
}
