import React, { useEffect, useRef } from 'react';
import { Badge } from '@/components/ui/badge';
import { Info } from 'lucide-react';
import { Link } from 'wouter';

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

interface MockAdConfig {
  width: number;
  height: number;
  format: string;
  mockAd: {
    title: string;
    cta: string;
    sponsor: string;
    description?: string;
    image?: string;
  };
}

interface AdComponentProps {
  position: string;
  format: string;
  className?: string;
  showLabel?: boolean;
}

// Mock ad configurations - in production, these would come from ad networks
const AD_CONFIGS: Record<string, MockAdConfig> = {
  'sidebar-resume-builder': {
    width: 300,
    height: 250,
    format: '300x250 Medium Rectangle',
    mockAd: {
      title: 'Professional Interview Coaching',
      description: 'Land your dream job with expert 1-on-1 coaching',
      cta: 'Start Free Trial',
      image: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=300&h=150&fit=crop',
      sponsor: 'CareerBoost Pro'
    }
  },
  'between-templates': {
    width: 728,
    height: 90,
    format: '728x90 Leaderboard',
    mockAd: {
      title: 'Master LinkedIn in 30 Days - Get 10x More Profile Views',
      cta: 'Learn More',
      sponsor: 'LinkedIn Pro Course'
    }
  },
  'post-download': {
    width: 320,
    height: 50,
    format: '320x50 Mobile Banner',
    mockAd: {
      title: 'Job Search Accelerator - Find Jobs 3x Faster',
      cta: 'Get Started',
      sponsor: 'JobHunter Plus'
    }
  },
  'jobs-page-top': {
    width: 970,
    height: 250,
    format: '970x250 Billboard',
    mockAd: {
      title: 'Salary Negotiation Masterclass',
      description: 'Learn to negotiate $10K+ salary increases',
      cta: 'Watch Free Video',
      image: 'https://images.unsplash.com/photo-1553484771-8d6e8bbe5814?w=300&h=200&fit=crop',
      sponsor: 'NegotiationAce'
    }
  }
};

export default function AdComponent({ 
  position, 
  format, 
  className = '', 
  showLabel = true 
}: AdComponentProps) {
  const adRef = useRef<HTMLDivElement>(null);
  const config = AD_CONFIGS[position as keyof typeof AD_CONFIGS];

  useEffect(() => {
    // In production, this would initialize Google AdSense, Amazon DSP, etc.
    // For now, we'll use mock ads to demonstrate the functionality
    console.log(`Ad loaded: ${position} - ${format}`);
    
    // Track ad impression for analytics
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'ad_impression', {
        ad_position: position,
        ad_format: format,
        event_category: 'monetization'
      });
    }
  }, [position, format]);

  if (!config) {
    return null;
  }

  const handleAdClick = () => {
    // Track ad click for analytics and revenue attribution
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'ad_click', {
        ad_position: position,
        ad_format: format,
        ad_sponsor: config.mockAd.sponsor,
        event_category: 'monetization'
      });
    }
    
    console.log('Ad clicked:', config.mockAd.sponsor);
  };

  const MockAd = () => {
    const ad = config.mockAd;
    
    if (config.height <= 50) {
      // Mobile banner ad
      return (
        <div 
          className="flex items-center justify-between p-2 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded cursor-pointer hover:from-blue-100 hover:to-indigo-100 transition-colors"
          onClick={handleAdClick}
        >
          <div className="flex-1">
            <div className="text-sm font-medium text-gray-900">{ad.title}</div>
          </div>
          <button className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700">
            {ad.cta}
          </button>
        </div>
      );
    }
    
    if (config.height <= 90) {
      // Leaderboard ad
      return (
        <div 
          className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded cursor-pointer hover:from-green-100 hover:to-emerald-100 transition-colors"
          onClick={handleAdClick}
        >
          <div className="flex-1">
            <div className="text-lg font-bold text-gray-900">{ad.title}</div>
            <div className="text-sm text-gray-600 mt-1">Sponsored by {ad.sponsor}</div>
          </div>
          <button className="px-6 py-2 bg-green-600 text-white font-medium rounded hover:bg-green-700">
            {ad.cta}
          </button>
        </div>
      );
    }
    
    // Rectangle or billboard ad
    return (
      <div 
        className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-lg overflow-hidden cursor-pointer hover:from-purple-100 hover:to-pink-100 transition-colors group"
        onClick={handleAdClick}
      >
        {ad.image && (
          <div className="aspect-w-16 aspect-h-9">
            <img 
              src={ad.image} 
              alt={ad.title}
              className="w-full h-32 object-cover group-hover:scale-105 transition-transform"
            />
          </div>
        )}
        <div className="p-4">
          <div className="font-bold text-gray-900 mb-2">{ad.title}</div>
          {ad.description && (
            <div className="text-sm text-gray-600 mb-3">{ad.description}</div>
          )}
          <div className="flex items-center justify-between">
            <div className="text-xs text-gray-500">Sponsored by {ad.sponsor}</div>
            <button className="px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded hover:bg-purple-700">
              {ad.cta}
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div 
      ref={adRef}
      className={`ad-container ${className}`}
      style={{ 
        width: config.width, 
        height: config.height,
        maxWidth: '100%'
      }}
      data-ad-position={position}
      data-ad-format={format}
    >
      {showLabel && (
        <div className="flex items-center justify-between mb-2">
          <Badge variant="outline" className="text-xs text-muted-foreground">
            <Info className="w-3 h-3 mr-1" />
            Sponsored
          </Badge>
          <div className="text-xs text-muted-foreground">
            {config.format}
          </div>
        </div>
      )}
      
      <MockAd />
      
      {showLabel && (
        <div className="mt-2 text-xs text-muted-foreground text-center">
          <Link href="/pricing" className="hover:text-accent">
            Remove ads with Pro
          </Link>
        </div>
      )}
    </div>
  );
}

