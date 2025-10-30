import { Link } from "wouter";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Sparkles, FileText, Shield, Search, CheckCircle2, Upload, Wand2, Download, Star, Zap, Eye, TrendingUp } from "lucide-react";
import heroImage from "@assets/stock_images/modern_office_desk_w_94f20872.jpg";
import { getTemplateImage } from "@/lib/templateImages";
import { useQuery } from "@tanstack/react-query";

interface Template {
  id: string;
  name: string;
  category: string;
  description?: string;
  thumbnailUrl?: string;
  isPremium?: string;
}

export default function Home() {
  const [hoveredTemplate, setHoveredTemplate] = useState<string | null>(null);

  const { data: templatesData = [] } = useQuery<Template[]>({
    queryKey: ["templates", "home-featured"],
    queryFn: async () => {
      try {
        const response = await fetch("/api/templates?limit=6", {
          credentials: "include",
        });
        if (!response.ok) {
          return [];
        }
        const payload = await response.json();
        if (Array.isArray(payload)) {
          return payload;
        }
        if (Array.isArray(payload?.data)) {
          return payload.data as Template[];
        }
        return [];
      } catch (error) {
        console.error("Failed to fetch featured templates:", error);
        return [];
      }
    },
    initialData: [],
  });

  // Get featured templates (first 6 from different categories)
  const featuredTemplates = templatesData.slice(0, 6);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Hero Background Image with Dark Overlay */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background z-10" />
          <img
            src={heroImage}
            alt="Professional workspace"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Hero Content */}
        <div className="container relative z-20 mx-auto px-4 md:px-6 text-center">
          <Badge className="mb-6 bg-primary/20 text-primary border-primary/30 hover:bg-primary/30" data-testid="badge-hero">
            <Sparkles className="h-3 w-3 mr-1" />
            AI-Powered & Blockchain Verified
          </Badge>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-foreground">
            Land Your Dream Job with
            <br />
            <span className="text-primary">AI-Powered Precision</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Create professional resumes and cover letters in minutes using AI. 
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild size="lg" className="text-lg px-8 py-6" data-testid="button-create-resume-hero">
              <Link href="/create">
                Create Resume
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button 
              asChild
              size="lg" 
              variant="outline" 
              className="text-lg px-8 py-6 bg-background/60 backdrop-blur-sm border-2"
              data-testid="button-view-templates-hero"
            >
              <Link href="/templates">View Templates</Link>
            </Button>
          </div>

          <div className="mt-12">
            <Badge variant="secondary" className="bg-card/60 backdrop-blur-sm" data-testid="badge-trust">
              <CheckCircle2 className="h-4 w-4 mr-2 text-chart-3" />
              10,000+ Resumes Created
            </Badge>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 md:py-32 bg-card">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Everything You Need to Stand Out
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Powerful features designed to help you create the perfect resume and land your dream job
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-8 hover-elevate transition-all hover:scale-105" data-testid="card-feature-ai">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-4">AI Content Generation</h3>
              <p className="text-muted-foreground">
                Powered by Gemini AI to create compelling resumes and cover letters tailored to your experience and the job you want.
              </p>
            </Card>

            <Card className="p-8 hover-elevate transition-all hover:scale-105" data-testid="card-feature-templates">
              <div className="h-12 w-12 rounded-lg bg-chart-2/10 flex items-center justify-center mb-6">
                <FileText className="h-6 w-6 text-chart-2" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Professional Templates</h3>
              <p className="text-muted-foreground">
              </p>
            </Card>

            <Card className="p-8 hover-elevate transition-all hover:scale-105" data-testid="card-feature-blockchain">
              <div className="h-12 w-12 rounded-lg bg-chart-3/10 flex items-center justify-center mb-6">
                <Shield className="h-6 w-6 text-chart-3" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Blockchain Verification</h3>
              <p className="text-muted-foreground">
                Verify resume authenticity with blockchain technology. Hash your credentials on Polygon Mumbai testnet for tamper-proof verification.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Template Showcase Section */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-chart-2/20 text-chart-2 border-chart-2/30" data-testid="badge-templates-showcase">
              <TrendingUp className="h-3 w-3 mr-1" />
              Featured Templates
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Professional Templates for Every Career
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Choose from 6 distinct categories designed to match your professional style
            </p>
          </div>

          {/* Template Categories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {featuredTemplates.length > 0 ? (
              featuredTemplates.map((template) => {
                const imageUrl = template.thumbnailUrl ? getTemplateImage(template.thumbnailUrl) : null;
                const isHovered = hoveredTemplate === template.id;
                
                return (
                  <Link href={`/templates?category=${template.category}`} key={template.id}>
                    <Card 
                      className="group relative overflow-hidden hover-elevate transition-all duration-300 cursor-pointer"
                      onMouseEnter={() => setHoveredTemplate(template.id)}
                      onMouseLeave={() => setHoveredTemplate(null)}
                      data-testid={`card-featured-template-${template.id}`}
                    >
                      {/* Template Preview */}
                      <div className="aspect-[8.5/11] bg-muted relative overflow-hidden">
                        {imageUrl ? (
                          <img 
                            src={imageUrl}
                            alt={template.name}
                            className={`w-full h-full object-cover transition-transform duration-700 ${isHovered ? 'scale-110' : 'scale-100'}`}
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center bg-card">
                            <FileText className="h-24 w-24 text-muted-foreground/20" />
                          </div>
                        )}
                        
                        {/* Premium Badge */}
                        {template.isPremium === "true" && (
                          <div className="absolute top-3 right-3 z-10">
                            <Badge className="bg-chart-4/90 text-white border-chart-4">
                              <Star className="h-3 w-3 mr-1 fill-current" />
                              Premium
                            </Badge>
                          </div>
                        )}
                        
                        {/* Hover Overlay */}
                        <div className={`absolute inset-0 bg-gradient-to-t from-background to-transparent transition-opacity duration-300 ${isHovered ? 'opacity-90' : 'opacity-0'}`}>
                          <div className="absolute bottom-0 p-6 w-full">
                            <Button className="w-full" size="lg">
                              <Eye className="h-4 w-4 mr-2" />
                              View Template
                            </Button>
                          </div>
                        </div>
                      </div>

                      {/* Template Info */}
                      <div className="p-6">
                        <Badge variant="outline" className="mb-3 text-xs">
                          {template.category}
                        </Badge>
                        <h3 className="font-bold text-lg mb-2">{template.name}</h3>
                        {template.description && (
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {template.description}
                          </p>
                        )}
                      </div>
                    </Card>
                  </Link>
                );
              })
            ) : (
              // Placeholder templates
              [1, 2, 3, 4, 5, 6].map((index) => (
                <Card key={index} className="overflow-hidden">
                  <div className="aspect-[8.5/11] bg-muted animate-pulse" />
                  <div className="p-6">
                    <div className="h-4 bg-muted rounded w-24 mb-3 animate-pulse" />
                    <div className="h-6 bg-muted rounded w-3/4 mb-2 animate-pulse" />
                    <div className="h-4 bg-muted rounded w-full animate-pulse" />
                  </div>
                </Card>
              ))
            )}
          </div>

          <div className="text-center">
            <Button asChild size="lg" variant="outline" className="text-lg">
              <Link href="/templates">
                View All Templates
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              How It Works
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Create your professional resume in 4 simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            {/* Connecting lines for desktop */}
            <div className="hidden md:block absolute top-12 left-0 right-0 h-0.5 bg-border" style={{ width: 'calc(100% - 8rem)', left: '4rem' }} />

            <div className="relative text-center" data-testid="step-upload">
              <div className="h-24 w-24 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-6 text-3xl font-bold relative z-10">
                1
              </div>
              <div className="absolute top-8 left-1/2 -translate-x-1/2 h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
                <Upload className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Upload Resume</h3>
              <p className="text-muted-foreground">
                Upload your existing resume or start from scratch
              </p>
            </div>

            <div className="relative text-center" data-testid="step-ai">
              <div className="h-24 w-24 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-6 text-3xl font-bold relative z-10">
                2
              </div>
              <div className="absolute top-8 left-1/2 -translate-x-1/2 h-12 w-12 rounded-full bg-chart-2/20 flex items-center justify-center">
                <Wand2 className="h-6 w-6 text-chart-2" />
              </div>
              <h3 className="text-xl font-bold mb-3">AI Enhancement</h3>
              <p className="text-muted-foreground">
                Let AI parse and enhance your content automatically
              </p>
            </div>

            <div className="relative text-center" data-testid="step-template">
              <div className="h-24 w-24 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-6 text-3xl font-bold relative z-10">
                3
              </div>
              <div className="absolute top-8 left-1/2 -translate-x-1/2 h-12 w-12 rounded-full bg-chart-4/20 flex items-center justify-center">
                <FileText className="h-6 w-6 text-chart-4" />
              </div>
              <h3 className="text-xl font-bold mb-3">Choose Template</h3>
              <p className="text-muted-foreground">
              </p>
            </div>

            <div className="relative text-center" data-testid="step-download">
              <div className="h-24 w-24 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-6 text-3xl font-bold relative z-10">
                4
              </div>
              <div className="absolute top-8 left-1/2 -translate-x-1/2 h-12 w-12 rounded-full bg-chart-3/20 flex items-center justify-center">
                <Download className="h-6 w-6 text-chart-3" />
              </div>
              <h3 className="text-xl font-bold mb-3">Download & Verify</h3>
              <p className="text-muted-foreground">
                Download PDF and verify on blockchain
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Job Search CTA */}
      <section className="py-20 md:py-32 bg-card">
        <div className="container mx-auto px-4 md:px-6">
          <Card className="p-12 text-center bg-gradient-to-br from-primary/10 to-chart-2/10 border-primary/20">
            <Search className="h-16 w-16 text-primary mx-auto mb-6" />
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Find Your Perfect Job
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Browse thousands of job listings powered by AI matching to find opportunities that fit your skills and experience
            </p>
            <Button asChild size="lg" className="text-lg px-8 py-6" data-testid="button-search-jobs">
              <Link href="/jobs">
                Search Jobs
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </Card>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Ready to Transform Your Job Search?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of professionals who have landed their dream jobs with Job-Lander
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild size="lg" className="text-lg px-8 py-6" data-testid="button-get-started-cta">
              <Link href="/create">
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-lg px-8 py-6" data-testid="button-browse-templates">
              <Link href="/templates">Browse Templates</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card">
        <div className="container mx-auto px-4 md:px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="h-6 w-6 text-primary" />
                <span className="text-xl font-bold">Job-Lander</span>
              </div>
              <p className="text-muted-foreground">
                AI-powered resume builder with blockchain verification
              </p>
            </div>

            <div>
              <h3 className="font-bold mb-4">Product</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/create" className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring rounded-sm" data-testid="link-footer-create">
                    Create Resume
                  </Link>
                </li>
                <li>
                  <Link href="/templates" className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring rounded-sm" data-testid="link-footer-templates">
                    Templates
                  </Link>
                </li>
                <li>
                  <Link href="/verify" className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring rounded-sm" data-testid="link-footer-verify">
                    Verify Resume
                  </Link>
                </li>
                <li>
                  <Link href="/jobs" className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring rounded-sm" data-testid="link-footer-jobs">
                    Find Jobs
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold mb-4">Resources</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>Documentation</li>
                <li>Blog</li>
                <li>Help Center</li>
                <li>Privacy Policy</li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold mb-4">Company</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>About Us</li>
                <li>Careers</li>
                <li>Contact</li>
                <li>Partners</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-muted-foreground">
              © 2025 Job-Lander. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="gap-2" data-testid="badge-footer-blockchain">
                <Shield className="h-3 w-3" />
                Blockchain Verified
              </Badge>
              <Badge variant="outline" className="gap-2" data-testid="badge-footer-ai">
                <Sparkles className="h-3 w-3" />
                AI Powered
              </Badge>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
