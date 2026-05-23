"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/Button"
import { ChevRightIcon } from "@/components/ui/Icons"
import { usePoolsStore } from "@/lib/pools"

const entryFees = [100, 200, 500, 1000]

function Label({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-2.5 font-heading text-[11px] font-bold uppercase tracking-[1.2px] text-text-muted">
      {children}
    </p>
  )
}

function FeeRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-1.5 text-[13px]">
      <span className="text-text-dim">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  )
}

export default function CreatePoolPage() {
  const router = useRouter()
  const createPool = usePoolsStore((s) => s.createPool)
  const [name, setName] = useState("")
  const [type, setType] = useState<"tournament" | "match">("tournament")
  const [entryFee, setEntryFee] = useState(500)
  const [focus, setFocus] = useState(false)

  function handleCreate() {
    if (!name.trim()) return
    const id = createPool(name.trim(), type, entryFee)
    router.push(`/sweepstake/${id}`)
  }

  return (
    <div className="animate-fade-in min-h-dvh bg-bg">
      {/* Back + Title */}
      <div className="px-[18px] pt-5">
        <button onClick={() => router.back()} className="press mb-3 flex items-center gap-1 text-xs font-semibold text-text-dim">
          <ChevRightIcon size={14} className="rotate-180" /> Back
        </button>
        <h1 className="font-heading text-[22px] font-extrabold tracking-tight">Create Pool</h1>
      </div>

      <div className="space-y-6 px-[18px] pt-6">
        {/* Pool Name */}
        <div>
          <Label>Pool Name</Label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onFocus={() => setFocus(true)}
            onBlur={() => setFocus(false)}
            placeholder="e.g. Office World Cup Pool"
            className="h-[54px] w-full rounded-xl border bg-surface px-4 font-body text-[15px] font-semibold text-text outline-none transition-all placeholder:text-text-muted"
            style={{
              borderColor: focus ? "#E8C547" : "rgba(255,255,255,0.06)",
              boxShadow: focus ? "0 0 0 4px rgba(232,197,71,0.12)" : "none",
            }}
          />
        </div>

        {/* Pool Type */}
        <div>
          <Label>Pool Type</Label>
          <div className="grid grid-cols-2 gap-3">
            {(["tournament", "match"] as const).map((t) => {
              const selected = type === t
              return (
                <button
                  key={t}
                  onClick={() => setType(t)}
                  className="press flex flex-col items-start rounded-2xl border p-4 text-left transition-all"
                  style={{
                    borderColor: selected ? "#E8C547" : "rgba(255,255,255,0.06)",
                    background: selected ? "rgba(232,197,71,0.08)" : "#1A1A1A",
                    boxShadow: selected ? "0 0 20px rgba(232,197,71,0.12)" : "none",
                  }}
                >
                  <span className="font-heading text-[13px] font-bold uppercase tracking-wide">
                    {t}
                  </span>
                  <span className="mt-1 text-[11px] leading-relaxed text-text-dim">
                    {t === "tournament"
                      ? "Pick a country, winner takes all"
                      : "Pick match result, split the pot"}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Entry Fee */}
        <div>
          <Label>Entry Fee</Label>
          <div className="grid grid-cols-4 gap-2.5">
            {entryFees.map((fee) => {
              const selected = entryFee === fee
              return (
                <button
                  key={fee}
                  onClick={() => setEntryFee(fee)}
                  className="press h-[50px] rounded-xl border font-heading text-[15px] font-bold transition-all"
                  style={{
                    borderColor: selected ? "#E8C547" : "rgba(255,255,255,0.06)",
                    background: selected ? "#E8C547" : "#1A1A1A",
                    color: selected ? "#0D0D0D" : "#fff",
                    boxShadow: selected ? "0 4px 16px rgba(232,197,71,0.3)" : "none",
                  }}
                >
                  ₹{fee}
                </button>
              )
            })}
          </div>
        </div>

        {/* Fee Breakdown */}
        <div
          className="rounded-2xl border border-border p-4"
          style={{ background: "linear-gradient(160deg, rgba(232,197,71,0.06), rgba(230,57,70,0.04))" }}
        >
          <FeeRow label="Pool creation fee" value="₹49" />
          <div className="my-1.5 h-px bg-border" />
          <FeeRow label="Platform fee" value="5% of prize pool" />
          <div className="my-1.5 h-px bg-border" />
          <FeeRow label="You pay now" value="₹49" />
        </div>

        {/* CTA */}
        <Button fullWidth disabled={!name.trim()} onClick={handleCreate}>
          Create Pool — ₹49
        </Button>

        <div className="h-6" />
      </div>
    </div>
  )
}
