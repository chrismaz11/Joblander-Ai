import { chromium, type FullConfig } from '@playwright/test';

async function globalSetup(config: FullConfig) {
  console.log('🚀 Starting global setup for E2E tests...');

  // Launch browser for setup
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // Wait for dev server to be ready
    const baseURL = config.projects[0].use.baseURL;
    if (baseURL) {
      console.log(`⏳ Waiting for dev server at ${baseURL}...`);
      
      let retries = 30;
      while (retries > 0) {
        try {
          const response = await page.goto(baseURL, { timeout: 5000 });
          if (response && response.ok()) {
            console.log('✅ Dev server is ready');
            break;
          }
        } catch (error) {
          retries--;
          if (retries === 0) {
            throw new Error(`Dev server at ${baseURL} is not responding after 30 attempts`);
          }
          console.log(`⏳ Retrying... (${30 - retries}/30)`);
          await page.waitForTimeout(2000);
        }
      }
    }

    // Create test user account for E2E tests
    console.log('👤 Setting up test user account...');
    
    await page.goto(`${baseURL}/auth`);
    
    // Fill in registration form
    await page.fill('[data-testid="email-input"]', 'e2e-test@example.com');
    await page.fill('[data-testid="password-input"]', 'TestPassword123!');
    await page.fill('[data-testid="confirm-password-input"]', 'TestPassword123!');
    
    // Submit registration (this might fail if user already exists, which is fine)
    try {
      await page.click('[data-testid="register-button"]');
      await page.waitForTimeout(2000);
    } catch (error) {
      console.log('ℹ️ Test user might already exist, continuing...');
    }

    // Create test resume data
    console.log('📄 Setting up test resume data...');
    
    // Login first
    await page.goto(`${baseURL}/auth`);
    await page.fill('[data-testid="email-input"]', 'e2e-test@example.com');
    await page.fill('[data-testid="password-input"]', 'TestPassword123!');
    await page.click('[data-testid="login-button"]');
    
    // Wait for login to complete
    await page.waitForTimeout(3000);
    
    // Check if we're logged in by looking for a logged-in indicator
    const isLoggedIn = await page.isVisible('[data-testid="user-profile"]').catch(() => false);
    
    if (isLoggedIn) {
      console.log('✅ Test user logged in successfully');
      
      // Create a test resume if needed
      const hasResume = await page.isVisible('[data-testid="resume-list"]').catch(() => false);
      
      if (!hasResume) {
        await page.goto(`${baseURL}/resume/create`);
        
        // Fill basic resume information
        await page.fill('[data-testid="name-input"]', 'E2E Test User');
        await page.fill('[data-testid="email-input"]', 'e2e-test@example.com');
        await page.fill('[data-testid="phone-input"]', '+1234567890');
        
        // Save resume
        await page.click('[data-testid="save-resume"]');
        await page.waitForTimeout(2000);
        
        console.log('✅ Test resume created');
      }
    }

    console.log('✅ Global setup completed successfully');

  } catch (error) {
    console.error('❌ Global setup failed:', error);
    // Don't throw here - let tests run even if setup partially fails
  } finally {
    await context.close();
    await browser.close();
  }
}

export default globalSetup;