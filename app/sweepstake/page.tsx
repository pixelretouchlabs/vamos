"use client"

import Link from "next/link"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/Badge"
import { usePoolsStore } from "@/lib/pools"

export default function SweepstakePage() {
  const pools = usePoolsStore((s) => s.pools)

  return (
    <div className="animate-fade-in space-y-6 px-4 pt-6">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl font-bold">Sweepstake</h1>
        <Link href="/sweepstake/create">
          <Button>+ Create Pool</Button>
        </Link>
      </div>

      <div className="space-y-3">
        {pools.map((pool) => (
          <Link key={pool.id} href={`/sweepstake/${pool.id}`}>
            <Card className="transition-transform hover:scale-[1.01] active:scale-[0.99]">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-heading font-bold">{pool.name}</h3>
                  <p className="mt-1 text-sm text-text-dim">
                    {pool.members.length}/{pool.maxMembers} members
                  </p>
                </div>
                <Badge variant={pool.status === "open" ? "green" : "dim"}>
                  {pool.status}
                </Badge>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <div>
                  <p className="text-xs text-text-dim">Prize Pool</p>
                  <p className="font-heading text-lg font-bold text-gold">
                    ₹{pool.prizePool.toLocaleString("en-IN")}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-text-dim">Entry Fee</p>
                  <p className="font-semibold">₹{pool.entryFee}</p>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      {pools.length === 0 && (
        <div className="py-20 text-center">
          <p className="text-4xl">🏆</p>
          <p className="mt-3 text-text-dim">No pools yet. Create one!</p>
        </div>
      )}
    </div>
  )
}
