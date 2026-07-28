"use client"

import type { ReactNode } from "react"
import { MotionConfig } from "framer-motion"
import { SystemBackground } from "./system-background"
import { Navbar } from "./navbar"
import { Footer } from "./footer"
import { useLanguage } from "./language-provider"

export function SiteShell({ children }: { children: ReactNode }) {
  const { t } = useLanguage()

  return (
    <MotionConfig reducedMotion="user">
      <div className="relative min-h-screen bg-black text-white overflow-x-hidden selection:bg-primary/30">
        <SystemBackground />
        <a
          href="#main-content"
          className="sr-only fixed left-4 top-4 z-50 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white focus:not-sr-only"
        >
          {t("common.skipToContent")}
        </a>
        <Navbar />
        <main id="main-content" className="relative z-[1]">{children}</main>
        <Footer />
      </div>
    </MotionConfig>
  )
}
