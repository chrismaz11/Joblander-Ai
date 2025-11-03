import React from 'react';
import { AIFeaturesShowcase } from '@/components/ai/AIFeaturesShowcase';
import { AIBadge } from '@/components/ai/AIBadge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Brain, Users, Clock, TrendingUp } from 'lucide-react';
import { useLocation } from 'wouter';

const stats = [
  { label: 'Hours Saved Weekly', value: '15+', icon: Clock },
  { label: 'Success Rate Increase', value: '3x', icon: TrendingUp },
  { label: 'Happy Users', value: '10K+', icon: Users },
  { label: 'AI Models Used', value: '5', icon: Brain }
];

export default function AIFeatures() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="container mx-auto py-12 px-4">
        {/* Hero Section */}
        <div className="text-center space-y-6 mb-16">
          <AIBadge variant="feature" size="lg">
            Next-Generation AI Technology
          </AIBadge>
          
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            AI-Powered Job Search Revolution
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Transform your job search with cutting-edge artificial intelligence that works 24/7 
            to help you land your dream job faster than ever before.
          </p>

          <div className="flex items-center justify-center gap-4 pt-4">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
              onClick={() => setLocation('/signup')}
            >
              Start Free Trial
            </Button>
            <Button variant="outline" size="lg" onClick={() => setLocation('/pricing')}>
              View Pricing
            </Button>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="text-center p-6 hover:shadow-lg transition-shadow">
                <CardContent className="space-y-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center mx-auto">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* AI Features Showcase */}
        <AIFeaturesShowcase />

        {/* How It Works Section */}
        <div className="mt-20 space-y-12">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">How Our AI Works</h2>
            <p className="text-xl text-muted-foreground">
              Advanced machine learning algorithms trained on millions of successful job applications
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Analyze Your Profile',
                description: 'AI scans your experience, skills, and career goals to understand your unique value proposition.'
              },
              {
                step: '02', 
                title: 'Match & Optimize',
                description: 'Smart algorithms find relevant opportunities and optimize your applications for maximum impact.'
              },
              {
                step: '03',
                title: 'Track & Improve',
                description: 'Continuous learning from your results to improve future recommendations and success rates.'
              }
            ].map((item, index) => (
              <Card key={index} className="p-6 text-center hover:shadow-lg transition-shadow">
                <CardContent className="space-y-4">
                  <div className="text-4xl font-bold text-purple-500 mb-4">{item.step}</div>
                  <h3 className="text-xl font-semibold">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-20 text-center bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl p-12 text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Experience AI-Powered Job Search?</h2>
          <p className="text-xl opacity-90 mb-8">
            Join thousands of professionals who've accelerated their careers with our AI technology
          </p>
          <div className="flex items-center justify-center gap-4">
            <Button 
              size="lg" 
              variant="secondary"
              onClick={() => setLocation('/signup')}
            >
              Start Your Free Trial
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white text-white hover:bg-white hover:text-purple-500"
              onClick={() => setLocation('/demo')}
            >
              Watch Demo
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}