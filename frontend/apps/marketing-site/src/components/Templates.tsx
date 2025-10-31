import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { FileText, Download, Eye, Star, Sparkles } from 'lucide-react';
import { ProfessionalTemplate } from './resume-templates/ProfessionalTemplate';
import { ModernTemplate } from './resume-templates/ModernTemplate';
import { MinimalTemplate } from './resume-templates/MinimalTemplate';
import { CreativeTemplate } from './resume-templates/CreativeTemplate';
import { TechnicalTemplate } from './resume-templates/TechnicalTemplate';
import { ExecutiveTemplate } from './resume-templates/ExecutiveTemplate';
import { AcademicTemplate } from './resume-templates/AcademicTemplate';
import { BoldTemplate } from './resume-templates/BoldTemplate';
import { ElegantTemplate } from './resume-templates/ElegantTemplate';
import { CompactTemplate } from './resume-templates/CompactTemplate';

interface Template {
  id: string;
  name: string;
  category: string;
  component: React.ComponentType<any>;
  popular?: boolean;
  downloads?: number;
  description: string;
}

export function Templates() {
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const resumeTemplates: Template[] = [
    {
      id: 'professional',
      name: 'Professional',
      category: 'Classic',
      component: ProfessionalTemplate,
      popular: true,
      downloads: 2450,
      description: 'Clean, traditional format perfect for corporate roles',
    },
    {
      id: 'modern',
      name: 'Modern',
      category: 'Contemporary',
      component: ModernTemplate,
      popular: true,
      downloads: 3120,
      description: 'Eye-catching sidebar design with gradient accents',
    },
    {
      id: 'minimal',
      name: 'Minimal',
      category: 'Simple',
      component: MinimalTemplate,
      popular: false,
      downloads: 1890,
      description: 'Ultra-clean design focusing on content',
    },
    {
      id: 'creative',
      name: 'Creative',
      category: 'Designer',
      component: CreativeTemplate,
      popular: false,
      downloads: 1650,
      description: 'Bold and colorful for creative professionals',
    },
    {
      id: 'technical',
      name: 'Technical',
      category: 'Developer',
      component: TechnicalTemplate,
      popular: true,
      downloads: 2780,
      description: 'Terminal-inspired design for tech roles',
    },
    {
      id: 'executive',
      name: 'Executive',
      category: 'Leadership',
      component: ExecutiveTemplate,
      popular: true,
      downloads: 2340,
      description: 'Sophisticated design for C-level and senior roles',
    },
    {
      id: 'academic',
      name: 'Academic',
      category: 'Research',
      component: AcademicTemplate,
      popular: false,
      downloads: 1120,
      description: 'Publication-focused for researchers and professors',
    },
    {
      id: 'bold',
      name: 'Bold',
      category: 'Impactful',
      component: BoldTemplate,
      popular: false,
      downloads: 1580,
      description: 'Strong visual hierarchy with high contrast',
    },
    {
      id: 'elegant',
      name: 'Elegant',
      category: 'Refined',
      component: ElegantTemplate,
      popular: true,
      downloads: 2210,
      description: 'Sophisticated sidebar layout with serif typography',
    },
    {
      id: 'compact',
      name: 'Compact',
      category: 'Efficient',
      component: CompactTemplate,
      popular: false,
      downloads: 1450,
      description: 'Maximizes content with space-efficient layout',
    },
  ];

  const coverLetterTemplates = [
    { id: 1, name: 'General Application', category: 'Standard', downloads: 1250 },
    { id: 2, name: 'Career Change', category: 'Specialized', downloads: 890 },
    { id: 3, name: 'Tech Industry', category: 'Industry', downloads: 2100 },
    { id: 4, name: 'Executive Level', category: 'Senior', downloads: 456 },
    { id: 5, name: 'Startup Focused', category: 'Industry', downloads: 1340 },
    { id: 6, name: 'Internship', category: 'Entry Level', downloads: 980 },
  ];

  const handlePreview = (template: Template) => {
    setPreviewTemplate(template);
  };

  const handleUseTemplate = (templateId: string) => {
    // In production, this would navigate to the resume builder with the selected template
    console.log('Using template:', templateId);
  };

  const handleDownload = (template: Template) => {
    // In production, this would generate a PDF and download it
    console.log('Downloading template:', template.id);
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-gray-900 dark:text-white mb-2">Resume & Cover Letter Templates</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Professional templates designed to get you hired. All templates are ATS-friendly.
        </p>
      </div>

      <Tabs defaultValue="resumes">
        <TabsList className="mb-6">
          <TabsTrigger value="resumes">
            Resume Templates ({resumeTemplates.length})
          </TabsTrigger>
          <TabsTrigger value="coverletters">
            Cover Letters ({coverLetterTemplates.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="resumes">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resumeTemplates.map((template) => (
              <Card key={template.id} className="overflow-hidden hover:shadow-xl transition-shadow">
                {/* Template Preview Thumbnail */}
                <div className="relative bg-gray-100 dark:bg-gray-800 aspect-[8.5/11] overflow-hidden cursor-pointer group"
                     onClick={() => handlePreview(template)}>
                  <div className="scale-[0.2] origin-top-left w-[500%] h-[500%]">
                    <template.component isDark={isDarkMode} />
                  </div>
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                    <Eye className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  {template.popular && (
                    <div className="absolute top-3 right-3">
                      <Badge className="bg-yellow-500 text-white border-0">
                        <Star className="w-3 h-3 mr-1 fill-white" />
                        Popular
                      </Badge>
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-gray-900 dark:text-white mb-1">{template.name}</h3>
                      <Badge variant="outline" className="text-xs">
                        {template.category}
                      </Badge>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                    {template.description}
                  </p>

                  <div className="flex items-center gap-2 text-gray-500 dark:text-gray-500 text-xs mb-4">
                    <Download className="w-3 h-3" />
                    <span>{template.downloads?.toLocaleString()} downloads</span>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => handlePreview(template)}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Preview
                    </Button>
                    <Button 
                      size="sm" 
                      className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600"
                      onClick={() => handleUseTemplate(template.id)}
                    >
                      Use Template
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="coverletters">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {coverLetterTemplates.map((template) => (
              <Card key={template.id} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <Badge variant="outline">{template.category}</Badge>
                  <FileText className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
                
                <h3 className="text-gray-900 dark:text-white mb-2">{template.name}</h3>
                <p className="text-gray-500 dark:text-gray-500 mb-4 flex items-center gap-1">
                  <Download className="w-3 h-3" />
                  {template.downloads} downloads
                </p>
                
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Eye className="w-4 h-4 mr-2" />
                    Preview
                  </Button>
                  <Button size="sm" className="flex-1">
                    Use Template
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* AI Template Generator CTA */}
      <Card className="p-6 mt-8 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/10 dark:to-purple-900/10 border-blue-200 dark:border-blue-800">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-gray-900 dark:text-white mb-2">Need a custom template?</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Our AI can generate a personalized template based on your industry, experience level, and target role. 
              Get a unique design that stands out from the crowd.
            </p>
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600">
              <Sparkles className="w-4 h-4 mr-2" />
              Generate Custom Template
            </Button>
          </div>
        </div>
      </Card>

      {/* Preview Dialog */}
      <Dialog open={!!previewTemplate} onOpenChange={() => setPreviewTemplate(null)}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle>{previewTemplate?.name} Template</DialogTitle>
                <DialogDescription>
                  {previewTemplate?.description}
                </DialogDescription>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsDarkMode(!isDarkMode)}
                >
                  {isDarkMode ? '☀️ Light' : '🌙 Dark'}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => previewTemplate && handleDownload(previewTemplate)}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download PDF
                </Button>
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-blue-600 to-purple-600"
                  onClick={() => previewTemplate && handleUseTemplate(previewTemplate.id)}
                >
                  Use This Template
                </Button>
              </div>
            </div>
          </DialogHeader>
          
          <div className="mt-4 bg-gray-100 dark:bg-gray-900 p-8 rounded-lg overflow-auto">
            <div className="flex justify-center">
              {previewTemplate && (
                <div className="transform scale-75 origin-top">
                  <previewTemplate.component isDark={isDarkMode} />
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Template Tips */}
      <Card className="p-6 mt-6">
        <h3 className="text-gray-900 dark:text-white mb-4">💡 Template Selection Tips</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex gap-3">
            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-blue-600 dark:text-blue-400">1</span>
            </div>
            <div>
              <h4 className="text-gray-900 dark:text-white mb-1">Match Your Industry</h4>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Use Professional/Minimal for corporate, Creative for design roles, Technical for developer positions
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-purple-600 dark:text-purple-400">2</span>
            </div>
            <div>
              <h4 className="text-gray-900 dark:text-white mb-1">ATS-Friendly</h4>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                All templates are optimized for Applicant Tracking Systems to ensure your resume gets seen
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-green-600 dark:text-green-400">3</span>
            </div>
            <div>
              <h4 className="text-gray-900 dark:text-white mb-1">Customize Colors</h4>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Each template supports light/dark modes and custom color schemes
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-orange-600 dark:text-orange-400">4</span>
            </div>
            <div>
              <h4 className="text-gray-900 dark:text-white mb-1">Export Options</h4>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Download as PDF, DOCX, or share a live link with recruiters
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
