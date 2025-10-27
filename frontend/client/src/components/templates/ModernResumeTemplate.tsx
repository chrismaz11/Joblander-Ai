import React from 'react';
import './ModernResumeTemplate.css';

const ModernResumeTemplate = ({ data }) => {
  return (
    <div className="modern-resume">
      <div className="resume-header">
        <div className="header-content">
          <h1 className="name">{data.name || 'Your Name'}</h1>
          <div className="contact-info">
            <span className="email">{data.email || 'your.email @example.com'}</span>
            <span className="phone">{data.phone || '(555) 123-4567'}</span>
          </div>
        </div>
      </div>
      
      <div className="resume-body">
        <div className="left-column">
          <section className="skills-section">
            <h2 className="section-title">Skills</h2>
            <div className="skills-grid">
              {(data.skills || ['Add your skills']).map((skill, index) => (
                <div key={index} className="skill-item">
                  <span className="skill-name">{skill}</span>
                </div>
              ))}
            </div>
          </section>
          
          <section className="education-section">
            <h2 className="section-title">Education</h2>
            <div className="education-item">
              <h3>{data.education?.degree || 'Your Degree'}</h3>
              <p>{data.education?.school || 'Your University'}</p>
              <span className="date">{data.education?.year || '2020-2024'}</span>
            </div>
          </section>
        </div>
        
        <div className="right-column">
          <section className="experience-section">
            <h2 className="section-title">Experience</h2>
            <div className="experience-content">
              {data.experience ? (
                <div className="experience-item">
                  <h3>Professional Experience</h3>
                  <p>{data.experience}</p>
                </div>
              ) : (
                <div className="experience-item">
                  <h3>Your Job Title</h3>
                  <p className="company">Company Name</p>
                  <p className="description">Add your experience details here</p>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ModernResumeTemplate;
