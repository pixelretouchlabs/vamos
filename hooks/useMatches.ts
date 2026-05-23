"use client"

import { useMemo } from "react"
import { matches } from "@/data/matches"
import type { Match } from "@/types"

export function useMatches() {
  const upcoming = useMemo(() => {
    const now = new Date()
    return matches
      .filter((m) => m.status === "upcoming")
      .sort((a, b) => {
        const dateA = new Date(`${a.date}T${a.timeIST}:00+05:30`)
        const dateB = new Date(`${b.date}T${b.timeIST}:00+05:30`)
        return dateA.getTime() - dateB.getTime()
      })
  }, [])

  const nextMatch: Match | undefined = upcoming[0]

  return { matches, upcoming, nextMatch }
}
