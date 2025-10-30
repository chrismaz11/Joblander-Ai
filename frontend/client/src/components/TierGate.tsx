import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Lock, Crown, Zap, Star } from 'lucide-react';

interface TierGateProps {
  feature: string;
  requiredTier: 'basic' | 'pro' | 'enterprise';
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

const tierIcons = {
  basic: Crown,
  pro: Zap,
  enterprise: Star
};

const tierColors = {
  basic: 'bg-blue-500',
  pro: 'bg-purple-500', 
  enterprise: 'bg-gold-500'
};

export function TierGate({ feature, requiredTier, children, fallback }: TierGateProps) {
  const { user, hasFeature } = useAuth();
  
  if (!user) {
    return (
      <Card className="border-2 border-dashed border-muted-foreground/25">
        <CardHeader className="text-center">
          <Lock className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
          <CardTitle>Sign In Required</CardTitle>
          <CardDescription>
            Please sign in to access this feature
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <Button>Sign In</Button>
        </CardContent>
      </Card>
    );
  }

  if (hasFeature(feature)) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  const Icon = tierIcons[requiredTier];
  
  return (
    <Card className="border-2 border-dashed border-muted-foreground/25">
      <CardHeader className="text-center">
        <div className={`w-12 h-12 rounded-full ${tierColors[requiredTier]} flex items-center justify-center mx-auto mb-2`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <CardTitle className="flex items-center justify-center gap-2">
          Upgrade Required
          <Badge variant="secondary" className="capitalize">
            {requiredTier}
          </Badge>
        </CardTitle>
        <CardDescription>
          This feature requires a {requiredTier} subscription or higher
        </CardDescription>
      </CardHeader>
      <CardContent className="text-center space-y-4">
        <div className="text-sm text-muted-foreground">
          Current plan: <Badge variant="outline" className="capitalize">{user.tier}</Badge>
        </div>
        <Button className="w-full">
          Upgrade to {requiredTier}
        </Button>
      </CardContent>
    </Card>
  );
}

export function FeatureFlag({ feature, children }: { feature: string; children: React.ReactNode }) {
  const { hasFeature } = useAuth();
  
  if (!hasFeature(feature)) {
    return null;
  }
  
  return <>{children}</>;
}
