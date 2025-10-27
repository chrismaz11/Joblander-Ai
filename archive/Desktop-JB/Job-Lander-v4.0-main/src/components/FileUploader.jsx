import React, { useState, useCallback } from 'react';
import { parseResumeFile } from '../utils/resumeParser';
import './FileUploader.css';

const FileUploader = ({ onDataParsed }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  }, []);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleFileUpload = async (file) => {
    console.log('📁 File selected:', file.name, file.type);
    
    // Validate file type
    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword',
      'text/plain'
    ];
    
    if (!allowedTypes.includes(file.type) && !file.name.endsWith('.docx')) {
      setError('Please upload a PDF, DOCX, or TXT file');
      return;
    }

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB');
      return;
    }

    setIsProcessing(true);
    setError(null);
    setProgress(0);

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 15, 85));
      }, 300);

      const parsedData = await parseResumeFile(file);
      
      clearInterval(progressInterval);
      setProgress(100);
      
      console.log('✅ Parsing successful:', parsedData);
      
      setTimeout(() => {
        onDataParsed(parsedData);
        setIsProcessing(false);
        setProgress(0);
      }, 500);

    } catch (error) {
      console.error('❌ Parsing failed:', error);
      setError(error.message || 'Failed to parse resume. Please try again.');
      setIsProcessing(false);
      setProgress(0);
    }
  };

  return (
    <div className="file-uploader">
      <div className="upload-header">
        <h2>📄 Upload Your Resume</h2>
        <p>Upload your existing resume to get started. We support PDF, DOCX, and TXT files.</p>
      </div>

      <div
        className={`upload-zone ${isDragging ? 'dragging' : ''} ${isProcessing ? 'processing' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {isProcessing ? (
          <div className="processing-state">
            <div className="processing-spinner"></div>
            <h3>Processing your resume...</h3>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${progress}%` }}></div>
            </div>
            <p>{progress}% complete</p>
          </div>
        ) : (
          <div className="upload-content">
            <div className="upload-icon">📁</div>
            <h3>Drag & drop your resume here</h3>
            <p>or</p>
            <label className="upload-button">
              <input
                type="file"
                accept=".pdf,.docx,.doc,.txt"
                onChange={handleFileSelect}
                style={{ display: 'none' }}
              />
              Choose File
            </label>
            <div className="supported-formats">
              <span>Supported formats: PDF, DOCX, TXT</span>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="error-message">
          <span className="error-icon">⚠️</span>
          <span>{error}</span>
          <button onClick={() => setError(null)} className="error-close">✕</button>
        </div>
      )}

      <div className="upload-tips">
        <h4>💡 Tips for better results:</h4>
        <ul>
          <li>Use a well-formatted resume with clear sections</li>
          <li>Ensure text is selectable (not scanned images)</li>
          <li>Include standard sections: Experience, Education, Skills</li>
          <li>Use common job titles and company names</li>
        </ul>
      </div>
    </div>
  );
};

export default FileUploader;
