"use client"

import { ButtonHTMLAttributes } from "react"

type Variant = "primary" | "secondary" | "ghost" | "danger"

const variants: Record<Variant, string> = {
  primary: "bg-red text-white hover:bg-red/90 active:scale-[0.97]",
  secondary: "bg-surface-light text-white hover:bg-surface-light/80",
  ghost: "bg-transparent text-text-dim hover:text-white",
  danger: "bg-red/20 text-red hover:bg-red/30",
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  fullWidth?: boolean
}

export function Button({
  variant = "primary",
  fullWidth = false,
  className = "",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 font-heading font-bold text-sm uppercase tracking-wide transition-all duration-150 disabled:opacity-40 disabled:pointer-events-none ${variants[variant]} ${fullWidth ? "w-full" : ""} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
