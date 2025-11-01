import { Badge } from '@/components/ui/badge';
import { Sparkles } from 'lucide-react';

interface AIBadgeProps {
  text?: string;
  variant?: 'default' | 'outline' | 'success';
}

export function AIBadge({ text = 'AI Powered', variant = 'default' }: AIBadgeProps) {
  const baseStyles = 'animate-pulse-slow bg-gradient-to-r';
  const variantStyles = {
    default: 'from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700',
    outline: 'border border-blue-500 dark:border-blue-400 text-blue-600 dark:text-blue-400',
    success: 'from-green-600 to-teal-600 text-white hover:from-green-700 hover:to-teal-700'
  };

  return (
    <Badge className={`${baseStyles} ${variantStyles[variant]} gap-1`}>
      <Sparkles className="h-3 w-3" />
      {text}
    </Badge>
  );
}