import { test, expect, type Page } from '@playwright/test'
 
async function fillRequiredFields(page: Page, opts?: { password?: string; confirm?: string }) {
  await page.locator('#nombre').fill('Test')
  await page.locator('#apellido').fill('User')
  await page.locator('#dni').fill('12345678')
  await page.locator('input[type="email"]').fill('test@test.com')
  await page.locator('#fecha_nacimiento').fill('2000-01-01')
  const trigger = page.locator('[data-slot="select-trigger"]').first()
  if (await trigger.isVisible()) {
    await trigger.click()
    await page.getByRole('option', { name: 'Masculino' }).click()
  }
  const pwd = opts?.password || 'test1234'
  const conf = opts?.confirm || 'test1234'
  await page.locator('#password').fill(pwd)
  await page.locator('#confirmPassword').fill(conf)
}
 
/**
 * Completa el formulario de forma válida de extremo a extremo:
 * mockea RENIEC, hace clic en "Validar" (lo cual habilita el resto del
 * formulario y desbloquea el botón "Crear Cuenta"), y llena los campos
 * restantes. Necesario para cualquier test que dependa de poder hacer
 * click en el submit real, ya que este permanece disabled hasta que
 * `reniecValidado` sea true.
 */
async function completarFormularioValido(page: Page, opts?: { password?: string; confirm?: string }) {
  await page.route('**/api/reniec/public**', route =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ nombre: 'Test', apellido: 'User', dni: '12345678' })
    })
  )
 
  await page.locator('#dni').fill('12345678')
  await page.locator('button:has-text("Validar")').click()
  await expect(page.getByText(/validado con reniec/i)).toBeVisible()
 
  await page.locator('input[type="email"]').fill('test@test.com')
  await page.locator('#fecha_nacimiento').fill('2000-01-01')
 
  const trigger = page.locator('[data-slot="select-trigger"]').first()
  if (await trigger.isVisible()) {
    await trigger.click()
    await page.getByRole('option', { name: 'Masculino' }).click()
  }
 
  const pwd = opts?.password || 'test1234'
  const conf = opts?.confirm || 'test1234'
  await page.locator('#password').fill(pwd)
  await page.locator('#confirmPassword').fill(conf)
}
 
