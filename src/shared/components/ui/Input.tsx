"use client";

import React from "react";
import { cn } from "@/shared/utils/cn";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      fullWidth = false,
      type = "text",
      ...props
    },
    ref
  ) => {
    return (
      <div className={cn("flex flex-col gap-1.5", fullWidth && "w-full")}>
        {label && (
          <label
            htmlFor={props.id}
            className="text-sm font-medium text-gray-700"
          >
            {label}
            {props.required && (
              <span className="ml-1 text-red-500">*</span>
            )}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            type={type}
            className={cn(
              "flex h-11 w-full rounded-lg border border-gray-200 bg-white px-4 text-sm text-gray-900 placeholder:text-gray-400",
              "transition-all duration-200",
              "focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10",
              "disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500",
              "hover:border-gray-300",
              leftIcon && "pl-10",
              rightIcon && "pr-10",
              error && "border-red-300 focus:border-red-500 focus:ring-red-500/10",
              className
            )}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
              {rightIcon}
            </div>
          )}
        </div>
        {(error || helperText) && (
          <p
            className={cn(
              "text-sm",
              error ? "text-red-600" : "text-gray-500"
            )}
          >
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
