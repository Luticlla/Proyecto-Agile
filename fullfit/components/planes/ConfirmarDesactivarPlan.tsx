'use client'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { useState } from 'react'
import { Loader2 } from 'lucide-react'

interface ConfirmarDesactivarPlanProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => Promise<void>
  nombrePlan: string
  activo: boolean
}

export function ConfirmarDesactivarPlan({
  isOpen,
  onClose,
  onConfirm,
  nombrePlan,
  activo
}: ConfirmarDesactivarPlanProps) {
  const [loading, setLoading] = useState(false)

  const handleConfirm = async () => {
    setLoading(true)
    try {
      await onConfirm()
    } finally {
      setLoading(false)
      onClose()
    }
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={(open: boolean) => !loading && !open && onClose()}>
      <AlertDialogContent className="bg-zinc-900 border-zinc-800 text-white">
        <AlertDialogHeader>
          <AlertDialogTitle>
            {activo ? '¿Desactivar plan?' : '¿Activar plan?'}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-zinc-400">
            {activo
              ? `¿Estás seguro de desactivar el plan "${nombrePlan}"? Este plan no será visible en la página pública para nuevos clientes. Los miembros actuales mantendrán su acceso hasta la fecha de vencimiento.`
              : `¿Estás seguro de activar el plan "${nombrePlan}"? Este plan será visible en la página pública para nuevos clientes.`}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading} className="bg-transparent border-zinc-700 hover:bg-zinc-800 text-white">
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={loading}
            className={activo ? "bg-red-500 hover:bg-red-600 text-white" : "bg-green-500 hover:bg-green-600 text-white"}
          >
            {loading ? <Loader2 className="size-4 animate-spin mr-2" /> : null}
            {activo ? 'Desactivar' : 'Activar'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
