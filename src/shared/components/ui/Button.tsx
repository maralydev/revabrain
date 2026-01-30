"use client";

import React from "react";
import { cn } from "@/shared/utils/cn";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger" | "success";
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
      "inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]";

    const variants = {
      primary:
        "bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-500 shadow-sm hover:shadow-md",
      secondary:
        "bg-teal-500 text-white hover:bg-teal-600 focus-visible:ring-teal-500 shadow-sm hover:shadow-md",
      outline:
        "border-2 border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50 focus-visible:ring-gray-400",
      ghost:
        "text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus-visible:ring-gray-400",
      danger:
        "bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500 shadow-sm hover:shadow-md",
      success:
        "bg-green-600 text-white hover:bg-green-700 focus-visible:ring-green-500 shadow-sm hover:shadow-md",
    };

    const sizes = {
      sm: "h-9 px-3 text-sm",
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
