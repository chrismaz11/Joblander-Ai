import { post } from 'aws-amplify/api';

// Lambda function utilities
export const lambdaService = {
  // Parse resume using Lambda function
  parseResume: async (file: File) => {
    try {
      // Convert file to base64
      const base64Data = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result as string;
          // Remove data:mime/type;base64, prefix
          const base64 = result.split(',')[1];
          resolve(base64);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      // Determine document type
      const documentType = file.type.includes('image') ? 'image' : 
                          file.type.includes('pdf') && file.size > 1000000 ? 'scanned-pdf' : 'text';

      // Call the Lambda function
      const operation = post({
        apiName: 'resumeParserApi',
        path: '/parse-resume',
        options: {
          body: {
            documentContent: base64Data,
            documentType,
            fileName: file.name,
            fileType: file.type,
          },
        },
      });

      const response = await operation.response;
      const data = await response.body.json();

      if (data.success) {
        return {
          success: true,
          data: data.data,
          extractedText: data.extractedText,
        };
      } else {
        return {
          success: false,
          error: data.error || 'Resume parsing failed',
        };
      }
    } catch (error: any) {
      console.error('Resume parsing error:', error);
      return {
        success: false,
        error: error.message || 'Resume parsing failed',
      };
    }
  },

  // Generate enhanced resume content using AI
  enhanceResume: async (resumeData: any, targetJob?: string) => {
    try {
      const operation = post({
        apiName: 'resumeParserApi',
        path: '/enhance-resume',
        options: {
          body: {
            resumeData,
            targetJob,
          },
        },
      });

      const response = await operation.response;
      const data = await response.body.json();

      if (data.success) {
        return {
          success: true,
          data: data.data,
        };
      } else {
        return {
          success: false,
          error: data.error || 'Resume enhancement failed',
        };
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Resume enhancement failed',
      };
    }
  },

  // Generate cover letter using AI
  generateCoverLetter: async (resumeData: any, jobDescription: string, tone: 'professional' | 'friendly' | 'confident' = 'professional') => {
    try {
      const operation = post({
        apiName: 'resumeParserApi',
        path: '/generate-cover-letter',
        options: {
          body: {
            resumeData,
            jobDescription,
            tone,
          },
        },
      });

      const response = await operation.response;
      const data = await response.body.json();

      if (data.success) {
        return {
          success: true,
          data: data.data,
        };
      } else {
        return {
          success: false,
          error: data.error || 'Cover letter generation failed',
        };
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Cover letter generation failed',
      };
    }
  },

  // Health check for Lambda functions
  healthCheck: async () => {
    try {
      const operation = post({
        apiName: 'resumeParserApi',
        path: '/health',
        options: {
          body: {},
        },
      });

      const response = await operation.response;
      const data = await response.body.json();

      return {
        success: data.success,
        status: data.status,
        timestamp: data.timestamp,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Health check failed',
      };
    }
  },
};
