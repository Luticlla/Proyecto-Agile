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
import { AlertTriangle } from 'lucide-react'

interface ConfirmarEliminarPlanProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  nombrePlan: string
  suscripcionesActivas?: number
}

export function ConfirmarEliminarPlan({
  isOpen,
  onClose,
  onConfirm,
  nombrePlan,
  suscripcionesActivas,
}: ConfirmarEliminarPlanProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent className="bg-zinc-900 border-zinc-800">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-white flex items-center gap-2">
            <AlertTriangle className="size-5 text-red-400" />
            Eliminar Plan
          </AlertDialogTitle>
          <AlertDialogDescription className="text-zinc-400">
            ¿Estás seguro de eliminar el plan &quot;{nombrePlan}&quot;? Esta acción no se puede deshacer.
            {suscripcionesActivas && suscripcionesActivas > 0 && (
              <span className="block mt-2 text-yellow-400">
                Este plan tiene {suscripcionesActivas} suscripción(es) activa(s). Los miembros actuales mantendrán su acceso hasta la fecha de vencimiento.
              </span>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="bg-transparent border-zinc-700 text-white hover:bg-zinc-800">
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-red-600 text-white hover:bg-red-500"
          >
            Eliminar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
