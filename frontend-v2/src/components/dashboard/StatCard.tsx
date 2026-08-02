import { Card, CardContent } from "../ui/Card";
import { cn } from "../../utils/cn";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  iconBgColor: string;
  iconColor: string;
  progress?: number;
  linkText?: string;
}

export const StatCard = ({
  title,
  value,
  description,
  icon: Icon,
  iconBgColor,
  iconColor,
  progress,
  linkText,
}: StatCardProps) => {
  return (
    <Card hoverEffect className="flex flex-col h-full">
      <CardContent className="p-24 flex-1 flex flex-col justify-between">
        <div className="flex items-start gap-16 mb-24">
          <div
            className={cn("h-48 w-48 rounded-2xl flex items-center justify-center shrink-0")}
            style={{ backgroundColor: iconBgColor, color: iconColor }}
          >
            <Icon size={24} />
          </div>
          <div>
            <h3 className="text-small text-text-muted font-medium mb-4">{title}</h3>
            <p className="text-h3 text-text-main leading-none">
              {value}
            </p>
          </div>
        </div>

        <div>
          {progress !== undefined && (
            <div className="w-full h-6 bg-brand-light rounded-full overflow-hidden mb-8">
              <div 
                className="h-full bg-status-success rounded-full transition-all duration-500 ease-out" 
                style={{ width: `${progress}%` }} 
              />
            </div>
          )}
          {description && (
            <p className="text-small text-text-muted">{description}</p>
          )}
          {linkText && (
            <a href="#" className="text-small font-semibold text-brand-primary hover:text-brand-accent transition-colors">
              {linkText}
            </a>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
