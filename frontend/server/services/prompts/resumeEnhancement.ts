/**
 * Resume Enhancement Prompt Templates
 * Templates for improving and polishing resume content
 */

export interface ResumeEnhancementPromptConfig {
  version: string;
  model: string;
  temperature: number;
  maxTokens: number;
  template: string;
  schema?: any;
}

export const RESUME_ENHANCEMENT: ResumeEnhancementPromptConfig = {
  version: '1.0',
  model: 'gemini-2.0-flash-exp',
  temperature: 0.7,
  maxTokens: 4096,
  template: `[SYSTEM]
You are a professional resume writer and career coach with expertise in:
- Creating impactful, achievement-oriented descriptions
- Using powerful action verbs and quantifiable results
- Optimizing for ATS (Applicant Tracking Systems)
- Tailoring content to industry standards
- Highlighting transferable skills and core competencies

[TASK]
Enhance the following resume content to be more professional, impactful, and achievement-oriented.

[CURRENT RESUME]
Personal Info:
{personalInfo}

Experience:
{experience}

Education:
{education}

Skills:
{skills}

[ENHANCEMENT GUIDELINES]
1. Transform responsibilities into achievements
2. Add quantifiable metrics where possible (%, $, #)
3. Use strong action verbs (led, implemented, optimized, drove, etc.)
4. Ensure consistent formatting and tense
5. Optimize keywords for ATS scanning
6. Highlight leadership, innovation, and impact
7. Remove redundancies and weak phrases
8. Ensure clarity and conciseness

[ACTION VERB CATEGORIES]
Leadership: Led, Directed, Managed, Coordinated, Supervised
Achievement: Achieved, Exceeded, Surpassed, Delivered, Accomplished
Innovation: Created, Developed, Designed, Pioneered, Implemented
Improvement: Enhanced, Optimized, Streamlined, Upgraded, Refined
Analysis: Analyzed, Evaluated, Assessed, Researched, Investigated

[OUTPUT]
Return enhanced resume data in the same JSON structure with:
- More impactful descriptions
- Quantified achievements where applicable
- Stronger action verbs
- Improved professional summary
- Optimized skills list
- Consistent formatting`,
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
        }
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
            description: { type: "string" },
            achievements: {
              type: "array",
              items: { type: "string" }
            }
          }
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
            current: { type: "boolean" },
            achievements: {
              type: "array",
              items: { type: "string" }
            }
          }
        }
      },
      skills: {
        type: "array",
        items: { type: "string" }
      },
      improvements: {
        type: "object",
        properties: {
          summary: { type: "string" },
          keyChanges: {
            type: "array",
            items: { type: "string" }
          },
          metricsAdded: { type: "number" },
          keywordsOptimized: {
            type: "array",
            items: { type: "string" }
          }
        }
      }
    }
  }
};

export const ACHIEVEMENT_GENERATOR: ResumeEnhancementPromptConfig = {
  version: '1.0',
  model: 'gemini-2.0-flash-exp',
  temperature: 0.8,
  maxTokens: 2048,
  template: `[SYSTEM]
You are an expert at transforming job responsibilities into quantifiable achievements.
You specialize in the STAR method (Situation, Task, Action, Result) and CAR method (Challenge, Action, Result).

[TASK]
Convert these job responsibilities into achievement-focused bullet points.

[CURRENT ROLE]
Position: {position}
Company: {company}
Industry: {industry}
Duration: {duration}

[CURRENT RESPONSIBILITIES]
{responsibilities}

[TRANSFORMATION GUIDELINES]
1. Start each bullet with a strong action verb
2. Include specific metrics when possible (even estimates)
3. Show impact and results, not just activities
4. Use the formula: Action Verb + Task + Result/Impact
5. Aim for 3-5 bullets per role
6. Each bullet should be 1-2 lines maximum
7. Focus on what sets this person apart

[METRICS TO CONSIDER]
- Percentage improvements (efficiency, accuracy, speed)
- Dollar amounts (revenue, savings, budget managed)
- Scale indicators (team size, project scope, users impacted)
- Time metrics (deadlines met, time saved, faster delivery)
- Rankings (top performer, awards, recognitions)

[OUTPUT]
Generate 3-5 achievement-oriented bullet points that:
- Demonstrate measurable impact
- Highlight unique contributions
- Sound impressive but realistic
- Pass ATS scanning
- Appeal to hiring managers`,
  schema: {
    type: "object",
    properties: {
      achievements: {
        type: "array",
        items: { type: "string" },
        minItems: 3,
        maxItems: 5
      },
      metrics: {
        type: "array",
        items: {
          type: "object",
          properties: {
            type: { 
              type: "string",
              enum: ["percentage", "financial", "scale", "time", "ranking"]
            },
            value: { type: "string" },
            context: { type: "string" }
          }
        }
      },
      keywords: {
        type: "array",
        items: { type: "string" }
      }
    },
    required: ["achievements", "metrics", "keywords"]
  }
};

