"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Avatar } from "@/components/ui/Avatar"
import { ArrowUpIcon, ArrowDownIcon, ChevRightIcon } from "@/components/ui/Icons"
import { useLeaderboard } from "@/hooks/useLeaderboard"
import { useAuth } from "@/hooks/useAuth"

// Dash icon for "same" movement
function DashIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 12h12" />
    </svg>
  )
}

function Podium({ top3 }: { top3: ReturnType<typeof useLeaderboard>["leaderboard"] }) {
  const [a, b, c] = top3 // 1st, 2nd, 3rd

  function Pillar({ p, height, medal, color }: { p: typeof a; height: number; medal: string; color: string }) {
    const isFirst = medal === "🥇"
    return (
      <div className="flex flex-1 flex-col items-center gap-2.5">
        <Avatar name={p.name} size={isFirst ? 56 : 44} ring={color} />
        <span className="max-w-full truncate text-center font-heading text-[13px] font-bold">{p.name}</span>
        <span className="font-heading text-[15px] font-extrabold" style={{ color, letterSpacing: -0.3 }}>
          {p.points}
        </span>
        <div
          className="relative w-[78%] rounded-t-lg"
          style={{
            height,
            background: `linear-gradient(180deg, ${color}, rgba(232,197,71,0))`,
            boxShadow: `0 0 24px -6px ${color}`,
          }}
        >
          <div
            className="absolute inset-x-0 -top-0.5 text-center font-heading text-[28px] font-extrabold"
            style={{ color: "#0D0D0D", textShadow: `0 0 4px ${color}` }}
          >
            {medal}
          </div>
        </div>
      </div>
    )
  }

  if (top3.length < 3) return null

  return (
    <div className="flex items-end gap-2.5 px-[18px] pt-4" style={{ height: 240 }}>
      <Pillar p={b} height={64} medal="🥈" color="#C0C0C0" />
      <Pillar p={a} height={100} medal="🥇" color="#E8C547" />
      <Pillar p={c} height={44} medal="🥉" color="#CD7F32" />
    </div>
  )
}

export default function LeaderboardPage() {
  const { leaderboard } = useLeaderboard()
  const user = useAuth((s) => s.user)
  const router = useRouter()
  const [filter, setFilter] = useState("global")

  const top3 = leaderboard.slice(0, 3)
  const rest = leaderboard.slice(3)

  return (
    <div className="animate-fade-in min-h-dvh bg-bg">
      {/* App bar */}
      <div className="flex min-h-[44px] items-center gap-3 px-[18px] py-2 pb-3">
        <button
          onClick={() => router.back()}
          className="press flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-surface"
        >
          <ChevRightIcon size={18} className="rotate-180" />
        </button>
        <div className="flex-1 text-center font-heading text-[16px] font-bold uppercase tracking-wide">
          Leaderboard
        </div>
        <div className="w-9" />
      </div>

      {/* Filter pills */}
      <div className="flex gap-2 px-[18px] pb-1">
        {[
          { k: "global", label: "Global" },
          { k: "friends", label: "Friends" },
          { k: "pool", label: "Bandra Boys" },
        ].map((f) => {
          const active = filter === f.k
          return (
            <button
              key={f.k}
              onClick={() => setFilter(f.k)}
              className="press rounded-full px-3.5 py-[7px] font-heading text-[12px] font-bold uppercase tracking-wide transition-all"
              style={{
                background: active ? "#E8C547" : "#1A1A1A",
                color: active ? "#0D0D0D" : "#888",
                border: `1px solid ${active ? "#E8C547" : "rgba(255,255,255,0.06)"}`,
              }}
            >
              {f.label}
            </button>
          )
        })}
      </div>

      <Podium top3={top3} />

      {/* Ranked list */}
      <div className="px-[18px] pt-5">
        <div className="overflow-hidden rounded-2xl border border-border bg-surface">
          {rest.map((entry) => {
            const arrowColor = entry.movement === "up" ? "#22C55E" : entry.movement === "down" ? "#E63946" : "#5a5a5a"
            return (
              <div
                key={entry.userId}
                className="flex items-center gap-3 px-4 py-3"
                style={{
                  borderTop: "1px solid rgba(255,255,255,0.06)",
                  background: entry.userId === user?.id ? "rgba(232,197,71,0.12)" : "transparent",
                }}
              >
                <span className="w-6 text-center font-heading text-[13px] font-bold text-text-dim">
                  {entry.rank}
                </span>
                <Avatar name={entry.name} size={32} ring={entry.userId === user?.id ? "#E8C547" : undefined} />
                <span className="flex-1 text-[13px] font-semibold">
                  {entry.name}
                  {entry.userId === user?.id && <span className="ml-1.5 font-medium text-text-dim">(you)</span>}
                </span>
                <span
                  className="font-heading text-[15px] font-extrabold"
                  style={{
                    color: entry.userId === user?.id ? "#E8C547" : undefined,
                    letterSpacing: -0.2,
                  }}
                >
                  {entry.points}
                </span>
                <span className="flex w-4" style={{ color: arrowColor }}>
                  {entry.movement === "up" ? <ArrowUpIcon size={14} /> :
                   entry.movement === "down" ? <ArrowDownIcon size={14} /> :
                   <DashIcon size={14} />}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      <div className="h-8" />
    </div>
  )
}
