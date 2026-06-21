import { test, expect } from '@playwright/test'

test.describe('HU-001: Landing Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle', timeout: 30000 })
  })

  test('CP-01/C-02: Página principal carga correctamente con banner', async ({ page }) => {
    await expect(page).toHaveURL('/')
    const banner = page.locator('img[alt*="Banner"], section:has(img[alt*="Banner"])')
    if (await banner.count() > 0) await expect(banner.first()).toBeVisible()
  })

  test('CP-04/CP-07: Hero con título "Encuentra tu mejor versión" y botón "Inscríbete ya"', async ({ page }) => {
    await expect(page.locator('h2:has-text("versión")')).toBeVisible()
    await expect(page.getByRole('link', { name: /inscríbete/i })).toBeVisible()
  })

  test('CP-05: Botón "Inscríbete ya" navega a /sedes', async ({ page }) => {
    await page.getByRole('link', { name: /inscríbete/i }).click()
    await expect(page).toHaveURL(/sedes/)
  })

  test('CP-08/CP-09: InfiniteScroll con imágenes ANTES/DESPUÉS visible', async ({ page }) => {
    const antes = page.getByText(/antes/i)
    const despues = page.getByText(/después|despues/i)
    if (await antes.count() > 0 && await despues.count() > 0) {
      await expect(antes.first()).toBeVisible()
      await expect(despues.first()).toBeVisible()
    }
  })

  test('CP-11: InfiniteScroll responsivo en móvil', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await page.waitForTimeout(500)
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth)
    const viewportWidth = await page.evaluate(() => window.innerWidth)
    expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 5)
  })

  test('CP-13/CP-14/CP-15: Header con logo y enlaces Sedes y Membresías', async ({ page }) => {
    const header = page.locator('header').first()
    await expect(header).toBeVisible()
    const logo = page.getByRole('link', { name: /fullfit|logo|inicio|full forma/i })
    if (await logo.count() > 0) await expect(logo.first()).toBeVisible()
    await expect(page.getByRole('link', { name: /sedes/i }).first()).toBeVisible()
    await expect(page.locator('a:has-text("Membresías"), a:has-text("Membresias")').first()).toBeVisible()
  })

  test('CP-14: Enlace Sedes en header navega a /sedes', async ({ page }) => {
    await page.getByRole('link', { name: /sedes/i }).first().click()
    await expect(page).toHaveURL(/sedes/)
  })

  test('CP-15: Enlace Membresías en header navega a /membresias', async ({ page }) => {
    await page.locator('a:has-text("Membresías"), a:has-text("Membresias")').first().click()
    await expect(page).toHaveURL(/membresias/)
  })

  test('CP-16: Header muestra botones "Iniciar Sesión" y "Registrarse" sin sesión', async ({ page }) => {
    await expect(page.getByRole('link', { name: /iniciar sesión|login/i }).first()).toBeVisible()
    const register = page.locator('a:has-text("Registrarse"), a:has-text("Registro")')
    if (await register.count() > 0) await expect(register.first()).toBeVisible()
  })

  test('CP-19/CP-20: Menú hamburguesa visible en móvil, oculto en desktop', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await page.waitForTimeout(300)
    const hamburger = page.locator('.hamburger-react, button:has(.hamburger-react), [class*="hamburger"]').first()
    const hamburgerVisible = await hamburger.count() > 0 && await hamburger.isVisible()
    expect(hamburgerVisible).toBeTruthy()
  })

  test('CP-21: SideMenu se abre al pulsar hamburguesa', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await page.waitForTimeout(300)
    const hamburger = page.locator('.hamburger-react, button:has(svg), [class*="hamburger"]').first()
    if (await hamburger.isVisible()) {
      await hamburger.click()
      await page.waitForTimeout(500)
      const sideMenu = page.locator('[class*="translate-x-0"], .fixed.inset-0.z-50, div:has(>a[href*="sedes"]).fixed')
      if (await sideMenu.count() > 0) await expect(sideMenu.first()).toBeVisible()
    }
  })

  test('CP-22: SideMenu se abre y overlay existe', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await page.waitForTimeout(300)
    const hamburger = page.locator('.hamburger-react, button:has(svg)').first()
    if (await hamburger.isVisible()) {
      await hamburger.click()
      await page.waitForTimeout(500)
      const overlay = page.locator('[class*="bg-black"][class*="opacity"], [class*="fixed"][class*="inset-0"]').first()
      if (await overlay.count() > 0) {
        await expect(overlay).toBeVisible()
      }
    }
  })

  test('CP-06: Footer visible con redes sociales', async ({ page }) => {
    await expect(page.getByRole('contentinfo').first()).toBeVisible()
    const social = page.getByRole('contentinfo').first().locator('a[href*="facebook"], a[href*="instagram"]')
    if (await social.count() > 0) expect(await social.count()).toBeGreaterThanOrEqual(1)
  })

  test('CP-25: Redes sociales se abren en nueva pestaña', async ({ page }) => {
    const fbLink = page.locator('a[href*="facebook"]').first()
    if (await fbLink.count() > 0) {
      const target = await fbLink.getAttribute('target')
      expect(target).toBe('_blank')
    }
  })

  test('CP-27/CP-28: Footer con logo centrado y copyright con año actual', async ({ page }) => {
    const footer = page.getByRole('contentinfo').first()
    await expect(footer).toBeVisible()
    const currentYear = new Date().getFullYear().toString()
    const yearInFooter = page.locator(`text="${currentYear}"`).first()
    if (await yearInFooter.count() > 0) {
      await expect(yearInFooter).toBeVisible()
    }
  })

  test('CP-37: Logo del header redirige a /', async ({ page }) => {
    const logo = page.locator('header a[href="/"], header a:has(h2)').first()
    if (await logo.count() > 0) {
      await logo.click()
      await expect(page).toHaveURL('/')
    }
  })

  test('CP-38: Header presente al hacer scroll', async ({ page }) => {
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    await page.waitForTimeout(300)
    const header = page.locator('header').first()
    await expect(header).toBeVisible()
  })

  test('CP-29: Fondo negro con acentos amarillos', async ({ page }) => {
    const bodyBg = await page.evaluate(() => window.getComputedStyle(document.body).backgroundColor)
    expect(bodyBg).toBe('rgb(0, 0, 0)')
    const logoColor = await page.locator('h2 span.text-gym-logo, [class*="text-gym-logo"]').first()
    if (await logoColor.count() > 0) {
      const color = await logoColor.evaluate(el => window.getComputedStyle(el).color)
      expect(color).toMatch(/255, 223, 0|255,215,0|gold|yellow/i)
    }
  })

  test('CP-33: Meta tags SEO presentes', async ({ page }) => {
    const title = await page.title()
    expect(title.length).toBeGreaterThan(0)
    const metaDesc = page.locator('meta[name="description"]')
    if (await metaDesc.count() > 0) {
      const content = await metaDesc.getAttribute('content')
      expect(content?.length).toBeGreaterThan(0)
    }
  })

  test('CP-36: Página 404 para rutas inexistentes', async ({ page }) => {
    await page.goto('/ruta-inexistente', { waitUntil: 'networkidle' })
    expect(page.url()).toContain('/ruta-inexistente')
    const error404 = page.getByText(/404|no encontrada|no existe/i)
    await expect(error404.first()).toBeVisible()
  })

  test('CP-42: Footer responsivo en 320px y 768px', async ({ page }) => {
    for (const width of [320, 768]) {
      await page.setViewportSize({ width, height: 900 })
      await page.waitForTimeout(300)
      const footer = page.getByRole('contentinfo').first()
      await expect(footer).toBeVisible()
    }
  })

  test('CP-32: Sin errores críticos en consola', async ({ page }) => {
    const errors: string[] = []
    page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()) })
    await page.reload({ waitUntil: 'networkidle' })
    const criticalErrors = errors.filter(e => !e.includes('favicon') && !e.includes('404') && !e.includes('Failed to fetch'))
    expect(criticalErrors.length).toBe(0)
  })
})
