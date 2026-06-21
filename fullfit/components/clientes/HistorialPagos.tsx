'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Receipt, Banknote, CreditCard as CreditCardIcon } from 'lucide-react'
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

export function HistorialPagos({ pagos, loading }: HistorialPagosProps) {
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
              <div
                key={pago.id}
                className="flex items-center justify-between p-3 rounded-lg bg-zinc-800/50 border border-zinc-700/50"
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
                <BadgeEstadoPago estado={pago.estado} />
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
