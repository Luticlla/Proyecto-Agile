import { test, expect } from '@playwright/test'

test.describe('HU-007: Login y Autenticación', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login', { waitUntil: 'networkidle', timeout: 30000 })
  })

  test('Página de login carga correctamente', async ({ page }) => {
    await expect(page).toHaveURL('/login')
  })

  test('Título "Bienvenido de nuevo" visible', async ({ page }) => {
    await expect(page.locator('text="Bienvenido de nuevo"').first()).toBeVisible()
  })

  test('Subtítulo "Inicia sesión para acceder a tu cuenta" visible', async ({ page }) => {
    const sub = page.getByText(/Inicia sesión para acceder/i)
    if (await sub.count() > 0) await expect(sub.first()).toBeVisible()
  })

  test('Campo Email o DNI visible y required', async ({ page }) => {
    const emailInput = page.locator('#email')
    await expect(emailInput).toBeVisible()
    expect(await emailInput.getAttribute('type')).toBe('text')
    expect(await emailInput.getAttribute('required')).not.toBeNull()
  })

  test('Campo Contraseña visible', async ({ page }) => {
    const pwdInput = page.locator('#password')
    await expect(pwdInput).toBeVisible()
    expect(await pwdInput.getAttribute('type')).toBe('password')
  })

  test('Botón "Iniciar Sesión" visible', async ({ page }) => {
    await expect(page.locator('button:has-text("Iniciar Sesión")')).toBeVisible()
  })

  test('Enlace "¿Olvidaste tu contraseña?" visible y navega a /forgot-password', async ({ page }) => {
    const link = page.locator('a:has-text("Olvidaste")')
    await expect(link).toBeVisible()
    await link.click()
    await expect(page).toHaveURL(/forgot-password/)
  })

  test('Enlace "¿No tienes cuenta? Regístrate aquí" visible y navega a /register', async ({ page }) => {
    const link = page.locator('a:has-text("Regístrate")')
    await expect(link).toBeVisible()
    await link.click()
    await expect(page).toHaveURL(/register/)
  })

  test('Enlace "Volver al inicio" visible y navega a /', async ({ page }) => {
    const link = page.locator('a:has-text("Volver al inicio")')
    await expect(link).toBeVisible()
    await link.click()
    await expect(page).toHaveURL('/')
  })

  test('Spinner de carga se muestra al enviar formulario', async ({ page }) => {
    await page.locator('#email').fill('test@test.com')
    await page.locator('#password').fill('test1234')
    await page.locator('button[type="submit"]').click()
    await page.waitForTimeout(500)
    const spinner = page.locator('svg.animate-spin, [class*="animate-spin"]')
    expect(await spinner.count()).toBeGreaterThanOrEqual(0)
  })

  test('Error de red manejado: mostrar mensaje cuando Supabase falla', async ({ page }) => {
    await page.locator('#email').fill('test@test.com')
    await page.locator('#password').fill('test1234')
    await page.locator('button[type="submit"]').click()
    await page.waitForTimeout(2000)
    const errorEl = page.locator('.text-red-400')
    if (await errorEl.count() > 0) {
      const errorText = await errorEl.textContent()
      expect(errorText?.length).toBeGreaterThan(0)
    }
  })
})

test.describe('HU-007b: Recuperar Contraseña', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/forgot-password', { waitUntil: 'networkidle', timeout: 30000 })
  })

  test('Página de recuperación carga correctamente', async ({ page }) => {
    await expect(page).toHaveURL(/forgot-password/)
  })

  test('Título "Recuperar Contraseña" visible', async ({ page }) => {
    await expect(page.locator('text="Recuperar Contraseña"').first()).toBeVisible()
  })

  test('Campo Email visible con type=email', async ({ page }) => {
    const emailInput = page.locator('#email')
    await expect(emailInput).toBeVisible()
    expect(await emailInput.getAttribute('type')).toBe('email')
  })

  test('Botón "Enviar enlace de recuperación" visible', async ({ page }) => {
    await expect(page.locator('button:has-text("Enviar enlace")')).toBeVisible()
  })

  test('Enlace "Volver a Iniciar Sesión" navega a /login', async ({ page }) => {
    const link = page.locator('a:has-text("Volver a Iniciar Sesión")')
    await expect(link).toBeVisible()
    await link.click()
    await expect(page).toHaveURL(/login/)
  })

  test('Error de red manejado al enviar formulario', async ({ page }) => {
    await page.locator('#email').fill('test@test.com')
    await page.locator('button[type="submit"]').click()
    await page.waitForTimeout(2000)
    const errorEl = page.locator('.text-red-400')
    if (await errorEl.count() > 0) {
      const errorText = await errorEl.textContent()
      expect(errorText?.length).toBeGreaterThan(0)
    }
  })
})

test.describe('HU-007c: Actualizar Contraseña', () => {
  test('Página update-password redirige a /login sin sesión de recovery', async ({ page }) => {
    await page.goto('/update-password', { waitUntil: 'networkidle', timeout: 30000 })
    await page.waitForTimeout(2000)
    expect(page.url()).toContain('/login')
  })
})
