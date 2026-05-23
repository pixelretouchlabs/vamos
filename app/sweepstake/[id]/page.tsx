"use client"

import { use, useState } from "react"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/Badge"
import { usePoolsStore } from "@/lib/pools"
import { teams } from "@/data/matches"
import { useAuth } from "@/hooks/useAuth"

export default function PoolDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
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
    const text = `Join my World Cup pool "${pool.name}" on Vamos! 🏆⚽\nEntry: ₹${pool.entryFee}\nPrize Pool: ₹${pool.prizePool}`
    if (navigator.share) {
      navigator.share({ title: "Vamos Pool", text })
    }
  }

  return (
    <div className="animate-fade-in space-y-6 px-4 pt-6">
      <div>
        <Badge variant={pool.status === "open" ? "green" : "dim"}>
          {pool.status}
        </Badge>
        <h1 className="mt-2 font-heading text-2xl font-bold">{pool.name}</h1>
      </div>

      <Card glow>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-text-dim">Prize Pool</p>
            <p className="font-heading text-3xl font-black text-gold">
              ₹{pool.prizePool.toLocaleString("en-IN")}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-text-dim">Members</p>
            <p className="text-2xl font-bold">
              {pool.members.length}
              <span className="text-sm text-text-dim">/{pool.maxMembers}</span>
            </p>
          </div>
        </div>
      </Card>

      {/* Team Selection Grid */}
      {pool.type === "tournament" && pool.status === "open" && !userInPool && (
        <div>
          <h2 className="mb-3 font-heading text-lg font-bold">Pick Your Country</h2>
          <div className="grid grid-cols-6 gap-2">
            {teams.map((team) => {
              const taken = takenTeams.has(team.code)
              const selected = selectedTeam === team.code
              return (
                <button
                  key={team.code}
                  disabled={taken}
                  onClick={() => setSelectedTeam(selected ? null : team.code)}
                  className={`flex flex-col items-center gap-0.5 rounded-xl p-2 text-center transition-all ${
                    taken
                      ? "cursor-not-allowed opacity-25"
                      : selected
                        ? "bg-gold/20 ring-2 ring-gold"
                        : "bg-surface hover:bg-surface-light"
                  }`}
                >
                  <span className="text-xl">{team.flag}</span>
                  <span className="text-[9px] font-medium leading-tight">
                    {team.code}
                  </span>
                </button>
              )
            })}
          </div>
          {selectedTeam && (
            <div className="mt-4">
              <Button fullWidth onClick={handleJoin}>
                Join with {teams.find((t) => t.code === selectedTeam)?.name} — ₹
                {pool.entryFee}
              </Button>
            </div>
          )}
        </div>
      )}

      {userInPool && (
        <Card className="border border-green/30 bg-green/10">
          <p className="text-center text-sm font-semibold text-green">
            You&apos;re in this pool! 🎉
          </p>
        </Card>
      )}

      {/* Members */}
      <div>
        <h2 className="mb-3 font-heading text-lg font-bold">Members</h2>
        <Card>
          <div className="space-y-3">
            {pool.members.map((m) => (
              <div
                key={m.userId}
                className={`flex items-center gap-3 ${m.userId === user?.id ? "text-gold" : ""}`}
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-light text-xs font-semibold">
                  {m.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <span className="flex-1 text-sm font-medium">{m.name}</span>
                <span className="text-lg">
                  {teams.find((t) => t.code === m.teamCode)?.flag}
                </span>
                <span className="text-xs text-text-dim">{m.teamName}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Button variant="secondary" fullWidth onClick={handleShare}>
        Share on WhatsApp
      </Button>
    </div>
  )
}
