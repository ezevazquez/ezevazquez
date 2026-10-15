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

function scrollToTop() {
  if (scrollBus.lenis) {
    scrollBus.lenis.scrollTo(0, { immediate: true })
  } else {
    window.scrollTo(0, 0)
  }
}

function focusMain() {
  const main = document.getElementById("main-content")
  if (!main) return
  main.setAttribute("tabindex", "-1")
  main.focus({ preventScroll: true })
}

/** Clone main into R/G/B layers for a real chromatic split during exit. */
function mountRgbSplit() {
  const main = document.getElementById("main-content")
  if (!main) return () => {}

  const wrap = document.createElement("div")
  wrap.className = "rgb-split-layers"
  wrap.setAttribute("aria-hidden", "true")

  const scrollY = window.scrollY || document.documentElement.scrollTop
  ;(["r", "g", "b"] as const).forEach((ch) => {
    const layer = document.createElement("div")
    layer.className = `rgb-layer rgb-${ch}`
    const clone = main.cloneNode(true) as HTMLElement
    clone.removeAttribute("id")
    clone.querySelectorAll("a,button,input,textarea,select").forEach((el) => {
      el.setAttribute("tabindex", "-1")
      if (el instanceof HTMLElement) el.style.pointerEvents = "none"
    })
    clone.style.transform = `translateY(${-scrollY}px)`
    layer.appendChild(clone)
    wrap.appendChild(layer)
  })

  document.body.appendChild(wrap)
  main.classList.add("rgb-split-source")

  return () => {
    wrap.remove()
    main.classList.remove("rgb-split-source")
  }
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
  const mounted = useRef(false)
  const rgbCleanup = useRef<(() => void) | null>(null)

  const finishEnter = useCallback(() => {
    setPhase("idle")
    busy.current = false
    rgbCleanup.current?.()
    rgbCleanup.current = null
    focusMain()
    const key = pending.current ?? pathname
    const title = PAGE_TITLES[key]?.[language] ?? "Eze Vazquez"
    if (liveRef.current) liveRef.current.textContent = title
    pending.current = null
  }, [language, pathname])

  const navigate = useCallback(
    (href: string) => {
      if (href === pathname || busy.current) return
      busy.current = true
      pending.current = href
      if (reduced) {
        router.push(href)
        return
      }
      rgbCleanup.current?.()
      rgbCleanup.current = mountRgbSplit()
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

  // Complete programmed navigation (exit → pathname match → enter)
  useEffect(() => {
    if (phase !== "exit") return
    if (pending.current !== pathname) return
    scrollToTop()
    rgbCleanup.current?.()
    rgbCleanup.current = null
    setPhase("enter")
    const id = window.setTimeout(finishEnter, 580)
    return () => window.clearTimeout(id)
  }, [pathname, phase, finishEnter])

  // Reduced-motion push: focus + scroll after pathname changes
  useEffect(() => {
    if (!reduced) return
    if (!pending.current) return
    if (pending.current !== pathname) return
    scrollToTop()
    finishEnter()
  }, [pathname, reduced, finishEnter])

  // Back/forward (and any pathname change we did not drive)
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true
      return
    }
    if (busy.current || pending.current) return
    scrollToTop()
    if (reduced) {
      focusMain()
      const title = PAGE_TITLES[pathname]?.[language] ?? "Eze Vazquez"
      if (liveRef.current) liveRef.current.textContent = title
      return
    }
    busy.current = true
    setPhase("enter")
    const id = window.setTimeout(finishEnter, 580)
    return () => window.clearTimeout(id)
  }, [pathname, reduced, language, finishEnter])

  useEffect(() => {
    return () => {
      rgbCleanup.current?.()
    }
  }, [])

  const value = useMemo(
    () => ({ navigate, phase, previewHref, setPreviewHref }),
    [navigate, phase, previewHref],
  )

  return (
    <TransitionContext.Provider value={value}>
      {children}
      <div ref={liveRef} className="sr-only" aria-live="polite" aria-atomic="true" />
      <PageBands phase={phase} reduced={reduced} />
      <RgbFilters />
    </TransitionContext.Provider>
  )
}

function RgbFilters() {
  return (
    <svg className="pointer-events-none absolute h-0 w-0" aria-hidden>
      <filter id="rgb-r">
        <feColorMatrix
          type="matrix"
          values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0"
        />
      </filter>
      <filter id="rgb-g">
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0"
        />
      </filter>
      <filter id="rgb-b">
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0"
        />
      </filter>
    </svg>
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
