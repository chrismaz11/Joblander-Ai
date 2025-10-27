/**
 * Resume Parsing Prompt Templates
 * Templates for extracting structured data from resume text
 */

export interface ResumeParsingPromptConfig {
  version: string;
  model: string;
  temperature: number;
  maxTokens: number;
  template: string;
  schema: any;
}

export const RESUME_PARSING_PROMPT: ResumeParsingPromptConfig = {
  version: '2.0',
  model: 'gemini-2.0-flash-exp',
  temperature: 0.3,
  maxTokens: 4096,
  template: `[SYSTEM]
You are an expert resume parser with advanced text correction capabilities. Your expertise includes:
- Identifying and extracting personal information accurately
- Parsing employment history with proper date formatting
- Recognizing education credentials and institutions
- Extracting technical and soft skills
- Correcting OCR errors and formatting issues
- Assessing data quality and confidence levels

[TASK]
Parse the following resume text into a structured format. The text may contain OCR errors, formatting issues, or be poorly structured.

Your responsibilities:
1. Extract all relevant information accurately
2. Correct any obvious OCR errors or typos
3. Standardize date formats to YYYY-MM
4. Identify if information is current/ongoing
5. Assess confidence level for each field based on clarity and completeness
6. Fill missing fields with empty strings or arrays as appropriate

[CONFIDENCE SCORING]
Rate each field's confidence based on:
- "high": Field is clearly present, well-formatted, and unambiguous
- "medium": Field is present but may have minor OCR errors or formatting issues  
- "low": Field is unclear, has significant errors, or is inferred/guessed

[INPUT]
{resumeText}

[OUTPUT REQUIREMENTS]
Return a JSON object with the exact structure specified in the schema.
Ensure all dates are in YYYY-MM format or empty string if unknown.
Include confidence scores for quality assessment.
Preserve the original text for reference.`,
  schema: {
    type: "object",
    properties: {
      personalInfo: {
        type: "object",
        properties: {
          fullName: { type: "string" },
          email: { type: "string" },
          phone: { type: "string" },
          location: { type: "string" },
          linkedin: { type: "string" },
          website: { type: "string" },
          summary: { type: "string" }
        },
        required: ["fullName", "email", "phone", "location", "linkedin", "website", "summary"]
      },
      experience: {
        type: "array",
        items: {
          type: "object",
          properties: {
            id: { type: "string" },
            company: { type: "string" },
            position: { type: "string" },
            startDate: { type: "string" },
            endDate: { type: "string" },
            current: { type: "boolean" },
            description: { type: "string" }
          },
          required: ["id", "company", "position", "startDate", "endDate", "current", "description"]
        }
      },
      education: {
        type: "array",
        items: {
          type: "object",
          properties: {
            id: { type: "string" },
            institution: { type: "string" },
            degree: { type: "string" },
            field: { type: "string" },
            startDate: { type: "string" },
            endDate: { type: "string" },
            current: { type: "boolean" }
          },
          required: ["id", "institution", "degree", "field", "startDate", "endDate", "current"]
        }
      },
      skills: {
        type: "array",
        items: { type: "string" }
      },
      confidence: {
        type: "object",
        properties: {
          overall: { 
            type: "string",
            enum: ["high", "medium", "low"]
          },
          fields: {
            type: "object",
            properties: {
              fullName: { type: "string", enum: ["high", "medium", "low"] },
              email: { type: "string", enum: ["high", "medium", "low"] },
              phone: { type: "string", enum: ["high", "medium", "low"] },
              location: { type: "string", enum: ["high", "medium", "low"] },
              linkedin: { type: "string", enum: ["high", "medium", "low"] },
              website: { type: "string", enum: ["high", "medium", "low"] },
              summary: { type: "string", enum: ["high", "medium", "low"] },
              experience: { type: "string", enum: ["high", "medium", "low"] },
              education: { type: "string", enum: ["high", "medium", "low"] },
              skills: { type: "string", enum: ["high", "medium", "low"] }
            }
          }
        },
        required: ["overall", "fields"]
      },
      rawText: { type: "string" }
    },
    required: ["personalInfo", "experience", "education", "skills", "confidence", "rawText"]
  }
};

export const RESUME_PARSING_OCR_ENHANCED: ResumeParsingPromptConfig = {
  ...RESUME_PARSING_PROMPT,
  version: '2.1',
  template: `[SYSTEM]
You are an expert resume parser specializing in OCR text correction and data extraction.
The text you receive has been extracted via OCR and likely contains errors.

[OCR ERROR PATTERNS]
Common OCR mistakes to correct:
- 0 (zero) vs O (letter O)
- 1 (one) vs l (lowercase L) vs I (uppercase i)
- rn vs m
- cl vs d
- 5 vs S
- 8 vs B
- Merged or split words
- Missing or extra spaces
- Scrambled special characters

[TASK]
1. Intelligently correct OCR errors based on context
2. Reconstruct proper formatting and structure
3. Extract all resume information accurately
4. Assess confidence considering OCR quality
5. Preserve corrected text for reference

[INPUT]
{resumeText}

[OUTPUT]
Return structured JSON with all fields populated, including confidence scores that reflect OCR quality.
Set lower confidence for fields with significant OCR corrections.`,
  schema: RESUME_PARSING_PROMPT.schema
};

/**
 * Helper function to build prompt with dynamic values
 */
export function buildResumeParsingPrompt(
  resumeText: string,
  useOCREnhanced: boolean = false
): string {
  const config = useOCREnhanced ? RESUME_PARSING_OCR_ENHANCED : RESUME_PARSING_PROMPT;
  return config.template.replace('{resumeText}', resumeText);
}

/**
 * Get configuration for resume parsing
 */
export function getResumeParsingConfig(useOCREnhanced: boolean = false): ResumeParsingPromptConfig {
  return useOCREnhanced ? RESUME_PARSING_OCR_ENHANCED : RESUME_PARSING_PROMPT;
}