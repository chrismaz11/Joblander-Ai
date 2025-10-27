import { beforeEach, afterEach, expect } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mock MSW for API mocking
import { server } from './mocks/server';

// Global test setup
beforeEach(() => {
  // Start MSW server for API mocking
  if (typeof window !== 'undefined') {
    server.listen({ onUnhandledRequest: 'error' });
  }
});

afterEach(() => {
  // Clean up React Testing Library
  cleanup();
  
  // Reset MSW handlers
  server.resetHandlers();
});

// Global teardown
afterAll(() => {
  // Close MSW server
  server.close();
});

// Mock fetch globally for Node.js environment
if (typeof globalThis.fetch === 'undefined') {
  const { fetch, Headers, Request, Response } = await import('undici');
  globalThis.fetch = fetch;
  globalThis.Headers = Headers;
  globalThis.Request = Request;
  globalThis.Response = Response;
}

// Mock ResizeObserver for React components that use it
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Mock matchMedia for responsive tests
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vitest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vitest.fn(), // deprecated
    removeListener: vitest.fn(), // deprecated
    addEventListener: vitest.fn(),
    removeEventListener: vitest.fn(),
    dispatchEvent: vitest.fn(),
  })),
});

// Mock Clipboard API
// Object.defineProperty(navigator, 'clipboard', {
//   writable: true,
//   value: {
//     writeText: vitest.fn(() => Promise.resolve()),
//     readText: vitest.fn(() => Promise.resolve('')),
//   },
// });

// Mock window.location
delete (window as any).location;
window.location = { 
  href: 'http://localhost:5173',
  origin: 'http://localhost:5173',
  pathname: '/',
  search: '',
  hash: ''
} as any;

// Extend expect with custom matchers
expect.extend({
  toBeValidEmail(received: string) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const pass = emailRegex.test(received);
    
    if (pass) {
      return {
        message: () => `expected ${received} not to be a valid email`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected ${received} to be a valid email`,
        pass: false,
      };
    }
  },
  
  toBeValidPhoneNumber(received: string) {
    // Basic phone number validation
    const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
    const pass = phoneRegex.test(received);
    
    if (pass) {
      return {
        message: () => `expected ${received} not to be a valid phone number`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected ${received} to be a valid phone number`,
        pass: false,
      };
    }
  },
  
  toHaveValidResumeStructure(received: any) {
    const requiredFields = ['personalInfo', 'experience', 'education', 'skills'];
    const hasAllFields = requiredFields.every(field => field in received);
    
    if (hasAllFields) {
      return {
        message: () => `expected object not to have valid resume structure`,
        pass: true,
      };
    } else {
      const missingFields = requiredFields.filter(field => !(field in received));
      return {
        message: () => `expected object to have valid resume structure, missing: ${missingFields.join(', ')}`,
        pass: false,
      };
    }
  }
});

// Declare custom matchers for TypeScript
declare module 'vitest' {
  interface Assertion<T = any> {
    toBeValidEmail(): T;
    toBeValidPhoneNumber(): T;
    toHaveValidResumeStructure(): T;
  }
}

console.log('✅ Test setup completed');