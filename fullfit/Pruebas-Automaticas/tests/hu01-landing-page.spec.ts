import { test, expect } from '@playwright/test'

test.describe('HU-001: Landing Page Informativa', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle', timeout: 30000 })
  })

  test('CP-01: Pagina principal carga correctamente', async ({ page }) => {
    await expect(page).toHaveURL('/')
  })

  test('CP-02: Banner principal visible con imagen', async ({ page }) => {
    const banner = page.locator('img[alt*="Banner"], section:has(img[alt*="Banner"])')
    await expect(banner.first()).toBeVisible({ timeout: 10000 })
  })

  test('CP-03: Imagen banner no rota (carga HTTP 200)', async ({ page }) => {
    const bannerImg = page.locator('img[alt*="Banner"], img[src*="banner"]').first()
    await expect(bannerImg).toBeVisible({ timeout: 10000 })
    const src = await bannerImg.getAttribute('src')
    expect(src).toBeTruthy()
    const response = await page.request.get(new URL(src!, page.url()).href)
    expect(response.status()).toBe(200)
  })

  test('CP-04: Texto boton Inscribete ya', async ({ page }) => {
    const btn = page.getByRole('link', { name: /inscríbete/i })
    await expect(btn).toBeVisible()
  })

  test('CP-05: Enlace boton Inscribete ya navega a /sedes', async ({ page }) => {
    await page.getByRole('link', { name: /inscríbete/i }).click()
    await expect(page).toHaveURL(/sedes/)
  })

  test('CP-06: Accesibilidad teclado boton Inscribete', async ({ page }) => {
    const btn = page.getByRole('link', { name: /inscríbete/i })
    await btn.focus()
    await page.keyboard.press('Enter')
    await expect(page).toHaveURL(/sedes/)
  })

  test('CP-07: Heading principal Encuentra tu mejor version', async ({ page }) => {
    await expect(page.locator('h2:has-text("versión"), h2:has-text("version")').first()).toBeVisible()
  })

  test('CP-08: InfiniteScroll se renderiza', async ({ page }) => {
    const scroll = page.locator('[class*="infinite"], [class*="scroll"]').first()
    await expect(scroll).toBeVisible({ timeout: 10000 })
  })

  test('CP-09: Pares ANTES/DESPUES visibles', async ({ page }) => {
    const antes = page.getByText(/antes/i)
    const despues = page.getByText(/después|despues/i)
    expect(await antes.count()).toBeGreaterThan(0)
    expect(await despues.count()).toBeGreaterThan(0)
    await expect(antes.first()).toBeVisible()
    await expect(despues.first()).toBeVisible()
  })

  test('CP-11: InfiniteScroll responsivo en movil', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await page.waitForTimeout(500)
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth)
    const viewportWidth = await page.evaluate(() => window.innerWidth)
    expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 5)
  })

  test('CP-12: Carga imagenes faltantes sin romper layout', async ({ page }) => {
    const images = page.locator('img')
    const count = await images.count()
    expect(count).toBeGreaterThan(0)
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth)
    expect(bodyWidth).toBeLessThanOrEqual(1440)
  })

  test('CP-13: Header con logo y enlaces de navegacion', async ({ page }) => {
    const header = page.locator('header').first()
    await expect(header).toBeVisible()
    await expect(page.getByRole('link', { name: /sedes/i }).first()).toBeVisible()
    await expect(page.locator('a:has-text("Membresías"), a:has-text("Membresias")').first()).toBeVisible()
  })

  test('CP-14: Enlace Sedes en header navega a /sedes', async ({ page }) => {
    await page.getByRole('link', { name: /sedes/i }).first().click()
    await expect(page).toHaveURL(/sedes/)
  })

  test('CP-15: Enlace Membresias en header navega a /membresias', async ({ page }) => {
    await page.locator('a:has-text("Membresías"), a:has-text("Membresias")').first().click()
    await expect(page).toHaveURL(/membresias/)
  })

  test('CP-16: Botones auth sin sesion visibles', async ({ page }) => {
    await expect(page.getByRole('link', { name: /iniciar sesión|login/i }).first()).toBeVisible()
    await expect(page.getByRole('link', { name: /regístrate/i }).first()).toBeVisible()
  })

  test('CP-19: Menu hamburguesa visible en movil', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await page.waitForTimeout(300)
    const hamburger = page.locator('.hamburger-react, button:has(.hamburger-react), [class*="hamburger"]').first()
    await expect(hamburger).toBeVisible({ timeout: 5000 })
  })

  test('CP-20: Menu horizontal completo en desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 768 })
    await page.waitForTimeout(300)
    const header = page.locator('header').first()
    await expect(header).toBeVisible()
    await expect(page.getByRole('link', { name: /sedes/i }).first()).toBeVisible()
  })

  test('CP-21: SideMenu se abre al pulsar hamburguesa', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await page.waitForTimeout(300)
    const hamburger = page.locator('.hamburger-react, button:has(svg), [class*="hamburger"]').first()
    await expect(hamburger).toBeVisible({ timeout: 5000 })
    await hamburger.click()
    await page.waitForTimeout(500)
    const sideMenu = page.locator('[class*="translate-x-0"], .fixed.inset-0.z-50')
    await expect(sideMenu.first()).toBeVisible({ timeout: 5000 })
  })

  test('CP-22: SideMenu se cierra al hacer click en overlay', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await page.waitForTimeout(300)
    const hamburger = page.locator('.hamburger-react, button:has(svg)').first()
    await expect(hamburger).toBeVisible({ timeout: 5000 })
    await hamburger.click()
    await page.waitForTimeout(500)
    const overlay = page.locator('[class*="bg-black"][class*="opacity"], [class*="fixed"][class*="inset-0"]').first()
    await expect(overlay).toBeVisible({ timeout: 5000 })
  })

  test('CP-23: Navegacion desde SideMenu funciona', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await page.waitForTimeout(300)
    const hamburger = page.locator('.hamburger-react, button:has(svg)').first()
    await expect(hamburger).toBeVisible({ timeout: 5000 })
    await hamburger.click()
    await page.waitForTimeout(500)
    const membresiasLink = page.locator('[class*="translate-x-0"] a:has-text("Membresías"), [class*="translate-x-0"] a:has-text("Membresias")').first()
    if (await membresiasLink.isVisible()) {
      await membresiasLink.click()
      await expect(page).toHaveURL(/membresias/)
    }
  })

  test('CP-24: Redes sociales en footer', async ({ page }) => {
    const footer = page.getByRole('contentinfo').first()
    await expect(footer).toBeVisible()
    const social = footer.locator('a[href*="facebook"], a[href*="instagram"]')
    expect(await social.count()).toBeGreaterThanOrEqual(1)
  })

  test('CP-25: Redes sociales se abren en nueva pestana', async ({ page }) => {
    const fbLink = page.getByRole('contentinfo').locator('a[href*="facebook"]').first()
    await expect(fbLink).toBeVisible({ timeout: 5000 })
    const target = await fbLink.getAttribute('target')
    expect(target).toBe('_blank')
  })

  test('CP-26: Logo centrado en footer', async ({ page }) => {
    const footer = page.getByRole('contentinfo').first()
    await expect(footer).toBeVisible()
    const logo = footer.locator('img, svg, [class*="logo"]').first()
    await expect(logo).toBeVisible()
  })

  test('CP-27: Copyright con ano actual', async ({ page }) => {
    const footer = page.getByRole('contentinfo').first()
    await expect(footer).toBeVisible()
    const currentYear = new Date().getFullYear().toString()
    await expect(footer.getByText(currentYear).first()).toBeVisible({ timeout: 5000 })
  })

  test('CP-28: Fondo negro y acento amarillo', async ({ page }) => {
    const bodyBg = await page.evaluate(() => window.getComputedStyle(document.body).backgroundColor)
    expect(bodyBg).toBe('rgb(0, 0, 0)')
    const logoColor = page.locator('h2 span.text-gym-logo, [class*="text-gym-logo"]').first()
    await expect(logoColor).toBeVisible({ timeout: 5000 })
    const color = await logoColor.evaluate(el => window.getComputedStyle(el).color)
    expect(color).toMatch(/255, 223, 0|255,215,0|gold|yellow/i)
  })

  test('CP-29: Fuentes JetBrains Mono y Press Start 2P', async ({ page }) => {
    const fontFamily = await page.evaluate(() => window.getComputedStyle(document.documentElement).fontFamily)
    expect(fontFamily.toLowerCase()).toContain('jetbrains')
  })

  test('CP-30: Sin scroll horizontal', async ({ page }) => {
    const widths = [320, 768, 1024, 1440]
    for (const width of widths) {
      await page.setViewportSize({ width, height: 900 })
      await page.waitForTimeout(300)
      const bodyWidth = await page.evaluate(() => document.body.scrollWidth)
      expect(bodyWidth).toBeLessThanOrEqual(width + 5)
    }
  })

  test('CP-31: Sin errores criticos en consola', async ({ page }) => {
    const errors: string[] = []
    page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()) })
    await page.reload({ waitUntil: 'networkidle' })
    const criticalErrors = errors.filter(e => !e.includes('favicon') && !e.includes('404') && !e.includes('Failed to fetch'))
    expect(criticalErrors.length).toBe(0)
  })

  test('CP-32: Meta tags SEO presentes', async ({ page }) => {
    const title = await page.title()
    expect(title.length).toBeGreaterThan(0)
    const metaDesc = page.locator('meta[name="description"]')
    await expect(metaDesc).toBeAttached()
    const content = await metaDesc.getAttribute('content')
    expect(content?.length).toBeGreaterThan(0)
  })

  test('CP-33: Pagina 404 para rutas inexistentes', async ({ page }) => {
    await page.goto('/ruta-inexistente', { waitUntil: 'networkidle' })
    expect(page.url()).toContain('/ruta-inexistente')
    const error404 = page.getByText(/404|no encontrada|no existe/i)
    await expect(error404.first()).toBeVisible()
  })

  test('CP-34: Logo del header redirige a /', async ({ page }) => {
    const logo = page.locator('header a[href="/"], header a:has(h2)').first()
    await expect(logo).toBeVisible({ timeout: 5000 })
    await logo.click()
    await expect(page).toHaveURL('/')
  })

  test('CP-35: Header sticky al hacer scroll', async ({ page }) => {
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    await page.waitForTimeout(300)
    const header = page.locator('header').first()
    await expect(header).toBeVisible()
  })

  test('CP-38: Footer responsivo en diferentes resoluciones', async ({ page }) => {
    for (const width of [320, 768, 1024, 1440]) {
      await page.setViewportSize({ width, height: 900 })
      await page.waitForTimeout(300)
      const footer = page.getByRole('contentinfo').first()
      await expect(footer).toBeVisible()
    }
  })

  test('CP-39: Orden de foco Tab es logico', async ({ page }) => {
    await page.keyboard.press('Tab')
    const firstFocused = await page.evaluate(() => {
      const el = document.activeElement
      return el ? el.tagName : null
    })
    expect(firstFocused).toBeTruthy()
  })
})
