import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { twMerge } from "tailwind-merge";
import { forwardRef } from "react";

const buttonStyles = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-60",
  {
    variants: {
      variant: {
        primary:
          "bg-primary text-primary-foreground shadow-glow hover:bg-primary/90",
        secondary:
          "bg-muted text-muted-foreground hover:bg-muted/70 border border-border",
        outline:
          "border border-border bg-transparent text-primary hover:border-primary hover:bg-primary/10",
        ghost:
          "bg-transparent text-muted-foreground hover:text-primary hover:bg-muted/40",
        accent:
          "bg-accent text-accent-foreground hover:bg-accent/90 shadow-glow",
      },
      size: {
        sm: "h-9 px-3",
        md: "h-11 px-5",
        lg: "h-12 px-6 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonStyles> {
  asChild?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        className={twMerge(buttonStyles({ variant, size }), className)}
        {...props}
      />
    );
  },
);

Button.displayName = "Button";
