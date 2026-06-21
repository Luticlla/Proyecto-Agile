'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Search, Loader2 } from 'lucide-react'

type BuscadorClienteProps = {
  onSearch: (busqueda: string) => void
  placeholder?: string
  isLoading?: boolean
}

export function BuscadorCliente({
  onSearch,
  placeholder = 'Buscar por nombre, DNI o teléfono...',
  isLoading = false,
}: BuscadorClienteProps) {
  const [value, setValue] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setValue(newValue)
    onSearch(newValue)
  }

  const handleClear = () => {
    setValue('')
    onSearch('')
  }

  return (
    <div className="relative flex-1">
      {isLoading ? (
        <Loader2 className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-400 animate-spin" />
      ) : (
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-500" />
      )}
      <Input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className="pl-10 bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
      />
      {value && (
        <button
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
        >
          ×
        </button>
      )}
    </div>
  )
}