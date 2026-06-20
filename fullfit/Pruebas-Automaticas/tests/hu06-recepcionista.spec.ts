import { test, expect } from '@playwright/test';

const SUPABASE_URL = 'https://aqxwtuiqcqixsrshzrby.supabase.co';
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFxeHd0dWlxY3FpeHNy c2h6cmJ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk5Njg3NzAsImV4cCI6MjA1NTU0NDc3MH0.yvRjpcw5lkJwBDLJLNO4WLC8OWf3fMh_YPbEteTVWyk';

async function trySignIn(page: any): Promise<boolean> {
  const testEmail = `test_recep_${Date.now()}@fullfit.test`;
  const testPassword = 'Test1234!';
  try {
    const response = await page.request.post(`${SUPABASE_URL}/auth/v1/signup`, {
      headers: {
        'apikey': ANON_KEY,
        'Content-Type': 'application/json',
      },
      data: { email: testEmail, password: testPassword },
    });
    if (response.ok()) {
      // Wait a moment for the session to be established
      await page.waitForTimeout(500);
      // Try to sign in with the same credentials
      const signinRes = await page.request.post(
        `${SUPABASE_URL}/auth/v1/token?grant_type=password`,
        {
          headers: {
            'apikey': ANON_KEY,
            'Content-Type': 'application/json',
          },
          data: { email: testEmail, password: testPassword },
        }
      );
      if (signinRes.ok()) {
        const json = await signinRes.json();
        // Set the session cookies
        await page.context().addCookies([
          {
            name: 'sb-access-token',
            value: json.access_token,
            domain: 'localhost',
            path: '/',
          },
          {
            name: 'sb-refresh-token',
            value: json.refresh_token,
            domain: 'localhost',
            path: '/',
          },
        ]);
        return true;
      }
    }
  } catch {
    // Auth failed, will skip auth-dependent tests
  }
  return false;
}

test.describe('HU-006: Recepcionista', () => {
  test('CP-41: Redirección a /login si no autenticado', async ({ page }) => {
    await page.goto('/recepcionista', { waitUntil: 'networkidle' });
    await expect(page).toHaveURL(/login/);
  });

  test.describe('Pruebas autenticadas (requieren sesión)', () => {
    let authed = false;

    test.beforeAll(async ({ browser }) => {
      const context = await browser.newContext();
      const page = await context.newPage();
      authed = await trySignIn(page);
      await context.close();
    });

    test('CP-42: Vista de dashboard carga correctamente', async ({ page }) => {
      test.skip(!authed, 'No se pudo establecer sesión de prueba');
      const signedIn = await trySignIn(page);
      test.skip(!signedIn, 'No se pudo establecer sesión de prueba');
      await page.goto('/recepcionista', { waitUntil: 'networkidle' });
      // Should not redirect to login
      expect(page.url()).not.toContain('/login');
      await expect(page.getByRole('heading', { name: /bienvenido/i })).toBeVisible();
    });

    test('CP-43: Navegación con enlaces a Clientes, Membresías, Reportes', async ({ page }) => {
      test.skip(!authed, 'No se pudo establecer sesión de prueba');
      const signedIn = await trySignIn(page);
      test.skip(!signedIn, 'No se pudo establecer sesión de prueba');
      await page.goto('/recepcionista', { waitUntil: 'networkidle' });
      const clientesLink = page.getByRole('link', { name: /clientes/i });
      const membresiasLink = page.getByRole('link', { name: /membresías/i });
      const reportesLink = page.getByRole('link', { name: /reportes/i });
      await expect(clientesLink.first()).toBeVisible();
      await expect(membresiasLink.first()).toBeVisible();
      await expect(reportesLink.first()).toBeVisible();
    });

    test('CP-44: Cards de estadísticas visibles', async ({ page }) => {
      test.skip(!authed, 'No se pudo establecer sesión de prueba');
      const signedIn = await trySignIn(page);
      test.skip(!signedIn, 'No se pudo establecer sesión de prueba');
      await page.goto('/recepcionista', { waitUntil: 'networkidle' });
      await expect(page.getByText(/total clientes/i)).toBeVisible();
      await expect(page.getByText(/membresías activas/i)).toBeVisible();
      await expect(page.getByText(/membresías por vencer/i)).toBeVisible();
    });

    test('CP-49: Página de Membresías muestra "Próximamente"', async ({ page }) => {
      test.skip(!authed, 'No se pudo establecer sesión de prueba');
      const signedIn = await trySignIn(page);
      test.skip(!signedIn, 'No se pudo establecer sesión de prueba');
      await page.goto('/recepcionista/membresias', { waitUntil: 'networkidle' });
      await expect(page.getByRole('heading', { name: /membresías/i })).toBeVisible();
      await expect(page.getByText(/próximamente/i)).toBeVisible();
    });

    test('CP-50: Página de Reportes muestra "Próximamente"', async ({ page }) => {
      test.skip(!authed, 'No se pudo establecer sesión de prueba');
      const signedIn = await trySignIn(page);
      test.skip(!signedIn, 'No se pudo establecer sesión de prueba');
      await page.goto('/recepcionista/reportes', { waitUntil: 'networkidle' });
      await expect(page.getByRole('heading', { name: /reportes/i })).toBeVisible();
      await expect(page.getByText(/próximamente/i)).toBeVisible();
    });
  });
});
