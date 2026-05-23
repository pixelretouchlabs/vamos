import type { Metadata, Viewport } from "next"
import { Syne, DM_Sans } from "next/font/google"
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

export const metadata: Metadata = {
  title: "Vamos — World Cup 2026",
  description: "India's ultimate World Cup fan app. Predict, play, win.",
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
    <html lang="en" className={`${syne.variable} ${dmSans.variable}`}>
      <body className="min-h-dvh bg-bg pb-20">
        <main className="mx-auto max-w-lg">{children}</main>
        <BottomNav />
      </body>
    </html>
  )
}
