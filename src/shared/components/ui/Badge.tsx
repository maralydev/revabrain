"use client";

import React from "react";
import { cn } from "@/shared/utils/cn";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?:
    | "default"
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "danger"
    | "info"
    | "outline";
  size?: "sm" | "md";
  dot?: boolean;
  dotColor?: string;
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      className,
      variant = "default",
      size = "md",
      dot = false,
      dotColor,
      children,
      ...props
    },
    ref
  ) => {
    const variants = {
      default: "bg-gray-100 text-gray-700 border-gray-200",
      primary: "bg-blue-50 text-blue-700 border-blue-200",
      secondary: "bg-teal-50 text-teal-700 border-teal-200",
      success: "bg-green-50 text-green-700 border-green-200",
      warning: "bg-amber-50 text-amber-700 border-amber-200",
      danger: "bg-red-50 text-red-700 border-red-200",
      info: "bg-purple-50 text-purple-700 border-purple-200",
      outline: "bg-transparent border-gray-300 text-gray-600",
    };

    const sizes = {
      sm: "px-2 py-0.5 text-xs",
      md: "px-2.5 py-1 text-sm",
    };

    const dotColors = {
      default: "bg-gray-500",
      primary: "bg-blue-500",
      secondary: "bg-teal-500",
      success: "bg-green-500",
      warning: "bg-amber-500",
      danger: "bg-red-500",
      info: "bg-purple-500",
    };

    return (
      <span
        ref={ref}
        className={cn(
          "inline-flex items-center gap-1.5 font-medium rounded-full border",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {dot && (
          <span
            className={cn(
              "w-1.5 h-1.5 rounded-full",
              dotColor || dotColors[variant === "outline" ? "default" : variant]
            )}
          />
        )}
        {children}
      </span>
    );
  }
);

Badge.displayName = "Badge";

export { Badge };

// Appointment Status Badge with predefined colors
export function AppointmentStatusBadge({
  status,
  className,
}: {
  status: string;
  className?: string;
}) {
  const statusConfig: Record<
    string,
    { label: string; variant: BadgeProps["variant"]; dotColor: string }
  > = {
    TE_BEVESTIGEN: {
      label: "Te bevestigen",
      variant: "warning",
      dotColor: "bg-amber-500",
    },
    BEVESTIGD: {
      label: "Bevestigd",
      variant: "primary",
      dotColor: "bg-blue-500",
    },
    IN_WACHTZAAL: {
      label: "In wachtzaal",
      variant: "info",
      dotColor: "bg-purple-500",
    },
    BINNEN: {
      label: "Binnen",
      variant: "success",
      dotColor: "bg-green-500",
    },
    AFGEWERKT: {
      label: "Afgewerkt",
      variant: "default",
      dotColor: "bg-gray-400",
    },
    NO_SHOW: {
      label: "No-show",
      variant: "danger",
      dotColor: "bg-red-500",
    },
    GEANNULEERD: {
      label: "Geannuleerd",
      variant: "outline",
      dotColor: "bg-gray-400",
    },
  };

  const config = statusConfig[status] || {
    label: status,
    variant: "default",
    dotColor: "bg-gray-400",
  };

  return (
    <Badge
      variant={config.variant}
      size="sm"
      dot
      dotColor={config.dotColor}
      className={cn("font-medium", className)}
    >
      {config.label}
    </Badge>
  );
}
