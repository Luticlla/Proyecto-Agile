'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import {
  Receipt,
  CreditCard,
  Banknote,
  CheckCircle,
  XCircle,
  Clock,
  X,
  Download,
  Building2,
  MapPin,
  Phone,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

export type PagoHistorial = {
  id: number
  monto: number
  metodo_pago: string
  estado: string
  referencia: string | null
  observaciones: string | null
  creado_en: string
}

type HistorialPagosProps = {
  pagos: PagoHistorial[]
}

/* ─── helpers ─────────────────────────────────────────────────────────────── */

function getEstadoConfig(estado: string) {
  switch (estado) {
    case 'completado':
      return { label: 'Completado', icon: CheckCircle, color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/20', dot: 'bg-green-400' }
    case 'fallido':
      return { label: 'Fallido', icon: XCircle, color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20', dot: 'bg-red-400' }
    case 'pendiente':
      return { label: 'Pendiente', icon: Clock, color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/20', dot: 'bg-yellow-400' }
    default:
      return { label: estado, icon: Clock, color: 'text-white/40', bg: 'bg-white/5 border-white/10', dot: 'bg-white/30' }
  }
}

function getMetodoConfig(metodo: string) {
  switch (metodo) {
    case 'mercadopago':
      return { label: 'Virtual', sublabel: 'MercadoPago', icon: CreditCard, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' }
    case 'efectivo':
      return { label: 'Presencial', sublabel: 'Efectivo', icon: Banknote, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' }
    default:
      return { label: 'Otro', sublabel: metodo, icon: Receipt, color: 'text-white/40', bg: 'bg-white/5 border-white/10' }
  }
}

function formatFechaLarga(fechaStr: string): string {
  try {
    return new Date(fechaStr).toLocaleDateString('es-PE', {
      day: '2-digit', month: 'long', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    })
  } catch { return fechaStr }
}

function formatFechaCorta(fechaStr: string): string {
  try {
    return new Date(fechaStr).toLocaleDateString('es-PE', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    })
  } catch { return fechaStr }
}

function getNumeroBoleta(pago: PagoHistorial): string {
  const ref = pago.referencia ? String(pago.referencia).slice(-8) : String(pago.id).padStart(8, '0')
  return `FF-${ref}`
}

/* ─── Modal Boleta ─────────────────────────────────────────────────────────── */

function ModalBoleta({ pago, onClose }: { pago: PagoHistorial; onClose: () => void }) {
  const metodo = getMetodoConfig(pago.metodo_pago)
  const estado = getEstadoConfig(pago.estado)
  const numero = getNumeroBoleta(pago)
  const MetodoIcon = metodo.icon
  const EstadoIcon = estado.icon

  // Extraer nombre del plan de observaciones si existe
  const planNombre = pago.observaciones
    ?.replace('MercadoPago - ', '')
    ?.replace('Extensión de membresía -', 'Renovación -')
    ?.replace('Ya posee membresía activa - pago registrado sin suscripción', 'Membresía ya activa')
    || 'Membresía FULLFORMA'

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative z-10 w-full max-w-sm bg-black border border-gym-logo/30 rounded-xl overflow-hidden shadow-2xl shadow-gym-logo/10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Grid bg */}
        <div
          className="absolute inset-0 opacity-[0.025] pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,223,0,0.5) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,223,0,0.5) 1px, transparent 1px)
            `,
            backgroundSize: '30px 30px',
          }}
        />

        {/* Header */}
        <div className="relative z-10 flex items-center justify-between px-5 pt-5 pb-3 border-b border-gym-logo/20">
          <div className="flex items-center gap-2">
            <Receipt className="size-4 text-gym-logo" />
            <span className="font-arcade text-gym-logo text-[10px] tracking-widest uppercase">
              Comprobante de Pago
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-white/30 hover:text-white transition-colors rounded-full hover:bg-white/10 p-1"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Body */}
        <div className="relative z-10 p-5 space-y-4">
          {/* Gimnasio info */}
          <div className="text-center space-y-1 pb-3 border-b border-white/10">
            <p className="font-arcade text-white text-sm tracking-widest uppercase">
              FULL<span className="text-gym-logo">FORMA</span>
            </p>
            <div className="flex items-center justify-center gap-1 text-white/30">
              <Building2 className="size-2.5" />
              <span className="font-mono text-[9px]">FULLFORMA Gym</span>
            </div>
            <div className="flex items-center justify-center gap-1 text-white/30">
              <MapPin className="size-2.5" />
              <span className="font-mono text-[9px]">Av. Principal 123, Trujillo</span>
            </div>
            <div className="flex items-center justify-center gap-1 text-white/30">
              <Phone className="size-2.5" />
              <span className="font-mono text-[9px]">(044) 123456</span>
            </div>
          </div>

          {/* Número y fecha */}
          <div className="flex justify-between items-start">
            <div>
              <p className="font-mono text-white/30 text-[9px] uppercase tracking-widest">N° Boleta</p>
              <p className="font-mono text-gym-logo text-xs font-semibold">{numero}</p>
            </div>
            <div className="text-right">
              <p className="font-mono text-white/30 text-[9px] uppercase tracking-widest">Fecha</p>
              <p className="font-mono text-white/70 text-[10px]">{formatFechaLarga(pago.creado_en)}</p>
            </div>
          </div>

          {/* Separador punteado */}
          <div className="border-t border-dashed border-white/10" />

          {/* Detalle */}
          <div className="space-y-2">
            <p className="font-mono text-white/30 text-[9px] uppercase tracking-widest">Detalle</p>
            <div className="flex justify-between items-start">
              <span className="font-mono text-white text-sm flex-1 pr-4">{planNombre}</span>
              <span className="font-mono text-gym-logo text-sm font-semibold shrink-0">
                S/ {Number(pago.monto).toFixed(2)}
              </span>
            </div>
          </div>

          {/* Separador punteado */}
          <div className="border-t border-dashed border-white/10" />

          {/* Total */}
          <div className="flex justify-between items-center">
            <span className="font-arcade text-white/60 text-[10px] tracking-widest uppercase">Total</span>
            <span className="font-arcade text-gym-logo text-lg [text-shadow:0_0_12px_rgba(255,223,0,0.4)]">
              S/ {Number(pago.monto).toFixed(2)}
            </span>
          </div>

          {/* Método y estado */}
          <div className="flex gap-2">
            <div className={cn('flex items-center gap-1.5 px-2.5 py-1.5 rounded border flex-1', metodo.bg)}>
              <MetodoIcon className={cn('size-3 shrink-0', metodo.color)} />
              <div>
                <p className={cn('font-arcade text-[8px] tracking-wider uppercase leading-none', metodo.color)}>
                  {metodo.label}
                </p>
                <p className="font-mono text-[8px] text-white/30 leading-none mt-0.5">{metodo.sublabel}</p>
              </div>
            </div>
            <div className={cn('flex items-center gap-1.5 px-2.5 py-1.5 rounded border flex-1', estado.bg)}>
              <EstadoIcon className={cn('size-3 shrink-0', estado.color)} />
              <p className={cn('font-mono text-[10px]', estado.color)}>{estado.label}</p>
            </div>
          </div>

          {/* Referencia */}
          {pago.referencia && (
            <p className="font-mono text-white/20 text-[9px] text-center">
              Ref: {pago.referencia}
            </p>
          )}

          {/* Separador punteado */}
          <div className="border-t border-dashed border-white/10" />

          <p className="font-mono text-white/20 text-[9px] text-center">
            ¡Gracias por entrenar con nosotros!
          </p>
        </div>

        {/* Footer */}
        <div className="relative z-10 px-5 pb-5">
          <Button
            onClick={onClose}
            variant="outline"
            size="sm"
            className="w-full border-white/10 text-white/40 hover:text-white hover:border-white/30 font-arcade text-[9px] tracking-widest uppercase bg-transparent"
          >
            Cerrar
          </Button>
        </div>
      </div>
    </div>
  )
}

/* ─── Main component ───────────────────────────────────────────────────────── */

export function HistorialPagos({ pagos }: HistorialPagosProps) {
  const [pagoSeleccionado, setPagoSeleccionado] = useState<PagoHistorial | null>(null)

  return (
    <>
      <section className="space-y-4">
        {/* Section header */}
        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-white/10" />
          <div className="flex items-center gap-2">
            <Receipt className="size-3.5 text-gym-logo" />
            <span className="font-arcade text-gym-logo text-[9px] md:text-[10px] tracking-widest uppercase">
              Historial de Pagos
            </span>
          </div>
          <div className="h-px flex-1 bg-white/10" />
        </div>

        {pagos.length === 0 ? (
          <div className="border border-white/10 rounded-lg bg-white/[0.02] p-8 text-center">
            <Receipt className="size-8 text-white/20 mx-auto mb-3" />
            <p className="font-mono text-white/40 text-sm">Sin historial de pagos</p>
            <p className="font-mono text-white/20 text-xs mt-1">
              Tus pagos aparecerán aquí una vez que actives tu membresía
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            <p className="font-mono text-white/25 text-[10px] text-center tracking-wider uppercase">
              Toca un pago para ver su comprobante
            </p>
            {pagos.map((pago) => {
              const estadoConf = getEstadoConfig(pago.estado)
              const metodoConf = getMetodoConfig(pago.metodo_pago)
              const EstadoIcon = estadoConf.icon
              const MetodoIcon = metodoConf.icon

              return (
                <button
                  key={pago.id}
                  onClick={() => setPagoSeleccionado(pago)}
                  className="group relative border border-white/10 rounded-lg bg-white/[0.02] hover:bg-white/[0.05] hover:border-gym-logo/30 transition-all duration-200 overflow-hidden w-full text-left cursor-pointer"
                >
                  {/* Side accent */}
                  <div className={cn('absolute left-0 top-0 bottom-0 w-0.5', estadoConf.dot)} />

                  <div className="flex items-center gap-3 p-3 pl-4">
                    {/* Metodo badge */}
                    <div className={cn('flex items-center gap-1.5 px-2 py-1 rounded border text-xs shrink-0', metodoConf.bg)}>
                      <MetodoIcon className={cn('size-3', metodoConf.color)} />
                      <div>
                        <span className={cn('font-arcade text-[8px] tracking-wider uppercase block leading-none', metodoConf.color)}>
                          {metodoConf.label}
                        </span>
                        <span className="font-mono text-[8px] text-white/30 block leading-none mt-0.5">
                          {metodoConf.sublabel}
                        </span>
                      </div>
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-white text-sm font-semibold">
                          S/ {Number(pago.monto).toFixed(2)}
                        </span>
                        <div className={cn('flex items-center gap-1 px-1.5 py-0.5 rounded border text-[10px]', estadoConf.bg)}>
                          <EstadoIcon className={cn('size-2.5', estadoConf.color)} />
                          <span className={cn('font-mono', estadoConf.color)}>{estadoConf.label}</span>
                        </div>
                      </div>
                      {pago.observaciones && (
                        <p className="font-mono text-white/30 text-[10px] mt-0.5 truncate">
                          {pago.observaciones}
                        </p>
                      )}
                    </div>

                    {/* Date + ref */}
                    <div className="text-right shrink-0">
                      <p className="font-mono text-white/40 text-[10px]">
                        {formatFechaCorta(pago.creado_en)}
                      </p>
                      {pago.referencia && (
                        <p className="font-mono text-white/20 text-[9px] mt-0.5">
                          #{String(pago.referencia).slice(-8)}
                        </p>
                      )}
                    </div>

                    {/* Arrow hint */}
                    <Receipt className="size-3.5 text-white/10 group-hover:text-gym-logo/40 transition-colors shrink-0" />
                  </div>
                </button>
              )
            })}
          </div>
        )}
      </section>

      {/* Modal boleta */}
      {pagoSeleccionado && (
        <ModalBoleta
          pago={pagoSeleccionado}
          onClose={() => setPagoSeleccionado(null)}
        />
      )}
    </>
  )
}
