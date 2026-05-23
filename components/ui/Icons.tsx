interface IconProps {
  size?: number
  className?: string
}

function Icon({
  size = 22,
  strokeWidth = 1.8,
  fill = "none",
  children,
  className,
}: {
  size?: number
  strokeWidth?: number
  fill?: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={fill}
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {children}
    </svg>
  )
}

export function BallIcon({ size, className }: IconProps) {
  return (
    <Icon size={size} className={className}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 3 L14 8 L19 9 M12 3 L10 8 L5 9 M5 9 L7 14 L12 16 L17 14 L19 9 M7 14 L5 18 M17 14 L19 18 M12 16 L12 21" />
    </Icon>
  )
}

export function TargetIcon({ size, className }: IconProps) {
  return (
    <Icon size={size} className={className}>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none" />
    </Icon>
  )
}

export function TrophyIcon({ size, className }: IconProps) {
  return (
    <Icon size={size} className={className}>
      <path d="M6 4h12v4a6 6 0 0 1-12 0V4z" />
      <path d="M6 6H3v2a3 3 0 0 0 3 3M18 6h3v2a3 3 0 0 1-3 3" />
      <path d="M10 14h4l-1 4h-2l-1-4zM8 21h8" />
    </Icon>
  )
}

export function BrainIcon({ size, className }: IconProps) {
  return (
    <Icon size={size} className={className}>
      <path d="M9 3a3 3 0 0 0-3 3v0a3 3 0 0 0-2 5 3 3 0 0 0 1 5 3 3 0 0 0 4 4v0a3 3 0 0 0 3-3V6a3 3 0 0 0-3-3z" />
      <path d="M15 3a3 3 0 0 1 3 3v0a3 3 0 0 1 2 5 3 3 0 0 1-1 5 3 3 0 0 1-4 4v0a3 3 0 0 1-3-3" />
    </Icon>
  )
}

export function UserIcon({ size, className }: IconProps) {
  return (
    <Icon size={size} className={className}>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-4 4-7 8-7s8 3 8 7" />
    </Icon>
  )
}

export function BoltIcon({ size, className }: IconProps) {
  return (
    <Icon size={size} fill="currentColor" strokeWidth={0} className={className}>
      <path d="M13 2L4 14h6l-1 8 9-12h-6l1-8z" />
    </Icon>
  )
}

export function PlusIcon({ size, className }: IconProps) {
  return (
    <Icon size={size} className={className}>
      <path d="M12 5v14M5 12h14" />
    </Icon>
  )
}

export function MinusIcon({ size, className }: IconProps) {
  return (
    <Icon size={size} className={className}>
      <path d="M5 12h14" />
    </Icon>
  )
}

export function ChevRightIcon({ size, className }: IconProps) {
  return (
    <Icon size={size} className={className}>
      <path d="M9 18l6-6-6-6" />
    </Icon>
  )
}

export function ArrowUpIcon({ size, className }: IconProps) {
  return (
    <Icon size={size} strokeWidth={2.4} className={className}>
      <path d="M12 19V5M5 12l7-7 7 7" />
    </Icon>
  )
}

export function ArrowDownIcon({ size, className }: IconProps) {
  return (
    <Icon size={size} strokeWidth={2.4} className={className}>
      <path d="M12 5v14M5 12l7 7 7-7" />
    </Icon>
  )
}

export function FlameIcon({ size, className }: IconProps) {
  return (
    <Icon size={size} fill="currentColor" strokeWidth={0} className={className}>
      <path d="M12 2c1 4 5 5 5 10a5 5 0 0 1-10 0c0-2 1-3 2-4-1 3 1 4 2 4 0-3-2-5 1-10z" />
    </Icon>
  )
}

export function ShareIcon({ size, className }: IconProps) {
  return (
    <Icon size={size} className={className}>
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <path d="M8.6 13.5l6.8 4M15.4 6.5l-6.8 4" />
    </Icon>
  )
}

export function CalendarIcon({ size, className }: IconProps) {
  return (
    <Icon size={size} className={className}>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M16 3v4M8 3v4M3 10h18" />
    </Icon>
  )
}

export function BellIcon({ size, className }: IconProps) {
  return (
    <Icon size={size} className={className}>
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9zM10 21a2 2 0 0 0 4 0" />
    </Icon>
  )
}
