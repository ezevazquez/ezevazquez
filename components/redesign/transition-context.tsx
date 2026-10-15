"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react"
import { usePathname, useRouter } from "next/navigation"
import { useReducedMotion } from "@/hooks/use-reduced-motion"
import { useCopy } from "@/lib/redesign/use-copy"
import { scrollBus } from "./scroll-bus"

type TransitionContextValue = {
  navigate: (href: string) => void
  phase: "idle" | "exit" | "enter"
  previewHref: string | null
  setPreviewHref: (href: string | null) => void
}

const TransitionContext = createContext<TransitionContextValue | null>(null)

const PAGE_TITLES: Record<string, { es: string; en: string }> = {
  "/": { es: "Inicio", en: "Home" },
  "/about": { es: "About", en: "About" },
  "/work": { es: "Work", en: "Work" },
  "/contact": { es: "Contacto", en: "Contact" },
}

export function TransitionProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const reduced = useReducedMotion()
  const { language } = useCopy()
  const [phase, setPhase] = useState<"idle" | "exit" | "enter">("idle")
  const [previewHref, setPreviewHref] = useState<string | null>(null)
  const pending = useRef<string | null>(null)
  const liveRef = useRef<HTMLDivElement>(null)
  const busy = useRef(false)

  const finishEnter = useCallback(() => {
    setPhase("idle")
    busy.current = false
    const main = document.getElementById("main-content")
    if (main) {
      main.setAttribute("tabindex", "-1")
      main.focus({ preventScroll: true })
    }
    const key = pending.current ?? pathname
    const title = PAGE_TITLES[key]?.[language] ?? "Eze Vazquez"
    if (liveRef.current) liveRef.current.textContent = title
    pending.current = null
  }, [language, pathname])

  const navigate = useCallback(
    (href: string) => {
      if (href === pathname || busy.current) return
      if (reduced) {
        router.push(href)
        return
      }
      busy.current = true
      pending.current = href
      setPhase("exit")
    },
    [pathname, reduced, router],
  )

  useEffect(() => {
    if (phase !== "exit") return
    const href = pending.current
    if (!href) return
    const id = window.setTimeout(() => {
      router.push(href)
    }, 720)
    return () => window.clearTimeout(id)
  }, [phase, router])

  useEffect(() => {
    if (phase !== "exit") return
    if (pending.current !== pathname) return
    // Pathname matched — scroll then enter
    if (scrollBus.lenis) {
      scrollBus.lenis.scrollTo(0, { immediate: true })
    } else {
      window.scrollTo(0, 0)
    }
    setPhase("enter")
    const id = window.setTimeout(finishEnter, 580)
    return () => window.clearTimeout(id)
  }, [pathname, phase, finishEnter])

  // Soft enter when reduced-motion navigates without exit phase
  useEffect(() => {
    if (reduced || phase !== "idle") return
    const main = document.getElementById("main-content")
    if (main && document.activeElement === document.body) {
      // no-op: only focus after real transitions
    }
  }, [pathname, reduced, phase])

  const value = useMemo(
    () => ({ navigate, phase, previewHref, setPreviewHref }),
    [navigate, phase, previewHref],
  )

  return (
    <TransitionContext.Provider value={value}>
      {children}
      <div ref={liveRef} className="sr-only" aria-live="polite" aria-atomic="true" />
      <PageBands phase={phase} reduced={reduced} />
    </TransitionContext.Provider>
  )
}

function PageBands({
  phase,
  reduced,
}: {
  phase: "idle" | "exit" | "enter"
  reduced: boolean
}) {
  if (reduced || phase === "idle") return null
  return (
    <div
      className={`pointer-events-none fixed inset-0 z-[70] flex flex-col ${
        phase === "exit" ? "bands-exit" : "bands-enter"
      }`}
      aria-hidden
    >
      {Array.from({ length: 8 }, (_, index) => (
        <span key={index} className="band" style={{ animationDelay: `${index * 32}ms` }} />
      ))}
    </div>
  )
}

export function useTransitionNav() {
  const ctx = useContext(TransitionContext)
  if (!ctx) throw new Error("useTransitionNav must be used within TransitionProvider")
  return ctx
}
