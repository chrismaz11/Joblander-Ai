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
  // Validate file size and type
  if (file.size > 10 * 1024 * 1024) {
    throw new Error('File size too large. Maximum 10MB allowed.');
  }
  
  const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
  if (!allowedTypes.includes(file.type) && !file.name.endsWith('.docx')) {
    throw new Error('Unsupported file type. Only PDF, DOCX, and TXT files are allowed.');
  }
  
  try {
    let text = '';
    
    // Extract text based on file type
    if (file.type === 'application/pdf') {
      text = await extractPDFText(file);
    } else if (file.type.includes('word') || file.name.endsWith('.docx')) {
      text = await extractDOCXText(file);
    } else if (file.type === 'text/plain') {
      text = await file.text();
    } else {
      throw new Error('Unsupported file type');
    }
    
    // Sanitize extracted text
    text = sanitizeText(text);
    
    if (text.length > 50000) {
      text = text.substring(0, 50000);
    }
    
    const parsedData = extractResumeData(text);
    return parsedData;
    
  } catch (error: any) {
    throw new Error('Failed to parse resume: Invalid file format or corrupted file');
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

const sanitizeText = (text: string): string => {
  // Remove potential XSS vectors and normalize
  return text
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: URLs
    .replace(/on\w+\s*=/gi, '') // Remove event handlers
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '') // Remove control characters
    .trim();
};

const extractName = (text: string, lines: string[]): string => {
  const firstLine = lines[0];
  if (firstLine && /^[A-Za-z][a-z]+ [A-Za-z][a-z]+/.test(firstLine) && firstLine.length < 50) {
    return sanitizeText(firstLine);
  }
  
  const namePattern = /^([A-Za-z][a-z]+ [A-Za-z][a-z]+(?:\s[A-Za-z][a-z]+)?)/m;
  const match = text.match(namePattern);
  return match ? sanitizeText(match[1].trim().substring(0, 50)) : '';
};

const extractEmail = (text: string): string => {
  const emailPattern = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6})/;
  const match = text.match(emailPattern);
  const email = match ? match[1] : '';
  return email.length < 100 ? sanitizeText(email) : '';
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
    if (match && match[1].trim().length > 20 && match[1].trim().length < 1000) {
      return sanitizeText(match[1].trim().substring(0, 300));
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
      .map(skill => sanitizeText(skill.trim()))
      .filter(skill => skill.length > 1 && skill.length < 30 && /^[A-Za-z0-9\s.+-]+$/.test(skill))
      .slice(0, 15);
  }
  
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
  
  const jobSections = experienceText.split(/\n(?=[A-Z][a-z].*(?:Engineer|Developer|Manager|Analyst|Specialist|Coordinator))/);
  
  jobSections.forEach(section => {
    const lines = section.split('\n').filter(line => line.trim());
    if (lines.length >= 2) {
      const experience = sanitizeText(lines.join(' ').trim());
      if (experience.length < 500) {
        experiences.push(experience);
      }
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
  
  const degreePattern = /(Bachelor|Master|PhD|Associate).*?(?:in|of)\s+([^,\n]+)/gi;
  let degreeMatch;
  
  while ((degreeMatch = degreePattern.exec(educationText)) !== null && education.length < 3) {
    const degree = sanitizeText(degreeMatch[0]);
    if (degree.length < 200) {
      education.push(degree);
    }
  }
  
  return education.slice(0, 3);
};
