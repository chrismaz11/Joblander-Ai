import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, Eye, FileText } from 'lucide-react';
import { generatePDF, downloadAsHTML } from '@/utils/pdfGenerator';

interface ResumeData {
  personalInfo?: {
    fullName?: string;
    email?: string;
    phone?: string;
    location?: string;
    summary?: string;
  };
  experience?: Array<{
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    description: string;
  }>;
  education?: Array<{
    institution: string;
    degree: string;
    field: string;
    startDate: string;
    endDate: string;
  }>;
  skills?: string[];
}

const templates = [
  { id: 'modern', name: 'Modern Professional', category: 'Professional' },
  { id: 'minimalist', name: 'Clean Minimalist', category: 'Professional' },
  { id: 'tech', name: 'Tech Developer', category: 'Technical' },
  { id: 'executive', name: 'Executive Leader', category: 'Executive' },
  { id: 'creative', name: 'Creative Professional', category: 'Creative' }
];

interface EnhancedTemplateSelectorProps {
  parsedData?: ResumeData | null;
  onTemplateSelect?: (templateId: string) => void;
}

const EnhancedTemplateSelector: React.FC<EnhancedTemplateSelectorProps> = ({ 
  parsedData, 
  onTemplateSelect 
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState('modern');

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    onTemplateSelect?.(templateId);
  };

  const handleDownloadPDF = async () => {
    try {
      await generatePDF('resume-preview', `${parsedData?.personalInfo?.fullName || 'resume'}.pdf`);
    } catch (error) {
      console.error('PDF generation failed:', error);
      // Fallback to HTML download
      downloadAsHTML('resume-preview', `${parsedData?.personalInfo?.fullName || 'resume'}.html`);
    }
  };

  const handleDownloadHTML = () => {
    downloadAsHTML('resume-preview', `${parsedData?.personalInfo?.fullName || 'resume'}.html`);
  };

  return (
    <div className="space-y-6">
      {/* Template Selection */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Choose Template</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {templates.map(template => (
            <Card
              key={template.id}
              className={`p-3 cursor-pointer transition-all hover:shadow-md ${
                selectedTemplate === template.id ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => handleTemplateSelect(template.id)}
            >
              <div className="aspect-[3/4] bg-muted rounded flex items-center justify-center text-2xl mb-2">
                📄
              </div>
              <h4 className="font-medium text-sm">{template.name}</h4>
              <Badge variant="secondary" className="text-xs mt-1">
                {template.category}
              </Badge>
            </Card>
          ))}
        </div>
      </div>

      {/* PDF Controls */}
      <div className="flex gap-2">
        <Button onClick={handleDownloadPDF} className="flex-1">
          <Download className="h-4 w-4 mr-2" />
          Download PDF
        </Button>
        <Button onClick={handleDownloadHTML} variant="outline" className="flex-1">
          <FileText className="h-4 w-4 mr-2" />
          Download HTML
        </Button>
        <Button variant="outline">
          <Eye className="h-4 w-4 mr-2" />
          Preview
        </Button>
      </div>

      {/* Resume Preview */}
      <Card className="p-6">
        <div id="resume-preview" className="bg-white border rounded-lg p-8 min-h-[600px]">
          <div className="space-y-6">
            {/* Header */}
            <div className="text-center border-b pb-4">
              <h1 className="text-2xl font-bold">
                {parsedData?.personalInfo?.fullName || 'Your Name'}
              </h1>
              <div className="flex justify-center gap-4 text-sm text-gray-600 mt-2">
                <span>{parsedData?.personalInfo?.email || 'email@example.com'}</span>
                <span>{parsedData?.personalInfo?.phone || '(555) 123-4567'}</span>
                <span>{parsedData?.personalInfo?.location || 'City, State'}</span>
              </div>
            </div>

            {/* Summary */}
            {parsedData?.personalInfo?.summary && (
              <div>
                <h2 className="text-lg font-semibold mb-2 text-blue-600">Professional Summary</h2>
                <p className="text-sm leading-relaxed">
                  {parsedData.personalInfo.summary}
                </p>
              </div>
            )}

            {/* Skills */}
            {parsedData?.skills && parsedData.skills.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold mb-2 text-blue-600">Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {parsedData.skills.map((skill, index) => (
                    <Badge key={index} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Experience */}
            {parsedData?.experience && parsedData.experience.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold mb-3 text-blue-600">Experience</h2>
                <div className="space-y-4">
                  {parsedData.experience.map((exp, index) => (
                    <div key={index} className="border-l-2 border-blue-500 pl-4">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="font-medium">{exp.position}</h3>
                        <span className="text-sm text-gray-500">
                          {exp.startDate} - {exp.endDate}
                        </span>
                      </div>
                      <p className="text-sm font-medium text-gray-600 mb-2">
                        {exp.company}
                      </p>
                      <p className="text-sm leading-relaxed">
                        {exp.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Education */}
            {parsedData?.education && parsedData.education.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold mb-3 text-blue-600">Education</h2>
                <div className="space-y-3">
                  {parsedData.education.map((edu, index) => (
                    <div key={index}>
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{edu.degree}</h3>
                          <p className="text-sm text-gray-600">
                            {edu.institution} • {edu.field}
                          </p>
                        </div>
                        <span className="text-sm text-gray-500">
                          {edu.startDate} - {edu.endDate}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default EnhancedTemplateSelector;
