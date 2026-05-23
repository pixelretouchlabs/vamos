"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Avatar } from "@/components/ui/Avatar"
import { BoltIcon, ChevRightIcon } from "@/components/ui/Icons"
import { useAuth } from "@/hooks/useAuth"
import { useQuizStore } from "@/lib/quiz"
import { usePredictionsStore } from "@/lib/predictions"
import { usePoolsStore } from "@/lib/pools"

function StatTile({ label, value, color }: { label: string; value: string | number; color?: string }) {
  return (
    <div className="flex-1 rounded-2xl border border-border bg-surface p-3.5">
      <p
        className="font-heading text-[24px] font-extrabold"
        style={{ color: color || undefined, letterSpacing: -0.5 }}
      >
        {value}
      </p>
      <p className="mt-0.5 text-[11px] font-medium text-text-dim">{label}</p>
    </div>
  )
}

const achievements = [
  { e: "⚽", l: "First Pick" },
  { e: "🎯", l: "Sharpshooter" },
  { e: "🔥", l: "3-Day" },
  { e: "🏆", l: "Pool Pro", locked: true },
  { e: "🧠", l: "Quiz Wiz" },
  { e: "💎", l: "Premium", locked: true },
  { e: "🚀", l: "On Fire", locked: true },
  { e: "👑", l: "Champion", locked: true },
]

const settingsRows = [
  { l: "Notifications", v: "On" },
  { l: "Language", v: "English" },
  { l: "Payment Methods", v: "UPI · ●●●● 4521" },
  { l: "Privacy", v: null },
  { l: "Sign Out", v: null, danger: true },
]

export default function ProfilePage() {
  const user = useAuth((s) => s.user)
  const logout = useAuth((s) => s.logout)
  const streak = useQuizStore((s) => s.currentStreak)
  const predictions = usePredictionsStore((s) => s.predictions)
  const pools = usePoolsStore((s) => s.pools)
  const router = useRouter()

  if (!user) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-text-dim">Please sign in</p>
      </div>
    )
  }

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
          Profile
        </div>
        <div className="w-9" />
      </div>

      {/* Profile header */}
      <div className="flex flex-col items-center px-[18px] text-center">
        <Avatar name={user.name} size={86} ring="#E8C547" />
        <h1
          className="mt-3.5 font-heading text-[24px] font-extrabold"
          style={{ letterSpacing: -0.4 }}
        >
          {user.name}
        </h1>
        <p className="mt-0.5 text-[12px] text-text-dim">@{user.name.split(" ")[0].toLowerCase()} · Joined Apr 2026</p>

        {/* Points pill */}
        <div
          className="mt-3.5 inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5"
          style={{ background: "rgba(232,197,71,0.12)" }}
        >
          <BoltIcon size={14} className="text-gold" />
          <span className="font-heading text-[13px] font-bold tracking-wide text-gold">
            {user.totalPoints.toLocaleString()} pts · Rank #5
          </span>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-5 flex gap-2.5 px-[18px]">
        <StatTile label="Predictions" value={Object.keys(predictions).length} />
        <StatTile label="Accuracy" value="71%" color="#22C55E" />
        <StatTile label="Streak" value={`🔥${streak}`} color="#E8C547" />
      </div>

      {/* Achievements */}
      <div className="mt-5 px-[18px]">
        <p className="mb-2.5 font-heading text-[11px] font-bold uppercase tracking-[1.2px] text-text-dim">
          Achievements
        </p>
        <div className="grid grid-cols-4 gap-2">
          {achievements.map((a, i) => (
            <div
              key={i}
              className="flex flex-col items-center justify-center gap-1 rounded-xl border border-border bg-surface"
              style={{ aspectRatio: "1", opacity: a.locked ? 0.3 : 1 }}
            >
              <span className="text-[26px]">{a.e}</span>
              <span className="text-center text-[9px] font-semibold tracking-wide text-text-dim">{a.l}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Settings */}
      <div className="mt-5 px-[18px]">
        <div className="overflow-hidden rounded-2xl border border-border bg-surface">
          {settingsRows.map((row, i) => (
            <button
              key={i}
              onClick={row.danger ? logout : undefined}
              className="press flex w-full items-center gap-3 px-4 py-3.5 text-left"
              style={{
                borderTop: i ? "1px solid rgba(255,255,255,0.06)" : "none",
                color: row.danger ? "#E63946" : undefined,
              }}
            >
              <span className="flex-1 text-[14px] font-medium">{row.l}</span>
              {row.v && <span className="text-[12px] text-text-dim">{row.v}</span>}
              <ChevRightIcon size={14} className="text-text-dim" />
            </button>
          ))}
        </div>
      </div>

      <div className="h-8" />
    </div>
  )
}
