"use client"

import { useEffect, useRef, useState } from "react"
import { useReducedMotion } from "@/hooks/use-reduced-motion"
import { useCopy } from "@/lib/redesign/use-copy"
import { TerminalMark } from "./terminal-mark"

function shouldSkipLoader() {
  if (typeof document === "undefined") return false
  if (document.documentElement.classList.contains("reduce-motion")) return true
  return false
}

/** Non-linear progress that sticks near 47% for the Jira gag. */
function mapProgress(raw: number) {
  if (raw < 0.38) return raw * (47 / 38)
  if (raw < 0.55) return 47 + (raw - 0.38) * 4
  return 47 + ((raw - 0.55) / 0.45) * 53
}

export function Loader() {
  const { t } = useCopy()
  const reduced = useReducedMotion()
  const [visible, setVisible] = useState(true)
  const [leaving, setLeaving] = useState(false)
  const [count, setCount] = useState(0)
  const [completedLines, setCompletedLines] = useState<string[]>([])
  const [currentLine, setCurrentLine] = useState("")
  const phraseIndex = useRef(0)
  const timeouts = useRef<number[]>([])

  useEffect(() => {
    const clearTimeouts = () => {
      timeouts.current.forEach((id) => window.clearTimeout(id))
      timeouts.current = []
    }

    if (reduced || shouldSkipLoader()) {
      document.documentElement.classList.add("loader-done")
      setVisible(false)
      return clearTimeouts
    }

    document.documentElement.style.overflow = "hidden"
    const started = performance.now()
    const duration = 3200
    let frame = 0
    const phrases = t.loader

    phraseIndex.current = 0
    setCurrentLine(phrases[0] ?? "")

    const schedule = (fn: () => void, ms: number) => {
      const id = window.setTimeout(fn, ms)
      timeouts.current.push(id)
      return id
    }

    const step = (now: number) => {
      const raw = Math.min(1, (now - started) / duration)
      const mapped = Math.min(100, Math.round(mapProgress(raw)))
      setCount(mapped)

      const nextPhraseIndex = Math.min(
        phrases.length - 1,
        Math.floor(raw * phrases.length),
      )

      if (nextPhraseIndex !== phraseIndex.current) {
        const prev = phrases[phraseIndex.current]
        if (prev) {
          setCompletedLines((old) => [...old, prev])
        }
        phraseIndex.current = nextPhraseIndex
        setCurrentLine(phrases[nextPhraseIndex] ?? "")
      }

      if (raw < 1) {
        frame = requestAnimationFrame(step)
      } else {
        setLeaving(true)
        window.dispatchEvent(new CustomEvent("eze:sig-flip"))
        schedule(() => {
          document.documentElement.classList.add("loader-done")
          setVisible(false)
          document.documentElement.style.overflow = ""
          window.dispatchEvent(new CustomEvent("eze:loader-done"))
        }, 520)
      }
    }

    frame = requestAnimationFrame(step)
    return () => {
      cancelAnimationFrame(frame)
      clearTimeouts()
      document.documentElement.style.overflow = ""
    }
  }, [reduced, t.loader])

  if (!visible) return null

  return (
    <div
      data-loader
      className={`fixed inset-0 z-[80] flex flex-col bg-signal text-paper ${
        leaving ? "loader-curtain" : ""
      }`}
      role="status"
      aria-live="polite"
      aria-label={t.loaderAria}
    >
      {/* Center Terminal Box */}
      <div className="flex flex-1 items-center justify-center px-6">
        <TerminalMark data-loader-sig className="w-[min(88vw,520px)]" />
      </div>

      {/* Bottom Terminal Log Stack & Percentage */}
      <div className="flex items-end justify-between gap-6 px-6 pb-8 sm:px-10">
        {/* Terminal Log Stack */}
        <div className="flex flex-col gap-1 font-mono text-xs sm:text-sm max-w-lg select-none">
          {completedLines.slice(-3).map((line, idx) => (
            <div key={idx} className="flex items-center gap-2 text-paper/65 transition-all">
              <span className="text-success font-bold">✔</span>
              <span className="text-paper/40">
                [{String(completedLines.indexOf(line) + 1).padStart(2, "0")}]
              </span>
              <span>{line}</span>
            </div>
          ))}

          {/* Active Terminal Line */}
          <div className="flex items-center gap-2 text-paper font-medium pt-0.5">
            <span className="text-warning animate-pulse">❯</span>
            <span className="text-paper/50">
              [{String(completedLines.length + 1).padStart(2, "0")}]
            </span>
            <span>{currentLine}</span>
            <span className="inline-block animate-pulse text-success">▍</span>
          </div>
        </div>

        {/* Big Counter */}
        <p className="font-display text-5xl leading-none tracking-[-0.04em] sm:text-7xl font-bold" aria-hidden>
          {count}
        </p>
      </div>
    </div>
  )
}
