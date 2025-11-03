import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useTierLimits } from '@/hooks/useTierLimits';
import { TierGate } from '@/components/TierGate';
import { UsageTracker } from '@/components/tier/UsageTracker';
import { WatermarkOverlay } from '@/components/WatermarkOverlay';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, FileText, Download, Eye, Crown, Zap, AlertTriangle, Brain, Sparkles } from 'lucide-react';
import { PDFGenerator } from '@/utils/pdfGenerator';
import { useToast } from '@/hooks/use-toast';
import { TemplateService, type TemplateOption, type ToneOption } from '@/services/templateService';
import { AIBadge } from '@/components/ai/AIBadge';
import { AIProcessingIndicator } from '@/components/ai/AIProcessingIndicator';
import { AITooltip } from '@/components/ai/AITooltip';

export default function LetterGenerator() {
  const { user, hasFeature } = useAuth();
  const { requiresUpgrade, limits, usage } = useTierLimits();
  const { toast } = useToast();
  const [templates, setTemplates] = useState<TemplateOption[]>([]);
  const [template, setTemplate] = useState<string>('');
  const [name, setName] = useState('Alex Doe');
  const [title, setTitle] = useState('Product Manager');
  const [position, setPosition] = useState('Product Manager');
  const [company, setCompany] = useState('Acme Corp');
  const [tone, setTone] = useState('professional');
  const [html, setHtml] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [templatesError, setTemplatesError] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);

  const remainingLetters = limits.coverLettersPerMonth - (usage?.coverLettersThisMonth || 0);
  const isNearLimit = remainingLetters <= 1 && limits.coverLettersPerMonth !== -1;
  const isAtLimit = remainingLetters <= 0 && limits.coverLettersPerMonth !== -1;

  useEffect(() => {
    TemplateService.loadTemplates()
      .then(templates => {
        setTemplates(templates);
        if (templates.length) setTemplate(templates[0].filename);
        setTemplatesError(null);
      })
      .catch(() => {
        setTemplatesError('Failed to load templates. Please refresh the page.');
      });
  }, []);

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    
    if (requiresUpgrade('cover_letters')) {
      setShowUpgradePrompt(true);
      toast({
        title: "🚀 Upgrade to Generate More Letters",
        description: "Unlock unlimited AI-powered cover letters with our Professional plan. Save hours of writing time!",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    setHtml(null);
    try {
      const payload = {
        templateFilename: template,
        resume: { name, title, summary: '' },
        position,
        company,
        tone
      };

      const result = await TemplateService.generateLetter(payload);
      if (result.success && result.html) {
        setHtml(result.html);
        toast({
          title: "Letter Generated",
          description: "Your cover letter has been generated successfully."
        });
      } else {
        throw new Error(result.message || 'Generation failed');
      }
    } catch (err: any) {
      toast({
        title: "Generation Failed",
        description: err?.message || 'Error generating letter. Please try again.',
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }

  async function handleExportPDF() {
    if (!html) return;
    
    if (requiresUpgrade('no_watermark')) {
      toast({
        title: "Upgrade for PDF Export",
        description: "PDF export without watermark requires a Basic plan or higher.",
        variant: "destructive"
      });
      return;
    }

    setIsExporting(true);
    try {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = html;
      tempDiv.style.position = 'absolute';
      tempDiv.style.left = '-9999px';
      document.body.appendChild(tempDiv);

      const options = {
        includeWatermark: !hasFeature('no_watermark'),
        watermark: 'JobLander - Free Version'
      };

      const { blob } = await PDFGenerator.generateFromElement(tempDiv, 'cover-letter.pdf', options);
      PDFGenerator.downloadBlob(blob, 'cover-letter.pdf');
      
      document.body.removeChild(tempDiv);
      toast({
        title: "PDF Downloaded",
        description: "Your cover letter has been exported as PDF."
      });
    } catch (error: any) {
      toast({
        title: "Export Failed",
        description: error?.message || 'Failed to export PDF. Please try again.',
        variant: "destructive"
      });
    } finally {
      setIsExporting(false);
    }
  }

  const canGenerate = hasFeature('cover_letters');
  const showWatermark = !hasFeature('no_watermark');

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Professional Letter Generator
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Create professional cover letters using expert templates with AI-enhanced content
          </p>
          <div className="flex items-center justify-center gap-2">
            <AIBadge variant="feature">
              <Sparkles className="w-3 h-3 mr-1" />
              AI-Powered
            </AIBadge>
            <AITooltip feature="cover_letter">
              <Badge variant="secondary">Saves 2+ Hours</Badge>
            </AITooltip>
            <Badge variant="secondary">ATS-Optimized</Badge>
          </div>
        </div>

        {/* Usage Tracking & Upgrade Prompts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {isNearLimit && !hasFeature('unlimited_cover_letters') && (
              <Alert className="mb-6 border-yellow-200 bg-yellow-50">
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
                <AlertDescription className="text-yellow-800">
                  <strong>Almost at your limit!</strong> You have {remainingLetters} cover letter{remainingLetters !== 1 ? 's' : ''} remaining this month.
                  <Button variant="link" className="p-0 h-auto ml-2 text-yellow-800 underline">
                    Upgrade for unlimited letters →
                  </Button>
                </AlertDescription>
              </Alert>
            )}
            
            {showUpgradePrompt && (
              <Card className="mb-6 border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                      <Crown className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-2">Unlock Unlimited AI Cover Letters</h3>
                      <p className="text-gray-600 mb-4">
                        Stop spending hours writing cover letters. Our AI creates personalized, 
                        professional letters in seconds. Join thousands who've landed their dream jobs!
                      </p>
                      <div className="flex gap-3">
                        <Button className="bg-blue-500 hover:bg-blue-600">
                          <Zap className="w-4 h-4 mr-2" />
                          Upgrade Now - $19.95/month
                        </Button>
                        <Button variant="outline" onClick={() => setShowUpgradePrompt(false)}>
                          Maybe Later
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
          
          <div>
            <UsageTracker />
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form */}
          <Card>
            <CardHeader>
              <CardTitle>Letter Details</CardTitle>
              <CardDescription>Fill in the details for your cover letter</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleGenerate} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Your Name</label>
                    <Input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Your Title</label>
                    <Input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Your current title"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Position</label>
                    <Input
                      value={position}
                      onChange={(e) => setPosition(e.target.value)}
                      placeholder="Position you're applying for"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Company</label>
                    <Input
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder="Company name"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">Template</label>
                  <Select value={template} onValueChange={setTemplate}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select template" />
                    </SelectTrigger>
                    <SelectContent>
                      {templates.map((t) => (
                        <SelectItem key={t.filename} value={t.filename}>
                          {t.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium">Tone</label>
                  <Select value={tone} onValueChange={setTone}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="professional">Professional</SelectItem>
                      <SelectItem value="friendly">Friendly</SelectItem>
                      <SelectItem value="formal">Formal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button type="submit" disabled={loading || !canGenerate} className="w-full">
                  {loading ? (
                    <>
                      <AIProcessingIndicator />
                      <span className="ml-2">Generating...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Generate Letter
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Preview */}
          <Card>
            <CardHeader>
              <CardTitle>Preview</CardTitle>
              <CardDescription>Your generated cover letter will appear here</CardDescription>
            </CardHeader>
            <CardContent>
              {html ? (
                <div className="space-y-4">
                  <div className="border rounded-lg p-4 max-h-96 overflow-y-auto bg-white">
                    {showWatermark && <WatermarkOverlay />}
                    <div dangerouslySetInnerHTML={{ __html: html }} />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleExportPDF} disabled={isExporting} className="flex-1">
                      {isExporting ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Download className="w-4 h-4 mr-2" />
                      )}
                      Export PDF
                    </Button>
                    <Button variant="outline" size="icon">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Generate a letter to see the preview</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}