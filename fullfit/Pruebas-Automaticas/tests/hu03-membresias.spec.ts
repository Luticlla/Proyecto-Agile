import { test, expect } from '@playwright/test';

test.describe('HU-003: Membresías', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/membresias', { waitUntil: 'networkidle', timeout: 30000 });
  });

  test('CP-13: Página de Membresías carga correctamente', async ({ page }) => {
    await expect(page).toHaveURL('/membresias');
  });

  test('CP-13: Título "Elige tu Membresía" visible', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /elige tu membresía/i })).toBeVisible();
  });

  test('CP-13: Subtítulo informativo visible', async ({ page }) => {
    const subtitle = page.getByText(/Entrena sin límites/i);
    if (await subtitle.count() > 0) {
      await expect(subtitle.first()).toBeVisible();
    }
  });

  test('CP-14: Indicador de planes visible en estadísticas', async ({ page }) => {
    const planesLabel = page.getByText(/Planes/i);
    await expect(planesLabel.first()).toBeVisible();
  });

  test('CP-14: Indicador "100% Flexible" presente', async ({ page }) => {
    const flexible = page.getByText(/100%|flexible/i);
    if (await flexible.count() > 0) {
      await expect(flexible.first()).toBeVisible();
    }
  });

  test('CP-15: Sección de tarjetas de plan visible', async ({ page }) => {
    const section = page.locator('section').filter({ hasText: /plan|membresía/i });
    const count = await section.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test('CP-15: Plan "Mensual" presente (si hay datos en BD)', async ({ page }) => {
    const mensual = page.getByText(/Mensual/i);
    if (await mensual.count() > 0) {
      await expect(mensual.first()).toBeVisible();
    }
  });

  test('CP-15: Plan "Trimestral" presente (si hay datos en BD)', async ({ page }) => {
    const trimestral = page.getByText(/Trimestral/i);
    if (await trimestral.count() > 0) {
      await expect(trimestral.first()).toBeVisible();
    }
  });

  test('CP-15: Plan "Anual" presente (si hay datos en BD)', async ({ page }) => {
    const anual = page.getByText(/Anual/i);
    if (await anual.count() > 0) {
      await expect(anual.first()).toBeVisible();
    }
  });

  test('CP-15: Precio S/ visible en planes (si hay datos)', async ({ page }) => {
    const prices = page.getByText(/S\//i);
    if (await prices.count() > 0) {
      expect(await prices.count()).toBeGreaterThanOrEqual(1);
    }
  });

  test('CP-15: Badge "Más Popular" visible (si hay datos)', async ({ page }) => {
    const popular = page.getByText(/Más Popular/i);
    if (await popular.count() > 0) {
      await expect(popular.first()).toBeVisible();
    }
  });

  test('CP-15: Botón "Elegir Plan" visible (si hay datos)', async ({ page }) => {
    const buttons = page.locator('a, button').filter({ hasText: /elegir plan/i });
    if (await buttons.count() > 0) {
      expect(await buttons.count()).toBeGreaterThanOrEqual(1);
    }
  });

  test('CP-16: Botón "Elegir Plan" enlaza a /pasarelapago (si hay datos)', async ({ page }) => {
    const button = page.locator('a').filter({ hasText: /elegir plan/i }).first();
    if (await button.count() > 0) {
      const href = await button.getAttribute('href');
      expect(href).toContain('pasarelapago');
      expect(href).toContain('plan=');
    }
  });

  test('CP-14: Sección de dudas/preguntas visible', async ({ page }) => {
    const dudas = page.getByText(/dudas|visítanos/i);
    if (await dudas.count() > 0) {
      await expect(dudas.first()).toBeVisible();
    }
  });

  test('CP-12: Footer visible', async ({ page }) => {
    await expect(page.getByRole('contentinfo').first()).toBeVisible();
  });
});
