import Link from 'next/link'
import { Users, CreditCard, ArrowRight, Dumbbell, CalendarDays, BarChart3 } from 'lucide-react'

const cards = [
  {
    href: '/gerente/usuarios',
    icon: Users,
    title: 'Personal del Sistema',
    description: 'Gestiona administradores y recepcionistas. Crea, edita y activa/desactiva cuentas.',
    color: 'from-blue-500/20 to-blue-600/10 border-blue-500/20',
    iconColor: 'text-blue-400',
  },
  {
    href: '/gerente/ingresos',
    icon: BarChart3,
    title: 'Informes',
    description: 'Consulta los ingresos, pagos y movimientos financieros del gimnasio.',
    color: 'from-emerald-500/20 to-emerald-600/10 border-emerald-500/20',
    iconColor: 'text-emerald-400',
  },
  {
    href: '/gerente/planes',
    icon: CreditCard,
    title: 'Planes de Membresía',
    description: 'Configura los planes disponibles para los socios. Precios, duración y beneficios.',
    color: 'from-yellow-500/20 to-yellow-600/10 border-yellow-500/20',
    iconColor: 'text-yellow-400',
  },
  {
    href: '/gerente/horarios',
    icon: CalendarDays,
    title: 'Horarios y Clases',
    description: 'Gestiona el horario general del gimnasio y el calendario de clases grupales.',
    color: 'from-purple-500/20 to-purple-600/10 border-purple-500/20',
    iconColor: 'text-purple-400',
  },
]

export default function GerentePage() {
  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-10 text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Dumbbell className="size-10 text-yellow-500" />
        </div>
        <h1 className="text-3xl font-black text-white tracking-tight mb-2">
          Panel de <span className="text-yellow-500">Gerencia</span>
        </h1>
        <p className="text-zinc-400 text-lg max-w-lg mx-auto">
          Administra el gimnasio desde un solo lugar. Selecciona una sección para comenzar.
        </p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {cards.map(({ href, icon: Icon, title, description, color, iconColor }) => (
          <Link key={href} href={href} className="group">
            <div className={`relative rounded-xl border bg-gradient-to-b ${color} p-6 h-full flex flex-col gap-4 hover:scale-[1.02] transition-all duration-200 hover:shadow-lg hover:shadow-black/20`}>
              <div className={`size-12 rounded-lg bg-zinc-800 flex items-center justify-center ${iconColor}`}>
                <Icon className="size-6" />
              </div>
              <div className="flex-1">
                <h2 className="text-white font-bold text-lg mb-2">{title}</h2>
                <p className="text-zinc-400 text-sm leading-relaxed">{description}</p>
              </div>
              <div className={`flex items-center gap-1.5 text-sm font-medium ${iconColor}`}>
                Ir a sección
                <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform duration-200" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
