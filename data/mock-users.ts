import type { LeaderboardEntry, User } from "@/types"

export const mockCurrentUser: User = {
  id: "user_001",
  name: "Karthik B",
  phone: "+919876543210",
  email: "karthik@example.com",
  avatar: "KB",
  totalPoints: 245,
  createdAt: "2026-05-20T10:00:00Z",
  notificationsEnabled: true,
}

export const mockLeaderboard: LeaderboardEntry[] = [
  { rank: 1, userId: "u1", name: "Arjun M", avatar: "AM", points: 380, movement: "same" },
  { rank: 2, userId: "u2", name: "Priya S", avatar: "PS", points: 355, movement: "up" },
  { rank: 3, userId: "u3", name: "Rahul K", avatar: "RK", points: 320, movement: "down" },
  { rank: 4, userId: "user_001", name: "Karthik B", avatar: "KB", points: 245, movement: "up" },
  { rank: 5, userId: "u5", name: "Sneha R", avatar: "SR", points: 210, movement: "same" },
]
