import pdf from "pdf-parse";
import mammoth from "mammoth";
import { parseResumeWithAI } from "./aiService.js";

export async function parseResumeFile(file) {
  try {
    let text = "";
    
    // Extract text based on file type
    if (file.mimetype === "application/pdf") {
      const pdfData = await pdf(file.buffer);
      text = pdfData.text;
    } else if (
      file.mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      file.mimetype === "application/msword"
    ) {
      const docData = await mammoth.extractRawText({ buffer: file.buffer });
      text = docData.value;
    } else if (file.mimetype === "text/plain") {
      text = file.buffer.toString("utf-8");
    } else {
      throw new Error("Unsupported file type");
    }

    // Try AI parsing first
    const aiParsed = await parseResumeWithAI(text);
    if (aiParsed) {
      return {
        success: true,
        data: aiParsed,
        method: "ai",
        rawText: text
      };
    }

    // Fallback to regex parsing
    const regexParsed = parseWithRegex(text);
    return {
      success: true,
      data: regexParsed,
      method: "regex",
      rawText: text
    };

  } catch (error) {
    console.error("[resumeParser] Parsing failed:", error);
    return {
      success: false,
      error: error.message,
      data: null
    };
  }
}

function parseWithRegex(text) {
  // Basic regex patterns for fallback parsing
  const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/;
  const phoneRegex = /(\+?1[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})/;
  const nameRegex = /^([A-Z][a-z]+ [A-Z][a-z]+)/m;

  // Extract basic info
  const email = text.match(emailRegex)?.[0] || "";
  const phone = text.match(phoneRegex)?.[0] || "";
  const name = text.match(nameRegex)?.[0] || "";

  // Extract skills (look for common skill keywords)
  const skillKeywords = [
    "JavaScript", "Python", "Java", "React", "Node.js", "SQL", "HTML", "CSS",
    "AWS", "Docker", "Git", "TypeScript", "MongoDB", "PostgreSQL", "Express",
    "Vue", "Angular", "PHP", "C++", "C#", "Ruby", "Go", "Kubernetes"
  ];
  
  const skills = skillKeywords.filter(skill => 
    text.toLowerCase().includes(skill.toLowerCase())
  );

  // Basic experience extraction (look for company patterns)
  const experienceSection = text.match(/experience:?\s*(.*?)(?=education|skills|$)/is)?.[1] || "";
  const experience = experienceSection ? [{
    company: "Extracted from resume",
    position: "See resume details",
    description: experienceSection.substring(0, 200) + "..."
  }] : [];

  return {
    personalInfo: {
      fullName: name,
      email: email,
      phone: phone,
      location: ""
    },
    experience: experience,
    education: [],
    skills: skills
  };
}
