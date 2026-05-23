import { create } from "zustand"
import type { Prediction } from "@/types"

interface PredictionsState {
  predictions: Record<string, Prediction>
  submitPrediction: (matchId: string, homeScore: number, awayScore: number, goalscorer?: string) => void
  getPrediction: (matchId: string) => Prediction | undefined
}

export const usePredictionsStore = create<PredictionsState>((set, get) => ({
  predictions: {},
  submitPrediction: (matchId, homeScore, awayScore, goalscorer) => {
    const prediction: Prediction = {
      matchId,
      userId: "user_001",
      homeScore,
      awayScore,
      goalscorer,
      submittedAt: new Date().toISOString(),
      pointsEarned: 0,
    }
    set((state) => ({
      predictions: { ...state.predictions, [matchId]: prediction },
    }))
  },
  getPrediction: (matchId) => get().predictions[matchId],
}))
