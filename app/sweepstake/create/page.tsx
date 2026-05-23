"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { usePoolsStore } from "@/lib/pools"

const entryFees = [100, 200, 500, 1000]

export default function CreatePoolPage() {
  const router = useRouter()
  const createPool = usePoolsStore((s) => s.createPool)
  const [name, setName] = useState("")
  const [type, setType] = useState<"tournament" | "match">("tournament")
  const [entryFee, setEntryFee] = useState(500)

  function handleCreate() {
    if (!name.trim()) return
    const id = createPool(name.trim(), type, entryFee)
    router.push(`/sweepstake/${id}`)
  }

  return (
    <div className="animate-fade-in space-y-6 px-4 pt-6">
      <h1 className="font-heading text-2xl font-bold">Create Pool</h1>

      <Card>
        <label className="block">
          <span className="text-sm font-semibold text-text-dim">Pool Name</span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Office World Cup Pool"
            className="mt-1 block w-full rounded-xl border border-surface-light bg-bg px-4 py-3 text-white placeholder:text-text-dim focus:border-gold focus:outline-none"
          />
        </label>
      </Card>

      <Card>
        <span className="text-sm font-semibold text-text-dim">Pool Type</span>
        <div className="mt-2 grid grid-cols-2 gap-3">
          {(["tournament", "match"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setType(t)}
              className={`rounded-xl border-2 px-4 py-3 text-center text-sm font-semibold capitalize transition-colors ${
                type === t
                  ? "border-gold bg-gold/10 text-gold"
                  : "border-surface-light text-text-dim hover:border-text-dim"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
        <p className="mt-2 text-xs text-text-dim">
          {type === "tournament"
            ? "Pick a country — winner takes all when their team wins the World Cup"
            : "Pick match result — winners split the pot"}
        </p>
      </Card>

      <Card>
        <span className="text-sm font-semibold text-text-dim">Entry Fee</span>
        <div className="mt-2 grid grid-cols-4 gap-2">
          {entryFees.map((fee) => (
            <button
              key={fee}
              onClick={() => setEntryFee(fee)}
              className={`rounded-xl border-2 px-3 py-2.5 text-center text-sm font-bold transition-colors ${
                entryFee === fee
                  ? "border-gold bg-gold/10 text-gold"
                  : "border-surface-light text-text-dim hover:border-text-dim"
              }`}
            >
              ₹{fee}
            </button>
          ))}
        </div>
      </Card>

      <Card className="bg-navy/50">
        <div className="flex items-center justify-between text-sm">
          <span className="text-text-dim">Pool creation fee</span>
          <span className="font-semibold">₹49</span>
        </div>
        <div className="mt-1 flex items-center justify-between text-sm">
          <span className="text-text-dim">Platform fee</span>
          <span className="font-semibold">5% of prize pool</span>
        </div>
      </Card>

      <Button fullWidth disabled={!name.trim()} onClick={handleCreate}>
        Create Pool — ₹49
      </Button>
    </div>
  )
}
