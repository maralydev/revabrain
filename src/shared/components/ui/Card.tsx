"use client";

import React from "react";
import { cn } from "@/shared/utils/cn";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "elevated" | "outlined" | "ghost" | "premium";
  padding?: "none" | "sm" | "md" | "lg";
  hover?: boolean;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    { className, variant = "default", padding = "md", hover = false, ...props },
    ref
  ) => {
    const variants = {
      default: "bg-white border border-gray-100 shadow-[var(--shadow-card)]",
      elevated: "bg-white border border-gray-100 shadow-[var(--shadow-lg)]",
      outlined: "bg-transparent border-2 border-gray-200",
      ghost: "bg-gray-50/80 border border-gray-100",
      premium: "bg-white border border-gray-100 shadow-[var(--shadow-card)] relative overflow-hidden",
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
          "rounded-xl transition-all duration-300",
          variants[variant],
          paddings[padding],
          hover && "hover:shadow-[var(--shadow-card-hover)] hover:-translate-y-0.5 cursor-pointer",
          className
        )}
        {...props}
      >
        {variant === "premium" && (
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[var(--rb-primary)] via-[var(--rb-accent)] to-[var(--rb-primary)]" />
        )}
        {props.children}
      </div>
    );
  }
);

Card.displayName = "Card";

// Card Header - Modern styling
interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
  icon?: React.ReactNode;
}

const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, title, subtitle, action, icon, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("flex items-start justify-between gap-4 mb-5", className)}
        {...props}
      >
        <div className="flex items-start gap-3 flex-1 min-w-0">
          {icon && (
            <div className="w-10 h-10 rounded-xl bg-[var(--rb-light)] flex items-center justify-center flex-shrink-0">
              {icon}
            </div>
          )}
          <div className="flex-1 min-w-0">
            {title && (
              <h3 className="text-lg font-semibold text-gray-900 tracking-tight">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="mt-0.5 text-sm text-gray-500">{subtitle}</p>
            )}
            {children}
          </div>
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
        "flex items-center justify-between gap-4 mt-5 pt-5 border-t border-gray-100",
        className
      )}
      {...props}
    />
  );
});

CardFooter.displayName = "CardFooter";

// Stat Card - For dashboard statistics
interface StatCardProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  value: string | number;
  trend?: {
    value: number;
    label: string;
    positive?: boolean;
  };
  icon?: React.ReactNode;
  color?: "primary" | "success" | "warning" | "info" | "default";
}

const StatCard = React.forwardRef<HTMLDivElement, StatCardProps>(
  ({ className, label, value, trend, icon, color = "primary", ...props }, ref) => {
    const colorStyles = {
      primary: {
        bg: "bg-[var(--rb-light)]",
        icon: "text-[var(--rb-primary)]",
        trend: "text-[var(--rb-primary)]",
      },
      success: {
        bg: "bg-emerald-50",
        icon: "text-emerald-600",
        trend: "text-emerald-600",
      },
      warning: {
        bg: "bg-amber-50",
        icon: "text-amber-600",
        trend: "text-amber-600",
      },
      info: {
        bg: "bg-purple-50",
        icon: "text-purple-600",
        trend: "text-purple-600",
      },
      default: {
        bg: "bg-gray-100",
        icon: "text-gray-600",
        trend: "text-gray-600",
      },
    };

    const styles = colorStyles[color];

    return (
      <div
        ref={ref}
        className={cn(
          "bg-white rounded-xl p-6 border border-gray-100 shadow-[var(--shadow-card)]",
          "hover:shadow-[var(--shadow-card-hover)] hover:-translate-y-0.5",
          "transition-all duration-300",
          className
        )}
        {...props}
      >
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">{label}</p>
            <p className="text-3xl font-bold text-gray-900 mt-2 tracking-tight">{value}</p>
            {trend && (
              <div className="flex items-center gap-1.5 mt-2">
                <span
                  className={cn(
                    "text-xs font-semibold px-2 py-0.5 rounded-full",
                    trend.positive ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
                  )}
                >
                  {trend.positive ? "+" : ""}{trend.value}%
                </span>
                <span className="text-xs text-gray-400">{trend.label}</span>
              </div>
            )}
          </div>
          {icon && (
            <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", styles.bg)}>
              <span className={styles.icon}>{icon}</span>
            </div>
          )}
        </div>
      </div>
    );
  }
);

StatCard.displayName = "StatCard";

export { Card, CardHeader, CardContent, CardFooter, StatCard };
