import React from 'react';
import './MinimalistResumeTemplate.css';

const MinimalistResumeTemplate = ({ data }) => {
  return (
    <div className="minimalist-resume">
      <header className="resume-header-minimal">
        <h1 className="name-minimal">{data.name || 'Your Name'}</h1>
        <div className="contact-minimal">
          <span>{data.email || 'your.email @example.com'}</span>
          <span>{data.phone || '(555) 123-4567'}</span>
        </div>
      </header>
      
      <div className="resume-content-minimal">
        <section className="section-minimal">
          <h2>Professional Summary</h2>
          <p>{data.summary || 'Add your professional summary here'}</p>
        </section>
        
        <section className="section-minimal">
          <h2>Skills</h2>
          <div className="skills-minimal">
            {(data.skills || ['Add your skills']).join(' • ')}
          </div>
        </section>
        
        <section className="section-minimal">
          <h2>Experience</h2>
          <div className="experience-minimal">
            {data.experience || 'Add your experience details here'}
          </div>
        </section>
      </div>
    </div>
  );
};

export default MinimalistResumeTemplate;
