'use client'

import { useState, useEffect } from 'react'

/**
 * Hook que retorna un valor con debounce.
 * Útil para búsquedas donde no queremos hacer fetch en cada keystroke.
 *
 * @param value - Valor a debuncer
 * @param delay - Delay en ms (default: 300)
 * @returns Valor con debounce
 *
 * @example
 * ```tsx
 * const [buscar, setBuscar] = useState('')
 * const buscarDebounced = useDebounce(buscar, 300)
 * // buscarDebounced solo se actualiza 300ms después del último cambio
 * ```
 */
export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(timer)
    }
  }, [value, delay])

  return debouncedValue
}
