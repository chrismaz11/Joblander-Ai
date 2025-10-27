import { type ClientSchema, a } from '@aws-amplify/backend';

// Re-export the schema from the main data resource
// This ensures migration scripts use the same types
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
      allow.publicApiKey().to(['create', 'read', 'update', 'delete']),
    ]),
});

export type Schema = ClientSchema<typeof schema>;