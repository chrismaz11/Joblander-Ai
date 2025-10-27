import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { twMerge } from "tailwind-merge";

export const Avatar = AvatarPrimitive.Root;

export const AvatarImage = ({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Image>) => (
  <AvatarPrimitive.Image
    className={twMerge("h-full w-full rounded-full object-cover", className)}
    {...props}
  />
);

export const AvatarFallback = ({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Fallback>) => (
  <AvatarPrimitive.Fallback
    className={twMerge(
      "flex h-full w-full items-center justify-center rounded-full bg-muted/50 text-sm font-semibold uppercase tracking-wide text-primary",
      className,
    )}
    {...props}
  />
);
