import { LambdaClient, InvokeCommand } from '@aws-sdk/client-lambda';
import { fromCognitoIdentityPool } from '@aws-sdk/credential-provider-cognito-identity';
import { CognitoIdentityClient } from '@aws-sdk/client-cognito-identity';

// Document processing service using our enhanced AI Lambda function
export class DocumentProcessingService {
  private lambda: LambdaClient;
  private aiServiceFunctionName: string;

  constructor() {
    const credentials = fromCognitoIdentityPool({
      client: new CognitoIdentityClient({
        region: 'us-east-1',
      }),
      identityPoolId: 'us-east-1:8315e4fa-7dce-4183-b395-228a34c20375',
    });

    this.lambda = new LambdaClient({
      region: 'us-east-1',
      credentials,
    });

    // This will be dynamically determined from the stack outputs
    this.aiServiceFunctionName = 'amplify-joblanderv4-christopher-sandbox-c7b0b32068-aiservicelambda5FA705C3-hJJOAVKX5Y8T';
  }

  /**
   * Parse resume document with enhanced AI and document analysis
   * Supports PDF, DOCX, images, and scanned documents
   */
  async parseResume(file: File): Promise<{
    success: boolean;
    data?: {
      structuredData: any;
      extractedText: string;
      fileName: string;
      keyPhrases: string[];
      sentiment: {
        sentiment: string;
        confidence: any;
      };
      aiInsights: {
        model: string;
        extractionConfidence: string;
        processingTime: number;
      };
    };
    error?: string;
  }> {
    try {
      // Convert file to base64
      const base64Data = await this.fileToBase64(file);
      
      // Determine document type for optimal processing
      const documentType = this.determineDocumentType(file);

      const payload = {
        httpMethod: 'POST',
        path: '/parse-resume',
        body: JSON.stringify({
          documentContent: base64Data,
          documentType,
          fileName: file.name,
          fileType: file.type,
        }),
      };

      const result = await this.invokeLambda(payload);
      
      if (result.success) {
        return {
          success: true,
          data: result.data,
        };
      } else {
        return {
          success: false,
          error: result.error || 'Document parsing failed',
        };
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Document processing failed',
      };
    }
  }

  /**
   * Enhance resume content with AI suggestions
   */
  async enhanceResume(resumeData: any, targetJob?: string, tone: string = 'professional'): Promise<{
    success: boolean;
    data?: any;
    error?: string;
  }> {
    try {
      const payload = {
        httpMethod: 'POST',
        path: '/enhance-resume',
        body: JSON.stringify({
          resumeData,
          targetJob,
          tone,
        }),
      };

      const result = await this.invokeLambda(payload);
      
      return {
        success: result.success,
        data: result.data,
        error: result.error,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Resume enhancement failed',
      };
    }
  }

  /**
   * Generate personalized cover letter
   */
  async generateCoverLetter(
    resumeData: any,
    jobDescription: string,
    tone: string = 'professional',
    companyName?: string
  ): Promise<{
    success: boolean;
    data?: {
      coverLetter: string;
      keyPoints: string[];
      matchScore: number;
      suggestions: string[];
    };
    error?: string;
  }> {
    try {
      const payload = {
        httpMethod: 'POST',
        path: '/generate-cover-letter',
        body: JSON.stringify({
          resumeData,
          jobDescription,
          tone,
          companyName,
        }),
      };

      const result = await this.invokeLambda(payload);
      
      return {
        success: result.success,
        data: result.data,
        error: result.error,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Cover letter generation failed',
      };
    }
  }

