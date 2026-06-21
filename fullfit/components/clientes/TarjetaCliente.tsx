'use client'

import { ProfileWithEmail } from '@/lib/supabase/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { User, Mail, Phone, CreditCard, Calendar } from 'lucide-react'

type TarjetaClienteProps = {
  cliente: ProfileWithEmail
}

export function TarjetaCliente({ cliente }: TarjetaClienteProps) {
  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg text-white">
            {cliente.nombre} {cliente.apellido}
          </CardTitle>
          <Badge 
            variant={cliente.activo ? 'default' : 'secondary'}
            className={cliente.activo 
              ? 'bg-green-500/20 text-green-400 border-green-500/30' 
              : 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30'
            }
          >
            {cliente.activo ? 'Activo' : 'Inactivo'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-3 text-zinc-300">
          <CreditCard className="size-4 text-zinc-500" />
          <span className="text-sm">DNI: {cliente.dni || 'No registrado'}</span>
        </div>
        <div className="flex items-center gap-3 text-zinc-300">
          <Mail className="size-4 text-zinc-500" />
          <span className="text-sm">Email: {cliente.email || 'No registrado'}</span>
        </div>
        <div className="flex items-center gap-3 text-zinc-300">
          <Phone className="size-4 text-zinc-500" />
          <span className="text-sm">Teléfono: {cliente.telefono || 'No registrado'}</span>
        </div>
        <div className="flex items-center gap-3 text-zinc-300">
          <User className="size-4 text-zinc-500" />
          <span className="text-sm">Género: {cliente.genero || 'No especificado'}</span>
        </div>
        <div className="flex items-center gap-3 text-zinc-300">
          <Calendar className="size-4 text-zinc-500" />
          <span className="text-sm">
            Fecha nacimiento: {cliente.fecha_nacimiento || 'No registrada'}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}