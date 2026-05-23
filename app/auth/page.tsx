"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/Button"
import { BoltIcon, ChevRightIcon } from "@/components/ui/Icons"
import { useAuth } from "@/hooks/useAuth"

function AuthHero() {
  return (
    <div className="relative overflow-hidden px-7 pb-7 pt-6">
      {/* Radial glows */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(80% 60% at 50% 0%, rgba(232,197,71,0.18), transparent 60%),
                       radial-gradient(60% 50% at 100% 100%, rgba(230,57,70,0.10), transparent 60%)`,
        }}
      />
      {/* Stadium stripes */}
      <svg
        className="pointer-events-none absolute left-0 top-0 w-full opacity-40"
        height="100"
        viewBox="0 0 320 100"
        preserveAspectRatio="none"
      >
        <defs>
          <pattern id="lines" x="0" y="0" width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(35)">
            <line x1="0" y1="0" x2="0" y2="14" stroke="#E8C547" strokeOpacity="0.18" strokeWidth="0.8" />
          </pattern>
        </defs>
        <rect width="320" height="100" fill="url(#lines)" />
      </svg>

      <div className="relative">
        <h1
          className="font-heading text-[56px] font-extrabold leading-[0.95] tracking-[-2px] text-gold"
          style={{ textShadow: "0 0 30px rgba(232,197,71,0.32)" }}
        >
          VAMOS
        </h1>
        <p className="mt-1.5 font-heading text-xs font-semibold uppercase tracking-[4px] text-text-dim">
          World Cup 2026 · For India
        </p>
      </div>

      <h2 className="mt-7 font-heading text-[28px] font-bold leading-[1.1] tracking-tight">
        Predict. Pool. <span className="text-gold">Win.</span>
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-text-dim">
        Play sweepstakes with your crew. Pick a country, predict scores, top the leaderboard.
      </p>
    </div>
  )
}

function PhoneStep({ phone, setPhone, onNext }: { phone: string; setPhone: (v: string) => void; onNext: () => void }) {
  const [focus, setFocus] = useState(false)
  const valid = phone.replace(/\D/g, "").length === 10
  const formatted = phone.replace(/\D/g, "").replace(/(\d{5})(\d{0,5})/, (_, a, b) => (b ? `${a} ${b}` : a))

  return (
    <div className="animate-fade-in px-[22px]">
      <p className="mb-2.5 font-heading text-[11px] font-bold uppercase tracking-[1.2px] text-text-dim">
        Continue with phone
      </p>

      <div className="flex gap-2">
        <button
          className="press flex min-w-[86px] items-center gap-1.5 rounded-xl border bg-surface px-3 transition-colors"
          style={{ borderColor: focus ? "#E8C547" : "rgba(255,255,255,0.06)" }}
        >
          <span className="text-lg">🇮🇳</span>
          <span className="font-mono text-[15px] font-semibold">+91</span>
          <ChevRightIcon size={12} />
        </button>
        <input
          value={formatted}
          onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          placeholder="98765 43210"
          inputMode="numeric"
          className="h-[54px] flex-1 rounded-xl border bg-surface px-4 font-mono text-base font-semibold tracking-wide text-text outline-none transition-all"
          style={{
            borderColor: focus ? "#E8C547" : "rgba(255,255,255,0.06)",
            boxShadow: focus ? "0 0 0 4px rgba(232,197,71,0.12)" : "none",
          }}
        />
      </div>

      <div className="mt-4">
        <Button disabled={!valid} onClick={() => valid && onNext()}>
          {valid ? "Send OTP" : "Enter Phone Number"}
        </Button>
      </div>

      {/* Divider */}
      <div className="my-5 flex items-center gap-3">
        <div className="h-px flex-1 bg-border" />
        <span className="font-heading text-[11px] font-semibold uppercase tracking-[1.2px] text-text-dim">or</span>
        <div className="h-px flex-1 bg-border" />
      </div>

      {/* Social */}
      <div className="space-y-2.5">
        <Button variant="ghost">
          <GoogleIcon /> Continue with Google
        </Button>
        <button className="press flex h-[50px] w-full items-center justify-center gap-2.5 rounded-xl border border-border-strong bg-black text-sm font-semibold text-white">
          <AppleIcon /> Continue with Apple
        </button>
      </div>
    </div>
  )
}

function OtpStep({ phone, onBack, onDone }: { phone: string; onBack: () => void; onDone: () => void }) {
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""))
  const [seconds, setSeconds] = useState(28)
  const inputsRef = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    if (seconds <= 0) return
    const id = setTimeout(() => setSeconds((s) => s - 1), 1000)
    return () => clearTimeout(id)
  }, [seconds])

  const filled = otp.filter((d) => d !== "").length
  const valid = filled === 6
  const pretty = phone.replace(/(\d{5})(\d{5})/, "$1 $2")

  function setDigit(i: number, v: string) {
    const d = v.replace(/\D/g, "").slice(0, 1)
    const arr = [...otp]
    arr[i] = d
    setOtp(arr)
    if (d && i < 5) inputsRef.current[i + 1]?.focus()
  }

  return (
    <div className="animate-fade-in px-[22px]">
      <button onClick={onBack} className="press mb-3.5 flex items-center gap-1 text-xs font-semibold text-text-dim">
        <ChevRightIcon size={14} className="rotate-180" /> {pretty}
      </button>

      <h2 className="font-heading text-[22px] font-bold leading-tight tracking-tight">
        Enter the 6-digit code
      </h2>
      <p className="mt-1.5 text-[13px] leading-relaxed text-text-dim">
        We sent it to <span className="font-mono text-text">+91 {pretty}</span>
      </p>

      <div className="mt-5 flex justify-between gap-2">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <input
            key={i}
            ref={(el) => { inputsRef.current[i] = el }}
            value={otp[i]}
            onChange={(e) => setDigit(i, e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Backspace" && !otp[i] && i > 0) inputsRef.current[i - 1]?.focus()
            }}
            inputMode="numeric"
            maxLength={1}
            className="h-[54px] w-11 rounded-xl border bg-surface text-center font-mono text-[22px] font-bold text-text outline-none transition-all"
            style={{
              borderColor: otp[i] ? "#E8C547" : "rgba(255,255,255,0.06)",
              boxShadow: otp[i] ? "0 0 0 3px rgba(232,197,71,0.12)" : "none",
            }}
          />
        ))}
      </div>

      <p className="mt-3.5 text-center text-xs text-text-dim">
        {seconds > 0 ? (
          <>Resend code in <span className="font-mono font-semibold text-text">0:{String(seconds).padStart(2, "0")}</span></>
        ) : (
          <button onClick={() => setSeconds(28)} className="font-semibold text-gold">Resend code</button>
        )}
      </p>

      <div className="mt-5">
        <Button disabled={!valid} onClick={() => valid && onDone()}>
          Verify & Continue
        </Button>
      </div>

      <div className="mt-4 flex gap-2.5 rounded-xl border border-border bg-surface p-3.5 text-[11px] leading-relaxed text-text-dim">
        <span className="mt-0.5 text-gold"><BoltIcon size={14} /></span>
        <span>For demo, any 6 digits work. The real app uses WhatsApp OTP (faster than SMS in India).</span>
      </div>
    </div>
  )
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22 12.2c0-.7-.06-1.4-.18-2.05H12v3.9h5.62a4.8 4.8 0 0 1-2.08 3.15v2.62h3.36c1.97-1.81 3.1-4.49 3.1-7.62z" />
      <path fill="#34A853" d="M12 22c2.81 0 5.17-.93 6.9-2.53l-3.36-2.62a6.16 6.16 0 0 1-9.18-3.25H2.9v2.7A10 10 0 0 0 12 22z" />
      <path fill="#FBBC05" d="M6.36 13.6a6 6 0 0 1 0-3.2V7.7H2.9a10 10 0 0 0 0 8.6l3.46-2.7z" />
      <path fill="#EA4335" d="M12 5.92a5.42 5.42 0 0 1 3.84 1.5l2.88-2.88A10 10 0 0 0 2.9 7.7l3.46 2.7A6 6 0 0 1 12 5.92z" />
    </svg>
  )
}

function AppleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.05 12.04c-.03-2.7 2.21-4 2.31-4.06-1.26-1.84-3.22-2.1-3.91-2.12-1.65-.17-3.24.98-4.09.98-.86 0-2.15-.96-3.55-.93-1.82.03-3.51 1.06-4.45 2.69-1.9 3.29-.48 8.13 1.36 10.79.9 1.3 1.97 2.76 3.37 2.71 1.36-.06 1.87-.87 3.51-.87 1.64 0 2.1.87 3.54.84 1.46-.03 2.39-1.33 3.28-2.63 1.04-1.51 1.47-2.97 1.49-3.05-.03-.01-2.85-1.1-2.88-4.35zm-2.67-8c.74-.9 1.24-2.14 1.1-3.39-1.07.05-2.36.71-3.13 1.6-.68.79-1.28 2.06-1.12 3.27 1.2.09 2.41-.61 3.15-1.48z" />
    </svg>
  )
}

export default function AuthPage() {
  const [step, setStep] = useState<"phone" | "otp">("phone")
  const [phone, setPhone] = useState("")
  const { login } = useAuth()
  const router = useRouter()

  function handleDone() {
    login()
    router.push("/")
  }

  return (
    <div className="animate-fade-in min-h-dvh bg-bg">
      <AuthHero />
      {step === "phone" && <PhoneStep phone={phone} setPhone={setPhone} onNext={() => setStep("otp")} />}
      {step === "otp" && <OtpStep phone={phone} onBack={() => setStep("phone")} onDone={handleDone} />}

      <p className="mt-6 px-6 text-center text-[10px] leading-relaxed text-text-muted">
        By continuing you agree to our <span className="text-text-dim underline">Terms</span> and{" "}
        <span className="text-text-dim underline">Privacy Policy</span>.
        <br />
        Real-money gameplay restricted to states where permitted.
      </p>
    </div>
  )
}
