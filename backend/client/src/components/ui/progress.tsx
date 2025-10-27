import { twMerge } from "tailwind-merge";

interface ProgressProps {
  value: number;
  max?: number;
  className?: string;
}

export const Progress = ({ value, max = 100, className }: ProgressProps) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div
      className={twMerge(
        "relative h-2 w-full overflow-hidden rounded-full bg-muted/40",
        className,
      )}
    >
      <span
        className="absolute left-0 top-0 h-full rounded-full bg-primary transition-[width] duration-700 ease-out"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
};
