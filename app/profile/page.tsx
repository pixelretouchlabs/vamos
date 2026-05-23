"use client"

import { Card } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { useAuth } from "@/hooks/useAuth"
import { useQuizStore } from "@/lib/quiz"
import { usePredictionsStore } from "@/lib/predictions"
import { usePoolsStore } from "@/lib/pools"

export default function ProfilePage() {
  const user = useAuth((s) => s.user)
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

  const userPools = pools.filter((p) =>
    p.members.some((m) => m.userId === user.id)
  )

  return (
    <div className="animate-fade-in space-y-6 px-4 pt-6">
      {/* Profile Header */}
      <div className="flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gold text-2xl font-black text-bg">
          {user.avatar}
        </div>
        <div>
          <h1 className="font-heading text-xl font-bold">{user.name}</h1>
          <p className="text-sm text-text-dim">{user.email}</p>
        </div>
      </div>

      {/* Points Card */}
      <Card glow>
        <p className="text-xs font-semibold uppercase tracking-wider text-text-dim">
          Total Points
        </p>
        <p className="mt-1 font-heading text-4xl font-black text-gold">
          {user.totalPoints}
        </p>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="text-center">
          <p className="text-2xl font-bold">{Object.keys(predictions).length}</p>
          <p className="text-xs text-text-dim">Predictions</p>
        </Card>
        <Card className="text-center">
          <p className="text-2xl font-bold">{userPools.length}</p>
          <p className="text-xs text-text-dim">Pools</p>
        </Card>
        <Card className="text-center">
          <p className="text-2xl font-bold">🔥 {streak}</p>
          <p className="text-xs text-text-dim">Quiz Streak</p>
        </Card>
      </div>

      {/* Pools */}
      {userPools.length > 0 && (
        <div>
          <h2 className="mb-3 font-heading text-lg font-bold">Your Pools</h2>
          <div className="space-y-2">
            {userPools.map((pool) => {
              const member = pool.members.find((m) => m.userId === user.id)
              return (
                <Card key={pool.id}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold">{pool.name}</p>
                      <p className="text-xs text-text-dim">
                        {member?.teamName} {member?.teamCode && `(${member.teamCode})`}
                      </p>
                    </div>
                    <Badge variant="gold">₹{pool.prizePool}</Badge>
                  </div>
                </Card>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
