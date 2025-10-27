import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Start from the home page
    await page.goto('/');
  });

  test('should display login form', async ({ page }) => {
    // Navigate to auth page
    await page.click('[data-testid="login-button"]');
    
    // Check that login form is visible
    await expect(page.locator('[data-testid="login-form"]')).toBeVisible();
    await expect(page.locator('[data-testid="email-input"]')).toBeVisible();
    await expect(page.locator('[data-testid="password-input"]')).toBeVisible();
    await expect(page.locator('[data-testid="submit-login"]')).toBeVisible();
  });

  test('should switch between login and signup forms', async ({ page }) => {
    await page.click('[data-testid="login-button"]');
    
    // Should show login form by default
    await expect(page.locator('[data-testid="login-form"]')).toBeVisible();
    
    // Switch to signup
    await page.click('[data-testid="switch-to-signup"]');
    await expect(page.locator('[data-testid="signup-form"]')).toBeVisible();
    await expect(page.locator('[data-testid="confirm-password-input"]')).toBeVisible();
    
    // Switch back to login
    await page.click('[data-testid="switch-to-login"]');
    await expect(page.locator('[data-testid="login-form"]')).toBeVisible();
    await expect(page.locator('[data-testid="confirm-password-input"]')).not.toBeVisible();
  });

  test('should validate email format', async ({ page }) => {
    await page.click('[data-testid="login-button"]');
    
    // Enter invalid email
    await page.fill('[data-testid="email-input"]', 'invalid-email');
    await page.fill('[data-testid="password-input"]', 'password123');
    await page.click('[data-testid="submit-login"]');
    
    // Should show email validation error
    await expect(page.locator('[data-testid="email-error"]')).toContainText('Invalid email format');
  });

  test('should validate password requirements', async ({ page }) => {
    await page.click('[data-testid="login-button"]');
    await page.click('[data-testid="switch-to-signup"]');
    
    // Enter weak password
    await page.fill('[data-testid="email-input"]', 'test@example.com');
    await page.fill('[data-testid="password-input"]', '123');
    await page.fill('[data-testid="confirm-password-input"]', '123');
    await page.click('[data-testid="submit-signup"]');
    
    // Should show password validation error
    await expect(page.locator('[data-testid="password-error"]')).toContainText('Password must be at least 8 characters');
  });

  test('should validate password confirmation match', async ({ page }) => {
    await page.click('[data-testid="login-button"]');
    await page.click('[data-testid="switch-to-signup"]');
    
    // Enter mismatched passwords
    await page.fill('[data-testid="email-input"]', 'test@example.com');
    await page.fill('[data-testid="password-input"]', 'password123');
    await page.fill('[data-testid="confirm-password-input"]', 'password456');
    await page.click('[data-testid="submit-signup"]');
    
    // Should show password mismatch error
    await expect(page.locator('[data-testid="confirm-password-error"]')).toContainText('Passwords do not match');
  });

  test('should handle login with valid credentials', async ({ page }) => {
    await page.click('[data-testid="login-button"]');
    
    // Fill in login form
    await page.fill('[data-testid="email-input"]', 'test@example.com');
    await page.fill('[data-testid="password-input"]', 'password');
    
    // Submit form
    await page.click('[data-testid="submit-login"]');
    
    // Should redirect to dashboard
    await expect(page).toHaveURL(/.*dashboard/);
    
    // Should show user profile
    await expect(page.locator('[data-testid="user-profile"]')).toBeVisible();
  });

  test('should handle login with invalid credentials', async ({ page }) => {
    await page.click('[data-testid="login-button"]');
    
    // Fill in login form with wrong credentials
    await page.fill('[data-testid="email-input"]', 'test@example.com');
    await page.fill('[data-testid="password-input"]', 'wrongpassword');
    
    // Submit form
    await page.click('[data-testid="submit-login"]');
    
    // Should show error message
    await expect(page.locator('[data-testid="login-error"]')).toContainText('Invalid credentials');
    
    // Should remain on auth page
    await expect(page.locator('[data-testid="login-form"]')).toBeVisible();
  });

  test('should handle successful signup', async ({ page }) => {
    await page.click('[data-testid="login-button"]');
    await page.click('[data-testid="switch-to-signup"]');
    
    // Fill signup form
    const uniqueEmail = `test-${Date.now()}@example.com`;
    await page.fill('[data-testid="email-input"]', uniqueEmail);
    await page.fill('[data-testid="password-input"]', 'password123');
    await page.fill('[data-testid="confirm-password-input"]', 'password123');
    
    // Submit form
    await page.click('[data-testid="submit-signup"]');
    
    // Should redirect to dashboard or show success message
    // Depending on your app's flow (email verification, etc.)
    const hasRedirected = await page.locator('[data-testid="user-profile"]').isVisible().catch(() => false);
    const hasSuccessMessage = await page.locator('[data-testid="signup-success"]').isVisible().catch(() => false);
    
    expect(hasRedirected || hasSuccessMessage).toBe(true);
  });

  test('should toggle password visibility', async ({ page }) => {
    await page.click('[data-testid="login-button"]');
    
    // Fill password field
    await page.fill('[data-testid="password-input"]', 'secretpassword');
    
    // Password should be hidden by default
    const passwordInput = page.locator('[data-testid="password-input"]');
    await expect(passwordInput).toHaveAttribute('type', 'password');
    
    // Click toggle button
    await page.click('[data-testid="toggle-password"]');
    
    // Password should now be visible
    await expect(passwordInput).toHaveAttribute('type', 'text');
    
    // Click toggle again
    await page.click('[data-testid="toggle-password"]');
    
    // Password should be hidden again
    await expect(passwordInput).toHaveAttribute('type', 'password');
  });

  test('should handle social login options', async ({ page }) => {
    await page.click('[data-testid="login-button"]');
    
    // Check that social login buttons are present
    await expect(page.locator('[data-testid="google-login"]')).toBeVisible();
    await expect(page.locator('[data-testid="amazon-login"]')).toBeVisible();
    
    // Click Google login (should open OAuth flow)
    await page.click('[data-testid="google-login"]');
    
    // Should either redirect to Google or show loading state
    // Depending on how OAuth is implemented
    await page.waitForTimeout(1000);
    
    // For testing purposes, this might open a new tab or redirect
    // In a real test, you might need to handle OAuth flow differently
  });

  test('should handle logout', async ({ page }) => {
    // First login
    await page.click('[data-testid="login-button"]');
    await page.fill('[data-testid="email-input"]', 'test@example.com');
    await page.fill('[data-testid="password-input"]', 'password');
    await page.click('[data-testid="submit-login"]');
    
    // Wait for redirect
    await expect(page).toHaveURL(/.*dashboard/);
    
    // Click logout
    await page.click('[data-testid="logout-button"]');
    
    // Should redirect to home page
    await expect(page).toHaveURL('/');
    
    // Should show login button again
    await expect(page.locator('[data-testid="login-button"]')).toBeVisible();
  });

  test('should remember form data on tab switch', async ({ page }) => {
    await page.click('[data-testid="login-button"]');
    
    // Fill login form
    await page.fill('[data-testid="email-input"]', 'test@example.com');
    await page.fill('[data-testid="password-input"]', 'password123');
    
    // Switch to signup
    await page.click('[data-testid="switch-to-signup"]');
    
    // Switch back to login
    await page.click('[data-testid="switch-to-login"]');
    
    // Email should be preserved
    await expect(page.locator('[data-testid="email-input"]')).toHaveValue('test@example.com');
    
    // Password might be cleared for security (depends on implementation)
    // await expect(page.locator('[data-testid="password-input"]')).toHaveValue('');
  });

  test('should be accessible', async ({ page }) => {
    await page.click('[data-testid="login-button"]');
    
    // Check that form has proper ARIA labels
    const emailInput = page.locator('[data-testid="email-input"]');
    const passwordInput = page.locator('[data-testid="password-input"]');
    const submitButton = page.locator('[data-testid="submit-login"]');
    
    // Inputs should have proper labels
    await expect(emailInput).toHaveAttribute('aria-label');
    await expect(passwordInput).toHaveAttribute('aria-label');
    
    // Button should have proper text
    await expect(submitButton).not.toBeEmpty();
    
    // Form should be keyboard navigable
    await emailInput.press('Tab');
    await expect(passwordInput).toBeFocused();
    
    await passwordInput.press('Tab');
    await expect(submitButton).toBeFocused();
  });
});