import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient, apiRequest } from '@/lib/queryClient';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Download, Copy, Globe, Eye, Palette, Type, Layout } from 'lucide-react';
import PortfolioPreview from '@/components/PortfolioPreview';
import ThemeCustomizer from '@/components/ThemeCustomizer';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Resume } from '@shared/schema';

interface ThemeOption {
  id: string;
  name: string;
  preview?: {
    primaryColor: string;
    backgroundColor: string;
  };
}

interface FontOption {
  id: string;
  name: string;
  family?: string;
}

interface LayoutOption {
  id: 'sidebar' | 'centered' | 'full-width';
  name: string;
  description?: string;
}

interface PortfolioOptions {
  theme: string;
  font: string;
  layout: 'sidebar' | 'centered' | 'full-width';
  includeContactForm?: boolean;
  includeAnalytics?: boolean;
}

interface ExportPackage {
  files: { name: string; content: string }[];
  instructions: string;
}

export default function Portfolio() {
  const { toast } = useToast();
  const [selectedResumeId, setSelectedResumeId] = useState<string>('');
  const [portfolioOptions, setPortfolioOptions] = useState<PortfolioOptions>({
    theme: 'professionalBlue',
    font: 'Inter',
    layout: 'centered',
    includeContactForm: false,
    includeAnalytics: false
  });
  const [showInstructions, setShowInstructions] = useState(false);
  const [exportData, setExportData] = useState<ExportPackage | null>(null);

  // Fetch user's resumes
  const { data: resumes = [], isLoading: resumesLoading } = useQuery<Resume[]>({
    queryKey: ['/api/resumes'],
    enabled: true,
    initialData: [],
  });

  // Fetch available themes
  const { data: themes = [] } = useQuery<ThemeOption[]>({
    queryKey: ['/api/portfolio/themes'],
    queryFn: async () => {
      try {
        const response = await fetch('/api/portfolio/themes', { credentials: 'include' });
        if (!response.ok) return [];
        const payload = await response.json();
        return Array.isArray(payload) ? payload : [];
      } catch (error) {
        console.error('Failed to fetch themes:', error);
        return [];
      }
    },
    initialData: [],
  });

  // Fetch available fonts
  const { data: fonts = [] } = useQuery<FontOption[]>({
    queryKey: ['/api/portfolio/fonts'],
    queryFn: async () => {
      try {
        const response = await fetch('/api/portfolio/fonts', { credentials: 'include' });
        if (!response.ok) return [];
        const payload = await response.json();
        return Array.isArray(payload) ? payload : [];
      } catch (error) {
        console.error('Failed to fetch fonts:', error);
        return [];
      }
    },
    initialData: [],
  });

  // Fetch available layouts
  const { data: layouts = [] } = useQuery<LayoutOption[]>({
    queryKey: ['/api/portfolio/layouts'],
    queryFn: async () => {
      try {
        const response = await fetch('/api/portfolio/layouts', { credentials: 'include' });
        if (!response.ok) return [];
        const payload = await response.json();
        return Array.isArray(payload) ? payload : [];
      } catch (error) {
        console.error('Failed to fetch layouts:', error);
        return [];
      }
    },
    initialData: [],
  });

  // Generate portfolio mutation
  const generatePortfolioMutation = useMutation({
    mutationFn: (data: { resumeId: string; options: PortfolioOptions }) =>
      apiRequest('POST', '/api/generate-portfolio', data),
    onSuccess: () => {
      toast({
        title: 'Portfolio Generated',
        description: 'Your portfolio has been generated successfully!'
      });
    },
    onError: (error) => {
      toast({
        title: 'Generation Failed',
        description: error.message,
        variant: 'destructive'
      });
    }
  });

  // Export portfolio mutation
  const exportPortfolioMutation = useMutation({
    mutationFn: (data: { resumeId: string; options: PortfolioOptions }) =>
      apiRequest('POST', '/api/portfolio/export', data),
    onSuccess: (data: ExportPackage) => {
      setExportData(data);
      setShowInstructions(true);
      toast({
        title: 'Export Ready',
        description: 'Your portfolio is ready for deployment!'
      });
    },
    onError: (error) => {
      toast({
        title: 'Export Failed',
        description: error.message,
        variant: 'destructive'
      });
    }
  });

  const handleDownloadHTML = () => {
    if (!exportData) return;
    
    const htmlFile = exportData.files.find(f => f.name === 'index.html');
    if (htmlFile) {
      const blob = new Blob([htmlFile.content], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'portfolio.html';
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const handleDownloadPackage = () => {
    if (!exportData) return;
    
    // Create a simple text file with all files concatenated (for demo)
    // In production, you'd use JSZip or similar to create a proper zip
    let packageContent = '';
    exportData.files.forEach(file => {
      packageContent += `\n=== ${file.name} ===\n${file.content}\n`;
    });
    
    const blob = new Blob([packageContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'portfolio-package.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyInstructions = () => {
    if (!exportData) return;
    
    navigator.clipboard.writeText(exportData.instructions).then(() => {
      toast({
        title: 'Copied!',
        description: 'Deployment instructions copied to clipboard'
      });
    });
  };

  const handleCopyFile = (content: string, fileName: string) => {
    navigator.clipboard.writeText(content).then(() => {
      toast({
        title: 'Copied!',
        description: `${fileName} content copied to clipboard`
      });
    });
  };

  if (resumesLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Portfolio Generator</h1>
        <p className="text-muted-foreground">
          Create a stunning portfolio website from your resume data
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Customization Panel */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Resume Selection
              </CardTitle>
              <CardDescription>Choose which resume to build from</CardDescription>
            </CardHeader>
            <CardContent>
              <Select
                value={selectedResumeId}
                onValueChange={setSelectedResumeId}
                data-testid="select-resume"
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a resume" />
                </SelectTrigger>
                <SelectContent>
                  {resumes?.map(resume => (
                    <SelectItem key={resume.id} value={resume.id}>
                      {resume.personalInfo.fullName} - {new Date(resume.createdAt!).toLocaleDateString()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {selectedResumeId && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Palette className="h-5 w-5" />
                    Theme
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ThemeCustomizer
                    options={portfolioOptions}
                    onChange={setPortfolioOptions}
                    themes={themes || []}
                    fonts={fonts || []}
                    layouts={layouts || []}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Additional Options</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="contact-form" className="cursor-pointer">
                      Include Contact Form
                    </Label>
                    <Switch
                      id="contact-form"
                      checked={portfolioOptions.includeContactForm}
                      onCheckedChange={(checked) =>
                        setPortfolioOptions(prev => ({
                          ...prev,
                          includeContactForm: checked
                        }))
                      }
                      data-testid="switch-contact-form"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="analytics" className="cursor-pointer">
                      Include Analytics
                    </Label>
                    <Switch
                      id="analytics"
                      checked={portfolioOptions.includeAnalytics}
                      onCheckedChange={(checked) =>
                        setPortfolioOptions(prev => ({
                          ...prev,
                          includeAnalytics: checked
                        }))
                      }
                      data-testid="switch-analytics"
                    />
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-2">
                <Button
                  className="w-full"
                  onClick={() => exportPortfolioMutation.mutate({
                    resumeId: selectedResumeId,
                    options: portfolioOptions
                  })}
                  disabled={exportPortfolioMutation.isPending}
                  data-testid="button-export"
                >
                  {exportPortfolioMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating Export...
                    </>
                  ) : (
                    <>
                      <Download className="mr-2 h-4 w-4" />
                      Export for Deployment
                    </>
                  )}
                </Button>
                {exportData && (
                  <Button
                    variant="secondary"
                    className="w-full"
                    onClick={() => setShowInstructions(true)}
                    data-testid="button-view-instructions"
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    View Deployment Instructions
                  </Button>
                )}
              </div>
            </>
          )}
        </div>

        {/* Preview Panel */}
        <div className="lg:col-span-2">
          {selectedResumeId ? (
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Live Preview
                </CardTitle>
                <CardDescription>
                  See how your portfolio will look
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <PortfolioPreview
                  resumeId={selectedResumeId}
                  options={portfolioOptions}
                />
              </CardContent>
            </Card>
          ) : (
            <Card className="h-[600px] flex items-center justify-center">
              <CardContent className="text-center">
                <Globe className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">
                  Select a resume to preview your portfolio
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Deployment Instructions Dialog */}
      <Dialog open={showInstructions} onOpenChange={setShowInstructions}>
        <DialogContent className="max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Deployment Package Ready!</DialogTitle>
            <DialogDescription>
              Your portfolio is ready for deployment. Follow the instructions below.
            </DialogDescription>
          </DialogHeader>
          <Tabs defaultValue="instructions" className="mt-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="instructions">Instructions</TabsTrigger>
              <TabsTrigger value="files">Files</TabsTrigger>
              <TabsTrigger value="download">Download</TabsTrigger>
            </TabsList>
            <TabsContent value="instructions">
              <ScrollArea className="h-[400px] w-full rounded-md border p-4">
                <pre className="whitespace-pre-wrap text-sm">
                  {exportData?.instructions || 'Loading instructions...'}
                </pre>
              </ScrollArea>
              <Button
                className="mt-4"
                onClick={handleCopyInstructions}
                data-testid="button-copy-instructions"
              >
                <Copy className="mr-2 h-4 w-4" />
                Copy Instructions
              </Button>
            </TabsContent>
            <TabsContent value="files">
              <ScrollArea className="h-[400px] w-full">
                <div className="space-y-2 p-4">
                  {exportData?.files.map((file, index) => (
                    <Card key={index}>
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-sm">{file.name}</CardTitle>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleCopyFile(file.content, file.name)}
                            data-testid={`button-copy-${file.name}`}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <pre className="text-xs overflow-hidden text-ellipsis whitespace-nowrap">
                          {file.content.substring(0, 100)}...
                        </pre>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>
            <TabsContent value="download">
              <div className="space-y-4 p-4">
                <Button
                  className="w-full"
                  onClick={handleDownloadHTML}
                  data-testid="button-download-html"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download Portfolio HTML
                </Button>
                <Button
                  variant="secondary"
                  className="w-full"
                  onClick={handleDownloadPackage}
                  data-testid="button-download-package"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download Complete Package
                </Button>
                <p className="text-sm text-muted-foreground text-center">
                  Download all files needed for deployment including portfolio, 
                  configuration, and documentation.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  );
}
