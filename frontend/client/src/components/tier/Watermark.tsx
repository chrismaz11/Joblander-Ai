import { useTierLimits } from '@/hooks/useTierLimits';

interface WatermarkProps {
  children: React.ReactNode;
}

export function Watermark({ children }: WatermarkProps) {
  const { limits } = useTierLimits();

  if (!limits.watermark) {
    return <>{children}</>;
  }

  return (
    <div className="relative">
      {children}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-4 right-4 bg-gray-900/10 text-gray-600 px-3 py-1 rounded text-sm font-medium">
          Created with Job-Lander
        </div>
        <div className="absolute bottom-4 left-4 bg-gray-900/10 text-gray-600 px-3 py-1 rounded text-xs">
          Upgrade to remove watermark
        </div>
      </div>
    </div>
  );
}
