import { test, expect } from '@playwright/test'

const THRESHOLD_PAGE_MS = 3000
const THRESHOLD_API_MS = 2000
const THRESHOLD_ASSET_MS = 1000

test.describe('Rendimiento — Tiempos de Carga', () => {

  test('HU01-CP-40: Landing Page carga en menos de 3s', async ({ page }) => {
    const start = Date.now()
    await page.goto('/', { waitUntil: 'networkidle', timeout: 30000 })
    const elapsed = Date.now() - start
    console.log(`Landing Page: ${elapsed}ms`)
    await expect(page).toHaveURL('/')
    expect(elapsed).toBeLessThan(THRESHOLD_PAGE_MS)
  })

  test('HU02-CP-23: Página Sedes carga en menos de 3s', async ({ page }) => {
    const start = Date.now()
    await page.goto('/sedes', { waitUntil: 'networkidle', timeout: 30000 })
    const elapsed = Date.now() - start
    console.log(`Sedes: ${elapsed}ms`)
    await expect(page).toHaveURL('/sedes')
    expect(elapsed).toBeLessThan(THRESHOLD_PAGE_MS)
  })

  test('HU03-CP-24: Página Membresías carga en menos de 3s', async ({ page }) => {
    const start = Date.now()
    await page.goto('/membresias', { waitUntil: 'networkidle', timeout: 30000 })
    const elapsed = Date.now() - start
    console.log(`Membresías: ${elapsed}ms`)
    await expect(page).toHaveURL('/membresias')
    expect(elapsed).toBeLessThan(THRESHOLD_PAGE_MS)
  })

  test('HU04-CP-35: Página Registro carga en menos de 3s', async ({ page }) => {
    const start = Date.now()
    await page.goto('/register', { waitUntil: 'networkidle', timeout: 30000 })
    const elapsed = Date.now() - start
    console.log(`Registro: ${elapsed}ms`)
    await expect(page).toHaveURL('/register')
    expect(elapsed).toBeLessThan(THRESHOLD_PAGE_MS)
  })

  test('HU05-CP-32: API /api/pagos responde en menos de 2s', async ({ request }) => {
    const start = Date.now()
    const response = await request.post('/api/pagos', {
      data: { planId: 1 },
      headers: { 'Content-Type': 'application/json' },
    })
    const elapsed = Date.now() - start
    console.log(`API pagos: ${elapsed}ms (status ${response.status()})`)
    expect([401, 307, 400]).toContain(response.status())
    expect(elapsed).toBeLessThan(THRESHOLD_API_MS)
  })

  test('HU08-CP-24: Assets estáticos (CSS/JS) cargan en menos de 1s', async ({ page }) => {
    const assetTimes: { url: string; duration: number }[] = []

    page.on('response', async (response) => {
      const url = response.url()
      if (url.match(/\.(css|js)(\?|$)/)) {
        const timing = response.request().timing()
        assetTimes.push({
          url: url.split('/').pop() || url,
          duration: timing.responseEnd - timing.requestStart,
        })
      }
    })

    await page.goto('/', { waitUntil: 'networkidle', timeout: 30000 })

    if (assetTimes.length > 0) {
      const maxDuration = Math.max(...assetTimes.map(a => a.duration))
      const avgDuration = assetTimes.reduce((sum, a) => sum + a.duration, 0) / assetTimes.length
      console.log(`Assets: ${assetTimes.length} recursos, max=${Math.round(maxDuration)}ms, avg=${Math.round(avgDuration)}ms`)
      for (const asset of assetTimes) {
        console.log(`  ${asset.url}: ${Math.round(asset.duration)}ms`)
      }
      expect(maxDuration).toBeLessThan(THRESHOLD_ASSET_MS)
    } else {
      console.log('No se detectaron assets CSS/JS (puede ser SSG)')
    }
  })
})
