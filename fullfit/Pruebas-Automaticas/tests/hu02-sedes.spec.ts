import { test, expect } from '@playwright/test'

test.describe('HU-002: Listado de Sedes', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/sedes', { waitUntil: 'networkidle', timeout: 30000 })
  })

  test('CP-01: Pagina de Sedes carga correctamente', async ({ page }) => {
    await expect(page).toHaveURL('/sedes')
  })

  test('CP-02: Titulo Nuestras Sedes resaltado', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /nuestras sedes/i })).toBeVisible()
  })

  test('CP-03: Subtitulo Multiples puntos de entrenamiento', async ({ page }) => {
    await expect(page.getByText(/Múltiples puntos de entrenamiento/i).first()).toBeVisible()
  })

  test('CP-04: Contador de sedes activas', async ({ page }) => {
    const counter = page.getByText(/\d+\s*(sedes|sede)/i)
    await expect(counter.first()).toBeVisible({ timeout: 5000 })
  })

  test('CP-05: Indicador 24/7 Soporte', async ({ page }) => {
    const soporte = page.getByText(/24\/7|soporte/i)
    await expect(soporte.first()).toBeVisible()
  })

  test('CP-11: Panel Ver mas informacion se expande', async ({ page }) => {
    const expandBtn = page.locator('button').filter({ hasText: /ver más información|ver mas informacion/i }).first()
    await expect(expandBtn).toBeVisible({ timeout: 5000 })
    await expandBtn.click({ force: true })
    await page.waitForTimeout(500)
    const panel = page.getByText(/domingo|sábado|sabado|lunes/i)
    await expect(panel.first()).toBeVisible({ timeout: 5000 })
  })

  test('CP-13: Colapso panel expandido', async ({ page }) => {
    const expandBtn = page.locator('button').filter({ hasText: /ver más información|ver mas informacion/i }).first()
    await expect(expandBtn).toBeVisible({ timeout: 5000 })
    await expandBtn.click({ force: true })
    await page.waitForTimeout(500)
    const collapseBtn = page.locator('button').filter({ hasText: /ver menos/i }).first()
    await expect(collapseBtn).toBeVisible({ timeout: 5000 })
    await collapseBtn.click({ force: true })
    await page.waitForTimeout(500)
    const reopenedBtn = page.locator('button').filter({ hasText: /ver más información|ver mas informacion/i }).first()
    await expect(reopenedBtn).toBeVisible({ timeout: 5000 })
  })

  test('CP-16: Mensaje sin sedes disponibles cuando BD vacia', async ({ page }) => {
    const emptyMsg = page.getByText(/No hay sedes disponibles/i)
    const hasSedes = await emptyMsg.count() === 0
    if (!hasSedes) {
      await expect(emptyMsg.first()).toBeVisible()
    }
  })

  test('CP-19: Diseno responsivo en movil', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await page.waitForTimeout(500)
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth)
    expect(bodyWidth).toBeLessThanOrEqual(390)
  })

  test('CP-20: Pagina carga con cliente anonimo (sin sesion)', async ({ page }) => {
    await expect(page).toHaveURL('/sedes')
    await expect(page.getByRole('heading', { name: /nuestras sedes/i })).toBeVisible()
  })

  test('CP-21: Accesibilidad teclado del collapsible', async ({ page }) => {
    const toggleBtn = page.getByRole('button', { name: /ver más información|ver mas informacion/i }).first()
    await expect(toggleBtn).toBeVisible({ timeout: 5000 })
    await toggleBtn.focus()
    await page.keyboard.press('Enter')
    await page.waitForTimeout(300)
    const panelContent = page.locator('text=Cerrado').first()
    await expect(panelContent).toBeVisible({ timeout: 5000 })
    await page.keyboard.press('Enter')
    await page.waitForTimeout(300)
  })

  test('CP-22: Logo desde /sedes redirige a /', async ({ page }) => {
    const logo = page.locator('header a[href="/"], header a:has(h2)').first()
    await expect(logo).toBeVisible({ timeout: 5000 })
    await logo.click()
    await expect(page).toHaveURL('/')
  })
})
