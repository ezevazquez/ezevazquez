"use client"

import { useEffect, type ReactNode } from "react"
import { MotionConfig } from "framer-motion"
import { usePathname } from "next/navigation"
import { useCopy } from "@/lib/redesign/use-copy"
import { BottomNav } from "./bottom-nav"
import { CursorHalo } from "./cursor-halo"
import { Loader } from "./loader"
import { PageTransition } from "./page-transition"
import { scrollBus } from "./scroll-bus"
import { SmoothScroll } from "./smooth-scroll"

export function SiteFrame({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const { t, language, setLanguage } = useCopy()

  useEffect(() => {
    if (scrollBus.lenis) {
      scrollBus.lenis.scrollTo(0, { immediate: true })
    } else {
      window.scrollTo(0, 0)
    }
  }, [pathname])

  return (
    <MotionConfig reducedMotion="user">
      <SmoothScroll />
      <CursorHalo />
      <Loader />
      <PageTransition />
      <div
        aria-hidden
        className="grain pointer-events-none fixed inset-0 z-[1] opacity-25 mix-blend-overlay"
      />
      <a
        href="#main-content"
        className="sr-only fixed left-4 top-4 z-[60] rounded-full bg-[#1F4BFF] px-4 py-2 font-mono text-xs text-white focus:not-sr-only"
      >
        {t.skip}
      </a>
      <button
        type="button"
        onClick={() => setLanguage(language === "es" ? "en" : "es")}
        aria-label={t.langLabel}
        className="press fixed right-4 top-4 z-[60] rounded-full border border-[#F4F1EA]/15 bg-[#12131A]/80 px-3 py-2 font-mono text-[11px] uppercase tracking-wide text-[#F4F1EA] backdrop-blur-md"
      >
        {language === "es" ? "EN" : "ES"}
      </button>
      <main id="main-content" className="relative z-[2]">
        {children}
      </main>
      <BottomNav />
    </MotionConfig>
  )
}
