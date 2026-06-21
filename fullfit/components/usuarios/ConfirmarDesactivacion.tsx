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

interface ConfirmarDesactivacionProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => Promise<void>
  nombreUsuario: string
  activo: boolean
}

export function ConfirmarDesactivacion({
  isOpen,
  onClose,
  onConfirm,
  nombreUsuario,
  activo
}: ConfirmarDesactivacionProps) {
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
            {activo ? '¿Desactivar usuario?' : '¿Activar usuario?'}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-zinc-400">
            {activo 
              ? `¿Estás seguro de desactivar la cuenta de ${nombreUsuario}? Este usuario no podrá iniciar sesión hasta que sea reactivado.`
              : `¿Estás seguro de reactivar la cuenta de ${nombreUsuario}? El usuario volverá a tener acceso al sistema según su rol.`}
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
