'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center">
        <h2 className="font-arcade text-white text-xl mb-4">Algo salió mal</h2>
        <p className="text-white/50 font-mono text-sm mb-6">
          {error.message || 'Ha ocurrido un error inesperado'}
        </p>
        <button
          onClick={() => reset()}
          className="bg-gym-logo text-black font-arcade text-xs uppercase tracking-wider px-6 py-3 hover:bg-gym-logo-claro hoverEffect"
        >
          Intentar de nuevo
        </button>
      </div>
    </div>
  )
}
