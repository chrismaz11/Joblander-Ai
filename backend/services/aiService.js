import OpenAI from "openai";

const client =
  process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== ""
    ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
    : null;

export async function enhanceResumeContent(payload) {
  if (!client) {
    return {
      personalInfo: payload.personalInfo,
      experience: payload.experience,
      education: payload.education,
      skills: payload.skills,
      suggestions: [
        "Integrate quantified metrics for each achievement.",
        "Highlight leadership moments and cross-functional impact.",
      ],
    };
  }

  // Placeholder calling out to OpenAI; implement prompt when key is present
  const systemPrompt =
    "You are an executive resume coach. Improve clarity, quantify impact, and suggest enhancements.";
  const content = JSON.stringify(payload);

  const completion = await client.responses.create({
    model: "gpt-4.1-mini",
    input: [
      { role: "system", content: systemPrompt },
      {
        role: "user",
        content: `Enhance the following resume data and return JSON. ${content}`,
      },
    ],
  });

  try {
    const text = completion.output_text ?? "{}";
    return JSON.parse(text);
  } catch (error) {
    console.warn("[aiService] Failed to parse enhancement response", error);
    return {
      personalInfo: payload.personalInfo,
      experience: payload.experience,
      education: payload.education,
      skills: payload.skills,
    };
  }
}

export async function generateCoverLetterVariants(payload) {
  if (!client) {
    return {
      professional: `Dear ${payload.companyName} Hiring Team,\n\nI am excited to apply for the ${payload.position} role. ${payload.personalPitch ?? ""}\n\nSincerely,\n${payload.personalInfo?.fullName ?? "Your Name"}`,
      enthusiastic: `Hello ${payload.companyName} Team!\n\nThe ${payload.position} opportunity resonates deeply with me. ${payload.personalPitch ?? ""}\n\nBest regards,\n${payload.personalInfo?.fullName ?? "Your Name"}`,
      executive: `To the ${payload.companyName} Leadership,\n\nWith a proven record leading high-impact initiatives, I am prepared to accelerate ${payload.companyName}'s ${payload.focusArea ?? "strategic objectives"} as ${payload.position}.\n\nRespectfully,\n${payload.personalInfo?.fullName ?? "Your Name"}`,
    };
  }

  const prompt = [
    {
      role: "system",
      content:
        "Produce three tone variants (professional, enthusiastic, executive) for a cover letter. Return JSON.",
    },
    {
      role: "user",
      content: JSON.stringify(payload),
    },
  ];

  const completion = await client.responses.create({
    model: "gpt-4.1-mini",
    input: prompt,
  });

  try {
    const text = completion.output_text ?? "{}";
    return JSON.parse(text);
  } catch (error) {
    console.warn("[aiService] Failed to parse cover letter response", error);
    return {
      professional: "",
      enthusiastic: "",
      executive: "",
    };
  }
}
