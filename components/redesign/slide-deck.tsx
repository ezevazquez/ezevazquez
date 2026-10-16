"use client"

import { useEffect, useState, useCallback, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useCopy } from "@/lib/redesign/use-copy"
import { useReducedMotion } from "@/hooks/use-reduced-motion"
import { LINKEDIN_URL } from "@/lib/constants"

const SLIDES_CACHE_KEY = "eze_slides_cache_v1"
const CACHE_TTL_MS = 5 * 60 * 1000 // 5 minutes like milo.gg

export function SlideDeck({ entered }: { entered: boolean }) {
  const { t } = useCopy()
  const reduced = useReducedMotion()
  const [index, setIndex] = useState(0)
  const hasTypedOnce = useRef(false)
  const slides = t.heroDeck

  // Cache handling with localStorage
  useEffect(() => {
    try {
      const cached = localStorage.getItem(SLIDES_CACHE_KEY)
      if (cached) {
        const parsed = JSON.parse(cached)
        if (Date.now() - parsed.timestamp < CACHE_TTL_MS && typeof parsed.index === "number") {
          setIndex(parsed.index % slides.length)
        }
      }
    } catch {
      // ignore
    }
  }, [slides.length])

  const saveIndex = (nextIndex: number) => {
    try {
      localStorage.setItem(
        SLIDES_CACHE_KEY,
        JSON.stringify({ index: nextIndex, timestamp: Date.now() }),
      )
    } catch {
      // ignore
    }
  }

  const go = useCallback(
    (delta: number) => {
      hasTypedOnce.current = true
      setIndex((prev) => {
        const next = (prev + delta + slides.length) % slides.length
        saveIndex(next)
        return next
      })
    },
    [slides.length],
  )

  const current = slides[index]
  const [typedTitle, setTypedTitle] = useState("")
  const [typedBody, setTypedBody] = useState("")

  useEffect(() => {
    if (!entered || !current) return
    if (hasTypedOnce.current) {
      setTypedTitle(current.title)
      setTypedBody(current.body)
      return
    }
    let titleIndex = 0
    let bodyIndex = 0
    setTypedTitle("")
    setTypedBody("")
    const type = window.setInterval(() => {
      if (titleIndex < current.title.length) {
        titleIndex += 1
        setTypedTitle(current.title.slice(0, titleIndex))
      } else if (bodyIndex < current.body.length) {
        bodyIndex += 1
        setTypedBody(current.body.slice(0, bodyIndex))
      } else {
        hasTypedOnce.current = true
        window.clearInterval(type)
      }
    }, 16)
    return () => window.clearInterval(type)
  }, [current, entered])

  const onDeckKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return
    event.preventDefault()
    go(event.key === "ArrowLeft" ? -1 : 1)
  }

  const cardVariants = {
    enter: {
      opacity: 0,
      transform: reduced ? "translate3d(0, 0, 0) scale(1)" : "translate3d(0, 14px, 0) scale(0.985)",
    },
    center: {
      opacity: 1,
      transform: "translate3d(0, 0, 0) scale(1)",
      transition: reduced
        ? { opacity: { duration: 0.12, ease: [0.23, 1, 0.32, 1] } }
        : { transform: { type: "spring", duration: 0.38, bounce: 0.14 }, opacity: { duration: 0.16, ease: [0.23, 1, 0.32, 1] } },
    },
    exit: {
      opacity: 0,
      transform: reduced ? "translate3d(0, 0, 0) scale(1)" : "translate3d(0, -12px, 0) scale(0.99)",
      transition: reduced
        ? { opacity: { duration: 0.12, ease: [0.23, 1, 0.32, 1] } }
        : { transform: { duration: 0.18, ease: [0.23, 1, 0.32, 1] }, opacity: { duration: 0.14, ease: [0.23, 1, 0.32, 1] } },
    },
  }

  return (
    <div
      className={`relative mx-auto w-[min(100%,31rem)] text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-signal transition-[opacity,transform] duration-500 ${entered ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"}`}
      data-hero-deck
      onKeyDown={onDeckKeyDown}
      tabIndex={0}
      role="region"
      aria-label={t.deck.aria}
    >
      {/* Physical stack: the current card is passed into these layers. */}
      {Array.from({ length: 4 }, (_, layer) => (
        <div
          key={layer}
          aria-hidden
          className="absolute inset-x-2 top-0 h-full rounded-[1.7rem] border border-paper/25 bg-deck-layer shadow-[0_14px_16px_-15px_rgb(var(--primitive-black)/0.9)]"
          style={{ transform: `translateY(${(layer + 1) * 12}px) scale(${1 - (layer + 1) * 0.012})`, opacity: 1 - layer * 0.16 }}
        />
      ))}

      <AnimatePresence initial={false} mode="sync">
      <motion.div
        key={index}
        variants={cardVariants}
        initial="enter"
        animate="center"
        exit="exit"
        className="relative h-[20rem] rounded-[1.7rem] border border-paper/80 bg-deck p-6 shadow-[0_24px_80px_-30px_rgb(var(--primitive-black)/0.9)] sm:h-[25rem] sm:p-8"
      >

        {/* Slide Content with Animation */}
        <div className="relative h-[calc(100%-3rem)] overflow-hidden">
            <div>
              <h2 className="font-display text-[clamp(2rem,6vw,3.4rem)] font-bold leading-[0.92] tracking-[-0.055em] text-paper">
                <span aria-hidden>{typedTitle}</span><span className="sr-only">{current.title}</span><span aria-hidden className="text-signal">{entered && typedTitle.length < current.title.length ? "▍" : ""}</span>
              </h2>
              <p className="mt-5 max-w-[24rem] font-mono text-base leading-relaxed text-paper/80 sm:text-lg">
                <span aria-hidden>{typedBody}</span><span className="sr-only">{current.body}</span>
              </p>
            </div>
        </div>
        <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between sm:bottom-8 sm:left-8 sm:right-8">
          <a href={LINKEDIN_URL} target="_blank" rel="noreferrer" className="press rounded-full bg-paper px-4 py-2 font-mono text-xs text-canvas hover:bg-sheet">{t.deck.linkedin}</a>
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => go(-1)} aria-label={t.deck.previous} className="press grid h-9 w-9 place-items-center rounded-full border border-paper/60 text-xl leading-none text-paper">‹</button>
            <span className="font-mono text-[10px] text-paper/55">{index + 1} / {slides.length}</span>
            <button type="button" onClick={() => go(1)} aria-label={t.deck.next} className="press grid h-9 w-9 place-items-center rounded-full border border-paper/60 text-xl leading-none text-paper">›</button>
          </div>
        </div>
      </motion.div>
      </AnimatePresence>
    </div>
  )
}
