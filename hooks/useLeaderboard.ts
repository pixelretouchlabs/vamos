"use client"

import { mockLeaderboard } from "@/data/mock-users"

export function useLeaderboard() {
  return { leaderboard: mockLeaderboard }
}