// Higher-order component to conditionally show ads based on subscription
interface WithAdsProps {
  userTier?: 'free' | 'basic' | 'pro' | 'enterprise';
  children: React.ReactNode;
  adPosition: string;
  adFormat: string;
  className?: string;
}

export function WithAds({ 
  userTier = 'free', 
  children, 
  adPosition, 
  adFormat, 
  className 
}: WithAdsProps) {
  const shouldShowAds = userTier === 'free';
  
  if (!shouldShowAds) {
    return <>{children}</>;
  }
  
  return (
    <div className={`with-ads ${className}`}>
      <div className="mb-6">
        <AdComponent 
          position={adPosition} 
          format={adFormat}
          className="mx-auto"
        />
      </div>
      {children}
    </div>
  );
}

// Specific ad components for common positions
export function SidebarAd({ userTier }: { userTier?: string }) {
  if (userTier !== 'free') return null;
  
  return (
    <div className="mb-6">
      <AdComponent 
        position="sidebar-resume-builder" 
        format="300x250 Medium Rectangle"
        className="w-full max-w-[300px]"
      />
    </div>
  );
}

export function LeaderboardAd({ userTier }: { userTier?: string }) {
  if (userTier !== 'free') return null;
  
  return (
    <div className="mb-6">
      <AdComponent 
        position="between-templates" 
        format="728x90 Leaderboard"
        className="w-full max-w-[728px] mx-auto"
      />
    </div>
  );
}

export function MobileBannerAd({ userTier }: { userTier?: string }) {
  if (userTier !== 'free') return null;
  
  return (
    <div className="mb-4 md:hidden">
      <AdComponent 
        position="post-download" 
        format="320x50 Mobile Banner"
        className="w-full max-w-[320px] mx-auto"
      />
    </div>
  );
}

export function BillboardAd({ userTier }: { userTier?: string }) {
  if (userTier !== 'free') return null;
  
  return (
    <div className="mb-8">
      <AdComponent 
        position="jobs-page-top" 
        format="970x250 Billboard"
        className="w-full max-w-[970px] mx-auto"
      />
    </div>
  );
}

// Analytics and revenue tracking
export function trackAdRevenue(position: string, cpm: number, impressions: number) {
  const revenue = (cpm / 1000) * impressions;
  
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'ad_revenue', {
      ad_position: position,
      cpm,
      impressions,
      revenue,
      event_category: 'monetization'
    });
  }
  
  // Send to your analytics backend
  console.log(`Ad revenue: $${revenue.toFixed(2)} from ${impressions} impressions at ${position}`);
}
