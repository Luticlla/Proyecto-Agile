/**
 * Formatea una fecha en formato YYYY-MM-DD a DD/MM/YYYY.
 * Usado para mostrar fechas en la interfaz de usuario.
 */
export function formatDate(dateStr: string): string {
  const [y, m, d] = dateStr.split('-')
  return `${d}/${m}/${y}`
}

/**
 * Calcula los días restantes entre una fecha de fin y hoy.
 * Retorna un número positivo si quedan días, 0 si venció hoy, negativo si venció.
 */
export function calcularDiasRestantes(fechaFin: string, hoy?: string): number {
  const fechaFinDate = new Date(fechaFin)
  const hoyDate = hoy ? new Date(hoy) : new Date()
  return Math.ceil((fechaFinDate.getTime() - hoyDate.getTime()) / (1000 * 60 * 60 * 24))
}