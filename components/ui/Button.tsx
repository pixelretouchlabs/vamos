"use client"

import { ButtonHTMLAttributes } from "react"

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "ghost" | "secondary"
  fullWidth?: boolean
}

export function Button({
  variant = "primary",
  fullWidth = true,
  className = "",
  children,
  disabled,
  ...props
}: ButtonProps) {
  if (variant === "primary") {
    return (
      <button
        disabled={disabled}
        className={`press flex h-[54px] items-center justify-center rounded-xl font-heading text-[15px] font-bold uppercase tracking-wide text-white transition-all ${
          disabled
            ? "bg-surface-2 text-text-dim"
            : "bg-red shadow-[0_8px_24px_-8px_rgba(230,57,70,0.6)]"
        } ${fullWidth ? "w-full" : ""} ${className}`}
        {...props}
      >
        {children}
      </button>
    )
  }

  if (variant === "ghost") {
    return (
      <button
        disabled={disabled}
        className={`press flex h-[50px] items-center justify-center gap-2 rounded-xl border border-border-strong font-body text-sm font-semibold text-text transition-all ${
          fullWidth ? "w-full" : ""
        } ${className}`}
        {...props}
      >
        {children}
      </button>
    )
  }

  // secondary
  return (
    <button
      disabled={disabled}
      className={`press flex h-[50px] items-center justify-center gap-2 rounded-xl bg-surface border border-border font-body text-sm font-semibold text-text transition-all ${
        fullWidth ? "w-full" : ""
      } ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
