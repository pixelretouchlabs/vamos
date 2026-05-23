"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/Button"
import { ChevRightIcon } from "@/components/ui/Icons"
import { usePoolsStore } from "@/lib/pools"

const entryFees = [100, 200, 500, 1000]

function Label({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={`mb-2.5 font-heading text-[11px] font-bold uppercase tracking-[1.2px] text-text-dim ${className}`}>
      {children}
    </p>
  )
}

function FeeRow({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div
      className="flex items-center justify-between"
      style={{
        padding: "6px 0",
        borderTop: highlight ? "1px solid rgba(232,197,71,0.16)" : "none",
        marginTop: highlight ? 8 : 0,
        paddingTop: highlight ? 12 : 6,
      }}
    >
      <span className={`text-[13px] ${highlight ? "text-text" : "text-text-dim"}`}>{label}</span>
      <span
        className={highlight ? "font-heading text-[16px] font-extrabold text-gold" : "font-mono text-[13px] font-semibold"}
      >
        {value}
      </span>
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
      {/* App bar */}
      <div className="flex min-h-[44px] items-center gap-3 px-[18px] py-2 pb-3">
        <button
          onClick={() => router.back()}
          className="press flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-surface"
        >
          <ChevRightIcon size={18} className="rotate-180" />
        </button>
        <div className="flex-1 text-center font-heading text-[16px] font-bold uppercase tracking-wide">
          Create Pool
        </div>
        <div className="w-9" />
      </div>

      <div className="space-y-5 px-[18px] pt-1">
        {/* Pool Name */}
        <div>
          <Label>Pool Name</Label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onFocus={() => setFocus(true)}
            onBlur={() => setFocus(false)}
            placeholder="Bandra Boys WC26"
            className="h-[52px] w-full rounded-xl border bg-surface px-4 text-[15px] font-medium text-text outline-none transition-all placeholder:text-text-muted"
            style={{
              borderColor: focus ? "#E8C547" : "rgba(255,255,255,0.06)",
              boxShadow: focus ? "0 0 0 4px rgba(232,197,71,0.12)" : "none",
            }}
          />
        </div>

        {/* Pool Type */}
        <div>
          <Label>Pool Type</Label>
          <div className="grid grid-cols-2 gap-2.5">
            {([
              { v: "tournament" as const, t: "Tournament", s: "Full World Cup" },
              { v: "match" as const, t: "Match", s: "Single game" },
            ]).map((opt) => {
              const selected = type === opt.v
              return (
                <button
                  key={opt.v}
                  onClick={() => setType(opt.v)}
                  className="press rounded-xl p-3.5 text-left transition-all"
                  style={{
                    background: "#1A1A1A",
                    border: `1.5px solid ${selected ? "#E8C547" : "rgba(255,255,255,0.06)"}`,
                    boxShadow: selected ? "0 0 0 4px rgba(232,197,71,0.12)" : "none",
                  }}
                >
                  <span className="font-heading text-[14px] font-bold">{opt.t}</span>
                  <span className="mt-0.5 block text-[11px] text-text-dim">{opt.s}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Entry Fee */}
        <div>
          <Label>Entry Fee</Label>
          <div className="grid grid-cols-4 gap-2">
            {entryFees.map((fee) => {
              const selected = entryFee === fee
              return (
                <button
                  key={fee}
                  onClick={() => setEntryFee(fee)}
                  className="press h-12 rounded-xl font-heading text-[14px] font-bold transition-all"
                  style={{
                    background: selected ? "#E8C547" : "#1A1A1A",
                    border: `1.5px solid ${selected ? "#E8C547" : "rgba(255,255,255,0.06)"}`,
                    color: selected ? "#0D0D0D" : "#fff",
                  }}
                >
                  ₹{fee}
                </button>
              )
            })}
          </div>
        </div>

        {/* Fee Breakdown — accentGrad */}
        <div
          className="rounded-xl border p-4"
          style={{
            background: "linear-gradient(180deg, #1A1A2E, #14141f)",
            borderColor: "rgba(232,197,71,0.16)",
          }}
        >
          <p className="mb-2.5 font-heading text-[11px] font-bold uppercase tracking-[1.2px] text-gold">
            Fee Breakdown
          </p>
          <FeeRow label="Pool creation fee" value="₹49" />
          <FeeRow label="Platform fee (per entry)" value="5%" />
          <FeeRow label={`Max prize pool at ₹${entryFee} × 48`} value={`₹${(entryFee * 48 * 0.95).toLocaleString()}`} highlight />
        </div>

        {/* CTA */}
        <Button fullWidth disabled={!name.trim()} onClick={handleCreate}>
          Create Pool — ₹49
        </Button>

        <p className="text-center text-[11px] leading-relaxed text-text-muted">
          You&apos;ll be the first to pick. Share with friends to fill 48 spots.
        </p>

        <div className="h-4" />
      </div>
    </div>
  )
}
