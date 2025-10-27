import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";
import { TextractClient, DetectDocumentTextCommand, AnalyzeDocumentCommand } from "@aws-sdk/client-textract";
import { ComprehendClient, DetectKeyPhrasesCommand, DetectSentimentCommand } from "@aws-sdk/client-comprehend";
import type { APIGatewayProxyHandler } from 'aws-lambda';

const bedrock = new BedrockRuntimeClient({ region: process.env.BEDROCK_REGION || 'us-east-1' });
const textract = new TextractClient({ region: process.env.BEDROCK_REGION || 'us-east-1' });
const comprehend = new ComprehendClient({ region: process.env.BEDROCK_REGION || 'us-east-1' });

const corsHeaders = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// Available Bedrock Models
const MODELS = {
  CLAUDE_3_SONNET: "anthropic.claude-3-sonnet-20240229-v1:0",
  CLAUDE_3_HAIKU: "anthropic.claude-3-haiku-20240307-v1:0", 
  LLAMA_2: "meta.llama2-70b-chat-v1",
  TITAN_EXPRESS: "amazon.titan-text-express-v1"
};

interface BedrockResponse {
  content?: Array<{ text: string; type: string }>;
  completion?: string;
}

// Enhanced AI Service Functions
class AIService {
  
  // Parse resume with multiple AI models for better accuracy
  static async parseResume(documentContent: string, documentType: string, fileName: string) {
    let extractedText = '';

    // Use Textract for scanned documents
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

    // Use Claude 3 Sonnet for structured data extraction
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
      "responsibilities": [],
      "achievements": []
    }
  ],
  "education": [
    {
      "institution": "",
      "degree": "",
      "field": "",
      "graduationDate": "",
      "gpa": "",
      "honors": []
    }
  ],
  "skills": {
    "technical": [],
    "soft": [],
    "languages": [],
    "certifications": []
  },
  "projects": [
    {
      "name": "",
      "description": "",
      "technologies": [],
      "link": "",
      "duration": ""
    }
  ]
}

Ensure all data is accurately extracted and properly categorized.`;

    const response = await bedrock.send(new InvokeModelCommand({
      modelId: MODELS.CLAUDE_3_SONNET,
      body: JSON.stringify({
        anthropic_version: "bedrock-2023-05-31",
        max_tokens: 4000,
        messages: [{ role: "user", content: prompt }]
      }),
      contentType: "application/json",
    }));

    const responseBody = JSON.parse(new TextDecoder().decode(response.body));
    const structuredData = JSON.parse(responseBody.content[0].text);

    // Use Comprehend to analyze key phrases and sentiment
    const keyPhrasesResponse = await comprehend.send(new DetectKeyPhrasesCommand({
      Text: extractedText.substring(0, 5000), // Comprehend has text limits
      LanguageCode: 'en'
    }));

    const sentimentResponse = await comprehend.send(new DetectSentimentCommand({
      Text: extractedText.substring(0, 5000),
      LanguageCode: 'en'
    }));

    return {
      structuredData,
      extractedText,
      fileName,
      keyPhrases: keyPhrasesResponse.KeyPhrases?.map(kp => kp.Text) || [],
      sentiment: {
        sentiment: sentimentResponse.Sentiment,
        confidence: sentimentResponse.SentimentScore
      },
      aiInsights: {
        model: MODELS.CLAUDE_3_SONNET,
        extractionConfidence: 'high',
        processingTime: Date.now()
      }
    };
  }

  // Enhanced resume with AI suggestions
  static async enhanceResume(resumeData: any, targetJob?: string, tone: string = 'professional') {
    const prompt = `
As an expert resume writer and career coach, enhance the following resume data to make it more compelling and ATS-friendly:

Original Resume:
${JSON.stringify(resumeData, null, 2)}

Target Job: ${targetJob || 'General professional roles'}
Desired Tone: ${tone}

Please provide enhanced content that:
1. Improves bullet points with action verbs and quantifiable achievements
2. Optimizes keywords for ATS systems
3. Strengthens the professional summary
4. Suggests better skill categorization
5. Recommends improvements to project descriptions

