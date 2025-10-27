import React from 'react';
import './MinimalistResumeTemplate.css';

const MinimalistResumeTemplate = ({ data }) => {
  return (
    <div className="minimalist-resume">
      <div className="resume-header-minimal">
        <h1 className="name-minimal">{data?.name || 'Your Name'}</h1>
        <div className="contact-minimal">
          <span>{data?.email || 'email@example.com'}</span>
          <span>{data?.phone || '(555) 123-4567'}</span>
          <span>{data?.location || 'City, State'}</span>
        </div>
      </div>
      
      <div className="section-minimal">
        <h2>Summary</h2>
        <div className="summary-minimal">
          {data?.summary || 'Professional summary highlighting key achievements and career objectives.'}
        </div>
      </div>
      
      <div className="section-minimal">
        <h2>Skills</h2>
        <div className="skills-minimal">
          {data?.skills?.join(', ') || 'JavaScript, React, Node.js, Python, SQL, Git'}
        </div>
      </div>
      
      <div className="section-minimal">
        <h2>Experience</h2>
        <div className="experience-minimal">
          {data?.experience?.map(exp => 
            `${exp.title} at ${exp.company} (${exp.date})\n${exp.description}\n\n`
          ).join('') || 
          'Software Developer at Tech Company (2021 - Present)\nDeveloped and maintained web applications using modern technologies.\n\n'}
        </div>
      </div>
    </div>
  );
};

export default MinimalistResumeTemplate;
