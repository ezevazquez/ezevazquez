import type { ReactNode } from "react"
import type { Metadata } from "next"
import { DM_Mono, Outfit, Syne } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { LanguageProvider } from "@/components/language-provider"
import { SiteFrame } from "@/components/redesign/site-frame"

const syne = Syne({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-display",
})

const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body",
})

const dmMono = DM_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
  variable: "--font-mono",
})

export const metadata: Metadata = {
  title: "Eze Vazquez | Technical PM",
  description:
    "Technical PM. I build systems that work for you. Teams, processes, and operations with AI, built around your problem.",
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${syne.variable} ${outfit.variable} ${dmMono.variable}`}>
      <body className="bg-[#12131A] font-sans text-[#F4F1EA] antialiased">
        <ThemeProvider attribute="class" defaultTheme="dark">
          <LanguageProvider>
            <SiteFrame>{children}</SiteFrame>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
