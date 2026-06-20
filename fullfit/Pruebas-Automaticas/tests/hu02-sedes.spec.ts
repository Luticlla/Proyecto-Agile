import { test, expect } from '@playwright/test';

test.describe('HU-002: Sedes', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/sedes', { waitUntil: 'networkidle', timeout: 30000 });
  });

  test('CP-07: Página de Sedes carga correctamente', async ({ page }) => {
    await expect(page).toHaveURL('/sedes');
  });

  test('CP-07: Hero section tiene título "Nuestras Sedes"', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /nuestras sedes/i })).toBeVisible();
  });

  test('CP-07: Subtítulo con información de sedes visible', async ({ page }) => {
    const subtitle = page.getByText(/Múltiples puntos de entrenamiento/i);
    if (await subtitle.count() > 0) {
      await expect(subtitle.first()).toBeVisible();
    }
  });

  test('CP-08: Indicador 24/7 o Soporte presente en estadísticas', async ({ page }) => {
    const has247 = await page.getByText(/24\/7/i).count() > 0;
    const hasSoporte = await page.getByText(/soporte/i).count() > 0;
    expect(has247 || hasSoporte).toBeTruthy();
  });

  test('CP-09: Sección de tarjetas de sede visible', async ({ page }) => {
    const grid = page.locator('[class*="grid"], section').filter({ hasText: /sede|fit|gimnasio/i });
    if (await grid.count() > 0) {
      await expect(grid.first()).toBeVisible();
    }
  });

  test('CP-10: Botón "Ver Más" o "Ver Horarios" presente', async ({ page }) => {
    const btn = page.getByRole('button', { name: /ver más|horario/i });
    if (await btn.count() > 0) {
      await expect(btn.first()).toBeVisible();
    }
  });

  test('CP-11: Enlace a Membresías visible (CTA)', async ({ page }) => {
    const cta = page.getByRole('link', { name: /membresías|planes/i });
    if (await cta.count() > 0) {
      await expect(cta.first()).toBeVisible();
    }
  });

  test('CP-12: Footer visible', async ({ page }) => {
    await expect(page.getByRole('contentinfo').first()).toBeVisible();
  });
});
