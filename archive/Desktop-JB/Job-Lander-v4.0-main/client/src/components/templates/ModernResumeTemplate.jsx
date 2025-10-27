import React from 'react';
import './templates.css';

const ModernResumeTemplate = ({ data }) => {
  if (!data) return <div className="p-4">Loading...</div>;

  const { name, email, phone, experience, education, skills } = data;

  return (
    <div className="resume-template modern-template">
      <header className="modern-header">
        <h1>{name || 'Your Name'}</h1>
        <p>{email || 'your.email@example.com'} | {phone || '123-456-7890'}</p>
      </header>
      <main className="modern-body">
        <section className="modern-section">
          <h2>Experience</h2>
          {experience && experience.length > 0 ? (
            experience.map((exp, index) => <div key={index} className="modern-item">{exp}</div>)
          ) : (
            <p>No experience provided.</p>
          )}
        </section>
        <section className="modern-section">
          <h2>Education</h2>
          {education && education.length > 0 ? (
            education.map((edu, index) => <div key={index} className="modern-item">{edu}</div>)
          ) : (
            <p>No education provided.</p>
          )}
        </section>
        <section className="modern-section">
          <h2>Skills</h2>
          {skills && skills.length > 0 ? (
            <ul className="modern-skills">
              {skills.map((skill, index) => <li key={index}>{skill}</li>)}
            </ul>
          ) : (
            <p>No skills provided.</p>
          )}
        </section>
      </main>
    </div>
  );
};

export default ModernResumeTemplate;