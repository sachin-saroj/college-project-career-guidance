import { Card } from "../ui/Card";
import type { LucideIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  iconBgColor?: string;
  iconColor?: string;
  progress?: number;
  linkText?: string;
  linkTo?: string;
}

export const StatCard = ({
  title,
  value,
  description,
  icon: Icon,
  progress,
  linkText,
  linkTo,
}: StatCardProps) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    if (linkTo) {
      navigate(linkTo);
    } else if (title.toLowerCase().includes("assessment")) {
      navigate("/assessment");
    } else if (title.toLowerCase().includes("career")) {
      navigate("/roadmaps");
    } else if (title.toLowerCase().includes("resource")) {
      navigate("/resources");
    } else if (title.toLowerCase().includes("profile")) {
      navigate("/profile");
    }
  };

  return (
    <Card 
      variant="stone" 
      hoverEffect 
      onClick={handleCardClick}
      className="flex flex-col h-full p-5 justify-between cursor-pointer group transition-all duration-200 hover:-translate-y-1 hover:border-[#17171c]/40 dark:hover:border-[#003c33]"
    >
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="font-mono text-[11px] uppercase tracking-wider text-slate group-hover:text-ink transition-colors">{title}</span>
          <div className="h-7 w-7 rounded bg-white dark:bg-[#18191e] border border-[#d9d9dd] dark:border-[#2a2c35] flex items-center justify-center text-[#17171c] dark:text-white group-hover:scale-110 transition-transform">
            <Icon size={14} />
          </div>
        </div>
        <p className="font-display text-4xl text-ink font-normal tracking-tight">
          {value}
        </p>
      </div>

      <div className="mt-4">
        {progress !== undefined && (
          <div className="w-full h-1.5 bg-[#d9d9dd] dark:bg-[#272730] rounded-full overflow-hidden mb-2">
            <div 
              className="h-full bg-[#003c33] dark:bg-[#6ee7b7] rounded-full transition-all duration-500 ease-out" 
              style={{ width: `${progress}%` }} 
            />
          </div>
        )}
        {description && (
          <p className="text-[12px] text-slate">{description}</p>
        )}
        {linkText && (
          <span className="text-[13px] font-medium text-ink dark:text-white group-hover:underline cursor-pointer inline-flex items-center gap-1 mt-1">
            {linkText} →
          </span>
        )}
      </div>
    </Card>
  );
};
