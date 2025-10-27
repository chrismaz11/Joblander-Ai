# 📄 Enhanced Document Processing with AWS AI

Job Lander v4.0 features comprehensive document processing powered by AWS AI services including **Amazon Bedrock**, **Amazon Textract**, and **Amazon Comprehend**.

## 🎯 Capabilities Overview

### 1. **Multi-Format Document Parsing**
- ✅ **PDF Documents** (text-based and scanned)
- ✅ **Microsoft Word** (DOC, DOCX)
- ✅ **Image Files** (JPEG, PNG, GIF)
- ✅ **Text Files** (TXT)
- ✅ **Hybrid Processing** (OCR + AI for scanned documents)

### 2. **AI-Powered Content Extraction**
- 🧠 **Claude 3 Sonnet** for intelligent text structuring
- 🔍 **Amazon Textract** for OCR and document analysis
- 📊 **Amazon Comprehend** for sentiment and key phrase extraction
- 🎯 **Smart Document Type Detection** for optimal processing

### 3. **Advanced Resume Processing**
- **Structured Data Extraction**: Personal info, experience, education, skills
- **Sentiment Analysis**: Tone and confidence scoring of resume content
- **Key Phrase Detection**: Important skills and achievements identification
- **AI Insights**: Processing metadata and confidence scoring

## 🚀 Core Features

### Resume Parsing & Enhancement

```typescript
import { documentProcessor } from '@/lib/aws/document-processing';

// Parse any resume format
const result = await documentProcessor.parseResume(file);

// Enhance with AI suggestions
const enhanced = await documentProcessor.enhanceResume(
  result.data.structuredData,
  'Software Engineer', // target job
  'professional' // tone
);
```

**Supported Data Structure:**
```json
{
  "personalInfo": {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1-555-123-4567",
    "location": "San Francisco, CA",
    "linkedin": "linkedin.com/in/johndoe",
    "github": "github.com/johndoe",
    "website": "johndoe.com"
  },
  "summary": "Professional summary...",
  "experience": [
    {
      "company": "Tech Corp",
      "position": "Senior Developer",
      "duration": "2020-2023",
      "location": "San Francisco, CA",
      "responsibilities": ["Built scalable apps", "Led team of 5"],
      "achievements": ["Increased performance by 40%"]
    }
  ],
  "education": [...],
  "skills": {
    "technical": ["Python", "React", "AWS"],
    "soft": ["Leadership", "Communication"],
    "languages": ["English", "Spanish"],
    "certifications": ["AWS Solutions Architect"]
  },
  "projects": [...]
}
```

### Cover Letter Generation

```typescript
// Generate personalized cover letters
const coverLetter = await documentProcessor.generateCoverLetter(
  resumeData,
  jobDescription,
  'confident', // tone: professional, friendly, confident, creative
  'Google' // company name
);

// Returns:
{
  "coverLetter": "formatted cover letter text",
  "keyPoints": ["highlighted strengths matching the job"],
  "matchScore": 0.92,
  "suggestions": ["optional improvements"]
}
```

### Job Match Analysis

```typescript
// AI-powered job matching
const analysis = await documentProcessor.analyzeJobMatch(
  resumeData,
  jobDescription
);

// Returns comprehensive match analysis:
{
  "overallScore": 85,
  "matchingElements": {
    "skills": ["React", "Python", "AWS"],
    "experience": ["5 years backend development"],
    "education": ["Computer Science degree"]
  },
  "missingElements": {
    "requiredSkills": ["Docker", "Kubernetes"],
    "preferredSkills": ["GraphQL"],
    "experience": ["Microservices architecture"]
  },
  "recommendations": {
    "immediate": ["Add Docker experience to skills"],
    "longTerm": ["Consider Kubernetes certification"]
  },
  "atsKeywords": ["cloud computing", "scalable systems"],
  "confidence": "high",
  "explanation": "Strong match with some skill gaps to address..."
}
```

### Portfolio Generation

```typescript
// Generate portfolio content from resume
const portfolio = await documentProcessor.generatePortfolioContent(
  resumeData,
  'professional' // or 'creative', 'technical', 'executive'
);
```

## 🔧 Document Processing Pipeline

### 1. **Document Type Detection**
```typescript
// Automatic detection based on file properties
const documentType = determineDocumentType(file);
// Returns: 'text', 'image', or 'scanned-pdf'
```

### 2. **OCR Processing** (when needed)
- **Amazon Textract** processes scanned PDFs and images
- Extracts text with high accuracy
- Handles complex layouts and formatting

### 3. **AI Structuring**
- **Claude 3 Sonnet** parses extracted text
- Creates structured JSON from unstructured content
- Validates and categorizes information

