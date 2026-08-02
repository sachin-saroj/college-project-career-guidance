import { forwardRef } from "react";
import type { InputHTMLAttributes } from "react";
import { cn } from "../../utils/cn";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, icon, ...props }, ref) => {
    return (
      <div className="relative flex items-center w-full">
        {icon && (
          <div className="absolute left-16 text-text-muted">
            {icon}
          </div>
        )}
        <input
          ref={ref}
          className={cn(
            "flex h-48 w-full rounded-input border border-border bg-white px-16 text-body text-text-main transition-colors file:border-0 file:bg-transparent file:text-body file:font-medium placeholder:text-text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary disabled:cursor-not-allowed disabled:opacity-50",
            icon && "pl-48",
            className
          )}
          {...props}
        />
      </div>
    );
  }
);

Input.displayName = "Input";
