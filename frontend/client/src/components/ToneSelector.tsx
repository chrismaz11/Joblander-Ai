import { cn } from "@/lib/utils";
import { Briefcase, Zap, Rocket } from "lucide-react";

export type Tone = "professional" | "concise" | "bold";

interface ToneSelectorProps {
  selectedTone: Tone;
  onToneChange: (tone: Tone) => void;
  className?: string;
}

interface ToneOption {
  value: Tone;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  color: string;
}

const toneOptions: ToneOption[] = [
  {
    value: "professional",
    label: "Professional",
    icon: Briefcase,
    description: "Formal, traditional business language",
    color: "text-primary",
  },
  {
    value: "concise",
    label: "Concise",
    icon: Zap,
    description: "Direct and to-the-point",
    color: "text-blue-600 dark:text-blue-400",
  },
  {
    value: "bold",
    label: "Bold",
    icon: Rocket,
    description: "Creative and confident",
    color: "text-purple-600 dark:text-purple-400",
  },
];

export function ToneSelector({
  selectedTone,
  onToneChange,
  className,
}: ToneSelectorProps) {
  return (
    <div className={cn("grid grid-cols-3 gap-4", className)}>
      {toneOptions.map((option) => {
        const Icon = option.icon;
        const isSelected = selectedTone === option.value;
        
        return (
          <button
            key={option.value}
            onClick={() => onToneChange(option.value)}
            data-testid={`button-tone-${option.value}`}
            className={cn(
              "relative flex flex-col items-center p-6 rounded-lg border-2 transition-all hover-elevate",
              isSelected
                ? "border-primary bg-primary/5"
                : "border-border hover:border-muted-foreground/50"
            )}
          >
            <Icon
              className={cn(
                "w-8 h-8 mb-3 transition-colors",
                isSelected ? option.color : "text-muted-foreground"
              )}
            />
            <h3 className={cn(
              "font-semibold text-lg mb-1",
              isSelected && "text-foreground"
            )}>
              {option.label}
            </h3>
            <p className="text-sm text-muted-foreground text-center">
              {option.description}
            </p>
            {isSelected && (
              <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-primary" />
            )}
          </button>
        );
      })}
    </div>
  );
}