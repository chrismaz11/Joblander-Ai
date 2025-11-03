// SaaS Pricing Strategy - Job-Lander Pro

export interface PricingTier {
  id: string;
  name: string;
  price: number; // Monthly price in cents (e.g., 995 = $9.95)
  yearlyPrice: number; // Yearly price in cents with discount
  yearlyDiscount: number; // Percentage discount for yearly
  description: string;
  features: PricingFeature[];
  limitations: PricingLimitation[];
  popular?: boolean;
  cta: string;
  adSupported: boolean;
  maxResumes: number | 'unlimited';
  maxCoverLetters: number | 'unlimited';
  maxTemplates: number | 'unlimited';
  aiGenerations: number | 'unlimited';
  blockchainVerifications: number | 'unlimited';
  portfolios: number | 'unlimited';
  customBranding: boolean;
  prioritySupport: boolean;
  downloadFormats: string[];
}

export interface PricingFeature {
  name: string;
  description: string;
  included: boolean;
  highlight?: boolean;
}

export interface PricingLimitation {
  feature: string;
  limit: string | number;
}

// 🔥 COMPETITIVE ADVANTAGE FEATURES
export const COMPETITIVE_ADVANTAGES = [
  {
    id: 'blockchain',
    name: '🔒 Blockchain Verification',
    description: 'Crypto-proof authenticity verification on Polygon network',
    uniqueTo: 'Job-Lander'
  },
  {
    id: 'ai-powered',
    name: '🤖 Advanced AI Parsing',
    description: 'Gemini AI with confidence scoring and OCR fallback',
    uniqueTo: 'Job-Lander'
  },
  {
    id: 'portfolio-generation',
    name: '🌐 Portfolio Website Generation',
    description: 'Deploy-ready portfolio websites from resume data',
    uniqueTo: 'Job-Lander'
  },
  {
    id: 'cover-letter-tones',
    name: '✍️ 3-Tone Cover Letters',
    description: 'Professional, Concise, Bold variants with AI generation',
    uniqueTo: 'Job-Lander'
  },
  {
    id: 'job-matching',
    name: '🎯 AI Job Matching',
    description: 'Smart job recommendations with compatibility scores',
    uniqueTo: 'Job-Lander'
  }
];