### 4. **Enhancement Analysis**
- **Amazon Comprehend** analyzes sentiment and key phrases
- **Claude 3** generates improvement suggestions
- Provides confidence scores and processing metadata

## 📊 AI Models & Services

### Amazon Bedrock Models
- **Claude 3 Sonnet** (`anthropic.claude-3-sonnet-20240229-v1:0`)
  - Primary model for text processing and generation
  - Best for complex reasoning and structured output
- **Claude 3 Haiku** (`anthropic.claude-3-haiku-20240307-v1:0`)
  - Faster model for simple tasks
- **Llama 2** (`meta.llama2-70b-chat-v1`)
  - Alternative model for text generation
- **Amazon Titan Express** (`amazon.titan-text-express-v1`)
  - AWS native model for specific use cases

### Amazon Textract
- **Document Text Detection**: Extracts text from any document format
- **Form Analysis**: Identifies form fields and values
- **Table Extraction**: Processes tabular data accurately

### Amazon Comprehend
- **Sentiment Analysis**: Determines emotional tone
- **Key Phrase Extraction**: Identifies important terms
- **Language Detection**: Supports multiple languages
- **Entity Recognition**: Finds people, organizations, locations

## ⚡ Performance & Optimization

### Processing Speed
- **Text Documents**: ~2-5 seconds
- **Image/Scanned PDFs**: ~10-15 seconds (includes OCR)
- **Large Files (>5MB)**: ~20-30 seconds

### Caching Strategy
- **Resume Parsing**: 24-hour cache
- **Job Matching**: 1-hour cache
- **Cover Letters**: 30-minute cache

### Error Handling
- **Automatic Retries**: Up to 3 attempts
- **Fallback Processing**: Alternative models on failure
- **Graceful Degradation**: Partial results when possible

## 🔒 Security & Privacy

### Data Protection
- **Temporary Processing**: Documents processed and discarded
- **Encrypted Transit**: All data encrypted in motion
- **No Long-term Storage**: Raw documents not permanently stored
- **AWS IAM**: Fine-grained access controls

### Compliance
- **GDPR Compliant**: Right to deletion and data portability
- **SOC 2 Type II**: AWS services are certified
- **HIPAA Eligible**: For sensitive document processing

## 📝 Usage Examples

### Basic Resume Processing
```typescript
import { documentProcessor, documentUtils } from '@/lib/aws/document-processing';

// Validate file
const validation = documentUtils.validateDocument(file);
if (!validation.valid) {
  throw new Error(validation.error);
}

// Process document
const result = await documentProcessor.parseResume(file);
if (!result.success) {
  throw new Error(result.error);
}

// Access structured data
const resume = result.data.structuredData;
const insights = result.data.aiInsights;
```

### Advanced Job Application Workflow
```typescript
// 1. Parse resume
const resumeResult = await documentProcessor.parseResume(resumeFile);
const resumeData = resumeResult.data.structuredData;

// 2. Analyze job match
const matchResult = await documentProcessor.analyzeJobMatch(
  resumeData, 
  jobDescription
);

// 3. Generate targeted cover letter
const coverLetterResult = await documentProcessor.generateCoverLetter(
  resumeData,
  jobDescription,
  'professional',
  companyName
);

// 4. Enhance resume for specific job
const enhancedResult = await documentProcessor.enhanceResume(
  resumeData,
  jobTitle,
  'confident'
);
```

## 🚨 Error Handling

### Common Error Types
- **`DocumentValidationError`**: Invalid file type or size
- **`ProcessingTimeoutError`**: Processing took too long
- **`AIServiceError`**: AI model unavailable
- **`OCRError`**: Text extraction failed

### Error Recovery
```typescript
try {
  const result = await documentProcessor.parseResume(file);
} catch (error) {
  if (error.code === 'PROCESSING_TIMEOUT') {
    // Retry with different model
    const fallback = await documentProcessor.parseResume(file, {
      model: 'claude-3-haiku'
    });
  }
}
```

## 📈 Monitoring & Analytics

### Health Checks
```typescript
// Check service status
const health = await documentProcessor.healthCheck();
console.log(health.services); // bedrock, textract, comprehend status
```

### Usage Metrics
- Processing time per document
- Success/failure rates
- Model performance comparison
- Cost per operation

## 🔄 Future Enhancements

### Planned Features
- **Multi-language Support**: Resume processing in 20+ languages
- **Bulk Processing**: Batch document processing
- **Custom Models**: Fine-tuned models for specific industries
- **Real-time Processing**: WebSocket-based live processing
- **Advanced Analytics**: Detailed processing insights

---

💡 **Pro Tip**: For best results, ensure documents are high-quality scans (300+ DPI) and text is clearly readable.