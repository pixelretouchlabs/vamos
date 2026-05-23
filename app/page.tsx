"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Avatar } from "@/components/ui/Avatar"
import { BoltIcon, TrophyIcon, TargetIcon, BrainIcon, BallIcon, BellIcon, CalendarIcon, ChevRightIcon, ArrowUpIcon, ArrowDownIcon } from "@/components/ui/Icons"
import { useMatches } from "@/hooks/useMatches"
import { useLeaderboard } from "@/hooks/useLeaderboard"
import { useAuth } from "@/hooks/useAuth"

function useCountdown(target: Date) {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])
  const diff = Math.max(0, target.getTime() - now)
  return {
    d: Math.floor(diff / 86400000),
    h: Math.floor((diff % 86400000) / 3600000),
    m: Math.floor((diff % 3600000) / 60000),
    s: Math.floor((diff % 60000) / 1000),
  }
}

function HeroMatchCard() {
  const { nextMatch } = useMatches()
  const target = nextMatch
    ? new Date(`${nextMatch.date}T${nextMatch.timeIST}:00+05:30`)
    : new Date("2026-06-11T00:30:00+05:30")
  const c = useCountdown(target)
  const pad = (n: number) => String(n).padStart(2, "0")

  return (
    <div className="gold-pulse relative mx-4 overflow-hidden rounded-[20px] border border-transparent p-[18px]"
      style={{ background: "linear-gradient(160deg, #1d1d1d 0%, #161616 60%, #1A1A2E 140%)" }}>
      {/* Corner glow */}
      <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40"
        style={{ background: "radial-gradient(closest-side, rgba(232,197,71,0.22), transparent 70%)" }} />

      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="font-heading text-[10px] font-bold uppercase tracking-[1.4px] text-gold">
          {nextMatch ? `Group ${nextMatch.group} · Match Day` : "Tournament Starts"}
        </span>
        <span className="text-[10px] font-semibold tracking-wide text-text-dim">UPCOMING</span>
      </div>

      {/* Countdown */}
      <div className="mt-3.5 flex items-baseline justify-center gap-2 font-mono font-bold">
        {[
          ["DAYS", c.d],
          ["HRS", c.h],
          ["MIN", c.m],
          ["SEC", c.s],
        ].map(([lbl, val], i) => (
          <div key={lbl as string} className="flex items-baseline gap-2">
            <div className="min-w-[48px] text-center">
              <div className="tick text-[30px] leading-none tracking-tight">{pad(val as number)}</div>
              <div className="mt-1 font-heading text-[9px] font-semibold tracking-[1.4px] text-text-muted">
                {lbl as string}
              </div>
            </div>
            {i < 3 && (
              <span className="-translate-y-1.5 text-[22px] text-text-muted">:</span>
            )}
          </div>
        ))}
      </div>

      {/* Teams */}
      {nextMatch && (
        <div className="mt-5 flex items-center gap-2">
          <div className="flex flex-1 items-center gap-2.5">
            <span className="text-4xl">{nextMatch.home.flag}</span>
            <div>
              <div className="font-heading text-sm font-bold tracking-wide">{nextMatch.home.code}</div>
              <div className="text-[11px] text-text-dim">{nextMatch.home.name}</div>
            </div>
          </div>
          <span className="font-heading text-xs font-bold tracking-[2px] text-text-dim">VS</span>
          <div className="flex flex-1 items-center justify-end gap-2.5">
            <div className="text-right">
              <div className="font-heading text-sm font-bold tracking-wide">{nextMatch.away.code}</div>
              <div className="text-[11px] text-text-dim">{nextMatch.away.name}</div>
            </div>
            <span className="text-4xl">{nextMatch.away.flag}</span>
          </div>
        </div>
      )}

      {/* Footer */}
      {nextMatch && (
        <div className="mt-3.5 flex gap-3 border-t border-border pt-3.5 text-[11px] text-text-dim">
          <span>{nextMatch.date}</span>
          <span className="text-text-muted">·</span>
          <span>{nextMatch.timeIST} IST</span>
          <span className="text-text-muted">·</span>
          <span>{nextMatch.venue}</span>
        </div>
      )}
    </div>
  )
}

