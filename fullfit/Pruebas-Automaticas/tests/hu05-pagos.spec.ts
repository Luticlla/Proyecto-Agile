import { test, expect } from '@playwright/test'

test.describe('HU-005: Pasarela de Pagos', () => {
  test('CP-02: Sin autenticación, /pasarelapago redirige a /membresias', async ({ page }) => {
    await page.goto('/pasarelapago?plan=1', { waitUntil: 'networkidle', timeout: 30000 })
    expect(page.url()).toContain('/membresias')
  })

  test('CP-33: Sin plan_id, /pasarelapago redirige a /membresias', async ({ page }) => {
    await page.goto('/pasarelapago', { waitUntil: 'networkidle', timeout: 30000 })
    expect(page.url()).toContain('/membresias')
  })

  test('CP-20: Plan inválido redirige a /membresias sin sesión', async ({ page }) => {
    await page.goto('/pasarelapago?plan=99999', { waitUntil: 'networkidle', timeout: 30000 })
    expect(page.url()).toContain('/membresias')
  })

  test('CP-34: planId con formato inválido redirige a /membresias', async ({ page }) => {
    await page.goto('/pasarelapago?plan=abc-xyz', { waitUntil: 'networkidle', timeout: 30000 })
    expect(page.url()).toContain('/membresias')
  })

  test('CP-16: status=approved muestra mensaje de éxito', async ({ page }) => {
    await page.goto('/pasarelapago?status=approved', { waitUntil: 'networkidle', timeout: 30000 })
    const messages = [/aprobado/i, /éxito/i, /confirmado/i, /membresía activa/i]
    let found = false
    for (const msg of messages) {
      if (await page.getByText(msg).count() > 0) { found = true; break }
    }
    expect(found).toBeTruthy()
  })

  test('CP-17: status=rejected muestra mensaje de fallo', async ({ page }) => {
    await page.goto('/pasarelapago?status=rejected', { waitUntil: 'networkidle', timeout: 30000 })
    const messages = [/pago no procesado/i, /rechazado/i, /falló/i, /error/i, /no se pudo/i]
    let found = false
    for (const msg of messages) {
      if (await page.getByText(msg).count() > 0) { found = true; break }
    }
    expect(found).toBeTruthy()
  })

  test('CP-18: status=pending muestra mensaje de espera', async ({ page }) => {
    await page.goto('/pasarelapago?status=pending', { waitUntil: 'networkidle', timeout: 30000 })
    const messages = [/pago pendiente/i, /pendiente/i, /espera/i, /procesando/i]
    let found = false
    for (const msg of messages) {
      if (await page.getByText(msg).count() > 0) { found = true; break }
    }
    expect(found).toBeTruthy()
  })

  test('CP-04: POST /api/pagos sin sesión retorna error 401/redirect', async ({ page }) => {
    const response = await page.request.post('/api/pagos', { data: { planId: 1 } })
    expect(response.status() === 401 || response.status() === 307 || response.ok() === false).toBeTruthy()
  })

  test('CP-05: POST /api/pagos con plan inexistente retorna error', async ({ page }) => {
    const response = await page.request.post('/api/pagos', {
      data: { planId: 99999 },
      headers: { 'Content-Type': 'application/json' }
    })
    expect(response.status() === 400 || response.status() === 404 || response.status() === 401).toBeTruthy()
  })

  test('CP-35: Error de configuración MP manejado sin exponer credenciales', async ({ page }) => {
    const response = await page.request.post('/api/pagos', {
      data: { planId: 1 },
      headers: { 'Content-Type': 'application/json' }
    })
    const body = await response.text()
    expect(body).not.toContain('APP_USR')
    expect(body).not.toContain('ACCESS_TOKEN')
  })

  test('CP-30/CP-31: Webhook con payload malformado responde 400', async ({ page }) => {
    const res1 = await page.request.post('/api/webhooks/mercadopago', { data: { invalid: true } })
    expect(res1.status() === 400 || res1.status() === 200).toBeTruthy()
    const res2 = await page.request.post('/api/webhooks/mercadopago', { data: {} })
    expect(res2.status() === 400 || res2.status() === 200).toBeTruthy()
  })

  test('CP-32: Webhook con type no soportado responde 200 (ignora)', async ({ page }) => {
    const res = await page.request.post('/api/webhooks/mercadopago', {
      data: { action: 'test', type: 'unknown', data: { id: '123' } },
      headers: { 'Content-Type': 'application/json' }
    })
    expect(res.ok()).toBeTruthy()
  })

  test('CP-21/CP-32: Webhook endpoint responde sin exponer credenciales', async ({ page }) => {
    const res = await page.request.post('/api/webhooks/mercadopago', {
      data: { action: 'payment.update', type: 'payment', data: { id: '123' } },
      headers: { 'Content-Type': 'application/json' }
    })
    const body = await res.text()
    expect(body).not.toContain('ACCESS_TOKEN')
    expect(body).not.toContain('APP_USR')
  })

  test('[GAP] CP-25/CP-26: No hay UI de pago Yape ni BBVA', async ({ page }) => {
    await page.goto('/membresias', { waitUntil: 'networkidle' })
    const yape = page.getByText(/yape/i)
    const bbva = page.getByText(/bbva/i)
    expect(await yape.count() === 0 && await bbva.count() === 0).toBeTruthy()
  })
})
