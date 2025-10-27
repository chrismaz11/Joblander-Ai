import React, { useState } from 'react';
import ModernResumeTemplate from './templates/ModernResumeTemplate';
import MinimalistResumeTemplate from './templates/MinimalistResumeTemplate';
import CoverLetterTemplate from './templates/CoverLetterTemplate';

const TemplateSelector = ({ parsedData }) => {
  const [selectedTemplate, setSelectedTemplate] = useState('modern');
  const [documentType, setDocumentType] = useState('resume');

  const templates = {
    resume: {
      modern: ModernResumeTemplate,
      minimalist: MinimalistResumeTemplate,
    },
    coverLetter: {
      professional: CoverLetterTemplate,
    }
  };

  const SelectedTemplate = templates[documentType][selectedTemplate];

  return (
    <div className="template-selector">
      <div className="controls">
        <div className="document-type-selector">
          <button 
            className={documentType === 'resume' ? 'active' : ''}
            onClick={() => setDocumentType('resume')}
          >
            Resume
          </button>
          <button 
            className={documentType === 'coverLetter' ? 'active' : ''}
            onClick={() => setDocumentType('coverLetter')}
          >
            Cover Letter
          </button>
        </div>
        
        {documentType === 'resume' && (
          <div className="template-options">
            <button 
              className={selectedTemplate === 'modern' ? 'active' : ''}
              onClick={() => setSelectedTemplate('modern')}
            >
              Modern
            </button>
            <button 
              className={selectedTemplate === 'minimalist' ? 'active' : ''}
              onClick={() => setSelectedTemplate('minimalist')}
            >
              Minimalist
            </button>
          </div>
        )}
      </div>
      
      <div className="template-preview">
        <SelectedTemplate data={parsedData} />
      </div>
    </div>
  );
};

export default TemplateSelector;
