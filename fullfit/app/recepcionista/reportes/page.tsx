'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart3, Construction } from 'lucide-react'

export default function ReportesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Reportes</h1>
        <p className="text-zinc-400">
          Estadísticas y reportes del gimnasio
        </p>
      </div>

      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader className="text-center">
          <CardTitle className="text-lg text-white flex items-center justify-center gap-2">
            <Construction className="size-5 text-yellow-400" />
            Próximamente
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <BarChart3 className="size-16 text-zinc-600 mx-auto" />
          <p className="text-zinc-400">
            Esta sección está en desarrollo. Pronto podrás:
          </p>
          <ul className="text-zinc-500 text-sm space-y-2">
            <li>• Reporte de membresías activas/vencidas</li>
            <li>• Reporte de pagos por período</li>
            <li>• Reporte de nuevos clientes</li>
            <li>• Exportar reportes en PDF/Excel</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}