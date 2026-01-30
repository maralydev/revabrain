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
      primary: "bg-[var(--rb-light)] text-[var(--rb-primary)] border-[var(--rb-primary)]/20",
      secondary: "bg-[var(--rb-accent)]/20 text-[var(--rb-accent-dark)] border-[var(--rb-accent)]/30",
      success: "bg-emerald-50 text-emerald-700 border-emerald-200",
      warning: "bg-amber-50 text-amber-700 border-amber-200",
      danger: "bg-red-50 text-red-700 border-red-200",
      info: "bg-purple-50 text-purple-700 border-purple-200",
      outline: "bg-transparent border-gray-300 text-gray-600",
    };

    const sizes = {
      sm: "px-2 py-0.5 text-[11px]",
      md: "px-2.5 py-1 text-xs",
    };

    const dotColors = {
      default: "bg-gray-500",
      primary: "bg-[var(--rb-primary)]",
      secondary: "bg-[var(--rb-accent-dark)]",
      success: "bg-emerald-500",
      warning: "bg-amber-500",
      danger: "bg-red-500",
      info: "bg-purple-500",
    };

    return (
      <span
        ref={ref}
        className={cn(
          "inline-flex items-center gap-1.5 font-semibold rounded-lg border",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {dot && (
          <span
            className={cn(
              "w-1.5 h-1.5 rounded-full flex-shrink-0",
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
  showDot = true,
}: {
  status: string;
  className?: string;
  showDot?: boolean;
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
      dotColor: "bg-[var(--rb-primary)]",
    },
    IN_WACHTZAAL: {
      label: "Wachtzaal",
      variant: "info",
      dotColor: "bg-purple-500",
    },
    BINNEN: {
      label: "Binnen",
      variant: "success",
      dotColor: "bg-emerald-500",
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
      dot={showDot}
      dotColor={config.dotColor}
      className={cn("font-medium", className)}
    >
      {config.label}
    </Badge>
  );
}

// Status Dot - Simple colored dot with label
interface StatusDotProps {
  status: "success" | "warning" | "danger" | "info" | "default";
  label: string;
  className?: string;
}

function StatusDot({ status, label, className }: StatusDotProps) {
  const colors = {
    success: "bg-emerald-500",
    warning: "bg-amber-500",
    danger: "bg-red-500",
    info: "bg-[var(--rb-primary)]",
    default: "bg-gray-400",
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span className={cn("w-2 h-2 rounded-full", colors[status])} />
      <span className="text-sm text-gray-600">{label}</span>
    </div>
  );
}

export { StatusDot };