Return a JSON object with the enhanced resume data in the same structure as the input, plus a separate "suggestions" object with specific recommendations.`;

    const response = await bedrock.send(new InvokeModelCommand({
      modelId: MODELS.CLAUDE_3_SONNET,
      body: JSON.stringify({
        anthropic_version: "bedrock-2023-05-31",
        max_tokens: 4000,
        messages: [{ role: "user", content: prompt }]
      }),
      contentType: "application/json",
    }));

    const responseBody = JSON.parse(new TextDecoder().decode(response.body));
    return JSON.parse(responseBody.content[0].text);
  }

  // Generate cover letter with multiple tone options
  static async generateCoverLetter(resumeData: any, jobDescription: string, tone: string = 'professional', companyName?: string) {
    const toneInstructions = {
      professional: "formal, concise, and business-appropriate",
      friendly: "warm, personable, but still professional", 
      confident: "assertive, achievement-focused, and direct",
      creative: "innovative, expressive, suitable for creative roles"
    };

    const prompt = `
Write a compelling cover letter based on the following information:

Resume Data:
${JSON.stringify(resumeData, null, 2)}

Job Description:
${jobDescription}

Company: ${companyName || '[Company Name]'}
Tone: ${tone} - ${toneInstructions[tone as keyof typeof toneInstructions] || toneInstructions.professional}

Requirements:
1. Create a personalized, engaging cover letter
2. Highlight relevant experience and achievements from the resume
3. Match key requirements from the job description
4. Use specific examples and quantifiable results
5. Show enthusiasm for the role and company
6. Keep it concise (3-4 paragraphs, ~300 words)
7. Include proper formatting placeholders

Return a JSON object with:
{
  "coverLetter": "formatted cover letter text",
  "keyPoints": ["highlighted strengths matching the job"],
  "matchScore": 0.85,
  "suggestions": ["optional improvements"]
}`;

    const response = await bedrock.send(new InvokeModelCommand({
      modelId: MODELS.CLAUDE_3_SONNET,
      body: JSON.stringify({
        anthropic_version: "bedrock-2023-05-31",
        max_tokens: 3000,
        messages: [{ role: "user", content: prompt }]
      }),
      contentType: "application/json",
    }));

    const responseBody = JSON.parse(new TextDecoder().decode(response.body));
    return JSON.parse(responseBody.content[0].text);
  }

  // AI-powered job match analysis
  static async analyzeJobMatch(resumeData: any, jobDescription: string) {
    const prompt = `
Analyze how well this resume matches the job description and provide detailed insights:

Resume:
${JSON.stringify(resumeData, null, 2)}

Job Description:
${jobDescription}

Provide a comprehensive analysis with:
1. Overall match score (0-100)
2. Matching skills and experience
3. Missing requirements
4. Suggestions for improvement
5. Keywords to add for ATS optimization
6. Confidence level in the analysis

Return JSON format:
{
  "overallScore": 85,
  "matchingElements": {
    "skills": ["matched skills"],
    "experience": ["relevant experience points"],
    "education": ["relevant education"]
  },
  "missingElements": {
    "requiredSkills": ["missing skills"],
    "preferredSkills": ["nice-to-have skills"],
    "experience": ["experience gaps"]
  },
  "recommendations": {
    "immediate": ["quick fixes"],
    "longTerm": ["skill development suggestions"]
  },
  "atsKeywords": ["keywords to include"],
  "confidence": "high/medium/low",
  "explanation": "detailed explanation of the match"
}`;

    const response = await bedrock.send(new InvokeModelCommand({
      modelId: MODELS.CLAUDE_3_SONNET,
      body: JSON.stringify({
        anthropic_version: "bedrock-2023-05-31",
        max_tokens: 3000,
        messages: [{ role: "user", content: prompt }]
      }),
      contentType: "application/json",
    }));

    const responseBody = JSON.parse(new TextDecoder().decode(response.body));
    return JSON.parse(responseBody.content[0].text);
  }

  // Generate portfolio content
  static async generatePortfolioContent(resumeData: any, portfolioType: string = 'professional') {
    const prompt = `
