import React, { useState, useRef } from 'react';
import TemplateCustomizer from './TemplateCustomizer';
import PDFExporter from './PDFExporter';
import DynamicStyleProvider from './DynamicStyleProvider';
import ModernResumeTemplate from './templates/ModernResumeTemplate';
import MinimalistResumeTemplate from './templates/MinimalistResumeTemplate';
import ExecutiveResumeTemplate from './templates/ExecutiveResumeTemplate';
import CreativeResumeTemplate from './templates/CreativeResumeTemplate';
import TechResumeTemplate from './templates/TechResumeTemplate';
import SalesResumeTemplate from './templates/SalesResumeTemplate';
import AcademicResumeTemplate from './templates/AcademicResumeTemplate';
import './EnhancedTemplateSelector.css';

const EnhancedTemplateSelector = ({ parsedData }) => {
  const [selectedTemplate, setSelectedTemplate] = useState('modern');
  const [documentType, setDocumentType] = useState('resume');
  const [showCustomizer, setShowCustomizer] = useState(false);
  const [customizations, setCustomizations] = useState({});
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  const templates = {
    resume: {
      modern: { component: ModernResumeTemplate, name: 'Modern Professional' },
      minimalist: { component: MinimalistResumeTemplate, name: 'Clean Minimalist' },
      executive: { component: ExecutiveResumeTemplate, name: 'Executive' },
      creative: { component: CreativeResumeTemplate, name: 'Creative Designer' },
      tech: { component: TechResumeTemplate, name: 'Tech Developer' },
      sales: { component: SalesResumeTemplate, name: 'Sales Professional' },
      academic: { component: AcademicResumeTemplate, name: 'Academic/Research' }
    }
  };

  const SelectedTemplate = templates[documentType][selectedTemplate]?.component || ModernResumeTemplate;

  const handleCustomizationChange = (newCustomizations) => {
    setCustomizations(newCustomizations);
  };

  return (
    <div className="enhanced-template-selector">
      <div className="selector-header">
        <div className="template-info">
          <h2>📄 {templates[documentType][selectedTemplate]?.name}</h2>
          <p>Customize and download your professional resume</p>
        </div>
        
        <div className="selector-actions">
          <button
            className={`action-btn ${showCustomizer ? 'active' : ''}`}
            onClick={() => setShowCustomizer(!showCustomizer)}
          >
            🎨 Customize
          </button>
          
          <button
            className={`action-btn ${isPreviewMode ? 'active' : ''}`}
            onClick={() => setIsPreviewMode(!isPreviewMode)}
          >
            👁️ Preview Mode
          </button>
        </div>
      </div>

      <div className={`selector-content ${showCustomizer ? 'with-customizer' : ''}`}>
        {showCustomizer && (
          <div className="customizer-panel">
            <TemplateCustomizer
              templateType={selectedTemplate}
              onCustomizationChange={handleCustomizationChange}
            />
          </div>
        )}

        <div className="template-panel">
          <DynamicStyleProvider
            customizations={customizations}
            templateType={selectedTemplate}
          >
            <PDFExporter
              templateType={selectedTemplate}
              filename={`${parsedData.name || 'resume'}-${selectedTemplate}`}
            >
              <div className={`${selectedTemplate}-resume ${Object.keys(customizations).length > 0 ? 'customized' : ''}`}>
                <SelectedTemplate data={parsedData} />
              </div>
            </PDFExporter>
          </DynamicStyleProvider>
        </div>
      </div>

      {isPreviewMode && (
        <div className="preview-overlay">
          <div className="preview-container">
            <div className="preview-header">
              <h3>📱 Responsive Preview</h3>
              <button onClick={() => setIsPreviewMode(false)}>✕</button>
            </div>
            <div className="preview-devices">
              <div className="device desktop">
                <h4>Desktop</h4>
                <div className="device-frame">
                  <SelectedTemplate data={parsedData} />
                </div>
              </div>
              <div className="device tablet">
                <h4>Tablet</h4>
                <div className="device-frame">
                  <SelectedTemplate data={parsedData} />
                </div>
              </div>
              <div className="device mobile">
                <h4>Mobile</h4>
                <div className="device-frame">
                  <SelectedTemplate data={parsedData} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedTemplateSelector;
