import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';

export const parseResumeFile = async (file) => {
  console.log('🔍 Starting resume parsing for:', file.name);
  
  try {
    let text = '';
    
    // Extract text based on file type
    if (file.type === 'application/pdf') {
      const arrayBuffer = await file.arrayBuffer();
      const data = await pdfParse(arrayBuffer);
      text = data.text;
    } else if (file.type.includes('word') || file.name.endsWith('.docx')) {
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      text = result.value;
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

const extractResumeData = (text) => {
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

const extractName = (text, lines) => {
  // Try first non-empty line
  const firstLine = lines[0];
  if (firstLine && /^[A-Z][a-z]+ [A-Z][a-z]+/.test(firstLine)) {
    return firstLine;
  }
  
  // Try pattern matching
  const namePattern = /^([A-Z][a-z]+ [A-Z][a-z]+(?:\s[A-Z][a-z]+)?)/m;
  const match = text.match(namePattern);
  return match ? match[1].trim() : 'Your Name';
};

const extractEmail = (text) => {
  const emailPattern = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/;
  const match = text.match(emailPattern);
  return match ? match[1] : 'your.email@example.com';
};

const extractPhone = (text) => {
  const phonePattern = /(\+?1?[-.\s]?\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4})/;
  const match = text.match(phonePattern);
  return match ? match[1] : '(555) 123-4567';
};

const extractLocation = (text) => {
  const locationPattern = /([A-Z][a-z]+,\s*[A-Z]{2}|[A-Z][a-z]+\s*[A-Z][a-z]+,\s*[A-Z]{2})/;
  const match = text.match(locationPattern);
  return match ? match[1] : 'City, State';
};

const extractSummary = (text) => {
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
  
  return 'Professional summary highlighting key achievements and expertise.';
};

const extractSkills = (text) => {
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

const extractExperience = (text) => {
  const experiencePattern = /(?:Experience|Work History|Employment|Professional Experience)[:\s]*\n?(.*?)(?:\n\n[A-Z][A-Z]|Education|Skills|$)/is;
  const match = text.match(experiencePattern);
  
  if (!match) return [];
  
  const experienceText = match[1];
  const jobs = [];
  
  // Split by common job separators
  const jobSections = experienceText.split(/\n(?=[A-Z][a-z].*(?:Engineer|Developer|Manager|Analyst|Specialist|Coordinator))/);
  
  jobSections.forEach(section => {
    const lines = section.split('\n').filter(line => line.trim());
    if (lines.length >= 2) {
      const titleLine = lines[0];
      const companyLine = lines[1];
      
      // Extract dates
      const datePattern = /(\d{4}[-\s]*(?:to|-)?\s*(?:\d{4}|Present|Current))/i;
      const dateMatch = section.match(datePattern);
      
      jobs.push({
        title: titleLine.trim(),
        company: companyLine.replace(datePattern, '').trim(),
        date: dateMatch ? dateMatch[1] : '2023 - Present',
        description: lines.slice(2).join(' ').trim() || 'Key responsibilities and achievements.'
      });
    }
  });
  
  return jobs.slice(0, 4);
};

const extractEducation = (text) => {
  const educationPattern = /(?:Education|Academic Background)[:\s]*\n?(.*?)(?:\n\n[A-Z][A-Z]|Skills|Experience|$)/is;
  const match = text.match(educationPattern);
  
  if (!match) return [];
  
  const educationText = match[1];
  const education = [];
  
  // Look for degree patterns
  const degreePattern = /(Bachelor|Master|PhD|Associate).*?(?:in|of)\s+([^,\n]+)/gi;
  let degreeMatch;
  
  while ((degreeMatch = degreePattern.exec(educationText)) !== null) {
    const schoolPattern = new RegExp(`${degreeMatch[0]}.*?([A-Z][^,\n]*(?:University|College|Institute))`);
    const schoolMatch = educationText.match(schoolPattern);
    
    const yearPattern = /(\d{4})/;
    const yearMatch = educationText.match(yearPattern);
    
    education.push({
      degree: degreeMatch[0],
      school: schoolMatch ? schoolMatch[1] : 'University Name',
      year: yearMatch ? yearMatch[1] : '2023'
    });
  }
  
  return education.slice(0, 3);
};
