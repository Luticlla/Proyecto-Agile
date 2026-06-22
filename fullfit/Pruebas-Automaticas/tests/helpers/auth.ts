import { type Page } from '@playwright/test'

const TEST_EMAIL = 'test-recepcionista@fullfit.test'
const TEST_PASSWORD = 'Test1234!'

export async function loginAsRecepcionista(page: Page) {
  await page.goto('/login', { waitUntil: 'networkidle', timeout: 30000 })
  await page.locator('#email').fill(TEST_EMAIL)
  await page.locator('#password').fill(TEST_PASSWORD)
  await page.locator('button[type="submit"]').click()
  await page.waitForURL(/recepcionista/, { timeout: 15000 })
}
