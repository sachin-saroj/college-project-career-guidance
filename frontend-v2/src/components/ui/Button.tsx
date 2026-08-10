import { forwardRef } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "../../utils/cn";
import { motion } from "framer-motion";
import type { HTMLMotionProps } from "framer-motion";

export interface ButtonProps extends Omit<HTMLMotionProps<"button">, "type"> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "light" | "dark-pill";
  size?: "sm" | "md" | "lg" | "icon";
  type?: "button" | "submit" | "reset";
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", type = "button", isLoading, children, ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 disabled:opacity-50 disabled:pointer-events-none whitespace-nowrap shrink-0";
    
    const variants = {
      primary: "bg-[#17171c] text-white hover:bg-black rounded-full shadow-none border border-transparent",
      secondary: "bg-transparent text-ink hover:opacity-80 rounded-md shadow-none",
      outline: "border border-[#d9d9dd] bg-transparent hover:bg-black/5 text-ink rounded-full",
      ghost: "bg-transparent hover:bg-black/5 text-slate hover:text-ink rounded-md",
      light: "bg-[#eeece7] text-ink hover:bg-[#e2e0d9] rounded-full",
      "dark-pill": "bg-white text-[#17171c] hover:bg-white/90 rounded-full"
    };

    const sizes = {
      sm: "h-[32px] px-4 text-[13px]",
      md: "h-[40px] px-5 text-[14px]",
      lg: "h-[48px] px-6 text-[15px]",
      icon: "h-[40px] w-[40px] p-0 rounded-full flex items-center justify-center shrink-0",
    };

    return (
      <motion.button
        ref={ref}
        type={type}
        whileTap={{ scale: 0.98 }}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {children as any}
      </motion.button>
    );
  }
);

Button.displayName = "Button";

