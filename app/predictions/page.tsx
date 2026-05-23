"use client"

import Link from "next/link"
import { ChevRightIcon } from "@/components/ui/Icons"
import { useMatches } from "@/hooks/useMatches"
import { usePredictionsStore } from "@/lib/predictions"

export default function PredictionsPage() {
  const { upcoming } = useMatches()
  const predictions = usePredictionsStore((s) => s.predictions)

  return (
    <div className="animate-fade-in space-y-5 px-[18px] pt-6">
      <div>
        <h1 className="font-heading text-[22px] font-extrabold tracking-tight">Predictions</h1>
        <p className="mt-0.5 text-[12px] text-text-dim">
          Predict exact scores. Earn points. Climb the leaderboard.
        </p>
      </div>

      <div className="space-y-2.5">
        {upcoming.map((match) => {
          const predicted = predictions[match.id]
          return (
            <Link key={match.id} href={`/predictions/${match.id}`} className="block">
              <div
                className="lift press rounded-2xl border bg-surface px-4 py-3.5 transition-all"
                style={{
                  borderColor: predicted ? "rgba(52,211,153,0.3)" : "rgba(255,255,255,0.06)",
                }}
              >
                {/* Top row: group + date */}
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-surface-2 px-2 py-0.5 font-heading text-[10px] font-bold uppercase tracking-wider text-text-dim">
                    Group {match.group}
                  </span>
                  <div className="flex items-center gap-1">
                    {predicted && (
                      <span className="rounded-full bg-green/20 px-2 py-0.5 font-heading text-[10px] font-bold uppercase tracking-wider text-green">
                        Predicted
                      </span>
                    )}
                    <ChevRightIcon size={14} className="text-text-muted" />
                  </div>
                </div>

                {/* Teams row */}
                <div className="mt-3 flex items-center">
                  <div className="flex flex-1 items-center gap-2.5">
                    <span className="text-2xl">{match.home.flag}</span>
                    <span className="font-heading text-[13px] font-bold tracking-wide">{match.home.code}</span>
                  </div>

                  {predicted ? (
                    <div className="rounded-lg bg-surface-2 px-3 py-1.5">
                      <span className="font-mono text-[18px] font-bold tracking-wider">
                        {predicted.homeScore} – {predicted.awayScore}
                      </span>
                    </div>
                  ) : (
                    <span className="font-heading text-[11px] font-bold tracking-[2px] text-text-muted">VS</span>
                  )}

                  <div className="flex flex-1 items-center justify-end gap-2.5">
                    <span className="font-heading text-[13px] font-bold tracking-wide">{match.away.code}</span>
                    <span className="text-2xl">{match.away.flag}</span>
                  </div>
                </div>

                {/* Footer */}
                <div className="mt-2.5 flex gap-2 text-[11px] text-text-muted">
                  <span>{match.date}</span>
                  <span>·</span>
                  <span>{match.timeIST} IST</span>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
