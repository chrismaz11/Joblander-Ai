import { defineStorage } from '@aws-amplify/backend';

export const storage = defineStorage({
  name: 'jobLanderStorage',
  access: (allow) => ({
    'resumes/*': [
      allow.authenticated.to(['read', 'write', 'delete']),
    ],
    'portfolios/*': [
      allow.authenticated.to(['read', 'write', 'delete']),
    ],
    'templates/*': [
      allow.authenticated.to(['read']),
    ],
    'temp-uploads/*': [
      allow.authenticated.to(['read', 'write', 'delete']),
    ],
  })
});
