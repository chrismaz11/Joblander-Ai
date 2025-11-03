import OpenAI from "openai";

const client =
  process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== "your_openai_api_key_here"
    ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
    : null;

export async function enhanceResumeContent(payload) {
  if (!client) {
    console.log("[aiService] OpenAI not configured, returning mock enhancement");
    return {
      personalInfo: payload.personalInfo,
      experience: payload.experience,
      education: payload.education,
      skills: payload.skills,
      suggestions: [
        "🚀 Add quantified metrics to your achievements (e.g., 'Increased sales by 25%')",
        "💡 Highlight leadership and cross-functional collaboration",
        "⭐ Use action verbs to start each bullet point",
        "📊 Include specific technologies and tools you've used",
        "🎯 Tailor your experience to match job requirements"
      ],
    };
  }

  try {
    const systemPrompt = `You are an expert resume coach. Analyze the resume data and provide:\n1. Enhanced descriptions with quantified achievements\n2. Improved skill presentations\n3. 5 specific suggestions for improvement\nReturn JSON with the same structure plus a 'suggestions' array.`;

    const resp = await client.responses.create({
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      input: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Enhance this resume data: ${JSON.stringify(payload)}` }
      ],
      temperature: 0.7,
      max_output_tokens: 1200
    });

    const text = resp.output_text || (resp.output && resp.output[0] && resp.output[0].content && resp.output[0].content.map(c=>c.text||c?.parts?.join('')||'').join('')) || '';
    try {
      return JSON.parse(text);
    } catch (e) {
      console.warn('[aiService] Could not parse JSON from OpenAI response, returning fallback suggestions', e);
      return {
        personalInfo: payload.personalInfo,
        experience: payload.experience,
        education: payload.education,
        skills: payload.skills,
        suggestions: [
          '⚠️ AI returned non-JSON, review manually',
          '📝 Review your experience descriptions for clarity',
          '🔍 Check for spelling and grammar errors',
          '💼 Ensure your skills match the job requirements',
          '📈 Add measurable results where possible'
        ],
      };
    }
  } catch (error) {
    console.warn("[aiService] OpenAI enhancement failed:", error.message);
    return {
      personalInfo: payload.personalInfo,
      experience: payload.experience,
      education: payload.education,
      skills: payload.skills,
      suggestions: [
        "⚠️ AI enhancement temporarily unavailable",
        "📝 Review your experience descriptions for clarity",
        "🔍 Check for spelling and grammar errors",
        "💼 Ensure your skills match the job requirements",
        "📈 Add measurable results where possible"
      ],
    };
  }
}

export async function generateCoverLetterVariants(payload) {
  if (!client) {
    return {
      professional: `Dear ${payload.companyName || "Hiring Manager"},\n\nI am excited to apply for the ${payload.position || "position"} role. My experience aligns well with your requirements.\n\nSincerely,\n${payload.personalInfo?.fullName || "Your Name"}`,
      enthusiastic: `Hello ${payload.companyName || "Team"}!\n\nThe ${payload.position || "opportunity"} at your company really excites me! I'd love to contribute to your team.\n\nBest regards,\n${payload.personalInfo?.fullName || "Your Name"}`,
      executive: `Dear Leadership Team,\n\nWith my proven track record in driving results, I am prepared to make an immediate impact as ${payload.position || "your next hire"}.\n\nRespectfully,\n${payload.personalInfo?.fullName || "Your Name"}`,
    };
  }

  try {
    const resp = await client.responses.create({
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      input: [
        { role: 'system', content: 'Generate 3 cover letter variants (professional, enthusiastic, executive) based on the provided data. Return as JSON with those keys.' },
        { role: 'user', content: JSON.stringify(payload) }
      ],
      temperature: 0.7,
      max_output_tokens: 1000
    });

    const text = resp.output_text || (resp.output && resp.output[0] && resp.output[0].content && resp.output[0].content.map(c=>c.text||'').join('')) || '';
    try {
      return JSON.parse(text);
    } catch (e) {
      console.warn('[aiService] Cover letter JSON parse failed, returning simple variants', e);
      return {
        professional: `Dear ${payload.companyName || 'Hiring Manager'},\n\nI am excited to apply for the ${payload.position || 'position'} role. My experience aligns well with your requirements.\n\nSincerely,\n${payload.personalInfo?.fullName || 'Your Name'}`,
        enthusiastic: `Hello ${payload.companyName || 'Team'}!\n\nThe ${payload.position || 'opportunity'} at your company really excites me! I'd love to contribute to your team.\n\nBest regards,\n${payload.personalInfo?.fullName || 'Your Name'}`,
        executive: `Dear Leadership Team,\n\nWith my proven track record in driving results, I am prepared to make an immediate impact as ${payload.position || 'your next hire'}.\n\nRespectfully,\n${payload.personalInfo?.fullName || 'Your Name'}`,
      };
    }
  } catch (error) {
    console.warn("[aiService] Cover letter generation failed:", error.message);
    return {
      professional: "AI cover letter generation temporarily unavailable.",
      enthusiastic: "AI cover letter generation temporarily unavailable.",
      executive: "AI cover letter generation temporarily unavailable.",
    };
  }
}

export async function parseResumeWithAI(resumeText) {
  if (!client) {
    console.log("[aiService] OpenAI not configured, using basic parsing");
    return null;
  }

  try {
    const resp = await client.responses.create({
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      input: [
        { role: 'system', content: `Extract structured data from this resume text. Return JSON with:\n{\n  "personalInfo": {"fullName": "", "email": "", "phone": "", "location": ""},\n  "experience": [{"company": "", "position": "", "startDate": "", "endDate": "", "description": ""}],\n  "education": [{"school": "", "degree": "", "field": "", "graduationDate": ""}],\n  "skills": ["skill1", "skill2"]\n}` },
        { role: 'user', content: resumeText }
      ],
      temperature: 0.3,
      max_output_tokens: 1200
    });

    const text = resp.output_text || (resp.output && resp.output[0] && resp.output[0].content && resp.output[0].content.map(c=>c.text||'').join('')) || '';
    try {
      return JSON.parse(text);
    } catch (e) {
      console.warn('[aiService] Resume parsing JSON parse failed:', e);
      return null;
    }
  } catch (error) {
    console.warn("[aiService] Resume parsing failed:", error.message);
    return null;
  }
}
