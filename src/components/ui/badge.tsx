import React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?:
    | "default"
    | "brand"
    | "success"
    | "warning"
    | "danger"
    | "outline"
    | "publish"
    | "read"
    | "webhook"
    | "restricted"
    | "metric-mock"
    | "metric-estimated"
    | "metric-actual";
  size?: "sm" | "md";
}

export function Badge({
  className,
  variant = "default",
  size = "md",
  children,
  ...props
}: BadgeProps) {
  const variantStyles = {
    default: "bg-slate-100 text-slate-800 border-slate-300 dark:bg-slate-800/80 dark:text-slate-300 dark:border-slate-700/60",
    brand: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-[var(--brand-primary)]/15 dark:text-[var(--brand-primary)] dark:border-[var(--brand-primary)]/30",
    success: "bg-emerald-50 text-emerald-800 border-emerald-300 dark:bg-emerald-500/15 dark:text-emerald-400 dark:border-emerald-500/30",
    warning: "bg-amber-50 text-amber-800 border-amber-300 dark:bg-amber-500/15 dark:text-amber-300 dark:border-amber-500/30",
    danger: "bg-rose-50 text-rose-800 border-rose-300 dark:bg-rose-500/15 dark:text-rose-300 dark:border-rose-500/30",
    outline: "bg-transparent text-slate-700 border-slate-300 dark:text-slate-400 dark:border-slate-700/70",
    // Social Platform Capability Badges
    publish: "bg-emerald-50 text-emerald-800 border-emerald-300 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-500/30 font-semibold tracking-wide",
    read: "bg-sky-50 text-sky-800 border-sky-300 dark:bg-sky-500/15 dark:text-sky-300 dark:border-sky-500/30 font-semibold tracking-wide",
    webhook: "bg-purple-50 text-purple-800 border-purple-300 dark:bg-purple-500/15 dark:text-purple-300 dark:border-purple-500/30 font-semibold tracking-wide",
    restricted: "bg-amber-50 text-amber-900 border-amber-300 dark:bg-amber-500/20 dark:text-amber-200 dark:border-amber-500/40 font-semibold tracking-wide",
    // Analytics Non-Negotiable Badges
    "metric-mock": "bg-indigo-50 text-indigo-800 border-indigo-300 dark:bg-indigo-500/20 dark:text-indigo-300 dark:border-indigo-500/30 text-[10px] uppercase font-bold",
    "metric-estimated": "bg-amber-50 text-amber-900 border-amber-300 dark:bg-amber-500/20 dark:text-amber-300 dark:border-amber-500/30 text-[10px] uppercase font-bold",
    "metric-actual": "bg-emerald-50 text-emerald-800 border-emerald-300 dark:bg-emerald-500/20 dark:text-emerald-300 dark:border-emerald-500/30 text-[10px] uppercase font-bold",
  };

  const sizeStyles = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-1 text-xs",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border transition-colors select-none",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

