import { forwardRef } from "react";
import { twMerge } from "tailwind-merge";

export const Card = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={twMerge(
      "rounded-2xl border border-border/60 bg-card/80 backdrop-blur-sm shadow-[0_20px_60px_-25px_rgba(15,30,55,0.45)] transition hover:border-border hover:shadow-glow",
      className,
    )}
    {...props}
  />
));

Card.displayName = "Card";

export const CardHeader = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={twMerge("p-6 pb-0 flex flex-col gap-2", className)}
    {...props}
  />
));

CardHeader.displayName = "CardHeader";

export const CardContent = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={twMerge("p-6 pt-4", className)} {...props} />
));

CardContent.displayName = "CardContent";
