'use client'

import { useEffect, useState } from 'react'
import { Loader2, RefreshCw, ShieldCheck, ShieldOff, CreditCard, Clock, Calendar, AlertTriangle } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { HistorialPagos, type PagoHistorial } from '@/components/mi-membresia/HistorialPagos'
import { ListaPlanesMembresia } from '@/components/membresias/ListaPlanesMembresia'
import type { MiMembresiaData } from '@/lib/supabase/queries/mi-membresia'
import type { PlanMembresia } from '@/lib/supabase/types'

type PageData = MiMembresiaData & { historialPagos: PagoHistorial[] }

/* ─── helpers ─────────────────────────────────────────────────────────────── */

function formatDate(dateStr: string): string {
  try {
    const [year, month, day] = dateStr.split('-')
    const date = new Date(Number(year), Number(month) - 1, Number(day))
    return date.toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' })
  } catch {
    return dateStr
  }
}

function getDiasColor(dias: number): string {
  if (dias > 30) return 'text-green-400'
  if (dias > 15) return 'text-yellow-200'
  if (dias > 7) return 'text-gym-logo'
  if (dias > 0) return 'text-red-400'
  return 'text-red-500'
}

function getDiasGlow(dias: number): string {
  if (dias > 30) return '[text-shadow:0_0_20px_rgba(74,222,128,0.5)]'
  if (dias > 7) return '[text-shadow:0_0_20px_rgba(255,223,0,0.5)]'
  return '[text-shadow:0_0_20px_rgba(239,68,68,0.5)]'
}

/* ─── sub-components ──────────────────────────────────────────────────────── */

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

/* ─── Tarjeta Membresía ───────────────────────────────────────────────────── */

