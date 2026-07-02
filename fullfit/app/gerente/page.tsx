import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Users, ArrowRight } from 'lucide-react'

export default function GerentePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div className="text-center space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">
          Panel de Gerencia
        </h1>
        <p className="text-gray-500 max-w-md">
          Gestiona los usuarios del sistema, crea cuentas de administradores y recepcionistas.
        </p>
        <Link href="/gerente/usuarios">
          <Button className="bg-yellow-500 text-gray-900 hover:bg-yellow-400">
            <Users className="size-4 mr-2" />
            Gestionar Usuarios del Sistema
            <ArrowRight className="size-4 ml-2" />
          </Button>
        </Link>
      </div>
    </div>
  )
}
