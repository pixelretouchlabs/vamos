import { HTMLAttributes } from "react"

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  glow?: boolean
}

export function Card({ glow, className = "", children, ...props }: CardProps) {
  return (
    <div
      className={`rounded-2xl bg-surface p-4 ${glow ? "ring-1 ring-gold/30" : ""} ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}