function TarjetaMembresiaArcade({
  membresia,
  estado,
}: {
  membresia: NonNullable<MiMembresiaData['membresiaActiva']>
  estado: 'activa' | 'vencida'
}) {
  const dias = membresia.dias_restantes
  const esActiva = estado === 'activa'

  return (
    <div
      className={cn(
        'relative rounded-xl border overflow-hidden',
        esActiva
          ? 'border-gym-logo/30 bg-gradient-to-br from-gym-logo/5 via-black to-black'
          : 'border-red-500/30 bg-gradient-to-br from-red-900/10 via-black to-black'
      )}
    >
      <GridBackground />

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between px-5 pt-5 pb-3 border-b border-white/5">
        <div className="flex items-center gap-2">
          <CreditCard className={cn('size-4', esActiva ? 'text-gym-logo' : 'text-red-400')} />
          <span className="font-arcade text-white text-xs md:text-sm tracking-widest uppercase">
            Tu Membresía
          </span>
        </div>
        <span
          className={cn(
            'font-arcade text-[9px] tracking-widest uppercase px-2 py-1 rounded border',
            esActiva
              ? 'text-green-400 bg-green-500/10 border-green-500/30'
              : 'text-red-400 bg-red-500/10 border-red-500/30'
          )}
        >
          {esActiva ? '● Activa' : '○ Vencida'}
        </span>
      </div>

      {/* Body */}
      <div className="relative z-10 p-5 space-y-5">
        {/* Plan + price */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="font-mono text-white/30 text-[10px] uppercase tracking-widest mb-1">Plan</p>
            <p className="font-arcade text-white text-sm md:text-base tracking-wide">
              {membresia.plan_nombre}
            </p>
          </div>
          <div>
            <p className="font-mono text-white/30 text-[10px] uppercase tracking-widest mb-1">Precio</p>
            <p className="font-arcade text-gym-logo text-sm md:text-base tracking-wide">
              S/ {membresia.plan_precio}
            </p>
          </div>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="size-3.5 text-white/20" />
            <div>
              <p className="font-mono text-white/30 text-[9px] uppercase tracking-widest">Inicio</p>
              <p className="font-mono text-white/70 text-xs">{formatDate(membresia.fecha_inicio)}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className={cn('size-3.5', esActiva ? 'text-white/20' : 'text-red-400/50')} />
            <div>
              <p className="font-mono text-white/30 text-[9px] uppercase tracking-widest">Vencimiento</p>
              <p className={cn('font-mono text-xs', esActiva ? 'text-white/70' : 'text-red-400')}>
                {formatDate(membresia.fecha_fin)}
              </p>
            </div>
          </div>
        </div>

        {/* Contador días */}
        <div className="text-center py-4 border-y border-white/5">
          <div
            className={cn(
              'font-arcade text-5xl md:text-6xl tabular-nums',
              getDiasColor(dias),
              getDiasGlow(dias),
              dias <= 7 && dias >= 0 ? 'animate-pulse' : ''
            )}
          >
            {Math.abs(dias)}
          </div>
          <p className={cn('font-mono text-xs mt-2 tracking-wider uppercase', getDiasColor(dias))}>
            {dias > 1
              ? 'días restantes'
              : dias === 1
              ? 'día restante'
              : dias === 0
              ? 'Vence hoy'
              : `Venció hace ${Math.abs(dias)} días`}
          </p>
          {esActiva && dias > 7 && (() => {
            const [y, m, d] = membresia.fecha_fin.split('-').map(Number)
            const fechaFin = new Date(y, m - 1, d)
            fechaFin.setDate(fechaFin.getDate() - 7)
            return (
              <p className="font-mono text-white/30 text-[10px] mt-2 tracking-wider">
                Podrás renovar el {formatDate(fechaFin.toISOString().split('T')[0])}
              </p>
            )
          })()}
        </div>

        {/* CTA — activa y por vencer: elegir plan en /membresias */}
        {esActiva && dias <= 7 && (
          <Link href="/membresias" className="block">
            <Button className="w-full bg-gym-logo text-black hover:bg-gym-logo/80 font-arcade text-[10px] tracking-widest uppercase gap-2">
              <AlertTriangle className="size-3.5" />
              Renovar Membresía
            </Button>
          </Link>
        )}

        {/* CTA — vencida: ir a elegir plan en /membresias */}
        {!esActiva && (
          <Link href="/membresias" className="block">
            <Button className="w-full bg-red-500 text-white hover:bg-red-400 font-arcade text-[10px] tracking-widest uppercase gap-2">
              <Clock className="size-3.5" />
              Renovar Ahora
            </Button>
          </Link>
        )}
      </div>
    </div>
  )
}

/* ─── Main page ───────────────────────────────────────────────────────────── */

export default function MiMembresiaPage() {
  const [data, setData] = useState<PageData | null>(null)
  const [planes, setPlanes] = useState<PlanMembresia[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      setError(null)
      try {
        const [membresiaRes, planesRes] = await Promise.all([
          fetch('/api/mi-membresia'),
          fetch('/api/planes/public'),
        ])

        if (!membresiaRes.ok) throw new Error('Error al cargar la membresía')

        const membresiaData = await membresiaRes.json()
        setData(membresiaData)

        if (planesRes.ok) {
          const planesData = await planesRes.json()
          setPlanes(planesData.planes || [])
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar los datos')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  /* Loading */
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="size-10 text-gym-logo animate-spin" />
        <p className="font-mono text-white/30 text-xs tracking-widest uppercase">
          Cargando tu membresía...
        </p>
      </div>
    )
  }

  /* Error */
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
        <div className="text-center space-y-2">
          <ShieldOff className="size-10 text-red-400 mx-auto" />
          <p className="font-mono text-red-400 text-sm">{error}</p>
        </div>
        <Button
          onClick={() => window.location.reload()}
          className="bg-gym-logo text-black hover:bg-gym-logo/80 font-arcade text-[10px] tracking-widest uppercase gap-2"
        >
          <RefreshCw className="size-3.5" />
          Reintentar
        </Button>
      </div>
    )
  }

  const historialPagos: PagoHistorial[] = data?.historialPagos || []

  /* Hero title */
  const heroTitle = data?.membresiaActiva
    ? <><span className="text-gym-logo [text-shadow:0_0_20px_rgba(255,223,0,0.5)]">Mi</span> Membresía</>
    : data?.membresiaVencida
    ? <>Membresía <span className="text-red-400 [text-shadow:0_0_20px_rgba(239,68,68,0.4)]">Vencida</span></>
    : <>¡Únete a <span className="text-gym-logo [text-shadow:0_0_20px_rgba(255,223,0,0.5)]">FULLFORMA</span>!</>

  const heroDesc = data?.membresiaActiva
    ? 'Consulta el estado de tu plan y tu historial de pagos.'
    : data?.membresiaVencida
    ? <><span className="text-gym-logo/80">Renueva tu membresía</span> para seguir entrenando.</>
    : <>Elige un plan y comienza tu transformación. <span className="text-gym-logo/80">Sin contratos largos.</span></>

  return (
    <div className="space-y-8 md:space-y-10">
      {/* Hero section */}
      <section className="relative border-b border-gym-logo/20 overflow-hidden pb-8">
        <GridBackground />
        <div className="relative z-10 flex flex-col items-center text-center gap-4">
          <div className="flex items-center gap-3">
            <div className="h-px w-8 md:w-16 bg-gym-logo" />
            <span className="font-arcade text-gym-logo text-[8px] md:text-[10px] tracking-widest uppercase">
              Portal Socio
            </span>
            <div className="h-px w-8 md:w-16 bg-gym-logo" />
          </div>

          <h1 className="font-arcade text-white text-xl md:text-3xl lg:text-4xl tracking-wide uppercase leading-relaxed">
            {heroTitle}
          </h1>

          <p className="font-mono text-white/40 text-xs md:text-sm max-w-md leading-relaxed">
            {heroDesc}
          </p>

          {/* Stats */}
          {(data?.membresiaActiva || data?.membresiaVencida) && (
            <div className="flex items-center gap-8 md:gap-16 mt-2 pt-4 border-t border-white/10 w-full max-w-xs justify-center">
              <div className="flex flex-col items-center gap-1">
                <span className={cn(
                  'font-arcade text-lg md:text-2xl',
                  data.membresiaActiva ? 'text-green-400' : 'text-red-400'
                )}>
                  {data.membresiaActiva ? data.membresiaActiva.dias_restantes : 0}
                </span>
                <span className="font-arcade text-[8px] md:text-[10px] text-white/30 uppercase tracking-wider">
                  Días
                </span>
              </div>
              <div className="h-8 w-px bg-white/10" />
              <div className="flex flex-col items-center gap-1">
                <span className="font-arcade text-gym-logo text-lg md:text-2xl">
                  {historialPagos.filter(p => p.estado === 'completado').length}
                </span>
                <span className="font-arcade text-[8px] md:text-[10px] text-white/30 uppercase tracking-wider">
                  Pagos
                </span>
              </div>
              <div className="h-8 w-px bg-white/10" />
              <div className="flex flex-col items-center gap-1">
                <ShieldCheck className={cn(
                  'size-5 md:size-6',
                  data.membresiaActiva ? 'text-green-400' : 'text-red-400'
                )} />
                <span className="font-arcade text-[8px] md:text-[10px] text-white/30 uppercase tracking-wider">
                  {data.membresiaActiva ? 'Activa' : 'Inactiva'}
                </span>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Content — membresía activa */}
      {data?.membresiaActiva && (
        <>
          <TarjetaMembresiaArcade membresia={data.membresiaActiva} estado="activa" />
          <HistorialPagos pagos={historialPagos} />
        </>
      )}

      {/* Content — membresía vencida */}
      {!data?.membresiaActiva && data?.membresiaVencida && (
        <>
          <TarjetaMembresiaArcade membresia={data.membresiaVencida} estado="vencida" />
          <HistorialPagos pagos={historialPagos} />
        </>
      )}

      {/* Content — sin membresía */}
      {!data?.membresiaActiva && !data?.membresiaVencida && (
        <>
          <section>
            <SectionLabel>Planes Disponibles</SectionLabel>
            <ListaPlanesMembresia
              planes={planes.map((p) => ({
                ...p,
                descripcion: p.descripcion ?? undefined,
              }))}
            />
          </section>
          {historialPagos.length > 0 && <HistorialPagos pagos={historialPagos} />}
        </>
      )}

      {/* Footer */}
      <section className="border-t border-white/5 pt-6">
        <p className="text-center font-mono text-white/30 text-xs md:text-sm">
          ¿Necesitas ayuda?{' '}
          <Link href="/#sedes" className="text-gym-logo hover:underline">
            Visítanos en nuestra sede
          </Link>{' '}
          o llama al{' '}
          <span className="text-white/50">(01) 555-1234</span>
        </p>
      </section>
    </div>
  )
}
