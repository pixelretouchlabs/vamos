import type { Metadata, Viewport } from "next"
import { Syne, DM_Sans, JetBrains_Mono } from "next/font/google"
import "./globals.css"
import { BottomNav } from "@/components/layout/BottomNav"

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
})

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
})

export const metadata: Metadata = {
  title: "Vamos — World Cup 2026",
  description: "India's ultimate World Cup fan app. Predict, pool, win.",
  manifest: "/manifest.json",
}

export const viewport: Viewport = {
  themeColor: "#E8C547",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${syne.variable} ${dmSans.variable} ${jetbrainsMono.variable}`}>
      <body className="min-h-dvh bg-bg pb-24">
        <main className="mx-auto max-w-lg">{children}</main>
        <BottomNav />
      </body>
    </html>
  )
}
