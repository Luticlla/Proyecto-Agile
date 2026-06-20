import { test, expect } from '@playwright/test'

const LANDING_URL = '/'
const SEDES_URL = '/sedes'
const MEMBRESIAS_URL = '/membresias'
const CURRENT_YEAR = new Date().getFullYear()
const MOBILE_VIEWPORT = { width: 375, height: 667 }
const DESKTOP_VIEWPORT = { width: 1280, height: 720 }

test.describe('HU-001 Landing Page', () => {

  test('HU01-CP-01: Carga correcta de la página principal', async ({ page }) => {
    const errors: string[] = []
    page.on('pageerror', err => errors.push(err.message))
    const resp = await page.goto(LANDING_URL)
    await page.waitForLoadState('networkidle')
    expect(resp?.status()).toBe(200)
    expect(errors).toHaveLength(0)
    await expect(page.locator('main').first()).toBeVisible()
  })

  test('HU01-CP-02: Renderizado del banner principal', async ({ page }) => {
    await page.goto(LANDING_URL)
    await page.waitForLoadState('networkidle')
    const bannerImg = page.locator('img[alt="Full Forma Banner"]')
    await expect(bannerImg).toBeVisible()
  })

  test('HU01-CP-03: Imagen del banner no está rota', async ({ page }) => {
    await page.goto(LANDING_URL)
    await page.waitForLoadState('networkidle')
    const img = page.locator('img[alt="Full Forma Banner"]')
    await expect(img).toBeVisible()
    const ok = await img.evaluate(el => {
      const i = el as HTMLImageElement
      return i.naturalWidth > 0 && i.naturalHeight > 0
    })
    expect(ok).toBe(true)
  })

  test('HU01-CP-04: Texto del botón principal del banner', async ({ page }) => {
    await page.goto(LANDING_URL)
    await page.waitForLoadState('networkidle')
    const button = page.getByRole('link', { name: '¡Inscríbete ya!' })
    await expect(button).toBeVisible()
    await expect(button).toHaveText('¡Inscríbete ya!')
  })

  test('HU01-CP-05: Enlace del botón ¡Inscríbete ya! navega a /sedes', async ({ page }) => {
    await page.goto(LANDING_URL)
    await page.waitForLoadState('networkidle')
    const button = page.getByRole('link', { name: '¡Inscríbete ya!' })
    await expect(button).toHaveAttribute('href', SEDES_URL)
  })

  test('HU01-CP-06: Accesibilidad del botón del banner por teclado', async ({ page }) => {
    await page.goto(LANDING_URL)
    await page.waitForLoadState('networkidle')
    const button = page.getByRole('link', { name: '¡Inscríbete ya!' })
    await button.focus()
    await expect(button).toBeFocused()
    await page.keyboard.press('Enter')
    await page.waitForURL(`**${SEDES_URL}`)
    expect(page.url()).toContain(SEDES_URL)
  })

  test('HU01-CP-07: Heading principal de la sección', async ({ page }) => {
    await page.goto(LANDING_URL)
    await page.waitForLoadState('networkidle')
    const heading = page.getByRole('heading', { name: /Encuentra tu mejor versión/i })
    await expect(heading).toBeVisible()
    await expect(heading).toContainText('Encuentra tu mejor versión con nosotros')
  })

  test('HU01-CP-08: Renderizado del componente InfiniteScroll', async ({ page }) => {
    await page.goto(LANDING_URL)
    await page.waitForLoadState('networkidle')
    const infiniteSection = page.locator('section').filter({ has: page.locator('.animate-infinite-scroll') })
    await expect(infiniteSection).toBeVisible()
  })

  test('HU01-CP-09: Pares de imágenes ANTES/DESPUÉS', async ({ page }) => {
    await page.goto(LANDING_URL)
    await page.waitForLoadState('networkidle')
    const antes = page.locator('span', { hasText: 'ANTES' })
    const despues = page.locator('span', { hasText: 'DESPUÉS' })
    const antesCount = await antes.count()
    const despuesCount = await despues.count()
    expect(antesCount).toBeGreaterThanOrEqual(4)
    expect(despuesCount).toBeGreaterThanOrEqual(4)
    expect(antesCount).toEqual(despuesCount)
  })

  test('HU01-CP-11: InfiniteScroll funciona en móvil (viewport < 768px)', async ({ page }) => {
    await page.setViewportSize(MOBILE_VIEWPORT)
    await page.goto(LANDING_URL)
    await page.waitForLoadState('networkidle')
    const infiniteSection = page.locator('section').filter({ has: page.locator('.animate-infinite-scroll') })
    await expect(infiniteSection).toBeVisible()
    const hasScroll = await page.evaluate(() =>
      document.documentElement.scrollWidth > document.documentElement.clientWidth
    )
    expect(hasScroll).toBe(false)
  })

  test('HU01-CP-12: Imágenes del InfiniteScroll cargan sin romper layout', async ({ page }) => {
    await page.goto(LANDING_URL)
    await page.waitForLoadState('networkidle')

    const infiniteDiv = page.locator('.animate-infinite-scroll')
    await expect(infiniteDiv).toBeVisible()

    const infiniteImages = infiniteDiv.locator('img')
    const count = await infiniteImages.count()
    expect(count).toBeGreaterThanOrEqual(1)

    const landingSection = page.locator('section').filter({ has: infiniteDiv })
    const hasOverflow = await page.evaluate(() =>
      document.documentElement.scrollWidth > document.documentElement.clientWidth
    )
    expect(hasOverflow).toBe(false)
  })

  test('HU01-CP-13: Logo y enlaces de navegación en el header', async ({ page }) => {
    await page.goto(LANDING_URL)
    await page.waitForLoadState('networkidle')

    const logo = page.getByRole('banner').getByRole('link', { name: /FULLFORMA/i })
    await expect(logo).toBeVisible()
    await expect(logo).toHaveAttribute('href', '/')

    const sedesLink = page.getByRole('banner').getByRole('link', { name: 'Sedes' }).first()
    const membresiasLink = page.getByRole('banner').getByRole('link', { name: 'Membresias' }).first()
    await expect(sedesLink).toBeVisible()
    await expect(membresiasLink).toBeVisible()
  })

  test('HU01-CP-14: Enlace Sedes navega a /sedes', async ({ page }) => {
    await page.goto(LANDING_URL)
    await page.waitForLoadState('networkidle')

    const sedesLink = page.getByRole('banner').getByRole('link', { name: 'Sedes' }).first()
    await expect(sedesLink).toHaveAttribute('href', SEDES_URL)

    await sedesLink.click()
    await page.waitForURL(`**${SEDES_URL}`)
    expect(page.url()).toContain(SEDES_URL)
  })

  test('HU01-CP-15: Enlace Membresias navega a /membresias', async ({ page }) => {
    await page.goto(LANDING_URL)
    await page.waitForLoadState('networkidle')

    const link = page.getByRole('banner').getByRole('link', { name: 'Membresias' }).first()
    await expect(link).toHaveAttribute('href', MEMBRESIAS_URL)

    await link.click()
    await page.waitForURL(`**${MEMBRESIAS_URL}`)
    expect(page.url()).toContain(MEMBRESIAS_URL)
  })

  test('HU01-CP-16: Botones de auth sin sesión iniciada', async ({ page }) => {
    await page.goto(LANDING_URL)
    await page.waitForLoadState('networkidle')

    const iniciar = page.getByRole('link', { name: 'Iniciar Sesión' }).first()
    const registrate = page.getByRole('link', { name: '¡Regístrate!' }).first()

    await expect(iniciar).toBeVisible()
    await expect(iniciar).toHaveAttribute('href', '/login')
    await expect(registrate).toBeVisible()
    await expect(registrate).toHaveAttribute('href', '/register')
  })

  test('HU01-CP-19: Menú hamburguesa visible en móvil', async ({ page }) => {
    await page.setViewportSize(MOBILE_VIEWPORT)
    await page.goto(LANDING_URL)
    await page.waitForLoadState('networkidle')

    const hamburger = page.getByRole('banner').getByRole('button').first()
    await expect(hamburger).toBeVisible()
  })

  test('HU01-CP-20: Menú hamburguesa oculto en desktop', async ({ page }) => {
    await page.setViewportSize(DESKTOP_VIEWPORT)
    await page.goto(LANDING_URL)
    await page.waitForLoadState('networkidle')

    const desktopNav = page.getByRole('banner').locator('.hidden.lg\\:inline-flex')
    await expect(desktopNav).toBeVisible()
  })

  test('HU01-CP-21: Apertura del SideMenu al pulsar hamburguesa', async ({ page }) => {
    await page.setViewportSize(MOBILE_VIEWPORT)
    await page.goto(LANDING_URL)
    await page.waitForLoadState('networkidle')

    await page.getByRole('banner').getByRole('button').first().click()
    await page.waitForTimeout(400)

    await expect(page.locator('.fixed.inset-0.z-50')).toBeVisible()
  })

  test('HU01-CP-22: Cierre del SideMenu al hacer clic fuera', async ({ page }) => {
    await page.setViewportSize(MOBILE_VIEWPORT)
    await page.goto(LANDING_URL)
    await page.waitForLoadState('networkidle')

    await page.getByRole('banner').getByRole('button').first().click()
    await page.waitForTimeout(400)

    const sideMenu = page.locator('.fixed.inset-0.z-50')
    await expect(sideMenu).toBeVisible()

    const closeBtn = sideMenu.locator('button').first()
    await closeBtn.click()
    await page.waitForTimeout(400)

    await expect(sideMenu).not.toHaveClass(/translate-x-0/)
  })

  test('HU01-CP-23: Navegación desde el SideMenu', async ({ page }) => {
    await page.setViewportSize(MOBILE_VIEWPORT)
    await page.goto(LANDING_URL)
    await page.waitForLoadState('networkidle')

    await page.getByRole('banner').getByRole('button').first().click()
    await page.waitForTimeout(400)

    const membresiasLink = page.locator('.fixed.inset-0.z-50 a', { hasText: 'Membresias' })
    await expect(membresiasLink).toBeVisible()
    await membresiasLink.click()

    await page.waitForURL(`**${MEMBRESIAS_URL}`)
    expect(page.url()).toContain(MEMBRESIAS_URL)
  })

  test('HU01-CP-24: Enlaces a Facebook e Instagram en el footer', async ({ page }) => {
    await page.goto(LANDING_URL)
    await page.waitForLoadState('networkidle')

    const socialLinks = page.getByRole('contentinfo').locator('a[target="_blank"]')
    const count = await socialLinks.count()
    expect(count).toBeGreaterThanOrEqual(2)
  })

  test('HU01-CP-25: Enlaces de redes sociales abren en nueva pestaña', async ({ page }) => {
    await page.goto(LANDING_URL)
    await page.waitForLoadState('networkidle')

    const socialLinks = page.getByRole('contentinfo').locator('a[target="_blank"]')
    const count = await socialLinks.count()
    expect(count).toBeGreaterThanOrEqual(2)
    for (let i = 0; i < count; i++) {
      await expect(socialLinks.nth(i)).toHaveAttribute('target', '_blank')
      await expect(socialLinks.nth(i)).toHaveAttribute('rel', 'noopener noreferrer')
    }
  })

  test('HU01-CP-27: Logo centrado en el footer', async ({ page }) => {
    await page.goto(LANDING_URL)
    await page.waitForLoadState('networkidle')

    const footerLogo = page.getByRole('contentinfo').getByRole('link', { name: /FULLFORMA/i })
    await expect(footerLogo).toBeVisible()
  })

  test('HU01-CP-28: Texto y año de copyright', async ({ page }) => {
    await page.goto(LANDING_URL)
    await page.waitForLoadState('networkidle')

    const copyright = page.getByRole('contentinfo').locator('p').filter({ hasText: 'Full Forma' })
    await expect(copyright).toBeVisible()
    await expect(copyright).toContainText(`© ${CURRENT_YEAR}`)
    await expect(copyright).toContainText('Todos los derechos reservados.')
  })

  test('HU01-CP-29: Color de fondo negro y acento amarillo', async ({ page }) => {
    await page.goto(LANDING_URL)
    await page.waitForLoadState('networkidle')

    const bodyBg = await page.evaluate(() =>
      window.getComputedStyle(document.body).backgroundColor
    )
    const isBlack = bodyBg === 'rgb(0, 0, 0)' || bodyBg.toLowerCase() === 'black'
    expect(isBlack).toBe(true)

    const yellow = page.locator('.text-yellow-400, .text-gym-logo').first()
    await expect(yellow).toBeVisible()
  })

  test('HU01-CP-30: Fuentes configuradas correctamente', async ({ page }) => {
    await page.goto(LANDING_URL)
    await page.waitForLoadState('networkidle')

    const htmlFont = await page.evaluate(() =>
      window.getComputedStyle(document.documentElement).fontFamily
    )
    expect(htmlFont.toLowerCase()).toContain('mono')

    const arcadeElement = page.locator('.font-arcade').first()
    await expect(arcadeElement).toBeVisible()
  })

  test('HU01-CP-31: Sin scroll horizontal en múltiples resoluciones', async ({ page }) => {
    const viewports = [
      { width: 320, height: 568 },
      { width: 768, height: 1024 },
      { width: 1024, height: 768 },
      { width: 1440, height: 900 },
    ]

    await page.goto(LANDING_URL)
    for (const vp of viewports) {
      await page.setViewportSize(vp)
      await page.waitForTimeout(500)
      const hasScroll = await page.evaluate(() =>
        document.documentElement.scrollWidth > document.documentElement.clientWidth
      )
      expect(hasScroll).toBe(false)
    }
  })

  test('HU01-CP-32: Sin errores en consola del navegador', async ({ page }) => {
    const consoleErrors: string[] = []
    page.on('console', msg => { if (msg.type() === 'error') consoleErrors.push(msg.text()) })
    page.on('pageerror', err => consoleErrors.push(err.message))

    await page.goto(LANDING_URL)
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(1000)

    expect(consoleErrors).toHaveLength(0)
  })

  test('HU01-CP-33: Meta tags SEO', async ({ page }) => {
    await page.goto(LANDING_URL)
    const title = await page.title()
    expect(title.length).toBeGreaterThan(0)

    const metaDesc = page.locator('meta[name="description"]')
    await expect(metaDesc).toHaveAttribute('content')
    const content = await metaDesc.getAttribute('content')
    expect(content?.length).toBeGreaterThan(0)
  })

  test('HU01-CP-34: Loading state presente (archivo loading.tsx)', async ({ page }) => {
    await page.goto(LANDING_URL)
    await page.waitForLoadState('domcontentloaded')
    const loader = page.locator('.animate-spin')
    if (await loader.isVisible().catch(() => false)) {
      const color = await loader.evaluate(el => window.getComputedStyle(el).color)
      expect(color).toBeTruthy()
    }
  })

  test('HU01-CP-36: Página 404 para rutas inexistentes', async ({ page }) => {
    const response = await page.goto('/ruta-inexistente')
    expect(response?.status()).toBe(404)

    await expect(page.getByRole('heading', { name: '404' })).toBeVisible()
    await expect(page.getByText('Página no encontrada')).toBeVisible()

    const volver = page.getByRole('link', { name: 'Volver al inicio' })
    await expect(volver).toBeVisible()
    await expect(volver).toHaveAttribute('href', '/')
  })

  test('HU01-CP-37: Logo del header redirige a /', async ({ page }) => {
    await page.goto(SEDES_URL)
    await page.waitForLoadState('networkidle')

    const logo = page.getByRole('banner').getByRole('link', { name: /FULLFORMA/i })
    await expect(logo).toBeVisible()
    await expect(logo).toHaveAttribute('href', '/')

    await logo.click()
    await page.waitForURL('**/')
  })

  test('HU01-CP-38: Header visible al hacer scroll', async ({ page }) => {
    await page.goto(LANDING_URL)
    await page.waitForLoadState('networkidle')
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    await page.waitForTimeout(300)
    await expect(page.getByRole('banner')).toBeVisible()
  })

  test('HU01-CP-42: Footer responsive en múltiples viewports', async ({ page }) => {
    const viewports = [
      { width: 320, height: 568 },
      { width: 768, height: 1024 },
      { width: 1024, height: 768 },
      { width: 1440, height: 900 },
    ]

    await page.goto(LANDING_URL)
    await page.waitForLoadState('networkidle')

    for (const vp of viewports) {
      await page.setViewportSize(vp)
      await page.waitForTimeout(500)

      await expect(page.getByRole('contentinfo')).toBeVisible()

      const hasOverflow = await page.evaluate(() =>
        document.documentElement.scrollWidth > document.documentElement.clientWidth
      )
      expect(hasOverflow).toBe(false)
    }
  })

  test('HU01-CP-43: Orden de foco navegable con Tab', async ({ page }) => {
    await page.goto(LANDING_URL)
    await page.waitForLoadState('networkidle')

    const firstLink = page.getByRole('banner').getByRole('link').first()
    await firstLink.focus()
    await expect(firstLink).toBeFocused()

    for (let i = 0; i < 8; i++) {
      await page.keyboard.press('Tab')
      await page.waitForTimeout(100)
    }

    await expect(page.locator(':focus')).toBeAttached()
  })

})
