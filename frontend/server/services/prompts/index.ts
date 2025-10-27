/**
 * Centralized Prompt Templates Export
 * All prompt templates and utilities in one place
 */

// Resume Parsing
export {
  RESUME_PARSING_PROMPT,
  RESUME_PARSING_OCR_ENHANCED,
  buildResumeParsingPrompt,
  getResumeParsingConfig,
  type ResumeParsingPromptConfig
} from './resumeParsing';

// Cover Letter Generation
export {
  COVER_LETTER_SINGLE_TONE,
  COVER_LETTER_ALL_TONES,
  buildCoverLetterPrompt,
  getCoverLetterSchema,
  getCoverLetterConfig,
  type CoverLetterPromptConfig,
  type CoverLetterData
} from './coverLetterGeneration';

// Job Matching
export {
  JOB_MATCH_SCORE,
  JOB_RANKING,
  SKILLS_GAP_ANALYSIS,
  buildJobMatchPrompt,
  buildJobRankingPrompt,
  buildSkillsGapPrompt,
  type JobMatchingPromptConfig
} from './jobMatching';

// Resume Enhancement
export {
  RESUME_ENHANCEMENT,
  ACHIEVEMENT_GENERATOR,
  ATS_OPTIMIZER,
  buildEnhancementPrompt,
  buildAchievementPrompt,
  buildATSOptimizerPrompt,
  type ResumeEnhancementPromptConfig
} from './resumeEnhancement';

// Skills Extraction
export {
  SKILLS_EXTRACTION,
  SKILL_RECOMMENDATIONS,
  TRANSFERABLE_SKILLS,
  buildSkillsExtractionPrompt,
  buildSkillRecommendationsPrompt,
  buildTransferableSkillsPrompt,
  type SkillsExtractionPromptConfig
} from './skillsExtraction';

/**
 * Prompt Template Registry
 * Central registry of all available prompt templates
 */
export const PROMPT_REGISTRY = {
  resumeParsing: {
    standard: 'RESUME_PARSING_PROMPT',
    ocrEnhanced: 'RESUME_PARSING_OCR_ENHANCED'
  },
  coverLetter: {
    singleTone: 'COVER_LETTER_SINGLE_TONE',
    allTones: 'COVER_LETTER_ALL_TONES'
  },
  jobMatching: {
    matchScore: 'JOB_MATCH_SCORE',
    ranking: 'JOB_RANKING',
    gapAnalysis: 'SKILLS_GAP_ANALYSIS'
  },
  enhancement: {
    resume: 'RESUME_ENHANCEMENT',
    achievements: 'ACHIEVEMENT_GENERATOR',
    atsOptimization: 'ATS_OPTIMIZER'
  },
  skills: {
    extraction: 'SKILLS_EXTRACTION',
    recommendations: 'SKILL_RECOMMENDATIONS',
    transferable: 'TRANSFERABLE_SKILLS'
  }
};

/**
 * Prompt versioning for A/B testing and iteration
 */
export const PROMPT_VERSIONS = {
  'RESUME_PARSING_PROMPT': ['1.0', '2.0'],
  'RESUME_PARSING_OCR_ENHANCED': ['2.1'],
  'COVER_LETTER_SINGLE_TONE': ['1.0'],
  'COVER_LETTER_ALL_TONES': ['1.0'],
  'JOB_MATCH_SCORE': ['1.0'],
  'JOB_RANKING': ['1.0'],
  'SKILLS_GAP_ANALYSIS': ['1.0'],
  'RESUME_ENHANCEMENT': ['1.0'],
  'ACHIEVEMENT_GENERATOR': ['1.0'],
  'ATS_OPTIMIZER': ['1.0'],
  'SKILLS_EXTRACTION': ['1.0'],
  'SKILL_RECOMMENDATIONS': ['1.0'],
  'TRANSFERABLE_SKILLS': ['1.0']
};

/**
 * Get all available prompt templates
 */
export function getAllPromptTemplates(): string[] {
  const templates: string[] = [];
  for (const category of Object.values(PROMPT_REGISTRY)) {
    templates.push(...Object.values(category));
  }
  return templates;
}

/**
 * Get prompt template by name
 */
export function getPromptTemplate(name: string): any {
  // Import all templates dynamically
  const templates: Record<string, any> = {
    RESUME_PARSING_PROMPT,
    RESUME_PARSING_OCR_ENHANCED,
    COVER_LETTER_SINGLE_TONE,
    COVER_LETTER_ALL_TONES,
    JOB_MATCH_SCORE,
    JOB_RANKING,
    SKILLS_GAP_ANALYSIS,
    RESUME_ENHANCEMENT,
    ACHIEVEMENT_GENERATOR,
    ATS_OPTIMIZER,
    SKILLS_EXTRACTION,
    SKILL_RECOMMENDATIONS,
    TRANSFERABLE_SKILLS
  };
  
  return templates[name] || null;
}

/**
 * Export prompt metadata for monitoring and analytics
 */
export const PROMPT_METADATA = {
  totalTemplates: getAllPromptTemplates().length,
  categories: Object.keys(PROMPT_REGISTRY).length,
  lastUpdated: new Date().toISOString(),
  version: '1.0.0'
};