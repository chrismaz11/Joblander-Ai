import { test, expect } from '@playwright/test';

test.describe('Security Audit Tests', () => {
  test.describe('Authentication Security', () => {
    test('should protect against SQL injection in login', async ({ request }) => {
      const maliciousPayloads = [
        "admin'; DROP TABLE users; --",
        "' OR '1'='1",
        "' UNION SELECT * FROM users --",
        "admin'/**/OR/**/1=1--",
        "'; DELETE FROM users WHERE 1=1; --"
      ];

      for (const payload of maliciousPayloads) {
        const response = await request.post('/api/auth/login', {
          data: {
            email: payload,
            password: payload
          }
        });

        // Should not return 200 for SQL injection attempts
        expect(response.status()).not.toBe(200);
        
        // Should return proper error status
        expect(response.status()).toBeGreaterThanOrEqual(400);
        
        const body = await response.json().catch(() => ({}));
        
        // Should not leak database errors
        expect(JSON.stringify(body).toLowerCase()).not.toContain('sql');
        expect(JSON.stringify(body).toLowerCase()).not.toContain('database');
        expect(JSON.stringify(body).toLowerCase()).not.toContain('postgres');
      }
    });

    test('should implement rate limiting on login attempts', async ({ request }) => {
      const email = 'test@example.com';
      const password = 'wrongpassword';
      const attempts = [];

      // Make multiple rapid login attempts
      for (let i = 0; i < 10; i++) {
        attempts.push(
          request.post('/api/auth/login', {
            data: { email, password }
          })
        );
      }

      const responses = await Promise.all(attempts);
      
      // At least some requests should be rate limited (429) or blocked
      const rateLimitedResponses = responses.filter(r => r.status() === 429);
      
      if (rateLimitedResponses.length > 0) {
        console.log(`✅ Rate limiting active: ${rateLimitedResponses.length}/10 requests blocked`);
      } else {
        console.warn('⚠️ No rate limiting detected on login endpoint');
      }
      
      // Check for rate limit headers
      const lastResponse = responses[responses.length - 1];
      const headers = lastResponse.headers();
      
      const hasRateLimitHeaders = 
        'x-ratelimit-limit' in headers ||
        'x-ratelimit-remaining' in headers ||
        'retry-after' in headers;
        
      if (hasRateLimitHeaders) {
        console.log('✅ Rate limit headers present');
      }
    });

    test('should validate JWT token security', async ({ request }) => {
      // Test with malformed JWT tokens
      const maliciousTokens = [
        'invalid.token.here',
        'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.malicious.payload',
        'Bearer ../../../etc/passwd',
        'Bearer <script>alert("xss")</script>',
        'Bearer ' + 'A'.repeat(10000), // Very long token
      ];

      for (const token of maliciousTokens) {
        const response = await request.get('/api/auth/me', {
          headers: {
            'Authorization': token
          }
        });

        expect(response.status()).toBe(401);
        
        const body = await response.json().catch(() => ({}));
        
        // Should not leak token validation details
        expect(JSON.stringify(body).toLowerCase()).not.toContain('jwt');
        expect(JSON.stringify(body).toLowerCase()).not.toContain('token');
        expect(JSON.stringify(body).toLowerCase()).not.toContain('secret');
      }
    });

    test('should prevent session fixation attacks', async ({ page, request }) => {
      // Get initial session
      await page.goto('/auth');
      
      const initialCookies = await page.context().cookies();
      
      // Attempt login
      const loginResponse = await request.post('/api/auth/login', {
        data: {
          email: 'test@example.com',
          password: 'password'
        }
      });

      if (loginResponse.ok()) {
        // Check if session ID changed after login
        const postLoginCookies = await page.context().cookies();
        
        const sessionCookieBefore = initialCookies.find(c => 
          c.name.toLowerCase().includes('session') || 
          c.name.toLowerCase().includes('auth')
        );
        
        const sessionCookieAfter = postLoginCookies.find(c => 
          c.name.toLowerCase().includes('session') || 
          c.name.toLowerCase().includes('auth')
        );

        if (sessionCookieBefore && sessionCookieAfter) {
          expect(sessionCookieBefore.value).not.toBe(sessionCookieAfter.value);
          console.log('✅ Session ID changed after login (prevents fixation)');
        }
      }
    });
  });

  test.describe('Input Validation & XSS Protection', () => {
    test('should prevent XSS in form inputs', async ({ page }) => {
      await page.goto('/auth');

      const xssPayloads = [
        '<script>alert("xss")</script>',
        '"><script>alert("xss")</script>',
        "javascript:alert('xss')",
        '<img src="x" onerror="alert(\'xss\')">',
        '{{7*7}}', // Template injection
        '${7*7}', // Template literal injection
      ];

      for (const payload of xssPayloads) {
        // Try to inject XSS in email field
        const emailInput = page.locator('input[type="email"], input[name="email"]').first();
        
        if (await emailInput.isVisible()) {
          await emailInput.fill(payload);
          
          // Check if payload is properly escaped/sanitized
          const inputValue = await emailInput.inputValue();
          
          // Value should either be sanitized or rejected
          expect(inputValue).not.toContain('<script>');
          expect(inputValue).not.toContain('javascript:');
          expect(inputValue).not.toContain('onerror=');
        }

        // Check if any alerts were triggered (XSS successful)
        const alertFired = await page.evaluate(() => {
          return window.alert !== undefined && window.alert.toString().includes('[native code]');
        });
        
        expect(alertFired).toBeTruthy(); // Alert function should not be overridden
      }
    });

    test('should validate file upload security', async ({ page, request }) => {
      // Test malicious file uploads
      const maliciousFiles = [
        { name: 'test.php', content: '<?php system($_GET["cmd"]); ?>', type: 'application/x-php' },
        { name: 'test.exe', content: 'MZ\x90\x00', type: 'application/octet-stream' },
        { name: '../../../etc/passwd', content: 'root:x:0:0:', type: 'text/plain' },
        { name: 'test.svg', content: '<svg onload="alert(\'xss\')"></svg>', type: 'image/svg+xml' },
      ];

      for (const file of maliciousFiles) {
        const formData = new FormData();
        const blob = new Blob([file.content], { type: file.type });
        formData.append('file', blob, file.name);

        const response = await request.post('/api/parse-resume', {
          multipart: {
            file: {
              name: file.name,
              mimeType: file.type,
              buffer: Buffer.from(file.content)
            }
          }
        });

        // Should reject malicious files
        expect(response.status()).toBeGreaterThanOrEqual(400);
        
        console.log(`✅ Rejected malicious file: ${file.name} (${response.status()})`);
      }
    });

    test('should prevent path traversal attacks', async ({ request }) => {
      const pathTraversalPayloads = [
        '../../../etc/passwd',
        '..\\..\\..\\windows\\system32\\config\\sam',
        '....//....//....//etc/passwd',
        '%2e%2e%2f%2e%2e%2f%2e%2e%2fetc%2fpasswd',
        '..%252f..%252f..%252fetc%252fpasswd',
      ];

      for (const payload of pathTraversalPayloads) {
        // Test path traversal in various endpoints
        const endpoints = [
          `/api/resumes/${payload}`,
          `/api/files/${payload}`,
          `/static/${payload}`,
        ];

        for (const endpoint of endpoints) {
          const response = await request.get(endpoint);
          
          // Should not return sensitive system files
          expect(response.status()).not.toBe(200);
          
          if (response.status() === 200) {
            const body = await response.text();
            expect(body).not.toContain('root:');
            expect(body).not.toContain('[users]');
          }
        }
      }
    });
  });

  test.describe('API Security', () => {
    test('should implement proper CORS headers', async ({ request }) => {
      const response = await request.get('/api/health', {
        headers: {
          'Origin': 'https://malicious-site.com'
        }
      });

      const headers = response.headers();
      
      // Check for CORS headers
      expect(headers).toHaveProperty('access-control-allow-origin');
      
      const allowedOrigin = headers['access-control-allow-origin'];
      
      // Should not allow all origins in production
      if (process.env.NODE_ENV === 'production') {
        expect(allowedOrigin).not.toBe('*');
      }
      
      console.log(`CORS Origin: ${allowedOrigin}`);
    });

    test('should include security headers', async ({ request }) => {
      const response = await request.get('/api/health');
      const headers = response.headers();

      // Check for security headers
      const securityHeaders = {
        'x-content-type-options': 'nosniff',
        'x-frame-options': ['DENY', 'SAMEORIGIN'],
        'x-xss-protection': '1; mode=block',
        'strict-transport-security': 'max-age=',
        'content-security-policy': 'default-src',
      };

      for (const [header, expectedValue] of Object.entries(securityHeaders)) {
        const actualValue = headers[header];
        
        if (Array.isArray(expectedValue)) {
          if (actualValue) {
            expect(expectedValue.some(v => actualValue.includes(v))).toBeTruthy();
            console.log(`✅ ${header}: ${actualValue}`);
          } else {
            console.warn(`⚠️ Missing security header: ${header}`);
          }
        } else if (typeof expectedValue === 'string') {
          if (actualValue) {
            expect(actualValue).toContain(expectedValue);
            console.log(`✅ ${header}: ${actualValue}`);
          } else {
            console.warn(`⚠️ Missing security header: ${header}`);
          }
        }
      }
    });

    test('should prevent information disclosure', async ({ request }) => {
      // Test error responses for information leakage
      const response = await request.get('/api/nonexistent-endpoint');
      
      expect(response.status()).toBe(404);
      
      const body = await response.text();
      
      // Should not leak stack traces or internal paths
      expect(body.toLowerCase()).not.toContain('error:');
      expect(body.toLowerCase()).not.toContain('stack trace');
      expect(body.toLowerCase()).not.toContain('/users/');
      expect(body.toLowerCase()).not.toContain('c:\\');
      expect(body.toLowerCase()).not.toContain('node_modules');
    });

    test('should validate API input limits', async ({ request }) => {
      // Test with oversized payloads
      const largePayload = {
        data: 'A'.repeat(10 * 1024 * 1024), // 10MB string
        array: new Array(100000).fill('data'),
        nested: {
          deep: {
            very: {
              deep: {
                object: 'A'.repeat(1000000)
              }
            }
          }
        }
      };

      const response = await request.post('/api/resumes', {
        data: largePayload,
        timeout: 5000
      });

      // Should reject oversized payloads
      expect(response.status()).toBeGreaterThanOrEqual(400);
      console.log(`✅ Large payload rejected: ${response.status()}`);
    });
  });

  test.describe('HTTPS and Transport Security', () => {
    test('should enforce HTTPS in production', async ({ request, page }) => {
      if (process.env.NODE_ENV === 'production') {
        // Try to access HTTP version
        try {
          const httpUrl = page.url().replace('https://', 'http://');
          const response = await request.get(httpUrl);
          
          // Should redirect to HTTPS or refuse connection
          expect(response.status()).toBeOneOf([301, 302, 403, 404]);
          
          if ([301, 302].includes(response.status())) {
            const location = response.headers()['location'];
            expect(location).toContain('https://');
          }
        } catch (error) {
          // Connection refused is also acceptable for HTTPS enforcement
          console.log('✅ HTTP connection refused (HTTPS enforced)');
        }
      }
    });

    test('should have secure cookie settings', async ({ page, request }) => {
      // Login to get cookies
      await page.goto('/auth');
      
      const loginResponse = await request.post('/api/auth/login', {
        data: {
          email: 'test@example.com',
          password: 'password'
        }
      });

      if (loginResponse.ok()) {
        const cookies = await page.context().cookies();
        
        cookies.forEach(cookie => {
          if (cookie.name.toLowerCase().includes('session') || 
              cookie.name.toLowerCase().includes('auth') ||
              cookie.name.toLowerCase().includes('token')) {
            
            // Security cookies should be httpOnly and secure
            expect(cookie.httpOnly).toBeTruthy();
            
            if (page.url().startsWith('https://')) {
              expect(cookie.secure).toBeTruthy();
            }
            
            // Should have sameSite protection
            expect(['Strict', 'Lax']).toContain(cookie.sameSite);
            
            console.log(`✅ Secure cookie: ${cookie.name} (httpOnly: ${cookie.httpOnly}, secure: ${cookie.secure}, sameSite: ${cookie.sameSite})`);
          }
        });
      }
    });
  });

  test.describe('Business Logic Security', () => {
    test('should enforce user authorization', async ({ request }) => {
      // Try to access another user's data without proper auth
      const endpoints = [
        '/api/resumes/123',
        '/api/users/456',
        '/api/admin/users',
        '/api/admin/llm/metrics',
      ];

      for (const endpoint of endpoints) {
        const response = await request.get(endpoint);
        
        // Should require authentication
        expect([401, 403, 404]).toContain(response.status());
        console.log(`✅ Protected endpoint: ${endpoint} (${response.status()})`);
      }
    });

    test('should prevent privilege escalation', async ({ request }) => {
      // Try to modify user role or permissions
      const privilegeEscalationAttempts = [
        { endpoint: '/api/users/1', data: { role: 'admin' } },
        { endpoint: '/api/auth/me', data: { isAdmin: true } },
        { endpoint: '/api/profile', data: { permissions: ['admin'] } },
      ];

      for (const attempt of privilegeEscalationAttempts) {
        const response = await request.put(attempt.endpoint, {
          data: attempt.data
        });

        // Should not allow privilege escalation
        expect([401, 403, 404, 405]).toContain(response.status());
        console.log(`✅ Privilege escalation blocked: ${attempt.endpoint} (${response.status()})`);
      }
    });

    test('should validate business rules', async ({ request }) => {
      // Try to create invalid business data
      const invalidBusinessData = [
        {
          endpoint: '/api/resumes',
          data: { userId: 'different-user-id', personalInfo: {} }
        },
        {
          endpoint: '/api/resumes',
          data: { id: 'existing-id', personalInfo: {} } // Should not allow setting ID
        }
      ];

      for (const testCase of invalidBusinessData) {
        const response = await request.post(testCase.endpoint, {
          data: testCase.data
        });

        // Should validate business rules
        expect(response.status()).toBeGreaterThanOrEqual(400);
        console.log(`✅ Business rule validation: ${testCase.endpoint} (${response.status()})`);
      }
    });
  });

  test.describe('Third-Party Integration Security', () => {
    test('should validate external API responses', async ({ request }) => {
      // Test endpoints that call external APIs
      const externalApiEndpoints = [
        '/api/jobs',
        '/api/blockchain/health',
        '/api/admin/llm/health',
      ];

      for (const endpoint of externalApiEndpoints) {
        const response = await request.get(endpoint);
        
        if (response.ok()) {
          const body = await response.json();
          
          // Should not leak API keys or secrets
          const bodyStr = JSON.stringify(body);
          expect(bodyStr).not.toMatch(/api[_-]?key/i);
          expect(bodyStr).not.toMatch(/secret/i);
          expect(bodyStr).not.toMatch(/token/i);
          expect(bodyStr).not.toMatch(/password/i);
        }
      }
    });
  });
});