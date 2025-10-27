import React from 'react';
import './CreativeResumeTemplate.css';

const CreativeResumeTemplate = ({ data }) => {
  return (
    <div className="creative-resume">
      <div className="creative-sidebar">
        <div className="profile-section">
          <div className="avatar-placeholder">
            <span>📸</span>
          </div>
          <h1 className="creative-name">{data?.name || 'Creative Name'}</h1>
          <p className="creative-role">{data?.title || 'Creative Professional'}</p>
        </div>

        <div className="contact-section">
          <h3>Contact</h3>
          <div className="contact-item">
            <span className="icon">📧</span>
            <span>{data?.email || 'creative@email.com'}</span>
          </div>
          <div className="contact-item">
            <span className="icon">📱</span>
            <span>{data?.phone || '(555) 123-4567'}</span>
          </div>
          <div className="contact-item">
            <span className="icon">📍</span>
            <span>{data?.location || 'City, State'}</span>
          </div>
        </div>

        <div className="skills-section">
          <h3>Skills</h3>
          <div className="creative-skills">
            {(data?.skills || ['Design', 'Creativity', 'Adobe Suite', 'Branding']).map((skill, index) => (
              <div key={index} className="skill-bubble">{skill}</div>
            ))}
          </div>
        </div>
      </div>

      <div className="creative-main">
        <section className="about-section">
          <h2>About Me</h2>
          <p>{data?.summary || 'Passionate creative professional with a keen eye for design and innovation.'}</p>
        </section>

        <section className="experience-section">
          <h2>Experience</h2>
          {(data?.experience || []).map((exp, index) => (
            <div key={index} className="creative-experience-item">
              <div className="experience-timeline">
                <div className="timeline-dot"></div>
                <div className="timeline-line"></div>
              </div>
              <div className="experience-content">
                <h3>{exp.title}</h3>
                <h4>{exp.company}</h4>
                <span className="experience-date">{exp.date}</span>
                <p>{exp.description}</p>
              </div>
            </div>
          ))}
        </section>

        <section className="education-section">
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

export default CreativeResumeTemplate;
