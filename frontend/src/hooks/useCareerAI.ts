import { useState, ReactNode } from 'react';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { LoadingWrapper } from '@/components/ai/LoadingWrapper';

declare module 'react' {
  interface JSX {
    IntrinsicElements: {
      [elemName: string]: any;
    };
  }
}

interface JobFitAnalysis {
  score: number;
  matches: string[];
  gaps: string[];
  suggestions: string[];
}

interface NegotiationStrategy {
  strategy: string;
  talkingPoints: string[];
  counterofferRange: {
    min: number;
    max: number;
  };
}

interface JobSearchStrategy {
  targetCompanies: string[];
  skillsToHighlight: string[];
  skillsToDevelop: string[];
  searchKeywords: string[];
  networkingTips: string[];
  applicationTiming: string;
}

interface ApplicationEnhancements {
  resumeSuggestions: string[];
  coverLetterImprovements: string[];
  keyAchievements: string[];
  companyCustomizations: string[];
}

interface InterviewPrep {
  technicalQuestions: string[];
  behavioralQuestions: string[];
  companyInsights: string[];
  questionsToAsk: string[];
  starStories: string[];
}

interface CareerAIHook {
  isProcessing: boolean;
  analyzeJobFit: (params: { 
    resume: Record<string, any>; 
    jobDescription: string; 
  }) => Promise<JobFitAnalysis>;
  generateNegotiationStrategy: (params: {
    jobTitle: string;
    company: string;
    location: string;
    experienceYears: number;
    currentSalary?: number;
    offeredSalary: number;
    benefits?: string[];
    industryData?: Record<string, any>;
  }) => Promise<NegotiationStrategy>;
  generateJobSearchStrategy: (params: {
    desiredRole: string;
    location: string;
    experience: string;
    skills: string[];
    preferences?: Record<string, any>;
    marketTrends?: Record<string, any>;
  }) => Promise<JobSearchStrategy>;
  enhanceApplication: (params: {
    resume: Record<string, any>;
    coverLetter?: string;
    jobDescription: string;
    companyInfo?: Record<string, any>;
  }) => Promise<ApplicationEnhancements>;
  generateInterviewPrep: (params: {
    jobDescription: string;
    company: string;
    role: string;
    experienceLevel: string;
    techStack?: string[];
  }) => Promise<InterviewPrep>;
  loadingIndicator: ReactNode;
}

export function useCareerAI(): CareerAIHook {
  const [isProcessing, setIsProcessing] = useState(false);

  // Analyze job fit
  const analyzeJobFitMutation = useMutation({
    mutationFn: async (params: { 
      resume: Record<string, any>; 
      jobDescription: string 
    }): Promise<JobFitAnalysis> => {
      setIsProcessing(true);
      try {
        const response = await fetch('/api/career-ai/analyze-job-fit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(params),
        });
        
        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Failed to analyze job fit');
        }
        
        return response.json();
      } finally {
        setIsProcessing(false);
      }
    },
    onSuccess: () => {
      toast.success('Job fit analysis complete');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  // Generate salary negotiation strategy
  const generateNegotiationStrategyMutation = useMutation({
    mutationFn: async (data: {
      jobTitle: string;
      company: string;
      location: string;
      experienceYears: number;
      currentSalary?: number;
      offeredSalary: number;
      benefits?: string[];
      industryData?: Record<string, any>;
    }): Promise<NegotiationStrategy> => {
      setIsProcessing(true);
      try {
        const response = await fetch('/api/career-ai/salary-negotiation', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        
        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Failed to generate negotiation strategy');
        }
        
        return response.json();
      } finally {
        setIsProcessing(false);
      }
    },
    onSuccess: () => {
      toast.success('Negotiation strategy generated');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  // Generate job search strategy
  const generateJobSearchStrategyMutation = useMutation({
    mutationFn: async (data: {
      desiredRole: string;
      location: string;
      experience: string;
      skills: string[];
      preferences?: Record<string, any>;
      marketTrends?: Record<string, any>;
    }): Promise<JobSearchStrategy> => {
      setIsProcessing(true);
      try {
        const response = await fetch('/api/career-ai/job-search-strategy', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        
        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Failed to generate job search strategy');
        }
        
        return response.json();
      } finally {
        setIsProcessing(false);
      }
    },
    onSuccess: () => {
      toast.success('Job search strategy generated');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  // Enhance job application
  const enhanceApplicationMutation = useMutation({
    mutationFn: async (data: {
      resume: Record<string, any>;
      coverLetter?: string;
      jobDescription: string;
      companyInfo?: Record<string, any>;
    }): Promise<ApplicationEnhancements> => {
      setIsProcessing(true);
      try {
        const response = await fetch('/api/career-ai/enhance-application', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        
        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Failed to enhance application');
        }
        
        return response.json();
      } finally {
        setIsProcessing(false);
      }
    },
    onSuccess: () => {
      toast.success('Application materials enhanced');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  // Generate interview prep
  const generateInterviewPrepMutation = useMutation({
    mutationFn: async (data: {
      jobDescription: string;
      company: string;
      role: string;
      experienceLevel: string;
      techStack?: string[];
    }): Promise<InterviewPrep> => {
      setIsProcessing(true);
      try {
        const response = await fetch('/api/career-ai/interview-prep', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        
        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Failed to generate interview prep');
        }
        
        return response.json();
      } finally {
        setIsProcessing(false);
      }
    },
    onSuccess: () => {
      toast.success('Interview preparation materials generated');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const result: CareerAIHook = {
    isProcessing,
    analyzeJobFit: analyzeJobFitMutation.mutateAsync,
    generateNegotiationStrategy: generateNegotiationStrategyMutation.mutateAsync,
    generateJobSearchStrategy: generateJobSearchStrategyMutation.mutateAsync,
    enhanceApplication: enhanceApplicationMutation.mutateAsync,
    generateInterviewPrep: generateInterviewPrepMutation.mutateAsync,
    loadingIndicator: null
  };
  
  if (isProcessing) {
    result.loadingIndicator = LoadingWrapper({ loading: true }) as ReactNode;
  }

  return result;
}