// 💰 PRICING TIERS - Designed to CRUSH Resume.io and CV-Lite
export const PRICING_TIERS: PricingTier[] = [
  {
    id: 'free',
    name: 'Free Creation',
    price: 0,
    yearlyPrice: 0,
    yearlyDiscount: 0,
    description: 'Create unlimited resumes and cover letters for free',
    adSupported: true,
    maxResumes: 'unlimited',
    maxCoverLetters: 'unlimited',
    maxTemplates: 'unlimited',
    aiGenerations: 'unlimited',
    blockchainVerifications: 0,
    portfolios: 0,
    customBranding: false,
    prioritySupport: false,
    downloadFormats: [],
    cta: 'Start Free',
    features: [
      {
        name: 'Unlimited Resume Creation',
        description: 'Create as many resumes as you want with all templates',
        included: true,
        highlight: true
      },
      {
        name: 'Unlimited Cover Letters',
        description: 'Generate unlimited cover letters in all 3 tones',
        included: true,
        highlight: true
      },
      {
        name: 'All Premium Templates',
        description: 'Access to our complete template library',
        included: true
      },
      {
        name: 'Unlimited AI Enhancements',
        description: 'AI-powered resume optimization and suggestions',
        included: true
      },
      {
        name: 'Preview & Edit Forever',
        description: 'Edit and preview your documents anytime',
        included: true
      },
      {
        name: 'Pay-Per-Download',
        description: 'Only pay $2.95 when you need to download',
        included: true
      }
    ],
    limitations: [
      { feature: 'Downloads', limit: '$2.95 per download' },
      { feature: 'Blockchain Verification', limit: 'Not available' },
      { feature: 'Portfolio Generation', limit: 'Not available' }
    ]
  },

  {
    id: 'basic',
    name: 'Basic Pro',
    price: 1495, // $14.95/month
    yearlyPrice: 14352, // $143.52/year (20% discount)
    yearlyDiscount: 20,
    description: 'Unlimited downloads plus premium features',
    adSupported: false,
    maxResumes: 'unlimited',
    maxCoverLetters: 'unlimited',
    maxTemplates: 'unlimited',
    aiGenerations: 'unlimited',
    blockchainVerifications: 5,
    portfolios: 1,
    customBranding: false,
    prioritySupport: false,
    downloadFormats: ['PDF', 'DOCX'],
    cta: 'Go Basic Pro',
    features: [
      {
        name: 'Everything in Free',
        description: 'All free features included',
        included: true
      },
      {
        name: 'Unlimited Downloads',
        description: 'Download as many times as you want',
        included: true,
        highlight: true
      },
      {
        name: '5 Blockchain Verifications',
        description: 'Verify resume authenticity on the blockchain',
        included: true,
        highlight: true
      },
      {
        name: '1 Portfolio Website',
        description: 'Generate a professional portfolio website',
        included: true,
        highlight: true
      },
      {
        name: 'No Ads',
        description: 'Clean, distraction-free experience',
        included: true
      },
      {
        name: 'PDF + DOCX Downloads',
        description: 'Download in multiple formats',
        included: true
      }
    ],
    limitations: [
      { feature: 'Blockchain Verifications', limit: '5 per month' },
      { feature: 'Portfolio Websites', limit: '1 active' }
    ]
  },

  {
    id: 'pro',
    name: 'Professional',
    price: 1995, // $19.95/month
    yearlyPrice: 19152, // $191.52/year (20% discount)
    yearlyDiscount: 20,
    description: 'Everything included - the complete solution',
    popular: true,
    adSupported: false,
    maxResumes: 'unlimited',
    maxCoverLetters: 'unlimited',
    maxTemplates: 'unlimited',
    aiGenerations: 'unlimited',
    blockchainVerifications: 'unlimited',
    portfolios: 'unlimited',
    customBranding: true,
    prioritySupport: true,
    downloadFormats: ['PDF', 'DOCX', 'HTML'],
    cta: 'Go Professional',
    features: [
      {
        name: 'Everything in Basic Pro',
        description: 'All Basic Pro features included',
        included: true
      },
      {
        name: 'Unlimited Everything',
        description: 'No limits on any features',
        included: true,
        highlight: true
      },
      {
        name: 'Unlimited Blockchain Verification',
        description: 'Verify all your resumes on the blockchain',
        included: true,
        highlight: true
      },
      {
        name: 'Unlimited Portfolio Websites',
        description: 'Create multiple professional portfolios',
        included: true,
        highlight: true
      },
      {
        name: 'Custom Branding',
        description: 'Add your personal branding to resumes',
        included: true
      },
      {
        name: 'Priority Support',
        description: '24h response time for all support requests',
        included: true
      },
      {
        name: 'All Download Formats',
        description: 'PDF, DOCX, HTML, and more',
        included: true
      },
      {
        name: 'Advanced Analytics',
        description: 'Track resume views and performance',
        included: true
      },
      {
        name: 'Early Access Features',
        description: 'Get new features before anyone else',
        included: true
      }
    ],
    limitations: []
  },

  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 2995, // $29.95/month - For agencies, recruiters, and teams
    yearlyPrice: 28752, // $287.52/year (20% discount)
    yearlyDiscount: 20,
    description: 'For agencies, recruiters, and large teams',
    adSupported: false,
    maxResumes: 'unlimited',
    maxCoverLetters: 'unlimited',
    maxTemplates: 'unlimited',
    aiGenerations: 'unlimited',
    blockchainVerifications: 'unlimited',
    portfolios: 'unlimited',
    customBranding: true,
    prioritySupport: true,
    downloadFormats: ['PDF', 'DOCX', 'HTML', 'PNG', 'JSON'],
    cta: 'Contact Sales',
    features: [
      {
        name: 'Everything in Professional',
        description: 'All Professional tier features included',
        included: true
      },
      {
        name: 'Team Management',
        description: 'Manage multiple users and permissions',
        included: true,
        highlight: true
      },
      {
        name: 'White-Label Solution',
        description: 'Completely customize branding for your agency',
        included: true,
        highlight: true
      },
      {
        name: 'API Access',
        description: 'Integrate with your existing systems',
        included: true,
        highlight: true
      },
      {
        name: 'Bulk Operations',
        description: 'Process hundreds of resumes at once',
        included: true
      },
      {
        name: 'Custom Templates',
        description: 'Create custom templates for your brand',
        included: true
      },
      {
        name: 'Advanced Integrations',
        description: 'ATS integrations, CRM connections, and more',
        included: true
      },
      {
        name: 'Dedicated Account Manager',
        description: 'Personal support for your enterprise needs',
        included: true
      },
      {
        name: 'SLA Guarantee',
        description: '99.9% uptime guarantee with support SLA',
        included: true
      }
    ],
    limitations: []
  }
];

