"use client"

import { Avatar } from "@/components/ui/Avatar"
import { ArrowUpIcon, ArrowDownIcon, BoltIcon } from "@/components/ui/Icons"
import { useLeaderboard } from "@/hooks/useLeaderboard"
import { useAuth } from "@/hooks/useAuth"

function PodiumPlace({ entry, height, medal }: { entry: { name: string; points: number; avatar: string }; height: string; medal: string }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <span className="text-2xl">{medal}</span>
      <Avatar name={entry.name} size={40} ring={medal === "🥇" ? "#E8C547" : undefined} />
      <span className="max-w-[80px] truncate text-[12px] font-semibold">{entry.name}</span>
      <div
        className={`${height} flex w-[76px] items-start justify-center rounded-t-2xl pt-3`}
        style={{ background: "linear-gradient(180deg, rgba(232,197,71,0.18), rgba(232,197,71,0.04))" }}
      >
        <span className="font-heading text-[15px] font-bold text-gold">{entry.points}</span>
      </div>
    </div>
  )
}

export default function LeaderboardPage() {
  const { leaderboard } = useLeaderboard()
  const user = useAuth((s) => s.user)

  const top3 = leaderboard.slice(0, 3)

  return (
    <div className="animate-fade-in min-h-dvh bg-bg">
      {/* Header */}
      <div className="px-[18px] pt-6">
        <h1 className="font-heading text-[22px] font-extrabold tracking-tight">Leaderboard</h1>
        <p className="mt-0.5 text-[12px] text-text-dim">Top predictors this tournament</p>
      </div>

      {/* Podium */}
      {top3.length >= 3 && (
        <div className="mt-6 flex items-end justify-center gap-3 px-[18px]">
          <PodiumPlace entry={top3[1]} height="h-[80px]" medal="🥈" />
          <PodiumPlace entry={top3[0]} height="h-[110px]" medal="🥇" />
          <PodiumPlace entry={top3[2]} height="h-[64px]" medal="🥉" />
        </div>
      )}

      {/* Full list */}
      <div className="mt-6 px-[18px]">
        <div className="overflow-hidden rounded-2xl border border-border bg-surface">
          {leaderboard.map((entry, i) => (
            <div
              key={entry.userId}
              className="flex items-center gap-3 px-3.5 py-3"
              style={{
                borderTop: i ? "1px solid rgba(255,255,255,0.06)" : "none",
                background: entry.userId === user?.id ? "rgba(232,197,71,0.08)" : "transparent",
              }}
            >
              <span
                className={`w-[22px] text-center font-heading text-[13px] font-bold ${
                  entry.rank <= 3 ? "text-gold" : "text-text-dim"
                }`}
              >
                {entry.rank}
              </span>
              <Avatar name={entry.name} size={32} />
              <span className="flex-1 text-[13px] font-semibold">
                {entry.name}
                {entry.userId === user?.id && (
                  <span className="ml-1.5 font-medium text-text-dim">(you)</span>
                )}
              </span>
              <span className="flex items-center gap-1 font-heading text-[14px] font-bold text-gold">
                <BoltIcon size={12} /> {entry.points}
              </span>
              <span
                className={`w-4 ${
                  entry.movement === "up" ? "text-green" : entry.movement === "down" ? "text-red" : "text-text-muted"
                }`}
              >
                {entry.movement === "up" ? (
                  <ArrowUpIcon size={14} />
                ) : entry.movement === "down" ? (
                  <ArrowDownIcon size={14} />
                ) : (
                  <span className="block h-[2px] w-3 rounded bg-current" />
                )}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="h-8" />
    </div>
  )
}
