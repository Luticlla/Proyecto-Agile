import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const LIMA_TIMEZONE = 'America/Lima'

export function getFechaLima(): string {
  return new Date().toLocaleDateString('en-CA', { timeZone: LIMA_TIMEZONE })
}

export function formatearFechaLima(date: Date): string {
  return date.toLocaleDateString('en-CA', { timeZone: LIMA_TIMEZONE })
}

export function parsearFechaLima(fechaStr: string): Date {
  const [y, m, d] = fechaStr.split('-').map(Number)
  return new Date(y, m - 1, d, 12, 0, 0)
}
