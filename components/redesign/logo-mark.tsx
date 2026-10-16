"use client"

import { useEffect, useRef, useState } from "react"
import { useReducedMotion } from "@/hooks/use-reduced-motion"
import { loadGsap } from "@/hooks/use-gsap"
import { TransitionLink } from "./transition-link"
import { TerminalMark } from "./terminal-mark"

/**
 * Persistent logo that FLIPs from the loader signature into the header slot.
 */
export function LogoMark() {
  const reduced = useReducedMotion()
  const logoRef = useRef<HTMLAnchorElement>(null)
  const [ready, setReady] = useState(false)
  const didFlip = useRef(false)

  useEffect(() => {
    if (reduced) {
      setReady(true)
      return
    }

    let dead = false

    const flipIn = async () => {
      if (didFlip.current || dead) return
      const logo = logoRef.current
      const from = document.querySelector<HTMLElement>("[data-loader-sig]")
      if (!logo) return

      if (!from) {
        setReady(true)
        return
      }

      didFlip.current = true
      const { gsap, Flip } = await loadGsap({ flip: true })
      if (dead || !logoRef.current || !Flip) return

      setReady(true)
      const fromBox = from.getBoundingClientRect()
      gsap.set(logo, {
        position: "fixed",
        left: fromBox.left,
        top: fromBox.top,
        width: fromBox.width,
        height: fromBox.height,
        margin: 0,
        zIndex: 85,
        opacity: 1,
      })
      const state = Flip.getState(logo)
      gsap.set(logo, { clearProps: "position,left,top,width,height,margin,zIndex" })
      Flip.from(state, {
        duration: 0.85,
        ease: "power3.inOut",
        absolute: true,
      })
    }

    const onFlip = () => {
      void flipIn()
    }

    if (document.documentElement.classList.contains("loader-done")) {
      setReady(true)
    } else {
      window.addEventListener("eze:sig-flip", onFlip)
    }

    return () => {
      dead = true
      window.removeEventListener("eze:sig-flip", onFlip)
    }
  }, [reduced])

  return (
    <TransitionLink
      ref={logoRef}
      href="/"
      aria-label="Eze Vazquez"
      data-logo-slot
      className={`fixed left-4 top-4 z-[40] w-[4.5rem] text-paper mix-blend-difference sm:left-5 sm:w-20 ${
        ready ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
    >
      <TerminalMark data-logo-sig isStatic className="w-full" />
    </TransitionLink>
  )
}
