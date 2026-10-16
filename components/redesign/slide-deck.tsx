"use client"

import { useEffect, useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useCopy } from "@/lib/redesign/use-copy"
import { useReducedMotion } from "@/hooks/use-reduced-motion"

const SLIDES_CACHE_KEY = "eze_slides_cache_v1"
const CACHE_TTL_MS = 5 * 60 * 1000 // 5 minutes like milo.gg

export function SlideDeck() {
  const { t } = useCopy()
  const reduced = useReducedMotion()
  const [index, setIndex] = useState(0)
  const [direction, setDirection] = useState(1)
  const slides = t.heroDeck

  // Cache handling with localStorage
  useEffect(() => {
    try {
      const cached = localStorage.getItem(SLIDES_CACHE_KEY)
      if (cached) {
        const parsed = JSON.parse(cached)
        if (Date.now() - parsed.timestamp < CACHE_TTL_MS && typeof parsed.index === "number") {
          setIndex(parsed.index)
        }
      }
    } catch {
      // ignore
    }
  }, [])

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
      setDirection(delta)
      setIndex((prev) => {
        const next = (prev + delta + slides.length) % slides.length
        saveIndex(next)
        return next
      })
    },
    [slides.length],
  )

  const current = slides[index]

  const onDeckKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return
    event.preventDefault()
    go(event.key === "ArrowLeft" ? -1 : 1)
  }

  const slideVariants = {
    enter: (d: number) => ({
      x: reduced ? 0 : d > 0 ? 30 : -30,
      opacity: 0,
      scale: reduced ? 1 : 0.98,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (d: number) => ({
      x: reduced ? 0 : d > 0 ? -30 : 30,
      opacity: 0,
      scale: reduced ? 1 : 0.98,
    }),
  }

  return (
    <div
      className="relative mx-auto w-[min(100%,31rem)] text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-signal"
      onKeyDown={onDeckKeyDown}
      tabIndex={0}
      role="region"
      aria-label="Deck interactivo"
    >
      {/* Layered stack background (milo / physical cards style) */}
      <div className="absolute inset-0 translate-x-2.5 translate-y-2.5 rotate-2 rounded-[1.7rem] border border-white/10 bg-deck-layer" aria-hidden />
      <div className="absolute inset-0 translate-y-1.5 rounded-[1.7rem] border border-white/10 bg-deck-layer" aria-hidden />

      {/* Main Slide Card */}
      <div className="relative rounded-[1.7rem] border border-white/25 bg-deck p-6 shadow-[0_24px_80px_-30px_rgba(0,0,0,0.9)] sm:p-8">
        {/* Header row */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-signal animate-pulse" />
            <span className="font-mono text-[11px] uppercase tracking-widest text-signal font-semibold">
              {current.tag}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Slide anterior"
              className="press flex h-8 w-8 items-center justify-center rounded-full bg-paper text-lg leading-none text-canvas hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              ‹
            </button>
            <span className="font-mono text-xs font-semibold text-paper/50">
              <span className="text-paper">{index + 1}</span> / {slides.length}
            </span>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Slide siguiente"
              className="press flex h-8 w-8 items-center justify-center rounded-full bg-paper text-lg leading-none text-canvas hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              ›
            </button>
          </div>
        </div>

        {/* Slide Content with Animation */}
        <div className="relative min-h-[10.5rem] overflow-hidden pt-7 sm:min-h-[12rem]">
          <AnimatePresence custom={direction} mode="wait">
            <motion.div
              key={index}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.28, ease: [0.23, 1, 0.32, 1] }}
            >
              <h2 className="font-display text-[clamp(2rem,6vw,3.4rem)] font-bold leading-[0.92] tracking-[-0.055em] text-paper">
                {current.title}
              </h2>
              <p className="mt-5 max-w-[24rem] font-mono text-base leading-relaxed text-paper/80 sm:text-lg">
                {current.body}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
