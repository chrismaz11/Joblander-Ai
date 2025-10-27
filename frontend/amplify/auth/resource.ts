import { defineAuth, secret } from '@aws-amplify/backend';

/**
 * Define and configure your auth resource
 * Enhanced Cognito configuration with social login providers
 * @see https://docs.amplify.aws/react/build-a-backend/auth
 */
export const auth = defineAuth({
  loginWith: {
    email: true,
  },
  userAttributes: {
    email: {
      required: true,
      mutable: true,
    },
    givenName: {
      required: false,
      mutable: true,
    },
    familyName: {
      required: false,
      mutable: true,
    },
    profilePicture: {
      required: false,
      mutable: true,
    },
    phoneNumber: {
      required: false,
      mutable: true,
    },
    // Custom attributes for Job-Lander
    'custom:subscription_tier': {
      dataType: 'String',
      mutable: true,
    },
    'custom:job_title': {
      dataType: 'String', 
      mutable: true,
    },
    'custom:company': {
      dataType: 'String',
      mutable: true,
    },
    'custom:linkedin_url': {
      dataType: 'String',
      mutable: true,
    },
    'custom:github_url': {
      dataType: 'String',
      mutable: true,
    },
  },
  accountRecovery: 'EMAIL_ONLY',
  multiFactor: {
    mode: 'OPTIONAL',
    totp: true,
    sms: false,
  },
  // Advanced password policy
  passwordPolicy: {
    minLength: 8,
    requireNumbers: true,
    requireLowercase: true,
    requireUppercase: true,
    requireSymbols: true,
    temporaryPasswordValidityDays: 7,
  },
  // User verification
  userVerification: {
    emailSubject: 'Welcome to Job-Lander! Verify your email',
    emailBody: 'Welcome to Job-Lander! Click the link to verify your account: {##Verify Email##}',
    emailStyle: 'CONFIRM_WITH_LINK',
  },
  // User invitation (for admin-created accounts)
  userInvitation: {
    emailSubject: 'You have been invited to Job-Lander',
    emailBody: 'You have been invited to join Job-Lander. Click here to set your password: {##Set Password##}',
    smsMessage: 'Your Job-Lander temporary password is {####}',
  },
});
