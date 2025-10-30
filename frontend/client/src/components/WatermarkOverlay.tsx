import React from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface WatermarkOverlayProps {
  children: React.ReactNode;
  text?: string;
}

export function WatermarkOverlay({ children, text = 'JOB-LANDER FREE' }: WatermarkOverlayProps) {
  const { user, shouldShowAds } = useAuth();
  
  if (!shouldShowAds()) {
    return <>{children}</>;
  }

  return (
    <div className="relative">
      {children}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div 
          className="text-gray-300 text-6xl font-bold opacity-20 transform rotate-45 select-none"
          style={{
            textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
            fontFamily: 'Arial, sans-serif',
            letterSpacing: '0.1em'
          }}
        >
          {text}
        </div>
      </div>
    </div>
  );
}

export function PDFWatermark({ enabled = true, text = 'JOB-LANDER FREE' }: { enabled?: boolean; text?: string }) {
  if (!enabled) return null;
  
  return (
    <div 
      className="absolute inset-0 pointer-events-none flex items-center justify-center z-50"
      style={{ 
        background: `repeating-linear-gradient(
          45deg,
          transparent,
          transparent 100px,
          rgba(0,0,0,0.02) 100px,
          rgba(0,0,0,0.02) 200px
        )`
      }}
    >
      <div className="text-gray-400 text-4xl font-bold opacity-30 transform rotate-45 select-none">
        {text}
      </div>
    </div>
  );
}
