import { forwardRef } from "react";
import { cn } from "../../utils/cn";

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  initials?: string;
  size?: "sm" | "md" | "lg";
}

export const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, src, alt, initials, size = "md", ...props }, ref) => {
    const sizes = {
      sm: "h-32 w-32 text-small",
      md: "h-40 w-40 text-body",
      lg: "h-48 w-48 text-card-title",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "relative flex shrink-0 overflow-hidden rounded-full bg-brand-light text-brand-primary font-medium items-center justify-center border border-border",
          sizes[size],
          className
        )}
        {...props}
      >
        {src ? (
          <img
            src={src}
            alt={alt || "Avatar"}
            className="aspect-square h-full w-full object-cover"
          />
        ) : (
          initials || "??"
        )}
      </div>
    );
  }
);

Avatar.displayName = "Avatar";
