
// Simple client-side parsing without external dependencies
export const parseResumeClient = async (file) => {
  console.log('🔍 Client-side parsing started');
  console.log('📄 File:', file.name, file.type);
  
  try {
    let text = '';
    
    if (file.type === 'text/plain') {
      // Parse TXT
      text = await file.text();
      console.log('✅ TXT parsed successfully');
      
    } else if (file.type === 'application/pdf') {
      // For PDF, we'll need server-side parsing or a different approach
      throw new Error('PDF parsing requires server-side processing');
      
    } else if (file.type.includes('word') || file.name.endsWith('.docx')) {
      // For DOCX, we'll need server-side parsing or a different approach
      throw new Error('DOCX parsing requires server-side processing');
      
    } else {
      throw new Error(`Unsupported file type: ${file.type}`);
    }
    
    console.log('📝 Extracted text length:', text.length);
    console.log('📝 First 200 chars:', text.substring(0, 200));
    
    // Parse the text into structured data
    const parsedData = parseTextToData(text);
    console.log('✅ Parsing complete:', parsedData);
    
    return parsedData;
    
  } catch (error) {
    console.error('❌ Client parsing failed:', error);
    throw error;
  }
};

const parseTextToData = (text) => {
  const data = {};
  
  // Name extraction (first line or pattern)
  const namePattern = /^([A-Z][a-z]+ [A-Z][a-z]+(?:\s[A-Z][a-z]+)?)/m;
  const nameMatch = text.match(namePattern);
  data.name = nameMatch ? nameMatch[1].trim() : '';
  
  // Email extraction
  const emailPattern = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/;
  const emailMatch = text.match(emailPattern);
  data.email = emailMatch ? emailMatch[1] : '';
  
  // Phone extraction
  const phonePattern = /(\+?1?[-.\s]?\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4})/;
  const phoneMatch = text.match(phonePattern);
  data.phone = phoneMatch ? phoneMatch[1] : '';
  
  // Skills extraction
  const skillsPattern = /(?:Skills?|Technical Skills?|Core Competencies)[:\s]*\n?(.*?)(?:\n\n|\n[A-Z]|$)/is;
  const skillsMatch = text.match(skillsPattern);
  if (skillsMatch) {
    data.skills = skillsMatch[1]
      .split(/[,\n•·-]/)
      .map(skill => skill.trim())
      .filter(skill => skill.length > 0 && skill.length < 50);
  } else {
    // Fallback: look for common tech skills
    const commonSkills = ['JavaScript', 'Python', 'React', 'Node.js', 'HTML', 'CSS', 'SQL', 'Java', 'C++'];
    data.skills = commonSkills.filter(skill => 
      text.toLowerCase().includes(skill.toLowerCase())
    );
  }
  
  // Experience extraction
  const experiencePattern = /(?:Experience|Work History|Employment)[:\s]*\n?(.*?)(?:\n\n[A-Z]|Education|Skills|$)/is;
  const experienceMatch = text.match(experiencePattern);
  data.experience = experienceMatch ? experienceMatch[1].trim() : '';
  
  return data;
};
