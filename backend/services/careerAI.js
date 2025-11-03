import OpenAI from "openai";
import { getDb } from "./db.js";
import { jobs as jobsTable } from "../drizzle/schema.js";

// Initialize OpenAI client if key present
const client =
  process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== "your_openai_api_key_here"
    ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
    : null;

const hfApiKey = process.env.HUGGINGFACE_API_KEY || process.env.HF_API_KEY || null;
const hfDefaultModel = process.env.HUGGINGFACE_MODEL || process.env.HF_MODEL || 'google/flan-t5-large';

async function callHuggingFace(model, prompt, options = {}) {
  if (!hfApiKey) throw new Error('Hugging Face API key not configured');

  const url = `https://api-inference.huggingface.co/models/${model}`;
  const body = {
    inputs: prompt,
    parameters: options.parameters || { max_new_tokens: 512, temperature: 0.6 },
    options: { wait_for_model: true }
  };

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${hfApiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`HF inference error ${res.status}: ${txt}`);
  }

  const data = await res.json();
  // Depending on model, response may be [{ generated_text: '...' }] or { error: '...' }
  if (Array.isArray(data) && data[0]?.generated_text) return data[0].generated_text;
  if (data?.generated_text) return data.generated_text;
  if (typeof data === 'string') return data;
  // Some models return an array of objects with 'generated_text'
  try {
    return JSON.stringify(data);
  } catch (e) {
    return String(data);
  }
}

/**
 * Analyze resume against job description for match scoring and improvement suggestions
 */
export async function analyzeJobFit(resume, jobDescription) {
  if (!client) return { score: 0, suggestions: [] };

  try {
    const resp = await client.responses.create({
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      input: [
        { role: 'system', content: `Analyze the resume against the job description and provide:\n1. A match score (0-100)\n2. Key matching qualifications\n3. Missing skills or experiences\n4. Specific suggestions to improve match\nReturn as JSON object with score, matches, gaps, and suggestions arrays.` },
        { role: 'user', content: `Resume: ${JSON.stringify(resume)}\nJob Description: ${jobDescription}` }
      ],
      temperature: 0.3,
      max_output_tokens: 800
    });

    const text = resp.output_text || (resp.output && resp.output[0] && resp.output[0].content && resp.output[0].content.map(c=>c.text||'').join('')) || '';
    try {
      return JSON.parse(text);
    } catch (e) {
      console.warn('[careerAI] analyzeJobFit: could not parse JSON', e);
      return { score: 0, matches: [], gaps: [], suggestions: ['Unable to parse AI response'] };
    }
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
    const resp = await client.responses.create({
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      input: [
        { role: 'system', content: `Generate a comprehensive salary negotiation strategy. Consider:\n1. Market data and industry standards\n2. Company-specific insights\n3. Location-based adjustments\n4. Total compensation structure\n5. Specific talking points and counteroffers\nReturn as JSON with strategy, talkingPoints, and counterofferRange.` },
        { role: 'user', content: JSON.stringify({ jobTitle, company, location, experienceYears, currentSalary, offeredSalary, benefits, industryData }) }
      ],
      temperature: 0.3,
      max_output_tokens: 800
    });

    const text = resp.output_text || (resp.output && resp.output[0] && resp.output[0].content && resp.output[0].content.map(c=>c.text||'').join('')) || '';
    try { return JSON.parse(text); } catch (e) { console.warn('[careerAI] generateNegotiationStrategy parse failed', e); return null; }
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
    const resp = await client.responses.create({
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      input: [
        { role: 'system', content: `Create a personalized job search strategy. Include:\n1. Target companies and roles\n2. Skills to highlight/develop\n3. Search keywords and filters\n4. Networking suggestions\n5. Application timing strategy\nReturn as JSON with strategy sections.` },
        { role: 'user', content: JSON.stringify({ desiredRole, location, experience, skills, preferences, marketTrends }) }
      ],
      temperature: 0.3,
      max_output_tokens: 800
    });

    const text = resp.output_text || (resp.output && resp.output[0] && resp.output[0].content && resp.output[0].content.map(c=>c.text||'').join('')) || '';
    try { return JSON.parse(text); } catch (e) { console.warn('[careerAI] generateJobSearchStrategy parse failed', e); return null; }
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
    const resp = await client.responses.create({
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      input: [
        { role: 'system', content: `Analyze and enhance job application materials:\n1. Resume optimization suggestions\n2. Cover letter improvements\n3. Key achievements to highlight\n4. Company-specific customizations\nReturn as JSON with enhancement suggestions.` },
        { role: 'user', content: JSON.stringify({ resume, coverLetter, jobDescription, companyInfo }) }
      ],
      temperature: 0.3,
      max_output_tokens: 800
    });

    const text = resp.output_text || (resp.output && resp.output[0] && resp.output[0].content && resp.output[0].content.map(c=>c.text||'').join('')) || '';
    try { return JSON.parse(text); } catch (e) { console.warn('[careerAI] enhanceJobApplication parse failed', e); return null; }
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
    const resp = await client.responses.create({
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      input: [
        { role: 'system', content: `Create comprehensive interview preparation materials:\n1. Likely technical questions\n2. Behavioral question strategies\n3. Company-specific insights\n4. Questions to ask interviewer\n5. STAR story suggestions\nReturn as JSON with preparation sections.` },
        { role: 'user', content: JSON.stringify({ jobDescription, company, role, experienceLevel, techStack }) }
      ],
      temperature: 0.3,
      max_output_tokens: 800
    });

    const text = resp.output_text || (resp.output && resp.output[0] && resp.output[0].content && resp.output[0].content.map(c=>c.text||'').join('')) || '';
    try { return JSON.parse(text); } catch (e) { console.warn('[careerAI] generateInterviewPrep parse failed', e); return null; }
  } catch (error) {
    console.error("[careerAI] Interview prep generation failed:", error);
    return null;
  }
}

