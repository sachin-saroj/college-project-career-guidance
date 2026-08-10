import { forwardRef } from "react";
import type { HTMLAttributes } from "react";
import { cn } from "../../utils/cn";

export interface BadgeProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "success" | "warning" | "danger" | "info" | "default" | "coral" | "dark" | "outline";
}

export const Badge = forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = "default", ...props }, ref) => {
    const variants = {
      default: "bg-[#eeece7] text-[#212121]",
      coral: "bg-[#ff7759]/10 text-[#ff7759] border border-[#ff7759]/20",
      success: "bg-[#edfce9] text-[#003c33] border border-[#003c33]/15",
      warning: "bg-[#ff7759]/10 text-[#ff7759]",
      danger: "bg-[#b30000]/10 text-[#b30000]",
      info: "bg-[#f1f5ff] text-[#1863dc] border border-[#1863dc]/15",
      dark: "bg-[#17171c] text-white border border-white/10",
      outline: "border border-[#d9d9dd] bg-transparent text-slate"
    };

    return (
      <div
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-sm px-2.5 py-1 text-[11px] font-mono tracking-wider uppercase transition-colors",
          variants[variant],
          className
        )}
        {...props}
      />
    );
  }
);

Badge.displayName = "Badge";

