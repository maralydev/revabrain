"use client";

import React from "react";
import { cn } from "@/shared/utils/cn";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger" | "success" | "premium";
  size?: "sm" | "md" | "lg" | "icon";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      asChild = false,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center gap-2 font-medium rounded-xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]";

    const variants = {
      primary:
        "bg-[var(--rb-primary)] text-white hover:bg-[var(--rb-primary-dark)] focus-visible:ring-[var(--rb-primary)] shadow-md shadow-[var(--rb-primary)]/20 hover:shadow-lg hover:shadow-[var(--rb-primary)]/30",
      secondary:
        "bg-[var(--rb-accent)] text-[var(--rb-dark)] hover:bg-[var(--rb-accent-dark)] focus-visible:ring-[var(--rb-accent)] shadow-md shadow-[var(--rb-accent)]/20 hover:shadow-lg hover:shadow-[var(--rb-accent)]/30",
      outline:
        "border-2 border-gray-200 bg-white text-gray-700 hover:border-[var(--rb-primary)] hover:text-[var(--rb-primary)] hover:bg-[var(--rb-light)] focus-visible:ring-[var(--rb-primary)]",
      ghost:
        "text-gray-600 hover:text-[var(--rb-primary)] hover:bg-[var(--rb-light)] focus-visible:ring-[var(--rb-primary)]",
      danger:
        "bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500 shadow-md shadow-red-500/20 hover:shadow-lg hover:shadow-red-500/30",
      success:
        "bg-emerald-600 text-white hover:bg-emerald-700 focus-visible:ring-emerald-500 shadow-md shadow-emerald-500/20 hover:shadow-lg hover:shadow-emerald-500/30",
      premium:
        "bg-gradient-to-r from-[var(--rb-primary)] to-[var(--rb-primary-dark)] text-white hover:from-[var(--rb-primary-dark)] hover:to-[var(--rb-primary)] focus-visible:ring-[var(--rb-primary)] shadow-lg shadow-[var(--rb-primary)]/25 hover:shadow-xl hover:shadow-[var(--rb-primary)]/35",
    };

    const sizes = {
      sm: "h-9 px-4 text-xs",
      md: "h-11 px-5 text-sm",
      lg: "h-12 px-6 text-base",
      icon: "h-10 w-10 p-2",
    };

    // If asChild is true, we just render the children with the classes
    if (asChild && React.isValidElement(children)) {
      const childProps = children.props as { className?: string };
      return React.cloneElement(children, {
        className: cn(
          baseStyles,
          variants[variant],
          sizes[size],
          fullWidth && "w-full",
          className,
          childProps.className
        ),
        ...props,
      } as React.Attributes);
    }

    return (
      <button
        ref={ref}
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          fullWidth && "w-full",
          className
        )}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <>
            <LoadingSpinner className="w-4 h-4" />
            {children}
          </>
        ) : (
          <>
            {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };

// Loading Spinner Component
function LoadingSpinner({ className }: { className?: string }) {
  return (
    <svg
      className={cn("animate-spin", className)}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}

// Icon Button Component
interface IconButtonProps extends Omit<ButtonProps, "leftIcon" | "rightIcon" | "size"> {
  icon: React.ReactNode;
  label: string;
  size?: "sm" | "md" | "lg";
}

const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ icon, label, size = "md", className, ...props }, ref) => {
    const sizes = {
      sm: "h-8 w-8",
      md: "h-10 w-10",
      lg: "h-12 w-12",
    };

    return (
      <Button
        ref={ref}
        size="icon"
        className={cn(sizes[size], className)}
        aria-label={label}
        {...props}
      >
        {icon}
      </Button>
    );
  }
);

IconButton.displayName = "IconButton";

export { IconButton };
