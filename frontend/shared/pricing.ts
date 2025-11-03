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
    id: 'ai-powered',
    name: '🤖 Advanced AI Parsing',
    description: 'Gemini AI with confidence scoring and OCR fallback',
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

// 💰 PRICING TIERS - Competitive Pay-Per-Use + Subscription Model
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
      { feature: 'Downloads', limit: '$2.95 per download' }
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
    limitations: []
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