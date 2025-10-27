import { ReactNode } from 'react';
import { useTierLimits } from '@/hooks/useTierLimits';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Crown, Lock } from 'lucide-react';
import { useLocation } from 'wouter';

interface TierGateProps {
  children: ReactNode;
  feature: string;
  requiredTier?: string;
  fallback?: ReactNode;
}

export function TierGate({ children, feature, requiredTier, fallback }: TierGateProps) {
  const { requiresUpgrade, tier } = useTierLimits();
  const [, setLocation] = useLocation();

  if (!requiresUpgrade(feature)) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  return (
    <Card className="border-2 border-dashed border-gray-300">
      <CardHeader className="text-center">
        <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <Lock className="h-6 w-6 text-gray-400" />
        </div>
        <CardTitle className="flex items-center justify-center gap-2">
          <Crown className="h-5 w-5 text-yellow-500" />
          Premium Feature
        </CardTitle>
        <CardDescription>
          Upgrade to {requiredTier || 'Basic Pro'} to unlock this feature
        </CardDescription>
      </CardHeader>
      <CardContent className="text-center">
        <Button onClick={() => setLocation('/pricing')}>
          Upgrade Now
        </Button>
      </CardContent>
    </Card>
  );
}
