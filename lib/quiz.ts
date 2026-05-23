import { create } from "zustand"
import type { QuizAttempt } from "@/types"
import { POINTS } from "@/lib/points"

interface QuizState {
  attempts: Record<string, QuizAttempt>
  currentStreak: number
  submitAttempt: (date: string, answers: number[], score: number) => void
  getAttempt: (date: string) => QuizAttempt | undefined
}

export const useQuizStore = create<QuizState>((set, get) => ({
  attempts: {},
  currentStreak: 3,
  submitAttempt: (date, answers, score) => {
    const prev = get().currentStreak
    const attempt: QuizAttempt = {
      date,
      answers,
      score,
      streak: prev + 1,
      completedAt: new Date().toISOString(),
    }
    set((state) => ({
      attempts: { ...state.attempts, [date]: attempt },
      currentStreak: prev + 1,
    }))
  },
  getAttempt: (date) => get().attempts[date],
}))
