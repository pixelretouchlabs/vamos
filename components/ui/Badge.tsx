interface BadgeProps {
  children: React.ReactNode
  variant?: "gold" | "red" | "green" | "dim"
  className?: string
}

const variants = {
  gold: "bg-gold/20 text-gold",
  red: "bg-red/20 text-red",
  green: "bg-green/20 text-green",
  dim: "bg-surface-light text-text-dim",
}

export function Badge({ children, variant = "gold", className = "" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  )
}