export const ATS_OPTIMIZER: ResumeEnhancementPromptConfig = {
  version: '1.0',
  model: 'gemini-2.0-flash-exp',
  temperature: 0.4,
  maxTokens: 1024,
  template: `[SYSTEM]
You are an ATS (Applicant Tracking System) optimization specialist.
You understand how resume parsing algorithms work and how to optimize content for maximum visibility.

[TASK]
Optimize this resume content for ATS scanning while maintaining readability.

[TARGET ROLE]
{targetRole}

[CURRENT CONTENT]
{resumeContent}

[OPTIMIZATION STRATEGIES]
1. Include relevant keywords naturally throughout
2. Use standard section headings (Experience, Education, Skills)
3. Avoid graphics, tables, or complex formatting
4. Use standard job titles and industry terms
5. Include both acronyms and full terms
6. Ensure consistent date formatting
7. Use simple bullet points with clear structure

[KEYWORD CATEGORIES]
- Technical Skills: Programming languages, tools, frameworks
- Soft Skills: Leadership, communication, problem-solving
- Industry Terms: Domain-specific vocabulary
- Action Verbs: Managed, developed, implemented, analyzed
- Certifications: Relevant professional certifications
- Methodologies: Agile, Scrum, Lean, Six Sigma

[OUTPUT]
Return optimized content with:
- Identified keywords for the target role
- Suggestions for keyword placement
- Formatting recommendations
- ATS compatibility score (0-100)`,
  schema: {
    type: "object",
    properties: {
      keywords: {
        type: "object",
        properties: {
          technical: {
            type: "array",
            items: { type: "string" }
          },
          soft: {
            type: "array",
            items: { type: "string" }
          },
          industry: {
            type: "array",
            items: { type: "string" }
          }
        }
      },
      recommendations: {
        type: "array",
        items: {
          type: "object",
          properties: {
            section: { type: "string" },
            suggestion: { type: "string" },
            priority: {
              type: "string",
              enum: ["high", "medium", "low"]
            }
          }
        }
      },
      atsScore: {
        type: "number",
        minimum: 0,
        maximum: 100
      },
      optimizedSections: {
        type: "object",
        properties: {
          summary: { type: "string" },
          skills: {
            type: "array",
            items: { type: "string" }
          }
        }
      }
    },
    required: ["keywords", "recommendations", "atsScore"]
  }
};

/**
 * Build resume enhancement prompt
 */
export function buildEnhancementPrompt(resumeData: any): string {
  const personalInfo = JSON.stringify(resumeData.personalInfo || {}, null, 2);
  const experience = JSON.stringify(resumeData.experience || [], null, 2);
  const education = JSON.stringify(resumeData.education || [], null, 2);
  const skills = JSON.stringify(resumeData.skills || [], null, 2);
  
  return RESUME_ENHANCEMENT.template
    .replace('{personalInfo}', personalInfo)
    .replace('{experience}', experience)
    .replace('{education}', education)
    .replace('{skills}', skills);
}

/**
 * Build achievement generator prompt
 */
export function buildAchievementPrompt(
  position: string,
  company: string,
  responsibilities: string,
  industry?: string,
  duration?: string
): string {
  return ACHIEVEMENT_GENERATOR.template
    .replace('{position}', position)
    .replace('{company}', company)
    .replace('{industry}', industry || 'Not specified')
    .replace('{duration}', duration || 'Not specified')
    .replace('{responsibilities}', responsibilities);
}

/**
 * Build ATS optimizer prompt
 */
export function buildATSOptimizerPrompt(
  resumeContent: string,
  targetRole: string
): string {
  return ATS_OPTIMIZER.template
    .replace('{targetRole}', targetRole)
    .replace('{resumeContent}', resumeContent);
}