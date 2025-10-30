import React from 'react';
import './CoverLetterTemplate.css';

const CoverLetterTemplate = ({ data, jobTitle, companyName }) => {
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="cover-letter">
      <header className="cover-header">
        <div className="sender-info">
          <h3>{data.name || 'Your Name'}</h3>
          <p>{data.email || 'your.email @example.com'}</p>
          <p>{data.phone || '(555) 123-4567'}</p>
        </div>
        <div className="date">{currentDate}</div>
      </header>
      
      <div className="recipient-info">
        <p>Dear Hiring Manager,</p>
      </div>
      
      <div className="cover-body">
        <p>
          I am writing to express my strong interest in the {jobTitle || 'position'} 
          at {companyName || 'your company'}. With my background in{' '}
          {data.skills?.[0] || 'technology'} and proven experience in{' '}
          {data.skills?.[1] || 'problem-solving'}, I am confident I would be a 
          valuable addition to your team.
        </p>
        
        <p>My key qualifications include:</p>
        <ul className="qualifications">
          {(data.skills || ['Professional skills', 'Technical expertise', 'Problem-solving abilities'])
            .slice(0, 4)
            .map((skill, index) => (
              <li key={index}>Expertise in {skill}</li>
            ))}
        </ul>
        
        <p>
          I am particularly drawn to this opportunity because it aligns perfectly 
          with my career goals and passion for {data.skills?.[0] || 'technology'}. 
          I would welcome the opportunity to discuss how my skills and experience 
          can contribute to your organization's continued success.
        </p>
        
        <p>
          Thank you for considering my application. I look forward to hearing from you.
        </p>
        
        <div className="signature">
          <p>Sincerely,</p>
          <p className="signature-name">{data.name || 'Your Name'}</p>
        </div>
      </div>
    </div>
  );
};

export default CoverLetterTemplate;
