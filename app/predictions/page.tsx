"use client"

import Link from "next/link"
import { Card } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { useMatches } from "@/hooks/useMatches"
import { usePredictionsStore } from "@/lib/predictions"

export default function PredictionsPage() {
  const { upcoming } = useMatches()
  const predictions = usePredictionsStore((s) => s.predictions)

  return (
    <div className="animate-fade-in space-y-6 px-4 pt-6">
      <h1 className="font-heading text-2xl font-bold">Predictions</h1>
      <p className="text-sm text-text-dim">
        Predict exact scores. Earn points. Climb the leaderboard.
      </p>

      <div className="space-y-3">
        {upcoming.map((match) => {
          const predicted = predictions[match.id]
          return (
            <Link key={match.id} href={`/predictions/${match.id}`}>
              <Card className="transition-transform hover:scale-[1.01] active:scale-[0.99]">
                <div className="flex items-center justify-between">
                  <Badge variant="dim">Group {match.group}</Badge>
                  {predicted && <Badge variant="green">Predicted</Badge>}
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{match.home.flag}</span>
                    <span className="font-semibold">{match.home.code}</span>
                  </div>
                  {predicted ? (
                    <div className="rounded-lg bg-surface-light px-3 py-1 text-center">
                      <span className="font-mono text-lg font-bold">
                        {predicted.homeScore} – {predicted.awayScore}
                      </span>
                    </div>
                  ) : (
                    <span className="text-sm font-bold text-text-dim">VS</span>
                  )}
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{match.away.code}</span>
                    <span className="text-2xl">{match.away.flag}</span>
                  </div>
                </div>
                <p className="mt-2 text-center text-xs text-text-dim">
                  {match.date} · {match.timeIST} IST
                </p>
              </Card>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
