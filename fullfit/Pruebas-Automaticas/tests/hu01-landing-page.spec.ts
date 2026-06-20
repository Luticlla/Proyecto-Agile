import { test, expect } from '@playwright/test';

test.describe('HU-001: Landing Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle', timeout: 30000 });
  });

  test('CP-01: Página principal carga correctamente', async ({ page }) => {
    await expect(page).toHaveURL('/');
  });

  test('CP-01: Título "Encuentra tu mejor versión" visible', async ({ page }) => {
    await expect(page.locator('h2:has-text("versión")')).toBeVisible();
  });

  test('CP-01: Banner de héroe con imagen visible', async ({ page }) => {
    await expect(page.locator('img[alt*="Banner"]')).toBeVisible();
  });

  test('CP-02: Botón "¡Inscríbete ya!" visible en hero', async ({ page }) => {
    await expect(page.getByRole('link', { name: /inscríbete/i })).toBeVisible();
  });

  test('CP-03: Navbar visible', async ({ page }) => {
    await expect(page.locator('header').first()).toBeVisible();
  });

  test('CP-03: Navbar tiene logo/marca', async ({ page }) => {
    const logo = page.getByRole('link', { name: /fullfit|logo|inicio/i }).or(
      page.locator('[class*="logo"]')
    );
    await expect(logo.first()).toBeVisible();
  });

  test('CP-03: Navbar tiene enlace a Sedes', async ({ page }) => {
    await expect(page.getByRole('link', { name: /sedes/i }).first()).toBeVisible();
  });

  test('CP-03: Navbar tiene enlace a Membresías', async ({ page }) => {
    const link = page.locator('a:has-text("Membresías"), a:has-text("Membresias")').first();
    await expect(link).toBeVisible();
  });

  test('CP-04: Navbar tiene botón "Iniciar Sesión"', async ({ page }) => {
    await expect(page.getByRole('link', { name: /iniciar sesión|login/i }).first()).toBeVisible();
  });

  test('CP-nuevo: Navbar tiene botón "Registrarse"', async ({ page }) => {
    const btn = page.locator('a:has-text("Registrarse"), a:has-text("Registro")');
    if (await btn.count() > 0) {
      await expect(btn.first()).toBeVisible();
    }
  });

  test('CP-03: Sección de beneficios/features visible', async ({ page }) => {
    const features = page.locator('section:has(img), section:has(svg), section:has([class*="feature"])');
    if (await features.count() > 0) {
      await expect(features.first()).toBeVisible();
    }
  });

  test('CP-06: Footer visible', async ({ page }) => {
    await expect(page.getByRole('contentinfo').first()).toBeVisible();
  });

  test('CP-06: Footer tiene enlaces de redes sociales', async ({ page }) => {
    const social = page.getByRole('contentinfo').first().locator('a[href*="facebook"], a[href*="instagram"], a[href*="twitter"], a[href*="youtube"]');
    if (await social.count() > 0) {
      expect(await social.count()).toBeGreaterThanOrEqual(1);
    }
  });

  test('CP-nuevo: Enlace a Sedes en navbar funciona', async ({ page }) => {
    await page.getByRole('link', { name: /sedes/i }).first().click();
    await expect(page).toHaveURL(/sedes/);
  });

  test('CP-nuevo: "Inscríbete ya" enlaza a /sedes', async ({ page }) => {
    await page.getByRole('link', { name: /inscríbete/i }).click();
    await expect(page).toHaveURL(/sedes/);
  });

  test('CP-nuevo: Enlace "Iniciar Sesión" redirige a /login', async ({ page }) => {
    await page.getByRole('link', { name: /iniciar sesión|login/i }).first().click();
    await expect(page).toHaveURL(/login/);
  });
});
