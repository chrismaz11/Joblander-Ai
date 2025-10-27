import { generateClient } from 'aws-amplify/api';
import type { Schema } from '../../../amplify/data/resource';

// Generate the GraphQL client with type safety
export const client = generateClient<Schema>();

// GraphQL operations
export const createResume = async (resumeData: {
  userId: string;
  content: any;
  templateId?: string;
}) => {
  const { data } = await client.models.Resume.create(resumeData);
  return data;
};

export const getResume = async (id: string) => {
  const { data } = await client.models.Resume.get({ id });
  return data;
};

export const listResumes = async (userId: string) => {
  const { data } = await client.models.Resume.list({
    filter: {
      userId: {
        eq: userId
      }
    }
  });
  return data;
};

export const updateResume = async (id: string, updates: Partial<{
  content: any;
  templateId: string;
  pdfUrl: string;
  blockchainHash: string;
  verifiedAt: string;
}>) => {
  const { data } = await client.models.Resume.update({ id, ...updates });
  return data;
};