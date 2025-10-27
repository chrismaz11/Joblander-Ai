import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";
import { TextractClient, DetectDocumentTextCommand } from "@aws-sdk/client-textract";
import type { APIGatewayProxyHandler } from 'aws-lambda';

const bedrock = new BedrockRuntimeClient({ region: process.env.BEDROCK_REGION || 'us-east-1' });
const textract = new TextractClient({ region: process.env.BEDROCK_REGION || 'us-east-1' });

const corsHeaders = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

const parseResumeHandler = async (event: any) => {
  try {
    const { documentContent, documentType = 'text', fileName, fileType } = JSON.parse(event.body || '{}');

    let extractedText = '';

    // Use Textract for scanned PDFs or images
    if (documentType === 'image' || documentType === 'scanned-pdf') {
      const textractResponse = await textract.send(new DetectDocumentTextCommand({
        Document: {
          Bytes: Buffer.from(documentContent, 'base64'),
        },
      }));

      extractedText = textractResponse.Blocks
        ?.filter(block => block.BlockType === 'LINE')
        .map(block => block.Text)
        .join('\n') || '';
    } else {
      extractedText = documentContent;
    }

    // Use Bedrock to structure the resume data
    const prompt = `
Extract and structure the following resume content into JSON format:

${extractedText}

Return a JSON object with the following structure:
{
  "personalInfo": {
    "name": "",
    "email": "",
    "phone": "",
    "location": "",
    "linkedin": "",
    "github": "",
    "website": ""
  },
  "summary": "",
  "experience": [
    {
      "company": "",
      "position": "",
      "duration": "",
      "location": "",
      "responsibilities": []
    }
  ],
  "education": [
    {
      "institution": "",
      "degree": "",
      "field": "",
      "graduationDate": "",
      "gpa": ""
    }
  ],
  "skills": [],
  "certifications": [],
  "projects": [
    {
      "name": "",
      "description": "",
      "technologies": [],
      "link": ""
    }
  ]
}`;

    const response = await bedrock.send(new InvokeModelCommand({
      modelId: "anthropic.claude-3-sonnet-20240229-v1:0",
      body: JSON.stringify({
        anthropic_version: "bedrock-2023-05-31",
        max_tokens: 4000,
        messages: [
          {
            role: "user",
            content: prompt
          }
        ]
      }),
      contentType: "application/json",
    }));

    const responseBody = JSON.parse(new TextDecoder().decode(response.body));
    const structuredData = JSON.parse(responseBody.content[0].text);

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({
        success: true,
        data: structuredData,
        extractedText,
        fileName,
        fileType,
      }),
    };
  } catch (error) {
    console.error('Resume parsing error:', error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({
        success: false,
        error: 'Failed to parse resume',
        message: error instanceof Error ? error.message : 'Unknown error',
      }),
    };
  }
};

const healthHandler = async () => {
  return {
    statusCode: 200,
    headers: corsHeaders,
    body: JSON.stringify({
      success: true,
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {
        bedrock: 'available',
        textract: 'available',
      },
    }),
  };
};

export const handler: APIGatewayProxyHandler = async (event) => {
  // Handle CORS preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: '',
    };
  }

  const path = event.path;
  const method = event.httpMethod;

  try {
    switch (path) {
      case '/parse-resume':
        if (method === 'POST') {
          return await parseResumeHandler(event);
        }
        break;
      case '/health':
        return await healthHandler();
      default:
        return {
          statusCode: 404,
          headers: corsHeaders,
          body: JSON.stringify({
            success: false,
            error: 'Endpoint not found',
          }),
        };
    }
  } catch (error) {
    console.error('Lambda handler error:', error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({
        success: false,
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      }),
    };
  }

  return {
    statusCode: 405,
    headers: corsHeaders,
    body: JSON.stringify({
      success: false,
      error: 'Method not allowed',
    }),
  };
};
