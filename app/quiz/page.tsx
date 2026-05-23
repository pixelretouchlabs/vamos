"use client"

import { useCallback, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/Button"
import { BrainIcon, FlameIcon, ShareIcon, ChevRightIcon } from "@/components/ui/Icons"
import { getQuestionsForDate } from "@/data/quiz-questions"
import { useQuizStore } from "@/lib/quiz"
import { POINTS } from "@/lib/points"
import type { QuizQuestion } from "@/types"

type QuizPhase = "start" | "playing" | "result"

function RingTimer({ seconds, total = 30 }: { seconds: number; total?: number }) {
  const r = 22
  const C = 2 * Math.PI * r
  const frac = Math.max(0, seconds / total)
  const offset = C * (1 - frac)
  const danger = seconds <= 10
  const color = danger ? "#E63946" : "#E8C547"

  return (
    <div className="relative" style={{ width: 56, height: 56 }}>
      <svg width="56" height="56" viewBox="0 0 56 56" style={{ transform: "rotate(-90deg)" }}>
        <circle cx="28" cy="28" r={r} stroke="#252525" strokeWidth="4" fill="none" />
        <circle
          cx="28" cy="28" r={r}
          stroke={color} strokeWidth="4" fill="none"
          strokeDasharray={C} strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 1s linear, stroke 250ms" }}
        />
      </svg>
      <div
        className="absolute inset-0 flex items-center justify-center font-mono text-[18px] font-bold"
        style={{ color: danger ? "#E63946" : undefined }}
      >
        {seconds}
      </div>
    </div>
  )
}

function ProgressBar({ current, total, answers, questions }: { current: number; total: number; answers: number[]; questions: QuizQuestion[] }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: total }).map((_, i) => {
        let bg = "#252525"
        if (i < answers.length) {
          bg = answers[i] === questions[i]?.correctAnswer ? "#E8C547" : "#E63946"
        } else if (i === current) {
          bg = `linear-gradient(90deg, #E8C547 60%, #252525 60%)`
        }
        return (
          <div
            key={i}
            className="h-[3px] flex-1 rounded-sm transition-colors"
            style={{ background: bg }}
          />
        )
      })}
    </div>
  )
}

