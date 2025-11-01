import { Loader2 } from 'lucide-react';

interface AILoadingIndicatorProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function AILoadingIndicator({ 
  message = 'AI is processing...', 
  size = 'md' 
}: AILoadingIndicatorProps) {
  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <Loader2 className={`${sizes[size]} animate-spin text-blue-600 dark:text-blue-400`} />
      <p className="text-sm text-gray-600 dark:text-gray-400">{message}</p>
    </div>
  );
}