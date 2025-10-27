import React, { useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface AdBannerProps {
  slot: string;
  format?: 'banner' | 'rectangle' | 'leaderboard' | 'mobile';
  className?: string;
}

const adFormats = {
  banner: { width: 728, height: 90 },
  rectangle: { width: 300, height: 250 },
  leaderboard: { width: 970, height: 250 },
  mobile: { width: 320, height: 50 }
};

export function AdBanner({ slot, format = 'rectangle', className = '' }: AdBannerProps) {
  const { shouldShowAds } = useAuth();
  const adRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!shouldShowAds() || !adRef.current) return;
    
    // Mock ad implementation - replace with Google AdSense
    const mockAd = () => {
      if (adRef.current) {
        const { width, height } = adFormats[format];
        adRef.current.innerHTML = `
          <div style="
            width: ${width}px; 
            height: ${height}px; 
            background: linear-gradient(135deg, #667eea, #764ba2);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-family: Arial, sans-serif;
            font-size: 14px;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          ">
            <div style="text-align: center;">
              <div style="font-weight: bold; margin-bottom: 4px;">Sponsored</div>
              <div style="font-size: 12px; opacity: 0.9;">Upgrade to remove ads</div>
            </div>
          </div>
        `;
      }
    };
    
    // Simulate ad loading delay
    const timer = setTimeout(mockAd, 500);
    return () => clearTimeout(timer);
  }, [shouldShowAds, format]);
  
  if (!shouldShowAds()) {
    return null;
  }

  return (
    <div className={`ad-banner ${className}`}>
      <div className="text-xs text-gray-500 mb-1">Advertisement</div>
      <div ref={adRef} className="flex justify-center" />
    </div>
  );
}

export function SidebarAd() {
  return (
    <AdBanner 
      slot="sidebar-ad" 
      format="rectangle" 
      className="mb-6 sticky top-4"
    />
  );
}

export function HeaderAd() {
  return (
    <AdBanner 
      slot="header-ad" 
      format="leaderboard" 
      className="mb-4"
    />
  );
}

export function MobileAd() {
  return (
    <AdBanner 
      slot="mobile-ad" 
      format="mobile" 
      className="mb-4 md:hidden"
    />
  );
}