/**
 * Generate a cover letter or thank-you note tailored to a resume, position and company.
 * type: 'cover' | 'thank-you'
 */
export async function generateLetter({ type = 'cover', resume = {}, position = '', company = '', tone = 'professional', templateMeta = {} }) {
  // Prefer provider selection by env var LLM_PROVIDER, else auto-detect
  const provider = (process.env.LLM_PROVIDER || '').toLowerCase();

  try {
    // OpenAI path
    if (provider === 'openai' || (provider === '' && client)) {
      if (!client) throw new Error('OpenAI client not configured');
      const systemPrompt = `You are a professional career writer. Produce a ${type === 'cover' ? 'cover letter' : 'thank-you note'} targeted to the given position and company. Use the requested tone when generating. Keep the letter concise, professional, and tailored.`;
      const userContent = JSON.stringify({ resume, position, company, tone, templateMeta });

      const resp = await client.responses.create({
        model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
        input: [ { role: 'system', content: systemPrompt }, { role: 'user', content: userContent } ],
        temperature: 0.6,
        max_output_tokens: 800
      });

      const text = resp.output_text || (resp.output && resp.output[0] && resp.output[0].content && resp.output[0].content.map(c=>c.text||'').join('')) || '';
      return text;
    }

    // Hugging Face path
    if (provider === 'huggingface' || provider === 'hf' || (provider === '' && hfApiKey)) {
      const model = process.env.HUGGINGFACE_MODEL || hfDefaultModel;
      const prompt = `Write a ${type === 'cover' ? 'cover letter' : 'thank-you note'} in a ${tone} tone for the role ${position} at ${company}. Resume details: ${JSON.stringify(resume)}.`;
      const result = await callHuggingFace(model, prompt, { parameters: { max_new_tokens: 600, temperature: 0.6 } });
      return result;
    }

    // No provider configured
    console.warn('[careerAI] No LLM provider configured (OPENAI_API_KEY or HUGGINGFACE_API_KEY)');
    return null;
  } catch (error) {
    console.error('[careerAI] generateLetter failed:', error);
    return null;
  }
}