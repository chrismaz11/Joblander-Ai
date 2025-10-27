import React, { useState, useEffect } from 'react';
import { ChromePicker } from 'react-color';
import './TemplateCustomizer.css';

const TemplateCustomizer = ({ onCustomizationChange }) => {
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
    }
  });

  const [activeTab, setActiveTab] = useState('colors');
  const [colorPickerOpen, setColorPickerOpen] = useState(null);

  useEffect(() => {
    onCustomizationChange(customizations);
  }, [customizations, onCustomizationChange]);

  const updateColor = (colorKey, value) => {
    setCustomizations(prev => ({
      ...prev,
      colors: { ...prev.colors, [colorKey]: value }
    }));
  };

  const updateFont = (fontKey, value) => {
    setCustomizations(prev => ({
      ...prev,
      fonts: { ...prev.fonts, [fontKey]: value }
    }));
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
          {['colors', 'fonts'].map(tab => (
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
                onChange={(color) => updateColor('primary', color)}
                label="Primary Color"
              />
              <ColorPicker
                color={customizations.colors.secondary}
                onChange={(color) => updateColor('secondary', color)}
                label="Secondary Color"
              />
              <ColorPicker
                color={customizations.colors.accent}
                onChange={(color) => updateColor('accent', color)}
                label="Accent Color"
              />
              <ColorPicker
                color={customizations.colors.text}
                onChange={(color) => updateColor('text', color)}
                label="Text Color"
              />
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
                onChange={(e) => updateFont('heading', e.target.value)}
                className="font-select"
              >
                <option value="Inter">Inter</option>
                <option value="Roboto">Roboto</option>
                <option value="Poppins">Poppins</option>
                <option value="Times New Roman">Times New Roman</option>
              </select>
            </div>

            <div className="font-section">
              <label>Body Font</label>
              <select
                value={customizations.fonts.body}
                onChange={(e) => updateFont('body', e.target.value)}
                className="font-select"
              >
                <option value="Inter">Inter</option>
                <option value="Roboto">Roboto</option>
                <option value="Poppins">Poppins</option>
                <option value="Times New Roman">Times New Roman</option>
              </select>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TemplateCustomizer;
