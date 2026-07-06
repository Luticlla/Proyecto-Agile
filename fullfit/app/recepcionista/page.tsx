'use client'

import { useAuth } from '@/hooks'
import { Users, CreditCard, AlertTriangle, Clock } from 'lucide-react'
import { useEffect, useState } from 'react'
import { BusquedaRapida } from '@/components/clientes'
import { cn } from '@/lib/utils'
import Link from 'next/link'

interface ProximaAVencer {
  id: number
  nombre: string
  apellido: string
  plan: string
  dias_restantes: number
}

interface DashboardData {
  totalClientes: number
  membresiasActivas: number
  membresiasPorVencer: number
  proximasAVencer: ProximaAVencer[]
}

function GridBackground() {
  return (
    <div
      className="absolute inset-0 opacity-[0.03] pointer-events-none"
      style={{
        backgroundImage: `
          linear-gradient(rgba(255,223,0,0.5) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,223,0,0.5) 1px, transparent 1px)
        `,
        backgroundSize: '40px 40px',
      }}
    />
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <div className="h-px flex-1 bg-gym-logo/20" />
      <span className="font-arcade text-gym-logo text-[9px] md:text-[10px] tracking-widest uppercase">
        {children}
      </span>
      <div className="h-px flex-1 bg-gym-logo/20" />
    </div>
  )
}

export default function RecepcionistaDashboard() {
  const { profile } = useAuth()
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const res = await fetch('/api/dashboard')
        if (res.ok) {
          const json = await res.json()
          setData(json)
        }
      } catch (error) {
        console.error('Error cargando dashboard:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchDashboard()
  }, [])

  return (
    <div className="space-y-8 md:space-y-10">
      {/* Hero Header */}
      <section className="relative border-b border-gym-logo/20 overflow-hidden pb-8">
        <GridBackground />
        <div className="relative z-10 flex flex-col items-center text-center gap-4">
          <div className="flex items-center gap-3">
            <div className="h-px w-8 md:w-16 bg-gym-logo" />
            <span className="font-arcade text-gym-logo text-[8px] md:text-[10px] tracking-widest uppercase">
              Panel de Control
            </span>
            <div className="h-px w-8 md:w-16 bg-gym-logo" />
          </div>

          <h1 className="font-arcade text-white text-xl md:text-3xl lg:text-4xl tracking-wide uppercase leading-relaxed">
            Bienvenido, <span className="text-gym-logo [text-shadow:0_0_20px_rgba(255,223,0,0.5)]">{profile?.nombre}</span>
          </h1>

          <p className="font-mono text-white/40 text-xs md:text-sm max-w-md leading-relaxed">
            Gestiona clientes, membresías y reportes diarios desde este panel de administración.
          </p>

          <div className="w-full max-w-md mt-4">
            <BusquedaRapida />
          </div>
        </div>
      </section>

      {/* Stats Cards */}
      <section>
        <SectionLabel>Estadísticas Generales</SectionLabel>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card 1 */}
          <Link href="/recepcionista/clientes" className="relative rounded-xl border border-white/10 bg-white/[0.02] p-5 overflow-hidden group hover:border-white/30 transition-colors block">
            <GridBackground />
            <div className="relative z-10 flex flex-col gap-2">
              <div className="flex items-center justify-between text-white/40">
                <span className="font-arcade text-[10px] tracking-widest uppercase">Total Clientes</span>
                <Users className="size-4" />
              </div>
              <div className="font-arcade text-3xl md:text-4xl text-white">
                {loading ? '--' : data?.totalClientes ?? 0}
              </div>
              <p className="font-mono text-[10px] text-white/30 uppercase tracking-wider">Usuarios registrados</p>
            </div>
          </Link>

          {/* Card 2 */}
          <Link href="/recepcionista/membresias?estado=activas" className="relative rounded-xl border border-gym-logo/20 bg-gradient-to-br from-gym-logo/5 via-black to-black p-5 overflow-hidden group hover:border-gym-logo/40 transition-colors block">
            <GridBackground />
            <div className="relative z-10 flex flex-col gap-2">
              <div className="flex items-center justify-between text-gym-logo/80">
                <span className="font-arcade text-[10px] tracking-widest uppercase">Membresías Activas</span>
                <CreditCard className="size-4" />
              </div>
              <div className="font-arcade text-3xl md:text-4xl text-gym-logo [text-shadow:0_0_15px_rgba(255,223,0,0.4)] group-hover:scale-105 transition-transform origin-left">
                {loading ? '--' : data?.membresiasActivas ?? 0}
              </div>
              <p className="font-mono text-[10px] text-gym-logo/50 uppercase tracking-wider">Con acceso vigente</p>
            </div>
          </Link>

          {/* Card 3 */}
          <Link href="/recepcionista/membresias?estado=por_vencer" className="relative rounded-xl border border-red-500/20 bg-gradient-to-br from-red-500/5 via-black to-black p-5 overflow-hidden group hover:border-red-500/40 transition-colors block">
            <GridBackground />
            <div className="relative z-10 flex flex-col gap-2">
              <div className="flex items-center justify-between text-red-400/80">
                <span className="font-arcade text-[10px] tracking-widest uppercase">Membresías por Vencer</span>
                <AlertTriangle className="size-4" />
              </div>
              <div className="font-arcade text-3xl md:text-4xl text-red-400 [text-shadow:0_0_15px_rgba(239,68,68,0.4)] group-hover:scale-105 transition-transform origin-left">
                {loading ? '--' : data?.membresiasPorVencer ?? 0}
              </div>
              <p className="font-mono text-[10px] text-red-400/50 uppercase tracking-wider">Próximos 7 días</p>
            </div>
          </Link>
        </div>
      </section>

      {/* Próximas a vencer list */}
      <section>
        <SectionLabel>Membresías Próximas a Vencer</SectionLabel>
        <div className="relative rounded-xl border border-white/10 bg-white/[0.02] overflow-hidden">
          <GridBackground />
          <div className="relative z-10 p-5">
            {loading ? (
              <p className="font-mono text-white/30 text-xs text-center py-8">Cargando...</p>
            ) : data?.proximasAVencer && data.proximasAVencer.length > 0 ? (
              <div className="space-y-3">
                {data.proximasAVencer.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-black border border-white/5 hover:border-gym-logo/30 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="size-8 rounded border border-white/10 bg-white/[0.02] flex items-center justify-center">
                        <Clock className="size-4 text-white/40" />
                      </div>
                      <div>
                        <p className="font-mono text-sm font-semibold text-white">
                          {item.nombre} {item.apellido}
                        </p>
                        <p className="font-arcade text-[8px] tracking-widest uppercase text-white/40 mt-1">{item.plan}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span
                        className={cn(
                          "font-arcade text-xs md:text-sm",
                          item.dias_restantes <= 2
                            ? 'text-red-400 [text-shadow:0_0_10px_rgba(239,68,68,0.5)]'
                            : item.dias_restantes <= 5
                              ? 'text-orange-400'
                              : 'text-gym-logo [text-shadow:0_0_10px_rgba(255,223,0,0.5)]'
                        )}
                      >
                        {item.dias_restantes} {item.dias_restantes === 1 ? 'día' : 'días'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Clock className="size-8 text-white/20 mx-auto mb-3" />
                <p className="font-mono text-white/40 text-xs">
                  No hay membresías próximas a vencer en los próximos 7 días.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
