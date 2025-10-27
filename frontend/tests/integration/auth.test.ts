import { describe, it, expect, beforeEach } from 'vitest';
import { http, HttpResponse } from 'msw';
import { server } from '../mocks/server';

// Mock the auth service
import { mockUser } from '../mocks/handlers';

describe('Authentication Integration', () => {
  beforeEach(() => {
    // Clear any local storage
    localStorage.clear();
    sessionStorage.clear();
  });

  describe('User Registration', () => {
    it('registers a new user successfully', async () => {
      const userData = {
        email: 'newuser@example.com',
        password: 'password123',
        name: 'New User'
      };

      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });

      expect(response.ok).toBe(true);
      
      const result = await response.json();
      expect(result).toHaveProperty('user');
      expect(result).toHaveProperty('token');
      expect(result.user.email).toBe(userData.email);
    });

    it('fails registration with missing required fields', async () => {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: 'test@example.com' }) // Missing password
      });

      expect(response.ok).toBe(false);
      expect(response.status).toBe(400);
      
      const result = await response.json();
      expect(result.error).toBe('Missing required fields');
    });

    it('handles duplicate email registration', async () => {
      server.use(
        http.post('/api/auth/register', () => {
          return HttpResponse.json({ 
            error: 'Email already exists' 
          }, { status: 409 });
        })
      );

      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: 'existing@example.com',
          password: 'password123'
        })
      });

      expect(response.status).toBe(409);
      
      const result = await response.json();
      expect(result.error).toBe('Email already exists');
    });
  });

  describe('User Login', () => {
    it('logs in user with valid credentials', async () => {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'password'
        })
      });

      expect(response.ok).toBe(true);
      
      const result = await response.json();
      expect(result).toHaveProperty('user');
      expect(result).toHaveProperty('token');
      expect(result.user.email).toBe('test@example.com');
    });

    it('fails login with invalid credentials', async () => {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'wrongpassword'
        })
      });

      expect(response.status).toBe(401);
      
      const result = await response.json();
      expect(result.error).toBe('Invalid credentials');
    });

    it('fails login with non-existent email', async () => {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: 'nonexistent@example.com',
          password: 'password'
        })
      });

      expect(response.status).toBe(401);
      
      const result = await response.json();
      expect(result.error).toBe('Invalid credentials');
    });
  });

  describe('User Authentication', () => {
    it('gets current user with valid token', async () => {
      const response = await fetch('/api/auth/me', {
        headers: {
          'Authorization': 'Bearer mock-jwt-token'
        }
      });

      expect(response.ok).toBe(true);
      
      const result = await response.json();
      expect(result).toHaveProperty('user');
      expect(result.user.id).toBe(mockUser.id);
    });

    it('fails to get user without token', async () => {
      const response = await fetch('/api/auth/me');

      expect(response.status).toBe(401);
      
      const result = await response.json();
      expect(result.error).toBe('Unauthorized');
    });

    it('fails to get user with invalid token', async () => {
      const response = await fetch('/api/auth/me', {
        headers: {
          'Authorization': 'Bearer invalid-token'
        }
      });

      expect(response.status).toBe(401);
      
      const result = await response.json();
      expect(result.error).toBe('Unauthorized');
    });
  });

  describe('User Logout', () => {
    it('logs out user successfully', async () => {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer mock-jwt-token'
        }
      });

      expect(response.ok).toBe(true);
      
      const result = await response.json();
      expect(result.success).toBe(true);
    });
  });

  describe('Password Reset Flow', () => {
    it('initiates password reset', async () => {
      server.use(
        http.post('/api/auth/forgot-password', async ({ request }) => {
          const body = await request.json() as any;
          
          if (body.email) {
            return HttpResponse.json({ 
              message: 'Password reset email sent' 
            });
          }
          
          return HttpResponse.json({ 
            error: 'Email is required' 
          }, { status: 400 });
        })
      );

      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: 'test@example.com'
        })
      });

      expect(response.ok).toBe(true);
      
      const result = await response.json();
      expect(result.message).toBe('Password reset email sent');
    });

    it('resets password with valid token', async () => {
      server.use(
        http.post('/api/auth/reset-password', async ({ request }) => {
          const body = await request.json() as any;
          
          if (body.token === 'valid-reset-token' && body.password) {
            return HttpResponse.json({ 
              message: 'Password reset successful' 
            });
          }
          
          return HttpResponse.json({ 
            error: 'Invalid or expired token' 
          }, { status: 400 });
        })
      );

      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          token: 'valid-reset-token',
          password: 'newpassword123'
        })
      });

      expect(response.ok).toBe(true);
      
      const result = await response.json();
      expect(result.message).toBe('Password reset successful');
    });
  });

  describe('Email Verification', () => {
    it('verifies email with valid token', async () => {
      server.use(
        http.get('/api/auth/verify-email/:token', ({ params }) => {
          if (params.token === 'valid-verification-token') {
            return HttpResponse.json({ 
              message: 'Email verified successfully',
              user: { ...mockUser, verified: true }
            });
          }
          
          return HttpResponse.json({ 
            error: 'Invalid verification token' 
          }, { status: 400 });
        })
      );

      const response = await fetch('/api/auth/verify-email/valid-verification-token');

      expect(response.ok).toBe(true);
      
      const result = await response.json();
      expect(result.message).toBe('Email verified successfully');
      expect(result.user.verified).toBe(true);
    });

    it('resends verification email', async () => {
      server.use(
        http.post('/api/auth/resend-verification', async ({ request }) => {
          const body = await request.json() as any;
          
          if (body.email) {
            return HttpResponse.json({ 
              message: 'Verification email sent' 
            });
          }
          
          return HttpResponse.json({ 
            error: 'Email is required' 
          }, { status: 400 });
        })
      );

      const response = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: 'test@example.com'
        })
      });

      expect(response.ok).toBe(true);
      
      const result = await response.json();
      expect(result.message).toBe('Verification email sent');
    });
  });

  describe('Social Authentication', () => {
    it('initiates Google OAuth flow', async () => {
      server.use(
        http.get('/api/auth/google', () => {
          return HttpResponse.json({ 
            authUrl: 'https://accounts.google.com/oauth/authorize?...',
            state: 'random-state-token'
          });
        })
      );

      const response = await fetch('/api/auth/google');

      expect(response.ok).toBe(true);
      
      const result = await response.json();
      expect(result).toHaveProperty('authUrl');
      expect(result).toHaveProperty('state');
      expect(result.authUrl).toContain('accounts.google.com');
    });

    it('handles Google OAuth callback', async () => {
      server.use(
        http.get('/api/auth/google/callback', ({ request }) => {
          const url = new URL(request.url);
          const code = url.searchParams.get('code');
          const state = url.searchParams.get('state');
          
          if (code && state) {
            return HttpResponse.json({
              user: { ...mockUser, provider: 'google' },
              token: 'mock-jwt-token'
            });
          }
          
          return HttpResponse.json({ 
            error: 'Invalid OAuth parameters' 
          }, { status: 400 });
        })
      );

      const response = await fetch('/api/auth/google/callback?code=oauth-code&state=state-token');

      expect(response.ok).toBe(true);
      
      const result = await response.json();
      expect(result).toHaveProperty('user');
      expect(result).toHaveProperty('token');
      expect(result.user.provider).toBe('google');
    });
  });

  describe('Session Management', () => {
    it('maintains session across requests', async () => {
      // Simulate login
      const loginResponse = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'password'
        })
      });

      const loginResult = await loginResponse.json();
      const token = loginResult.token;

      // Use token for subsequent requests
      const userResponse = await fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      expect(userResponse.ok).toBe(true);
      
      const userResult = await userResponse.json();
      expect(userResult.user.email).toBe('test@example.com');
    });

    it('handles token expiration', async () => {
      server.use(
        http.get('/api/auth/me', ({ request }) => {
          const authHeader = request.headers.get('Authorization');
          
          if (authHeader?.includes('expired-token')) {
            return HttpResponse.json({ 
              error: 'Token expired' 
            }, { status: 401 });
          }
          
          return HttpResponse.json({ 
            error: 'Unauthorized' 
          }, { status: 401 });
        })
      );

      const response = await fetch('/api/auth/me', {
        headers: {
          'Authorization': 'Bearer expired-token'
        }
      });

      expect(response.status).toBe(401);
      
      const result = await response.json();
      expect(result.error).toBe('Token expired');
    });
  });
});