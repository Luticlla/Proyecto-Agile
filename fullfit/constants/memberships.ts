/**
 * Ventana de tiempo en días antes del vencimiento
 * en la que un cliente puede renovar su membresía.
 */
export const VENTANA_RENOVACION_DIAS = 7

/**
 * ID del rol de miembro en la base de datos.
 * Usado para verificar si un usuario es miembro.
 */
export const MIEMBRO_ROLE_ID = 3

/**
 * IDs de roles con permisos de recepcionista (admin y recepcionista).
 */
export const RECEPCIONISTA_ROLES = [1, 2] as const