import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function TerminosYCondicionesPage() {
  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center px-4 py-8">
      <Link href="/register" className="flex items-center gap-2 text-zinc-400 hover:text-white mb-6 hoverEffect">
        <ArrowLeft className="size-4" />
        <span className="font-arcade text-xs">Volver al registro</span>
      </Link>

      <div className="w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-lg p-8">
        <h1 className="text-2xl font-bold text-white mb-4">Términos y Condiciones</h1>
        <p className="text-zinc-400">Próximamente</p>
      </div>
    </div>
  )
}
