import { Button } from './ui/button';
import { Card } from './ui/card';
import { 
  FileText, 
  Briefcase, 
  Calendar, 
  BarChart3, 
  Search,
  Sparkles,
  Plus
} from 'lucide-react';

interface EmptyStateProps {
  type: 'applications' | 'jobs' | 'interviews' | 'analytics' | 'search' | 'documents';
  onAction?: () => void;
}

export function EmptyState({ type, onAction }: EmptyStateProps) {
  const emptyStates = {
    applications: {
      icon: <FileText className="w-16 h-16" />,
      title: 'No applications yet',
      description: 'Start tracking your job applications to stay organized and increase your chances of success.',
      action: 'Add Your First Application',
      illustration: '📝',
    },
    jobs: {
      icon: <Briefcase className="w-16 h-16" />,
      title: 'Your job board is empty',
      description: 'Add job postings to your board and track them through each stage of your application process.',
      action: 'Add Job Posting',
      illustration: '💼',
    },
    interviews: {
      icon: <Calendar className="w-16 h-16" />,
      title: 'No interviews scheduled',
      description: 'When you schedule interviews, they'll appear here with preparation checklists and reminders.',
      action: 'Schedule Interview',
      illustration: '📅',
    },
    analytics: {
      icon: <BarChart3 className="w-16 h-16" />,
      title: 'Not enough data yet',
      description: 'Add more applications to your tracker to see insights and analytics about your job search.',
      action: 'Add Applications',
      illustration: '📊',
    },
    search: {
      icon: <Search className="w-16 h-16" />,
      title: 'No results found',
      description: 'Try adjusting your search terms or filters to find what you're looking for.',
      action: 'Clear Filters',
      illustration: '🔍',
    },
    documents: {
      icon: <FileText className="w-16 h-16" />,
      title: 'No documents uploaded',
      description: 'Upload your resume, cover letters, or other documents to keep them organized.',
      action: 'Upload Document',
      illustration: '📄',
    },
  };

  const state = emptyStates[type];

  return (
    <Card className="p-12">
      <div className="max-w-md mx-auto text-center">
        <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
          <div className="text-gray-400 dark:text-gray-600">
            {state.icon}
          </div>
        </div>
        <div className="text-6xl mb-4">{state.illustration}</div>
        <h3 className="text-gray-900 dark:text-white mb-2">{state.title}</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          {state.description}
        </p>
        {onAction && (
          <Button onClick={onAction}>
            <Plus className="w-4 h-4 mr-2" />
            {state.action}
          </Button>
        )}
      </div>
    </Card>
  );
}

// AI Feature Upsell Component
interface AIUpsellProps {
  feature: string;
  onUpgrade: () => void;
}

export function AIFeatureUpsell({ feature, onUpgrade }: AIUpsellProps) {
  return (
    <Card className="p-8 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/10 dark:to-purple-900/10 border-2 border-blue-200 dark:border-blue-800">
      <div className="max-w-md mx-auto text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Sparkles className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-gray-900 dark:text-white mb-2">Unlock {feature}</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Upgrade to Professional to access AI-powered {feature.toLowerCase()} and boost your job search success.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={onUpgrade} className="bg-gradient-to-r from-blue-600 to-purple-600">
            Upgrade to Professional
          </Button>
          <Button variant="outline">Learn More</Button>
        </div>
      </div>
    </Card>
  );
}

// Loading Skeleton
export function LoadingSkeleton({ type = 'card' }: { type?: 'card' | 'table' | 'list' }) {
  if (type === 'card') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-6 animate-pulse">
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (type === 'table') {
    return (
      <Card className="p-6 animate-pulse">
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
          ))}
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-3 animate-pulse">
      {[1, 2, 3, 4].map((i) => (
        <Card key={i} className="p-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

// Error State
interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({ 
  title = 'Something went wrong', 
  message = 'We encountered an error while loading this content. Please try again.',
  onRetry 
}: ErrorStateProps) {
  return (
    <Card className="p-12">
      <div className="max-w-md mx-auto text-center">
        <div className="w-24 h-24 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-12 h-12 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h3 className="text-gray-900 dark:text-white mb-2">{title}</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">{message}</p>
        {onRetry && (
          <Button onClick={onRetry}>Try Again</Button>
        )}
      </div>
    </Card>
  );
}

// Success State
interface SuccessStateProps {
  title: string;
  message: string;
  onContinue?: () => void;
  continueLabel?: string;
}

export function SuccessState({ 
  title, 
  message, 
  onContinue,
  continueLabel = 'Continue'
}: SuccessStateProps) {
  return (
    <Card className="p-12">
      <div className="max-w-md mx-auto text-center">
        <div className="w-24 h-24 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-12 h-12 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-gray-900 dark:text-white mb-2">{title}</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">{message}</p>
        {onContinue && (
          <Button onClick={onContinue}>{continueLabel}</Button>
        )}
      </div>
    </Card>
  );
}
