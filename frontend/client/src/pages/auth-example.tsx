import React from 'react';
import { Link, useLocation } from 'wouter';
import AmplifyAuthenticator from '@/components/auth/AmplifyAuthenticator';
import { Button } from '@/components/ui/button';

/**
 * Example page demonstrating AWS Amplify Authenticator with Job-Lander theme
 * This can replace your existing custom auth forms if you prefer
 * the pre-built Amplify UI components.
 */
export default function AuthExamplePage() {
  const [location, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <AmplifyAuthenticator
          onAuthSuccess={(user) => {
            console.log('User authenticated:', user);
            // Redirect to dashboard after successful auth
            setLocation('/dashboard');
          }}
        >
          {/* Content shown after authentication - this could be your dashboard */}
          <div className="text-center p-8 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Welcome to Job-Lander! 🎉
            </h2>
            <p className="text-gray-600 mb-6">
              You're successfully authenticated. Ready to build your perfect resume?
            </p>
            <div className="space-y-3">
              <Button asChild className="w-full" size="lg">
                <Link href="/dashboard">
                  Go to Dashboard
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full" size="lg">
                <Link href="/create">
                  Create New Resume
                </Link>
              </Button>
            </div>
          </div>
        </AmplifyAuthenticator>
      </div>
    </div>
  );
}