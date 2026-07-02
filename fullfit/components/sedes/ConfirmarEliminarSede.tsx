'use client'

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { AlertTriangle } from 'lucide-react'

interface ConfirmarEliminarSedeProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  nombreSede: string
}

export function ConfirmarEliminarSede({ isOpen, onClose, onConfirm, nombreSede }: ConfirmarEliminarSedeProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent className="bg-zinc-900 border-zinc-800">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-white flex items-center gap-2">
            <AlertTriangle className="size-5 text-red-400" />
            Eliminar Sede
          </AlertDialogTitle>
          <AlertDialogDescription className="text-zinc-400">
            ¿Estás seguro de eliminar la sede &quot;{nombreSede}&quot;? Esta acción no se puede deshacer. Se eliminará la sede y su imagen permanentemente.
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
