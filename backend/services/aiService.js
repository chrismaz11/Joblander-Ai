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
    const systemPrompt = `You are an expert resume coach. Analyze the resume data and provide:
1. Enhanced descriptions with quantified achievements
2. Improved skill presentations
3. 5 specific suggestions for improvement
Return JSON with the same structure plus a 'suggestions' array.`;

    const completion = await client.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: `Enhance this resume data: ${JSON.stringify(payload)}`,
        },
      ],
      temperature: 0.7,
    });

    const response = completion.choices[0].message.content;
    return JSON.parse(response);
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
    const completion = await client.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "Generate 3 cover letter variants (professional, enthusiastic, executive) based on the provided data. Return as JSON with those keys.",
        },
        {
          role: "user",
          content: JSON.stringify(payload),
        },
      ],
    });

    const response = completion.choices[0].message.content;
    return JSON.parse(response);
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
    const completion = await client.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `Extract structured data from this resume text. Return JSON with:
{
  "personalInfo": {"fullName": "", "email": "", "phone": "", "location": ""},
  "experience": [{"company": "", "position": "", "startDate": "", "endDate": "", "description": ""}],
  "education": [{"school": "", "degree": "", "field": "", "graduationDate": ""}],
  "skills": ["skill1", "skill2"]
}`
        },
        {
          role: "user",
          content: resumeText
        }
      ],
      temperature: 0.3,
    });

    const response = completion.choices[0].message.content;
    return JSON.parse(response);
  } catch (error) {
    console.warn("[aiService] Resume parsing failed:", error.message);
    return null;
  }
}
