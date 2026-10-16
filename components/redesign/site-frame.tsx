"use client"

import type { ReactNode } from "react"
import { MotionConfig } from "framer-motion"
import { useCopy } from "@/lib/redesign/use-copy"
import { BottomNav } from "./bottom-nav"
import { CursorHalo } from "./cursor-halo"
import { EasterEggs } from "./easter-eggs"
import { Loader } from "./loader"
import { LogoMark } from "./logo-mark"
import { SmoothScroll } from "./smooth-scroll"
import { TransitionProvider } from "./transition-context"
import { ToastProvider } from "./toast-provider"

export function SiteFrame({ children }: { children: ReactNode }) {
  const { t, language, setLanguage } = useCopy()

  return (
    <MotionConfig reducedMotion="user">
      <ToastProvider>
        <TransitionProvider>
          <SmoothScroll />
          <CursorHalo />
          <EasterEggs />
          <Loader />
          <LogoMark />
        <div
          aria-hidden
          className="grain pointer-events-none fixed inset-0 z-[1] opacity-[0.18] mix-blend-overlay max-md:opacity-[0.1]"
        />
        <a
          href="#main-content"
          className="sr-only fixed left-4 top-4 z-[60] rounded-full bg-signal px-4 py-2 font-mono text-xs text-white focus:not-sr-only"
        >
          {t.skip}
        </a>
        <button
          type="button"
          onClick={() => setLanguage(language === "es" ? "en" : "es")}
          aria-label={t.langLabel}
          className="utility-control press fixed right-4 top-4 z-[60] rounded-full border border-paper/15 bg-canvas/80 px-3 py-2 font-mono text-[11px] uppercase tracking-wide text-paper backdrop-blur-md"
        >
          {language === "es" ? "EN" : "ES"}
        </button>
        <main id="main-content" tabIndex={-1} className="relative z-[2] outline-none">
          {children}
        </main>
        <BottomNav />
      </TransitionProvider>
    </ToastProvider>
  </MotionConfig>
  )
}
