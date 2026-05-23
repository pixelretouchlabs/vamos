"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { ChevRightIcon } from "@/components/ui/Icons"
import { useMatches } from "@/hooks/useMatches"
import { usePredictionsStore } from "@/lib/predictions"

function Label({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-2.5 font-heading text-[11px] font-bold uppercase tracking-[1.2px] text-text-dim">
      {children}
    </p>
  )
}

function MatchRow({ match, predicted }: { match: ReturnType<typeof useMatches>["upcoming"][0]; predicted: { homeScore: number; awayScore: number } | null }) {
  return (
    <Link href={`/predictions/${match.id}`} className="block">
      <div
        className="lift press rounded-2xl border bg-surface p-3.5"
        style={{ borderColor: predicted ? "rgba(34,197,94,0.18)" : "rgba(255,255,255,0.06)" }}
      >
        {/* Header row */}
        <div className="mb-2.5 flex flex-wrap items-center gap-2 font-heading text-[10px] font-bold uppercase tracking-[1.2px] text-text-dim">
          <span
            className="rounded px-[7px] py-[2px] tracking-wider"
            style={{ background: "#252525", color: "#E8C547" }}
          >
            Group {match.group}
          </span>
          <span>{match.date}</span>
          <span className="text-text-muted">·</span>
          <span>{match.timeIST}</span>
          {predicted && (
            <span
              className="ml-auto rounded px-[7px] py-[2px] tracking-wider"
              style={{ background: "rgba(34,197,94,0.14)", color: "#22C55E" }}
            >
              Predicted
            </span>
          )}
        </div>

        {/* Teams row */}
        <div className="flex items-center gap-2">
          <div className="flex flex-1 items-center gap-2.5">
            <span className="text-[30px] leading-none">{match.home.flag}</span>
            <span className="font-heading text-[14px] font-bold tracking-wide">{match.home.code}</span>
          </div>
          {predicted ? (
            <div className="flex items-center gap-1.5 font-mono text-[22px] font-bold">
              <span>{predicted.homeScore}</span>
              <span className="text-text-muted">:</span>
              <span>{predicted.awayScore}</span>
            </div>
          ) : (
            <span className="font-heading text-[12px] font-bold tracking-[2px] text-text-dim">VS</span>
          )}
          <div className="flex flex-1 items-center justify-end gap-2.5">
            <span className="text-right font-heading text-[14px] font-bold tracking-wide">{match.away.code}</span>
            <span className="text-[30px] leading-none">{match.away.flag}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default function PredictionsPage() {
  const { upcoming } = useMatches()
  const predictions = usePredictionsStore((s) => s.predictions)
  const router = useRouter()

  const open = upcoming.filter((m) => !predictions[m.id])
  const done = upcoming.filter((m) => predictions[m.id])

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
          Predictions
        </div>
        <div className="w-9" />
      </div>

      <p className="px-[18px] pb-1 text-[13px] leading-relaxed text-text-dim">
        Predict scorelines and goalscorers. Lock in before kickoff.
      </p>

      {/* Open */}
      <div className="px-[18px] pt-3.5">
        <Label>Open · {open.length}</Label>
        <div className="flex flex-col gap-2.5">
          {open.map((m) => (
            <MatchRow key={m.id} match={m} predicted={null} />
          ))}
        </div>
      </div>

      {/* Locked In */}
      {done.length > 0 && (
        <div className="px-[18px] pt-6">
          <Label>Locked In · {done.length}</Label>
          <div className="flex flex-col gap-2.5">
            {done.map((m) => (
              <MatchRow key={m.id} match={m} predicted={predictions[m.id]} />
            ))}
          </div>
        </div>
      )}

      <div className="h-4" />
    </div>
  )
}
