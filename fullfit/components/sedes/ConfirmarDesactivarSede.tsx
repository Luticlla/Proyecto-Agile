'use client'

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'

interface ConfirmarDesactivarSedeProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  nombreSede: string
  activa: boolean
}

export function ConfirmarDesactivarSede({ isOpen, onClose, onConfirm, nombreSede, activa }: ConfirmarDesactivarSedeProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent className="bg-zinc-900 border-zinc-800">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-white">
            {activa ? 'Desactivar Sede' : 'Activar Sede'}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-zinc-400">
            {activa
              ? `¿Estás seguro de desactivar la sede "${nombreSede}"? Esta sede no aparecerá en la página pública para socios.`
              : `¿Estás seguro de activar la sede "${nombreSede}"? Esta sede volverá a aparecer en la página pública para socios.`
            }
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="bg-transparent border-zinc-700 text-white hover:bg-zinc-800">
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className={activa
              ? 'bg-red-600 text-white hover:bg-red-500'
              : 'bg-green-600 text-white hover:bg-green-500'
            }
          >
            {activa ? 'Desactivar' : 'Activar'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