  /**
   * Analyze job match with AI-powered insights
   */
  async analyzeJobMatch(resumeData: any, jobDescription: string): Promise<{
    success: boolean;
    data?: {
      overallScore: number;
      matchingElements: any;
      missingElements: any;
      recommendations: any;
      atsKeywords: string[];
      confidence: string;
      explanation: string;
    };
    error?: string;
  }> {
    try {
      const payload = {
        httpMethod: 'POST',
        path: '/analyze-job-match',
        body: JSON.stringify({
          resumeData,
          jobDescription,
        }),
      };

      const result = await this.invokeLambda(payload);
      
      return {
        success: result.success,
        data: result.data,
        error: result.error,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Job match analysis failed',
      };
    }
  }

  /**
   * Generate portfolio content from resume data
   */
  async generatePortfolioContent(resumeData: any, portfolioType: string = 'professional'): Promise<{
    success: boolean;
    data?: any;
    error?: string;
  }> {
    try {
      const payload = {
        httpMethod: 'POST',
        path: '/generate-portfolio',
        body: JSON.stringify({
          resumeData,
          portfolioType,
        }),
      };

      const result = await this.invokeLambda(payload);
      
      return {
        success: result.success,
        data: result.data,
        error: result.error,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Portfolio generation failed',
      };
    }
  }

  /**
   * Health check for the AI service
   */
  async healthCheck(): Promise<{
    success: boolean;
    status?: string;
    services?: any;
    models?: any;
    error?: string;
  }> {
    try {
      const payload = {
        httpMethod: 'GET',
        path: '/health',
        body: '{}',
      };

      const result = await this.invokeLambda(payload);
      
      return {
        success: result.success,
        status: result.status,
        services: result.services,
        models: result.models,
        error: result.error,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Health check failed',
      };
    }
  }

  // Helper methods
  private async fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
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
  }

  private determineDocumentType(file: File): string {
    const { type, size } = file;
    
    // Image files
    if (type.startsWith('image/')) {
      return 'image';
    }
    
    // Large PDF files are likely scanned
    if (type === 'application/pdf' && size > 1000000) {
      return 'scanned-pdf';
    }
    
    // Default to text for PDFs, DOCX, and other text formats
    return 'text';
  }

  private async invokeLambda(payload: any): Promise<any> {
    const command = new InvokeCommand({
      FunctionName: this.aiServiceFunctionName,
      Payload: JSON.stringify(payload),
    });

    const response = await this.lambda.send(command);
    
    if (response.Payload) {
      const result = JSON.parse(new TextDecoder().decode(response.Payload));
      
      if (result.statusCode === 200) {
        return JSON.parse(result.body);
      } else {
        const errorData = JSON.parse(result.body);
        throw new Error(errorData.error || 'Lambda function error');
      }
    }

    throw new Error('No response from Lambda function');
  }
}

// Document processing utilities
export const documentUtils = {
  /**
   * Validate document file type and size
   */
  validateDocument(file: File): { valid: boolean; error?: string } {
    const MAX_SIZE = 10 * 1024 * 1024; // 10MB
    const ALLOWED_TYPES = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'text/plain',
    ];

    if (!ALLOWED_TYPES.includes(file.type)) {
      return {
        valid: false,
        error: `File type ${file.type} is not supported. Please upload PDF, DOCX, or image files.`,
      };
    }

    if (file.size > MAX_SIZE) {
      return {
        valid: false,
        error: `File size ${(file.size / 1024 / 1024).toFixed(2)}MB exceeds the 10MB limit.`,
      };
    }

    return { valid: true };
  },

  /**
   * Get file type description
   */
  getFileTypeDescription(file: File): string {
    const typeMap: { [key: string]: string } = {
      'application/pdf': 'PDF Document',
      'application/msword': 'Microsoft Word Document',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'Microsoft Word Document (DOCX)',
      'image/jpeg': 'JPEG Image',
      'image/jpg': 'JPEG Image',
      'image/png': 'PNG Image',
      'image/gif': 'GIF Image',
      'text/plain': 'Text File',
    };

    return typeMap[file.type] || 'Unknown File Type';
  },

  /**
   * Format file size for display
   */
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  },
};

// Export singleton instance
export const documentProcessor = new DocumentProcessingService();