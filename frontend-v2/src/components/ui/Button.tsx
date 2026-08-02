import { forwardRef } from "react";
import { cn } from "../../utils/cn";
import { motion } from "framer-motion";
import type { HTMLMotionProps } from "framer-motion";

export interface ButtonProps extends Omit<HTMLMotionProps<"button">, "type"> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "light";
  size?: "sm" | "md" | "lg" | "icon";
  type?: "button" | "submit" | "reset";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", type = "button", ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center rounded-button font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
    
    const variants = {
      primary: "bg-brand-primary text-white hover:bg-brand-accent shadow-sm",
      secondary: "bg-brand-secondary text-white hover:bg-brand-primary shadow-sm",
      outline: "border border-border bg-transparent hover:bg-brand-light text-brand-primary",
      ghost: "bg-transparent hover:bg-brand-light text-text-muted hover:text-brand-primary",
      light: "bg-brand-light text-brand-primary hover:bg-brand-primary hover:text-white"
    };

    const sizes = {
      sm: "h-32 px-16 text-small",
      md: "h-40 px-24 text-body",
      lg: "h-48 px-32 text-body",
      icon: "h-40 w-40",
    };

    return (
      <motion.button
        ref={ref}
        type={type}
        whileTap={{ scale: 0.98 }}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
