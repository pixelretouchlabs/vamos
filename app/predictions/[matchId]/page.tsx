"use client"

import { use, useState } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/Badge"
import { matches } from "@/data/matches"
import { usePredictionsStore } from "@/lib/predictions"

function ScoreInput({
  value,
  onChange,
}: {
  value: number
  onChange: (v: number) => void
}) {
  return (
    <div className="flex items-center gap-3">
      <button
        onClick={() => onChange(Math.max(0, value - 1))}
        className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-light text-lg font-bold transition-colors hover:bg-gold/20"
      >
        −
      </button>
      <span className="w-8 text-center font-mono text-3xl font-black">
        {value}
      </span>
      <button
        onClick={() => onChange(Math.min(9, value + 1))}
        className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-light text-lg font-bold transition-colors hover:bg-gold/20"
      >
        +
      </button>
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
    <div className="animate-fade-in space-y-6 px-4 pt-6">
      <Badge variant="dim">Group {match.group}</Badge>
      <p className="text-sm text-text-dim">
        {match.date} · {match.timeIST} IST · {match.venue}
      </p>

      <Card glow>
        <div className="flex items-center justify-between py-4">
          <div className="flex flex-col items-center gap-2">
            <span className="text-4xl">{match.home.flag}</span>
            <span className="font-heading font-bold">{match.home.name}</span>
          </div>
          <div className="flex flex-col items-center gap-4">
            <ScoreInput value={homeScore} onChange={setHomeScore} />
            <span className="text-xs text-text-dim">vs</span>
            <ScoreInput value={awayScore} onChange={setAwayScore} />
          </div>
          <div className="flex flex-col items-center gap-2">
            <span className="text-4xl">{match.away.flag}</span>
            <span className="font-heading font-bold">{match.away.name}</span>
          </div>
        </div>
      </Card>

      <Card>
        <label className="block">
          <span className="text-sm font-semibold text-text-dim">
            First Goalscorer (bonus +5 pts)
          </span>
          <input
            type="text"
            value={goalscorer}
            onChange={(e) => setGoalscorer(e.target.value)}
            placeholder="e.g. Mbappe"
            className="mt-1 block w-full rounded-xl border border-surface-light bg-bg px-4 py-3 text-white placeholder:text-text-dim focus:border-gold focus:outline-none"
          />
        </label>
      </Card>

      <Card className="bg-navy/50">
        <h3 className="mb-2 text-sm font-semibold text-text-dim">Points</h3>
        <div className="space-y-1 text-sm">
          <div className="flex justify-between">
            <span className="text-text-dim">Correct winner</span>
            <span>5 pts</span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-dim">Correct scoreline</span>
            <span>15 pts</span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-dim">Correct goalscorer</span>
            <span>5 pts</span>
          </div>
        </div>
      </Card>

      <Button fullWidth onClick={handleSubmit}>
        {existing ? "Update Prediction" : "Submit Prediction"}
      </Button>
    </div>
  )
}
