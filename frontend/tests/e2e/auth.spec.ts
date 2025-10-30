import { test, expect, type Route } from '@playwright/test';

const respondJson = (route: Route, status: number, data: unknown) =>
  route.fulfill({
    status,
    contentType: 'application/json',
    body: JSON.stringify(data),
  });

const unauthenticatedPayload = { message: 'Not authenticated' };

test.describe('Authentication Flow', () => {
  test('should display login form when navigating from the header', async ({ page }) => {
    await page.route('**/api/auth/user', (route) =>
      respondJson(route, 401, unauthenticatedPayload),
    );

    await page.goto('/');
    await page.click('[data-testid="login-button"]');

    await expect(page).toHaveURL(/\/login$/);
    await expect(page.locator('[data-testid="login-form"]')).toBeVisible();
    await expect(page.locator('[data-testid="email-input"]')).toBeVisible();
    await expect(page.locator('[data-testid="first-name-input"]')).toBeVisible();
    await expect(page.locator('[data-testid="last-name-input"]')).toBeVisible();
    await expect(page.locator('[data-testid="submit-login"]')).toBeVisible();
  });

  test('should validate email format with native browser validation', async ({ page }) => {
    await page.route('**/api/auth/user', (route) =>
      respondJson(route, 401, unauthenticatedPayload),
    );

    await page.goto('/');
    await page.click('[data-testid="login-button"]');
    await page.fill('[data-testid="email-input"]', 'invalid-email');
    await page.click('[data-testid="submit-login"]');

    const validationMessage = await page
      .locator('[data-testid="email-input"]')
      .evaluate((el) => (el as HTMLInputElement).validationMessage);

    expect(validationMessage).not.toEqual('');
    await expect(page).toHaveURL(/\/login$/);
  });

  test('should handle successful login and redirect to dashboard', async ({ page }) => {
    let isAuthenticated = false;

    const respondProtected = (route: Route, data: unknown) => {
      if (isAuthenticated) {
        return respondJson(route, 200, data);
      }
      return respondJson(route, 401, unauthenticatedPayload);
    };

    await page.route('**/api/auth/user', (route) =>
      respondProtected(route, {
        id: 'test-user',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        tier: 'free',
      }),
    );

    await page.route('**/api/resumes', (route) => respondProtected(route, []));
    await page.route('**/api/cover-letters', (route) => respondProtected(route, []));
    await page.route('**/api/find-jobs**', (route) =>
      respondProtected(route, { data: [], meta: { total: 0 } }),
    );

    await page.route('**/api/login', async (route) => {
      isAuthenticated = true;
      await respondJson(route, 200, {
        success: true,
        user: {
          id: 'test-user',
          email: 'test@example.com',
          firstName: 'Test',
          lastName: 'User',
        },
      });
    });

    await page.goto('/');
    await page.click('[data-testid="login-button"]');
    await page.fill('[data-testid="email-input"]', `test-${Date.now()}@example.com`);
    await page.fill('[data-testid="first-name-input"]', 'Test');
    await page.fill('[data-testid="last-name-input"]', 'User');
    await page.click('[data-testid="submit-login"]');

    await page.waitForURL(/\/dashboard$/);
    await expect(page.locator('[data-testid="user-profile"]')).toBeVisible();
    await expect(page.locator('h1')).toContainText(/Hello/i);
  });

  test('should surface an error when login request fails', async ({ page }) => {
    await page.route('**/api/auth/user', (route) =>
      respondJson(route, 401, unauthenticatedPayload),
    );

    await page.route('**/api/login', (route) =>
      route.fulfill({
        status: 400,
        contentType: 'text/plain',
        body: 'Invalid credentials',
      }),
    );

    await page.goto('/');
    await page.click('[data-testid="login-button"]');
    await page.fill('[data-testid="email-input"]', 'test@example.com');
    await page.click('[data-testid="submit-login"]');

    await expect(page.locator('[data-testid="login-error"]')).toContainText('Invalid credentials');
    await expect(page).toHaveURL(/\/login$/);
  });

  test('should allow returning to the homepage from login', async ({ page }) => {
    await page.route('**/api/auth/user', (route) =>
      respondJson(route, 401, unauthenticatedPayload),
    );

    await page.goto('/');
    await page.click('[data-testid="login-button"]');
    await page.click('a:has-text("Back to homepage")');
    await expect(page).toHaveURL('/');
  });

  test('login form supports keyboard navigation', async ({ page }) => {
    await page.route('**/api/auth/user', (route) =>
      respondJson(route, 401, unauthenticatedPayload),
    );

    await page.goto('/');
    await page.click('[data-testid="login-button"]');

    const emailInput = page.locator('[data-testid="email-input"]');
    const firstNameInput = page.locator('[data-testid="first-name-input"]');
    const lastNameInput = page.locator('[data-testid="last-name-input"]');
    const submitButton = page.locator('[data-testid="submit-login"]');

    await emailInput.focus();
    await page.keyboard.press('Tab');
    await expect(firstNameInput).toBeFocused();

    await page.keyboard.press('Tab');
    await expect(lastNameInput).toBeFocused();

    await page.keyboard.press('Tab');
    await expect(submitButton).toBeFocused();

    await page.keyboard.press('Shift+Tab');
    await expect(lastNameInput).toBeFocused();

    await page.keyboard.press('Shift+Tab');
    await expect(firstNameInput).toBeFocused();

    await page.keyboard.press('Shift+Tab');
    await expect(emailInput).toBeFocused();
  });
});
