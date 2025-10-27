import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Palette, Type, Layout as LayoutIcon } from 'lucide-react';

interface ThemeCustomizerProps {
  options: {
    theme: string;
    font: string;
    layout: 'sidebar' | 'centered' | 'full-width';
    includeContactForm?: boolean;
    includeAnalytics?: boolean;
  };
  onChange: (options: any) => void;
  themes: Array<{ id: string; name: string; preview?: any }>;
  fonts: Array<{ id: string; name: string; family?: string }>;
  layouts: Array<{ id: string; name: string; description?: string }>;
}

export default function ThemeCustomizer({
  options,
  onChange,
  themes = [],
  fonts = [],
  layouts = []
}: ThemeCustomizerProps) {
  const handleThemeChange = (value: string) => {
    onChange({ ...options, theme: value });
  };

  const handleFontChange = (value: string) => {
    onChange({ ...options, font: value });
  };

  const handleLayoutChange = (value: string) => {
    onChange({ ...options, layout: value as 'sidebar' | 'centered' | 'full-width' });
  };

  // Default options if none provided
  const defaultThemes = [
    { id: 'professionalBlue', name: 'Professional Blue' },
    { id: 'modernDark', name: 'Modern Dark' },
    { id: 'minimalLight', name: 'Minimal Light' },
    { id: 'creativeGradient', name: 'Creative Gradient' },
    { id: 'techTerminal', name: 'Tech Terminal' }
  ];

  const defaultFonts = [
    { id: 'inter', name: 'Inter' },
    { id: 'space-grotesk', name: 'Space Grotesk' },
    { id: 'poppins', name: 'Poppins' },
    { id: 'helvetica', name: 'Helvetica' },
    { id: 'jetbrains', name: 'JetBrains Mono' }
  ];

  const defaultLayouts = [
    { id: 'centered', name: 'Centered', description: 'Classic centered layout' },
    { id: 'sidebar', name: 'Sidebar', description: 'Fixed sidebar navigation' },
    { id: 'full-width', name: 'Full Width', description: 'Edge-to-edge content' }
  ];

  const activeThemes = themes.length > 0 ? themes : defaultThemes;
  const activeFonts = fonts.length > 0 ? fonts : defaultFonts;
  const activeLayouts = layouts.length > 0 ? layouts : defaultLayouts;

  return (
    <div className="space-y-6">
      {/* Theme Selection */}
      <div className="space-y-2">
        <Label htmlFor="theme" className="flex items-center gap-2">
          <Palette className="h-4 w-4" />
          Color Theme
        </Label>
        <Select value={options.theme} onValueChange={handleThemeChange}>
          <SelectTrigger id="theme" data-testid="select-theme">
            <SelectValue placeholder="Select a theme" />
          </SelectTrigger>
          <SelectContent>
            {activeThemes.map(theme => (
              <SelectItem key={theme.id} value={theme.id}>
                <div className="flex items-center gap-2">
                  {(theme as any).preview?.primaryColor && (theme as any).preview?.backgroundColor && (
                    <div 
                      className="w-4 h-4 rounded-full border"
                      style={{ 
                        background: `linear-gradient(135deg, ${(theme as any).preview.primaryColor}, ${(theme as any).preview.backgroundColor})`
                      }}
                    />
                  )}
                  {theme.name}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Font Selection */}
      <div className="space-y-2">
        <Label htmlFor="font" className="flex items-center gap-2">
          <Type className="h-4 w-4" />
          Typography
        </Label>
        <Select value={options.font} onValueChange={handleFontChange}>
          <SelectTrigger id="font" data-testid="select-font">
            <SelectValue placeholder="Select a font" />
          </SelectTrigger>
          <SelectContent>
            {activeFonts.map(font => (
              <SelectItem 
                key={font.id} 
                value={font.id}
                style={{ fontFamily: (font as any).family || 'inherit' }}
              >
                {font.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Layout Selection */}
      <div className="space-y-2">
        <Label htmlFor="layout" className="flex items-center gap-2">
          <LayoutIcon className="h-4 w-4" />
          Layout Style
        </Label>
        <Select value={options.layout} onValueChange={handleLayoutChange}>
          <SelectTrigger id="layout" data-testid="select-layout">
            <SelectValue placeholder="Select a layout" />
          </SelectTrigger>
          <SelectContent>
            {activeLayouts.map(layout => (
              <SelectItem key={layout.id} value={layout.id}>
                <div>
                  <div className="font-medium">{layout.name}</div>
                  {layout.description && (
                    <div className="text-xs text-muted-foreground">
                      {layout.description}
                    </div>
                  )}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Theme Preview Cards */}
      <div className="pt-4">
        <Label className="text-xs text-muted-foreground mb-3 block">Theme Preview</Label>
        <div className="grid grid-cols-2 gap-2">
          {activeThemes.map(theme => (
            <Card
              key={theme.id}
              className={`p-3 cursor-pointer transition-all ${
                options.theme === theme.id ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => handleThemeChange(theme.id)}
              data-testid={`theme-card-${theme.id}`}
            >
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  {getThemeColors(theme.id).map((color, i) => (
                    <div
                      key={i}
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
                <span className="text-xs font-medium">{theme.name}</span>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

// Helper function to get theme preview colors
function getThemeColors(themeId: string): string[] {
  const themeColors: Record<string, string[]> = {
    professionalBlue: ['#1e40af', '#3b82f6', '#06b6d4'],
    modernDark: ['#8b5cf6', '#a78bfa', '#f59e0b'],
    minimalLight: ['#000000', '#6b7280', '#ef4444'],
    creativeGradient: ['#ec4899', '#f43f5e', '#06b6d4'],
    techTerminal: ['#10b981', '#34d399', '#facc15']
  };
  return themeColors[themeId] || ['#666', '#999', '#ccc'];
}