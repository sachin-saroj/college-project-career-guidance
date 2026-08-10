import React from "react";
import { motion } from "framer-motion";

interface LogoProps {
  collapsed?: boolean;
  size?: "sm" | "md" | "lg" | "xl";
  showTagline?: boolean;
  className?: string;
  variant?: "light" | "dark" | "auto";
}

export const Logo: React.FC<LogoProps> = ({ 
  collapsed = false, 
  size = "md", 
  showTagline = true, 
  className = "",
  variant = "auto"
}) => {
  // Sizing presets for expanded state
  const iconSizeClass = collapsed
    ? "w-10 h-10 min-w-[40px]"
    : size === "sm" ? "w-9 h-9 min-w-[36px]"
    : size === "lg" ? "w-16 h-16 min-w-[64px]"
    : size === "xl" ? "w-20 h-20 min-w-[80px]"
    : "w-11 h-11 min-w-[44px]";

  const titleSizeClass = 
    size === "sm" ? "text-base" : 
    size === "lg" ? "text-3xl" : 
    size === "xl" ? "text-4xl" : "text-xl";

  const taglineSizeClass = 
    size === "sm" ? "text-[8px]" : 
    size === "lg" ? "text-[11px]" : 
    size === "xl" ? "text-[12px]" : "text-[9px]";

  return (
    <div className={`flex items-center select-none ${collapsed ? "justify-center w-full" : "gap-3"} ${className}`}>
      {/* Official CareerSathi Circular Teal Emblem */}
      <motion.div 
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        className={`relative ${iconSizeClass} shrink-0 cursor-pointer flex items-center justify-center rounded-full bg-white p-0.5 shadow-md border-2 border-[#00a4b4]/40 overflow-hidden group`}
      >
        <img 
          src="/careersathi-official-logo.png" 
          alt="CareerSathi Official Logo" 
          className="w-full h-full object-contain rounded-full transform scale-105 group-hover:scale-115 transition-transform duration-300"
        />
      </motion.div>

      {/* Official Typography & Tagline */}
      {!collapsed && (
        <div className="flex flex-col justify-center overflow-hidden">
          <div className="flex items-center leading-none tracking-tight">
            <h1 className={`font-display ${titleSizeClass} font-bold tracking-tight ${
              variant === "dark" ? "text-white" : "text-[#2d3142] dark:text-white"
            }`}>
              Career<span className="text-[#00a4b4]">Sathi</span>
            </h1>
          </div>

          {showTagline && (
            <span className={`font-mono ${taglineSizeClass} tracking-[0.16em] uppercase font-bold mt-1 truncate ${
              variant === "dark" ? "text-teal-200/90" : "text-[#75758a] dark:text-slate-300"
            }`}>
              STEP BY STEP TO SUCCESS
            </span>
          )}
        </div>
      )}
    </div>
  );
};
