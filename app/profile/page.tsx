"use client"

import Link from "next/link"
import { Avatar } from "@/components/ui/Avatar"
import { BoltIcon, TrophyIcon, TargetIcon, FlameIcon, ChevRightIcon } from "@/components/ui/Icons"
import { useAuth } from "@/hooks/useAuth"
import { useQuizStore } from "@/lib/quiz"
import { usePredictionsStore } from "@/lib/predictions"
import { usePoolsStore } from "@/lib/pools"

function StatCard({ icon: Icon, value, label, color }: { icon: typeof BoltIcon; value: string | number; label: string; color: string }) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-3.5 text-center">
      <div className="mb-2 flex justify-center">
        <div
          className="flex h-9 w-9 items-center justify-center rounded-[10px]"
          style={{ background: `${color}18`, color }}
        >
          <Icon size={18} />
        </div>
      </div>
      <p className="font-heading text-[20px] font-black tracking-tight">{value}</p>
      <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-wider text-text-dim">{label}</p>
    </div>
  )
}

export default function ProfilePage() {
  const user = useAuth((s) => s.user)
  const logout = useAuth((s) => s.logout)
  const streak = useQuizStore((s) => s.currentStreak)
  const predictions = usePredictionsStore((s) => s.predictions)
  const pools = usePoolsStore((s) => s.pools)

  if (!user) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-text-dim">Please sign in</p>
      </div>
    )
  }

  const userPools = pools.filter((p) => p.members.some((m) => m.userId === user.id))

  return (
    <div className="animate-fade-in min-h-dvh bg-bg">
      {/* Profile header */}
      <div className="flex flex-col items-center px-[18px] pt-8">
        <Avatar name={user.name} size={72} ring="#E8C547" />
        <h1 className="mt-3 font-heading text-[20px] font-extrabold tracking-tight">{user.name}</h1>
        <p className="mt-0.5 text-[12px] text-text-dim">{user.email}</p>
      </div>

      {/* Points card */}
      <div className="mx-[18px] mt-5">
        <div
          className="gold-pulse rounded-2xl border border-transparent p-5 text-center"
          style={{ background: "linear-gradient(160deg, #1d1d1d 0%, #161616 60%, #1A1A2E 140%)" }}
        >
          <p className="font-heading text-[10px] font-bold uppercase tracking-[1.4px] text-text-muted">
            Total Points
          </p>
          <p
            className="mt-1 font-heading text-[42px] font-black tracking-tight text-gold"
            style={{ textShadow: "0 0 30px rgba(232,197,71,0.25)" }}
          >
            {user.totalPoints.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Stats grid */}
      <div className="mt-5 grid grid-cols-3 gap-2.5 px-[18px]">
        <StatCard icon={TargetIcon} value={Object.keys(predictions).length} label="Predictions" color="#E8C547" />
        <StatCard icon={TrophyIcon} value={userPools.length} label="Pools" color="#E63946" />
        <StatCard icon={FlameIcon} value={streak} label="Quiz Streak" color="#F59E0B" />
      </div>

      {/* Your Pools */}
      {userPools.length > 0 && (
        <div className="mt-6 px-[18px]">
          <p className="mb-2.5 font-heading text-[11px] font-bold uppercase tracking-[1.2px] text-text-muted">
            Your Pools
          </p>
          <div className="overflow-hidden rounded-2xl border border-border bg-surface">
            {userPools.map((pool, i) => {
              const member = pool.members.find((m) => m.userId === user.id)
              return (
                <Link
                  key={pool.id}
                  href={`/sweepstake/${pool.id}`}
                  className="flex items-center gap-3 px-3.5 py-3"
                  style={{ borderTop: i ? "1px solid rgba(255,255,255,0.06)" : "none" }}
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-gold-dim text-gold">
                    <TrophyIcon size={16} />
                  </div>
                  <div className="flex-1">
                    <p className="text-[13px] font-semibold">{pool.name}</p>
                    <p className="text-[11px] text-text-dim">
                      {member?.teamName} · ₹{pool.prizePool.toLocaleString("en-IN")}
                    </p>
                  </div>
                  <ChevRightIcon size={14} className="text-text-muted" />
                </Link>
              )
            })}
          </div>
        </div>
      )}

      {/* Sign out */}
      <div className="mt-8 px-[18px]">
        <button
          onClick={logout}
          className="press w-full rounded-xl border border-border bg-surface py-3.5 text-[13px] font-semibold text-text-dim"
        >
          Sign Out
        </button>
      </div>

      <div className="h-8" />
    </div>
  )
}
