import { cva, type VariantProps } from "class-variance-authority";
import { twMerge } from "tailwind-merge";

const badgeStyles = cva(
  "inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium tracking-wide uppercase",
  {
    variants: {
      variant: {
        default: "bg-primary/15 text-primary border border-primary/30",
        accent: "bg-accent/20 text-accent-foreground border border-accent/30",
        outline: "border border-border text-muted-foreground",
        subtle: "bg-muted/35 text-muted-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export type BadgeProps = React.HTMLAttributes<HTMLSpanElement> &
  VariantProps<typeof badgeStyles>;

export const Badge = ({ className, variant, ...props }: BadgeProps) => (
  <span className={twMerge(badgeStyles({ variant }), className)} {...props} />
);
