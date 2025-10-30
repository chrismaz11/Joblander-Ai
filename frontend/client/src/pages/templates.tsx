import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  FileText, 
  Star, 
  Search, 
  Eye, 
  Download, 
  Sparkles, 
  Crown, 
  Check, 
  ArrowLeft,
  Zap,
  Shield,
  ChevronRight
} from 'lucide-react';
import { Link } from 'wouter';
import { PROFESSIONAL_TEMPLATES, TemplateData, renderTemplate } from '@/data/professional-templates';

// Sample data for template preview
const SAMPLE_DATA = {
  personalInfo: {
    fullName: 'Sarah Johnson',
    title: 'Senior Software Engineer',
    email: 'sarah.johnson@email.com',
    phone: '(555) 123-4567',
    location: 'San Francisco, CA',
    linkedin: 'linkedin.com/in/sarahjohnson',
    website: 'sarahjohnson.dev',
    summary: 'Experienced software engineer with 8+ years building scalable web applications. Passionate about clean code, user experience, and leading high-performing teams.'
  },
  experience: [
    {
      id: '1',
      position: 'Senior Software Engineer',
      company: 'TechCorp Inc.',
      startDate: '2020-03',
      endDate: '',
      current: true,
      description: '• Led development of microservices architecture serving 10M+ users\n• Mentored 5 junior developers and improved team productivity by 40%\n• Implemented CI/CD pipelines reducing deployment time by 60%'
    },
    {
      id: '2',
      position: 'Software Engineer',
      company: 'StartupXYZ',
      startDate: '2018-06',
      endDate: '2020-02',
      current: false,
      description: '• Built full-stack web applications using React, Node.js, and PostgreSQL\n• Collaborated with design team to create responsive, accessible user interfaces\n• Optimized database queries improving application performance by 30%'
    }
  ],
  education: [
    {
      id: '1',
      institution: 'Stanford University',
      degree: 'Bachelor of Science',
      field: 'Computer Science',
      startDate: '2014-09',
      endDate: '2018-06',
      current: false
    }
  ],
  skills: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'PostgreSQL', 'AWS', 'Docker', 'GraphQL', 'Git', 'Agile', 'Leadership']
};

