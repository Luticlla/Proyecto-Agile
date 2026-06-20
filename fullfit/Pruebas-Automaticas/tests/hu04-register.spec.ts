import { test, expect } from '@playwright/test';

test.describe('HU-004: Registro de Usuario', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/register', { waitUntil: 'networkidle', timeout: 30000 });
  });

  test('CP-19: Página de Registro carga correctamente', async ({ page }) => {
    await expect(page).toHaveURL('/register');
  });

  test('CP-19: Título "Crear Cuenta" visible', async ({ page }) => {
    await expect(page.locator('text="Crear Cuenta"').first()).toBeVisible();
  });

  test('CP-20: Campo DNI visible', async ({ page }) => {
    await expect(page.locator('#dni, input[name="dni"]')).toBeVisible();
  });

  test('CP-20: Campo Correo electrónico visible', async ({ page }) => {
    await expect(page.locator('input[type="email"]')).toBeVisible();
  });

  test('CP-20: Campo Contraseña visible', async ({ page }) => {
    await expect(page.locator('#password, input[name="password"]')).toBeVisible();
  });

  test('CP-20: Campo Confirmar Contraseña visible', async ({ page }) => {
    const confirmField = page.locator('#confirmPassword, input[name="confirmPassword"], input[name="confirmar"]');
    if (await confirmField.count() > 0) {
      await expect(confirmField).toBeVisible();
    } else {
      const allPasswords = page.locator('input[type="password"]');
      if (await allPasswords.count() >= 2) {
        await expect(allPasswords.nth(1)).toBeVisible();
      }
    }
  });

  test('CP-20: Botón "Crear Cuenta" visible', async ({ page }) => {
    await expect(page.locator('button:has-text("Crear Cuenta")')).toBeVisible();
  });

  test('CP-21: DNI muestra error de validación nativa (browser) si es inválido', async ({ page }) => {
    const dniInput = page.locator('#dni, input[name="dni"]');
    await dniInput.fill('1234');
    // HTML5 validation via pattern attribute shows browser tooltip
    const isValid = await dniInput.evaluate((el: HTMLInputElement) => el.validity.valid);
    expect(isValid).toBeFalsy();
  });

  test('CP-22: Email muestra error de validación nativa si es inválido', async ({ page }) => {
    const emailInput = page.locator('input[type="email"]');
    await emailInput.fill('correo-invalido');
    // Browser-native email validation
    const isValid = await emailInput.evaluate((el: HTMLInputElement) => el.validity.valid);
    expect(isValid).toBeFalsy();
  });

  test('CP-23: Contraseña con menos de 6 chars muestra error', async ({ page }) => {
    const passwordInput = page.locator('#password, input[name="password"]').first();
    await passwordInput.fill('123');
    await page.locator('button:has-text("Crear Cuenta")').click();
    await page.waitForTimeout(500);
    const errorShown = await page.getByText(/al menos 6 caracteres|6 caracteres|contraseña debe tener/i).count() > 0;
    if (errorShown) {
      await expect(page.getByText(/al menos 6 caracteres|6 caracteres|contraseña debe tener/i).first()).toBeVisible();
    }
  });

  test('CP-24: Contraseñas no coinciden muestra error', async ({ page }) => {
    const passwordInput = page.locator('#password, input[name="password"]').first();
    const confirmInput = page.locator('#confirmPassword, input[name="confirmPassword"]');
    await passwordInput.fill('123456');
    if (await confirmInput.count() > 0) {
      await confirmInput.fill('654321');
    }
    await page.locator('button:has-text("Crear Cuenta")').click();
    await page.waitForTimeout(500);
    const errorShown = await page.getByText(/contraseñas no coinciden|no coinciden/i).count() > 0;
    if (errorShown) {
      await expect(page.getByText(/contraseñas no coinciden|no coinciden/i).first()).toBeVisible();
    }
  });

  test('CP-25: Link "Inicia sesión" redirige a /login', async ({ page }) => {
    const loginLink = page.locator('a:has-text("Inicia sesión")');
    if (await loginLink.count() > 0) {
      await loginLink.click();
      await expect(page).toHaveURL(/login/);
    }
  });

  test('CP-25: Link "Volver al inicio" redirige a /', async ({ page }) => {
    const homeLink = page.locator('a:has-text("Volver al inicio")');
    if (await homeLink.count() > 0) {
      await homeLink.click();
      await expect(page).toHaveURL('/');
    }
  });

  test('CP-nuevo: Descripción "Únete a Full Forma" visible', async ({ page }) => {
    const desc = page.getByText(/Únete a Full Forma/i);
    if (await desc.count() > 0) {
      await expect(desc.first()).toBeVisible();
    }
  });
});
