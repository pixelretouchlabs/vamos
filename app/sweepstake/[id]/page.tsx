"use client"

import { use, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/Button"
import { Avatar } from "@/components/ui/Avatar"
import { ChevRightIcon, UserIcon } from "@/components/ui/Icons"
import { usePoolsStore } from "@/lib/pools"
import { teams } from "@/data/matches"
import { useAuth } from "@/hooks/useAuth"

function Label({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-2.5 font-heading text-[11px] font-bold uppercase tracking-[1.2px] text-text-dim">
      {children}
    </p>
  )
}

// WhatsApp icon
function WhatsAppIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 21l1.65-4.5A8.5 8.5 0 1 1 8 19.5L3 21z" />
      <path d="M8.5 9.5c0 3 2 5 5 5l1.5-1.5-2-1-1 1c-1-.5-1.5-1-2-2l1-1-1-2L8.5 9.5z" fill="currentColor" stroke="none" />
    </svg>
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
    <div className="animate-fade-in min-h-dvh bg-bg pb-[120px]">
      {/* App bar */}
      <div className="flex min-h-[44px] items-center gap-3 px-[18px] py-2 pb-3">
        <button
          onClick={() => router.back()}
          className="press flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-surface"
        >
          <ChevRightIcon size={18} className="rotate-180" />
        </button>
        <div className="flex-1 text-center font-heading text-[16px] font-bold uppercase tracking-wide">
          {pool.name}
        </div>
        <div className="w-9" />
      </div>

      {/* Prize hero */}
      <div className="px-[18px] pt-2 text-center">
        <p className="font-heading text-[11px] font-bold uppercase tracking-[1.4px] text-gold">
          Total Prize Pool
        </p>
        <p
          className="mt-1 font-heading text-[54px] font-extrabold leading-none tracking-tight text-gold"
          style={{ letterSpacing: -2, textShadow: "0 0 30px rgba(232,197,71,0.25)" }}
        >
          ₹{pool.prizePool.toLocaleString("en-IN")}
        </p>
        <div className="mt-2.5 inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1.5 text-[12px]">
          <UserIcon size={12} className="text-text-dim" />
          <span>{pool.members.length}/{pool.maxMembers} spots taken</span>
        </div>
      </div>

      {/* Flag grid */}
      {pool.type === "tournament" && pool.status === "open" && !userInPool && (
        <div className="mt-5 px-[18px]">
          <Label>Pick Your Country</Label>
          <div className="grid grid-cols-6 gap-1.5">
            {teams.map((team) => {
              const taken = takenTeams.has(team.code) && selectedTeam !== team.code
              const selected = selectedTeam === team.code
              return (
                <button
                  key={team.code}
                  disabled={taken}
                  onClick={() => setSelectedTeam(selected ? null : team.code)}
                  className="press flex flex-col items-center justify-center gap-0.5 p-1 transition-all"
                  style={{
                    aspectRatio: "1",
                    borderRadius: 10,
                    background: selected ? "rgba(232,197,71,0.12)" : "#1A1A1A",
                    border: `1.5px solid ${selected ? "#E8C547" : "rgba(255,255,255,0.06)"}`,
                    boxShadow: selected ? "0 0 0 3px rgba(232,197,71,0.12), 0 0 16px rgba(232,197,71,0.4)" : "none",
                    opacity: taken ? 0.25 : 1,
                    cursor: taken ? "not-allowed" : "pointer",
                  }}
                >
                  <span className="text-[20px] leading-none">{team.flag}</span>
                  <span
                    className="font-heading text-[8px] font-bold tracking-wide"
                    style={{ color: selected ? "#E8C547" : "#888" }}
                  >
                    {team.code}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Already in pool */}
      {userInPool && (
        <div className="mx-[18px] mt-5 rounded-2xl border border-green/20 bg-green/10 p-4 text-center">
          <p className="text-[13px] font-semibold text-green">You&apos;re in this pool!</p>
        </div>
      )}

      {/* Members */}
      <div className="mt-5 px-[18px]">
        <Label>Squad ({pool.members.length} of {pool.maxMembers})</Label>
        <div className="overflow-hidden rounded-2xl border border-border bg-surface">
          {pool.members.map((m, i) => (
            <div
              key={m.userId}
              className="flex items-center gap-3 px-3.5 py-[11px]"
              style={{ borderTop: i ? "1px solid rgba(255,255,255,0.06)" : "none" }}
            >
              <Avatar name={m.name} size={30} />
              <span className="flex-1 text-[13px] font-semibold">{m.name}</span>
              <span className="text-[18px] leading-none">{teams.find((t) => t.code === m.teamCode)?.flag}</span>
              <span className="w-8 text-right font-heading text-[12px] font-bold text-text-dim">
                {m.teamCode}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="h-6" />

      {/* Sticky CTA */}
      {!userInPool && pool.status === "open" && (
        <div
          className="fixed bottom-0 left-0 right-0 z-50 px-[18px] pb-7 pt-4"
          style={{ background: "linear-gradient(180deg, rgba(13,13,13,0) 0%, rgba(13,13,13,0.92) 35%, #0D0D0D 100%)" }}
        >
          <div className="mx-auto flex max-w-lg gap-2.5">
            <div className="flex-[2]">
              <Button fullWidth disabled={!selectedTeam} onClick={handleJoin}>
                {selectedTeam
                  ? `Join with ${teams.find((t) => t.code === selectedTeam)?.name?.split(" ")[0] || selectedTeam} — ₹${pool.entryFee}`
                  : "Pick a country"}
              </Button>
            </div>
            <button
              onClick={handleShare}
              className="press flex h-[54px] w-[54px] shrink-0 items-center justify-center rounded-xl border border-border-strong bg-surface text-green"
            >
              <WhatsAppIcon size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
