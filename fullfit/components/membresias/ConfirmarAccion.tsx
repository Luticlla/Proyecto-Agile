'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'

type ConfirmarAccionProps = {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  titulo: string
  descripcion: string
  loading?: boolean
  variante?: 'danger' | 'warning' | 'default'
}

export function ConfirmarAccion({
  open,
  onClose,
  onConfirm,
  titulo,
  descripcion,
  loading = false,
  variante = 'default'
}: ConfirmarAccionProps) {
  const buttonStyles = {
    danger: 'bg-red-600 hover:bg-red-700 text-white',
    warning: 'bg-yellow-600 hover:bg-yellow-700 text-white',
    default: 'bg-zinc-700 hover:bg-zinc-600 text-white'
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-zinc-900 border-zinc-800">
        <DialogHeader>
          <DialogTitle className="text-white">{titulo}</DialogTitle>
          <DialogDescription className="text-zinc-400">
            {descripcion}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={loading}
            className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
          >
            Cancelar
          </Button>
          <Button
            onClick={onConfirm}
            disabled={loading}
            className={buttonStyles[variante]}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Procesando...
              </>
            ) : (
              'Confirmar'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
