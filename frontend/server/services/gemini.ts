/**
 * Gemini Service - Refactored to use centralized LLM Adapter
 * All LLM operations now go through the unified adapter system
 */

import { LLMFactory, type LLMResponse } from './llmAdapter';
import { llmConfig, getTaskConfig } from '../config/llm.config';
import {
  buildResumeParsingPrompt,
  getResumeParsingConfig,
  buildCoverLetterPrompt,
  getCoverLetterSchema,
  buildJobMatchPrompt,
  JOB_MATCH_SCORE,
  buildJobRankingPrompt,
  JOB_RANKING,
  buildEnhancementPrompt,
  RESUME_ENHANCEMENT,
  type CoverLetterData
} from './prompts';

/**
 * Parse resume with AI using the centralized adapter
 */
export async function parseResumeWithAI(text: string): Promise<any> {
  const adapter = LLMFactory.getDefaultAdapter();
  const config = getResumeParsingConfig(false);
  const prompt = buildResumeParsingPrompt(text, false);
  const taskConfig = getTaskConfig('resumeParsing');
  
  const response: LLMResponse = await adapter.generateJSON(
    prompt,
    config.schema,
    {
      temperature: config.temperature,
      maxTokens: config.maxTokens,
      cacheTTL: taskConfig.cacheTTL,
      timeout: taskConfig.timeout
    }
  );

  if (!response.success) {
    console.error("AI parsing error:", response.error);
    // Return fallback response with low confidence
    return {
      personalInfo: {
        fullName: "",
        email: "",
        phone: "",
        location: "",
        linkedin: "",
        website: "",
        summary: ""
      },
      experience: [],
      education: [],
      skills: [],
      confidence: {
        overall: "low",
        fields: {
          fullName: "low",
          email: "low",
          phone: "low",
          location: "low",
          linkedin: "low",
          website: "low",
          summary: "low",
          experience: "low",
          education: "low",
          skills: "low"
        }
      },
      rawText: text,
      _metadata: {
        model: response.model,
        latency: response.latency,
        cached: response.cached,
        confidence: response.confidence
      }
    };
  }

  // Ensure rawText is always included
  const result = response.data;
  if (!result.rawText) {
    result.rawText = text;
  }
  
  // Add metadata about the response
  result._metadata = {
    model: response.model,
    latency: response.latency,
    cached: response.cached,
    confidence: response.confidence
  };
  
  return result;
}

/**
 * Generate enhanced resume content
 */
export async function generateResumeContent(data: any): Promise<string> {
  const adapter = LLMFactory.getDefaultAdapter();
  const prompt = buildEnhancementPrompt(data);
  const taskConfig = getTaskConfig('resumeEnhancement');
  
  const response: LLMResponse = await adapter.generateJSON(
    prompt,
    RESUME_ENHANCEMENT.schema,
    {
      temperature: RESUME_ENHANCEMENT.temperature,
      maxTokens: RESUME_ENHANCEMENT.maxTokens,
      cacheTTL: taskConfig.cacheTTL,
      timeout: taskConfig.timeout
    }
  );

  if (!response.success) {
    console.error("Resume enhancement error:", response.error);
    return JSON.stringify(data); // Return original data if enhancement fails
  }

  return JSON.stringify(response.data);
}

/**
 * Generate cover letter with specified tone
 */
export async function generateCoverLetter(data: CoverLetterData): Promise<string> {
  const adapter = LLMFactory.getDefaultAdapter();
  const prompt = buildCoverLetterPrompt(data, false);
  const taskConfig = getTaskConfig('coverLetterGeneration');
  
  const response: LLMResponse<string> = await adapter.generateText(
    prompt,
    {
      temperature: 0.8,
      maxTokens: 1024,
      cacheTTL: taskConfig.cacheTTL,
      timeout: taskConfig.timeout
    }
  );

  if (!response.success) {
    console.error("Cover letter generation error:", response.error);
    return "Failed to generate cover letter. Please try again.";
  }

  return response.data;
}

/**
 * Generate all three cover letter tone variants at once
 */