export default function QuizPage() {
  const today = new Date().toISOString().slice(0, 10)
  const questions = getQuestionsForDate(today)
  const { currentStreak, submitAttempt, getAttempt } = useQuizStore()
  const existing = getAttempt(today)
  const router = useRouter()

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
        const score = finalAnswers.filter((a, i) => a === questions[i]?.correctAnswer).length
        submitAttempt(today, finalAnswers, score * POINTS.QUIZ_CORRECT_ANSWER)
        setPhase("result")
      }
    }, 1400)
  }, [currentQ, questions, answers, submitAttempt, today])

  useEffect(() => {
    if (phase !== "playing" || showAnswer) return
    if (timer <= 0) { handleTimeout(); return }
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
        const score = newAnswers.filter((a, i) => a === questions[i]?.correctAnswer).length
        submitAttempt(today, newAnswers, score * POINTS.QUIZ_CORRECT_ANSWER)
        setPhase("result")
      }
    }, 1400)
  }

  const letters = ["A", "B", "C", "D"]

  // ─── Start Screen ───
  if (phase === "start") {
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
            Daily Quiz
          </div>
          <div className="w-9" />
        </div>

        <div className="flex flex-col items-center justify-center px-8 pt-10 text-center" style={{ minHeight: "calc(100dvh - 60px)" }}>
          {/* Brain illustration */}
          <div className="relative mb-6 flex h-[140px] w-[140px] items-center justify-center">
            <div
              className="absolute inset-0 rounded-full"
              style={{ background: "radial-gradient(circle at 30% 30%, rgba(232,197,71,0.28), rgba(232,197,71,0.04) 70%)" }}
            />
            <div
              className="absolute rounded-full"
              style={{ inset: 12, border: "1px dashed rgba(232,197,71,0.32)" }}
            />
            <BrainIcon size={80} className="text-gold" />
          </div>

          <h1 className="font-heading text-[36px] font-extrabold tracking-tight" style={{ letterSpacing: -1 }}>
            Daily Quiz
          </h1>
          <p className="mt-2.5 max-w-[280px] text-[14px] leading-relaxed text-text-dim">
            5 questions · 30 seconds each<br />
            Earn up to <span className="font-bold text-gold">+50 pts</span> daily
          </p>

          {/* Streak badge */}
          <div
            className="mt-5 inline-flex items-center gap-2 rounded-full border px-3.5 py-2"
            style={{ background: "rgba(232,197,71,0.12)", borderColor: "rgba(232,197,71,0.32)" }}
          >
            <FlameIcon size={14} className="text-gold" />
            <span className="font-heading text-[13px] font-bold tracking-wide text-gold">
              {currentStreak}-day streak
            </span>
          </div>

          <div className="mt-8 w-full max-w-[320px]">
            <Button onClick={() => setPhase("playing")}>Start Quiz</Button>
          </div>

          <p className="mt-6 text-[11px] tracking-wide text-text-muted">Resets in 4h 22m</p>
        </div>
      </div>
    )
  }

  // ─── Result Screen ───
  if (phase === "result") {
    const attempt = existing || getAttempt(today)
    const score = attempt?.score ?? 0
    const correct = score / POINTS.QUIZ_CORRECT_ANSWER
    const emoji = correct >= 4 ? "🏆" : correct >= 2 ? "👏" : "😅"

    return (
      <div className="animate-fade-in flex min-h-[75vh] flex-col items-center justify-center gap-5 px-[18px]">
        <span className="text-6xl">{emoji}</span>
        <div className="text-center">
          <p className="font-heading text-[48px] font-black tracking-tight">
            {correct}<span className="text-[28px] text-text-dim">/{questions.length}</span>
          </p>
          <p className="mt-1 text-[15px] font-semibold text-gold">+{score} points</p>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5" style={{ background: "rgba(232,197,71,0.12)" }}>
          <FlameIcon size={14} className="text-gold" />
          <span className="font-heading text-[12px] font-bold text-gold">{attempt?.streak ?? currentStreak} day streak</span>
        </div>
        {(attempt?.streak ?? 0) % 7 === 0 && (attempt?.streak ?? 0) > 0 && (
          <div className="rounded-full bg-green/20 px-3.5 py-1.5 font-heading text-[12px] font-bold text-green">
            +{POINTS.STREAK_7_DAY_BONUS} streak bonus!
          </div>
        )}
        <div className="w-full max-w-[280px]">
          <Button
            variant="ghost"
            onClick={() => {
              if (navigator.share) navigator.share({ title: "Vamos Quiz", text: `I scored ${correct}/5 on today's Vamos World Cup Quiz!` })
            }}
          >
            <ShareIcon size={16} /> Share Result
          </Button>
        </div>
      </div>
    )
  }

  // ─── Playing Screen ───
  if (!question) return null

  return (
    <div className="animate-fade-in min-h-dvh bg-bg">
      {/* Top bar */}
      <div className="flex items-center gap-3 px-[18px] py-2 pb-3">
        <button
          onClick={() => setPhase("start")}
          className="press flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-surface"
        >
          <ChevRightIcon size={18} className="rotate-180" />
        </button>
        <div className="rounded-full border border-border bg-surface px-3 py-1.5 font-heading text-[12px] font-bold tracking-wide">
          <span className="text-gold">{currentQ + 1}</span>
          <span className="text-text-muted">/</span>
          <span className="text-text-dim">{questions.length}</span>
        </div>
        <div className="flex-1" />
        <RingTimer seconds={timer} />
      </div>

      {/* Progress bar */}
      <div className="px-[18px] pb-[18px]">
        <ProgressBar current={currentQ} total={questions.length} answers={answers} questions={questions} />
      </div>

      {/* Question card */}
      <div className="px-[18px]">
        <div className="gold-pulse flex min-h-[110px] items-center rounded-2xl border border-transparent bg-surface p-5">
          <p className="font-heading text-[20px] font-bold leading-[1.25] tracking-[-0.3px]">
            {question.question}
          </p>
        </div>
      </div>

      {/* Options */}
      <div className="flex flex-col gap-2.5 px-[18px] pt-5">
        {question.options.map((option, i) => {
          const isPicked = selected === i
          const isCorrect = showAnswer && i === question.correctAnswer
          const isWrong = showAnswer && isPicked && i !== question.correctAnswer

          let bg = "#1A1A1A"
          let borderColor = "rgba(255,255,255,0.06)"
          let letterBg = "#252525"
          let letterColor = "#888"

          if (isCorrect) {
            bg = "rgba(34,197,94,0.14)"; borderColor = "#22C55E"
            letterBg = "#22C55E"; letterColor = "#fff"
          } else if (isWrong) {
            bg = "rgba(230,57,70,0.14)"; borderColor = "#E63946"
            letterBg = "#E63946"; letterColor = "#fff"
          }

          return (
            <button
              key={i}
              onClick={() => handleSelect(i)}
              disabled={showAnswer}
              className={showAnswer ? "" : "press"}
              style={{
                display: "flex", alignItems: "center", gap: 14,
                padding: "14px 16px",
                background: bg,
                border: `1.5px solid ${borderColor}`,
                borderRadius: 12,
                textAlign: "left",
                transition: "all 200ms",
                boxShadow: isCorrect ? "0 0 0 3px rgba(34,197,94,0.18)" : isWrong ? "0 0 0 3px rgba(230,57,70,0.18)" : "none",
                width: "100%",
              }}
            >
              <span
                className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-lg font-heading text-[13px] font-bold"
                style={{ background: letterBg, color: letterColor }}
              >
                {letters[i]}
              </span>
              <span
                className="flex-1 text-[14px] font-medium"
                style={{ color: isCorrect ? "#22C55E" : isWrong ? "#E63946" : undefined }}
              >
                {option}
              </span>
              {isCorrect && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-green text-[11px] font-extrabold text-white">✓</span>
              )}
              {isWrong && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red text-[12px] font-extrabold text-white">×</span>
              )}
            </button>
          )
        })}
      </div>

      {showAnswer && (
        <p className="px-[18px] pt-6 text-center text-[12px]">
          {selected === question.correctAnswer
            ? <span className="text-green">+10 points · Next question…</span>
            : <span className="text-red">No worries · Next question…</span>
          }
        </p>
      )}
    </div>
  )
}
