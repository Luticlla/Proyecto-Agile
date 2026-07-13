import { createServiceRoleClient } from '@/lib/supabase/server'
import { getClasesConHorarios } from '@/lib/supabase/queries/clases'
import { listarSedesAdmin } from '@/lib/supabase/queries/sedes'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import ConfiguracionGym from '@/components/gerente/horarios/ConfiguracionGym'
import GestorClases from '@/components/gerente/horarios/GestorClases'
import { Loader2 } from 'lucide-react'

export const dynamic = 'force-dynamic'

async function getSede() {
  const supabase = createServiceRoleClient()
  const result = await listarSedesAdmin({ page: 1, limit: 1 }, supabase)
  return result.data?.[0] ?? null
}

async function getClases() {
  const supabase = createServiceRoleClient()
  return getClasesConHorarios(supabase)
}

const HorariosPage = async () => {
  const [sede, clases] = await Promise.all([getSede(), getClases()])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-arcade text-white uppercase tracking-wider mb-2">
          Gestión de <span className="text-yellow-500">Horarios</span>
        </h1>
        <p className="text-zinc-400">
          Configura los horarios de apertura del gimnasio y administra el calendario de clases grupales.
        </p>
      </div>

      <Tabs defaultValue="clases" className="w-full">
        <TabsList className="bg-zinc-900 border border-zinc-800">
          <TabsTrigger
            value="clases"
            className="data-[state=active]:bg-yellow-500 data-[state=active]:text-zinc-950"
          >
            Clases Grupales
          </TabsTrigger>
          <TabsTrigger
            value="gym"
            className="data-[state=active]:bg-yellow-500 data-[state=active]:text-zinc-950"
          >
            Horario General (Sede)
          </TabsTrigger>
        </TabsList>

        <TabsContent value="clases" className="mt-6">
          <GestorClases clases={clases} sede={sede} />
        </TabsContent>

        <TabsContent value="gym" className="mt-6">
          {sede ? (
            <ConfiguracionGym sede={sede} />
          ) : (
            <div className="p-8 text-center text-zinc-500 border border-zinc-800 rounded-lg bg-zinc-900/50">
              No se encontró una sede activa.
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default HorariosPage