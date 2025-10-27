import React from 'react';
import './ModernResumeTemplate.css';

const ModernResumeTemplate = ({ data }) => {
  return (
    <div className="modern-resume">
      <div className="resume-header">
        <h1 className="name">{data?.name || 'Your Name'}</h1>
        <div className="contact-info">
          <span>{data?.email || 'email@example.com'}</span>
          <span>{data?.phone || '(555) 123-4567'}</span>
          <span>{data?.location || 'City, State'}</span>
        </div>
      </div>
      
      <div className="resume-body">
        <div className="left-column">
          <section>
            <h2 className="section-title">Skills</h2>
            <div className="skills-grid">
              {data?.skills?.map((skill, index) => (
                <div key={index} className="skill-item">
                  <span className="skill-name">{skill}</span>
                </div>
              )) || (
                <>
                  <div className="skill-item"><span className="skill-name">JavaScript</span></div>
                  <div className="skill-item"><span className="skill-name">React</span></div>
                  <div className="skill-item"><span className="skill-name">Node.js</span></div>
                </>
              )}
            </div>
          </section>
          
          <section>
            <h2 className="section-title">Education</h2>
            {data?.education?.map((edu, index) => (
              <div key={index} className="education-item">
                <h3>{edu.degree}</h3>
                <p>{edu.school}</p>
                <p>{edu.year}</p>
              </div>
            )) || (
              <div className="education-item">
                <h3>Bachelor's Degree</h3>
                <p>University Name</p>
                <p>2020</p>
              </div>
            )}
          </section>
        </div>
        
        <div className="right-column">
          <section>
            <h2 className="section-title">Experience</h2>
            {data?.experience?.map((exp, index) => (
              <div key={index} className="experience-item">
                <h3>{exp.title}</h3>
                <div className="company">{exp.company}</div>
                <div className="date">{exp.date}</div>
                <div className="experience-description">{exp.description}</div>
              </div>
            )) || (
              <div className="experience-item">
                <h3>Software Developer</h3>
                <div className="company">Tech Company</div>
                <div className="date">2021 - Present</div>
                <div className="experience-description">
                  Developed and maintained web applications using modern technologies.
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default ModernResumeTemplate;
