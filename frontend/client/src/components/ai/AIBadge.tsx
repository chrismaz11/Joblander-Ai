import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Zap, Brain, Clock } from 'lucide-react';

interface AIBadgeProps {
  variant?: 'default' | 'processing' | 'success' | 'feature';
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  children?: React.ReactNode;
}

export function AIBadge({ variant = 'default', size = 'md', showIcon = true, children }: AIBadgeProps) {
  const variants = {
    default: 'bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:from-purple-600 hover:to-blue-600',
    processing: 'bg-gradient-to-r from-orange-400 to-pink-400 text-white animate-pulse',
    success: 'bg-gradient-to-r from-green-400 to-emerald-500 text-white',
    feature: 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white'
  };

  const sizes = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-2'
  };

  const icons = {
    default: Sparkles,
    processing: Clock,
    success: Zap,
    feature: Brain
  };

  const Icon = icons[variant];

  return (
    <Badge className={`${variants[variant]} ${sizes[size]} font-medium border-0 shadow-sm`}>
      {showIcon && <Icon className="w-3 h-3 mr-1" />}
      {children || 'AI-Powered'}
    </Badge>
  );
}