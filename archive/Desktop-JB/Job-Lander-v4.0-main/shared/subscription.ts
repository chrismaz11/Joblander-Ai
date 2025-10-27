// Subscription Management and Feature Gating System
import { PRICING_TIERS, PricingTier } from './pricing';

export interface UserSubscription {
  id: string;
  userId: string;
  tierId: 'free' | 'basic' | 'pro' | 'enterprise';
  status: 'active' | 'canceled' | 'past_due' | 'unpaid';
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  stripeSubscriptionId?: string;
  stripeCustomerId?: string;
  cancelAtPeriodEnd: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UsageTracking {
  userId: string;
  month: string; // YYYY-MM format
  resumesCreated: number;
  coverLettersGenerated: number;
  aiGenerationsUsed: number;
  blockchainVerifications: number;
  portfoliosCreated: number;
  resetAt: Date;
}

export interface FeatureGateResult {
  allowed: boolean;
  reason?: string;
  upgradeRequired?: boolean;
  recommendedTier?: string;
  currentUsage?: number;
  limit?: number | 'unlimited';
}

export class SubscriptionManager {
  private userSubscription: UserSubscription;
  private userUsage: UsageTracking;

  constructor(subscription: UserSubscription, usage: UsageTracking) {
    this.userSubscription = subscription;
    this.userUsage = usage;
  }

  private getCurrentTier(): PricingTier {
    return PRICING_TIERS.find(tier => tier.id === this.userSubscription.tierId) || PRICING_TIERS[0];
  }

  private isSubscriptionActive(): boolean {
    return this.userSubscription.status === 'active' && 
           this.userSubscription.currentPeriodEnd > new Date();
  }

  // Feature gating methods
  canCreateResume(): FeatureGateResult {
    const tier = this.getCurrentTier();
    
    if (!this.isSubscriptionActive() && tier.id !== 'free') {
      return {
        allowed: false,
        reason: 'Subscription is not active',
        upgradeRequired: true,
        recommendedTier: 'basic'
      };
    }

    if (tier.maxResumes === 'unlimited') {
      return { allowed: true };
    }

    const currentUsage = this.userUsage.resumesCreated;
    if (currentUsage >= tier.maxResumes) {
      const nextTier = this.getNextTierWithUnlimitedResumes();
      return {
        allowed: false,
        reason: `You've reached your limit of ${tier.maxResumes} resumes`,
        upgradeRequired: true,
        recommendedTier: nextTier,
        currentUsage,
        limit: tier.maxResumes
      };
    }

    return { 
      allowed: true, 
      currentUsage, 
      limit: tier.maxResumes 
    };
  }

  canGenerateCoverLetter(): FeatureGateResult {
    const tier = this.getCurrentTier();
    
    if (!this.isSubscriptionActive() && tier.id !== 'free') {
      return {
        allowed: false,
        reason: 'Subscription is not active',
        upgradeRequired: true,
        recommendedTier: 'basic'
      };
    }

    if (tier.maxCoverLetters === 'unlimited') {
      return { allowed: true };
    }

    const currentUsage = this.userUsage.coverLettersGenerated;
    if (currentUsage >= tier.maxCoverLetters) {
      return {
        allowed: false,
        reason: `You've reached your monthly limit of ${tier.maxCoverLetters} cover letters`,
        upgradeRequired: true,
        recommendedTier: 'basic',
        currentUsage,
        limit: tier.maxCoverLetters
      };
    }

    return { 
      allowed: true, 
      currentUsage, 
      limit: tier.maxCoverLetters 
    };
  }

  canUseAI(): FeatureGateResult {
    const tier = this.getCurrentTier();
    
    if (!this.isSubscriptionActive() && tier.id !== 'free') {
      return {
        allowed: false,
        reason: 'Subscription is not active',
        upgradeRequired: true,
        recommendedTier: 'basic'
      };
    }

    if (tier.aiGenerations === 'unlimited') {
      return { allowed: true };
    }

    const currentUsage = this.userUsage.aiGenerationsUsed;
    if (currentUsage >= tier.aiGenerations) {
      return {
        allowed: false,
        reason: `You've used all ${tier.aiGenerations} AI enhancements this month`,
        upgradeRequired: true,
        recommendedTier: 'pro',
        currentUsage,
        limit: tier.aiGenerations
      };
    }

    return { 
      allowed: true, 
      currentUsage, 
      limit: tier.aiGenerations 
    };
  }

  canUseBlockchainVerification(): FeatureGateResult {
    const tier = this.getCurrentTier();
    
    if (!this.isSubscriptionActive() && tier.id !== 'free') {
      return {
        allowed: false,
        reason: 'Subscription is not active',
        upgradeRequired: true,
        recommendedTier: 'basic'
      };
    }

    if (tier.blockchainVerifications === 0) {
      return {
        allowed: false,
        reason: 'Blockchain verification is not available on your plan',
        upgradeRequired: true,
        recommendedTier: 'basic'
      };
    }

    if (tier.blockchainVerifications === 'unlimited') {
      return { allowed: true };
    }

    const currentUsage = this.userUsage.blockchainVerifications;
    if (currentUsage >= tier.blockchainVerifications) {
      return {
        allowed: false,
        reason: `You've used all ${tier.blockchainVerifications} blockchain verifications this month`,
        upgradeRequired: true,
        recommendedTier: 'pro',
        currentUsage,
        limit: tier.blockchainVerifications
      };
    }

    return { 
      allowed: true, 
      currentUsage, 
      limit: tier.blockchainVerifications 
    };
  }

