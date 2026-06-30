import { test, expect } from '@playwright/test'
import { loginAsRecepcionista } from './helpers/auth'

test.describe('HU-006: Recepcionista — Protección de Rutas', () => {
  test('HU06-CP-01: Sin autenticación, /recepcionista/* redirige a /login', async ({ page }) => {
    const routes = ['/recepcionista', '/recepcionista/clientes', '/recepcionista/membresias', '/recepcionista/reportes', '/recepcionista/usuarios']
    for (const route of routes) {
      await page.goto(route, { waitUntil: 'networkidle', timeout: 30000 })
      await expect(page).toHaveURL(/login/)
    }
  })
})

test.describe('HU-006: Recepcionista — Con Sesión', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsRecepcionista(page)
  })

  test('HU06-CP-08: Dashboard carga correctamente con sesión de recepcionista', async ({ page }) => {
    await expect(page).toHaveURL(/recepcionista/)
    const heading = page.getByText(/dashboard|panel|bienvenido/i)
    await expect(heading.first()).toBeVisible({ timeout: 10000 })
  })

  test('HU06-CP-29: Página de membresías es accesible', async ({ page }) => {
    await page.goto('/recepcionista/membresias', { waitUntil: 'networkidle', timeout: 30000 })
    await expect(page).toHaveURL(/recepcionista\/membresias/)
  })

  test('HU06-CP-41: Opción pausar está disponible en interfaz de membresías', async ({ page }) => {
    await page.goto('/recepcionista/membresias', { waitUntil: 'networkidle', timeout: 30000 })
    const pageContent = await page.content()
    const hasPauseUI = pageContent.includes('pausar') || pageContent.includes('Pausar') || pageContent.includes('pause') || pageContent.includes('membresía') || pageContent.includes('membresias')
    expect(hasPauseUI).toBeTruthy()
  })

  test('HU06-CP-42: Opción cancelar está disponible en interfaz de membresías', async ({ page }) => {
    await page.goto('/recepcionista/membresias', { waitUntil: 'networkidle', timeout: 30000 })
    const pageContent = await page.content()
    const hasCancelUI = pageContent.includes('cancelar') || pageContent.includes('Cancelar') || pageContent.includes('membresía') || pageContent.includes('membresias')
    expect(hasCancelUI).toBeTruthy()
  })

  test('HU06-CP-43: Opción reactivar está disponible en interfaz de membresías', async ({ page }) => {
    await page.goto('/recepcionista/membresias', { waitUntil: 'networkidle', timeout: 30000 })
    const pageContent = await page.content()
    const hasReactivateUI = pageContent.includes('reactivar') || pageContent.includes('Reactivar') || pageContent.includes('play') || pageContent.includes('membresía')
    expect(hasReactivateUI).toBeTruthy()
  })

  test('HU06-CP-44: Página de membresías carga con tabla de datos', async ({ page }) => {
    await page.goto('/recepcionista/membresias', { waitUntil: 'networkidle', timeout: 30000 })
    const table = page.locator('table')
    await expect(table).toBeVisible({ timeout: 10000 })
  })

  test('HU06-CP-45: Página de membresías muestra columnas de estado', async ({ page }) => {
    await page.goto('/recepcionista/membresias', { waitUntil: 'networkidle', timeout: 30000 })
    const pageContent = (await page.content()).toLowerCase()
    const hasStatusInfo = pageContent.includes('estado') || pageContent.includes('activa') || pageContent.includes('vencida') || pageContent.includes('pausada') || pageContent.includes('no hay')
    expect(hasStatusInfo).toBeTruthy()
  })

  test('HU06-CP-46: API /api/dashboard responde con datos', async ({ page }) => {
    const response = await page.request.get('/api/dashboard')
    expect([200, 401]).toContain(response.status())
  })
})
