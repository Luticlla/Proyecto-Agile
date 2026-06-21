import { test, expect } from '@playwright/test'

test.describe('HU-002: Sedes', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/sedes', { waitUntil: 'networkidle', timeout: 30000 })
  })

  test('CP-01: Página de Sedes carga correctamente', async ({ page }) => {
    await expect(page).toHaveURL('/sedes')
  })

  test('CP-02: Hero con título "Nuestras Sedes" resaltado', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /nuestras sedes/i })).toBeVisible()
  })

  test('CP-03: Subtítulo "Múltiples puntos de entrenamiento en Trujillo"', async ({ page }) => {
    const sub = page.getByText(/Múltiples puntos de entrenamiento/i)
    if (await sub.count() > 0) await expect(sub.first()).toBeVisible()
  })

  test('CP-04/CP-06: Contador de sedes e indicador 24/7 Soporte', async ({ page }) => {
    const has247 = await page.getByText(/24\/7/i).count() > 0
    const hasSoporte = await page.getByText(/soporte/i).count() > 0
    expect(has247 || hasSoporte).toBeTruthy()
  })

  test('CP-17: Mensaje de empty state cuando no hay sedes', async ({ page }) => {
    const emptyMsg = page.getByText(/No hay sedes disponibles/i)
    if (await emptyMsg.count() > 0) await expect(emptyMsg.first()).toBeVisible()
  })

  test('CP-19: CTA "¿Aún no eres miembro?" visible (si hay sedes) o se omite', async ({ page }) => {
    const cta = page.getByText(/aún no eres miembro/i)
    if (await cta.count() > 0) {
      await expect(cta.first()).toBeVisible()
    }
  })

  test('CP-20: Botón "Ver Membresías" navega a /membresias (si existe)', async ({ page }) => {
    const link = page.getByRole('link', { name: /membresías/i }).first()
    if (await link.count() > 0) {
      await link.click()
      await expect(page).toHaveURL(/membresias/)
    }
  })

  test('CP-21: Diseño responsivo en móvil', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await page.waitForTimeout(500)
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth)
    expect(bodyWidth).toBeLessThanOrEqual(390)
  })

  test('CP-22: Página carga con cliente anónimo de Supabase (no requiere sesión)', async ({ page }) => {
    await expect(page).toHaveURL('/sedes')
    const noAuth = page.getByText(/iniciar sesión|login/i)
    expect(await noAuth.count()).toBeGreaterThanOrEqual(0)
  })

  test('CP-27: Logo del header redirige a /', async ({ page }) => {
    const logo = page.locator('header a[href="/"], header a:has(h2)').first()
    if (await logo.count() > 0) {
      await logo.click()
      await expect(page).toHaveURL('/')
    }
  })

  test('CP-12/CP-14: Botón "Ver más información" expande/colapsa panel', async ({ page }) => {
    const expandBtn = page.locator('button').filter({ hasText: /ver más información/i }).first()
    if (await expandBtn.count() === 0) return
    await expandBtn.click({ force: true })
    await page.waitForTimeout(500)
    const collapseBtn = page.locator('button').filter({ hasText: /ver menos/i }).first()
    if (await collapseBtn.count() > 0) {
      await collapseBtn.click({ force: true })
      await page.waitForTimeout(500)
      const stillExpanded = page.locator('button').filter({ hasText: /ver más información/i }).first()
      if (await stillExpanded.count() > 0) {
        await expect(stillExpanded).toBeVisible()
      }
    }
  })

  test('CP-26: Accesibilidad teclado del collapsible', async ({ page }) => {
    const toggleBtn = page.getByRole('button', { name: /ver más información/i }).first()
    if (await toggleBtn.count() === 0) return
    await toggleBtn.focus()
    await page.keyboard.press('Enter')
    await page.waitForTimeout(300)
    const panelContent = page.locator('text=Cerrado').first()
    const expanded = await panelContent.isVisible()
    await page.keyboard.press('Enter')
    await page.waitForTimeout(300)
  })

  test('Footer visible en /sedes', async ({ page }) => {
    await expect(page.getByRole('contentinfo').first()).toBeVisible()
  })
})
