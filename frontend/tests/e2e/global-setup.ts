import { chromium, type FullConfig, type Page } from '@playwright/test';

const MAX_ATTEMPTS = 40;
const RETRY_DELAY_MS = 1500;

async function waitForServer(page: Page, baseURL: string) {
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      const response = await page.goto(baseURL, {
        timeout: 5000,
        waitUntil: 'domcontentloaded',
      });

      if (response && response.ok()) {
        return;
      }
    } catch (error) {
      // Swallow and retry below.
    }

    await page.waitForTimeout(RETRY_DELAY_MS);
  }

  throw new Error(
    `Dev server at ${baseURL} did not respond with 2xx within ${MAX_ATTEMPTS} attempts.`,
  );
}

async function globalSetup(config: FullConfig) {
  console.log('🚀 Starting global setup for E2E tests...');

  const baseURL =
    config.projects[0]?.use?.baseURL ||
    process.env.PLAYWRIGHT_BASE_URL ||
    'http://localhost:5173';

  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    console.log(`⏳ Waiting for dev server at ${baseURL}...`);
    await waitForServer(page, baseURL);
    console.log('✅ Dev server responded successfully.');
  } catch (error) {
    console.warn('⚠️ Global setup could not confirm dev server readiness:', error);
  } finally {
    await context.close();
    await browser.close();
  }
}

export default globalSetup;
