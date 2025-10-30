import React from 'react';
import './CreativeResumeTemplate.css';

const CreativeResumeTemplate = ({ data }) => {
  return (
    <div className="creative-resume">
      <div className="creative-header">
        <div className="creative-avatar">
          <div className="avatar-placeholder">
            {(data.name || 'Designer')[0]}
          </div>
        </div>
        <div className="creative-intro">
          <h1 className="creative-name">{data.name || 'Creative Designer'}</h1>
          <p className="creative-tagline">
            {data.tagline || 'Passionate designer creating beautiful, functional experiences'}
          </p>
          <div className="creative-contact">
            <span>{data.email || 'hello @designer.com'}</span>
            <span>{data.portfolio || 'portfolio.designer.com'}</span>
            <span>{data.phone || '(555) 123-4567'}</span>
          </div>
        </div>
      </div>
      
      <div className="creative-content">
        <div className="creative-left">
          <section className="about-section">
            <h3>About Me</h3>
            <p>{data.about || 'I\'m a passionate designer with 5+ years of experience creating digital experiences that delight users and drive business results.'}</p>
          </section>
          
          <section className="skills-section">
            <h3>Skills & Tools</h3>
            <div className="skills-creative">
              {(data.skills || [
                'UI/UX Design',
                'Figma',
                'Adobe Creative Suite',
                'Prototyping',
                'User Research',
                'Branding'
              ]).map((skill, index) => (
                <div key={index} className="skill-bubble">{skill}</div>
              ))}
            </div>
          </section>
        </div>
        
        <div className="creative-right">
          <section className="projects-section">
            <h3>Featured Projects</h3>
            <div className="project-grid">
              <div className="project-card">
                <div className="project-image"></div>
                <h4>E-commerce Redesign</h4>
                <p>Increased conversion by 40%</p>
              </div>
              <div className="project-card">
                <div className="project-image"></div>
                <h4>Mobile App Design</h4>
                <p>50K+ downloads in first month</p>
              </div>
            </div>
          </section>
          
          <section className="experience-creative">
            <h3>Experience</h3>
            <div className="timeline">
              <div className="timeline-item">
                <div className="timeline-dot"></div>
                <div className="timeline-content">
                  <h4>Senior UX Designer</h4>
                  <p>Tech Startup • 2021-Present</p>
                </div>
              </div>
              <div className="timeline-item">
                <div className="timeline-dot"></div>
                <div className="timeline-content">
                  <h4>Product Designer</h4>
                  <p>Design Agency • 2019-2021</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default CreativeResumeTemplate;
