"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { TrophyIcon, PlusIcon, UserIcon, ChevRightIcon } from "@/components/ui/Icons"
import { usePoolsStore } from "@/lib/pools"

function StatusBadge({ status }: { status: string }) {
  const cfg: Record<string, { bg: string; color: string; label: string }> = {
    open: { bg: "rgba(34,197,94,0.14)", color: "#22C55E", label: "Open" },
    full: { bg: "rgba(136,136,136,0.14)", color: "#888", label: "Full" },
    live: { bg: "rgba(230,57,70,0.16)", color: "#E63946", label: "Live" },
    locked: { bg: "rgba(136,136,136,0.14)", color: "#888", label: "Locked" },
  }
  const c = cfg[status] || cfg.open
  return (
    <span
      className="rounded-full px-2 py-[3px] font-heading text-[10px] font-bold uppercase tracking-wider"
      style={{ background: c.bg, color: c.color }}
    >
      {c.label}
    </span>
  )
}

function PoolCard({ pool }: { pool: ReturnType<typeof usePoolsStore.getState>["pools"][0] }) {
  const fillPct = (pool.members.length / pool.maxMembers) * 100

  return (
    <Link href={`/sweepstake/${pool.id}`} className="block">
      <div className="lift press rounded-2xl border border-border bg-surface p-4">
        {/* Top row */}
        <div className="flex items-start gap-2.5">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-heading text-[16px] font-bold tracking-wide">{pool.name}</span>
              <StatusBadge status={pool.status} />
            </div>
            <div className="flex items-center gap-2.5 text-[12px] text-text-dim">
              <span className="inline-flex items-center gap-1">
                <UserIcon size={12} /> {pool.members.length}/{pool.maxMembers}
              </span>
              <span className="text-text-muted">·</span>
              <span className="capitalize">{pool.type}</span>
            </div>
          </div>
          <div className="text-right">
            <div className="font-heading text-[22px] font-extrabold tracking-tight text-gold" style={{ letterSpacing: -0.5 }}>
              ₹{pool.prizePool.toLocaleString("en-IN")}
            </div>
            <div className="mt-0.5 text-[11px] text-text-dim">₹{pool.entryFee} entry</div>
          </div>
        </div>

        {/* Fill bar */}
        <div className="mt-3.5 h-1 overflow-hidden rounded-full bg-surface-2">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${fillPct}%`,
              background: pool.status === "locked" ? "#888" : "linear-gradient(90deg, #E8C547, #E63946)",
            }}
          />
        </div>
      </div>
    </Link>
  )
}

export default function SweepstakePage() {
  const pools = usePoolsStore((s) => s.pools)
  const router = useRouter()

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
          Sweepstake
        </div>
        <Link href="/sweepstake/create">
          <button className="press flex items-center gap-1 whitespace-nowrap rounded-[10px] bg-red px-3 py-[7px] font-heading text-[12px] font-bold uppercase tracking-wide text-white">
            <PlusIcon size={14} /> Create
          </button>
        </Link>
      </div>

      <p className="px-[18px] pb-1 text-[13px] leading-relaxed text-text-dim">
        Pick a country, claim glory. Winner takes the pot when the World Cup ends.
      </p>

      <div className="flex flex-col gap-3 px-[18px] pt-3.5">
        {pools.map((pool) => (
          <PoolCard key={pool.id} pool={pool} />
        ))}
      </div>

      {pools.length === 0 && (
        <div className="flex flex-col items-center gap-4 py-20">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-surface-2 text-text-dim">
            <TrophyIcon size={28} />
          </div>
          <p className="text-[13px] text-text-dim">No pools yet. Create one!</p>
        </div>
      )}
    </div>
  )
}
