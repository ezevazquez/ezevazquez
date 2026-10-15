"use client"

import { useEffect, useState } from "react"
import { useReducedMotion } from "@/hooks/use-reduced-motion"
import { useCopy } from "@/lib/redesign/use-copy"
import { Signature } from "./signature"

const STORAGE_KEY = "eze-loader"

export function Loader() {
  const { t } = useCopy()
  const reduced = useReducedMotion()
  const [visible, setVisible] = useState(true)
  const [leaving, setLeaving] = useState(false)
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (reduced || sessionStorage.getItem(STORAGE_KEY)) {
      setVisible(false)
      return
    }

    document.documentElement.style.overflow = "hidden"
    const started = performance.now()
    const duration = 2400
    let frame = 0

    const step = (now: number) => {
      const progress = Math.min(1, (now - started) / duration)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.round(eased * 100))
      if (progress < 1) {
        frame = requestAnimationFrame(step)
      } else {
        setLeaving(true)
        window.setTimeout(() => {
          sessionStorage.setItem(STORAGE_KEY, "1")
          setVisible(false)
          document.documentElement.style.overflow = ""
        }, 420)
      }
    }

    frame = requestAnimationFrame(step)
    return () => {
      cancelAnimationFrame(frame)
      document.documentElement.style.overflow = ""
    }
  }, [reduced])

  if (!visible) return null

  const phrase = t.loader[Math.min(t.loader.length - 1, Math.floor(count / 34))]

  return (
    <div
      className={`fixed inset-0 z-[80] flex flex-col bg-[#1F4BFF] text-[#F4F1EA] transition-opacity duration-500 ${leaving ? "opacity-0" : "opacity-100"}`}
      style={{ transitionTimingFunction: "cubic-bezier(0.23, 1, 0.32, 1)" }}
      role="status"
      aria-live="polite"
      aria-label={phrase}
    >
      <div className="flex flex-1 items-center justify-center px-6">
        <Signature className="w-[min(78vw,520px)]" />
      </div>
      <div className="flex items-end justify-between gap-6 px-6 pb-8 sm:px-10">
        <p className="max-w-[16rem] font-mono text-sm sm:text-base">{phrase}</p>
        <p className="font-display text-5xl leading-none tracking-[-0.04em] sm:text-7xl">
          {count}
        </p>
      </div>
    </div>
  )
}
