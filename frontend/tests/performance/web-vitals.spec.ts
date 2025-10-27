import { test, expect } from '@playwright/test';

// Performance thresholds based on Core Web Vitals
const PERFORMANCE_THRESHOLDS = {
  // Core Web Vitals
  LCP: 2500, // Largest Contentful Paint (ms)
  FID: 100,  // First Input Delay (ms)
  CLS: 0.1,  // Cumulative Layout Shift (score)
  
  // Additional metrics
  FCP: 1800, // First Contentful Paint (ms)
  TTI: 3800, // Time to Interactive (ms)
  TBT: 300,  // Total Blocking Time (ms)
  
  // Network metrics
  TTFB: 800, // Time to First Byte (ms)
  
  // Custom thresholds
  PAGE_LOAD: 3000, // Total page load time (ms)
  API_RESPONSE: 1000, // API response time (ms)
};

test.describe('Performance Tests - Web Vitals', () => {
  test('homepage performance meets thresholds', async ({ page }) => {
    // Enable performance tracking
    await page.addInitScript(() => {
      // Track Core Web Vitals
      window.performanceMetrics = {
        navigationStart: performance.timeOrigin,
        metrics: {}
      };
      
      // LCP observer
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        window.performanceMetrics.metrics.LCP = lastEntry.startTime;
      }).observe({ entryTypes: ['largest-contentful-paint'] });
      
      // CLS observer
      let clsValue = 0;
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        }
        window.performanceMetrics.metrics.CLS = clsValue;
      }).observe({ entryTypes: ['layout-shift'] });
      
      // FCP observer
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach(entry => {
          if (entry.name === 'first-contentful-paint') {
            window.performanceMetrics.metrics.FCP = entry.startTime;
          }
        });
      }).observe({ entryTypes: ['paint'] });
    });

    const startTime = Date.now();
    
    // Navigate to homepage
    await page.goto('/', { waitUntil: 'networkidle' });
    
    const loadTime = Date.now() - startTime;
    
    // Wait for metrics to be collected
    await page.waitForTimeout(2000);
    
    // Collect performance metrics
    const metrics = await page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      const paintEntries = performance.getEntriesByType('paint');
      
      return {
        // Navigation Timing API metrics
        ttfb: navigation.responseStart - navigation.requestStart,
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.navigationStart,
        loadComplete: navigation.loadEventEnd - navigation.navigationStart,
        
        // Paint metrics
        fcp: paintEntries.find(entry => entry.name === 'first-contentful-paint')?.startTime || 0,
        
        // Custom metrics from our observers
        lcp: window.performanceMetrics?.metrics.LCP || 0,
        cls: window.performanceMetrics?.metrics.CLS || 0,
        
        // Page size metrics
        transferSize: navigation.transferSize,
        encodedBodySize: navigation.encodedBodySize,
        decodedBodySize: navigation.decodedBodySize,
        
        // Resource timing
        resourceCount: performance.getEntriesByType('resource').length
      };
    });

    console.log('Performance Metrics:', {
      ...metrics,
      totalLoadTime: loadTime,
      performanceScore: calculatePerformanceScore(metrics)
    });

    // Assert performance thresholds
    expect(metrics.ttfb).toBeLessThan(PERFORMANCE_THRESHOLDS.TTFB);
    expect(metrics.fcp).toBeLessThan(PERFORMANCE_THRESHOLDS.FCP);
    expect(loadTime).toBeLessThan(PERFORMANCE_THRESHOLDS.PAGE_LOAD);
    
    if (metrics.lcp > 0) {
      expect(metrics.lcp).toBeLessThan(PERFORMANCE_THRESHOLDS.LCP);
    }
    
    if (metrics.cls > 0) {
      expect(metrics.cls).toBeLessThan(PERFORMANCE_THRESHOLDS.CLS);
    }

    // Additional checks
    expect(metrics.resourceCount).toBeLessThan(100); // Reasonable resource limit
    expect(metrics.transferSize).toBeLessThan(2 * 1024 * 1024); // 2MB transfer limit
  });

  test('authentication page performance', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/auth', { waitUntil: 'networkidle' });
    
    const loadTime = Date.now() - startTime;
    
    const metrics = await page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      return {
        ttfb: navigation.responseStart - navigation.requestStart,
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.navigationStart,
        loadComplete: navigation.loadEventEnd - navigation.navigationStart,
        transferSize: navigation.transferSize
      };
    });

    console.log('Auth Page Performance:', { ...metrics, totalLoadTime: loadTime });

    // Auth page should load quickly
    expect(loadTime).toBeLessThan(2000);
    expect(metrics.ttfb).toBeLessThan(PERFORMANCE_THRESHOLDS.TTFB);
    expect(metrics.transferSize).toBeLessThan(1 * 1024 * 1024); // 1MB for auth page
  });

  test('API response times', async ({ request }) => {
    const endpoints = [
      '/api/health',
      '/api/admin/llm/health'
    ];

    for (const endpoint of endpoints) {
      const startTime = Date.now();
      
      try {
        const response = await request.get(endpoint);
        const responseTime = Date.now() - startTime;
        
        console.log(`${endpoint}: ${responseTime}ms (Status: ${response.status()})`);
        
        // API responses should be fast
        if (response.ok()) {
          expect(responseTime).toBeLessThan(PERFORMANCE_THRESHOLDS.API_RESPONSE);
        } else if (response.status() < 500) {
          // Even error responses should be fast
          expect(responseTime).toBeLessThan(PERFORMANCE_THRESHOLDS.API_RESPONSE);
        }
      } catch (error) {
        console.warn(`Failed to test ${endpoint}:`, error);
      }
    }
  });

  test('large form interaction performance', async ({ page }) => {
    await page.goto('/');
    
    // Find any form on the page
    const form = page.locator('form').first();
    
    if (await form.isVisible()) {
      const inputs = form.locator('input, textarea, select');
      const inputCount = await inputs.count();
      
      if (inputCount > 0) {
        // Measure form interaction time
        const startTime = Date.now();
        
        // Fill out multiple fields quickly
        for (let i = 0; i < Math.min(inputCount, 5); i++) {
          const input = inputs.nth(i);
          const inputType = await input.getAttribute('type') || 'text';
          
          if (inputType === 'email') {
            await input.fill('test@example.com');
          } else if (inputType === 'password') {
            await input.fill('password123');
          } else if (inputType === 'text') {
            await input.fill('Test Value');
          }
          
          // Small delay between inputs to simulate real user interaction
          await page.waitForTimeout(50);
        }
        
        const interactionTime = Date.now() - startTime;
        
        console.log(`Form interaction time: ${interactionTime}ms for ${inputCount} fields`);
        
        // Form interactions should feel responsive
        const averageTimePerField = interactionTime / Math.min(inputCount, 5);
        expect(averageTimePerField).toBeLessThan(200); // 200ms per field max
      }
    }
  });

  test('page memory usage', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Get memory usage (if available)
    const memoryInfo = await page.evaluate(() => {
      // Check if memory API is available
      if ('memory' in performance) {
        return (performance as any).memory;
      }
      return null;
    });
    
    if (memoryInfo) {
      console.log('Memory Usage:', {
        used: Math.round(memoryInfo.usedJSHeapSize / 1024 / 1024),
        total: Math.round(memoryInfo.totalJSHeapSize / 1024 / 1024),
        limit: Math.round(memoryInfo.jsHeapSizeLimit / 1024 / 1024)
      });
      
      // Memory usage should be reasonable (less than 50MB for initial page load)
      expect(memoryInfo.usedJSHeapSize).toBeLessThan(50 * 1024 * 1024);
    } else {
      console.log('Memory API not available in this browser');
    }
  });

  test('bundle size analysis', async ({ page }) => {
    const resourceSizes: { [key: string]: number } = {};
    let totalJSSize = 0;
    let totalCSSSize = 0;
    let totalImageSize = 0;
    
    page.on('response', async (response) => {
      const url = response.url();
      const headers = response.headers();
      const contentLength = parseInt(headers['content-length'] || '0');
      
      if (url.endsWith('.js')) {
        totalJSSize += contentLength;
        resourceSizes[url] = contentLength;
      } else if (url.endsWith('.css')) {
        totalCSSSize += contentLength;
        resourceSizes[url] = contentLength;
      } else if (url.match(/\.(jpg|jpeg|png|gif|webp|svg)$/)) {
        totalImageSize += contentLength;
        resourceSizes[url] = contentLength;
      }
    });
    
    await page.goto('/', { waitUntil: 'networkidle' });
    
    console.log('Bundle Size Analysis:', {
      totalJS: `${Math.round(totalJSSize / 1024)}KB`,
      totalCSS: `${Math.round(totalCSSSize / 1024)}KB`,
      totalImages: `${Math.round(totalImageSize / 1024)}KB`,
      totalAssets: `${Math.round((totalJSSize + totalCSSSize + totalImageSize) / 1024)}KB`
    });
    
    // Bundle size thresholds
    expect(totalJSSize).toBeLessThan(500 * 1024); // 500KB JS limit
    expect(totalCSSSize).toBeLessThan(100 * 1024); // 100KB CSS limit
    expect(totalImageSize).toBeLessThan(1000 * 1024); // 1MB images limit
    
    // Log largest resources
    const sortedResources = Object.entries(resourceSizes)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5);
      
    console.log('Largest Resources:', sortedResources.map(([url, size]) => ({
      url: url.split('/').pop(),
      size: `${Math.round(size / 1024)}KB`
    })));
  });
});

// Helper function to calculate a performance score
function calculatePerformanceScore(metrics: any): number {
  let score = 100;
  
  // Deduct points for slow metrics
  if (metrics.ttfb > PERFORMANCE_THRESHOLDS.TTFB) score -= 10;
  if (metrics.fcp > PERFORMANCE_THRESHOLDS.FCP) score -= 15;
  if (metrics.lcp > PERFORMANCE_THRESHOLDS.LCP) score -= 20;
  if (metrics.cls > PERFORMANCE_THRESHOLDS.CLS) score -= 15;
  
  // Bonus points for fast loading
  if (metrics.ttfb < PERFORMANCE_THRESHOLDS.TTFB / 2) score += 5;
  if (metrics.fcp < PERFORMANCE_THRESHOLDS.FCP / 2) score += 5;
  
  return Math.max(0, Math.min(100, score));
}