export async function generateAllCoverLetterTones(data: CoverLetterData): Promise<{
  professional: string;
  concise: string;
  bold: string;
}> {
  const adapter = LLMFactory.getDefaultAdapter();
  const prompt = buildCoverLetterPrompt(data, true);
  const schema = getCoverLetterSchema(true);
  const taskConfig = getTaskConfig('coverLetterGeneration');
  
  const response: LLMResponse = await adapter.generateJSON(
    prompt,
    schema,
    {
      temperature: 0.8,
      maxTokens: 2048,
      cacheTTL: taskConfig.cacheTTL,
      timeout: taskConfig.timeout
    }
  );

  if (!response.success) {
    console.error("Cover letter generation error:", response.error);
    const fallback = "Failed to generate cover letter variant. Please try again.";
    return {
      professional: fallback,
      concise: fallback,
      bold: fallback
    };
  }

  return {
    professional: response.data.professional || "",
    concise: response.data.concise || "",
    bold: response.data.bold || ""
  };
}

/**
 * Calculate job match score
 */
export async function calculateJobMatch(resume: any, jobDescription: string): Promise<number> {
  const adapter = LLMFactory.getDefaultAdapter();
  const prompt = buildJobMatchPrompt(resume, jobDescription);
  const taskConfig = getTaskConfig('jobMatching');
  
  const response: LLMResponse = await adapter.generateJSON(
    prompt,
    JOB_MATCH_SCORE.schema,
    {
      temperature: JOB_MATCH_SCORE.temperature,
      maxTokens: JOB_MATCH_SCORE.maxTokens,
      cacheTTL: taskConfig.cacheTTL,
      timeout: taskConfig.timeout
    }
  );

  if (!response.success) {
    console.error("Job matching error:", response.error);
    return 0;
  }

  return response.data.matchScore || 0;
}

/**
 * Rank jobs by relevance using AI
 */
export async function rankJobsByRelevance(
  jobs: any[],
  query: string,
  preferences?: {
    skills?: string[];
    preferredLocation?: string;
    experienceLevel?: string;
  }
): Promise<any[]> {
  if (!jobs || jobs.length === 0) return [];
  if (!query) return jobs;

  const adapter = LLMFactory.getDefaultAdapter();
  const prompt = buildJobRankingPrompt(jobs, query, preferences);
  const taskConfig = getTaskConfig('jobMatching');
  
  const response: LLMResponse = await adapter.generateJSON(
    prompt,
    JOB_RANKING.schema,
    {
      temperature: JOB_RANKING.temperature,
      maxTokens: JOB_RANKING.maxTokens,
      cacheTTL: taskConfig.cacheTTL,
      timeout: taskConfig.timeout
    }
  );

  if (!response.success) {
    console.error("Job ranking error:", response.error);
    // Return jobs with default scores
    return jobs.map(job => ({
      ...job,
      aiMatchScore: 50,
      matchReason: "Standard match",
      _aiMetadata: {
        error: response.error,
        model: response.model,
        cached: response.cached
      }
    }));
  }

  const rankings = response.data;
  
  // Apply rankings to jobs
  const rankedJobs = rankings.map((rank: any) => {
    const job = jobs[rank.index];
    return {
      ...job,
      aiMatchScore: rank.score,
      matchReason: rank.reason,
      matchingFactors: rank.matchingFactors,
      _aiMetadata: {
        model: response.model,
        confidence: response.confidence,
        cached: response.cached,
        latency: response.latency
      }
    };
  });

  // Add any jobs that weren't ranked
  const rankedIndices = new Set(rankings.map((r: any) => r.index));
  jobs.forEach((job, index) => {
    if (!rankedIndices.has(index)) {
      rankedJobs.push({
        ...job,
        aiMatchScore: 50,
        matchReason: "Standard match",
        _aiMetadata: {
          model: response.model,
          confidence: 0,
          cached: false
        }
      });
    }
  });

  return rankedJobs.sort((a, b) => (b.aiMatchScore || 0) - (a.aiMatchScore || 0));
}

/**
 * Get city suggestions (simplified, doesn't need AI)
 */
export async function suggestCities(partialCity: string, availableCities: string[]): Promise<string[]> {
  if (!partialCity || partialCity.length < 2) return [];
  
  const partial = partialCity.toLowerCase();
  const suggestions = availableCities.filter(city => 
    city.toLowerCase().includes(partial)
  );
  
  // Sort by how early the partial appears in the city name
  suggestions.sort((a, b) => {
    const aIndex = a.toLowerCase().indexOf(partial);
    const bIndex = b.toLowerCase().indexOf(partial);
    return aIndex - bIndex;
  });
  
  return suggestions.slice(0, 5);
}

/**
 * Export service metadata for monitoring
 */
export const serviceMetadata = {
  version: '2.0',
  adapter: 'centralized',
  provider: llmConfig.defaultProvider,
  cacheEnabled: llmConfig.cacheEnabled,
  models: llmConfig.models
};
