export const POINTS = {
  PREDICTION_CORRECT_WINNER: 5,
  PREDICTION_CORRECT_SCORELINE: 15,
  PREDICTION_CORRECT_GOALSCORER: 5,
  BRACKET_R32: 2,
  BRACKET_R16: 4,
  BRACKET_QF: 8,
  BRACKET_SF: 16,
  BRACKET_FINAL: 32,
  QUIZ_CORRECT_ANSWER: 10,
  QUIZ_MAX_DAILY: 50,
  BINGO_ONE_LINE: 20,
  BINGO_FULL_HOUSE: 50,
  STREAK_7_DAY_BONUS: 25,
} as const

export function calculatePredictionPoints(
  predicted: { home: number; away: number; goalscorer?: string },
  actual: { home: number; away: number; firstGoalscorer?: string }
): number {
  let points = 0

  const predictedWinner =
    predicted.home > predicted.away
      ? "home"
      : predicted.home < predicted.away
        ? "away"
        : "draw"
  const actualWinner =
    actual.home > actual.away
      ? "home"
      : actual.home < actual.away
        ? "away"
        : "draw"

  if (predictedWinner === actualWinner) {
    points += POINTS.PREDICTION_CORRECT_WINNER
  }

  if (predicted.home === actual.home && predicted.away === actual.away) {
    points += POINTS.PREDICTION_CORRECT_SCORELINE
  }

  if (
    predicted.goalscorer &&
    actual.firstGoalscorer &&
    predicted.goalscorer.toLowerCase() ===
      actual.firstGoalscorer.toLowerCase()
  ) {
    points += POINTS.PREDICTION_CORRECT_GOALSCORER
  }

  return points
}

export function calculateQuizPoints(correctAnswers: number): number {
  return Math.min(
    correctAnswers * POINTS.QUIZ_CORRECT_ANSWER,
    POINTS.QUIZ_MAX_DAILY
  )
}
