import React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-50",
          {
            "bg-primary text-white hover:bg-primary-hover": variant === "primary",
            "bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700": variant === "secondary",
            "border border-gray-300 bg-transparent hover:bg-gray-100 dark:border-gray-700 dark:text-gray-100 dark:hover:bg-gray-800": variant === "outline",
            "hover:bg-gray-100 hover:text-gray-900 dark:text-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-50": variant === "ghost",
            "bg-danger text-white hover:bg-[color-mix(in_srgb,var(--color-danger)_90%,transparent)]": variant === "danger",
            "h-9 px-3 text-sm": size === "sm",
            "h-10 px-4 py-2": size === "md",
            "h-11 px-8 text-lg": size === "lg",
          },
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
