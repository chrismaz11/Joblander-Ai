import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, ArrowRight, ArrowLeft, Sparkles } from 'lucide-react';

interface TourStep {
  target: string;
  title: string;
  description: string;
  position: 'top' | 'bottom' | 'left' | 'right';
}

interface FeatureTourProps {
  steps: TourStep[];
  onComplete: () => void;
  onSkip: () => void;
}

export function FeatureTour({ steps, onComplete, onSkip }: FeatureTourProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const currentTourStep = steps[currentStep];

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm" onClick={onSkip} />

      {/* Tour Card */}
      <Card className="fixed z-50 max-w-sm p-6 shadow-2xl">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
            <span className="text-gray-600 dark:text-gray-400">
              {currentStep + 1} of {steps.length}
            </span>
          </div>
          <button
            onClick={onSkip}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <h3 className="text-gray-900 dark:text-white mb-2">{currentTourStep.title}</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">{currentTourStep.description}</p>

        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={handlePrevious}
            disabled={currentStep === 0}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>

          <div className="flex gap-1">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentStep
                    ? 'w-4 bg-blue-600'
                    : 'bg-gray-300 dark:bg-gray-700'
                }`}
              />
            ))}
          </div>

          <Button onClick={handleNext}>
            {currentStep === steps.length - 1 ? 'Done' : 'Next'}
            {currentStep < steps.length - 1 && <ArrowRight className="w-4 h-4 ml-2" />}
          </Button>
        </div>
      </Card>
    </>
  );
}

// Predefined tours for different pages
export const dashboardTour: TourStep[] = [
  {
    target: 'stats-cards',
    title: 'Track Your Progress',
    description: 'Monitor your job search metrics at a glance. See total applications, active interviews, and success rates.',
    position: 'bottom',
  },
  {
    target: 'ai-resume-button',
    title: 'AI Resume Generation',
    description: 'Click here to generate a tailored resume for any job posting using AI.',
    position: 'bottom',
  },
  {
    target: 'quick-actions',
    title: 'Quick Actions',
    description: 'Access frequently used features like adding applications or scheduling interviews.',
    position: 'left',
  },
  {
    target: 'recent-applications',
    title: 'Recent Activity',
    description: 'Keep track of your latest applications and their current status.',
    position: 'top',
  },
];

export const jobBoardTour: TourStep[] = [
  {
    target: 'kanban-board',
    title: 'Kanban Board',
    description: 'Visualize your job search pipeline. Drag and drop jobs between columns as they progress.',
    position: 'top',
  },
  {
    target: 'wishlist-column',
    title: 'Wishlist',
    description: 'Add jobs you're interested in but haven't applied to yet.',
    position: 'right',
  },
  {
    target: 'job-card',
    title: 'Job Cards',
    description: 'Each card shows key details. Click to view full job details and add notes.',
    position: 'top',
  },
];

export const resumeBuilderTour: TourStep[] = [
  {
    target: 'progress-indicator',
    title: 'Step-by-Step Process',
    description: 'Create your resume in 4 easy steps with live preview.',
    position: 'bottom',
  },
  {
    target: 'preview-pane',
    title: 'Live Preview',
    description: 'See your resume update in real-time as you fill in information.',
    position: 'left',
  },
  {
    target: 'ai-enhance',
    title: 'AI Enhancement',
    description: 'Use AI to improve your resume content and optimize for ATS systems.',
    position: 'top',
  },
];
