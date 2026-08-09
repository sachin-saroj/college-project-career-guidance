import { forwardRef } from "react";
import { cn } from "../../utils/cn";

export interface SwitchProps extends React.InputHTMLAttributes<HTMLInputElement> {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(
  ({ className, checked, onCheckedChange, ...props }, ref) => {
    return (
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onCheckedChange?.(!checked)}
        className={cn(
          "relative inline-flex h-24 w-44 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50",
          checked ? "bg-brand-primary" : "bg-gray-200",
          className
        )}
      >
        <span
          className={cn(
            "pointer-events-none block h-20 w-20 rounded-full bg-white shadow-lg ring-0 transition-transform",
            checked ? "translate-x-20" : "translate-x-0"
          )}
        />
        {/* Hidden input for form integration if needed */}
        <input
          type="checkbox"
          ref={ref}
          className="hidden"
          checked={checked}
          onChange={(e) => onCheckedChange?.(e.target.checked)}
          {...props}
        />
      </button>
    );
  }
);

Switch.displayName = "Switch";
