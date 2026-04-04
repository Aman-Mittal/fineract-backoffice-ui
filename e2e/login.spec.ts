import { test, expect } from '@playwright/test';

test.describe('Login', () => {
  test('login page displays correctly', async ({ page }) => {
    await page.goto('/login');

    await expect(page.locator('h1')).toHaveText('Fineract Backoffice UI');
    await expect(page.locator('.subtitle')).toHaveText('Manage your community bank operations');
    await expect(page.getByRole('button', { name: 'Sign In' })).toBeVisible();
  });

  test('login form has required fields', async ({ page }) => {
    await page.goto('/login');

    await expect(page.locator('#serverUrl')).toBeVisible();
    await expect(page.locator('#tenantId')).toBeVisible();
    await expect(page.locator('#username')).toBeVisible();
    await expect(page.locator('#password')).toBeVisible();
  });

  test('submit button is disabled when form is empty', async ({ page }) => {
    await page.goto('/login');

    const submitButton = page.getByRole('button', { name: 'Sign In' });
    await expect(submitButton).toBeDisabled();
  });

  test('submit button is enabled when form is filled', async ({ page }) => {
    await page.goto('/login');

    await page.locator('#tenantId').fill('default');
    await page.locator('#username').fill('testuser');
    await page.locator('#password').fill('password');

    const submitButton = page.getByRole('button', { name: 'Sign In' });
    await expect(submitButton).toBeEnabled();
  });
});
