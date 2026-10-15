"use client"

import { useEffect } from "react"
import { useReducedMotion } from "@/hooks/use-reduced-motion"
import { scrollBus } from "./scroll-bus"

export function SmoothScroll() {
  const reduced = useReducedMotion()

  useEffect(() => {
    if (reduced) return

    let cancelled = false
    let cleanup = () => {}

    ;(async () => {
      const Lenis = (await import("lenis")).default
      const gsap = (await import("gsap")).default
      const { ScrollTrigger } = await import("gsap/ScrollTrigger")
      if (cancelled) return

      gsap.registerPlugin(ScrollTrigger)
      const lenis = new Lenis({ lerp: 0.12, smoothWheel: true })
      scrollBus.lenis = lenis
      lenis.on("scroll", ScrollTrigger.update)

      const tick = (time: number) => {
        lenis.raf(time * 1000)
      }
      gsap.ticker.add(tick)
      gsap.ticker.lagSmoothing(0)

      cleanup = () => {
        gsap.ticker.remove(tick)
        lenis.destroy()
        if (scrollBus.lenis === lenis) scrollBus.lenis = null
      }
    })()

    return () => {
      cancelled = true
      cleanup()
    }
  }, [reduced])

  return null
}
