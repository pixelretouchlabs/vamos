import { HTMLAttributes } from "react"

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  glow?: boolean
}

export function Card({ glow, className = "", children, ...props }: CardProps) {
  return (
    <div
      className={`rounded-2xl border bg-surface p-4 ${
        glow ? "gold-pulse border-transparent" : "border-border"
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}
