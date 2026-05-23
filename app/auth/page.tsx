"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ChevRightIcon } from "@/components/ui/Icons"
import { useAuth } from "@/hooks/useAuth"

function AuthMark() {
  return (
    <div className="flex items-center gap-2">
      <div
        className="h-2 w-2 rounded-full bg-gold"
        style={{ boxShadow: "0 0 12px rgba(232,197,71,0.6)" }}
      />
      <span className="font-heading text-[18px] font-extrabold tracking-[1.2px]">
        VAMOS
      </span>
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

function SocialRow({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <button className="press flex h-[52px] w-full items-center gap-3.5 border-b border-border px-1 text-left text-[15px] font-medium">
      <span className="flex w-5 justify-center">{icon}</span>
      <span className="flex-1">{label}</span>
      <ChevRightIcon size={14} className="text-text-dim" />
    </button>
  )
}

function PhoneStep({ phone, setPhone, onNext }: { phone: string; setPhone: (v: string) => void; onNext: () => void }) {
  const [focus, setFocus] = useState(false)
  const valid = phone.replace(/\D/g, "").length === 10
  const formatted = phone.replace(/\D/g, "").replace(/(\d{5})(\d{0,5})/, (_, a, b) => (b ? `${a} ${b}` : a))

  return (
    <div className="animate-fade-in flex flex-col gap-4">
      {/* Phone field — borderless, underlined */}
      <div
        className="flex items-center pb-3 transition-colors"
        style={{ borderBottom: `1px solid ${focus ? "#E8C547" : "rgba(255,255,255,0.10)"}` }}
      >
        <span className="mr-2.5 font-mono text-[18px] font-semibold text-text-dim">+91</span>
        <input
          value={formatted}
          onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          onKeyDown={(e) => { if (e.key === "Enter" && valid) onNext() }}
          placeholder="98765 43210"
          inputMode="numeric"
          autoFocus
          className="min-w-0 flex-1 bg-transparent p-0 font-mono text-[18px] font-semibold tracking-wide text-text outline-none placeholder:text-text-muted"
        />
        {valid && (
          <button
            onClick={onNext}
            className="press flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gold text-bg"
          >
            <ChevRightIcon size={18} />
          </button>
        )}
      </div>

      <p className="text-[12px] leading-relaxed text-text-muted">
        We&apos;ll send you a 6-digit code on WhatsApp.
      </p>

      {/* Divider */}
      <div className="my-5 flex items-center gap-3">
        <div className="h-px flex-1 bg-border" />
        <span className="text-[10px] font-semibold uppercase tracking-[1.4px] text-text-muted">or</span>
        <div className="h-px flex-1 bg-border" />
      </div>

      {/* Social — minimal text rows */}
      <div className="flex flex-col">
        <SocialRow icon={<GoogleIcon />} label="Continue with Google" />
        <SocialRow icon={<AppleIcon />} label="Continue with Apple" />
      </div>
    </div>
  )
}

function OtpStep({ phone, onBack, onDone }: { phone: string; onBack: () => void; onDone: () => void }) {
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""))
  const [seconds, setSeconds] = useState(28)
  const inputsRef = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    inputsRef.current[0]?.focus()
  }, [])

  useEffect(() => {
    if (seconds <= 0) return
    const id = setTimeout(() => setSeconds((s) => s - 1), 1000)
    return () => clearTimeout(id)
  }, [seconds])

  const filled = otp.filter((d) => d !== "").length
  const valid = filled === 6
  const pretty = phone.replace(/(\d{5})(\d{5})/, "$1 $2")

  // Auto-advance when 6 digits filled
  useEffect(() => {
    if (valid) {
      const t = setTimeout(onDone, 280)
      return () => clearTimeout(t)
    }
  }, [valid, onDone])

  function setDigit(i: number, v: string) {
    const d = v.replace(/\D/g, "").slice(0, 1)
    const arr = [...otp]
    arr[i] = d
    setOtp(arr)
    if (d && i < 5) inputsRef.current[i + 1]?.focus()
  }

  return (
    <div className="animate-fade-in flex flex-col gap-6">
      <button onClick={onBack} className="press inline-flex items-center gap-1.5 self-start text-[13px] font-medium text-text-dim">
        <ChevRightIcon size={14} className="rotate-180" /> +91 {pretty}
      </button>

      <div>
        <h2 className="font-heading text-[26px] font-bold leading-tight tracking-[-0.5px]">
          Enter your code
        </h2>
        <p className="mt-2 text-[14px] leading-relaxed text-text-dim">
          Sent to your WhatsApp.
        </p>
      </div>

      <div className="flex justify-between gap-2.5">
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
            className="h-[56px] min-w-0 flex-1 border-0 border-b-[1.5px] bg-transparent text-center font-mono text-[26px] font-bold text-text outline-none transition-colors"
            style={{
              borderBottomColor: otp[i] ? "#E8C547" : "rgba(255,255,255,0.10)",
              borderRadius: 0,
            }}
          />
        ))}
      </div>

      <p className="text-center text-[12px] text-text-dim">
        {seconds > 0 ? (
          <>Resend in <span className="font-mono font-semibold text-text">0:{String(seconds).padStart(2, "0")}</span></>
        ) : (
          <button onClick={() => setSeconds(28)} className="font-semibold text-gold">Resend code</button>
        )}
      </p>
    </div>
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
      <div className="flex min-h-dvh flex-col px-7 pb-7 pt-5">
        {/* Top: mark */}
        <AuthMark />

        {/* Middle: headline + form */}
        <div className="flex flex-1 flex-col justify-center gap-9 pt-6">
          <div>
            <h1
              className="font-heading text-[34px] font-bold leading-[1.05] tracking-[-1.2px]"
              style={{ textWrap: "balance" } as React.CSSProperties}
            >
              {step === "phone" ? (
                <>Sign in to <span className="text-gold">Vamos</span></>
              ) : (
                "Almost there."
              )}
            </h1>
            <p className="mt-3 max-w-[260px] text-[14px] leading-relaxed text-text-dim">
              {step === "phone"
                ? "Predict, pool with friends, win the World Cup."
                : "Verify your number to continue."}
            </p>
          </div>

          {step === "phone" && <PhoneStep phone={phone} setPhone={setPhone} onNext={() => setStep("otp")} />}
          {step === "otp" && <OtpStep phone={phone} onBack={() => setStep("phone")} onDone={handleDone} />}
        </div>

        {/* Bottom: legal */}
        <p className="mt-6 text-center text-[11px] leading-relaxed text-text-muted">
          By continuing you agree to our <span className="text-text-dim underline">Terms</span> &amp;{" "}
          <span className="text-text-dim underline">Privacy</span>.
        </p>
      </div>
    </div>
  )
}
