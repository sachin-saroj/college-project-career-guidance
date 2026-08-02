import { forwardRef } from "react";
import type { HTMLAttributes } from "react";
import { cn } from "../../utils/cn";

export interface BadgeProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "success" | "warning" | "danger" | "info" | "default";
}

export const Badge = forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = "default", ...props }, ref) => {
    const variants = {
      success: "bg-status-success/10 text-status-success",
      warning: "bg-status-warning/10 text-status-warning",
      danger: "bg-status-danger/10 text-status-danger",
      info: "bg-status-info/10 text-status-info",
      default: "bg-brand-light text-brand-primary"
    };

    return (
      <div
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-button px-2.5 py-0.5 text-small font-semibold transition-colors",
          variants[variant],
          className
        )}
        {...props}
      />
    );
  }
);

Badge.displayName = "Badge";
