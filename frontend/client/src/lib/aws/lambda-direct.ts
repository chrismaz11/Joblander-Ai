import { LambdaClient, InvokeCommand } from '@aws-sdk/client-lambda';
import { fromCognitoIdentityPool } from '@aws-sdk/credential-provider-cognito-identity';
import { CognitoIdentityClient } from '@aws-sdk/client-cognito-identity';

// Initialize Lambda client with Cognito credentials
const getCredentialsProvider = () => {
  return fromCognitoIdentityPool({
    client: new CognitoIdentityClient({
      region: 'us-east-1',
    }),
    identityPoolId: 'us-east-1:8315e4fa-7dce-4183-b395-228a34c20375',
  });
};

const lambda = new LambdaClient({
  region: 'us-east-1',
  credentials: getCredentialsProvider(),
});

// Direct Lambda function utilities
export const lambdaDirectService = {
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

      // Create the Lambda event payload
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

      // Invoke Lambda function directly
      const command = new InvokeCommand({
        FunctionName: 'amplify-joblanderv4-christopher-sandbox-c7b0b32068-resumeparserlambdaA76AD411-g7wc5WsQ8B3I', // Will be dynamically determined
        Payload: JSON.stringify(payload),
      });

      const response = await lambda.send(command);
      
      if (response.Payload) {
        const result = JSON.parse(new TextDecoder().decode(response.Payload));
        
        if (result.statusCode === 200) {
          const data = JSON.parse(result.body);
          return {
            success: true,
            data: data.data,
            extractedText: data.extractedText,
          };
        } else {
          const errorData = JSON.parse(result.body);
          return {
            success: false,
            error: errorData.error || 'Resume parsing failed',
          };
        }
      }

      return {
        success: false,
        error: 'No response from Lambda function',
      };
    } catch (error: any) {
      console.error('Resume parsing error:', error);
      return {
        success: false,
        error: error.message || 'Resume parsing failed',
      };
    }
  },

  // Health check for Lambda function
  healthCheck: async () => {
    try {
      const payload = {
        httpMethod: 'GET',
        path: '/health',
        body: '{}',
      };

      const command = new InvokeCommand({
        FunctionName: 'amplify-joblanderv4-christopher-sandbox-c7b0b32068-resumeparserlambdaA76AD411-g7wc5WsQ8B3I',
        Payload: JSON.stringify(payload),
      });

      const response = await lambda.send(command);
      
      if (response.Payload) {
        const result = JSON.parse(new TextDecoder().decode(response.Payload));
        
        if (result.statusCode === 200) {
          const data = JSON.parse(result.body);
          return {
            success: data.success,
            status: data.status,
            timestamp: data.timestamp,
            services: data.services,
          };
        }
      }

      return {
        success: false,
        error: 'Health check failed',
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Health check failed',
      };
    }
  },

  // Get Lambda function name from stack outputs
  getFunctionName: () => {
    // This would ideally come from the amplify_outputs.json or environment
    return 'amplify-joblanderv4-christopher-sandbox-c7b0b32068-resumeparserlambdaA76AD411-g7wc5WsQ8B3I';
  },
};