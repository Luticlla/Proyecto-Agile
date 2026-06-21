'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Search, X, User } from 'lucide-react'

type ClienteSugerencia = {
  id: string
  nombre: string
  apellido: string
  dni: string | null
  membresia_estado?: string
}

export function BusquedaRapida() {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [sugerencias, setSugerencias] = useState<ClienteSugerencia[]>([])
  const [loading, setLoading] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const latestQueryRef = useRef('')

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const fetchSugerencias = useCallback(async (q: string) => {
    latestQueryRef.current = q
    setLoading(true)
    try {
      const res = await fetch(`/api/buscar-clientes?q=${encodeURIComponent(q)}`)
      if (res.ok && latestQueryRef.current === q) {
        const data = await res.json()
        setSugerencias(data.clientes || [])
        setShowDropdown(true)
      }
    } catch (error) {
      console.error('Error buscando clientes:', error)
    } finally {
      if (latestQueryRef.current === q) {
        setLoading(false)
      }
    }
  }, [])

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }

    if (query.trim().length < 2) {
      return
    }

    debounceRef.current = setTimeout(() => {
      fetchSugerencias(query.trim())
    }, 300)

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [query, fetchSugerencias])

  function handleChange(value: string) {
    setQuery(value)
    if (value.trim().length < 2) {
      setSugerencias([])
      setShowDropdown(false)
    }
  }

  function handleSelect(clienteId: string) {
    setQuery('')
    setShowDropdown(false)
    router.push(`/recepcionista/clientes/${clienteId}`)
  }

  function handleClear() {
    setQuery('')
    setSugerencias([])
    setShowDropdown(false)
    inputRef.current?.focus()
  }

  return (
    <div ref={containerRef} className="relative w-full max-w-md">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-500" />
        <Input
          ref={inputRef}
          type="text"
          placeholder="Buscar miembro por nombre o DNI..."
          value={query}
          onChange={(e) => handleChange(e.target.value)}
          onFocus={() => sugerencias.length > 0 && setShowDropdown(true)}
          className="pl-10 pr-10 bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-[#ffdf00] focus:ring-[#ffdf00]/20"
        />
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
          >
            <X className="size-4" />
          </button>
        )}
      </div>

      {showDropdown && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-zinc-800 border border-zinc-700 rounded-lg shadow-xl z-50 max-h-72 overflow-y-auto">
          {loading ? (
            <div className="p-4 text-center text-zinc-400 text-sm">Buscando...</div>
          ) : sugerencias.length > 0 ? (
            sugerencias.map((cliente) => (
              <button
                key={cliente.id}
                onClick={() => handleSelect(cliente.id)}
                className="w-full flex items-center justify-between p-3 hover:bg-zinc-700/50 transition-colors text-left border-b border-zinc-700/50 last:border-0"
              >
                <div className="flex items-center gap-3">
                  <div className="size-8 rounded-full bg-zinc-700 flex items-center justify-center">
                    <User className="size-4 text-zinc-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">
                      {cliente.nombre} {cliente.apellido}
                    </p>
                    <p className="text-xs text-zinc-400">
                      DNI: {cliente.dni || '—'}
                    </p>
                  </div>
                </div>
                {cliente.membresia_estado && (
                  <Badge
                    variant="outline"
                    className={
                      cliente.membresia_estado === 'activa'
                        ? 'bg-green-500/20 text-green-400 border-green-500/30 text-xs'
                        : 'bg-red-500/20 text-red-400 border-red-500/30 text-xs'
                    }
                  >
                    {cliente.membresia_estado === 'activa' ? 'Activa' : 'Vencida'}
                  </Badge>
                )}
              </button>
            ))
          ) : (
            <div className="p-4 text-center text-zinc-400 text-sm">
              No se encontraron miembros
            </div>
          )}
        </div>
      )}
    </div>
  )
}
