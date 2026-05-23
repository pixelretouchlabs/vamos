"use client"

import { use, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/Button"
import { Avatar } from "@/components/ui/Avatar"
import { ChevRightIcon, ShareIcon } from "@/components/ui/Icons"
import { usePoolsStore } from "@/lib/pools"
import { teams } from "@/data/matches"
import { useAuth } from "@/hooks/useAuth"

function Label({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-2.5 font-heading text-[11px] font-bold uppercase tracking-[1.2px] text-text-muted">
      {children}
    </p>
  )
}

export default function PoolDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const router = useRouter()
  const pool = usePoolsStore((s) => s.getPool(id))
  const joinPool = usePoolsStore((s) => s.joinPool)
  const user = useAuth((s) => s.user)
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null)

  if (!pool) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-text-dim">Pool not found</p>
      </div>
    )
  }

  const takenTeams = new Set(pool.members.map((m) => m.teamCode))
  const userInPool = pool.members.some((m) => m.userId === user?.id)
  const spotsLeft = pool.maxMembers - pool.members.length

  function handleJoin() {
    if (!selectedTeam || !user || userInPool || !pool) return
    const team = teams.find((t) => t.code === selectedTeam)
    if (!team) return
    joinPool(pool.id, {
      userId: user.id,
      name: user.name,
      teamCode: team.code,
      teamName: team.name,
      hasPaid: true,
      joinedAt: new Date().toISOString(),
    })
    setSelectedTeam(null)
  }

  function handleShare() {
    if (!pool) return
    const text = `Join my World Cup pool "${pool.name}" on Vamos!\nEntry: ₹${pool.entryFee} · Prize Pool: ₹${pool.prizePool}`
    if (navigator.share) {
      navigator.share({ title: "Vamos Pool", text })
    }
  }

  return (
    <div className="animate-fade-in min-h-dvh bg-bg pb-32">
      {/* Back */}
      <div className="px-[18px] pt-5">
        <button onClick={() => router.back()} className="press flex items-center gap-1 text-xs font-semibold text-text-dim">
          <ChevRightIcon size={14} className="rotate-180" /> Pools
        </button>
      </div>

      {/* Prize Hero */}
      <div className="mt-4 text-center">
        <p className="font-heading text-[10px] font-bold uppercase tracking-[1.4px] text-text-muted">
          Prize Pool
        </p>
        <p
          className="mt-1 font-heading text-[54px] font-black tracking-tight text-gold"
          style={{ textShadow: "0 0 40px rgba(232,197,71,0.25)" }}
        >
          ₹{pool.prizePool.toLocaleString("en-IN")}
        </p>
        <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-surface px-3 py-1 text-[11px] font-semibold text-text-dim">
          <span className={spotsLeft > 0 ? "text-green" : "text-red"}>●</span>
          {spotsLeft > 0 ? `${spotsLeft} spots left` : "Full"} · ₹{pool.entryFee} entry
        </div>
      </div>

      {/* Team Selection */}
      {pool.type === "tournament" && pool.status === "open" && !userInPool && (
        <div className="mt-6 px-[18px]">
          <Label>Pick Your Country</Label>
          <div className="grid grid-cols-6 gap-2">
            {teams.map((team) => {
              const taken = takenTeams.has(team.code)
              const selected = selectedTeam === team.code
              return (
                <button
                  key={team.code}
                  disabled={taken}
                  onClick={() => setSelectedTeam(selected ? null : team.code)}
                  className="press flex flex-col items-center gap-0.5 rounded-xl p-2 text-center transition-all"
                  style={{
                    opacity: taken ? 0.2 : 1,
                    cursor: taken ? "not-allowed" : "pointer",
                    background: selected ? "rgba(232,197,71,0.15)" : "#1A1A1A",
                    border: selected ? "1px solid #E8C547" : "1px solid rgba(255,255,255,0.06)",
                    boxShadow: selected ? "0 0 16px rgba(232,197,71,0.2)" : "none",
                  }}
                >
                  <span className="text-xl">{team.flag}</span>
                  <span className="text-[9px] font-semibold leading-tight">{team.code}</span>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Already in pool */}
      {userInPool && (
        <div className="mx-[18px] mt-6 rounded-2xl border border-green/20 bg-green/8 p-4 text-center">
          <p className="text-[13px] font-semibold text-green">You&apos;re in this pool!</p>
        </div>
      )}

      {/* Members */}
      <div className="mt-6 px-[18px]">
        <Label>Members ({pool.members.length})</Label>
        <div className="overflow-hidden rounded-2xl border border-border bg-surface">
          {pool.members.map((m, i) => (
            <div
              key={m.userId}
              className="flex items-center gap-3 px-3.5 py-3"
              style={{
                borderTop: i ? "1px solid rgba(255,255,255,0.06)" : "none",
                background: m.userId === user?.id ? "rgba(232,197,71,0.08)" : "transparent",
              }}
            >
              <Avatar name={m.name} size={32} />
              <span className="flex-1 text-[13px] font-semibold">
                {m.name}
                {m.userId === user?.id && <span className="ml-1.5 text-text-dim">(you)</span>}
              </span>
              <span className="text-lg">{teams.find((t) => t.code === m.teamCode)?.flag}</span>
              <span className="text-[11px] text-text-dim">{m.teamCode}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Sticky CTA */}
      {!userInPool && pool.status === "open" && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-bg/90 px-[18px] pb-6 pt-3 backdrop-blur-xl">
          <div className="mx-auto flex max-w-lg gap-3">
            <button
              onClick={handleShare}
              className="press flex h-[54px] w-[54px] shrink-0 items-center justify-center rounded-xl border border-border bg-surface text-text-dim"
            >
              <ShareIcon size={20} />
            </button>
            <Button fullWidth disabled={!selectedTeam} onClick={handleJoin}>
              {selectedTeam
                ? `Join with ${teams.find((t) => t.code === selectedTeam)?.name} — ₹${pool.entryFee}`
                : "Select a team to join"}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
