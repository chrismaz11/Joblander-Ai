import React from 'react';
import './TechResumeTemplate.css';

const TechResumeTemplate = ({ data }) => {
  return (
    <div className="tech-resume">
      <div className="tech-header">
        <div className="tech-terminal">
          <div className="terminal-header">
            <div className="terminal-buttons">
              <div className="btn red"></div>
              <div className="btn yellow"></div>
              <div className="btn green"></div>
            </div>
            <div className="terminal-title">resume.js</div>
          </div>
          <div className="terminal-body">
            <div className="code-line">
              <span className="keyword">const</span> <span className="variable">developer</span> = {'{'}
            </div>
            <div className="code-line indent">
              <span className="property">name</span>: <span className="string">"{data?.name || 'Your Name'}"</span>,
            </div>
            <div className="code-line indent">
              <span className="property">email</span>: <span className="string">"{data?.email || 'email@example.com'}"</span>,
            </div>
            <div className="code-line indent">
              <span className="property">location</span>: <span className="string">"{data?.location || 'City, State'}"</span>,
            </div>
            <div className="code-line indent">
              <span className="property">role</span>: <span className="string">"Full Stack Developer"</span>
            </div>
            <div className="code-line">{'}'}</div>
          </div>
        </div>
      </div>
      
      <div className="tech-body">
        <div className="tech-grid">
          <div className="tech-skills">
            <h3>Skills</h3>
            <div className="skill-categories">
              <div className="skill-category">
                <h4>Frontend</h4>
                <div className="tech-tags">
                  <span className="tech-tag frontend">React</span>
                  <span className="tech-tag frontend">JavaScript</span>
                  <span className="tech-tag frontend">TypeScript</span>
                  <span className="tech-tag frontend">CSS</span>
                </div>
              </div>
              <div className="skill-category">
                <h4>Backend</h4>
                <div className="tech-tags">
                  <span className="tech-tag backend">Node.js</span>
                  <span className="tech-tag backend">Python</span>
                  <span className="tech-tag backend">PostgreSQL</span>
                  <span className="tech-tag backend">MongoDB</span>
                </div>
              </div>
              <div className="skill-category">
                <h4>Tools</h4>
                <div className="tech-tags">
                  <span className="tech-tag tools">Git</span>
                  <span className="tech-tag tools">Docker</span>
                  <span className="tech-tag tools">AWS</span>
                  <span className="tech-tag tools">VS Code</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TechResumeTemplate;
