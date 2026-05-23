export interface Team {
  code: string
  name: string
  flag: string
  group: string
}

export interface Match {
  id: string
  date: string
  timeIST: string
  home: { code: string; name: string; flag: string }
  away: { code: string; name: string; flag: string }
  group: string
  venue: string
  stage: "group" | "r32" | "r16" | "qf" | "sf" | "final"
  status: "upcoming" | "live" | "completed"
  homeScore?: number
  awayScore?: number
}

export interface User {
  id: string
  name: string
  phone: string
  email: string
  avatar: string
  totalPoints: number
  createdAt: string
  notificationsEnabled: boolean
}

export interface Pool {
  id: string
  name: string
  type: "tournament" | "match"
  matchId?: string
  creatorId: string
  entryFee: number
  prizePool: number
  maxMembers: number
  status: "open" | "locked" | "completed"
  createdAt: string
  members: PoolMember[]
}

export interface PoolMember {
  userId: string
  name: string
  teamCode: string
  teamName: string
  hasPaid: boolean
  joinedAt: string
}

export interface Prediction {
  matchId: string
  userId: string
  homeScore: number
  awayScore: number
  goalscorer?: string
  submittedAt: string
  pointsEarned: number
}

export interface QuizQuestion {
  id: string
  question: string
  options: string[]
  correctAnswer: number
  category: "history" | "trivia" | "match-facts"
}

export interface QuizAttempt {
  date: string
  answers: number[]
  score: number
  streak: number
  completedAt: string
}

export interface LeaderboardEntry {
  rank: number
  userId: string
  name: string
  avatar: string
  points: number
  movement: "up" | "down" | "same"
}
