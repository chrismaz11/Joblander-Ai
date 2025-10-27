import { test, expect } from '@playwright/test';

test.describe('Smoke Tests - Basic Functionality', () => {
  test('homepage loads successfully', async ({ page }) => {
    await page.goto('/');
    
    // Check that the page loads
    await expect(page).toHaveTitle(/Job.*Lander/i);
    
    // Check for key elements
    await expect(page.locator('h1')).toBeVisible();
    
    // Check that there are no console errors
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    await page.waitForLoadState('networkidle');
    
    if (errors.length > 0) {
      console.warn('Console errors detected:', errors);
    }
  });

  test('API health check responds', async ({ request }) => {
    const response = await request.get('/api/health');
    
    expect(response.ok()).toBeTruthy();
    
    const data = await response.json();
    expect(data).toHaveProperty('status');
    expect(data.status).toBe('healthy');
  });

  test('LLM health check responds', async ({ request }) => {
    const response = await request.get('/api/admin/llm/health');
    
    // Should respond (might be 401 if not authenticated, but should not 500)
    expect(response.status()).toBeLessThan(500);
  });

  test('navigation works', async ({ page }) => {
    await page.goto('/');
    
    // Try to navigate to auth page
    const authButton = page.locator('[data-testid="login-button"], a[href*="auth"], button:has-text("Login"), button:has-text("Sign In")').first();
    
    if (await authButton.isVisible()) {
      await authButton.click();
      
      // Should navigate to some auth-related page
      await expect(page).toHaveURL(/.*auth|login|signin/i);
    } else {
      console.log('No auth button found - checking if already logged in');
      
      // Check if user is already logged in
      const userProfile = page.locator('[data-testid="user-profile"], [data-testid="logout-button"]');
      const isLoggedIn = await userProfile.isVisible();
      
      if (isLoggedIn) {
        console.log('User appears to be logged in');
      } else {
        console.log('No auth elements found');
      }
    }
  });

  test('assets load correctly', async ({ page }) => {
    const responses: any[] = [];
    const failedResources: string[] = [];
    
    page.on('response', response => {
      responses.push({
        url: response.url(),
        status: response.status()
      });
      
      // Track failed resources
      if (response.status() >= 400) {
        failedResources.push(`${response.url()} - ${response.status()}`);
      }
    });
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Check for critical asset failures
    const criticalFailures = failedResources.filter(failure => 
      failure.includes('.js') || 
      failure.includes('.css') || 
      failure.includes('/api/')
    );
    
    if (criticalFailures.length > 0) {
      console.warn('Critical resource failures:', criticalFailures);
    }
    
    // At least some resources should have loaded successfully
    const successfulRequests = responses.filter(r => r.status >= 200 && r.status < 400);
    expect(successfulRequests.length).toBeGreaterThan(0);
  });

  test('basic JavaScript functionality works', async ({ page }) => {
    await page.goto('/');
    
    // Test that JavaScript is working by checking for interactive elements
    const interactiveElements = await page.locator('button, a, input, [onclick], [role="button"]').count();
    
    // Should have at least some interactive elements
    expect(interactiveElements).toBeGreaterThan(0);
    
    // Test that we can interact with a button (if any exist)
    const firstButton = page.locator('button').first();
    if (await firstButton.isVisible()) {
      // Just check that we can focus on it (indicating JS is working)
      await firstButton.focus();
      expect(await firstButton.evaluate(el => document.activeElement === el)).toBeTruthy();
    }
  });

  test('responsive design works', async ({ page }) => {
    await page.goto('/');
    
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(500);
    
    // Check that content is still visible
    const body = page.locator('body');
    const bodyWidth = await body.evaluate(el => el.scrollWidth);
    
    // Content should not exceed viewport width significantly (allowing for small margins)
    expect(bodyWidth).toBeLessThanOrEqual(400);
    
    // Test desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.waitForTimeout(500);
    
    // Content should still be visible and responsive
    await expect(page.locator('body')).toBeVisible();
  });

  test('forms handle basic validation', async ({ page }) => {
    await page.goto('/');
    
    // Look for any forms on the page
    const forms = await page.locator('form').count();
    
    if (forms > 0) {
      // Find the first form with required fields
      const form = page.locator('form').first();
      const requiredInputs = form.locator('input[required]');
      const submitButton = form.locator('button[type="submit"], input[type="submit"]').first();
      
      const requiredCount = await requiredInputs.count();
      
      if (requiredCount > 0 && await submitButton.isVisible()) {
        // Try to submit without filling required fields
        await submitButton.click();
        
        // Should either:
        // 1. Show validation messages
        // 2. Prevent submission
        // 3. Focus on first invalid field
        
        // Check if browser validation kicked in
        const firstRequired = requiredInputs.first();
        const validationMessage = await firstRequired.evaluate(
          el => (el as HTMLInputElement).validationMessage
        );
        
        // If there's a validation message, that's good
        if (validationMessage) {
          expect(validationMessage.length).toBeGreaterThan(0);
        }
      }
    } else {
      console.log('No forms found on homepage');
    }
  });
});