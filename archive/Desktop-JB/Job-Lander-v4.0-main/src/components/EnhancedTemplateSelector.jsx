import React, { useState } from 'react';
import ModernResumeTemplate from './templates/ModernResumeTemplate';
import MinimalistResumeTemplate from './templates/MinimalistResumeTemplate';
import TechResumeTemplate from './templates/TechResumeTemplate';
import ExecutiveResumeTemplate from './templates/ExecutiveResumeTemplate';
import CreativeResumeTemplate from './templates/CreativeResumeTemplate';
import TemplateCustomizer from './TemplateCustomizer';
import PDFExporter from './PDFExporter';
import './EnhancedTemplateSelector.css';

const templates = {
  modern: { 
    name: 'Modern Professional', 
    component: ModernResumeTemplate,
    category: 'Professional',
    description: 'Clean and modern design perfect for corporate roles'
  },
  minimalist: { 
    name: 'Clean Minimalist', 
    component: MinimalistResumeTemplate,
    category: 'Professional',
    description: 'Simple and elegant layout focusing on content'
  },
  tech: { 
    name: 'Tech Developer', 
    component: TechResumeTemplate,
    category: 'Technical',
    description: 'Developer-focused template with technical skills emphasis'
  },
  executive: { 
    name: 'Executive Leader', 
    component: ExecutiveResumeTemplate,
    category: 'Executive',
    description: 'Sophisticated design for senior leadership positions'
  },
  creative: { 
    name: 'Creative Professional', 
    component: CreativeResumeTemplate,
    category: 'Creative',
    description: 'Vibrant and artistic design for creative professionals'
  }
};

const EnhancedTemplateSelector = ({ resumeData }) => {
  const [selectedTemplate, setSelectedTemplate] = useState('modern');
  const [showCustomizer, setShowCustomizer] = useState(false);
  const [customizations, setCustomizations] = useState({});
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Professional', 'Technical', 'Executive', 'Creative'];
  
  const filteredTemplates = selectedCategory === 'All' 
    ? templates 
    : Object.fromEntries(
        Object.entries(templates).filter(([_, template]) => 
          template.category === selectedCategory
        )
      );

  const SelectedTemplate = templates[selectedTemplate].component;

  const handleCustomizationChange = (newCustomizations) => {
    setCustomizations(newCustomizations);
  };

  const applyCustomStyles = () => {
    if (!customizations.colors && !customizations.fonts) return {};
    
    return {
      '--primary-color': customizations.colors?.primary || '#667eea',
      '--secondary-color': customizations.colors?.secondary || '#764ba2',
      '--accent-color': customizations.colors?.accent || '#e74c3c',
      '--text-color': customizations.colors?.text || '#2c3e50',
      '--heading-font': customizations.fonts?.heading || 'Inter',
      '--body-font': customizations.fonts?.body || 'Inter'
    };
  };

  return (
    <div className="enhanced-template-selector">
      <div className="selector-header">
        <div className="template-info">
          <h2>📄 {templates[selectedTemplate].name}</h2>
          <p>{templates[selectedTemplate].description}</p>
        </div>
        
        <div className="selector-actions">
          <button
            className={`action-btn ${showCustomizer ? 'active' : ''}`}
            onClick={() => setShowCustomizer(!showCustomizer)}
          >
            🎨 Customize
          </button>
        </div>
      </div>

      <div className="template-categories">
        {categories.map(category => (
          <button
            key={category}
            className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="template-grid">
        {Object.entries(filteredTemplates).map(([key, template]) => (
          <div
            key={key}
            className={`template-card ${selectedTemplate === key ? 'active' : ''}`}
            onClick={() => setSelectedTemplate(key)}
          >
            <div className="template-preview">
              <div className="preview-placeholder">
                {template.name}
              </div>
            </div>
            <div className="template-details">
              <h3>{template.name}</h3>
              <span className="template-category">{template.category}</span>
            </div>
          </div>
        ))}
      </div>

      <div className={`selector-content ${showCustomizer ? 'with-customizer' : ''}`}>
        {showCustomizer && (
          <div className="customizer-panel">
            <TemplateCustomizer onCustomizationChange={handleCustomizationChange} />
          </div>
        )}

        <div className="template-panel">
          <PDFExporter filename={`${resumeData?.name || 'resume'}-${selectedTemplate}`}>
            <div 
              className={`${selectedTemplate}-resume ${Object.keys(customizations).length > 0 ? 'customized' : ''}`}
              style={applyCustomStyles()}
            >
              <SelectedTemplate data={resumeData} />
            </div>
          </PDFExporter>
        </div>
      </div>
    </div>
  );
};

export default EnhancedTemplateSelector;
