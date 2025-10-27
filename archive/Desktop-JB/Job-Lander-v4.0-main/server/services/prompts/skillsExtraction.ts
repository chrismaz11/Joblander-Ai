/**
 * Skills Extraction Prompt Templates
 * Templates for extracting and categorizing skills from text
 */

export interface SkillsExtractionPromptConfig {
  version: string;
  model: string;
  temperature: number;
  maxTokens: number;
  template: string;
  schema: any;
}

export const SKILLS_EXTRACTION: SkillsExtractionPromptConfig = {
  version: '1.0',
  model: 'gemini-2.0-flash-exp',
  temperature: 0.3,
  maxTokens: 1024,
  template: `[SYSTEM]
You are an expert at identifying and categorizing professional skills from text.
You understand technical skills, soft skills, tools, methodologies, and domain expertise.

[TASK]
Extract and categorize all skills from the following text.
Identify both explicitly stated and implied skills based on context.

[INPUT TEXT]
{inputText}

[SKILL CATEGORIES]
1. Technical Skills: Programming languages, frameworks, databases, etc.
2. Tools & Software: Applications, platforms, services used
3. Soft Skills: Communication, leadership, problem-solving, etc.
4. Methodologies: Agile, Scrum, Design Thinking, etc.
5. Domain Knowledge: Industry-specific expertise
6. Certifications: Professional certifications and qualifications

[EXTRACTION GUIDELINES]
- Extract both explicit skills and those implied by achievements
- Normalize skill names (e.g., JS -> JavaScript)
- Remove duplicates and redundancies
- Rank skills by apparent proficiency level
- Group related skills together
- Identify skill relationships and dependencies

[OUTPUT]
Return structured skill data with:
- Categorized skills lists
- Proficiency levels where determinable
- Related skill clusters
- Top skills summary`,
  schema: {
    type: "object",
    properties: {
      technical: {
        type: "array",
        items: {
          type: "object",
          properties: {
            skill: { type: "string" },
            proficiency: {
              type: "string",
              enum: ["beginner", "intermediate", "advanced", "expert", "unknown"]
            },
            yearsOfExperience: { type: "number" },
            context: { type: "string" }
          }
        }
      },
      tools: {
        type: "array",
        items: {
          type: "object",
          properties: {
            name: { type: "string" },
            category: { type: "string" },
            proficiency: {
              type: "string",
              enum: ["basic", "proficient", "advanced", "unknown"]
            }
          }
        }
      },
      soft: {
        type: "array",
        items: {
          type: "object",
          properties: {
            skill: { type: "string" },
            evidence: { type: "string" },
            strength: {
              type: "string",
              enum: ["strong", "moderate", "developing"]
            }
          }
        }
      },
      methodologies: {
        type: "array",
        items: { type: "string" }
      },
      domain: {
        type: "array",
        items: {
          type: "object",
          properties: {
            area: { type: "string" },
            level: {
              type: "string",
              enum: ["entry", "mid", "senior", "expert"]
            }
          }
        }
      },
      certifications: {
        type: "array",
        items: {
          type: "object",
          properties: {
            name: { type: "string" },
            issuer: { type: "string" },
            year: { type: "string" },
            status: {
              type: "string",
              enum: ["active", "expired", "unknown"]
            }
          }
        }
      },
      topSkills: {
        type: "array",
        items: { type: "string" },
        maxItems: 10
      },
      skillClusters: {
        type: "array",
        items: {
          type: "object",
          properties: {
            name: { type: "string" },
            skills: {
              type: "array",
              items: { type: "string" }
            }
          }
        }
      }
    },
    required: ["technical", "tools", "soft", "methodologies", "domain", "topSkills"]
  }
};

