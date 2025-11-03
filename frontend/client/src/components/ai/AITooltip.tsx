import React from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { HelpCircle, Clock, Target, TrendingUp } from 'lucide-react';

interface AITooltipProps {
  feature: 'resume' | 'cover_letter' | 'job_matching' | 'ats_optimization' | 'interview_prep';
  children: React.ReactNode;
}

const tooltipContent = {
  resume: {
    title: 'AI Resume Generation',
    description: 'Our AI analyzes job requirements and creates tailored resumes that pass ATS systems.',
    benefits: ['Saves 2-3 hours per application', 'ATS-optimized content', 'Industry-specific keywords'],
    icon: Target
  },
  cover_letter: {
    title: 'AI Cover Letter Writing',
    description: 'Generate personalized cover letters that highlight your relevant experience.',
    benefits: ['Saves 1-2 hours per letter', 'Personalized content', 'Professional tone'],
    icon: TrendingUp
  },
  job_matching: {
    title: 'AI Job Matching',
    description: 'Smart algorithms find jobs that match your skills and career goals.',
    benefits: ['Find relevant opportunities', 'Compatibility scoring', 'Daily alerts'],
    icon: Target
  },
  ats_optimization: {
    title: 'ATS Optimization',
    description: 'Ensure your resume passes Applicant Tracking Systems used by 95% of companies.',
    benefits: ['Higher application success', 'Keyword optimization', 'Format compliance'],
    icon: TrendingUp
  },
  interview_prep: {
    title: 'AI Interview Prep',
    description: 'Practice with AI-generated questions tailored to your target role.',
    benefits: ['Personalized questions', 'Feedback on answers', 'Confidence building'],
    icon: Target
  }
};

export function AITooltip({ feature, children }: AITooltipProps) {
  const content = tooltipContent[feature];
  const Icon = content.icon;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="inline-flex items-center gap-1 cursor-help">
            {children}
            <HelpCircle className="w-3 h-3 text-muted-foreground hover:text-purple-500 transition-colors" />
          </div>
        </TooltipTrigger>
        <TooltipContent className="max-w-sm p-4 bg-white border shadow-lg">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
                <Icon className="w-4 h-4 text-white" />
              </div>
              <h4 className="font-semibold text-gray-900">{content.title}</h4>
            </div>
            
            <p className="text-sm text-gray-600">{content.description}</p>
            
            <div className="space-y-1">
              <p className="text-xs font-medium text-gray-700">Key Benefits:</p>
              {content.benefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-2 text-xs text-gray-600">
                  <Clock className="w-3 h-3 text-green-500" />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}