Create compelling portfolio content based on this resume:

${JSON.stringify(resumeData, null, 2)}

Portfolio Type: ${portfolioType}

Generate:
1. Professional bio/about section
2. Skills showcase content
3. Project descriptions with impact statements
4. Achievement highlights
5. Call-to-action sections

Return JSON with HTML-ready content sections.`;

    const response = await bedrock.send(new InvokeModelCommand({
      modelId: MODELS.CLAUDE_3_SONNET,
      body: JSON.stringify({
        anthropic_version: "bedrock-2023-05-31",
        max_tokens: 3000,
        messages: [{ role: "user", content: prompt }]
      }),
      contentType: "application/json",
    }));

    const responseBody = JSON.parse(new TextDecoder().decode(response.body));
    return JSON.parse(responseBody.content[0].text);
  }
}

// Route Handlers
const parseResumeHandler = async (event: any) => {
  const { documentContent, documentType = 'text', fileName, fileType } = JSON.parse(event.body || '{}');
  const result = await AIService.parseResume(documentContent, documentType, fileName);
  return { statusCode: 200, headers: corsHeaders, body: JSON.stringify({ success: true, data: result }) };
};

const enhanceResumeHandler = async (event: any) => {
  const { resumeData, targetJob, tone } = JSON.parse(event.body || '{}');
  const result = await AIService.enhanceResume(resumeData, targetJob, tone);
  return { statusCode: 200, headers: corsHeaders, body: JSON.stringify({ success: true, data: result }) };
};

const generateCoverLetterHandler = async (event: any) => {
  const { resumeData, jobDescription, tone, companyName } = JSON.parse(event.body || '{}');
  const result = await AIService.generateCoverLetter(resumeData, jobDescription, tone, companyName);
  return { statusCode: 200, headers: corsHeaders, body: JSON.stringify({ success: true, data: result }) };
};

const analyzeJobMatchHandler = async (event: any) => {
  const { resumeData, jobDescription } = JSON.parse(event.body || '{}');
  const result = await AIService.analyzeJobMatch(resumeData, jobDescription);
  return { statusCode: 200, headers: corsHeaders, body: JSON.stringify({ success: true, data: result }) };
};

const generatePortfolioHandler = async (event: any) => {
  const { resumeData, portfolioType } = JSON.parse(event.body || '{}');
  const result = await AIService.generatePortfolioContent(resumeData, portfolioType);
  return { statusCode: 200, headers: corsHeaders, body: JSON.stringify({ success: true, data: result }) };
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
        comprehend: 'available'
      },
      models: MODELS
    }),
  };
};

// Main Lambda Handler
export const handler: APIGatewayProxyHandler = async (event) => {
  // Handle CORS preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: corsHeaders, body: '' };
  }

  const path = event.path;
  const method = event.httpMethod;

  try {
    switch (path) {
      case '/parse-resume':
        if (method === 'POST') return await parseResumeHandler(event);
        break;
      case '/enhance-resume':
        if (method === 'POST') return await enhanceResumeHandler(event);
        break;
      case '/generate-cover-letter':
        if (method === 'POST') return await generateCoverLetterHandler(event);
        break;
      case '/analyze-job-match':
        if (method === 'POST') return await analyzeJobMatchHandler(event);
        break;
      case '/generate-portfolio':
        if (method === 'POST') return await generatePortfolioHandler(event);
        break;
      case '/health':
        return await healthHandler();
      default:
        return {
          statusCode: 404,
          headers: corsHeaders,
          body: JSON.stringify({ success: false, error: 'Endpoint not found' }),
        };
    }
  } catch (error) {
    console.error('AI Service error:', error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({
        success: false,
        error: 'AI service error',
        message: error instanceof Error ? error.message : 'Unknown error',
      }),
    };
  }

  return {
    statusCode: 405,
    headers: corsHeaders,
    body: JSON.stringify({ success: false, error: 'Method not allowed' }),
  };
};