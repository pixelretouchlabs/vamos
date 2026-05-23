"use client"

import { useCallback, useEffect, useState } from "react"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/Badge"
import { getQuestionsForDate } from "@/data/quiz-questions"
import { useQuizStore } from "@/lib/quiz"
import { POINTS } from "@/lib/points"
import type { QuizQuestion } from "@/types"

type QuizPhase = "start" | "playing" | "result"

function TimerRing({ seconds, total }: { seconds: number; total: number }) {
  const pct = (seconds / total) * 100
  const circumference = 2 * Math.PI * 40
  const offset = circumference - (pct / 100) * circumference

  return (
    <div className="relative flex h-24 w-24 items-center justify-center">
      <svg className="absolute -rotate-90" width="96" height="96">
        <circle
          cx="48"
          cy="48"
          r="40"
          fill="none"
          stroke="#252525"
          strokeWidth="4"
        />
        <circle
          cx="48"
          cy="48"
          r="40"
          fill="none"
          stroke={seconds <= 10 ? "#E63946" : "#E8C547"}
          strokeWidth="4"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-linear"
        />
      </svg>
      <span className="font-mono text-2xl font-bold">{seconds}</span>
    </div>
  )
}

export default function QuizPage() {
  const today = new Date().toISOString().slice(0, 10)
  const questions = getQuestionsForDate(today)
  const { currentStreak, submitAttempt, getAttempt } = useQuizStore()
  const existing = getAttempt(today)

  const [phase, setPhase] = useState<QuizPhase>(existing ? "result" : "start")
  const [currentQ, setCurrentQ] = useState(0)
  const [answers, setAnswers] = useState<number[]>([])
  const [selected, setSelected] = useState<number | null>(null)
  const [showAnswer, setShowAnswer] = useState(false)
  const [timer, setTimer] = useState(30)

  const question: QuizQuestion | undefined = questions[currentQ]

  const handleTimeout = useCallback(() => {
    setAnswers((prev) => [...prev, -1])
    setShowAnswer(true)
    setTimeout(() => {
      if (currentQ < questions.length - 1) {
        setCurrentQ((c) => c + 1)
        setSelected(null)
        setShowAnswer(false)
        setTimer(30)
      } else {
        const finalAnswers = [...answers, -1]
        const score = finalAnswers.filter(
          (a, i) => a === questions[i]?.correctAnswer
        ).length
        submitAttempt(today, finalAnswers, score * POINTS.QUIZ_CORRECT_ANSWER)
        setPhase("result")
      }
    }, 1500)
  }, [currentQ, questions, answers, submitAttempt, today])

  useEffect(() => {
    if (phase !== "playing" || showAnswer) return
    if (timer <= 0) {
      handleTimeout()
      return
    }
    const interval = setInterval(() => setTimer((t) => t - 1), 1000)
    return () => clearInterval(interval)
  }, [timer, phase, showAnswer, handleTimeout])

  function handleSelect(optionIndex: number) {
    if (showAnswer || selected !== null) return
    setSelected(optionIndex)
    setShowAnswer(true)
    const newAnswers = [...answers, optionIndex]
    setAnswers(newAnswers)

    setTimeout(() => {
      if (currentQ < questions.length - 1) {
        setCurrentQ((c) => c + 1)
        setSelected(null)
        setShowAnswer(false)
        setTimer(30)
      } else {
        const score = newAnswers.filter(
          (a, i) => a === questions[i]?.correctAnswer
        ).length
        submitAttempt(today, newAnswers, score * POINTS.QUIZ_CORRECT_ANSWER)
        setPhase("result")
      }
    }, 1500)
  }

  if (phase === "start") {
    return (
      <div className="animate-fade-in flex min-h-[70vh] flex-col items-center justify-center gap-6 px-4">
        <span className="text-6xl">🧠</span>
        <h1 className="font-heading text-3xl font-black">Daily Quiz</h1>
        <p className="text-text-dim">5 questions · 30 seconds each</p>
        <Badge variant="gold">🔥 {currentStreak} day streak</Badge>
        <Button onClick={() => setPhase("playing")}>Start Quiz</Button>
      </div>
    )
  }

  if (phase === "result") {
    const attempt = existing || getAttempt(today)
    const score = attempt?.score ?? 0
    const correct = score / POINTS.QUIZ_CORRECT_ANSWER

    return (
      <div className="animate-fade-in flex min-h-[70vh] flex-col items-center justify-center gap-6 px-4">
        <span className="text-6xl">{correct >= 4 ? "🏆" : correct >= 2 ? "👏" : "😅"}</span>
        <h1 className="font-heading text-3xl font-black">
          {correct}/{questions.length}
        </h1>
        <p className="text-lg text-gold">+{score} points</p>
        <Badge variant="gold">🔥 {attempt?.streak ?? currentStreak} day streak</Badge>
        {(attempt?.streak ?? 0) % 7 === 0 && (attempt?.streak ?? 0) > 0 && (
          <Badge variant="green">+{POINTS.STREAK_7_DAY_BONUS} streak bonus!</Badge>
        )}
        <Button
          variant="secondary"
          onClick={() => {
            if (navigator.share) {
              navigator.share({
                title: "Vamos Quiz",
                text: `I scored ${correct}/5 on today's Vamos World Cup Quiz! 🧠⚽`,
              })
            }
          }}
        >
          Share Result
        </Button>
      </div>
    )
  }

  if (!question) return null

  return (
    <div className="animate-fade-in flex min-h-[70vh] flex-col items-center justify-between px-4 pt-6 pb-4">
      <div className="w-full space-y-6">
        <div className="flex items-center justify-between">
          <Badge variant="dim">
            {currentQ + 1}/{questions.length}
          </Badge>
          <TimerRing seconds={timer} total={30} />
        </div>

        <Card glow>
          <p className="text-lg font-semibold leading-relaxed">
            {question.question}
          </p>
        </Card>

        <div className="space-y-3">
          {question.options.map((option, i) => {
            let bg = "bg-surface hover:bg-surface-light"
            if (showAnswer) {
              if (i === question.correctAnswer) bg = "bg-green/20 ring-2 ring-green"
              else if (i === selected && i !== question.correctAnswer)
                bg = "bg-red/20 ring-2 ring-red"
            } else if (selected === i) {
              bg = "bg-gold/20 ring-2 ring-gold"
            }
            return (
              <button
                key={i}
                onClick={() => handleSelect(i)}
                disabled={showAnswer}
                className={`w-full rounded-xl px-5 py-4 text-left text-sm font-medium transition-all ${bg}`}
              >
                <span className="mr-3 font-bold text-text-dim">
                  {String.fromCharCode(65 + i)}
                </span>
                {option}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
