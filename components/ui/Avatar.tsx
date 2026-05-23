"use client"

interface AvatarProps {
  name: string
  size?: number
  ring?: string
}

export function Avatar({ name, size = 36, ring }: AvatarProps) {
  const initials = name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()

  // Deterministic hue from name
  let h = 0
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) % 360

  return (
    <div
      className="flex shrink-0 items-center justify-center rounded-full font-heading font-bold"
      style={{
        width: size,
        height: size,
        background: `linear-gradient(135deg, hsl(${h} 65% 38%), hsl(${(h + 40) % 360} 70% 22%))`,
        fontSize: size * 0.36,
        letterSpacing: 0.5,
        color: "#fff",
        boxShadow: ring
          ? `0 0 0 2px ${ring}`
          : "inset 0 0 0 1px rgba(255,255,255,0.08)",
      }}
    >
      {initials}
    </div>
  )
}
