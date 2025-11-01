import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Lightbulb } from 'lucide-react';

interface AITooltipProps {
  children: React.ReactNode;
  feature: string;
  description: string;
}

export function AITooltip({ children, feature, description }: AITooltipProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent className="max-w-xs">
          <div className="flex items-start gap-2">
            <Lightbulb className="h-4 w-4 text-yellow-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-sm">{feature}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{description}</p>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}