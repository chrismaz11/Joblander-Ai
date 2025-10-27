import { Link } from "wouter";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Sparkles, FileText, Shield, Search, CheckCircle2, Upload, Wand2, Download, Star, Zap, Eye, TrendingUp } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Hero Background with Gradient */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900" />
        </div>

        {/* Hero Content */}
        <div className="container relative z-20 mx-auto px-4 md:px-6 text-center">
          <Badge className="mb-6 bg-primary/20 text-primary border-primary/30 hover:bg-primary/30" data-testid="badge-hero">
            <Sparkles className="h-3 w-3 mr-1" />
            AI-Powered & Blockchain Verified
          </Badge>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-foreground">
            Build Your Perfect
            <span className="text-primary block">Resume with AI</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Create professional resumes, generate AI-powered cover letters, and verify your credentials with blockchain technology. Land your dream job faster.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button asChild size="lg" className="text-lg px-8 py-6 hover-elevate">
              <Link href="/create">
                <Upload className="h-5 w-5 mr-2" />
                Create Resume
                <ArrowRight className="h-5 w-5 ml-2" />
              </Link>
            </Button>
            
            <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6 hover-elevate">
              <Link href="/templates">
                <Eye className="h-5 w-5 mr-2" />
                Browse Templates
              </Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">50K+</div>
              <div className="text-muted-foreground">Resumes Created</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">95%</div>
              <div className="text-muted-foreground">Success Rate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">24/7</div>
              <div className="text-muted-foreground">AI Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Why Choose Job-Lander?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Powerful AI technology meets professional design to create resumes that get noticed.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="p-6 hover-elevate">
              <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Wand2 className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">AI-Powered</h3>
              <p className="text-muted-foreground">
                Advanced AI analyzes your experience and generates compelling content that highlights your strengths.
              </p>
            </Card>

            <Card className="p-6 hover-elevate">
              <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Blockchain Verified</h3>
              <p className="text-muted-foreground">
                Secure your credentials with blockchain technology for tamper-proof verification.
              </p>
            </Card>

            <Card className="p-6 hover-elevate">
              <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Professional Templates</h3>
              <p className="text-muted-foreground">
                Choose from dozens of ATS-friendly templates designed by industry experts.
              </p>
            </Card>

            <Card className="p-6 hover-elevate">
              <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Search className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Job Matching</h3>
              <p className="text-muted-foreground">
                Find relevant job opportunities with AI-powered matching and application tracking.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Land Your Dream Job?</h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Join thousands of professionals who have successfully landed their dream jobs with Job-Lander.
          </p>
          <Button asChild size="lg" variant="secondary" className="text-lg px-8 py-6">
            <Link href="/create">
              Get Started Free
              <ArrowRight className="h-5 w-5 ml-2" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
