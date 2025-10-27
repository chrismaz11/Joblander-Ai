import React, { useState } from 'react';
import FileUploader from './FileUploader';
import EnhancedTemplateSelector from './EnhancedTemplateSelector';
import './ResumeBuilder.css';

const ResumeBuilder = () => {
  const [resumeData, setResumeData] = useState(null);
  const [currentStep, setCurrentStep] = useState('upload');

  const defaultData = {
    name: 'John Doe',
    email: 'john.doe@email.com',
    phone: '(555) 123-4567',
    location: 'San Francisco, CA',
    summary: 'Experienced software developer with 5+ years building scalable web applications.',
    skills: ['JavaScript', 'React', 'Node.js', 'Python', 'AWS', 'Docker'],
    experience: [
      {
        title: 'Senior Software Developer',
        company: 'Tech Innovations Inc.',
        date: '2021 - Present',
        description: 'Led development of microservices architecture serving 1M+ users. Improved system performance by 40% through optimization.'
      },
      {
        title: 'Software Developer',
        company: 'StartupCorp',
        date: '2019 - 2021',
        description: 'Built full-stack web applications using React and Node.js. Collaborated with cross-functional teams to deliver features.'
      }
    ],
    education: [
      {
        degree: 'Bachelor of Science in Computer Science',
        school: 'University of California, Berkeley',
        year: '2019'
      }
    ]
  };

  const handleDataParsed = (parsedData) => {
    console.log('📊 Resume data parsed:', parsedData);
    setResumeData(parsedData);
    setCurrentStep('template');
  };

  const handleSkipUpload = () => {
    setResumeData(defaultData);
    setCurrentStep('template');
  };

  const handleBackToUpload = () => {
    setCurrentStep('upload');
    setResumeData(null);
  };

  return (
    <div className="resume-builder">
      <div className="builder-header">
        <h1>🚀 Job Lander - AI Resume Builder</h1>
        <div className="step-indicator">
          <div className={`step ${currentStep === 'upload' ? 'active' : currentStep === 'template' ? 'completed' : ''}`}>
            <span className="step-number">1</span>
            <span className="step-label">Upload Resume</span>
          </div>
          <div className="step-divider"></div>
          <div className={`step ${currentStep === 'template' ? 'active' : ''}`}>
            <span className="step-number">2</span>
            <span className="step-label">Choose Template</span>
          </div>
        </div>
      </div>

      <div className="builder-content">
        {currentStep === 'upload' && (
          <div className="upload-step">
            <FileUploader onDataParsed={handleDataParsed} />
            <div className="skip-section">
              <p>Don't have a resume to upload?</p>
              <button className="skip-btn" onClick={handleSkipUpload}>
                Start with Sample Data
              </button>
            </div>
          </div>
        )}

        {currentStep === 'template' && resumeData && (
          <div className="template-step">
            <div className="step-header">
              <button className="back-btn" onClick={handleBackToUpload}>
                ← Back to Upload
              </button>
              <h2>Choose Your Template</h2>
            </div>
            <EnhancedTemplateSelector resumeData={resumeData} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeBuilder;
