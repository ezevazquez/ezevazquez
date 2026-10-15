"use client"

import { useEffect, useRef } from "react"
import { useReducedMotion } from "@/hooks/use-reduced-motion"

export function CursorHalo() {
  const reduced = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const node = ref.current
    if (!node || reduced || !window.matchMedia("(pointer: fine)").matches) return

    const move = (event: PointerEvent) => {
      node.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`
      node.style.opacity = "1"
    }
    window.addEventListener("pointermove", move)
    return () => window.removeEventListener("pointermove", move)
  }, [reduced])

  if (reduced) return null

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[55] hidden h-9 w-9 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#1F4BFF] opacity-0 mix-blend-screen md:block"
    />
  )
}
