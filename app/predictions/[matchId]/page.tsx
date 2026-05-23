"use client"

import { use, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/Button"
import { ChevRightIcon, MinusIcon, PlusIcon } from "@/components/ui/Icons"
import { matches } from "@/data/matches"
import { usePredictionsStore } from "@/lib/predictions"

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
  return (
    <div className="flex-1 rounded-2xl border border-border bg-surface p-4">
      <div className="flex items-center gap-2.5">
        <span className="text-3xl">{flag}</span>
        <div>
          <div className="font-heading text-[13px] font-bold tracking-wide">{code}</div>
          <div className="text-[11px] text-text-dim">{name}</div>
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <button
          onClick={() => onChange(Math.max(0, value - 1))}
          className="press flex h-10 w-10 items-center justify-center rounded-full bg-surface-2 text-text-dim transition-colors"
        >
          <MinusIcon size={18} />
        </button>
        <span className="score-bump font-mono text-[48px] font-black leading-none tracking-tight">
          {value}
        </span>
        <button
          onClick={() => onChange(Math.min(9, value + 1))}
          className="press flex h-10 w-10 items-center justify-center rounded-full bg-surface-2 text-text-dim transition-colors"
        >
          <PlusIcon size={18} />
        </button>
      </div>
    </div>
  )
}

function PtsRow({ label, pts }: { label: string; pts: string }) {
  return (
    <div className="flex items-center justify-between py-1.5 text-[13px]">
      <span className="text-text-dim">{label}</span>
      <span className="font-heading font-bold text-gold">{pts}</span>
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
  const [gsFocus, setGsFocus] = useState(false)

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
      {/* Back */}
      <div className="px-[18px] pt-5">
        <button onClick={() => router.back()} className="press mb-3 flex items-center gap-1 text-xs font-semibold text-text-dim">
          <ChevRightIcon size={14} className="rotate-180" /> Predictions
        </button>
      </div>

      <div className="space-y-5 px-[18px]">
        {/* Match info */}
        <div>
          <span className="rounded-full bg-surface-2 px-2.5 py-0.5 font-heading text-[10px] font-bold uppercase tracking-wider text-text-dim">
            Group {match.group}
          </span>
          <p className="mt-2 text-[12px] text-text-dim">
            {match.date} · {match.timeIST} IST · {match.venue}
          </p>
        </div>

        {/* Score Counters */}
        <div className="flex gap-3">
          <ScoreCounter
            flag={match.home.flag}
            code={match.home.code}
            name={match.home.name}
            value={homeScore}
            onChange={setHomeScore}
          />
          <ScoreCounter
            flag={match.away.flag}
            code={match.away.code}
            name={match.away.name}
            value={awayScore}
            onChange={setAwayScore}
          />
        </div>

        {/* Goalscorer */}
        <div>
          <p className="mb-2.5 font-heading text-[11px] font-bold uppercase tracking-[1.2px] text-text-muted">
            First Goalscorer (bonus)
          </p>
          <input
            type="text"
            value={goalscorer}
            onChange={(e) => setGoalscorer(e.target.value)}
            onFocus={() => setGsFocus(true)}
            onBlur={() => setGsFocus(false)}
            placeholder="e.g. Mbappe"
            className="h-[50px] w-full rounded-xl border bg-surface px-4 font-body text-[14px] font-semibold text-text outline-none transition-all placeholder:text-text-muted"
            style={{
              borderColor: gsFocus ? "#E8C547" : "rgba(255,255,255,0.06)",
              boxShadow: gsFocus ? "0 0 0 4px rgba(232,197,71,0.12)" : "none",
            }}
          />
        </div>

        {/* Points Breakdown */}
        <div
          className="rounded-2xl border border-border p-4"
          style={{ background: "linear-gradient(160deg, rgba(232,197,71,0.06), rgba(230,57,70,0.04))" }}
        >
          <p className="mb-1 font-heading text-[11px] font-bold uppercase tracking-[1.2px] text-text-muted">
            Points Breakdown
          </p>
          <PtsRow label="Correct winner" pts="+5 pts" />
          <div className="h-px bg-border" />
          <PtsRow label="Correct scoreline" pts="+15 pts" />
          <div className="h-px bg-border" />
          <PtsRow label="Correct goalscorer" pts="+5 pts" />
        </div>

        {/* CTA */}
        <Button fullWidth onClick={handleSubmit}>
          {existing ? "Update Prediction" : "Submit Prediction"}
        </Button>

        <div className="h-6" />
      </div>
    </div>
  )
}
