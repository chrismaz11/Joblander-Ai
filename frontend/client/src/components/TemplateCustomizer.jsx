import React, { useState, useEffect } from 'react';
import { ChromePicker } from 'react-color';
import './TemplateCustomizer.css';

const TemplateCustomizer = ({ templateType, onCustomizationChange }) => {
  const [customizations, setCustomizations] = useState({
    colors: {
      primary: '#667eea',
      secondary: '#764ba2',
      accent: '#e74c3c',
      text: '#2c3e50',
      background: '#ffffff'
    },
    fonts: {
      heading: 'Inter',
      body: 'Inter',
      size: {
        name: '2.5rem',
        heading: '1.4rem',
        body: '1rem'
      }
    },
    layout: {
      spacing: 'normal',
      columns: 'two-column',
      headerStyle: 'gradient',
      borderRadius: '8px'
    },
    sections: {
      showPhoto: false,
      showSummary: true,
      showSkills: true,
      showExperience: true,
      showEducation: true,
      sectionOrder: ['summary', 'experience', 'skills', 'education']
    }
  });

  const [activeTab, setActiveTab] = useState('colors');
  const [colorPickerOpen, setColorPickerOpen] = useState(null);

  useEffect(() => {
    onCustomizationChange(customizations);
  }, [customizations, onCustomizationChange]);

  const updateCustomization = (category, key, value) => {
    setCustomizations(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }));
  };

  const updateNestedCustomization = (category, subCategory, key, value) => {
    setCustomizations(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [subCategory]: {
          ...prev[category][subCategory],
          [key]: value
        }
      }
    }));
  };

  const fontOptions = [
    { name: 'Inter', value: 'Inter, sans-serif' },
    { name: 'Roboto', value: 'Roboto, sans-serif' },
    { name: 'Poppins', value: 'Poppins, sans-serif' },
    { name: 'Times New Roman', value: 'Times New Roman, serif' },
    { name: 'Georgia', value: 'Georgia, serif' },
    { name: 'JetBrains Mono', value: 'JetBrains Mono, monospace' }
  ];

  const layoutOptions = {
    spacing: [
      { name: 'Compact', value: 'compact' },
      { name: 'Normal', value: 'normal' },
      { name: 'Spacious', value: 'spacious' }
    ],
    columns: [
      { name: 'Single Column', value: 'single-column' },
      { name: 'Two Column', value: 'two-column' },
      { name: 'Three Column', value: 'three-column' }
    ],
    headerStyle: [
      { name: 'Gradient', value: 'gradient' },
      { name: 'Solid', value: 'solid' },
      { name: 'Minimal', value: 'minimal' }
    ]
  };

  const ColorPicker = ({ color, onChange, label }) => (
    <div className="color-picker-container">
      <label className="color-label">{label}</label>
      <div 
        className="color-swatch"
        style={{ backgroundColor: color }}
        onClick={() => setColorPickerOpen(colorPickerOpen === label ? null : label)}
      >
        <span className="color-value">{color}</span>
      </div>
      {colorPickerOpen === label && (
        <div className="color-picker-popup">
          <div 
            className="color-picker-overlay"
            onClick={() => setColorPickerOpen(null)}
          />
          <ChromePicker
            color={color}
            onChange={(colorResult) => onChange(colorResult.hex)}
          />
        </div>
      )}
    </div>
  );

  return (
    <div className="template-customizer">
      <div className="customizer-header">
        <h3>🎨 Customize Template</h3>
        <div className="customizer-tabs">
          {['colors', 'fonts', 'layout', 'sections'].map(tab => (
            <button
              key={tab}
              className={`tab ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="customizer-content">
        {activeTab === 'colors' && (
          <div className="colors-panel">
            <h4>Color Scheme</h4>
            <div className="color-grid">
              <ColorPicker
                color={customizations.colors.primary}
                onChange={(color) => updateCustomization('colors', 'primary', color)}
                label="Primary Color"
              />
              <ColorPicker
                color={customizations.colors.secondary}
                onChange={(color) => updateCustomization('colors', 'secondary', color)}
                label="Secondary Color"
              />
              <ColorPicker
                color={customizations.colors.accent}
                onChange={(color) => updateCustomization('colors', 'accent', color)}
                label="Accent Color"
              />
              <ColorPicker
                color={customizations.colors.text}
                onChange={(color) => updateCustomization('colors', 'text', color)}
                label="Text Color"
              />
              <ColorPicker
                color={customizations.colors.background}
                onChange={(color) => updateCustomization('colors', 'background', color)}
                label="Background"
              />
            </div>

            <div className="preset-colors">
              <h5>Color Presets</h5>
              <div className="preset-grid">
                {[ 
                  { name: 'Professional Blue', colors: { primary: '#3498db', secondary: '#2980b9', accent: '#e74c3c' } },
                  { name: 'Creative Purple', colors: { primary: '#9b59b6', secondary: '#8e44ad', accent: '#f39c12' } },
                  { name: 'Modern Green', colors: { primary: '#27ae60', secondary: '#229954', accent: '#e67e22' } },
                  { name: 'Corporate Gray', colors: { primary: '#34495e', secondary: '#2c3e50', accent: '#e74c3c' } }
                ].map(preset => (
                  <button
                    key={preset.name}
                    className="preset-btn"
                    onClick={() => {
                      Object.entries(preset.colors).forEach(([key, value]) => {
                        updateCustomization('colors', key, value);
                      });
                    }}
                  >
                    <div className="preset-colors-preview">
                      {Object.values(preset.colors).map((color, index) => (
                        <div 
                          key={index}
                          className="preset-color-dot"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                    <span>{preset.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'fonts' && (
          <div className="fonts-panel">
            <h4>Typography</h4>
            
            <div className="font-section">
              <label>Heading Font</label>
              <select
                value={customizations.fonts.heading}
                onChange={(e) => updateCustomization('fonts', 'heading', e.target.value)}
                className="font-select"
              >
                {fontOptions.map(font => (
                  <option key={font.name} value={font.name}>{font.name}</option>
                ))}
              </select>
            </div>

            <div className="font-section">
              <label>Body Font</label>
              <select
                value={customizations.fonts.body}
                onChange={(e) => updateCustomization('fonts', 'body', e.target.value)}
                className="font-select"
              >
                {fontOptions.map(font => (
                  <option key={font.name} value={font.name}>{font.name}</option>
                ))}
              </select>
            </div>

            <div className="font-sizes">
              <h5>Font Sizes</h5>
              <div className="size-controls">
                <div className="size-control">
                  <label>Name Size</label>
                  <input
                    type="range"
                    min="2"
                    max="4"
                    step="0.1"
                    value={parseFloat(customizations.fonts.size.name)}
                    onChange={(e) => updateNestedCustomization('fonts', 'size', 'name', `${e.target.value}rem`)}
                  />
                  <span>{customizations.fonts.size.name}</span>
                </div>
                <div className="size-control">
                  <label>Heading Size</label>
                  <input
                    type="range"
                    min="1"
                    max="2"
                    step="0.1"
                    value={parseFloat(customizations.fonts.size.heading)}
                    onChange={(e) => updateNestedCustomization('fonts', 'size', 'heading', `${e.target.value}rem`)}
                  />
                  <span>{customizations.fonts.size.heading}</span>
                </div>
                <div className="size-control">
                  <label>Body Size</label>
                  <input
                    type="range"
                    min="0.8"
                    max="1.2"
                    step="0.05"
                    value={parseFloat(customizations.fonts.size.body)}
                    onChange={(e) => updateNestedCustomization('fonts', 'size', 'body', `${e.target.value}rem`)}
                  />
                  <span>{customizations.fonts.size.body}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'layout' && (
          <div className="layout-panel">
            <h4>Layout Options</h4>
            
            {Object.entries(layoutOptions).map(([category, options]) => (
              <div key={category} className="layout-section">
                <label>{category.charAt(0).toUpperCase() + category.slice(1)}</label>
                <div className="layout-options">
                  {options.map(option => (
                    <button
                      key={option.value}
                      className={`layout-option ${customizations.layout[category] === option.value ? 'active' : ''}`}
                      onClick={() => updateCustomization('layout', category, option.value)}
                    >
                      {option.name}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            <div className="layout-section">
              <label>Border Radius</label>
              <input
                type="range"
                min="0"
                max="20"
                value={parseInt(customizations.layout.borderRadius)}
                onChange={(e) => updateCustomization('layout', 'borderRadius', `${e.target.value}px`)}
              />
              <span>{customizations.layout.borderRadius}</span>
            </div>
          </div>
        )}

        {activeTab === 'sections' && (
          <div className="sections-panel">
            <h4>Section Settings</h4>
            
            <div className="section-toggles">
              {Object.entries(customizations.sections).filter(([key]) => key !== 'sectionOrder').map(([key, value]) => (
                <div key={key} className="section-toggle">
                  <label className="toggle-label">
                    <input
                      type="checkbox"
                      checked={value}
                      onChange={(e) => updateCustomization('sections', key, e.target.checked)}
                    />
                    <span className="toggle-slider"></span>
                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                  </label>
                </div>
              ))}
            </div>

            <div className="section-order">
              <h5>Section Order</h5>
              <div className="sortable-sections">
                {customizations.sections.sectionOrder.map((section, index) => (
                  <div key={section} className="sortable-section">
                    <span className="section-name">{section.charAt(0).toUpperCase() + section.slice(1)}</span>
                    <div className="section-controls">
                      <button
                        onClick={() => {
                          const newOrder = [...customizations.sections.sectionOrder];
                          if (index > 0) {
                            [newOrder[index], newOrder[index - 1]] = [newOrder[index - 1], newOrder[index]];
                            updateCustomization('sections', 'sectionOrder', newOrder);
                          }
                        }}
                        disabled={index === 0}
                      >
                        ↑
                      </button>
                      <button
                        onClick={() => {
                          const newOrder = [...customizations.sections.sectionOrder];
                          if (index < newOrder.length - 1) {
                            [newOrder[index], newOrder[index + 1]] = [newOrder[index + 1], newOrder[index]];
                            updateCustomization('sections', 'sectionOrder', newOrder);
                          }
                        }}
                        disabled={index === customizations.sections.sectionOrder.length - 1}
                      >
                        ↓
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="customizer-actions">
        <button 
          className="reset-btn"
          onClick={() => {
            setCustomizations({
              colors: {
                primary: '#667eea',
                secondary: '#764ba2',
                accent: '#e74c3c',
                text: '#2c3e50',
                background: '#ffffff'
              },
              fonts: {
                heading: 'Inter',
                body: 'Inter',
                size: {
                  name: '2.5rem',
                  heading: '1.4rem',
                  body: '1rem'
                }
              },
              layout: {
                spacing: 'normal',
                columns: 'two-column',
                headerStyle: 'gradient',
                borderRadius: '8px'
              },
              sections: {
                showPhoto: false,
                showSummary: true,
                showSkills: true,
                showExperience: true,
                showEducation: true,
                sectionOrder: ['summary', 'experience', 'skills', 'education']
              }
            });
          }}
        >
          🔄 Reset to Default
        </button>
        
        <button 
          className="save-preset-btn"
          onClick={() => {
            const presetName = prompt('Enter preset name:');
            if (presetName) {
              localStorage.setItem(`template-preset-${presetName}`, JSON.stringify(customizations));
              alert('Preset saved!');
            }
          }}
        >
          💾 Save as Preset
        </button>
      </div>
    </div>
  );
};

export default TemplateCustomizer;
