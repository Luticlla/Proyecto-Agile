import { test, expect } from '@playwright/test'

test.describe('HU-007: Búsqueda Rápida de Perfil de Miembro — Protección', () => {
  test('CP-01: Sin autenticación, /recepcionista/clientes redirige a /login', async ({ page }) => {
    await page.goto('/recepcionista/clientes', { waitUntil: 'networkidle', timeout: 30000 })
    await expect(page).toHaveURL(/login/)
  })
})
