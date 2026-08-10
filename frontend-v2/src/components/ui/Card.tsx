import { forwardRef } from 'react';
import type { HTMLAttributes } from 'react';
import { cn } from '../../utils/cn';
import { motion } from 'framer-motion';
import type { HTMLMotionProps } from 'framer-motion';

export interface CardProps extends HTMLMotionProps<"div"> {
  hoverEffect?: boolean;
  variant?: "canvas" | "stone" | "dark" | "navy";
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, hoverEffect = false, variant = "canvas", ...props }, ref) => {
    const variantStyles = {
      canvas: "bg-white border border-[#e5e7eb] text-ink",
      stone: "bg-[#eeece7] border border-[#d9d9dd] text-ink",
      dark: "bg-[#003c33] border border-white/10 text-white",
      navy: "bg-[#071829] border border-white/10 text-white"
    };

    return (
      <motion.div
        ref={ref}
        whileHover={hoverEffect ? { y: -2 } : {}}
        transition={{ duration: 0.2, ease: [0.22, 0.61, 0.36, 1] as const }}
        className={cn(
          "rounded-[22px] overflow-hidden transition-all duration-200",
          variantStyles[variant],
          hoverEffect && "hover:border-[#93939f] cursor-pointer",
          className
        )}
        {...props}
      />
    );
  }
);

Card.displayName = 'Card';

export const CardHeader = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("p-6 pb-4 flex flex-col space-y-1.5", className)} {...props} />
);

export const CardTitle = ({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) => (
  <h3 className={cn("font-display text-xl font-normal tracking-tight text-current", className)} {...props} />
);

export const CardContent = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("p-6 pt-0", className)} {...props} />
);

