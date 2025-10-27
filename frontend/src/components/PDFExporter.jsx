import React, { useRef, useState } from 'react';
import { PDFGenerator } from '../utils/pdfGenerator';
import './PDFExporter.css';

const PDFExporter = ({ children, filename = 'resume' }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const contentRef = useRef();

  const handleDownloadPDF = async () => {
    if (!contentRef.current) return;

    setIsGenerating(true);
    setProgress(0);

    try {
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      await PDFGenerator.downloadPDF(contentRef.current, `${filename}.pdf`);

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
      await PDFGenerator.previewPDF(contentRef.current);
    } catch (error) {
      console.error('PDF preview failed:', error);
      alert('Failed to preview PDF. Please try again.');
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
      </div>

      {isGenerating && (
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      )}

      <div ref={contentRef} className="pdf-content">
        {children}
      </div>
    </div>
  );
};

export default PDFExporter;
