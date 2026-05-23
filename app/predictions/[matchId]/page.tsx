"use client"

import { use, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/Button"
import { ChevRightIcon, MinusIcon, PlusIcon } from "@/components/ui/Icons"
import { matches } from "@/data/matches"
import { usePredictionsStore } from "@/lib/predictions"

function Label({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={`mb-2.5 font-heading text-[11px] font-bold uppercase tracking-[1.2px] text-text-dim ${className}`}>
      {children}
    </p>
  )
}

function ScoreCounter({
  flag,
  code,
  name,
  value,
  onChange,
}: {
  flag: string
  code: string
  name: string
  value: number
  onChange: (v: number) => void
}) {
  const [bump, setBump] = useState(0)
  const set = (v: number) => {
    onChange(Math.max(0, Math.min(9, v)))
    setBump((b) => b + 1)
  }

  return (
    <div className="flex flex-1 flex-col items-center gap-2 rounded-2xl border border-border bg-surface p-3.5">
      <span className="text-[42px] leading-none">{flag}</span>
      <span className="font-heading text-[12px] font-bold tracking-[1.5px] text-text-dim">{name}</span>
      <div className="mt-1 flex items-center gap-2.5">
        <button
          onClick={() => set(value - 1)}
          className="press flex h-9 w-9 items-center justify-center rounded-full bg-surface-2 text-text"
        >
          <MinusIcon size={16} />
        </button>
        <div
          key={bump}
          className="score-bump min-w-[56px] text-center font-mono text-[48px] font-bold leading-none"
        >
          {value}
        </div>
        <button
          onClick={() => set(value + 1)}
          className="press flex h-9 w-9 items-center justify-center rounded-full bg-gold text-bg"
        >
          <PlusIcon size={16} />
        </button>
      </div>
    </div>
  )
}

function PtsRow({ label, pts, highlight }: { label: string; pts: string; highlight?: boolean }) {
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
        className={`font-heading font-bold text-gold ${highlight ? "text-[18px] font-extrabold" : "text-[14px]"}`}
      >
        +{pts}
      </span>
    </div>
  )
}

export default function PredictMatchPage({
  params,
}: {
  params: Promise<{ matchId: string }>
}) {
  const { matchId } = use(params)
  const router = useRouter()
  const match = matches.find((m) => m.id === matchId)
  const existing = usePredictionsStore((s) => s.getPrediction(matchId))
  const submitPrediction = usePredictionsStore((s) => s.submitPrediction)

  const [homeScore, setHomeScore] = useState(existing?.homeScore ?? 0)
  const [awayScore, setAwayScore] = useState(existing?.awayScore ?? 0)
  const [goalscorer, setGoalscorer] = useState(existing?.goalscorer ?? "")

  if (!match) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-text-dim">Match not found</p>
      </div>
    )
  }

  function handleSubmit() {
    submitPrediction(matchId, homeScore, awayScore, goalscorer || undefined)
    router.push("/predictions")
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
          Match Prediction
        </div>
        <div className="w-9" />
      </div>

      <div className="px-[18px]">
        {/* Centered group badge */}
        <div className="pb-4 pt-1 text-center">
          <span
            className="inline-block rounded px-2.5 py-1 font-heading text-[10px] font-bold uppercase tracking-[1.4px]"
            style={{ background: "#252525", color: "#E8C547" }}
          >
            Group {match.group} · {match.date} · {match.timeIST} IST
          </span>
        </div>

        {/* Score Counters */}
        <div className="flex items-stretch gap-2.5">
          <ScoreCounter flag={match.home.flag} code={match.home.code} name={match.home.name} value={homeScore} onChange={setHomeScore} />
          <div className="flex items-center font-heading text-[14px] font-extrabold tracking-[2px] text-text-dim">
            VS
          </div>
          <ScoreCounter flag={match.away.flag} code={match.away.code} name={match.away.name} value={awayScore} onChange={setAwayScore} />
        </div>

        {/* Goalscorer */}
        <div className="mt-5">
          <div className="mb-2.5 flex items-center justify-between">
            <Label className="mb-0">First Goalscorer</Label>
            <span className="font-heading text-[10px] font-bold tracking-wider text-gold">+5 PTS BONUS</span>
          </div>
          <input
            type="text"
            value={goalscorer}
            onChange={(e) => setGoalscorer(e.target.value)}
            placeholder="e.g. Vinicius Jr"
            className="h-[52px] w-full rounded-xl border border-border bg-surface px-4 text-[15px] font-medium text-text outline-none placeholder:text-text-muted"
          />
        </div>

        {/* Points breakdown — accentGrad */}
        <div
          className="mt-5 rounded-xl border p-4"
          style={{
            background: "linear-gradient(180deg, #1A1A2E, #14141f)",
            borderColor: "rgba(232,197,71,0.16)",
          }}
        >
          <p className="mb-2.5 font-heading text-[11px] font-bold uppercase tracking-[1.2px] text-gold">
            Points Available
          </p>
          <PtsRow label="Correct winner" pts="5" />
          <PtsRow label="Exact scoreline" pts="15" />
          <PtsRow label="Correct goalscorer" pts="5" />
          <PtsRow label="Perfect prediction" pts="25" highlight />
        </div>

        {/* CTA */}
        <div className="mt-6">
          <Button fullWidth onClick={handleSubmit}>
            {existing ? "Update Prediction" : "Submit Prediction"}
          </Button>
        </div>

        <div className="h-6" />
      </div>
    </div>
  )
}
