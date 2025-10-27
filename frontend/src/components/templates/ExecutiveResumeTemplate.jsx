import React from 'react';
import './ExecutiveResumeTemplate.css';

const ExecutiveResumeTemplate = ({ data }) => {
  return (
    <div className="executive-resume">
      <div className="executive-header">
        <div className="header-content">
          <h1 className="executive-name">{data?.name || 'Executive Name'}</h1>
          <p className="executive-title">{data?.title || 'Senior Executive'}</p>
          <div className="executive-contact">
            <span>{data?.email || 'executive@company.com'}</span>
            <span>{data?.phone || '(555) 123-4567'}</span>
            <span>{data?.location || 'City, State'}</span>
          </div>
        </div>
      </div>

      <div className="executive-content">
        <section className="executive-summary">
          <h2>Executive Summary</h2>
          <p>{data?.summary || 'Accomplished executive with proven track record of driving organizational growth and operational excellence.'}</p>
        </section>

        <section className="core-competencies">
          <h2>Core Competencies</h2>
          <div className="competencies-grid">
            {(data?.skills || ['Strategic Planning', 'Team Leadership', 'P&L Management', 'Business Development']).map((skill, index) => (
              <div key={index} className="competency-item">{skill}</div>
            ))}
          </div>
        </section>

        <section className="professional-experience">
          <h2>Professional Experience</h2>
          {(data?.experience || []).map((exp, index) => (
            <div key={index} className="executive-experience-item">
              <div className="experience-header">
                <h3>{exp.title}</h3>
                <span className="experience-date">{exp.date}</span>
              </div>
              <h4>{exp.company}</h4>
              <p>{exp.description}</p>
            </div>
          ))}
        </section>

        <section className="education">
          <h2>Education</h2>
          {(data?.education || []).map((edu, index) => (
            <div key={index} className="education-item">
              <h3>{edu.degree}</h3>
              <p>{edu.school} • {edu.year}</p>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
};

export default ExecutiveResumeTemplate;
