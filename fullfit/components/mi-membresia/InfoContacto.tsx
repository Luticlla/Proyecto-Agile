'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Phone, Mail, Clock } from 'lucide-react'

export function InfoContacto() {
  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
          <Phone className="size-5 text-yellow-400" />
          ¿Necesitas ayuda?
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-3">
          <Phone className="size-4 text-zinc-500" />
          <div>
            <p className="text-sm text-zinc-400">Teléfono</p>
            <p className="text-sm text-white">(01) 555-1234</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Mail className="size-4 text-zinc-500" />
          <div>
            <p className="text-sm text-zinc-400">Email</p>
            <p className="text-sm text-white">contacto@fullfit.com</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Clock className="size-4 text-zinc-500" />
          <div>
            <p className="text-sm text-zinc-400">Horarios</p>
            <p className="text-sm text-white">Lun-Vie: 6am-10pm | Sáb: 7am-8pm</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
