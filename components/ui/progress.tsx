"use client";

import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";

import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const progressRootVariants = cva(
  "relative h-2 w-full overflow-hidden rounded-full",
  {
    variants: {
      variant: {
        default: "bg-primary/20",
        red: "bg-red-600/20",
        pink: "bg-pink-600/20",
        rose: "bg-rose-600/20",
        orange: "bg-orange-600/20",
        amber: "bg-amber-600/20",
        yellow: "bg-yellow-600/20",
        lime: "bg-lime-600/20",
        green: "bg-green-600/20",
        emerald: "bg-emerald-600/20",
        teal: "bg-teal-600/20",
        blue: "bg-blue-600/20",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const progressIndicatorVariants = cva("flex-1 w-full h-full transition-all", {
  variants: {
    variant: {
      default: "bg-primary",
      red: "bg-red-600",
      pink: "bg-pink-600",
      rose: "bg-rose-600",
      orange: "bg-orange-600",
      amber: "bg-amber-600",
      yellow: "bg-yellow-600",
      lime: "bg-lime-600",
      green: "bg-green-600",
      emerald: "bg-emerald-600",
      teal: "bg-teal-600",
      blue: "bg-blue-600",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

const calculateVariant = (value: number | null | undefined) => {
  if (value === undefined || value === null) return "default";
  if (value === 0) return "default";
  if (value < 10) return "red";
  if (value < 20) return "rose";
  if (value < 30) return "pink";
  if (value < 40) return "orange";
  if (value < 50) return "amber";
  if (value < 60) return "yellow";
  if (value < 70) return "lime";
  if (value < 80) return "green";
  if (value < 90) return "emerald";
  if (value < 100) return "teal";
  if (value === 100) return "blue";
};

export interface ProgressProps
  extends VariantProps<typeof progressRootVariants>,
    React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value, variant, ...props }, ref) => {
    const computedVariant = variant || calculateVariant(value);
    return (
      <ProgressPrimitive.Root
        ref={ref}
        className={cn(
          progressRootVariants({ variant: computedVariant }),
          className
        )}
        {...props}
      >
        <ProgressPrimitive.Indicator
          className={cn(
            progressIndicatorVariants({ variant: computedVariant })
          )}
          style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
        />
      </ProgressPrimitive.Root>
    );
  }
);
Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };
