'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Receipt,
  Banknote,
  CreditCard as CreditCardIcon,
  X,
  Download,
  Building2,
  MapPin,
  Loader2,
} from 'lucide-react'
import type { PagoResumen } from '@/lib/supabase/queries/clientes.types'

type HistorialPagosProps = {
  pagos: PagoResumen[]
  loading?: boolean
}

const METODOS_PAGO: Record<string, { label: string; icon: React.ReactNode }> = {
  efectivo: { label: 'Efectivo', icon: <Banknote className="size-3" /> },
  mercadopago: { label: 'MercadoPago', icon: <CreditCardIcon className="size-3" /> },
  tarjeta_debito: { label: 'Tarjeta Débito', icon: <CreditCardIcon className="size-3" /> },
  tarjeta_credito: { label: 'Tarjeta Crédito', icon: <CreditCardIcon className="size-3" /> },
  yape: { label: 'Yape', icon: <CreditCardIcon className="size-3" /> },
  plin: { label: 'Plin', icon: <CreditCardIcon className="size-3" /> },
}

/* ─── helpers ─────────────────────────────────────────────────────────────── */

function BadgeEstadoPago({ estado }: { estado: string }) {
  const config: Record<string, { label: string; className: string }> = {
    completado: { label: 'Completado', className: 'bg-green-500/20 text-green-400 border-green-500/30' },
    pendiente: { label: 'Pendiente', className: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
    fallido: { label: 'Fallido', className: 'bg-red-500/20 text-red-400 border-red-500/30' },
    reembolsado: { label: 'Reembolsado', className: 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30' },
  }
  const { label, className } = config[estado] || config.completado
  return <Badge variant="outline" className={className}>{label}</Badge>
}

function formatFecha(fecha: string): string {
  const d = new Date(fecha)
  return d.toLocaleDateString('es-PE', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

function formatFechaLarga(fecha: string): string {
  return new Date(fecha).toLocaleDateString('es-PE', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function getNumeroBoleta(pago: PagoResumen): string {
  if (pago.referencia && /^B\d{2}-\d{4}$/.test(pago.referencia)) {
    return pago.referencia
  }
  const year = new Date().getFullYear().toString().slice(-2)
  return `B${year}-${(pago.id || 0).toString().padStart(4, '0')}`
}

function getPlanNombre(pago: PagoResumen): string {
  return pago.observaciones
    ?.replace('MercadoPago - ', '')
    ?.replace('Extensión de membresía -', 'Renovación -')
    ?.replace('Ya posee membresía activa - pago registrado sin suscripción', 'Membresía ya activa')
    ?.replace('Periodo:', 'Membresía -')
    || 'Membresía FULLFORMA'
}

/* ─── Modal Boleta ─────────────────────────────────────────────────────────── */

function ModalBoleta({ pago, onClose }: { pago: PagoResumen; onClose: () => void }) {
  const metodo = METODOS_PAGO[pago.metodo_pago] || { label: pago.metodo_pago, icon: <CreditCardIcon className="size-3" /> }
  const numero = getNumeroBoleta(pago)
  const [downloading, setDownloading] = useState(false)

  const handleDownload = async () => {
    setDownloading(true)
    try {
      const response = await fetch(`/api/boleta?pago_id=${pago.id}`)
      if (!response.ok) throw new Error('Error al descargar boleta')

      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `boleta_${numero}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error downloading boleta:', error)
      alert('Error al descargar la boleta')
    } finally {
      setDownloading(false)
    }
  }

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
              Boleta de Venta
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
          {/* Empresa info */}
          <div className="text-center space-y-1 pb-3 border-b border-white/10">
            <p className="font-arcade text-white text-[10px] tracking-widest uppercase">
              ENTERPRISE FITNESS ELITE S.A.C.
            </p>
            <p className="font-arcade text-gym-logo text-sm tracking-widest uppercase">
              FULL<span className="text-white">FORMA</span>
            </p>
            <div className="flex items-center justify-center gap-1 text-white/30">
              <Building2 className="size-2.5" />
              <span className="font-mono text-[8px]">RUC: 20482468692</span>
            </div>
            <div className="flex items-center justify-center gap-1 text-white/30">
              <MapPin className="size-2.5" />
              <span className="font-mono text-[8px]">Jr. Bolognesi N° 231, Trujillo</span>
            </div>
          </div>

          {/* Número y fecha */}
          <div className="flex justify-between items-start">
            <div>
              <p className="font-mono text-white/30 text-[9px] uppercase tracking-widest">N° Comprobante</p>
              <p className="font-mono text-gym-logo text-xs font-semibold">{numero}</p>
            </div>
            <div className="text-right">
              <p className="font-mono text-white/30 text-[9px] uppercase tracking-widest">Fecha Emisión</p>
              <p className="font-mono text-white/70 text-[10px]">{formatFechaLarga(pago.fecha_pago)}</p>
            </div>
          </div>

          {/* Separador punteado */}
          <div className="border-t border-dashed border-white/10" />

          {/* Detalle */}
          <div className="space-y-2">
            <p className="font-mono text-white/30 text-[9px] uppercase tracking-widest">Detalle del Comprobante</p>
            <div className="flex justify-between items-start">
              <span className="font-mono text-white text-sm flex-1 pr-4">{getPlanNombre(pago)}</span>
              <span className="font-mono text-gym-logo text-sm font-semibold shrink-0">
                S/ {Number(pago.monto).toFixed(2)}
              </span>
            </div>
          </div>

          {/* Separador punteado */}
          <div className="border-t border-dashed border-white/10" />

          {/* Total */}
          <div className="flex justify-between items-center">
            <span className="font-arcade text-white/60 text-[10px] tracking-widest uppercase">Importe Total</span>
            <span className="font-arcade text-gym-logo text-lg [text-shadow:0_0_12px_rgba(255,223,0,0.4)]">
              S/ {Number(pago.monto).toFixed(2)}
            </span>
          </div>

          {/* Método y estado */}
          <div className="flex gap-2">
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded border flex-1 bg-zinc-800 border-zinc-700">
              {metodo.icon}
              <span className="font-mono text-[10px] text-white/70">{metodo.label}</span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded border flex-1 bg-zinc-800 border-zinc-700">
              <BadgeEstadoPago estado={pago.estado} />
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
        <div className="relative z-10 px-5 pb-5 space-y-2">
          {pago.estado === 'completado' && (
            <Button
              onClick={handleDownload}
              disabled={downloading}
              className="w-full bg-gym-logo text-black hover:bg-gym-logo/80 font-arcade text-[9px] tracking-widest uppercase gap-2"
            >
              {downloading ? (
                <Loader2 className="size-3 animate-spin" />
              ) : (
                <Download className="size-3" />
              )}
              {downloading ? 'Generando...' : 'Descargar Boleta PDF'}
            </Button>
          )}
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

export function HistorialPagos({ pagos, loading }: HistorialPagosProps) {
  const [pagoSeleccionado, setPagoSeleccionado] = useState<PagoResumen | null>(null)

  if (loading) {
    return (
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg text-white flex items-center gap-2">
            <Receipt className="size-5 text-zinc-400" />
            Historial de Pagos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-zinc-400 text-sm">Cargando historial de pagos...</p>
        </CardContent>
      </Card>
    )
  }

  if (pagos.length === 0) {
    return (
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg text-white flex items-center gap-2">
            <Receipt className="size-5 text-zinc-400" />
            Historial de Pagos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-zinc-400 text-sm">No hay pagos registrados para este cliente.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg text-white flex items-center gap-2">
            <Receipt className="size-5 text-zinc-400" />
            Historial de Pagos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {pagos.map((pago) => {
              const metodo = METODOS_PAGO[pago.metodo_pago] || { label: pago.metodo_pago, icon: <CreditCardIcon className="size-3" /> }
              return (
                <button
                  key={pago.id}
                  onClick={() => setPagoSeleccionado(pago)}
                  className="group w-full flex items-center justify-between p-3 rounded-lg bg-zinc-800/50 border border-zinc-700/50 hover:border-gym-logo/30 hover:bg-zinc-800 transition-all cursor-pointer text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="size-8 rounded-full bg-zinc-700 flex items-center justify-center">
                      {metodo.icon}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">S/ {pago.monto.toFixed(2)}</p>
                      <p className="text-xs text-zinc-400">
                        {metodo.label} — {formatFecha(pago.fecha_pago)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <BadgeEstadoPago estado={pago.estado} />
                    <Receipt className="size-3.5 text-white/10 group-hover:text-gym-logo/40 transition-colors" />
                  </div>
                </button>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {pagoSeleccionado && (
        <ModalBoleta
          pago={pagoSeleccionado}
          onClose={() => setPagoSeleccionado(null)}
        />
      )}
    </>
  )
}
