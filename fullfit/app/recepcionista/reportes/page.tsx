'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart3, Construction } from 'lucide-react'

export default function ReportesPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-gym-logo/20 pb-4">
        <div>
          <h1 className="font-arcade text-2xl md:text-3xl text-white uppercase tracking-widest">Reportes</h1>
          <p className="font-mono text-white/40 text-xs md:text-sm mt-2">
            Estadísticas y reportes del gimnasio
          </p>
        </div>
      </div>

      <Card className="bg-black border-gym-logo/20 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,223,0,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,223,0,0.5) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
        <div className="relative z-10">
          <CardHeader className="text-center border-b border-white/5 pb-6">
            <CardTitle className="font-arcade text-lg md:text-xl text-gym-logo tracking-widest uppercase flex flex-col items-center justify-center gap-4">
              <Construction className="size-12 md:size-16 text-gym-logo [filter:drop-shadow(0_0_15px_rgba(255,223,0,0.4))]" />
              PRÓXIMAMENTE
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-6 pt-6">
            <BarChart3 className="size-12 md:size-16 text-white/10 mx-auto" />
            <p className="font-mono text-white/40 text-sm">
              Esta sección está en desarrollo. Pronto podrás:
            </p>
            <ul className="font-mono text-white/60 text-xs md:text-sm space-y-3 inline-block text-left">
              <li className="flex items-center gap-2"><div className="size-1 bg-gym-logo rounded-full"/>Reporte de membresías activas/vencidas</li>
              <li className="flex items-center gap-2"><div className="size-1 bg-gym-logo rounded-full"/>Reporte de pagos por período</li>
              <li className="flex items-center gap-2"><div className="size-1 bg-gym-logo rounded-full"/>Reporte de nuevos clientes</li>
              <li className="flex items-center gap-2"><div className="size-1 bg-gym-logo rounded-full"/>Exportar reportes en PDF/Excel</li>
            </ul>
          </CardContent>
        </div>
      </Card>
    </div>
  )
}