import React from 'react';
import { Authenticator, ThemeProvider } from '@aws-amplify/ui-react';
import { jobLanderAmplifyTheme } from '@/config/amplify-theme';
import '@aws-amplify/ui-react/styles.css';

interface AmplifyAuthenticatorProps {
  onAuthSuccess?: (user: any) => void;
  children?: React.ReactNode;
}

/**
 * AWS Amplify Authenticator component with Job-Lander custom theme
 * This provides a complete authentication flow with sign-in, sign-up, 
 * forgot password, and MFA support.
 */
export const AmplifyAuthenticator: React.FC<AmplifyAuthenticatorProps> = ({ 
  onAuthSuccess,
  children 
}) => {
  return (
    <ThemeProvider theme={jobLanderAmplifyTheme}>
      <Authenticator
        // Custom sign-up fields
        signUpAttributes={[
          'email',
          'given_name',
          'family_name',
        ]}
        
        // Custom form fields
        formFields={{
          signUp: {
            given_name: {
              label: 'First Name *',
              placeholder: 'Enter your first name',
              order: 1,
            },
            family_name: {
              label: 'Last Name *',
              placeholder: 'Enter your last name',
              order: 2,
            },
            email: {
              label: 'Email *',
              placeholder: 'Enter your email address',
              order: 3,
            },
            password: {
              label: 'Password *',
              placeholder: 'Create a strong password',
              order: 4,
            },
            confirm_password: {
              label: 'Confirm Password *',
              order: 5,
            },
          },
        }}

        // Social providers (if configured in Amplify)
        socialProviders={['google', 'amazon']}
        
        // Custom components and styling
        components={{
          Header() {
            return (
              <div className="text-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  Welcome to Job-Lander
                </h1>
                <p className="text-gray-600">
                  Build your perfect resume with AI assistance
                </p>
              </div>
            );
          },
          
          Footer() {
            return (
              <div className="text-center mt-4 text-sm text-gray-500">
                <p>
                  By signing up, you agree to our{' '}
                  <a href="/terms" className="text-blue-600 hover:underline">
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a href="/privacy" className="text-blue-600 hover:underline">
                    Privacy Policy
                  </a>
                </p>
              </div>
            );
          },
        }}

        // Event handlers
        onAuthSuccess={(user) => {
          console.log('Authentication successful:', user);
          onAuthSuccess?.(user);
        }}
      >
        {/* Content that appears after successful authentication */}
        {children}
      </Authenticator>
    </ThemeProvider>
  );
};

export default AmplifyAuthenticator;