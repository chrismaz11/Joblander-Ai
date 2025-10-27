import { chromium } from '@playwright/test';

async function globalTeardown() {
  console.log('🧹 Starting global teardown for E2E tests...');

  // Launch browser for cleanup
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    const baseURL = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:5173';
    
    // Clean up test data if needed
    console.log('🗑️ Cleaning up test data...');
    
    // Login as test user
    await page.goto(`${baseURL}/auth`);
    await page.fill('[data-testid="email-input"]', 'e2e-test@example.com');
    await page.fill('[data-testid="password-input"]', 'TestPassword123!');
    await page.click('[data-testid="login-button"]');
    
    // Wait for login
    await page.waitForTimeout(3000);
    
    // Delete test resumes if they exist
    try {
      await page.goto(`${baseURL}/dashboard`);
      
      // Look for delete buttons and click them
      const deleteButtons = await page.locator('[data-testid="delete-resume"]').count();
      
      for (let i = 0; i < deleteButtons; i++) {
        await page.click('[data-testid="delete-resume"]');
        await page.click('[data-testid="confirm-delete"]'); // Confirm deletion
        await page.waitForTimeout(1000);
      }
      
      if (deleteButtons > 0) {
        console.log(`🗑️ Deleted ${deleteButtons} test resume(s)`);
      }
    } catch (error) {
      console.log('ℹ️ No test resumes to clean up');
    }

    // Optionally delete test user account
    // Note: In production, you might want to keep test accounts
    // and just clean their data instead of deleting the account
    
    console.log('✅ Global teardown completed successfully');

  } catch (error) {
    console.error('❌ Global teardown failed:', error);
    // Don't throw - teardown failures shouldn't fail the test suite
  } finally {
    await context.close();
    await browser.close();
  }
}

export default globalTeardown;