"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { BallIcon, TargetIcon, TrophyIcon, BrainIcon, UserIcon } from "@/components/ui/Icons"

const navItems = [
  { href: "/", label: "Home", icon: BallIcon },
  { href: "/predictions", label: "Predict", icon: TargetIcon },
  { href: "/sweepstake", label: "Pools", icon: TrophyIcon },
  { href: "/quiz", label: "Quiz", icon: BrainIcon },
  { href: "/profile", label: "Profile", icon: UserIcon },
]

export function BottomNav() {
  const pathname = usePathname()
  const [bounceKey, setBounceKey] = useState<string | null>(null)

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50">
      {/* Fade gradient */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(13,13,13,0) 0%, rgba(13,13,13,0.92) 35%, #0D0D0D 100%)",
        }}
      />
      {/* Pill card */}
      <div className="relative mx-auto max-w-lg px-3 pb-5 pt-2">
        <div className="grid grid-cols-5 rounded-[22px] border border-border bg-surface/85 px-3 py-2 backdrop-blur-xl">
          {navItems.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href)
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => {
                  setBounceKey(item.href)
                  setTimeout(() => setBounceKey(null), 320)
                }}
                className={`flex flex-col items-center gap-[3px] py-1.5 ${
                  isActive ? "text-gold" : "text-text-dim"
                }`}
              >
                <span className={bounceKey === item.href ? "nav-bounce" : ""}>
                  <Icon size={22} />
                </span>
                <span className="font-heading text-[10px] font-semibold uppercase tracking-wide">
                  {item.label}
                </span>
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
