export const parseResumeData = (text: string) => {
  const data: any = {};
  
  // Name extraction (improved pattern)
  const namePattern = /^\s*([A-Z][a-z]+ [A-Z][a-z]+(?:\s[A-Z][a-z]+)?)/m;
  const nameMatch = text.match(namePattern);
  data.name = nameMatch ? nameMatch[1].trim() : '';
  
  // Email extraction
  const emailPattern = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/; 
  const emailMatch = text.match(emailPattern);
  data.email = emailMatch ? emailMatch[1] : '';
  
  // Phone extraction (multiple formats)
  const phonePattern = /(\+?1?[-.\s]?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4})/; 
  const phoneMatch = text.match(phonePattern);
  data.phone = phoneMatch ? phoneMatch[1] : '';
  
  // Skills extraction (look for common section headers)
  const skillsPattern = /(?:Skills?|Technical Skills?|Core Competencies)[:\s]*\n?(.*?)(?:\n\n|\n[A-Z]|$)/is;
  const skillsMatch = text.match(skillsPattern);
  if (skillsMatch) {
    data.skills = skillsMatch[1]
      .split(/[\n,•·-]/)
      .map(skill => skill.trim())
      .filter(skill => skill.length > 0);
  } else {
    data.skills = [];
  }
  
  // Experience extraction
  const experiencePattern = /(?:Experience|Work History|Employment)[:\s]*\n?(.*?)(?:\n\n[A-Z]|Education|Skills|$)/is;
  const experienceMatch = text.match(experiencePattern);
  data.experience = experienceMatch ? experienceMatch[1].trim() : '';
  
  console.log('Parsed data (regex):', data);
  return data;
};
