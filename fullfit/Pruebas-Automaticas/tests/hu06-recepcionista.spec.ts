import { test, expect } from '@playwright/test'

const SKIP_AUTH = true // Supabase no disponible - sesión no se puede crear
const AUTH_REASON = 'Requiere sesión activa en Supabase (no disponible)'

test.describe('HU-006: Recepcionista', () => {
  test('CP-01: Sin autenticación, /recepcionista redirige a /login', async ({ page }) => {
    await page.goto('/recepcionista', { waitUntil: 'networkidle', timeout: 30000 })
    await expect(page).toHaveURL(/login/)
  })

  test('CP-01: /recepcionista/clientes redirige a /login sin sesión', async ({ page }) => {
    await page.goto('/recepcionista/clientes', { waitUntil: 'networkidle', timeout: 30000 })
    await expect(page).toHaveURL(/login/)
  })

  test('CP-01: /recepcionista/membresias redirige a /login sin sesión', async ({ page }) => {
    await page.goto('/recepcionista/membresias', { waitUntil: 'networkidle', timeout: 30000 })
    await expect(page).toHaveURL(/login/)
  })

  test('CP-01: /recepcionista/reportes redirige a /login sin sesión', async ({ page }) => {
    await page.goto('/recepcionista/reportes', { waitUntil: 'networkidle', timeout: 30000 })
    await expect(page).toHaveURL(/login/)
  })

  test.describe('Pruebas que requieren sesión activa', () => {
    test('CP-02: [SKIP] Bloqueo de acceso a usuarios con rol socio', async ({ page }) => {
      test.skip(SKIP_AUTH, AUTH_REASON)
    })

    test('CP-03: [SKIP] Acceso correcto con rol_id 1 o 2', async ({ page }) => {
      test.skip(SKIP_AUTH, AUTH_REASON)
    })

    test('CP-04: [SKIP] Header del panel con opciones Clientes, Membresías, Reportes', async ({ page }) => {
      test.skip(SKIP_AUTH, AUTH_REASON)
    })

    test('CP-05: [SKIP] Nombre del recepcionista en el header', async ({ page }) => {
      test.skip(SKIP_AUTH, AUTH_REASON)
    })

    test('CP-06: [SKIP] Botón cerrar sesión', async ({ page }) => {
      test.skip(SKIP_AUTH, AUTH_REASON)
    })

    test('CP-07/CP-08: [SKIP] Dashboard con cards y placeholders', async ({ page }) => {
      test.skip(SKIP_AUTH, AUTH_REASON)
    })

    test('CP-09/CP-10: [SKIP] Acciones rápidas y enlaces', async ({ page }) => {
      test.skip(SKIP_AUTH, AUTH_REASON)
    })

    test('CP-12: [SKIP] Listado de clientes con tabla', async ({ page }) => {
      test.skip(SKIP_AUTH, AUTH_REASON)
    })

    test('CP-16: [SKIP] Búsqueda sin resultados', async ({ page }) => {
      test.skip(SKIP_AUTH, AUTH_REASON)
    })

    test('CP-25/CP-26: [SKIP] Acceso a detalle de cliente', async ({ page }) => {
      test.skip(SKIP_AUTH, AUTH_REASON)
    })

    test('CP-29/CP-33: [SKIP] Páginas Membresías y Reportes "Próximamente"', async ({ page }) => {
      test.skip(SKIP_AUTH, AUTH_REASON)
    })

    test('CP-35: [SKIP] Empty state sin clientes', async ({ page }) => {
      test.skip(SKIP_AUTH, AUTH_REASON)
    })

    test('CP-36/CP-37: [SKIP] Loading/error states', async ({ page }) => {
      test.skip(SKIP_AUTH, AUTH_REASON)
    })
  })
})
