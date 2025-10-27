/**
 * Cover Letter Generation Prompt Templates
 * Templates for generating professional cover letters in different tones
 */

export interface CoverLetterPromptConfig {
  version: string;
  model: string;
  temperature: number;
  maxTokens: number;
  template: string;
}

export interface CoverLetterData {
  personalInfo: {
    fullName: string;
    email?: string;
    phone?: string;
    location?: string;
  };
  companyName: string;
  position: string;
  jobDescription?: string;
  experience?: Array<{
    company: string;
    position: string;
    description: string;
  }>;
  skills?: string[];
  tone?: 'professional' | 'concise' | 'bold';
  customInstructions?: string;
}

const TONE_INSTRUCTIONS = {
  professional: `[PROFESSIONAL TONE]
- Use formal, traditional business language
- Maintain respectful and courteous tone throughout
- Include standard business letter structure with proper salutations
- Focus on qualifications, achievements, and value proposition
- Use phrases like "I am writing to express my interest" and "I would welcome the opportunity"
- Length: 250-350 words
- Avoid contractions and maintain formal register`,

  concise: `[CONCISE TONE]
- Be direct, clear, and to-the-point
- Use bullet points for key achievements where appropriate
- Maximum 3 short, impactful paragraphs
- Focus only on most relevant qualifications
- Eliminate unnecessary words and redundant phrases
- Length: 150-250 words
- Every sentence should add unique value`,

  bold: `[BOLD TONE]
- Be creative, confident, and enthusiastic
- Show personality and genuine passion
- Use dynamic action verbs and power words
- Include a memorable opening hook that grabs attention
- Express authentic excitement for the role and company
- Use phrases like "I'm excited to" and "I'm confident that"
- Length: 200-300 words
- Demonstrate unique value proposition boldly`
};

export const COVER_LETTER_SINGLE_TONE: CoverLetterPromptConfig = {
  version: '1.0',
  model: 'gemini-2.0-flash-exp',
  temperature: 0.8,
  maxTokens: 1024,
  template: `[SYSTEM]
You are a professional cover letter writer with expertise in crafting compelling, personalized letters that get candidates noticed.
Your letters are known for being engaging, well-structured, and tailored to specific roles and companies.

[APPLICANT PROFILE]
Name: {fullName}
Position Applied: {position}
Target Company: {companyName}

{jobDescriptionSection}

[EXPERIENCE]
{experienceSection}

[SKILLS]
{skillsSection}

{toneInstructions}

{customInstructions}

[WRITING GUIDELINES]
1. Start with a compelling opening that shows genuine interest
2. Connect applicant's experience directly to job requirements
3. Highlight 2-3 major achievements relevant to the position
4. Demonstrate knowledge of the company and its values
5. Show how the applicant can solve company problems or add value
6. Close with a strong call to action and enthusiasm
7. Maintain the specified tone consistently throughout

[OUTPUT]
Write a complete cover letter following the guidelines above.
Format as a proper business letter with appropriate spacing.
Do not include placeholders - write actual content.
Return only the cover letter text, no JSON or metadata.`
};

export const COVER_LETTER_ALL_TONES: CoverLetterPromptConfig = {
  version: '1.0',
  model: 'gemini-2.0-flash-exp',
  temperature: 0.8,
  maxTokens: 2048,
  template: `[SYSTEM]
You are a professional cover letter writer who specializes in adapting writing style to different tones and contexts.
Create THREE different versions of a cover letter with distinct tones for the same position.

[APPLICANT PROFILE]
Name: {fullName}
Position Applied: {position}
Target Company: {companyName}

{jobDescriptionSection}

[EXPERIENCE]
{experienceSection}

[SKILLS]
{skillsSection}

{customInstructions}

[TASK]
Create THREE complete cover letter versions with different tones:

1. PROFESSIONAL VERSION (250-350 words):
${TONE_INSTRUCTIONS.professional}

2. CONCISE VERSION (150-250 words):
${TONE_INSTRUCTIONS.concise}

3. BOLD VERSION (200-300 words):
${TONE_INSTRUCTIONS.bold}

[OUTPUT REQUIREMENTS]
Return a JSON object with all three versions:
{
  "professional": "complete professional cover letter text with proper formatting",
  "concise": "complete concise cover letter text with proper formatting",
  "bold": "complete bold cover letter text with proper formatting"
}

Each letter should:
- Be complete and ready to send
- Follow proper business letter format
- Maintain consistent tone throughout
- Highlight same core qualifications differently
- End with appropriate closing for the tone`
};

/**
 * Build cover letter prompt with dynamic values
 */
export function buildCoverLetterPrompt(
  data: CoverLetterData,
  generateAllTones: boolean = false
): string {
  const config = generateAllTones ? COVER_LETTER_ALL_TONES : COVER_LETTER_SINGLE_TONE;
  
  // Build job description section
  const jobDescriptionSection = data.jobDescription 
    ? `[JOB DESCRIPTION]\n${data.jobDescription}`
    : '[JOB DESCRIPTION]\nNo specific job description provided. Focus on general fit for the position.';
  
  // Build experience section
  const experienceSection = data.experience && data.experience.length > 0
    ? data.experience.map(exp => 
        `- ${exp.position} at ${exp.company}: ${exp.description}`
      ).join('\n')
    : 'No specific experience provided. Focus on transferable skills and potential.';
  
  // Build skills section
  const skillsSection = data.skills && data.skills.length > 0
    ? data.skills.join(', ')
    : 'No specific skills provided. Focus on general competencies.';
  
  // Get tone instructions (only for single tone generation)
  const toneInstructions = !generateAllTones && data.tone
    ? `[TONE SPECIFICATION]\n${TONE_INSTRUCTIONS[data.tone]}`
    : '';
  
  // Add custom instructions if provided
  const customInstructions = data.customInstructions
    ? `[ADDITIONAL INSTRUCTIONS]\n${data.customInstructions}`
    : '';
  
  // Replace all placeholders
  let prompt = config.template
    .replace('{fullName}', data.personalInfo.fullName)
    .replace('{position}', data.position)
    .replace('{companyName}', data.companyName)
    .replace('{jobDescriptionSection}', jobDescriptionSection)
    .replace('{experienceSection}', experienceSection)
    .replace('{skillsSection}', skillsSection)
    .replace('{toneInstructions}', toneInstructions)
    .replace('{customInstructions}', customInstructions);
  
  return prompt;
}

/**
 * Get schema for all tones generation
 */
export function getCoverLetterSchema(generateAllTones: boolean = false): any {
  if (generateAllTones) {
    return {
      type: "object",
      properties: {
        professional: { type: "string" },
        concise: { type: "string" },
        bold: { type: "string" }
      },
      required: ["professional", "concise", "bold"]
    };
  }
  
  // Single tone returns plain text, no schema needed
  return null;
}

/**
 * Get configuration for cover letter generation
 */
export function getCoverLetterConfig(generateAllTones: boolean = false): CoverLetterPromptConfig {
  return generateAllTones ? COVER_LETTER_ALL_TONES : COVER_LETTER_SINGLE_TONE;
}