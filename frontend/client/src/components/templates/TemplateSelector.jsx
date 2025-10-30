import React, { useState } from 'react';
import ModernResumeTemplate from './ModernResumeTemplate';
import MinimalistResumeTemplate from './MinimalistResumeTemplate';
import ExecutiveResumeTemplate from './ExecutiveResumeTemplate';
import CreativeResumeTemplate from './CreativeResumeTemplate';
import TechResumeTemplate from './TechResumeTemplate';
import SalesResumeTemplate from './SalesResumeTemplate';
import AcademicResumeTemplate from './AcademicResumeTemplate';
import CoverLetterTemplate from './CoverLetterTemplate';
import PDFExporter from '../PDFExporter'; // Import PDFExporter
import './TemplateSelector.css';

const TemplateSelector = ({ parsedData }) => {
  const [selectedTemplate, setSelectedTemplate] = useState('modern');
  const [documentType, setDocumentType] = useState('resume');

  const templates = {
    resume: {
      modern: { component: ModernResumeTemplate, name: 'Modern Professional', category: 'Professional' },
      minimalist: { component: MinimalistResumeTemplate, name: 'Clean Minimalist', category: 'Professional' },
      executive: { component: ExecutiveResumeTemplate, name: 'Executive', category: 'Professional' },
      creative: { component: CreativeResumeTemplate, name: 'Creative Designer', category: 'Creative' },
      tech: { component: TechResumeTemplate, name: 'Tech Developer', category: 'Tech' },
      sales: { component: SalesResumeTemplate, name: 'Sales Professional', category: 'Business' },
      academic: { component: AcademicResumeTemplate, name: 'Academic/Research', category: 'Academic' }
    },
    coverLetter: {
      professional: { component: CoverLetterTemplate, name: 'Professional', category: 'Professional' }
    }
  };

  const categories = {
    Professional: ['modern', 'minimalist', 'executive'],
    Creative: ['creative'],
    Tech: ['tech'],
    Business: ['sales'],
    Academic: ['academic']
  };

  const SelectedTemplate = templates[documentType][selectedTemplate]?.component || ModernResumeTemplate;

  return (
    <div className="template-selector">
      <div className="template-controls">
        <div className="document-type-tabs">
          <button 
            className={`tab ${documentType === 'resume' ? 'active' : ''}`}
            onClick={() => setDocumentType('resume')}
          >
            📄 Resume Templates
          </button>
          <button 
            className={`tab ${documentType === 'coverLetter' ? 'active' : ''}`}
            onClick={() => setDocumentType('coverLetter')}
          >
            📝 Cover Letters
          </button>
        </div>
        
        {documentType === 'resume' && (
          <div className="template-categories">
            {Object.entries(categories).map(([category, templateIds]) => (
              <div key={category} className="category-section">
                <h4 className="category-title">{category}</h4>
                <div className="template-grid">
                  {templateIds.map(templateId => (
                    <button
                      key={templateId}
                      className={`template-option ${selectedTemplate === templateId ? 'active' : ''}`}
                      onClick={() => setSelectedTemplate(templateId)}
                    >
                      <div className="template-preview-thumb">
                        {templates.resume[templateId].name}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="template-preview-container">
        <div className="preview-header">
          <h3>Preview: {templates[documentType][selectedTemplate]?.name}</h3>
          {/* Removed old download/edit buttons here */}
        </div>
        <PDFExporter
          templateType={selectedTemplate}
          filename={`${parsedData.name || 'resume'}-${selectedTemplate}`}
        >
          <div className="template-preview">
            <SelectedTemplate data={parsedData} />
          </div>
        </PDFExporter>
      </div>
    </div>
  );
};

export default TemplateSelector;
