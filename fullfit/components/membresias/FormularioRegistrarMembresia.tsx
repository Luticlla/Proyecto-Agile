'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Loader2, CreditCard, Banknote } from 'lucide-react'
import type { PlanMembresia } from '@/lib/supabase/types'
import type { MetodoPago } from '@/lib/supabase/queries/membresias.types'

type FormularioRegistrarMembresiaProps = {
  clienteNombre: string
  planes: PlanMembresia[]
  onSubmit: (datos: {
    plan_id: number
    metodo_pago: MetodoPago
    monto: number
  }) => Promise<void>
  loading?: boolean
}

export function FormularioRegistrarMembresia({
  clienteNombre,
  planes,
  onSubmit,
  loading = false
}: FormularioRegistrarMembresiaProps) {
  const [planSeleccionado, setPlanSeleccionado] = useState<number | null>(null)
  const [metodoPago, setMetodoPago] = useState<MetodoPago>('efectivo')

  const plan = planes.find(p => p.id === planSeleccionado)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!planSeleccionado || !plan) return

    await onSubmit({
      plan_id: planSeleccionado,
      metodo_pago: metodoPago,
      monto: plan.precio
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-medium text-white">Registrar Membresía</h3>
        <p className="text-sm text-zinc-400">
          Cliente: <span className="text-white">{clienteNombre}</span>
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label className="text-zinc-300">Seleccionar Plan</Label>
          <div className="grid gap-3">
            {planes.filter(p => p.activo).map((p) => (
              <label
                key={p.id}
                className={`flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-colors ${
                  planSeleccionado === p.id
                    ? 'border-yellow-500 bg-yellow-500/10'
                    : 'border-zinc-800 bg-zinc-900 hover:border-zinc-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="plan"
                    value={p.id}
                    checked={planSeleccionado === p.id}
                    onChange={() => setPlanSeleccionado(p.id)}
                    className="accent-yellow-500"
                  />
                  <div>
                    <p className="font-medium text-white">{p.nombre}</p>
                    <p className="text-sm text-zinc-400">
                      {p.duracion_dias} días
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-white">S/ {p.precio.toFixed(2)}</p>
                  <p className="text-xs text-zinc-400">
                    S/ {(p.precio / (p.duracion_dias / 30)).toFixed(2)}/mes
                  </p>
                </div>
              </label>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-zinc-300">Método de Pago</Label>
          <div className="grid grid-cols-2 gap-3">
            <label
              className={`flex items-center justify-center gap-2 p-4 rounded-lg border cursor-pointer transition-colors ${
                metodoPago === 'efectivo'
                  ? 'border-green-500 bg-green-500/10'
                  : 'border-zinc-800 bg-zinc-900 hover:border-zinc-700'
              }`}
            >
              <input
                type="radio"
                name="metodoPago"
                value="efectivo"
                checked={metodoPago === 'efectivo'}
                onChange={() => setMetodoPago('efectivo')}
                className="accent-green-500"
              />
              <Banknote className="size-5 text-green-400" />
              <span className="text-white">Efectivo</span>
            </label>
            <label
              className={`flex items-center justify-center gap-2 p-4 rounded-lg border cursor-pointer transition-colors ${
                metodoPago === 'mercadopago'
                  ? 'border-blue-500 bg-blue-500/10'
                  : 'border-zinc-800 bg-zinc-900 hover:border-zinc-700'
              }`}
            >
              <input
                type="radio"
                name="metodoPago"
                value="mercadopago"
                checked={metodoPago === 'mercadopago'}
                onChange={() => setMetodoPago('mercadopago')}
                className="accent-blue-500"
              />
              <CreditCard className="size-5 text-blue-400" />
              <span className="text-white">MercadoPago</span>
            </label>
          </div>
        </div>

        {plan && (
          <div className="p-4 rounded-lg bg-zinc-900 border border-zinc-800">
            <div className="flex justify-between items-center">
              <span className="text-zinc-400">Total a pagar:</span>
              <span className="text-2xl font-bold text-white">S/ {plan.precio.toFixed(2)}</span>
            </div>
            <p className="text-sm text-zinc-500 mt-1">
              Vigencia: {plan.duracion_dias} días desde la fecha de inicio
            </p>
          </div>
        )}
      </div>

      <Button
        type="submit"
        disabled={!planSeleccionado || loading}
        className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-medium"
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Procesando...
          </>
        ) : (
          'Registrar Membresía'
        )}
      </Button>
    </form>
  )
}