const features = [
  { href: "/sweepstake", icon: TrophyIcon, label: "Sweepstake", sub: "3 active pools", active: true },
  { href: "/predictions", icon: TargetIcon, label: "Predict", sub: "5 open matches", active: true },
  { href: "/quiz", icon: BrainIcon, label: "Daily Quiz", sub: "🔥 3-day streak", active: true },
  { href: "/bingo", icon: BallIcon, label: "Live Bingo", sub: "During matches", active: false },
  { href: "/chat", icon: BellIcon, label: "Squad Chat", sub: "Pool talk", active: false },
  { href: "/fixtures", icon: CalendarIcon, label: "Fixtures", sub: "Full schedule", active: false },
]

function FeatureGrid() {
  return (
    <div className="grid grid-cols-3 gap-2.5 px-[18px]">
      {features.map((f) => {
        const Icon = f.icon
        return (
          <Link
            key={f.href}
            href={f.active ? f.href : "#"}
            className={`lift press relative flex min-h-[96px] flex-col justify-between rounded-2xl border border-border bg-surface p-3.5 text-left ${
              !f.active ? "pointer-events-none opacity-40" : ""
            }`}
          >
            <div
              className={`flex h-9 w-9 items-center justify-center rounded-[10px] ${
                f.active ? "bg-gold-dim text-gold" : "bg-surface-2 text-text-dim"
              }`}
            >
              <Icon size={18} />
            </div>
            <div>
              <div className="font-heading text-[13px] font-bold uppercase tracking-wide">
                {f.label}
              </div>
              <div className="mt-0.5 text-[11px] text-text-dim">{f.sub}</div>
            </div>
            {!f.active && (
              <span className="absolute right-2.5 top-2.5 font-heading text-[8px] font-bold uppercase tracking-wider text-text-dim">
                Soon
              </span>
            )}
          </Link>
        )
      })}
    </div>
  )
}

function LeaderboardPreview() {
  const { leaderboard } = useLeaderboard()
  const user = useAuth((s) => s.user)

  return (
    <div className="px-[18px]">
      <div className="mb-2.5 flex items-center justify-between">
        <span className="font-heading text-sm font-bold uppercase tracking-[1.2px]">
          Top Predictors
        </span>
        <Link
          href="/leaderboard"
          className="press flex items-center gap-0.5 text-[11px] font-semibold text-gold"
        >
          See all <ChevRightIcon size={12} />
        </Link>
      </div>
      <div className="overflow-hidden rounded-2xl border border-border bg-surface">
        {leaderboard.map((entry, i) => (
          <div
            key={entry.userId}
            className="flex items-center gap-3 px-3.5 py-3"
            style={{
              borderTop: i ? "1px solid rgba(255,255,255,0.06)" : "none",
              background: entry.userId === user?.id ? "rgba(232,197,71,0.12)" : "transparent",
            }}
          >
            <span
              className={`w-[22px] text-center font-heading text-[13px] font-bold ${
                entry.rank <= 3 ? "text-gold" : "text-text-dim"
              }`}
            >
              {entry.rank}
            </span>
            <Avatar name={entry.name} size={28} />
            <span className="flex-1 text-[13px] font-semibold">
              {entry.name}
              {entry.userId === user?.id && (
                <span className="ml-1.5 font-medium text-text-dim">(you)</span>
              )}
            </span>
            <span className="font-heading text-sm font-bold text-gold">{entry.points}</span>
            <span
              className={`w-4 ${
                entry.movement === "up"
                  ? "text-green"
                  : entry.movement === "down"
                    ? "text-red"
                    : "text-text-muted"
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
  )
}

export default function HomePage() {
  const { user, login } = useAuth()

  useEffect(() => {
    if (!user) login()
  }, [user, login])

  return (
    <div className="animate-fade-in space-y-5 pt-4">
      {/* Top bar */}
      <div className="flex items-center gap-3 px-[18px] pb-2">
        <span className="font-heading text-[22px] font-extrabold tracking-[2px] text-gold">
          VAMOS
        </span>
        <div className="flex-1" />
        <div className="press flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1.5 font-heading text-[13px] font-bold text-gold">
          <BoltIcon size={14} />
          <span className="tracking-wide">{user?.totalPoints?.toLocaleString() || "0"}</span>
        </div>
        {user && (
          <Link href="/profile" className="relative">
            <Avatar name={user.name} size={36} />
            <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-bg bg-green" />
          </Link>
        )}
      </div>

      <HeroMatchCard />

      {/* Section title */}
      <div className="px-[18px] font-heading text-sm font-bold uppercase tracking-[1.2px]">
        Play
      </div>

      <FeatureGrid />

      <div className="h-1" />

      <LeaderboardPreview />

      <div className="h-4" />
    </div>
  )
}
