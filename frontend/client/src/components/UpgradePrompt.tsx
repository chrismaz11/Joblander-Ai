import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useTierLimits } from '@/hooks/useTierLimits';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Crown, Zap, Clock, Target, TrendingUp, X } from 'lucide-react';
import { useLocation } from 'wouter';

interface UpgradePromptProps {
  trigger: 'limit_reached' | 'template_selection' | 'export_attempt' | 'feature_discovery';
  feature?: string;
  onDismiss?: () => void;
  compact?: boolean;
}

const promptContent = {
  limit_reached: {
    headline: "You've Hit Your Monthly Limit!",
    subheadline: "Upgrade to keep the momentum going",
    benefits: [
      "Unlimited AI resume generations",
      "Unlimited cover letters", 
      "Premium templates",
      "No watermarks"
    ],
    cta: "Upgrade Now - Save Hours Every Week",
    urgency: "Don't let limits slow down your job search"
  },
  template_selection: {
    headline: "Unlock Premium Templates",
    subheadline: "Stand out with professional designs",
    benefits: [
      "18 premium templates",
      "ATS-optimized layouts",
      "Industry-specific designs",
      "Unlimited customization"
    ],
    cta: "Access Premium Templates",
    urgency: "Used by 10,000+ successful job seekers"
  },
  export_attempt: {
    headline: "Remove Watermarks Forever",
    subheadline: "Professional exports for serious job seekers",
    benefits: [
      "Clean, watermark-free PDFs",
      "Multiple export formats",
      "High-quality downloads",
      "Professional presentation"
    ],
    cta: "Get Watermark-Free Exports",
    urgency: "Make the best first impression"
  },
  feature_discovery: {
    headline: "Supercharge Your Job Search",
    subheadline: "AI-powered tools to land interviews faster",
    benefits: [
      "AI job matching & alerts",
      "Interview prep with feedback",
      "Salary negotiation tools",
      "ATS optimization scoring"
    ],
    cta: "Unlock All Features",
    urgency: "Join thousands who've landed their dream jobs"
  }
};

export function UpgradePrompt({ trigger, feature, onDismiss, compact = false }: UpgradePromptProps) {
  const { user } = useAuth();
  const { usage, limits } = useTierLimits();
  const [, setLocation] = useLocation();
  
  if (!user || user.tier === 'professional' || user.tier === 'enterprise') {
    return null;
  }

  const content = promptContent[trigger];
  const currentTier = user.tier || 'free';

  const handleUpgrade = () => {
    setLocation('/pricing');
  };

  if (compact) {
    return (
      <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50 mb-4">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Crown className="w-5 h-5 text-blue-500" />
              <div>
                <p className="font-medium text-sm">{content.headline}</p>
                <p className="text-xs text-gray-600">{content.urgency}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button size="sm" onClick={handleUpgrade}>
                Upgrade
              </Button>
              {onDismiss && (
                <Button size="sm" variant="ghost" onClick={onDismiss}>
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2 border-gradient-to-r from-blue-200 to-purple-200 bg-gradient-to-br from-blue-50 via-white to-purple-50 shadow-lg">
      <CardContent className="p-8">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center shadow-lg">
              <Crown className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">
                {content.headline}
              </h3>
              <p className="text-gray-600 text-lg">
                {content.subheadline}
              </p>
            </div>
          </div>
          {onDismiss && (
            <Button size="sm" variant="ghost" onClick={onDismiss}>
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900 mb-3">What you'll get:</h4>
            <div className="space-y-3">
              {content.benefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="w-3 h-3 text-green-600" />
                  </div>
                  <span className="text-sm font-medium">{benefit}</span>
                </div>
              ))}
            </div>
            
            <div className="bg-white/70 rounded-lg p-4 mt-6">
              <div className="flex items-center justify-between text-sm mb-2">
                <span>Current plan:</span>
                <Badge variant="outline" className="capitalize">{currentTier}</Badge>
              </div>
              {usage && limits && (
                <div className="space-y-1 text-xs text-gray-600">
                  <div className="flex justify-between">
                    <span>Resumes this month:</span>
                    <span>{usage.resumesThisMonth}/{limits.resumesPerMonth === -1 ? '∞' : limits.resumesPerMonth}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cover letters this month:</span>
                    <span>{usage.coverLettersThisMonth}/{limits.coverLettersPerMonth === -1 ? '∞' : limits.coverLettersPerMonth}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="text-center mb-4">
                <div className="text-3xl font-bold text-gray-900">$19.95</div>
                <div className="text-sm text-gray-600">per month</div>
              </div>
              
              <Button 
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold py-3 mb-3"
                onClick={handleUpgrade}
              >
                <Zap className="w-4 h-4 mr-2" />
                {content.cta}
              </Button>
              
              <div className="text-center text-xs text-gray-500 mb-4">
                7-day free trial • Cancel anytime
              </div>
              
              <div className="flex items-center justify-center gap-2 text-xs text-gray-600">
                <Clock className="w-3 h-3" />
                <span>{content.urgency}</span>
              </div>
            </div>

            <div className="text-center">
              <Button 
                variant="ghost" 
                className="text-sm"
                onClick={() => setLocation('/pricing')}
              >
                View All Plans & Pricing
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Hook for strategic upgrade prompt placement
export function useUpgradePrompts() {
  const { user } = useAuth();
  const { usage, limits } = useTierLimits();
  
  const shouldShowUpgradePrompt = (trigger: UpgradePromptProps['trigger']) => {
    if (!user || user.tier === 'professional' || user.tier === 'enterprise') {
      return false;
    }

    switch (trigger) {
      case 'limit_reached':
        return usage && (
          (limits.resumesPerMonth !== -1 && usage.resumesThisMonth >= limits.resumesPerMonth) ||
          (limits.coverLettersPerMonth !== -1 && usage.coverLettersThisMonth >= limits.coverLettersPerMonth)
        );
      case 'template_selection':
        return user.tier === 'free';
      case 'export_attempt':
        return limits.watermark;
      case 'feature_discovery':
        return user.tier !== 'professional';
      default:
        return false;
    }
  };

  return { shouldShowUpgradePrompt };
}