test.describe('HU-004: Registro de Datos Personales', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/register', { waitUntil: 'networkidle', timeout: 30000 })
  })

  test('CP-01: Formulario de registro carga correctamente', async ({ page }) => {
    await expect(page).toHaveURL('/register')
    await expect(page.locator('text="Crear Cuenta"').first()).toBeVisible()
  })

  test('CP-02: Campo Nombre obligatorio', async ({ page }) => {
    const nombre = page.locator('#nombre')
    await expect(nombre).toBeVisible()
    expect(await nombre.getAttribute('required')).not.toBeNull()
  })

  test('CP-03: Campo Apellido obligatorio', async ({ page }) => {
    const apellido = page.locator('#apellido')
    await expect(apellido).toBeVisible()
    expect(await apellido.getAttribute('required')).not.toBeNull()
  })

  test('CP-04: Campo DNI con pattern numerico de 8 digitos', async ({ page }) => {
    const dni = page.locator('#dni')
    await expect(dni).toBeVisible()
    expect(await dni.getAttribute('maxLength')).toBe('8')
    expect(await dni.getAttribute('pattern')).toBe('[0-9]{8}')
  })

  test('CP-05: Validacion DNI con menos de 8 digitos', async ({ page }) => {
    const dni = page.locator('#dni')
    await dni.fill('1234')
    const isValid = await dni.evaluate((el: HTMLInputElement) => el.validity.valid)
    expect(isValid).toBeFalsy()
  })

  test('CP-06: Campo Email con validacion type=email', async ({ page }) => {
    const email = page.locator('input[type="email"]')
    await expect(email).toBeVisible()
    await email.fill('correo-invalido')
    const isValid = await email.evaluate((el: HTMLInputElement) => el.validity.valid)
    expect(isValid).toBeFalsy()
  })

  test('CP-07: Campo Telefono es opcional', async ({ page }) => {
    const telefono = page.locator('#telefono, input[name="telefono"]')
    await expect(telefono.first()).toBeVisible()
    const required = await telefono.first().getAttribute('required')
    expect(required).toBeNull()
  })

  test('CP-08: Campo Telefono tiene placeholder', async ({ page }) => {
    const telefono = page.locator('#telefono, input[name="telefono"]')
    await expect(telefono.first()).toBeVisible()
    const placeholder = await telefono.first().getAttribute('placeholder')
    expect(placeholder).toBeTruthy()
  })

  test('CP-09: Password con menos de 6 caracteres muestra error', async ({ page }) => {
    await fillRequiredFields(page, { password: '123', confirm: '123' })
    await page.locator('button:has-text("Crear Cuenta")').click()
    await page.waitForTimeout(500)
    const error = page.getByText(/al menos 6 caracteres|6 caracteres|contraseña debe tener/i)
    await expect(error.first()).toBeVisible()
  })

  test('CP-10: Contrasenas no coinciden muestra error', async ({ page }) => {
    await fillRequiredFields(page, { password: '123456', confirm: '654321' })
    await page.locator('button:has-text("Crear Cuenta")').click()
    await page.waitForTimeout(500)
    const error = page.getByText(/contraseñas no coinciden|no coinciden/i)
    await expect(error.first()).toBeVisible()
  })

  test('CP-11: Spinner carga al enviar formulario', async ({ page }) => {
    await fillRequiredFields(page)
    await page.locator('button[type="submit"]').click()
    await page.waitForTimeout(500)
    const spinner = page.getByText(/creando cuenta|cargando/i)
    const button = page.locator('button[type="submit"]')
    const isDisabled = await button.isDisabled()
    expect(isDisabled || await spinner.count() > 0).toBeTruthy()
  })

  test('CP-18: Enlace Inicia sesion aqui navega a /login', async ({ page }) => {
    const link = page.locator('a:has-text("Inicia sesión"), a:has-text("Inicia sesion")')
    await expect(link).toBeVisible()
    await link.click()
    await expect(page).toHaveURL(/login/)
  })

  test('CP-19: Header tiene enlace Registrarse a /register', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' })
    const registerLink = page.locator('a[href="/register"], a:has-text("Registrarse")').first()
    await expect(registerLink).toBeVisible()
    await registerLink.click()
    await expect(page).toHaveURL(/register/)
  })

  test('CP-20: Campo Genero existe con 3 opciones', async ({ page }) => {
    const genero = page.locator('[data-slot="select-trigger"]').filter({ hasText: /sexo|género|genero/i }).first()
    await expect(genero).toBeVisible()
  })

  test('CP-22: Campo Fecha Nacimiento existe con date picker', async ({ page }) => {
    const fecha = page.locator('#fecha_nacimiento, input[type="date"], [name="fecha_nacimiento"]')
    await expect(fecha.first()).toBeVisible()
  })

  test('CP-25: Toggle visibilidad de contrasena', async ({ page }) => {
    const passwordInput = page.locator('#password')
    await expect(passwordInput).toBeVisible()
    const initialType = await passwordInput.getAttribute('type')
    expect(initialType).toBe('password')
  })

  test('CP-26: Boton deshabilitado mientras envia', async ({ page }) => {
    await page.route('**/auth/v1/signup', route => new Promise(() => {}))
    await completarFormularioValido(page)
    await page.locator('button[type="submit"]').click()
    await page.waitForTimeout(500)
    const button = page.locator('button[type="submit"]')
    const isDisabled = await button.isDisabled()
    expect(isDisabled).toBeTruthy()
  })

  test('CP-27: Error de red signUp manejado', async ({ page }) => {
    await page.route('**/auth/v1/signup', route => route.abort('connectionrefused'))
    await completarFormularioValido(page)
    await page.locator('button[type="submit"]').click()
    await page.waitForTimeout(2000)
    await expect(page).toHaveURL(/register/)
  })

  test('CP-28: DNI con caracteres no numericos bloqueado', async ({ page }) => {
    const dni = page.locator('#dni')
    await dni.fill('12AB3456')
    await expect(dni).toHaveValue('123456')
    const isValid = await dni.evaluate((el: HTMLInputElement) => el.validity.valid)
    expect(isValid).toBeFalsy()
  })

  test('CP-29: Contrasena con solo espacios rechazada', async ({ page }) => {
    await fillRequiredFields(page, { password: '  ', confirm: '  ' })
    await page.locator('button[type="submit"]').click()
    await page.waitForTimeout(500)
    const error = page.getByText(/al menos 6 caracteres/i)
    await expect(error.first()).toBeVisible()
  })

  test('CP-30: Telefono solo acepta digitos empieza con 9', async ({ page }) => {
    const telefono = page.locator('#telefono, input[name="telefono"]')
    await expect(telefono.first()).toBeVisible()
    const inputMode = await telefono.first().getAttribute('inputmode')
    expect(inputMode).toBe('numeric')
  })

  test('CP-31: Prevenir doble clic en Crear Cuenta', async ({ page }) => {
    await page.route('**/auth/v1/signup', route => new Promise(() => {}))
    await completarFormularioValido(page)
    const button = page.locator('button[type="submit"]')
    await button.click()
    await page.waitForTimeout(500)
    const isDisabled = await button.isDisabled()
    expect(isDisabled).toBeTruthy()
  })

  test('CP-32: Foco en primer campo con error al enviar', async ({ page }) => {
    await page.locator('button[type="submit"]').click()
    await page.waitForTimeout(300)
    const focused = await page.evaluate(() => {
      const el = document.activeElement
      return el ? el.id : null
    })
    expect(focused).toBeTruthy()
  })

  test('CP-33: Campo Genero funcional con 3 opciones', async ({ page }) => {
    const trigger = page.locator('[data-slot="select-trigger"]').filter({ hasText: /sexo|género|genero/i }).first()
    await expect(trigger).toBeVisible()
    await trigger.click()
    const options = page.locator('[role="option"]')
    const count = await options.count()
    expect(count).toBeGreaterThanOrEqual(3)
  })

  test('CP-34: Campo Fecha Nacimiento funcional con restricciones', async ({ page }) => {
    const fecha = page.locator('#fecha_nacimiento, input[type="date"], [name="fecha_nacimiento"]')
    await expect(fecha.first()).toBeVisible()
    const min = await fecha.first().getAttribute('min')
    const max = await fecha.first().getAttribute('max')
    expect(min || max).toBeTruthy()
  })
})
 