export default function Templates() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateData | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  const categories = [
    { id: 'all', name: 'All Templates', count: PROFESSIONAL_TEMPLATES.length },
    { id: 'professional', name: 'Professional', count: PROFESSIONAL_TEMPLATES.filter(t => t.category === 'professional').length },
    { id: 'modern', name: 'Modern', count: PROFESSIONAL_TEMPLATES.filter(t => t.category === 'modern').length },
    { id: 'executive', name: 'Executive', count: PROFESSIONAL_TEMPLATES.filter(t => t.category === 'executive').length },
    { id: 'minimalist', name: 'Minimalist', count: PROFESSIONAL_TEMPLATES.filter(t => t.category === 'minimalist').length },
    { id: 'technical', name: 'Technical', count: PROFESSIONAL_TEMPLATES.filter(t => t.category === 'technical').length },
    { id: 'creative', name: 'Creative', count: PROFESSIONAL_TEMPLATES.filter(t => t.category === 'creative').length }
  ];

  const filteredTemplates = useMemo(() => {
    return PROFESSIONAL_TEMPLATES.filter(template => {
      const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
      const matchesSearch = 
        template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.features.some(feature => feature.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const handlePreview = (template: TemplateData) => {
    setSelectedTemplate(template);
    setPreviewOpen(true);
  };

  const generateTemplatePreview = (template: TemplateData) => {
    const html = renderTemplate(template, SAMPLE_DATA);
    return `
      <html>
        <head>
          <style>${template.css}</style>
          <style>
            body { margin: 0; padding: 20px; background: #f5f5f5; font-family: Inter, sans-serif; }
            .template-container { transform: scale(0.6); transform-origin: top left; }
          </style>
        </head>
        <body>
          <div class="template-container">${html}</div>
        </body>
      </html>
    `;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="nav-clean">
        <div className="nav-content">
          <Link href="/" className="nav-logo">
            Job-Lander
          </Link>
          
          <div className="flex items-center gap-4">
            <Link href="/" className="nav-link">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
          </div>
        </div>
      </nav>

      {/* Header */}
      <section className="section-padding text-center">
        <div className="container-max">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Badge variant="secondary" className="px-3 py-1 text-sm">
              <Crown className="w-3 h-3 mr-1" />
              Professional Templates
            </Badge>
          </div>
          
          <h1 className="heading-5xl mb-4">
            Choose Your Perfect
            <span className="block text-accent">Resume Template</span>
          </h1>
          
          <p className="body-lg max-w-2xl mx-auto mb-8">
            Select from our collection of professionally designed, ATS-optimized resume templates. 
            Each template is crafted to help you stand out and get noticed by hiring managers.
          </p>
          
          {/* Stats */}
          <div className="flex justify-center gap-8 mb-12">
            <div className="text-center">
              <div className="heading-2xl text-accent mb-1">{PROFESSIONAL_TEMPLATES.length}+</div>
              <div className="body-sm">Templates</div>
            </div>
            <div className="text-center">
              <div className="heading-2xl text-accent mb-1">ATS</div>
              <div className="body-sm">Optimized</div>
            </div>
            <div className="text-center">
              <div className="heading-2xl text-accent mb-1">100%</div>
              <div className="body-sm">Customizable</div>
            </div>
          </div>
        </div>
      </section>

      <div className="container-max">
        {/* Search and Filters */}
        <div className="mb-8">
          <div className="relative max-w-md mx-auto mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-clean pl-10"
            />
          </div>

          <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
            <TabsList className="w-full justify-center bg-muted/30 p-1">
              {categories.map(category => (
                <TabsTrigger 
                  key={category.id} 
                  value={category.id}
                  className="data-[state=active]:bg-background"
                >
                  {category.name} ({category.count})
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-16">
          {filteredTemplates.map((template) => (
            <Card key={template.id} className="card-clean group cursor-pointer" onClick={() => handlePreview(template)}>
              {/* Template Preview */}
              <div className="aspect-[8.5/11] bg-muted rounded-lg overflow-hidden relative mb-4">
                <iframe
                  srcDoc={generateTemplatePreview(template)}
                  className="w-full h-full border-none pointer-events-none"
                  title={`Preview of ${template.name}`}
                />
                
                {/* Premium Badge */}
                {template.isPremium && (
                  <div className="absolute top-3 right-3">
                    <Badge className="bg-accent text-accent-foreground">
                      <Star className="w-3 h-3 mr-1 fill-current" />
                      Premium
                    </Badge>
                  </div>
                )}
                
                {/* ATS Badge */}
                {template.atsOptimized && (
                  <div className="absolute top-3 left-3">
                    <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200">
                      <Shield className="w-3 h-3 mr-1" />
                      ATS
                    </Badge>
                  </div>
                )}
                
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-background/90 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                  <Button size="lg" className="btn-primary">
                    <Eye className="w-4 h-4 mr-2" />
                    Preview Template
                  </Button>
                </div>
              </div>
              
              {/* Template Info */}
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <CardTitle className="heading-xl">{template.name}</CardTitle>
                  <Badge variant="outline" className="text-xs shrink-0">
                    {template.category}
                  </Badge>
                </div>
                <CardDescription className="body-sm">
                  {template.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="flex flex-wrap gap-1 mb-4">
                  {template.features.slice(0, 3).map((feature, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {feature}
                    </Badge>
                  ))}
                  {template.features.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{template.features.length - 3} more
                    </Badge>
                  )}
                </div>
                
                <div className="flex gap-2">
                  <Button className="btn-primary flex-1" asChild>
                    <Link href={`/create-resume?template=${template.id}`}>
                      <Zap className="w-4 h-4 mr-2" />
                      Use Template
                    </Link>
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePreview(template);
                    }}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No Results */}
        {filteredTemplates.length === 0 && (
          <div className="text-center py-16">
            <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="heading-xl mb-2">No templates found</h3>
            <p className="body-base text-muted-foreground mb-4">
              Try adjusting your search or filter criteria
            </p>
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>

      {/* Template Preview Modal */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle className="heading-xl">{selectedTemplate?.name}</DialogTitle>
                <p className="body-sm text-muted-foreground mt-1">
                  {selectedTemplate?.description}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {selectedTemplate?.atsOptimized && (
                  <Badge variant="secondary" className="bg-green-100 text-green-700">
                    <Shield className="w-3 h-3 mr-1" />
                    ATS Optimized
                  </Badge>
                )}
                {selectedTemplate?.isPremium && (
                  <Badge className="bg-accent text-accent-foreground">
                    <Star className="w-3 h-3 mr-1 fill-current" />
                    Premium
                  </Badge>
                )}
              </div>
            </div>
          </DialogHeader>
          
          <div className="grid lg:grid-cols-2 gap-6 mt-6">
            {/* Preview */}
            <div className="border rounded-lg overflow-hidden bg-white">
              <div className="p-4 bg-muted text-center text-sm text-muted-foreground">
                Live Preview
              </div>
              <div className="aspect-[8.5/11] overflow-auto">
                {selectedTemplate && (
                  <iframe
                    srcDoc={generateTemplatePreview(selectedTemplate)}
                    className="w-full h-full border-none"
                    title={`Full preview of ${selectedTemplate.name}`}
                  />
                )}
              </div>
            </div>
            
            {/* Details */}
            <div className="space-y-6">
              <div>
                <h4 className="heading-xl mb-3">Features</h4>
                <div className="grid grid-cols-2 gap-2">
                  {selectedTemplate?.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 text-green-500" />
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="heading-xl mb-3">Perfect For</h4>
                <div className="text-sm space-y-1">
                  {selectedTemplate?.category === 'executive' && (
                    <>
                      <p>• Senior-level positions</p>
                      <p>• Leadership roles</p>
                      <p>• C-suite applications</p>
                    </>
                  )}
                  {selectedTemplate?.category === 'technical' && (
                    <>
                      <p>• Software engineers</p>
                      <p>• Technical roles</p>
                      <p>• IT professionals</p>
                    </>
                  )}
                  {selectedTemplate?.category === 'modern' && (
                    <>
                      <p>• Creative professionals</p>
                      <p>• Marketing roles</p>
                      <p>• Design positions</p>
                    </>
                  )}
                  {selectedTemplate?.category === 'minimalist' && (
                    <>
                      <p>• Any industry</p>
                      <p>• Conservative fields</p>
                      <p>• Clean, professional look</p>
                    </>
                  )}
                </div>
              </div>
              
              <div className="flex gap-3 pt-4">
                <Button className="btn-primary flex-1" asChild>
                  <Link href={`/create-resume?template=${selectedTemplate?.id}`}>
                    <Zap className="w-4 h-4 mr-2" />
                    Use This Template
                  </Link>
                </Button>
                <Button variant="outline" size="icon">
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}