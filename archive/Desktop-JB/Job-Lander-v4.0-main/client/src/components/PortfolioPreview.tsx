import { useEffect, useRef, useState } from 'react';
import { Loader2, RefreshCw, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PortfolioPreviewProps {
  resumeId: string;
  options: {
    theme: string;
    font: string;
    layout: string;
    includeContactForm?: boolean;
    includeAnalytics?: boolean;
  };
}

export default function PortfolioPreview({ resumeId, options }: PortfolioPreviewProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const previewUrl = `/api/portfolio/preview/${resumeId}?theme=${options.theme}&font=${options.font}&layout=${options.layout}`;

  useEffect(() => {
    setIsLoading(true);
    setError(null);
    
    // Add a small delay to show loading state for better UX
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [resumeId, options]);

  const handleRefresh = () => {
    if (iframeRef.current) {
      iframeRef.current.src = previewUrl;
      setIsLoading(true);
      setTimeout(() => setIsLoading(false), 500);
    }
  };

  const handleOpenNewTab = () => {
    window.open(previewUrl, '_blank');
  };

  const handleIframeError = () => {
    setError('Failed to load preview. Please try again.');
    setIsLoading(false);
  };

  const handleIframeLoad = () => {
    setIsLoading(false);
    setError(null);
    
    // Inject responsive viewport meta tag and scale the content
    if (iframeRef.current && iframeRef.current.contentDocument) {
      const doc = iframeRef.current.contentDocument;
      const viewport = doc.querySelector('meta[name="viewport"]');
      if (!viewport) {
        const meta = doc.createElement('meta');
        meta.name = 'viewport';
        meta.content = 'width=device-width, initial-scale=0.75';
        doc.head.appendChild(meta);
      }
    }
  };

  return (
    <div className="relative h-full min-h-[600px]">
      {/* Preview Controls */}
      <div className="absolute top-4 right-4 z-10 flex gap-2">
        <Button
          size="sm"
          variant="secondary"
          onClick={handleRefresh}
          className="shadow-lg"
          data-testid="button-refresh-preview"
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
        <Button
          size="sm"
          variant="secondary"
          onClick={handleOpenNewTab}
          className="shadow-lg"
          data-testid="button-open-new-tab"
        >
          <ExternalLink className="h-4 w-4" />
        </Button>
      </div>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center z-20 rounded-lg">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Loading preview...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="absolute inset-0 bg-background flex items-center justify-center z-20 rounded-lg">
          <div className="text-center">
            <p className="text-destructive mb-4">{error}</p>
            <Button onClick={handleRefresh} variant="outline">
              Try Again
            </Button>
          </div>
        </div>
      )}

      {/* Device Frame */}
      <div className="h-full bg-gradient-to-br from-muted/50 to-muted rounded-lg p-4">
        <div className="h-full bg-background rounded-lg shadow-2xl overflow-hidden">
          {/* Browser Chrome */}
          <div className="bg-muted px-4 py-2 border-b flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 bg-red-500 rounded-full" />
              <div className="w-3 h-3 bg-yellow-500 rounded-full" />
              <div className="w-3 h-3 bg-green-500 rounded-full" />
            </div>
            <div className="flex-1 px-3">
              <div className="bg-background rounded-sm px-3 py-1 text-xs text-muted-foreground">
                portfolio-preview.vercel.app
              </div>
            </div>
          </div>

          {/* Iframe Container */}
          <div className="h-[calc(100%-40px)] bg-white">
            <iframe
              ref={iframeRef}
              src={previewUrl}
              className="w-full h-full border-0"
              title="Portfolio Preview"
              onLoad={handleIframeLoad}
              onError={handleIframeError}
              sandbox="allow-same-origin allow-scripts allow-forms"
              data-testid="iframe-portfolio-preview"
            />
          </div>
        </div>
      </div>
    </div>
  );
}