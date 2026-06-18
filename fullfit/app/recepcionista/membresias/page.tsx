'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CreditCard, Construction } from 'lucide-react'

export default function MembresiasPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Membresías</h1>
        <p className="text-zinc-400">
          Gestión de membresías de clientes
        </p>
      </div>

      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader className="text-center">
          <CardTitle className="text-lg text-white flex items-center justify-center gap-2">
            <Construction className="w-5 h-5 text-yellow-400" />
            Próximamente
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <CreditCard className="w-16 h-16 text-zinc-600 mx-auto" />
          <p className="text-zinc-400">
            Esta sección está en desarrollo. Pronto podrás:
          </p>
          <ul className="text-zinc-500 text-sm space-y-2">
            <li>• Registrar nuevas membresías</li>
            <li>• Renovar membresías existentes</li>
            <li>• Pausar o cancelar membresías</li>
            <li>• Ver historial de membresías</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}