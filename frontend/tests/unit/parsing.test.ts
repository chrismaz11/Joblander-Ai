import { describe, it, expect } from 'vitest';
import { parseResumeData } from '../../server/services/regexParser';

describe('Resume Parsing (Regex)', () => {
  const sampleResumeText = `
    John Doe
    john.doe@email.com
    (555) 123-4567
    
    Skills:
    JavaScript, React, Node.js, Python
    
    Experience:
    Software Engineer at Tech Company
    Developed web applications using React and Node.js
  `;

  it('should extract name correctly', () => {
    const result = parseResumeData(sampleResumeText);
    expect(result.name).toBe('John Doe');
  });

  it('should extract email correctly', () => {
    const result = parseResumeData(sampleResumeText);
    expect(result.email).toBe('john.doe@email.com');
  });

  it('should extract skills as array', () => {
    const result = parseResumeData(sampleResumeText);
    expect(result.skills).toContain('JavaScript');
    expect(result.skills).toContain('React');
    expect(result.skills).toContain('Node.js');
    expect(result.skills).toContain('Python');
  });

  it('should extract experience section', () => {
    const result = parseResumeData(sampleResumeText);
    expect(result.experience).toContain('Software Engineer at Tech Company');
  });
});