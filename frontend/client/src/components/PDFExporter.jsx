import React, { useRef, useState } from 'react';
import { PDFGenerator, PDFTemplateConfigs } from '../utils/pdfGenerator.ts';
import './PDFExporter.css';

const PDFExporter = ({ children, templateType = 'modern', filename = 'resume' }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const contentRef = useRef();

  const handleDownloadPDF = async () => {
    if (!contentRef.current) return;

    setIsGenerating(true);
    setProgress(0);

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      const config = PDFTemplateConfigs[templateType] || PDFTemplateConfigs.modern;
      await PDFGenerator.downloadPDF(contentRef.current, `${filename}.pdf`, config);

      clearInterval(progressInterval);
      setProgress(100);
      
      setTimeout(() => {
        setIsGenerating(false);
        setProgress(0);
      }, 1000);

    } catch (error) {
      console.error('PDF generation failed:', error);
      setIsGenerating(false);
      setProgress(0);
      alert('Failed to generate PDF. Please try again.');
    }
  };

  const handlePreviewPDF = async () => {
    if (!contentRef.current) return;

    try {
      const config = PDFTemplateConfigs[templateType] || PDFTemplateConfigs.modern;
      await PDFGenerator.previewPDF(contentRef.current, config);
    } catch (error) {
      console.error('PDF preview failed:', error);
      alert('Failed to preview PDF. Please try again.');
    }
  };

  const handleDownloadMultiple = async () => {
    if (!contentRef.current) return;

    setIsGenerating(true);
    try {
      const formats = await PDFGenerator.generateMultipleFormats(contentRef.current, filename);
      
      // Download all formats
      formats.forEach(format => {
        const url = URL.createObjectURL(format.blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = format.filename;
        a.click();
        URL.revokeObjectURL(url);
      });

    } catch (error) {
      console.error('Multi-format download failed:', error);
      alert('Failed to generate files. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="pdf-exporter">
      <div className="pdf-controls">
        <button 
          className="pdf-btn primary"
          onClick={handleDownloadPDF}
          disabled={isGenerating}
        >
          {isGenerating ? (
            <div className="btn-loading">
              <div className="spinner"></div>
              <span>Generating... {progress}%</span>
            </div>
          ) : (
            <>
              <span className="icon">📥</span>
              Download PDF
            </>
          )}
        </button>

        <button 
          className="pdf-btn secondary"
          onClick={handlePreviewPDF}
          disabled={isGenerating}
        >
          <span className="icon">👁️</span>
          Preview PDF
        </button>

        <button 
          className="pdf-btn tertiary"
          onClick={handleDownloadMultiple}
          disabled={isGenerating}
        >
          <span className="icon">📦</span>
          Download All Formats
        </button>
      </div>

      {isGenerating && (
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      )}

      <div 
        ref={contentRef} 
        className="pdf-content"
        data-template={templateType}
      >
        {children}
      </div>
    </div>
  );
};

export default PDFExporter;
