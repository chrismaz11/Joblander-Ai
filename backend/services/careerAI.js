import OpenAI from "openai";
import { getDb } from "./db.js";
import { jobs as jobsTable } from "../drizzle/schema.js";

const client =
  process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== "your_openai_api_key_here"
    ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
    : null;

/**
 * Analyze resume against job description for match scoring and improvement suggestions
 */
export async function analyzeJobFit(resume, jobDescription) {
  if (!client) return { score: 0, suggestions: [] };

  try {
    const completion = await client.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: `Analyze the resume against the job description and provide:
1. A match score (0-100)
2. Key matching qualifications
3. Missing skills or experiences
4. Specific suggestions to improve match
Return as JSON object with score, matches, gaps, and suggestions arrays.`
        },
        {
          role: "user",
          content: `Resume: ${JSON.stringify(resume)}
Job Description: ${jobDescription}`
        }
      ],
      temperature: 0.3,
    });

    return JSON.parse(completion.choices[0].message.content);
  } catch (error) {
    console.error("[careerAI] Job fit analysis failed:", error);
    return {
      score: 0,
      matches: [],
      gaps: [],
      suggestions: ["Unable to analyze job fit at this time"]
    };
  }
}

/**
 * Generate tailored salary negotiation strategy
 */
export async function generateNegotiationStrategy({
  jobTitle,
  company,
  location,
  experienceYears,
  currentSalary,
  offeredSalary,
  benefits,
  industryData
}) {
  if (!client) return null;

  try {
    const completion = await client.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: `Generate a comprehensive salary negotiation strategy. Consider:
1. Market data and industry standards
2. Company-specific insights
3. Location-based adjustments
4. Total compensation structure
5. Specific talking points and counteroffers
Return as JSON with strategy, talkingPoints, and counterofferRange.`
        },
        {
          role: "user",
          content: JSON.stringify({
            jobTitle,
            company,
            location,
            experienceYears,
            currentSalary,
            offeredSalary,
            benefits,
            industryData
          })
        }
      ],
      temperature: 0.3,
    });

    return JSON.parse(completion.choices[0].message.content);
  } catch (error) {
    console.error("[careerAI] Negotiation strategy generation failed:", error);
    return null;
  }
}

/**
 * Generate custom job search strategy
 */
export async function generateJobSearchStrategy({
  desiredRole,
  location,
  experience,
  skills,
  preferences,
  marketTrends
}) {
  if (!client) return null;

  try {
    const completion = await client.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: `Create a personalized job search strategy. Include:
1. Target companies and roles
2. Skills to highlight/develop
3. Search keywords and filters
4. Networking suggestions
5. Application timing strategy
Return as JSON with strategy sections.`
        },
        {
          role: "user",
          content: JSON.stringify({
            desiredRole,
            location,
            experience,
            skills,
            preferences,
            marketTrends
          })
        }
      ],
      temperature: 0.3,
    });

    return JSON.parse(completion.choices[0].message.content);
  } catch (error) {
    console.error("[careerAI] Job search strategy generation failed:", error);
    return null;
  }
}

/**
 * Enhance job application materials
 */
export async function enhanceJobApplication({
  resume,
  coverLetter,
  jobDescription,
  companyInfo
}) {
  if (!client) return null;

  try {
    const completion = await client.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: `Analyze and enhance job application materials:
1. Resume optimization suggestions
2. Cover letter improvements
3. Key achievements to highlight
4. Company-specific customizations
Return as JSON with enhancement suggestions.`
        },
        {
          role: "user",
          content: JSON.stringify({
            resume,
            coverLetter,
            jobDescription,
            companyInfo
          })
        }
      ],
      temperature: 0.3,
    });

    return JSON.parse(completion.choices[0].message.content);
  } catch (error) {
    console.error("[careerAI] Application enhancement failed:", error);
    return null;
  }
}

/**
 * Generate interview preparation materials
 */
export async function generateInterviewPrep({
  jobDescription,
  company,
  role,
  experienceLevel,
  techStack
}) {
  if (!client) return null;

  try {
    const completion = await client.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: `Create comprehensive interview preparation materials:
1. Likely technical questions
2. Behavioral question strategies
3. Company-specific insights
4. Questions to ask interviewer
5. STAR story suggestions
Return as JSON with preparation sections.`
        },
        {
          role: "user",
          content: JSON.stringify({
            jobDescription,
            company,
            role,
            experienceLevel,
            techStack
          })
        }
      ],
      temperature: 0.3,
    });

    return JSON.parse(completion.choices[0].message.content);
  } catch (error) {
    console.error("[careerAI] Interview prep generation failed:", error);
    return null;
  }
}