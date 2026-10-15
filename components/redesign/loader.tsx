"use client"

import { useEffect, useRef, useState } from "react"
import { useReducedMotion } from "@/hooks/use-reduced-motion"
import { LOADER_STORAGE_KEY } from "@/lib/redesign/config"
import { useCopy } from "@/lib/redesign/use-copy"
import { Signature } from "./signature"

function shouldSkipLoader() {
  if (typeof document === "undefined") return false
  if (document.documentElement.classList.contains("loader-done")) return true
  if (document.documentElement.classList.contains("reduce-motion")) return true
  try {
    return !!sessionStorage.getItem(LOADER_STORAGE_KEY)
  } catch {
    return false
  }
}

function scramble(from: string, to: string, t: number) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz…·/"
  const len = Math.max(from.length, to.length)
  let out = ""
  for (let i = 0; i < len; i++) {
    if (i / len < t) out += to[i] ?? ""
    else out += chars[Math.floor(Math.random() * chars.length)]
  }
  return out
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
  // Always true on first paint so SSR and hydration match; CSS hides when loader-done.
  const [visible, setVisible] = useState(true)
  const [leaving, setLeaving] = useState(false)
  const [count, setCount] = useState(0)
  const [phrase, setPhrase] = useState("")
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
    setPhrase(phrases[0] ?? "")

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
        const from = phrases[phraseIndex.current] ?? ""
        const to = phrases[nextPhraseIndex] ?? ""
        phraseIndex.current = nextPhraseIndex
        let scrambleFrame = 0
        const scrambleSteps = 8
        const runScramble = () => {
          scrambleFrame++
          setPhrase(scramble(from, to, scrambleFrame / scrambleSteps))
          if (scrambleFrame < scrambleSteps) {
            schedule(runScramble, 28)
          } else {
            setPhrase(to)
          }
        }
        runScramble()
      }

      if (raw < 1) {
        frame = requestAnimationFrame(step)
      } else {
        setLeaving(true)
        window.dispatchEvent(new CustomEvent("eze:sig-flip"))
        schedule(() => {
          try {
            sessionStorage.setItem(LOADER_STORAGE_KEY, "1")
          } catch {
            /* ignore */
          }
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

  const label =
    count >= 45 && count <= 52
      ? phrasesAt47(t.loader)
      : phrase || t.loader[0]

  return (
    <div
      data-loader
      className={`fixed inset-0 z-[80] flex flex-col bg-[#1F4BFF] text-[#F4F1EA] ${
        leaving ? "loader-curtain" : ""
      }`}
      role="status"
      aria-live="polite"
      aria-label={label}
    >
      <div className="flex flex-1 items-center justify-center px-6">
        <Signature data-loader-sig className="w-[min(78vw,520px)]" />
      </div>
      <div className="flex items-end justify-between gap-6 px-6 pb-8 sm:px-10">
        <p className="max-w-[18rem] font-mono text-sm sm:text-base" aria-hidden>
          {label}
        </p>
        <p className="font-display text-5xl leading-none tracking-[-0.04em] sm:text-7xl" aria-hidden>
          {count}
        </p>
      </div>
    </div>
  )
}

function phrasesAt47(phrases: readonly string[]) {
  return phrases.find((p) => p.includes("47") || p.includes("Jira")) ?? phrases[phrases.length - 1] ?? ""
}
