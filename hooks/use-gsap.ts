"use client"

import { useEffect, useRef } from "react"
import { useReducedMotion } from "@/hooks/use-reduced-motion"

type GsapModule = typeof import("gsap")
type FlipModule = typeof import("gsap/Flip")
type ScrollTriggerModule = typeof import("gsap/ScrollTrigger")
type Ctx = { revert: () => void }

export type GsapPlugins = {
  Flip: FlipModule["Flip"] | null
  ScrollTrigger: ScrollTriggerModule["ScrollTrigger"]
}

let scrollTriggerRegistered = false
let flipRegistered = false

export async function loadGsap(options?: { flip?: boolean }) {
  const gsapMod = await import("gsap")
  const gsap = gsapMod.default
  const { ScrollTrigger } = await import("gsap/ScrollTrigger")
  if (!scrollTriggerRegistered) {
    gsap.registerPlugin(ScrollTrigger)
    scrollTriggerRegistered = true
  }
  let Flip: FlipModule["Flip"] | null = null
  if (options?.flip) {
    const flipMod = await import("gsap/Flip")
    Flip = flipMod.Flip
    if (!flipRegistered) {
      gsap.registerPlugin(Flip)
      flipRegistered = true
    }
  }
  return { gsap, ScrollTrigger, Flip }
}

/**
 * Single entry for page-level GSAP timelines.
 * Registers ScrollTrigger once; respects reduced motion; reverts on cleanup.
 */
export function useGsap(
  setup: (
    gsap: GsapModule["default"],
    root: HTMLElement,
    plugins: GsapPlugins,
  ) => void | (() => void),
  deps: unknown[] = [],
  options?: { flip?: boolean },
) {
  const rootRef = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    if (reduced || !rootRef.current) return
    let ctx: Ctx | null = null
    let dead = false
    let extraCleanup: void | (() => void)

    ;(async () => {
      const { gsap, ScrollTrigger, Flip } = await loadGsap({ flip: options?.flip })
      if (dead || !rootRef.current) return
      ctx = gsap.context(() => {
        extraCleanup = setup(gsap, rootRef.current!, { Flip, ScrollTrigger })
      }, rootRef)
      ScrollTrigger.refresh()
    })()

    return () => {
      dead = true
      if (typeof extraCleanup === "function") extraCleanup()
      ctx?.revert()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced, options?.flip, ...deps])

  return rootRef
}

export async function refreshScrollTrigger() {
  if (typeof window === "undefined") return
  const { ScrollTrigger } = await import("gsap/ScrollTrigger")
  ScrollTrigger.refresh()
}
