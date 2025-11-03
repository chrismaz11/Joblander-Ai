import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';

export const TIER_LIMITS = {
  free: {
    resumesPerMonth: 1,
    coverLettersPerMonth: 3,
    templatesAccess: 'basic',
    coverLetters: true,
    watermark: true,
    support: 'community'
  },
  basic: {
    resumesPerMonth: 10,
    coverLettersPerMonth: 10,
    templatesAccess: 'all',
    coverLetters: true,
    watermark: false,
    support: 'email'
  },
  professional: {
    resumesPerMonth: -1, // unlimited
    coverLettersPerMonth: -1, // unlimited
    templatesAccess: 'premium',
    coverLetters: true,
    watermark: false,
    support: 'priority'
  },
  enterprise: {
    resumesPerMonth: -1, // unlimited
    coverLettersPerMonth: -1, // unlimited
    templatesAccess: 'premium',
    coverLetters: true,
    watermark: false,
    support: 'dedicated'
  }
};

interface Usage {
  resumesThisMonth: number;
  coverLettersThisMonth: number;
  resetDate: string;
}

export function useTierLimits() {
  const { user } = useAuth();
  const [usage, setUsage] = useState<Usage | null>(null);
  const [loading, setLoading] = useState(false);
  
  const tier = user?.tier || 'free';
  const limits = TIER_LIMITS[tier as keyof typeof TIER_LIMITS] || TIER_LIMITS.free;

  useEffect(() => {
    if (user) {
      fetchUsage();
    }
  }, [user]);

  const fetchUsage = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const response = await fetch('/api/usage', {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setUsage(data);
      } else {
        // Fallback to mock data if API not available
        setUsage({
          resumesThisMonth: 0,
          coverLettersThisMonth: 0,
          resetDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1).toISOString()
        });
      }
    } catch (error) {
      // Fallback to mock data
      setUsage({
        resumesThisMonth: tier === 'free' ? 1 : 0,
        coverLettersThisMonth: tier === 'free' ? 2 : 0,
        resetDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1).toISOString()
      });
    } finally {
      setLoading(false);
    }
  };

  const canCreateResume = () => {
    if (!usage) return true;
    return limits.resumesPerMonth === -1 || usage.resumesThisMonth < limits.resumesPerMonth;
  };

  const canCreateCoverLetter = () => {
    if (!usage) return true;
    return limits.coverLettersPerMonth === -1 || usage.coverLettersThisMonth < limits.coverLettersPerMonth;
  };

  const canAccessTemplate = (templateTier: string) => {
    if (limits.templatesAccess === 'premium') return true;
    if (limits.templatesAccess === 'all') return templateTier !== 'premium';
    return templateTier === 'basic';
  };

  const requiresUpgrade = (feature: string) => {
    switch (feature) {
      case 'cover_letters':
      case 'coverLetters':
        return !canCreateCoverLetter();
      case 'no_watermark':
      case 'noWatermark':
        return limits.watermark;
      case 'unlimited_resumes':
        return limits.resumesPerMonth !== -1;
      case 'unlimited_cover_letters':
        return limits.coverLettersPerMonth !== -1;
      default:
        return false;
    }
  };

  const incrementUsage = async (type: 'resume' | 'coverLetter') => {
    if (!usage) return;
    
    try {
      await fetch('/api/usage/increment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.token}`
        },
        body: JSON.stringify({ type })
      });
      
      // Update local state
      setUsage(prev => prev ? {
        ...prev,
        [type === 'resume' ? 'resumesThisMonth' : 'coverLettersThisMonth']: 
          prev[type === 'resume' ? 'resumesThisMonth' : 'coverLettersThisMonth'] + 1
      } : null);
    } catch (error) {
      console.error('Failed to increment usage:', error);
    }
  };

  return {
    tier,
    limits,
    usage,
    loading,
    canCreateResume,
    canCreateCoverLetter,
    canAccessTemplate,
    requiresUpgrade,
    incrementUsage,
    refreshUsage: fetchUsage
  };
}