// 📊 ADVERTISING REVENUE MODEL
export interface AdConfig {
  position: string;
  format: string;
  cpm: number; // Expected CPM in cents
  frequency: string;
}

export const AD_PLACEMENTS: AdConfig[] = [
  {
    position: 'sidebar-resume-builder',
    format: '300x250 Medium Rectangle',
    cpm: 200, // $2.00 CPM
    frequency: 'Always visible during resume building'
  },
  {
    position: 'between-templates',
    format: '728x90 Leaderboard',
    cpm: 150, // $1.50 CPM
    frequency: 'Every 4 templates in grid'
  },
  {
    position: 'post-download',
    format: '320x50 Mobile Banner',
    cpm: 100, // $1.00 CPM
    frequency: 'After each resume download'
  },
  {
    position: 'jobs-page-top',
    format: '970x250 Billboard',
    cpm: 300, // $3.00 CPM
    frequency: 'Top of job search results'
  }
];

// 💡 REVENUE PROJECTIONS
export const REVENUE_MODEL = {
  // Free tier monetization through ads
  freeUser: {
    monthlyPageViews: 50, // Conservative estimate
    averageCPM: 175, // $1.75 average across all ad placements
    monthlyAdRevenue: 8.75, // $0.0875 per user per month
    conversionRate: 15 // 15% of free users upgrade within 6 months
  },
  
  // Subscription revenue targets
  subscriptionTargets: {
    year1: {
      freeUsers: 10000,
      basicUsers: 500,   // 5% conversion
      proUsers: 300,     // 3% conversion  
      enterpriseUsers: 10 // 0.1% conversion
    },
    year2: {
      freeUsers: 50000,
      basicUsers: 3000,
      proUsers: 2000,
      enterpriseUsers: 50
    }
  }
};

// 🎯 CONVERSION STRATEGIES
export const CONVERSION_TRIGGERS = [
  {
    trigger: 'resume_limit_reached',
    message: 'You\'ve created your maximum of 2 resumes. Upgrade to create unlimited resumes!',
    upgradeIncentive: '50% off first month'
  },
  {
    trigger: 'template_locked',
    message: 'This premium template is available with Basic Pro or higher.',
    upgradeIncentive: 'Access all templates instantly'
  },
  {
    trigger: 'ai_limit_reached',
    message: 'You\'ve used your 5 AI enhancements this month. Upgrade for unlimited AI power!',
    upgradeIncentive: 'Unlimited AI enhancements'
  },
  {
    trigger: 'blockchain_interest',
    message: 'Verify your resume authenticity with blockchain technology!',
    upgradeIncentive: 'Stand out with crypto-verified credentials'
  },
  {
    trigger: 'portfolio_interest',
    message: 'Create a stunning portfolio website from your resume data!',
    upgradeIncentive: 'Get noticed with a professional portfolio'
  }
];

export function getPricingTier(tierId: string): PricingTier | undefined {
  return PRICING_TIERS.find(tier => tier.id === tierId);
}

export function formatPrice(priceInCents: number): string {
  return `$${(priceInCents / 100).toFixed(2)}`;
}

export function calculateYearlyDiscount(monthlyPrice: number, yearlyPrice: number): number {
  const monthlyYearly = monthlyPrice * 12;
  return Math.round(((monthlyYearly - yearlyPrice) / monthlyYearly) * 100);
}