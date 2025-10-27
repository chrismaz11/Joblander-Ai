import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

/*== STEP 1 ===============================================================
The section below creates a Resume database table with a "content" field that
contains the resume data as JSON. This mimics DocumentDB structure while using
DynamoDB for the Amplify backend.
=========================================================================*/

const schema = a.schema({
  Resume: a
    .model({
      id: a.id().required(),
      userId: a.string().required(),
      content: a.json().required(), // Store complete resume as JSON
      templateId: a.string(),
      pdfUrl: a.string(),
      blockchainHash: a.string(),
      verifiedAt: a.datetime(),
      createdAt: a.datetime(),
      updatedAt: a.datetime(),
    })
    .authorization((allow) => [
      allow.owner().to(['create', 'read', 'update', 'delete']),
      allow.publicApiKey().to(['create', 'read', 'update', 'delete']),
    ]),
  
  JobApplication: a
    .model({
      id: a.id().required(),
      userId: a.string().required(),
      resumeId: a.id().required(),
      jobTitle: a.string().required(),
      company: a.string().required(),
      jobDescription: a.string(),
      applicationStatus: a.enum(['APPLIED', 'INTERVIEW', 'REJECTED', 'OFFER']),
      appliedAt: a.datetime(),
      notes: a.string(),
      matchScore: a.float(),
      coverLetter: a.json(), // Store cover letter variants
    })
    .authorization((allow) => [
      allow.owner().to(['create', 'read', 'update', 'delete']),
      allow.publicApiKey().to(['create', 'read', 'update', 'delete']),
    ]),

  Portfolio: a
    .model({
      id: a.id().required(),
      userId: a.string().required(),
      resumeId: a.id().required(),
      title: a.string().required(),
      htmlContent: a.string().required(),
      deploymentUrl: a.string(),
      isPublic: a.boolean(),
      createdAt: a.datetime(),
      updatedAt: a.datetime(),
    })
    .authorization((allow) => [
      allow.owner().to(['create', 'read', 'update', 'delete']),
      allow.publicApiKey().to(['create', 'read', 'update', 'delete']),
    ]),

  UserSettings: a
    .model({
      id: a.id().required(),
      userId: a.string().required(),
      preferences: a.json().required(), // Store user preferences as JSON
      subscriptionTier: a.enum(['FREE', 'PRO', 'ENTERPRISE']),
      usage: a.json(), // Track AI usage, blockchain verifications, etc.
    })
    .authorization((allow) => [
      allow.owner().to(['create', 'read', 'update', 'delete']),
      allow.publicApiKey().to(['create', 'read', 'update', 'delete']),
    ]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'userPool',
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
});
