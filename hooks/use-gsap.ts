"use client"

import { useEffect, useRef } from "react"
import { useReducedMotion } from "@/hooks/use-reduced-motion"

type GsapModule = typeof import("gsap")
type Ctx = { revert: () => void }

let registered = false

async function loadGsap() {
  const gsapMod = await import("gsap")
  const gsap = gsapMod.default
  if (!registered) {
    const { ScrollTrigger } = await import("gsap/ScrollTrigger")
    gsap.registerPlugin(ScrollTrigger)
    registered = true
  }
  return gsap
}

/**
 * Single entry for page-level GSAP timelines.
 * Registers ScrollTrigger once; respects reduced motion; refreshes on deps.
 */
export function useGsap(
  setup: (gsap: GsapModule["default"], root: HTMLElement) => void | (() => void),
  deps: unknown[] = [],
) {
  const rootRef = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    if (reduced || !rootRef.current) return
    let ctx: Ctx | null = null
    let dead = false
    let extraCleanup: void | (() => void)

    ;(async () => {
      const gsap = await loadGsap()
      const { ScrollTrigger } = await import("gsap/ScrollTrigger")
      if (dead || !rootRef.current) return
      ctx = gsap.context(() => {
        extraCleanup = setup(gsap, rootRef.current!)
      }, rootRef)
      ScrollTrigger.refresh()
    })()

    return () => {
      dead = true
      if (typeof extraCleanup === "function") extraCleanup()
      ctx?.revert()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced, ...deps])

  return rootRef
}

export async function refreshScrollTrigger() {
  if (typeof window === "undefined") return
  const { ScrollTrigger } = await import("gsap/ScrollTrigger")
  ScrollTrigger.refresh()
}
