import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useTierLimits } from '@/hooks/useTierLimits';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Lock, Crown, Zap, Star, Clock, Target, TrendingUp } from 'lucide-react';
import { useLocation } from 'wouter';

interface TierGateProps {
  feature: string;
  requiredTier: 'basic' | 'professional' | 'enterprise';
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

const tierIcons = {
  basic: Crown,
  professional: Zap,
  enterprise: Star
};

const tierColors = {
  basic: 'bg-blue-500',
  professional: 'bg-purple-500', 
  enterprise: 'bg-amber-500'
};

const tierBenefits = {
  basic: {
    headline: 'Save Hours Every Week',
    benefits: ['10 AI resumes/month', '10 cover letters/month', 'No watermarks'],
    timeValue: 'Save 5+ hours per application'
  },
  professional: {
    headline: 'Land Your Dream Job Faster',
    benefits: ['Unlimited AI generations', 'Premium templates', 'Interview prep'],
    timeValue: 'Apply to 10x more jobs in the same time'
  },
  enterprise: {
    headline: 'Scale Your Team\'s Success',
    benefits: ['Team management', 'API access', 'Custom branding'],
    timeValue: 'Streamline hiring across your organization'
  }
};

export function TierGate({ feature, requiredTier, children, fallback }: TierGateProps) {
  const { user, hasFeature } = useAuth();
  const { usage } = useTierLimits();
  const [, setLocation] = useLocation();
  
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
          <Button onClick={() => setLocation('/login')}>Sign In</Button>
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
  const benefits = tierBenefits[requiredTier as keyof typeof tierBenefits];
  const currentTier = user.tier || 'free';
  
  return (
    <Card className="border-2 border-gradient-to-r from-blue-200 to-purple-200 bg-gradient-to-br from-blue-50 to-purple-50">
      <CardHeader className="text-center">
        <div className={`w-16 h-16 rounded-full ${tierColors[requiredTier]} flex items-center justify-center mx-auto mb-4 shadow-lg`}>
          <Icon className="w-8 h-8 text-white" />
        </div>
        <CardTitle className="text-2xl mb-2">
          {benefits?.headline || `Upgrade to ${requiredTier}`}
        </CardTitle>
        <CardDescription className="text-base">
          {benefits?.timeValue || `This feature requires a ${requiredTier} subscription`}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {benefits && (
          <div className="space-y-3">
            {benefits.benefits.map((benefit, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-3 h-3 text-green-600" />
                </div>
                <span className="text-sm font-medium">{benefit}</span>
              </div>
            ))}
          </div>
        )}
        
        <div className="bg-white/50 rounded-lg p-4 space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Current plan:</span>
            <Badge variant="outline" className="capitalize">{currentTier}</Badge>
          </div>
          {usage && (
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Usage this month:</span>
              <span>{usage.resumesThisMonth + usage.coverLettersThisMonth} items created</span>
            </div>
          )}
        </div>
        
        <div className="space-y-3">
          <Button 
            className={`w-full ${tierColors[requiredTier]} hover:opacity-90 text-white font-semibold py-3`}
            onClick={() => setLocation('/pricing')}
          >
            <Crown className="w-4 h-4 mr-2" />
            Upgrade to {requiredTier} - Start Free Trial
          </Button>
          <Button 
            variant="ghost" 
            className="w-full text-sm"
            onClick={() => setLocation('/pricing')}
          >
            View All Plans
          </Button>
        </div>
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
