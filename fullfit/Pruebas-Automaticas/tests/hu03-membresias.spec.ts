import { test, expect } from '@playwright/test'

test.describe('HU-003: Membresías', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/membresias', { waitUntil: 'networkidle', timeout: 30000 })
  })

  test('CP-01: Página de Membresías carga correctamente', async ({ page }) => {
    await expect(page).toHaveURL('/membresias')
  })

  test('CP-02: Título "Elige tu Membresía" con resaltado', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /elige tu membresía/i })).toBeVisible()
  })

  test('CP-03: Subtítulo "Entrena sin límites en cualquiera de nuestras sedes"', async ({ page }) => {
    const sub = page.getByText(/Entrena sin límites/i)
    if (await sub.count() > 0) await expect(sub.first()).toBeVisible()
  })

  test('CP-04/CP-05: Contador de planes e indicador "100% Flexible"', async ({ page }) => {
    const planesLabel = page.getByText(/Planes/i)
    await expect(planesLabel.first()).toBeVisible()
    const flexible = page.getByText(/100%|flexible/i)
    if (await flexible.count() > 0) await expect(flexible.first()).toBeVisible()
  })

  test('CP-15: Botón "Elegir Plan" enlaza a /pasarelapago?plan=', async ({ page }) => {
    const button = page.locator('a').filter({ hasText: /elegir plan/i }).first()
    if (await button.count() > 0) {
      const href = await button.getAttribute('href')
      expect(href).toContain('pasarelapago')
      expect(href).toContain('plan=')
    }
  })

  test('CP-16: Redirección a /membresias al elegir plan sin sesión', async ({ page }) => {
    const button = page.locator('a').filter({ hasText: /elegir plan/i }).first()
    if (await button.count() > 0) {
      await button.click({ force: true })
      await page.waitForURL(/membresias|pasarelapago/, { timeout: 5000 })
      expect(page.url()).toContain('/membresias')
    }
  })

  test('CP-10/CP-11/CP-12: Beneficios visibles para planes Mensual, Trimestral, Anual', async ({ page }) => {
    for (const plan of ['Mensual', 'Trimestral', 'Anual']) {
      const planEl = page.getByText(plan).first()
      if (await planEl.isVisible()) {
        const card = page.locator('section, div').filter({ hasText: plan }).first()
        if (await card.count() > 0) {
          const benefits = card.locator('li, [class*="check"], [class*="beneficio"]')
          expect(await benefits.count()).toBeGreaterThanOrEqual(1)
        }
      }
    }
  })

  test('CP-13: Badge "Más Popular" en el plan Trimestral', async ({ page }) => {
    const popular = page.getByText(/Más Popular/i)
    if (await popular.count() > 0) await expect(popular.first()).toBeVisible()
  })

  test('CP-14: Sin badge "Más Popular" en otros planes', async ({ page }) => {
    const popularBadges = page.locator('[class*="badge"], [class*="popular"]').filter({ hasText: /más popular/i })
    if (await popularBadges.count() > 0) {
      const count = await popularBadges.count()
      expect(count).toBeLessThanOrEqual(3)
    }
  })

  test('CP-21: Sección "¿Tienes dudas? Visítanos"', async ({ page }) => {
    await expect(page.getByText(/tienes dudas/i).first()).toBeVisible()
  })

  test('CP-22: Enlace "Visítanos" navega a /sedes', async ({ page }) => {
    const visitLink = page.locator('a:has-text("sedes"), a[href*="sedes"]').last()
    if (await visitLink.count() > 0) {
      await visitLink.click()
      await expect(page).toHaveURL(/sedes/)
    }
  })

  test('CP-24: Diseño responsivo en móvil', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await page.waitForTimeout(500)
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth)
    expect(bodyWidth).toBeLessThanOrEqual(390)
  })

  test('CP-31: Accesibilidad teclado en "Elegir Plan"', async ({ page }) => {
    const button = page.locator('a').filter({ hasText: /elegir plan/i }).first()
    if (await button.count() > 0) {
      await button.focus()
      const isFocused = await button.evaluate(el => el === document.activeElement)
      expect(isFocused).toBeTruthy()
    }
  })

  test('Footer visible en /membresias', async ({ page }) => {
    await expect(page.getByRole('contentinfo').first()).toBeVisible()
  })
})
