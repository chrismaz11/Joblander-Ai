import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Brain, Sparkles, Zap } from 'lucide-react';

interface AIProcessingIndicatorProps {
  message?: string;
  stage?: 'analyzing' | 'generating' | 'optimizing' | 'finalizing';
  compact?: boolean;
}

export function AIProcessingIndicator({ 
  message = "AI is working on your request...", 
  stage = 'generating',
  compact = false 
}: AIProcessingIndicatorProps) {
  const stages = {
    analyzing: { icon: Brain, text: 'Analyzing your input...', color: 'text-blue-500' },
    generating: { icon: Sparkles, text: 'Generating content...', color: 'text-purple-500' },
    optimizing: { icon: Zap, text: 'Optimizing results...', color: 'text-green-500' },
    finalizing: { icon: Sparkles, text: 'Finalizing...', color: 'text-indigo-500' }
  };

  const currentStage = stages[stage];
  const Icon = currentStage.icon;

  if (compact) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Icon className={`w-4 h-4 animate-spin ${currentStage.color}`} />
        <span>{currentStage.text}</span>
      </div>
    );
  }

  return (
    <Card className="border-2 border-dashed border-purple-200 bg-gradient-to-r from-purple-50 to-blue-50">
      <CardContent className="p-6">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center animate-pulse">
              <Icon className="w-8 h-8 text-white animate-spin" />
            </div>
            <div className="absolute -inset-2 rounded-full border-2 border-purple-300 animate-ping opacity-20"></div>
          </div>
          
          <div className="space-y-2">
            <h3 className="font-semibold text-lg text-gray-900">AI Processing</h3>
            <p className="text-gray-600">{message}</p>
            <p className={`text-sm font-medium ${currentStage.color}`}>
              {currentStage.text}
            </p>
          </div>

          <div className="flex space-x-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2 h-2 rounded-full bg-purple-400 animate-bounce"
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}