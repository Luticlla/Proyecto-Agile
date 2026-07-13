'use client'

import { useEffect, useState } from 'react'
import { Users, AlertTriangle, XCircle } from 'lucide-react'
import { contarClientesPorEstado, contarMembresiasPorEstado } from '@/lib/supabase/queries/clientes'

interface EstadisticasData {
  totalClientes: number
  clientesActivos: number
  clientesInactivos: number
  membresiasActivas: number
  membresiasVencidas: number
  membresiasPorVencer: number
  sinMembresia: number
}

function StatCard({
  label,
  value,
  icon: Icon,
  colorClass,
  loading,
}: {
  label: string
  value: number
  icon: React.ElementType
  colorClass: string
  loading: boolean
}) {
  return (
    <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-zinc-900/50 border border-zinc-800">
      <div className={`size-8 rounded-md flex items-center justify-center shrink-0 ${colorClass}`}>
        <Icon className="size-4" />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-zinc-500 truncate">{label}</p>
        {loading ? (
          <div className="h-5 w-8 bg-zinc-700 rounded animate-pulse mt-0.5" />
        ) : (
          <p className="text-lg font-bold text-white leading-none mt-0.5">{value}</p>
        )}
      </div>
    </div>
  )
}

export function ResumenEstadistico() {
  const [data, setData] = useState<EstadisticasData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function loadStats() {
      try {
        const [clientes, membresias] = await Promise.all([
          contarClientesPorEstado(),
          contarMembresiasPorEstado(),
        ])
        if (!cancelled) {
          setData({
            totalClientes: clientes.total,
            clientesActivos: clientes.activos,
            clientesInactivos: clientes.inactivos,
            membresiasActivas: membresias.activas,
            membresiasVencidas: membresias.vencidas,
            membresiasPorVencer: membresias.por_vencer,
            sinMembresia: membresias.sin_membresia,
          })
        }
      } catch (err) {
        console.error('Error cargando estadísticas:', err)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    loadStats()
    return () => { cancelled = true }
  }, [])

  const stats = [
    {
      label: 'Total Clientes',
      value: data?.totalClientes ?? 0,
      icon: Users,
      colorClass: 'bg-zinc-700/60 text-zinc-300',
    },
    {
      label: 'Por Vencer (7d)',
      value: data?.membresiasPorVencer ?? 0,
      icon: AlertTriangle,
      colorClass: 'bg-yellow-500/15 text-yellow-400',
    },
    {
      label: 'Vencidas',
      value: data?.membresiasVencidas ?? 0,
      icon: XCircle,
      colorClass: 'bg-red-500/15 text-red-400',
    },
  ]

  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
      <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-3">
        Resumen
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2">
        {stats.map((stat) => (
          <StatCard
            key={stat.label}
            label={stat.label}
            value={stat.value}
            icon={stat.icon}
            colorClass={stat.colorClass}
            loading={loading}
          />
        ))}
      </div>
    </div>
  )
}
