"use client";

import React from "react";
import { cn } from "@/shared/utils/cn";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "elevated" | "outlined" | "ghost";
  padding?: "none" | "sm" | "md" | "lg";
  hover?: boolean;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    { className, variant = "default", padding = "md", hover = false, ...props },
    ref
  ) => {
    const variants = {
      default: "bg-white border border-gray-100 shadow-sm",
      elevated: "bg-white border border-gray-100 shadow-lg",
      outlined: "bg-transparent border-2 border-gray-200",
      ghost: "bg-gray-50/50 border border-gray-100",
    };

    const paddings = {
      none: "",
      sm: "p-4",
      md: "p-6",
      lg: "p-8",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "rounded-xl transition-all duration-200",
          variants[variant],
          paddings[padding],
          hover && "hover:shadow-lg hover:-translate-y-0.5 cursor-pointer",
          className
        )}
        {...props}
      />
    );
  }
);

Card.displayName = "Card";

// Card Header
interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
}

const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, title, subtitle, action, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("flex items-start justify-between gap-4 mb-4", className)}
        {...props}
      >
        <div className="flex-1 min-w-0">
          {title && (
            <h3 className="text-lg font-semibold text-gray-900 tracking-tight">
              {title}
            </h3>
          )}
          {subtitle && (
            <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
          )}
          {children}
        </div>
        {action && <div className="flex-shrink-0">{action}</div>}
      </div>
    );
  }
);

CardHeader.displayName = "CardHeader";

// Card Content
const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return <div ref={ref} className={cn("", className)} {...props} />;
});

CardContent.displayName = "CardContent";

// Card Footer
const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "flex items-center justify-between gap-4 mt-4 pt-4 border-t border-gray-100",
        className
      )}
      {...props}
    />
  );
});

CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardContent, CardFooter };