export const SKILL_RECOMMENDATIONS: SkillsExtractionPromptConfig = {
  version: '1.0',
  model: 'gemini-2.0-flash-exp',
  temperature: 0.5,
  maxTokens: 1024,
  template: `[SYSTEM]
You are a career development advisor who recommends skills based on career goals and market trends.
You understand skill progressions, complementary skills, and industry demands.

[CURRENT PROFILE]
Current Skills: {currentSkills}
Experience Level: {experienceLevel}
Target Role: {targetRole}
Industry: {industry}

[TASK]
Recommend skills to develop for career advancement.

[ANALYSIS APPROACH]
1. Identify gaps for target role
2. Suggest complementary skills to current skillset
3. Recommend trending skills in the industry
4. Prioritize by ROI and learning curve
5. Consider skill synergies and combinations

[MARKET TRENDS]
Consider current market demands:
- AI/ML integration skills
- Cloud platforms and DevOps
- Data analysis and visualization
- Cybersecurity fundamentals
- Soft skills for remote work
- Industry-specific digital tools

[OUTPUT]
Provide skill recommendations with:
- Priority ranking
- Rationale for each recommendation
- Learning path suggestions
- Time investment required
- Career impact assessment`,
  schema: {
    type: "object",
    properties: {
      recommendations: {
        type: "array",
        items: {
          type: "object",
          properties: {
            skill: { type: "string" },
            priority: {
              type: "string",
              enum: ["critical", "high", "medium", "low"]
            },
            rationale: { type: "string" },
            learningPath: {
              type: "array",
              items: { type: "string" }
            },
            timeToLearn: { type: "string" },
            careerImpact: {
              type: "string",
              enum: ["transformative", "significant", "moderate", "incremental"]
            },
            resources: {
              type: "array",
              items: { type: "string" }
            }
          }
        }
      },
      complementarySkills: {
        type: "array",
        items: {
          type: "object",
          properties: {
            currentSkill: { type: "string" },
            complements: {
              type: "array",
              items: { type: "string" }
            }
          }
        }
      },
      trendingSkills: {
        type: "array",
        items: {
          type: "object",
          properties: {
            skill: { type: "string" },
            trend: {
              type: "string",
              enum: ["rising", "stable", "declining"]
            },
            demandLevel: {
              type: "string",
              enum: ["very high", "high", "moderate", "low"]
            }
          }
        }
      }
    },
    required: ["recommendations", "complementarySkills", "trendingSkills"]
  }
};

export const TRANSFERABLE_SKILLS: SkillsExtractionPromptConfig = {
  version: '1.0',
  model: 'gemini-2.0-flash-exp',
  temperature: 0.4,
  maxTokens: 1024,
  template: `[SYSTEM]
You are an expert at identifying transferable skills that apply across industries and roles.
You help professionals recognize valuable skills they may not realize they have.

[EXPERIENCE CONTEXT]
{experienceContext}

[TASK]
Identify transferable skills from the given experience that would be valuable in other contexts.

[TRANSFERABLE SKILL CATEGORIES]
1. Leadership & Management: Team building, delegation, mentoring
2. Communication: Writing, presenting, negotiating, teaching
3. Analytical: Problem-solving, research, data interpretation
4. Technical: Digital literacy, software proficiency, technical writing
5. Interpersonal: Collaboration, conflict resolution, customer service
6. Organizational: Project management, time management, planning
7. Creative: Innovation, design thinking, content creation
8. Business: Strategy, budgeting, sales, marketing

[IDENTIFICATION PROCESS]
1. Extract activities and responsibilities
2. Identify underlying competencies
3. Abstract skills from specific contexts
4. Frame in universal terms
5. Provide cross-industry applications

[OUTPUT]
Return transferable skills with:
- Skill identification
- Evidence from experience
- Potential applications in other fields
- Market value assessment`,
  schema: {
    type: "object",
    properties: {
      transferableSkills: {
        type: "array",
        items: {
          type: "object",
          properties: {
            skill: { type: "string" },
            category: { type: "string" },
            evidence: { type: "string" },
            applications: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  industry: { type: "string" },
                  role: { type: "string" },
                  relevance: {
                    type: "string",
                    enum: ["directly applicable", "highly relevant", "somewhat relevant"]
                  }
                }
              }
            },
            marketValue: {
              type: "string",
              enum: ["high", "medium", "low"]
            }
          }
        }
      },
      hiddenStrengths: {
        type: "array",
        items: {
          type: "object",
          properties: {
            strength: { type: "string" },
            description: { type: "string" },
            developmentTip: { type: "string" }
          }
        }
      },
      skillCombinations: {
        type: "array",
        items: {
          type: "object",
          properties: {
            combination: {
              type: "array",
              items: { type: "string" }
            },
            uniqueValue: { type: "string" },
            targetRoles: {
              type: "array",
              items: { type: "string" }
            }
          }
        }
      }
    },
    required: ["transferableSkills", "hiddenStrengths"]
  }
};

/**
 * Build skills extraction prompt
 */
export function buildSkillsExtractionPrompt(inputText: string): string {
  return SKILLS_EXTRACTION.template.replace('{inputText}', inputText);
}

/**
 * Build skill recommendations prompt
 */
export function buildSkillRecommendationsPrompt(
  currentSkills: string[],
  targetRole: string,
  experienceLevel?: string,
  industry?: string
): string {
  return SKILL_RECOMMENDATIONS.template
    .replace('{currentSkills}', currentSkills.join(', '))
    .replace('{experienceLevel}', experienceLevel || 'Not specified')
    .replace('{targetRole}', targetRole)
    .replace('{industry}', industry || 'Not specified');
}

/**
 * Build transferable skills prompt
 */
export function buildTransferableSkillsPrompt(experienceContext: string): string {
  return TRANSFERABLE_SKILLS.template.replace('{experienceContext}', experienceContext);
}