'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { obtenerCliente } from '@/lib/supabase/queries/clientes'
import { ProfileWithEmail } from '@/lib/supabase/types'
import { TarjetaCliente, FormularioEditarCliente } from '@/components/clientes'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Edit, Loader2 } from 'lucide-react'
import Link from 'next/link'

export default function ClienteDetailPage() {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [cliente, setCliente] = useState<ProfileWithEmail | null>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(searchParams.get('edit') === 'true')

  useEffect(() => {
    const fetchCliente = async () => {
      if (params.id) {
        const data = await obtenerCliente(params.id as string)
        setCliente(data)
        setLoading(false)
      }
    }

    fetchCliente()
  }, [params.id])

  const handleSave = (updatedCliente: ProfileWithEmail) => {
    setCliente(updatedCliente)
    setEditing(false)
  }

  const handleCancel = () => {
    setEditing(false)
    router.replace(`/recepcionista/clientes/${params.id}`)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 text-zinc-400 animate-spin" />
      </div>
    )
  }

  if (!cliente) {
    return (
      <div className="text-center py-12">
        <p className="text-zinc-400">Cliente no encontrado</p>
        <Link href="/recepcionista/clientes">
          <Button variant="link" className="text-yellow-400 mt-4">
            Volver a la lista
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/recepcionista/clientes">
            <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white">
              {cliente.nombre} {cliente.apellido}
            </h1>
            <p className="text-zinc-400">Detalle del cliente</p>
          </div>
        </div>
        {!editing && (
          <Button
            onClick={() => setEditing(true)}
            className="bg-yellow-400 text-zinc-950 hover:bg-yellow-300"
          >
            <Edit className="w-4 h-4 mr-2" />
            Editar
          </Button>
        )}
      </div>

      {editing ? (
        <FormularioEditarCliente
          cliente={cliente}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      ) : (
        <TarjetaCliente cliente={cliente} />
      )}
    </div>
  )
}