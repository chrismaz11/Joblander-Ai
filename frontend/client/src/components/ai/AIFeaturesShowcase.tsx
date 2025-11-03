import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Brain, FileText, Search, Target, MessageSquare, TrendingUp, Clock, Zap } from 'lucide-react';
import { AIBadge } from './AIBadge';

const aiFeatures = [
  {
    id: 'resume_enhancement',
    title: 'AI Content Enhancement',
    description: 'Enhance your resume content with AI-powered suggestions and industry keywords.',
    icon: FileText,
    benefits: ['Professional content optimization', 'ATS keyword integration', 'Industry-specific language'],
    timeSaving: '2 hours saved per resume',
    tier: 'basic'
  },
  {
    id: 'cover_letters',
    title: 'AI Cover Letter Writing',
    description: 'Generate personalized cover letters that highlight your relevant experience.',
    icon: MessageSquare,
    benefits: ['Personalized content', 'Professional tone', 'Company research'],
    timeSaving: '2 hours saved per letter',
    tier: 'basic'
  },
  {
    id: 'job_matching',
    title: 'Smart Job Matching',
    description: 'AI analyzes your profile and finds the most relevant job opportunities.',
    icon: Search,
    benefits: ['Compatibility scoring', 'Daily alerts', 'Hidden opportunities'],
    timeSaving: '5 hours saved per week',
    tier: 'professional'
  },
  {
    id: 'ats_optimization',
    title: 'ATS Optimization',
    description: 'Ensure your resume passes through Applicant Tracking Systems.',
    icon: Target,
    benefits: ['95% ATS compatibility', 'Keyword optimization', 'Format validation'],
    timeSaving: 'Instant optimization',
    tier: 'professional'
  },
  {
    id: 'interview_prep',
    title: 'AI Interview Prep',
    description: 'Practice with AI-generated questions specific to your target role.',
    icon: Brain,
    benefits: ['Role-specific questions', 'Answer feedback', 'Confidence building'],
    timeSaving: '4 hours saved in prep',
    tier: 'professional'
  },
  {
    id: 'salary_insights',
    title: 'Salary Intelligence',
    description: 'Get AI-powered salary insights and negotiation strategies.',
    icon: TrendingUp,
    benefits: ['Market data analysis', 'Negotiation scripts', 'Compensation benchmarks'],
    timeSaving: 'Maximize earning potential',
    tier: 'professional'
  }
];

interface AIFeaturesShowcaseProps {
  compact?: boolean;
  showTierBadges?: boolean;
}

export function AIFeaturesShowcase({ compact = false, showTierBadges = true }: AIFeaturesShowcaseProps) {
  if (compact) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {aiFeatures.slice(0, 6).map((feature) => {
          const Icon = feature.icon;
          return (
            <Card key={feature.id} className="p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-medium text-sm">{feature.title}</h4>
                  <p className="text-xs text-muted-foreground">{feature.timeSaving}</p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2">
          <Brain className="w-8 h-8 text-purple-500" />
          <h2 className="text-3xl font-bold">Professional Templates + AI Enhancement</h2>
        </div>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Choose from expertly designed templates and let AI enhance your content for maximum impact
        </p>
        <AIBadge variant="feature" size="lg">
          <Zap className="w-4 h-4 mr-1" />
          Powered by Advanced AI
        </AIBadge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {aiFeatures.map((feature) => {
          const Icon = feature.icon;
          return (
            <Card key={feature.id} className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  {showTierBadges && (
                    <Badge variant={feature.tier === 'professional' ? 'default' : 'secondary'} className="text-xs">
                      {feature.tier}
                    </Badge>
                  )}
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2 text-sm font-medium text-green-600">
                  <Clock className="w-4 h-4" />
                  {feature.timeSaving}
                </div>
                
                <div className="space-y-2">
                  {feature.benefits.map((benefit, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                      {benefit}
                    </div>
                  ))}
                </div>
                
                <Button variant="outline" className="w-full mt-4">
                  Learn More
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="text-center bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-8">
        <h3 className="text-2xl font-bold mb-4">Ready to Supercharge Your Job Search?</h3>
        <p className="text-muted-foreground mb-6">
          Join thousands of professionals who've accelerated their careers with AI
        </p>
        <div className="flex items-center justify-center gap-4">
          <Button size="lg" className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600">
            <Zap className="w-4 h-4 mr-2" />
            Start Free Trial
          </Button>
          <Button variant="outline" size="lg">
            View Pricing
          </Button>
        </div>
      </div>
    </div>
  );
}