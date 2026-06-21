'use client'

import { useEffect, useRef } from "react";

export function useOutsideClick<T extends HTMLElement>(calback: () => void) {
  const ref = useRef<T>(null);
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        calback();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [calback]);
  return ref;
}

export { AuthProvider, useAuth } from './useAuth'
export { useDebounce } from './useDebounce'
export { usePaginatedFetch } from './usePaginatedFetch'