  canCreatePortfolio(): FeatureGateResult {
    const tier = this.getCurrentTier();
    
    if (!this.isSubscriptionActive() && tier.id !== 'free') {
      return {
        allowed: false,
        reason: 'Subscription is not active',
        upgradeRequired: true,
        recommendedTier: 'basic'
      };
    }

    if (tier.portfolios === 0) {
      return {
        allowed: false,
        reason: 'Portfolio generation is not available on your plan',
        upgradeRequired: true,
        recommendedTier: 'basic'
      };
    }

    if (tier.portfolios === 'unlimited') {
      return { allowed: true };
    }

    const currentUsage = this.userUsage.portfoliosCreated;
    if (currentUsage >= tier.portfolios) {
      return {
        allowed: false,
        reason: `You've reached your limit of ${tier.portfolios} portfolio websites`,
        upgradeRequired: true,
        recommendedTier: 'pro',
        currentUsage,
        limit: tier.portfolios
      };
    }

    return { 
      allowed: true, 
      currentUsage, 
      limit: tier.portfolios 
    };
  }

  canAccessPremiumTemplate(templateId: string): FeatureGateResult {
    const tier = this.getCurrentTier();
    
    if (!this.isSubscriptionActive() && tier.id !== 'free') {
      return {
        allowed: false,
        reason: 'Subscription is not active',
        upgradeRequired: true,
        recommendedTier: 'basic'
      };
    }

    // Check if template requires premium access
    // This would typically check against a template database
    const isPremiumTemplate = templateId.includes('premium') || templateId.includes('pro');
    
    if (isPremiumTemplate && tier.id === 'free') {
      return {
        allowed: false,
        reason: 'This premium template requires a paid subscription',
        upgradeRequired: true,
        recommendedTier: 'basic'
      };
    }

    return { allowed: true };
  }

  hasAdSupport(): boolean {
    const tier = this.getCurrentTier();
    return tier.adSupported;
  }

  hasPrioritySupport(): boolean {
    const tier = this.getCurrentTier();
    return tier.prioritySupport;
  }

  hasCustomBranding(): boolean {
    const tier = this.getCurrentTier();
    return tier.customBranding;
  }

  getDownloadFormats(): string[] {
    const tier = this.getCurrentTier();
    return tier.downloadFormats;
  }

  private getNextTierWithUnlimitedResumes(): string {
    return 'pro'; // Professional tier has unlimited resumes
  }

  // Usage tracking methods
  incrementResumeUsage(): void {
    this.userUsage.resumesCreated++;
  }

  incrementCoverLetterUsage(): void {
    this.userUsage.coverLettersGenerated++;
  }

  incrementAIUsage(): void {
    this.userUsage.aiGenerationsUsed++;
  }

  incrementBlockchainUsage(): void {
    this.userUsage.blockchainVerifications++;
  }

  incrementPortfolioUsage(): void {
    this.userUsage.portfoliosCreated++;
  }

  // Upgrade recommendations
  getUpgradeRecommendation(feature: string): {tier: string, reason: string} {
    const tier = this.getCurrentTier();
    
    switch (feature) {
      case 'resume_limit':
        return {
          tier: 'pro',
          reason: 'Get unlimited resume creation and advanced features'
        };
      case 'ai_limit':
        return {
          tier: 'pro',
          reason: 'Unlock unlimited AI enhancements and optimizations'
        };
      case 'blockchain':
        return {
          tier: 'basic',
          reason: 'Add blockchain verification to stand out from other candidates'
        };
      case 'portfolio':
        return {
          tier: 'basic',
          reason: 'Create professional portfolio websites to showcase your work'
        };
      case 'premium_templates':
        return {
          tier: 'basic',
          reason: 'Access all premium templates and early releases'
        };
      default:
        return {
          tier: 'pro',
          reason: 'Unlock all features and unlimited usage'
        };
    }
  }

  // Subscription management
  isTrialEligible(): boolean {
    // User is eligible for trial if they're currently on free tier
    // and haven't had a paid subscription before
    return this.userSubscription.tierId === 'free';
  }

  getDaysUntilRenewal(): number {
    const now = new Date();
    const endDate = this.userSubscription.currentPeriodEnd;
    const diffTime = endDate.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  isAboutToExpire(days: number = 7): boolean {
    return this.getDaysUntilRenewal() <= days;
  }
}

// Helper functions for feature gating in components
export function checkFeatureAccess(
  subscription: UserSubscription, 
  usage: UsageTracking, 
  feature: string
): FeatureGateResult {
  const manager = new SubscriptionManager(subscription, usage);
  
  switch (feature) {
    case 'resume':
      return manager.canCreateResume();
    case 'cover_letter':
      return manager.canGenerateCoverLetter();
    case 'ai':
      return manager.canUseAI();
    case 'blockchain':
      return manager.canUseBlockchainVerification();
    case 'portfolio':
      return manager.canCreatePortfolio();
    default:
      return { allowed: false, reason: 'Unknown feature' };
  }
}

// Database schema for subscriptions (would be used with Drizzle ORM)
export const subscriptionSchema = {
  subscriptions: {
    id: 'varchar',
    userId: 'varchar',
    tierId: 'varchar',
    status: 'varchar',
    currentPeriodStart: 'timestamp',
    currentPeriodEnd: 'timestamp',
    stripeSubscriptionId: 'varchar',
    stripeCustomerId: 'varchar',
    cancelAtPeriodEnd: 'boolean',
    createdAt: 'timestamp',
    updatedAt: 'timestamp'
  },
  usage: {
    userId: 'varchar',
    month: 'varchar',
    resumesCreated: 'integer',
    coverLettersGenerated: 'integer',
    aiGenerationsUsed: 'integer',
    blockchainVerifications: 'integer',
    portfoliosCreated: 'integer',
    resetAt: 'timestamp'
  }
};