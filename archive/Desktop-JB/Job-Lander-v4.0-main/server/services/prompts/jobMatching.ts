/**
 * Job Matching Prompt Templates
 * Templates for matching resumes with job descriptions and ranking jobs
 */

export interface JobMatchingPromptConfig {
  version: string;
  model: string;
  temperature: number;
  maxTokens: number;
  template: string;
  schema?: any;
}

export const JOB_MATCH_SCORE: JobMatchingPromptConfig = {
  version: '1.0',
  model: 'gemini-2.0-flash-exp',
  temperature: 0.3,
  maxTokens: 512,
  template: `[SYSTEM]
You are an expert job matching specialist with deep understanding of:
- Skills alignment and transferable competencies
- Experience relevance and career progression
- Education requirements and equivalencies
- Industry-specific qualifications
- Soft skills and cultural fit indicators

[TASK]
Calculate a precise match score between this resume and job description.

[RESUME SUMMARY]
Skills: {skills}
Experience: {experience}
Education: {education}
Summary: {summary}

[JOB DESCRIPTION]
{jobDescription}

[SCORING CRITERIA]
Evaluate the following dimensions (0-100 each):
1. Skills Match: Technical and soft skills alignment
2. Experience Relevance: Years, industry, and role similarity  
3. Education Fit: Degree requirements and field of study
4. Seniority Alignment: Current level vs. required level
5. Industry Experience: Domain knowledge and sector familiarity

[SCORING GUIDELINES]
- 90-100: Exceptional match, exceeds all requirements
- 75-89: Strong match, meets most requirements well
- 60-74: Good match, meets core requirements
- 45-59: Fair match, meets some requirements
- 30-44: Weak match, limited alignment
- 0-29: Poor match, minimal relevance

[OUTPUT]
Return a JSON object with:
- Overall match score (weighted average)
- Individual dimension scores
- Key strengths and gaps
- Recommendation`,
  schema: {
    type: "object",
    properties: {
      matchScore: { 
        type: "number",
        minimum: 0,
        maximum: 100
      },
      dimensions: {
        type: "object",
        properties: {
          skills: { type: "number", minimum: 0, maximum: 100 },
          experience: { type: "number", minimum: 0, maximum: 100 },
          education: { type: "number", minimum: 0, maximum: 100 },
          seniority: { type: "number", minimum: 0, maximum: 100 },
          industry: { type: "number", minimum: 0, maximum: 100 }
        }
      },
      strengths: {
        type: "array",
        items: { type: "string" }
      },
      gaps: {
        type: "array",
        items: { type: "string" }
      },
      recommendation: {
        type: "string",
        enum: ["Highly Recommended", "Recommended", "Consider", "Not Recommended"]
      }
    },
    required: ["matchScore", "dimensions", "strengths", "gaps", "recommendation"]
  }
};

export const JOB_RANKING: JobMatchingPromptConfig = {
  version: '1.0',
  model: 'gemini-2.0-flash-exp',
  temperature: 0.4,
  maxTokens: 2048,
  template: `[SYSTEM]
You are a job search expert who ranks job opportunities by relevance to search queries and candidate profiles.
Your rankings consider semantic similarity, skills alignment, and career fit.

[SEARCH CONTEXT]
Query: "{query}"
{userProfile}

[JOBS TO RANK]
{jobsList}

[RANKING CRITERIA]
1. Query Relevance (40%): How well the job title/description matches the search query
2. Skills Alignment (25%): Match between required and possessed skills
3. Experience Fit (20%): Seniority and years of experience alignment
4. Location Match (10%): Geographic preferences and remote options
5. Career Trajectory (5%): Growth potential and career path fit

[EVALUATION PROCESS]
For each job:
1. Analyze title and description against search query
2. Extract key requirements and responsibilities
3. Compare with user profile (if provided)
4. Assess overall fit and potential
5. Assign relevance score (0-100)

[OUTPUT]
Return a JSON array of ranked jobs with:
- Job index from original list
- Relevance score (0-100)
- Brief explanation of ranking
- Key matching factors
Sort by relevance score (highest first)`,
  schema: {
    type: "array",
    items: {
      type: "object",
      properties: {
        index: { type: "number" },
        score: { 
          type: "number",
          minimum: 0,
          maximum: 100
        },
        reason: { type: "string" },
        matchingFactors: {
          type: "array",
          items: { type: "string" }
        }
      },
      required: ["index", "score", "reason", "matchingFactors"]
    }
  }
};

