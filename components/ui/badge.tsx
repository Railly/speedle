import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-primary/10",
        destructive:
          "border-transparent bg-destructive/10 text-destructive shadow hover:bg-destructive/20",
        success:
          "border-transparent bg-success/10 text-success shadow hover:bg-success/20",
        purple:
          "border-transparent bg-purple-600/10 text-purple-600 shadow hover:bg-purple-600/20",
        cyan: "border-transparent bg-cyan-600/10 text-cyan-600 shadow hover:bg-cyan-600/20",
        amber:
          "border-transparent bg-amber-600/10 text-amber-600 shadow hover:bg-amber-600/20",
        outline: "text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
