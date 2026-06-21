'use client'

import { useState, useEffect, useCallback, useRef } from 'react'

type UsePaginatedFetchOptions<T> = {
  /** URL del endpoint API */
  url: string
  /** Parámetros de query adicionales */
  params?: Record<string, string>
  /** Transformador de datos opcional */
  transform?: (data: unknown) => T[]
  /** Página inicial */
  initialPage?: number
  /** Límite por página */
  initialLimit?: number
}

type UsePaginatedFetchResult<T> = {
  data: T[]
  loading: boolean
  error: string | null
  page: number
  totalPages: number
  limit: number
  setPage: (page: number) => void
  setLimit: (limit: number) => void
  refresh: () => void
}

/**
 * Hook para fetch paginado con loading, error y paginación.
 * Maneja cleanup con AbortController y previene updates en componentes desmontados.
 *
 * @example
 * ```tsx
 * const { data, loading, page, totalPages, setPage } = usePaginatedFetch<MembresiaConCliente>({
 *   url: '/api/membresias',
 *   params: { buscar: searchTerm, estado: 'activas' }
 * })
 * ```
 */
export function usePaginatedFetch<T>({
  url,
  params = {},
  transform,
  initialPage = 1,
  initialLimit = 10
}: UsePaginatedFetchOptions<T>): UsePaginatedFetchResult<T> {
  const [data, setData] = useState<T[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(initialPage)
  const [totalPages, setTotalPages] = useState(1)
  const [limit, setLimit] = useState(initialLimit)
  const [refreshKey, setRefreshKey] = useState(0)

  const abortControllerRef = useRef<AbortController | null>(null)

  const refresh = useCallback(() => {
    setRefreshKey(prev => prev + 1)
  }, [])

  useEffect(() => {
    let isMounted = true

    const fetchData = async () => {
      // Cancelar request anterior
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
      abortControllerRef.current = new AbortController()

      setLoading(true)
      setError(null)

      try {
        const searchParams = new URLSearchParams()
        Object.entries(params).forEach(([key, value]) => {
          if (value) searchParams.set(key, value)
        })
        searchParams.set('page', String(page))
        searchParams.set('limit', String(limit))

        const response = await fetch(`${url}?${searchParams.toString()}`, {
          signal: abortControllerRef.current.signal
        })

        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`)
        }

        const result = await response.json()

        if (isMounted) {
          const items = transform ? transform(result.data) : (result.data || [])
          setData(items)
          setTotalPages(result.totalPages || 1)
        }
      } catch (err) {
        if (isMounted && err instanceof Error && err.name !== 'AbortError') {
          setError(err.message)
          console.error('Error fetching data:', err)
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    fetchData()

    return () => {
      isMounted = false
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [url, page, limit, refreshKey, ...Object.values(params)])

  return {
    data,
    loading,
    error,
    page,
    totalPages,
    limit,
    setPage,
    setLimit,
    refresh
  }
}
