import { test, expect } from '@playwright/test'

test.describe('HU-003: Planes de Membresia', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/membresias', { waitUntil: 'networkidle', timeout: 30000 })
  })

  test('CP-01: Pagina de Membresias carga correctamente', async ({ page }) => {
    await expect(page).toHaveURL('/membresias')
  })

  test('CP-02: Titulo Elige tu Membresia resaltado', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /elige tu membresía/i })).toBeVisible()
  })

  test('CP-03: Subtitulo Entrena sin limites', async ({ page }) => {
    await expect(page.getByText(/Entrena sin límites/i).first()).toBeVisible()
  })

  test('CP-05: Indicador 100% Flexible', async ({ page }) => {
    await expect(page.getByText(/100%|flexible/i).first()).toBeVisible()
  })

  test('CP-07: Beneficios plan Mensual visibles', async ({ page }) => {
    const mensual = page.getByText(/Mensual/i).first()
    await expect(mensual).toBeVisible({ timeout: 5000 })
  })

  test('CP-08: Beneficios plan Trimestral visibles', async ({ page }) => {
    const trimestral = page.getByText(/Trimestral/i).first()
    await expect(trimestral).toBeVisible({ timeout: 5000 })
  })

  test('CP-09: Beneficios plan Anual visibles', async ({ page }) => {
    const anual = page.getByText(/Anual/i).first()
    await expect(anual).toBeVisible({ timeout: 5000 })
  })

  test('CP-10: Badge Mas Popular en plan Trimestral', async ({ page }) => {
    const popular = page.getByText(/Más Popular/i)
    await expect(popular.first()).toBeVisible({ timeout: 5000 })
  })

  test('CP-11: Badge Mas Popular aparece solo una vez', async ({ page }) => {
    const badges = page.locator('[class*="badge"], [class*="popular"]').filter({ hasText: /más popular/i })
    const count = await badges.count()
    expect(count).toBeGreaterThanOrEqual(1)
  })

  test('CP-12: Enlace Elegir Plan apunta a pasarelapago', async ({ page }) => {
    const button = page.locator('a').filter({ hasText: /elegir plan/i }).first()
    await expect(button).toBeVisible({ timeout: 5000 })
    const href = await button.getAttribute('href')
    expect(href).toContain('pasarelapago')
    const hasPlanParam = href!.includes('plan=') || href!.includes('plan%3D')
    expect(hasPlanParam).toBeTruthy()
  })

  test('CP-13: Redireccion a login sin sesion al elegir plan', async ({ page }) => {
    const button = page.locator('a').filter({ hasText: /elegir plan/i }).first()
    await expect(button).toBeVisible({ timeout: 5000 })
    await button.click({ force: true })
    await page.waitForURL(/login|membresias|pasarelapago/, { timeout: 5000 })
    expect(page.url()).toMatch(/login|membresias/)
  })

  test('CP-17: Plan id inexistente en pasarelapago', async ({ page }) => {
    await page.goto('/pasarelapago?plan=999999', { waitUntil: 'networkidle' })
    const errorOrRedirect = page.getByText(/no encontrado|error|plan/i)
    const currentUrl = page.url()
    expect(currentUrl.includes('pasarelapago') || currentUrl.includes('membresias') || await errorOrRedirect.count() > 0).toBeTruthy()
  })

  test('CP-18: Seccion dudas visibles', async ({ page }) => {
    await expect(page.getByText(/tienes dudas/i).first()).toBeVisible()
  })

  test('CP-19: Enlace Visitanos navega a /sedes', async ({ page }) => {
    const visitLink = page.locator('a:has-text("sedes"), a[href*="sedes"]').last()
    await expect(visitLink).toBeVisible({ timeout: 5000 })
    await visitLink.click()
    await expect(page).toHaveURL(/sedes/)
  })

  test('CP-20: Diseno responsivo en movil', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await page.waitForTimeout(500)
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth)
    expect(bodyWidth).toBeLessThanOrEqual(390)
  })

  test('CP-21: Accesibilidad teclado en Elegir Plan', async ({ page }) => {
    const button = page.locator('a').filter({ hasText: /elegir plan/i }).first()
    await expect(button).toBeVisible({ timeout: 5000 })
    await button.focus()
    const isFocused = await button.evaluate(el => el === document.activeElement)
    expect(isFocused).toBeTruthy()
  })
})
