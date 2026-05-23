import { create } from "zustand"
import type { Pool, PoolMember } from "@/types"
import { teams } from "@/data/matches"

interface PoolsState {
  pools: Pool[]
  createPool: (name: string, type: "tournament" | "match", entryFee: number, matchId?: string) => string
  joinPool: (poolId: string, member: PoolMember) => void
  getPool: (id: string) => Pool | undefined
}

const samplePools: Pool[] = [
  {
    id: "pool_001",
    name: "Office World Cup Pool",
    type: "tournament",
    creatorId: "user_001",
    entryFee: 500,
    prizePool: 8000,
    maxMembers: 48,
    status: "open",
    createdAt: "2026-05-20T10:00:00Z",
    members: [
      { userId: "u1", name: "Arjun M", teamCode: "BRA", teamName: "Brazil", hasPaid: true, joinedAt: "2026-05-20T10:05:00Z" },
      { userId: "u2", name: "Priya S", teamCode: "ARG", teamName: "Argentina", hasPaid: true, joinedAt: "2026-05-20T10:10:00Z" },
      { userId: "u3", name: "Rahul K", teamCode: "FRA", teamName: "France", hasPaid: true, joinedAt: "2026-05-20T10:15:00Z" },
      { userId: "user_001", name: "Karthik B", teamCode: "ESP", teamName: "Spain", hasPaid: true, joinedAt: "2026-05-20T11:00:00Z" },
    ],
  },
  {
    id: "pool_002",
    name: "College Gang Pool",
    type: "tournament",
    creatorId: "u2",
    entryFee: 200,
    prizePool: 2400,
    maxMembers: 48,
    status: "open",
    createdAt: "2026-05-22T14:00:00Z",
    members: [
      { userId: "u2", name: "Priya S", teamCode: "GER", teamName: "Germany", hasPaid: true, joinedAt: "2026-05-22T14:05:00Z" },
      { userId: "u5", name: "Sneha R", teamCode: "ENG", teamName: "England", hasPaid: true, joinedAt: "2026-05-22T14:10:00Z" },
    ],
  },
]

let nextId = 3

export const usePoolsStore = create<PoolsState>((set, get) => ({
  pools: samplePools,
  createPool: (name, type, entryFee, matchId) => {
    const id = `pool_${String(nextId++).padStart(3, "0")}`
    const pool: Pool = {
      id,
      name,
      type,
      matchId,
      creatorId: "user_001",
      entryFee,
      prizePool: 0,
      maxMembers: type === "tournament" ? 48 : 100,
      status: "open",
      createdAt: new Date().toISOString(),
      members: [],
    }
    set((state) => ({ pools: [...state.pools, pool] }))
    return id
  },
  joinPool: (poolId, member) => {
    set((state) => ({
      pools: state.pools.map((p) =>
        p.id === poolId
          ? {
              ...p,
              members: [...p.members, member],
              prizePool: p.prizePool + p.entryFee,
            }
          : p
      ),
    }))
  },
  getPool: (id) => get().pools.find((p) => p.id === id),
}))
