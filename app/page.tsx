"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { useMatches } from "@/hooks/useMatches"
import { useLeaderboard } from "@/hooks/useLeaderboard"
import { useAuth } from "@/hooks/useAuth"

function CountdownTimer({ targetDate }: { targetDate: Date }) {
  const [timeLeft, setTimeLeft] = useState("")

  useEffect(() => {
    function update() {
      const now = new Date()
      const diff = targetDate.getTime() - now.getTime()
      if (diff <= 0) {
        setTimeLeft("LIVE NOW")
        return
      }
      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24)
      const mins = Math.floor((diff / (1000 * 60)) % 60)
      const secs = Math.floor((diff / 1000) % 60)
      setTimeLeft(`${days}d ${hours}h ${mins}m ${secs}s`)
    }
    update()
    const interval = setInterval(update, 1000)
    return () => clearInterval(interval)
  }, [targetDate])

  return <span className="font-mono text-2xl font-bold text-gold">{timeLeft}</span>
}

const features = [
  { href: "/sweepstake", icon: "🏆", label: "Sweepstake", desc: "Pool with friends", active: true },
  { href: "/predictions", icon: "🎯", label: "Predictions", desc: "Predict scores", active: true },
  { href: "/quiz", icon: "🧠", label: "Daily Quiz", desc: "5 questions daily", active: true },
  { href: "/bracket", icon: "📊", label: "Bracket", desc: "Coming soon", active: false },
  { href: "/bingo", icon: "🎱", label: "Bingo", desc: "Coming soon", active: false },
  { href: "/ai-expert", icon: "🤖", label: "AI Expert", desc: "Coming soon", active: false },
]

export default function HomePage() {
  const { nextMatch } = useMatches()
  const { leaderboard } = useLeaderboard()
  const { user, login } = useAuth()

  useEffect(() => {
    if (!user) login()
  }, [user, login])

  const nextMatchDate = nextMatch
    ? new Date(`${nextMatch.date}T${nextMatch.timeIST}:00+05:30`)
    : new Date("2026-06-11T00:30:00+05:30")

  return (
    <div className="animate-fade-in space-y-6 px-4 pt-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-3xl font-black text-gold">VAMOS</h1>
          <p className="text-sm text-text-dim">Let&apos;s Play.</p>
        </div>
        {user && (
          <Link href="/profile" className="flex items-center gap-2">
            <Badge variant="gold">{user.totalPoints} pts</Badge>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gold text-sm font-bold text-bg">
              {user.avatar}
            </div>
          </Link>
        )}
      </div>

      {/* Next Match Countdown */}
      <Card glow>
        <p className="text-xs font-semibold uppercase tracking-wider text-text-dim">
          {nextMatch ? "Next Match" : "Tournament Starts"}
        </p>
        <div className="mt-2">
          <CountdownTimer targetDate={nextMatchDate} />
        </div>
        {nextMatch && (
          <div className="mt-3 flex items-center gap-3 text-lg">
            <span>
              {nextMatch.home.flag} {nextMatch.home.code}
            </span>
            <span className="text-text-dim">vs</span>
            <span>
              {nextMatch.away.flag} {nextMatch.away.code}
            </span>
          </div>
        )}
        {nextMatch && (
          <p className="mt-1 text-xs text-text-dim">
            {nextMatch.date} · {nextMatch.timeIST} IST · {nextMatch.venue}
          </p>
        )}
      </Card>

      {/* Features Grid */}
      <div>
        <h2 className="mb-3 font-heading text-lg font-bold">Play</h2>
        <div className="grid grid-cols-3 gap-3">
          {features.map((f) => (
            <Link
              key={f.href}
              href={f.active ? f.href : "#"}
              className={`group ${!f.active ? "pointer-events-none opacity-40" : ""}`}
            >
              <Card className="flex flex-col items-center gap-1 py-5 text-center transition-transform group-hover:scale-[1.03]">
                <span className="text-2xl">{f.icon}</span>
                <span className="text-sm font-semibold">{f.label}</span>
                <span className="text-[10px] text-text-dim">{f.desc}</span>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Leaderboard Preview */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-heading text-lg font-bold">Leaderboard</h2>
          <Link href="/leaderboard" className="text-xs text-gold">
            View all
          </Link>
        </div>
        <Card>
          <div className="space-y-3">
            {leaderboard.slice(0, 5).map((entry) => (
              <div
                key={entry.userId}
                className={`flex items-center gap-3 ${entry.userId === user?.id ? "text-gold" : ""}`}
              >
                <span className="w-6 text-center text-sm font-bold text-text-dim">
                  {entry.rank}
                </span>
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-surface-light text-xs font-semibold">
                  {entry.avatar}
                </div>
                <span className="flex-1 text-sm font-medium">{entry.name}</span>
                <span className="text-sm font-semibold">{entry.points}</span>
                <span className="text-xs">
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
    </div>
  )
}
