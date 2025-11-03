import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, AlertCircle, Zap } from 'lucide-react';

interface AIStatusTrackerProps {
  operations: Array<{
    id: string;
    name: string;
    status: 'pending' | 'processing' | 'completed' | 'error';
    progress?: number;
    estimatedTime?: string;
  }>;
  onComplete?: () => void;
}

export function AIStatusTracker({ operations, onComplete }: AIStatusTrackerProps) {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const completedCount = operations.filter(op => op.status === 'completed').length;
    if (completedCount === operations.length && onComplete) {
      onComplete();
    }
  }, [operations, onComplete]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'processing':
        return <Clock className="w-4 h-4 text-blue-500 animate-spin" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'processing':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'error':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  const overallProgress = (operations.filter(op => op.status === 'completed').length / operations.length) * 100;

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Zap className="w-5 h-5 text-purple-500" />
          AI Processing Status
        </CardTitle>
        <div className="space-y-2">
          <Progress value={overallProgress} className="h-2" />
          <p className="text-sm text-muted-foreground">
            {Math.round(overallProgress)}% Complete
          </p>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {operations.map((operation, index) => (
          <div key={operation.id} className="flex items-center justify-between p-3 rounded-lg border bg-card">
            <div className="flex items-center gap-3">
              {getStatusIcon(operation.status)}
              <div>
                <p className="font-medium text-sm">{operation.name}</p>
                {operation.estimatedTime && operation.status === 'processing' && (
                  <p className="text-xs text-muted-foreground">
                    Est. {operation.estimatedTime}
                  </p>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {operation.progress !== undefined && operation.status === 'processing' && (
                <div className="w-16">
                  <Progress value={operation.progress} className="h-1" />
                </div>
              )}
              <Badge variant="outline" className={`text-xs ${getStatusColor(operation.status)}`}>
                {operation.status}
              </Badge>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}