import { 
  getCurrentUser, 
  signIn, 
  signOut, 
  signUp, 
  confirmSignUp,
  resetPassword,
  confirmResetPassword,
  updateUserAttributes,
  fetchUserAttributes,
  signInWithRedirect,
  type SignInInput, 
  type SignUpInput 
} from 'aws-amplify/auth';
import * as React from 'react';

// Enhanced authentication utilities
export const authService = {
  // Get current authenticated user with extended attributes
  getCurrentUser: async () => {
    try {
      const user = await getCurrentUser();
      const attributes = await fetchUserAttributes();
      
      return {
        userId: user.userId,
        username: user.username,
        email: attributes.email || user.signInDetails?.loginId,
        givenName: attributes.given_name,
        familyName: attributes.family_name,
        profilePicture: attributes.picture,
        emailVerified: attributes.email_verified === 'true',
        isAuthenticated: true,
        signInProvider: user.signInDetails?.loginId?.includes('@') ? 'email' : 'social',
        attributes,
      };
    } catch (error) {
      return {
        userId: null,
        username: null,
        email: null,
        givenName: null,
        familyName: null,
        profilePicture: null,
        emailVerified: false,
        isAuthenticated: false,
        signInProvider: null,
        attributes: {},
      };
    }
  },

  // Sign in user with email/password
  signIn: async (email: string, password: string) => {
    try {
      const { isSignedIn, nextStep } = await signIn({
        username: email,
        password,
      });

      if (isSignedIn) {
        const user = await authService.getCurrentUser();
        return {
          success: true,
          user,
        };
      }

      return {
        success: false,
        error: 'Sign-in not completed',
        nextStep,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Sign-in failed',
      };
    }
  },

  // Sign in with Google
  signInWithGoogle: async () => {
    try {
      await signInWithRedirect({
        provider: 'Google',
      });
      
      // This will redirect, so we return success immediately
      return {
        success: true,
        redirecting: true,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Google sign-in failed',
      };
    }
  },

  // Sign in with Amazon
  signInWithAmazon: async () => {
    try {
      await signInWithRedirect({
        provider: 'LoginWithAmazon',
      });
      
      return {
        success: true,
        redirecting: true,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Amazon sign-in failed',
      };
    }
  },

  // Sign up new user
  signUp: async (email: string, password: string, attributes?: { [key: string]: string }) => {
    try {
      const { isSignUpComplete, userId, nextStep } = await signUp({
        username: email,
        password,
        attributes: {
          email,
          ...attributes,
        },
      });

      return {
        success: true,
        isSignUpComplete,
        userId,
        nextStep,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Sign-up failed',
      };
    }
  },

  // Confirm sign up with verification code
  confirmSignUp: async (email: string, confirmationCode: string) => {
    try {
      const { isSignUpComplete, nextStep } = await confirmSignUp({
        username: email,
        confirmationCode,
      });

      return {
        success: true,
        isSignUpComplete,
        nextStep,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Confirmation failed',
      };
    }
  },

  // Reset password
  resetPassword: async (email: string) => {
    try {
      const output = await resetPassword({ username: email });
      
      return {
        success: true,
        nextStep: output.nextStep,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Password reset failed',
      };
    }
  },

  // Confirm password reset
  confirmResetPassword: async (email: string, confirmationCode: string, newPassword: string) => {
    try {
      await confirmResetPassword({
        username: email,
        confirmationCode,
        newPassword,
      });

      return {
        success: true,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Password confirmation failed',
      };
    }
  },

  // Update user attributes
  updateUserAttributes: async (attributes: { [key: string]: string }) => {
    try {
      await updateUserAttributes({
        userAttributes: attributes,
      });

      return {
        success: true,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Profile update failed',
      };
    }
  },

  // Sign out user
  signOut: async () => {
    try {
      await signOut();
      return {
        success: true,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Sign-out failed',
      };
    }
  },
};

// React hook for authentication state
export const useAuth = () => {
  const [authState, setAuthState] = React.useState({
    isAuthenticated: false,
    isLoading: true,
    user: null as any,
  });

  React.useEffect(() => {
    const checkAuthState = async () => {
      try {
        const user = await authService.getCurrentUser();
        setAuthState({
          isAuthenticated: user.isAuthenticated,
          isLoading: false,
          user: user.isAuthenticated ? user : null,
        });
      } catch (error) {
        setAuthState({
          isAuthenticated: false,
          isLoading: false,
          user: null,
        });
      }
    };

    checkAuthState();

    // Listen for auth state changes
    const handleAuthEvent = () => {
      checkAuthState();
    };

    // Check for URL parameters that indicate OAuth redirect
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('code') || urlParams.get('error')) {
        checkAuthState();
      }
    }

    return () => {
      // Cleanup if needed
    };
  }, []);

  return {
    ...authState,
    signIn: authService.signIn,
    signInWithGoogle: authService.signInWithGoogle,
    signInWithAmazon: authService.signInWithAmazon,
    signUp: authService.signUp,
    signOut: authService.signOut,
    confirmSignUp: authService.confirmSignUp,
    resetPassword: authService.resetPassword,
    confirmResetPassword: authService.confirmResetPassword,
    updateUserAttributes: authService.updateUserAttributes,
    refresh: () => {
      setAuthState(prev => ({ ...prev, isLoading: true }));
      return authService.getCurrentUser().then(user => {
        setAuthState({
          isAuthenticated: user.isAuthenticated,
          isLoading: false,
          user: user.isAuthenticated ? user : null,
        });
        return user;
      });
    },
  };
};