export const SKILLS_GAP_ANALYSIS: JobMatchingPromptConfig = {
  version: '1.0',
  model: 'gemini-2.0-flash-exp',
  temperature: 0.3,
  maxTokens: 1024,
  template: `[SYSTEM]
You are a career development expert specializing in skills gap analysis.
Identify missing skills and provide actionable recommendations for improvement.

[CANDIDATE PROFILE]
Current Skills: {currentSkills}
Experience Level: {experienceLevel}
Target Role: {targetRole}

[JOB REQUIREMENTS]
{jobRequirements}

[ANALYSIS TASKS]
1. Identify required skills from job description
2. Categorize skills by importance (critical, important, nice-to-have)
3. Compare with candidate's current skills
4. Identify gaps and overlaps
5. Prioritize skills to develop
6. Suggest learning resources and timeline

[OUTPUT]
Return structured analysis with:
- Required skills breakdown
- Skills gaps identified
- Development priorities
- Recommended learning path
- Estimated time to close gaps`,
  schema: {
    type: "object",
    properties: {
      requiredSkills: {
        type: "object",
        properties: {
          critical: {
            type: "array",
            items: { type: "string" }
          },
          important: {
            type: "array",
            items: { type: "string" }
          },
          niceToHave: {
            type: "array",
            items: { type: "string" }
          }
        }
      },
      skillsGaps: {
        type: "array",
        items: {
          type: "object",
          properties: {
            skill: { type: "string" },
            importance: { 
              type: "string",
              enum: ["critical", "important", "nice-to-have"]
            },
            currentLevel: {
              type: "string",
              enum: ["none", "beginner", "intermediate", "advanced"]
            },
            requiredLevel: {
              type: "string",
              enum: ["beginner", "intermediate", "advanced", "expert"]
            }
          }
        }
      },
      developmentPlan: {
        type: "array",
        items: {
          type: "object",
          properties: {
            skill: { type: "string" },
            priority: {
              type: "string",
              enum: ["high", "medium", "low"]
            },
            suggestedResources: {
              type: "array",
              items: { type: "string" }
            },
            estimatedTime: { type: "string" }
          }
        }
      },
      overallReadiness: {
        type: "number",
        minimum: 0,
        maximum: 100
      }
    },
    required: ["requiredSkills", "skillsGaps", "developmentPlan", "overallReadiness"]
  }
};

/**
 * Build job matching prompt
 */
export function buildJobMatchPrompt(
  resume: any,
  jobDescription: string
): string {
  const skills = resume.skills?.join(', ') || 'Not specified';
  const experience = resume.experience?.map((e: any) => 
    `${e.position} at ${e.company}`
  ).join(', ') || 'Not specified';
  const education = resume.education?.map((e: any) => 
    `${e.degree} in ${e.field}`
  ).join(', ') || 'Not specified';
  const summary = resume.personalInfo?.summary || 'Not provided';
  
  return JOB_MATCH_SCORE.template
    .replace('{skills}', skills)
    .replace('{experience}', experience)
    .replace('{education}', education)
    .replace('{summary}', summary)
    .replace('{jobDescription}', jobDescription);
}

/**
 * Build job ranking prompt
 */
export function buildJobRankingPrompt(
  jobs: any[],
  query: string,
  userProfile?: {
    skills?: string[];
    preferredLocation?: string;
    experienceLevel?: string;
  }
): string {
  // Format jobs list
  const jobsList = jobs.map((job, index) => 
    `Job ${index}:
- Title: ${job.title}
- Company: ${job.company}
- Location: ${job.location || job.city || 'Not specified'}
- Remote: ${job.remote ? 'Yes' : 'No'}
- Description: ${(job.description || '').substring(0, 300)}...`
  ).join('\n\n');
  
  // Format user profile if provided
  const profileSection = userProfile ? `
[USER PROFILE]
Skills: ${userProfile.skills?.join(', ') || 'Not specified'}
Preferred Location: ${userProfile.preferredLocation || 'Flexible'}
Experience Level: ${userProfile.experienceLevel || 'Not specified'}` : '';
  
  return JOB_RANKING.template
    .replace('{query}', query)
    .replace('{userProfile}', profileSection)
    .replace('{jobsList}', jobsList);
}

/**
 * Build skills gap analysis prompt
 */
export function buildSkillsGapPrompt(
  currentSkills: string[],
  targetRole: string,
  jobRequirements: string,
  experienceLevel?: string
): string {
  return SKILLS_GAP_ANALYSIS.template
    .replace('{currentSkills}', currentSkills.join(', '))
    .replace('{experienceLevel}', experienceLevel || 'Not specified')
    .replace('{targetRole}', targetRole)
    .replace('{jobRequirements}', jobRequirements);
}