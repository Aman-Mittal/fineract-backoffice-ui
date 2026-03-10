import { test, expect } from '@playwright/test';

test.describe('Login', () => {
  test('login page displays correctly', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('h1')).toHaveText('Fineract Backoffice');
    await expect(page.locator('.subtitle')).toHaveText('Sign in to continue');
    await expect(
      page.getByRole('button', { name: 'Sign in with Fineract' })
    ).toBeVisible();
  });

  test('login page shows OAuth hint', async ({ page }) => {
    await page.goto('/');

    await expect(
      page.getByText(/redirected to the Fineract server/i)
    ).toBeVisible();
  });

  test('OAuth callback with mocked token exchange completes login and redirects to home', async ({
    page,
  }) => {
    // Mock the token exchange API - when the app calls POST /oauth2/token, return a valid token
    await page.route('**/oauth2/token', async (route) => {
      if (route.request().method() === 'POST') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            access_token: 'e2e-test-token',
            refresh_token: 'e2e-refresh-token',
            token_type: 'Bearer',
            expires_in: 3600,
            scope: 'read write',
          }),
        });
      } else {
        await route.continue();
      }
    });

    // Set the code verifier in sessionStorage (required for PKCE) - we need to do this
    // before navigating to the callback. We can do it by first going to the app, then
    // executing JS to set sessionStorage, then navigating to the callback.
    await page.goto('/');
    await page.evaluate(() => {
      sessionStorage.setItem('fineract_code_verifier', 'e2e-test-verifier');
    });

    await page.goto('/auth/callback?code=e2e-test-auth-code');

    // Wait for redirect to home
    await expect(page).toHaveURL(/\/home/);
    await expect(page.getByText('Welcome. You are signed in.')).toBeVisible({
      timeout: 5000,
    });
  });

  test('OAuth callback shows error when no authorization code', async ({
    page,
  }) => {
    await page.goto('/auth/callback');

    await expect(
      page.getByText(/No authorization code received/i)
    ).toBeVisible();
  });

  test('OAuth callback shows error link when auth fails', async ({ page }) => {
    await page.goto('/auth/callback?error=access_denied');

    await expect(page.getByText(/Authentication failed/i)).toBeVisible();
    await expect(page.getByRole('link', { name: 'Return to login' })).toBeVisible();
  });
});
