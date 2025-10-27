import React, { useState } from 'react';
import ModernResumeTemplate from './ModernResumeTemplate';
import MinimalistResumeTemplate from './MinimalistResumeTemplate';
import TechResumeTemplate from './TechResumeTemplate';
import './TemplateSelector.css';

const templates = {
  modern: { name: 'Modern Professional', component: ModernResumeTemplate },
  minimalist: { name: 'Clean Minimalist', component: MinimalistResumeTemplate },
  tech: { name: 'Tech Developer', component: TechResumeTemplate }
};

const TemplateSelector = ({ resumeData }) => {
  const [selectedTemplate, setSelectedTemplate] = useState('modern');
  
  const SelectedComponent = templates[selectedTemplate].component;
  
  return (
    <div className="template-selector">
      <div className="template-controls">
        <h2>Choose Your Template</h2>
        <div className="template-grid">
          {Object.entries(templates).map(([key, template]) => (
            <div
              key={key}
              className={`template-option ${selectedTemplate === key ? 'active' : ''}`}
              onClick={() => setSelectedTemplate(key)}
            >
              <div className="template-preview-thumb">{template.name}</div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="template-preview-container">
        <div className="preview-header">
          <h3>{templates[selectedTemplate].name} Template</h3>
          <div className="preview-actions">
            <button className="btn-download">Download PDF</button>
            <button className="btn-edit">Edit Template</button>
          </div>
        </div>
        <div className="template-preview">
          <SelectedComponent data={resumeData} />
        </div>
      </div>
    </div>
  );
};

export default TemplateSelector;
