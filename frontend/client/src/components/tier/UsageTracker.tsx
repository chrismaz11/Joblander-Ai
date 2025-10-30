import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useTierLimits } from '@/hooks/useTierLimits';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { TrendingUp, AlertTriangle } from 'lucide-react';

interface Usage {
  resumesThisMonth: number;
  resetDate: string;
}

export function UsageTracker() {
  const { user } = useAuth();
  const { limits, tier } = useTierLimits();
  const [usage, setUsage] = useState<Usage | null>(null);

  useEffect(() => {
    fetchUsage();
  }, [user]);

  const fetchUsage = async () => {
    if (!user) return;
    
    try {
      const response = await fetch('/api/usage');
      if (response.ok) {
        const data = await response.json();
        setUsage(data);
      }
    } catch (error) {
      console.error('Failed to fetch usage:', error);
    }
  };

  if (!usage || limits.resumesPerMonth === -1) return null;

  const percentage = (usage.resumesThisMonth / limits.resumesPerMonth) * 100;
  const isNearLimit = percentage >= 80;
  const isAtLimit = usage.resumesThisMonth >= limits.resumesPerMonth;

  return (
    <Card className={isAtLimit ? 'border-red-200 bg-red-50' : isNearLimit ? 'border-yellow-200 bg-yellow-50' : ''}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm">
          <TrendingUp className="h-4 w-4" />
          Monthly Usage
          {isAtLimit && <AlertTriangle className="h-4 w-4 text-red-500" />}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span>Resumes Created</span>
            <span className={isAtLimit ? 'text-red-600 font-medium' : ''}>
              {usage.resumesThisMonth} / {limits.resumesPerMonth}
            </span>
          </div>
          
          <Progress 
            value={Math.min(percentage, 100)} 
            className={`h-2 ${isAtLimit ? '[&>div]:bg-red-500' : isNearLimit ? '[&>div]:bg-yellow-500' : ''}`}
          />
          
          <div className="text-xs text-gray-500">
            Resets on {new Date(usage.resetDate).toLocaleDateString()}
          </div>

          {isAtLimit && (
            <div className="pt-2">
              <Button size="sm" className="w-full">
                Upgrade to Create More
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
