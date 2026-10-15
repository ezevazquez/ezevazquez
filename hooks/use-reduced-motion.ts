"use client"

import { useEffect, useState } from "react"

function readReduced() {
  if (typeof document === "undefined") return false
  if (document.documentElement.classList.contains("reduce-motion")) return true
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
}

export function useReducedMotion() {
  const [reduced, setReduced] = useState(readReduced)

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    const sync = () => {
      const matches = mq.matches
      document.documentElement.classList.toggle("reduce-motion", matches)
      setReduced(matches)
    }
    sync()
    mq.addEventListener("change", sync)
    return () => mq.removeEventListener("change", sync)
  }, [])

  return reduced
}
