"use client"

import Link from "next/link"
import { Button } from "@/components/ui/Button"
import { TrophyIcon, ChevRightIcon, PlusIcon } from "@/components/ui/Icons"
import { usePoolsStore } from "@/lib/pools"

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    open: "bg-green/20 text-green",
    full: "bg-surface-2 text-text-dim",
    live: "bg-red/20 text-red",
    locked: "bg-surface-2 text-text-dim",
  }
  return (
    <span className={`rounded-full px-2.5 py-0.5 font-heading text-[10px] font-bold uppercase tracking-wider ${styles[status] || styles.open}`}>
      {status}
    </span>
  )
}

function PoolCard({ pool }: { pool: ReturnType<typeof usePoolsStore.getState>["pools"][0] }) {
  const fillPct = Math.min(100, (pool.members.length / pool.maxMembers) * 100)

  return (
    <Link href={`/sweepstake/${pool.id}`} className="block">
      <div className="lift press rounded-2xl border border-border bg-surface p-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-gold-dim text-gold">
              <TrophyIcon size={18} />
            </div>
            <div>
              <h3 className="font-heading text-[15px] font-bold tracking-wide">{pool.name}</h3>
              <p className="mt-0.5 text-[11px] text-text-dim">
                {pool.type === "tournament" ? "Pick a country" : "Match result"}
              </p>
            </div>
          </div>
          <StatusBadge status={pool.status} />
        </div>

        {/* Prize + Members */}
        <div className="mt-4 flex items-end justify-between">
          <div>
            <p className="font-heading text-[10px] font-bold uppercase tracking-[1.2px] text-text-muted">
              Prize Pool
            </p>
            <p className="mt-0.5 font-heading text-[22px] font-black tracking-tight text-gold">
              ₹{pool.prizePool.toLocaleString("en-IN")}
            </p>
          </div>
          <div className="text-right">
            <p className="font-heading text-[10px] font-bold uppercase tracking-[1.2px] text-text-muted">
              Entry
            </p>
            <p className="mt-0.5 font-heading text-[15px] font-bold">₹{pool.entryFee}</p>
          </div>
        </div>

        {/* Fill bar */}
        <div className="mt-3.5">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-text-dim">
              {pool.members.length}/{pool.maxMembers} spots
            </span>
            <span className="font-semibold text-text-dim">{Math.round(fillPct)}%</span>
          </div>
          <div className="mt-1.5 h-[5px] overflow-hidden rounded-full bg-surface-2">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${fillPct}%`,
                background: "linear-gradient(90deg, #E8C547, #E63946)",
              }}
            />
          </div>
        </div>
      </div>
    </Link>
  )
}

export default function SweepstakePage() {
  const pools = usePoolsStore((s) => s.pools)

  return (
    <div className="animate-fade-in space-y-5 px-[18px] pt-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-[22px] font-extrabold tracking-tight">Sweepstake</h1>
          <p className="mt-0.5 text-[12px] text-text-dim">Join or create pools with your crew</p>
        </div>
        <Link href="/sweepstake/create">
          <button className="press flex h-10 items-center gap-1.5 rounded-xl bg-gold px-4 font-heading text-[12px] font-bold uppercase tracking-wide text-bg">
            <PlusIcon size={16} /> Create
          </button>
        </Link>
      </div>

      {/* Pool list */}
      <div className="space-y-3">
        {pools.map((pool) => (
          <PoolCard key={pool.id} pool={pool} />
        ))}
      </div>

      {pools.length === 0 && (
        <div className="flex flex-col items-center gap-4 py-20">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-surface-2 text-text-dim">
            <TrophyIcon size={28} />
          </div>
          <div className="text-center">
            <p className="font-heading text-sm font-bold">No pools yet</p>
            <p className="mt-1 text-[12px] text-text-dim">Create one and invite your friends!</p>
          </div>
          <Link href="/sweepstake/create">
            <Button fullWidth={false}>Create Pool</Button>
          </Link>
        </div>
      )}
    </div>
  )
}
