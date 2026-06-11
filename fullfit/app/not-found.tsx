import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center">
        <h1 className="font-arcade text-gym-logo text-6xl mb-4">404</h1>
        <h2 className="font-arcade text-white text-xl mb-4">Página no encontrada</h2>
        <p className="text-white/50 font-mono text-sm mb-6">
          La página que buscas no existe o ha sido movida.
        </p>
        <Link
          href="/"
          className="bg-gym-logo text-black font-arcade text-xs uppercase tracking-wider px-6 py-3 hover:bg-gym-logo-claro hoverEffect inline-block"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  )
}
