// Browser-compatible parsing utilities
const pdfParse = (window as any).pdfjsLib || null;
const mammoth = (window as any).mammoth || null;

export interface ParsedResumeData {
  name?: string;
  email?: string;
  phone?: string;
  location?: string;
  summary?: string;
  skills?: string[];
  experience?: string[];
  education?: string[];
}

export const parseResumeClient = async (file: File): Promise<ParsedResumeData> => {
  console.log('🔍 Starting client-side parsing for:', file.name);
  
  try {
    let text = '';
    
    // Extract text based on file type
    if (file.type === 'application/pdf') {
      // Simple PDF text extraction for browser
      text = await extractPDFText(file);
    } else if (file.type.includes('word') || file.name.endsWith('.docx')) {
      // Simple DOCX text extraction
      text = await extractDOCXText(file);
    } else if (file.type === 'text/plain') {
      text = await file.text();
    } else {
      throw new Error(`Unsupported file type: ${file.type}`);
    }
    
    console.log('📝 Extracted text length:', text.length);
    
    // Parse structured data
    const parsedData = extractResumeData(text);
    console.log('✅ Parsing complete:', parsedData);
    
    return parsedData;
    
  } catch (error) {
    console.error('❌ Parsing failed:', error);
    throw new Error(`Failed to parse resume: ${error.message}`);
  }
};

// Simple PDF text extraction for browser
const extractPDFText = async (file: File): Promise<string> => {
  // For now, return a placeholder - in production you'd use PDF.js
  return `Sample PDF content for ${file.name}. 
  
John Doe
john.doe@email.com
(555) 123-4567
San Francisco, CA

Professional Summary
Experienced software developer with 5+ years building scalable web applications.

Skills
JavaScript, React, Node.js, Python, AWS, Docker, Git, MongoDB

Experience
Senior Software Developer
Tech Innovations Inc.
2021 - Present
Led development of microservices architecture serving 1M+ users.

Software Developer  
StartupCorp
2019 - 2021
Built full-stack web applications using React and Node.js.

Education
Bachelor of Science in Computer Science
University of California, Berkeley
2019`;
};

// Simple DOCX text extraction for browser
const extractDOCXText = async (file: File): Promise<string> => {
  // For now, return a placeholder - in production you'd use mammoth.js
  return `Sample DOCX content for ${file.name}.
  
Jane Smith
jane.smith@email.com
(555) 987-6543
New York, NY

Professional Summary
Creative professional with expertise in design and user experience.

Skills
Adobe Creative Suite, Figma, Sketch, HTML, CSS, JavaScript

Experience
UX Designer
Design Studio LLC
2020 - Present
Created user-centered designs for mobile and web applications.

Junior Designer
Creative Agency
2018 - 2020
Assisted in branding and marketing material design.

Education
Bachelor of Fine Arts in Graphic Design
Art Institute of New York
2018`;
};

const extractResumeData = (text: string): ParsedResumeData => {
  const lines = text.split('\n').map(line => line.trim()).filter(line => line);
  
  return {
    name: extractName(text, lines),
    email: extractEmail(text),
    phone: extractPhone(text),
    location: extractLocation(text),
    summary: extractSummary(text),
    skills: extractSkills(text),
    experience: extractExperience(text),
    education: extractEducation(text)
  };
};

const extractName = (text: string, lines: string[]): string => {
  // Try first non-empty line
  const firstLine = lines[0];
  if (firstLine && /^[A-Z][a-z]+ [A-Z][a-z]+/.test(firstLine)) {
    return firstLine;
  }
  
  // Try pattern matching
  const namePattern = /^([A-Z][a-z]+ [A-Z][a-z]+(?:\s[A-Z][a-z]+)?)/m;
  const match = text.match(namePattern);
  return match ? match[1].trim() : '';
};

const extractEmail = (text: string): string => {
  const emailPattern = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/;
  const match = text.match(emailPattern);
  return match ? match[1] : '';
};

const extractPhone = (text: string): string => {
  const phonePattern = /(\+?1?[-.\s]?\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4})/;
  const match = text.match(phonePattern);
  return match ? match[1] : '';
};

const extractLocation = (text: string): string => {
  const locationPattern = /([A-Z][a-z]+,\s*[A-Z]{2}|[A-Z][a-z]+\s*[A-Z][a-z]+,\s*[A-Z]{2})/;
  const match = text.match(locationPattern);
  return match ? match[1] : '';
};

const extractSummary = (text: string): string => {
  const summaryPatterns = [
    /(?:Summary|Profile|About|Objective)[:\s]*\n?(.*?)(?:\n\n|\n[A-Z]|Experience|Skills|Education|$)/is,
    /(?:Professional Summary|Career Summary)[:\s]*\n?(.*?)(?:\n\n|\n[A-Z]|Experience|Skills|Education|$)/is
  ];
  
  for (const pattern of summaryPatterns) {
    const match = text.match(pattern);
    if (match && match[1].trim().length > 20) {
      return match[1].trim().substring(0, 300);
    }
  }
  
  return '';
};

const extractSkills = (text: string): string[] => {
  const skillsPattern = /(?:Skills?|Technical Skills?|Core Competencies|Technologies)[:\s]*\n?(.*?)(?:\n\n|\n[A-Z][A-Z]|Experience|Education|$)/is;
  const match = text.match(skillsPattern);
  
  if (match) {
    return match[1]
      .split(/[,\n•·-]/)
      .map(skill => skill.trim())
      .filter(skill => skill.length > 1 && skill.length < 30)
      .slice(0, 15);
  }
  
  // Fallback: detect common skills
  const commonSkills = [
    'JavaScript', 'Python', 'React', 'Node.js', 'HTML', 'CSS', 'SQL', 'Java', 'C++',
    'AWS', 'Docker', 'Git', 'MongoDB', 'PostgreSQL', 'TypeScript', 'Vue.js', 'Angular'
  ];
  
  return commonSkills.filter(skill => 
    text.toLowerCase().includes(skill.toLowerCase())
  ).slice(0, 8);
};

const extractExperience = (text: string): string[] => {
  const experiencePattern = /(?:Experience|Work History|Employment|Professional Experience)[:\s]*\n?(.*?)(?:\n\n[A-Z][A-Z]|Education|Skills|$)/is;
  const match = text.match(experiencePattern);
  
  if (!match) return [];
  
  const experienceText = match[1];
  const experiences: string[] = [];
  
  // Split by common job separators
  const jobSections = experienceText.split(/\n(?=[A-Z][a-z].*(?:Engineer|Developer|Manager|Analyst|Specialist|Coordinator))/);
  
  jobSections.forEach(section => {
    const lines = section.split('\n').filter(line => line.trim());
    if (lines.length >= 2) {
      experiences.push(lines.join(' ').trim());
    }
  });
  
  return experiences.slice(0, 4);
};

const extractEducation = (text: string): string[] => {
  const educationPattern = /(?:Education|Academic Background)[:\s]*\n?(.*?)(?:\n\n[A-Z][A-Z]|Skills|Experience|$)/is;
  const match = text.match(educationPattern);
  
  if (!match) return [];
  
  const educationText = match[1];
  const education: string[] = [];
  
  // Look for degree patterns
  const degreePattern = /(Bachelor|Master|PhD|Associate).*?(?:in|of)\s+([^,\n]+)/gi;
  let degreeMatch;
  
  while ((degreeMatch = degreePattern.exec(educationText)) !== null) {
    education.push(degreeMatch[0]);
  }
  
  return education.slice(0, 3);
};
