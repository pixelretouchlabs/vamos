"use client"

import { useCallback, useEffect, useState } from "react"
import { Button } from "@/components/ui/Button"
import { BrainIcon, FlameIcon, ShareIcon, BoltIcon } from "@/components/ui/Icons"
import { getQuestionsForDate } from "@/data/quiz-questions"
import { useQuizStore } from "@/lib/quiz"
import { POINTS } from "@/lib/points"
import type { QuizQuestion } from "@/types"

type QuizPhase = "start" | "playing" | "result"

function TimerRing({ seconds, total }: { seconds: number; total: number }) {
  const pct = (seconds / total) * 100
  const circumference = 2 * Math.PI * 40
  const offset = circumference - (pct / 100) * circumference
  const color = seconds <= 10 ? "#E63946" : "#E8C547"

  return (
    <div className="relative flex h-[88px] w-[88px] items-center justify-center">
      <svg className="absolute -rotate-90" width="88" height="88">
        <circle cx="44" cy="44" r="40" fill="none" stroke="#252525" strokeWidth="3" />
        <circle
          cx="44" cy="44" r="40" fill="none"
          stroke={color} strokeWidth="3"
          strokeDasharray={circumference} strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-linear"
        />
      </svg>
      <span className="font-mono text-[26px] font-bold" style={{ color }}>{seconds}</span>
    </div>
  )
}

function ProgressDots({ current, total, answers, questions }: { current: number; total: number; answers: number[]; questions: QuizQuestion[] }) {
  return (
    <div className="flex justify-center gap-2">
      {Array.from({ length: total }).map((_, i) => {
        let bg = "#252525"
        if (i < answers.length) {
          bg = answers[i] === questions[i]?.correctAnswer ? "#34D399" : "#E63946"
        } else if (i === current) {
          bg = "#E8C547"
        }
        return <div key={i} className="h-[5px] flex-1 rounded-full transition-colors" style={{ background: bg }} />
      })}
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
        const score = finalAnswers.filter((a, i) => a === questions[i]?.correctAnswer).length
        submitAttempt(today, finalAnswers, score * POINTS.QUIZ_CORRECT_ANSWER)
        setPhase("result")
      }
    }, 1500)
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
    }, 1500)
  }

  const letters = ["A", "B", "C", "D"]

  // ─── Start Screen ───
  if (phase === "start") {
    return (
      <div className="animate-fade-in flex min-h-[75vh] flex-col items-center justify-center gap-5 px-[18px]">
        {/* Brain illustration */}
        <div className="relative flex h-28 w-28 items-center justify-center">
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: "radial-gradient(closest-side, rgba(232,197,71,0.15), transparent 70%)",
              border: "2px dashed rgba(232,197,71,0.25)",
              borderRadius: "50%",
            }}
          />
          <BrainIcon size={48} className="text-gold" />
        </div>

        <h1
          className="font-heading text-[32px] font-extrabold tracking-tight"
          style={{ textShadow: "0 0 30px rgba(232,197,71,0.2)" }}
        >
          Daily Quiz
        </h1>
        <p className="text-[13px] text-text-dim">5 questions · 30 seconds each</p>

        {/* Streak badge */}
        <div className="flex items-center gap-1.5 rounded-full bg-gold-dim px-3.5 py-1.5">
          <FlameIcon size={14} className="text-gold" />
          <span className="font-heading text-[12px] font-bold text-gold">{currentStreak} day streak</span>
        </div>

        <div className="w-full max-w-[280px]">
          <Button onClick={() => setPhase("playing")}>Start Quiz</Button>
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
          <p className="mt-1 flex items-center justify-center gap-1.5 text-[15px] font-semibold text-gold">
            <BoltIcon size={16} /> +{score} points
          </p>
        </div>

        <div className="flex items-center gap-1.5 rounded-full bg-gold-dim px-3.5 py-1.5">
          <FlameIcon size={14} className="text-gold" />
          <span className="font-heading text-[12px] font-bold text-gold">
            {attempt?.streak ?? currentStreak} day streak
          </span>
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
              if (navigator.share) {
                navigator.share({
                  title: "Vamos Quiz",
                  text: `I scored ${correct}/5 on today's Vamos World Cup Quiz!`,
                })
              }
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
    <div className="animate-fade-in flex min-h-dvh flex-col px-[18px] pt-5 pb-6">
      {/* Progress + Timer */}
      <ProgressDots current={currentQ} total={questions.length} answers={answers} questions={questions} />

      <div className="mt-5 flex justify-center">
        <TimerRing seconds={timer} total={30} />
      </div>

      {/* Question card */}
      <div className="gold-pulse mt-5 rounded-2xl border border-transparent p-5">
        <p className="text-center text-[16px] font-semibold leading-relaxed">
          {question.question}
        </p>
      </div>

      {/* Options */}
      <div className="mt-5 flex-1 space-y-2.5">
        {question.options.map((option, i) => {
          const isCorrect = i === question.correctAnswer
          const isSelected = selected === i
          let borderColor = "rgba(255,255,255,0.06)"
          let bg = "#1A1A1A"
          let letterBg = "#252525"
          let letterColor = "#888"

          if (showAnswer) {
            if (isCorrect) {
              borderColor = "#34D399"
              bg = "rgba(52,211,153,0.1)"
              letterBg = "#34D399"
              letterColor = "#0D0D0D"
            } else if (isSelected && !isCorrect) {
              borderColor = "#E63946"
              bg = "rgba(230,57,70,0.1)"
              letterBg = "#E63946"
              letterColor = "#fff"
            }
          } else if (isSelected) {
            borderColor = "#E8C547"
            bg = "rgba(232,197,71,0.08)"
            letterBg = "#E8C547"
            letterColor = "#0D0D0D"
          }

          return (
            <button
              key={i}
              onClick={() => handleSelect(i)}
              disabled={showAnswer}
              className="press flex w-full items-center gap-3 rounded-xl px-4 py-3.5 text-left transition-all"
              style={{ background: bg, border: `1px solid ${borderColor}` }}
            >
              <span
                className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-lg font-heading text-[12px] font-bold"
                style={{ background: letterBg, color: letterColor }}
              >
                {showAnswer && isCorrect ? "✓" : showAnswer && isSelected && !isCorrect ? "✗" : letters[i]}
              </span>
              <span className="text-[13px] font-medium">{option}</span>
              {showAnswer && isCorrect && (
                <span className="ml-auto text-[11px] font-semibold text-green">+10 pts</span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
