import { useAuth } from '@/contexts/AuthContext';

export const TIER_LIMITS = {
  free: {
    resumesPerMonth: 1,
    templatesAccess: 'basic',
    coverLetters: false,
    watermark: true,
    support: 'community'
  },
  basic: {
    resumesPerMonth: 5,
    templatesAccess: 'all',
    coverLetters: true,
    watermark: false,
    support: 'email'
  },
  professional: {
    resumesPerMonth: -1, // unlimited
    templatesAccess: 'premium',
    coverLetters: true,
    watermark: false,
    support: 'priority'
  },
  enterprise: {
    resumesPerMonth: -1, // unlimited
    templatesAccess: 'premium',
    coverLetters: true,
    watermark: false,
    support: 'dedicated'
  }
};

export function useTierLimits() {
  const { user } = useAuth();
  const tier = user?.tier || 'free';
  const limits = TIER_LIMITS[tier as keyof typeof TIER_LIMITS];

  const canCreateResume = (currentCount: number) => {
    return limits.resumesPerMonth === -1 || currentCount < limits.resumesPerMonth;
  };

  const canAccessTemplate = (templateTier: string) => {
    if (limits.templatesAccess === 'premium') return true;
    if (limits.templatesAccess === 'all') return templateTier !== 'premium';
    return templateTier === 'basic';
  };

  const requiresUpgrade = (feature: string) => {
    switch (feature) {
      case 'coverLetters':
        return !limits.coverLetters;
      case 'noWatermark':
        return limits.watermark;
      default:
        return false;
    }
  };

  return {
    tier,
    limits,
    canCreateResume,
    canAccessTemplate,
    requiresUpgrade
  };
}
