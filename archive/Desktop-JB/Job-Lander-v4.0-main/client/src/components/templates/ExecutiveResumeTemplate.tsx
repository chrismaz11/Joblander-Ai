import React from 'react';
import './ExecutiveResumeTemplate.css';

const ExecutiveResumeTemplate = ({ data }) => {
  return (
    <div className="executive-resume">
      <div className="executive-header">
        <div className="executive-info">
          <h1 className="executive-name">{data.name || 'Executive Name'}</h1>
          <h2 className="executive-title">{data.title || 'Chief Executive Officer'}</h2>
          <div className="executive-contact">
            <div className="contact-item">
              <span className="label">Email:</span>
              <span>{data.email || 'executive @company.com'}</span>
            </div>
            <div className="contact-item">
              <span className="label">Phone:</span>
              <span>{data.phone || '(555) 123-4567'}</span>
            </div>
            <div className="contact-item">
              <span className="label">LinkedIn:</span>
              <span>{data.linkedin || 'linkedin.com/in/executive'}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="executive-body">
        <section className="executive-summary">
          <h3>Executive Summary</h3>
          <p>{data.summary || 'Accomplished executive with 15+ years of leadership experience driving organizational growth, strategic initiatives, and operational excellence across diverse industries.'}</p>
        </section>
        
        <div className="executive-columns">
          <div className="executive-main">
            <section className="experience-section">
              <h3>Professional Experience</h3>
              <div className="experience-item">
                <h4>Chief Executive Officer</h4>
                <p className="company-name">Fortune 500 Company</p>
                <p className="date-range">2018 - Present</p>
                <ul className="achievements">
                  <li>Led company through 300% revenue growth over 5 years</li>
                  <li>Expanded operations to 15 international markets</li>
                  <li>Implemented digital transformation initiatives</li>
                </ul>
              </div>
            </section>
          </div>
          
          <div className="executive-sidebar">
            <section className="core-competencies">
              <h3>Core Competencies</h3>
              <div className="competency-grid">
                {(data.skills || [
                  'Strategic Leadership',
                  'P&L Management',
                  'Digital Transformation',
                  'Team Building',
                  'Market Expansion',
                  'Operational Excellence'
                ]).map((skill, index) => (
                  <div key={index} className="competency-item">{skill}</div>
                ))}
              </div>
            </section>
            
            <section className="education">
              <h3>Education</h3>
              <div className="education-item">
                <h4>MBA, Strategic Management</h4>
                <p>Harvard Business School</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExecutiveResumeTemplate;
