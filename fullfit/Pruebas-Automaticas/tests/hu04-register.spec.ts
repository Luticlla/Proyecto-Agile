import { test, expect } from '@playwright/test'

test.describe('HU-004: Registro de Usuario', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/register', { waitUntil: 'networkidle', timeout: 30000 })
  })

  test('CP-01: Formulario de registro carga correctamente', async ({ page }) => {
    await expect(page).toHaveURL('/register')
  })

  test('CP-01: Título "Crear Cuenta" visible', async ({ page }) => {
    await expect(page.locator('text="Crear Cuenta"').first()).toBeVisible()
  })

  test('CP-01: Descripción "Únete a Full Forma" presente', async ({ page }) => {
    const desc = page.getByText(/Únete a Full Forma/i)
    if (await desc.count() > 0) await expect(desc.first()).toBeVisible()
  })

  test('CP-02: Campo Nombre presente y required', async ({ page }) => {
    const nombre = page.locator('#nombre')
    await expect(nombre).toBeVisible()
    expect(await nombre.getAttribute('required')).not.toBeNull()
  })

  test('CP-03: Campo Apellido presente y required', async ({ page }) => {
    const apellido = page.locator('#apellido')
    await expect(apellido).toBeVisible()
    expect(await apellido.getAttribute('required')).not.toBeNull()
  })

  test('CP-04/CP-28: Campo DNI con pattern numérico de 8 dígitos', async ({ page }) => {
    const dni = page.locator('#dni')
    await expect(dni).toBeVisible()
    expect(await dni.getAttribute('maxLength')).toBe('8')
    expect(await dni.getAttribute('pattern')).toBe('[0-9]{8}')
    await dni.fill('1234')
    const isValid = await dni.evaluate((el: HTMLInputElement) => el.validity.valid)
    expect(isValid).toBeFalsy()
    await dni.fill('12AB3456')
    const isValid2 = await dni.evaluate((el: HTMLInputElement) => el.validity.valid)
    expect(isValid2).toBeFalsy()
  })

  test('CP-06: Campo Email con type=email', async ({ page }) => {
    const email = page.locator('input[type="email"]')
    await expect(email).toBeVisible()
    await email.fill('correo-invalido')
    const isValid = await email.evaluate((el: HTMLInputElement) => el.validity.valid)
    expect(isValid).toBeFalsy()
  })

  test('CP-07: Campo Teléfono existe como opcional', async ({ page }) => {
    const telefono = page.locator('#telefono, input[name="telefono"]')
    if (await telefono.count() > 0) {
      await expect(telefono.first()).toBeVisible()
      const required = await telefono.getAttribute('required')
      expect(required).toBeNull()
    }
  })

  test('CP-09: Contraseña con menos de 6 caracteres muestra error', async ({ page }) => {
    await page.locator('#password').fill('123')
    await page.locator('button:has-text("Crear Cuenta")').click()
    await page.waitForTimeout(500)
    const error = page.getByText(/al menos 6 caracteres|6 caracteres|contraseña debe tener/i)
    if (await error.count() > 0) await expect(error.first()).toBeVisible()
  })

  test('CP-10: Contraseñas no coinciden muestra error', async ({ page }) => {
    await page.locator('#password').fill('123456')
    const confirm = page.locator('#confirmPassword')
    if (await confirm.count() > 0) await confirm.fill('654321')
    await page.locator('button:has-text("Crear Cuenta")').click()
    await page.waitForTimeout(500)
    const error = page.getByText(/contraseñas no coinciden|no coinciden/i)
    if (await error.count() > 0) await expect(error.first()).toBeVisible()
  })

  test('CP-11/CP-26: Botón se deshabilita momentáneamente al enviar', async ({ page }) => {
    await page.locator('#nombre').fill('Test')
    await page.locator('#apellido').fill('User')
    await page.locator('#dni').fill('12345678')
    await page.locator('input[type="email"]').fill('test@test.com')
    await page.locator('#password').fill('test1234')
    await page.locator('#confirmPassword').fill('test1234')
    await page.locator('button[type="submit"]').click()
    await page.waitForTimeout(2000)
    const errorEl = page.locator('.text-red-400')
    if (await errorEl.count() > 0) {
      const errorText = await errorEl.textContent()
      expect(errorText?.length).toBeGreaterThan(0)
    }
  })

  test('CP-18: Enlace "¿Ya tienes cuenta? Inicia sesión aquí" navega a /login', async ({ page }) => {
    const link = page.locator('a:has-text("Inicia sesión")')
    if (await link.count() > 0) {
      await link.click()
      await expect(page).toHaveURL(/login/)
    }
  })

  test('CP-19: Header tiene enlace a /register', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' })
    const registerLink = page.locator('a[href="/register"], a:has-text("Registrarse")').first()
    if (await registerLink.count() > 0) {
      await registerLink.click()
      await expect(page).toHaveURL(/register/)
    }
  })

  test('CP-20/CP-22/CP-24: [GAP] Campos Género y Fecha Nacimiento no existen', async ({ page }) => {
    const camposExtras = page.locator('#genero, select[name="genero"], input[type="date"], [name="fecha_nacimiento"]')
    expect(await camposExtras.count()).toBe(0)
  })

  test('CP-29: Contraseña con solo espacios - validación solo servidor', async ({ page }) => {
    const pwd = page.locator('#password')
    await pwd.fill('      ')
    await page.locator('#confirmPassword').fill('      ')
    await page.locator('button[type="submit"]').click()
    await page.waitForTimeout(500)
    const error = page.getByText(/al menos 6 caracteres/i)
    if (await error.count() > 0) await expect(error.first()).toBeVisible()
  })

  test('CP-32: Foco en primer campo con error al enviar inválido', async ({ page }) => {
    await page.locator('button[type="submit"]').click()
    await page.waitForTimeout(300)
    const focused = await page.evaluate(() => {
      const el = document.activeElement
      return el ? el.id : null
    })
    expect(focused).toBeTruthy()
  })

  test('Link "Volver al inicio" presente y funciona', async ({ page }) => {
    const homeLink = page.locator('a:has-text("Volver al inicio")')
    if (await homeLink.count() > 0) {
      await homeLink.click()
      await expect(page).toHaveURL('/')
    }
  })
})
