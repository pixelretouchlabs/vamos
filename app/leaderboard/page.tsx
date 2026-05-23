"use client"

import { Card } from "@/components/ui/Card"
import { useLeaderboard } from "@/hooks/useLeaderboard"
import { useAuth } from "@/hooks/useAuth"

export default function LeaderboardPage() {
  const { leaderboard } = useLeaderboard()
  const user = useAuth((s) => s.user)

  return (
    <div className="animate-fade-in space-y-6 px-4 pt-6">
      <h1 className="font-heading text-2xl font-bold">Leaderboard</h1>

      {/* Top 3 podium */}
      <div className="flex items-end justify-center gap-4 py-4">
        {[1, 0, 2].map((idx) => {
          const entry = leaderboard[idx]
          if (!entry) return null
          const heights = ["h-28", "h-20", "h-16"]
          const medals = ["🥇", "🥈", "🥉"]
          return (
            <div key={entry.userId} className="flex flex-col items-center gap-2">
              <span className="text-2xl">{medals[entry.rank - 1]}</span>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-light text-sm font-bold">
                {entry.avatar}
              </div>
              <span className="text-xs font-medium">{entry.name}</span>
              <div
                className={`${heights[entry.rank - 1]} w-20 rounded-t-xl bg-gold/20 flex items-center justify-center`}
              >
                <span className="font-heading text-lg font-bold text-gold">
                  {entry.points}
                </span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Full list */}
      <Card>
        <div className="space-y-3">
          {leaderboard.map((entry) => (
            <div
              key={entry.userId}
              className={`flex items-center gap-3 rounded-xl px-2 py-2 ${
                entry.userId === user?.id ? "bg-gold/10" : ""
              }`}
            >
              <span className="w-8 text-center text-sm font-bold text-text-dim">
                #{entry.rank}
              </span>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-light text-xs font-semibold">
                {entry.avatar}
              </div>
              <span className="flex-1 text-sm font-medium">
                {entry.name}
                {entry.userId === user?.id && (
                  <span className="ml-1 text-xs text-gold">(you)</span>
                )}
              </span>
              <span className="font-heading font-bold">{entry.points}</span>
              <span
                className={`text-xs ${
                  entry.movement === "up"
                    ? "text-green"
                    : entry.movement === "down"
                      ? "text-red"
                      : "text-text-dim"
                }`}
              >
                {entry.movement === "up"
                  ? "▲"
                  : entry.movement === "down"
                    ? "▼"
                    : "–"}
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
