"use client"

import { useEffect, useRef } from "react"
import { usePathname } from "next/navigation"
import { useReducedMotion } from "@/hooks/use-reduced-motion"
import { useCopy } from "@/lib/redesign/use-copy"

const KONAMI = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
]

export function EasterEggs() {
  const reduced = useReducedMotion()
  const { t } = useCopy()
  const pathname = usePathname()
  const buffer = useRef<string[]>([])
  const typed = useRef("")
  const originalTitle = useRef("")

  useEffect(() => {
    // Console hello for devs
    // eslint-disable-next-line no-console
    console.log(
      "%c[ ezevazquez ]%c Technical PM. Ordená el quilombo con IA.",
      "background:#1F4BFF;color:#F4F1EA;padding:4px 8px;border-radius:999px;font-family:monospace",
      "color:#F4F1EA;padding:4px 8px;font-family:monospace",
    )
  }, [])

  useEffect(() => {
    originalTitle.current = document.title
    const onVisibility = () => {
      if (document.hidden) {
        document.title = t.tabHidden
      } else {
        document.title = originalTitle.current
      }
    }
    document.addEventListener("visibilitychange", onVisibility)
    return () => {
      document.removeEventListener("visibilitychange", onVisibility)
      document.title = originalTitle.current
    }
  }, [t.tabHidden, pathname])

  useEffect(() => {
    if (reduced) return

    const rain = () => {
      const layer = document.createElement("div")
      layer.className = "sticker-rain"
      layer.setAttribute("aria-hidden", "true")
      document.body.appendChild(layer)
      const glyphs = ["🧉", "GH", "IN", "@", "BA", "47", "xlsx"]
      for (let i = 0; i < 24; i++) {
        const bit = document.createElement("span")
        bit.className = "sticker-rain-bit"
        bit.textContent = glyphs[i % glyphs.length]
        bit.style.left = `${Math.random() * 100}vw`
        bit.style.animationDelay = `${Math.random() * 0.8}s`
        bit.style.animationDuration = `${2.2 + Math.random() * 1.6}s`
        layer.appendChild(bit)
      }
      window.setTimeout(() => layer.remove(), 4200)
    }

    const onKey = (event: KeyboardEvent) => {
      const key = event.key.length === 1 ? event.key.toLowerCase() : event.key
      buffer.current = [...buffer.current, key].slice(-KONAMI.length)
      const konamiHit = KONAMI.every((step, i) => buffer.current[i]?.toLowerCase() === step.toLowerCase())
      if (konamiHit) {
        buffer.current = []
        rain()
      }

      if (event.key.length === 1 && /[a-z]/i.test(event.key)) {
        typed.current = (typed.current + event.key.toLowerCase()).slice(-4)
        if (typed.current === "mate") {
          typed.current = ""
          rain()
        }
      }
    }

    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [reduced])

  useEffect(() => {
    if (reduced) return
    const magnets = () => {
      document.querySelectorAll<HTMLElement>(".magnetic").forEach((btn) => {
        if (btn.dataset.magneticBound) return
        btn.dataset.magnetic = "1"
        const onMove = (event: PointerEvent) => {
          const rect = btn.getBoundingClientRect()
          const x = event.clientX - rect.left - rect.width / 2
          const y = event.clientY - rect.top - rect.height / 2
          btn.style.transform = `translate(${x * 0.22}px, ${y * 0.22}px)`
        }
        const onLeave = () => {
          btn.style.transform = ""
        }
        btn.addEventListener("pointermove", onMove)
        btn.addEventListener("pointerleave", onLeave)
      })
    }
    magnets()
    const id = window.setInterval(magnets, 1200)
    return () => window.clearInterval(id)
  }, [reduced, pathname])

  return null
}
