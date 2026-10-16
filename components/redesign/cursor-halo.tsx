"use client"

import { useEffect, useRef } from "react"
import { useReducedMotion } from "@/hooks/use-reduced-motion"
import { useCopy } from "@/lib/redesign/use-copy"

export function CursorHalo() {
  const reduced = useReducedMotion()
  const { t } = useCopy()
  const ref = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLSpanElement>(null)
  const pos = useRef({ x: -100, y: -100 })
  const target = useRef({ x: -100, y: -100 })
  const seen = useRef(false)
  const overSticker = useRef(false)

  useEffect(() => {
    const node = ref.current
    if (!node || reduced || !window.matchMedia("(pointer: fine)").matches) return

    let raf = 0
    const tick = () => {
      pos.current.x += (target.current.x - pos.current.x) * 0.72
      pos.current.y += (target.current.y - pos.current.y) * 0.72
      node.style.transform = `translate3d(${pos.current.x}px, ${pos.current.y}px, 0) translate(-50%, -50%)`
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    const move = (event: PointerEvent) => {
      target.current = { x: event.clientX, y: event.clientY }
      if (!seen.current) {
        seen.current = true
        pos.current = { x: event.clientX, y: event.clientY }
      }
      node.style.opacity = overSticker.current ? "0" : "1"
    }

    const onOver = (event: PointerEvent) => {
      const targetElement = event.target as HTMLElement | null
      const inHero = targetElement?.closest?.("[data-hero]")
      if (inHero) {
        overSticker.current = true
        if (labelRef.current) labelRef.current.textContent = ""
        node.dataset.state = ""
        node.style.opacity = "0"
        return
      }
      if (targetElement?.closest?.(".utility-control")) {
        overSticker.current = true
        if (labelRef.current) labelRef.current.textContent = ""
        node.dataset.state = ""
        node.style.opacity = "0"
        return
      }
      const el = targetElement?.closest?.(
        "[data-cursor], .sticker, a, button",
      ) as HTMLElement | null
      if (!labelRef.current) return
      if (!el) {
        overSticker.current = false
        labelRef.current.textContent = ""
        node.dataset.state = ""
        node.style.opacity = "1"
        return
      }
      if (el.classList.contains("sticker") || el.dataset.cursor === "drag") {
        overSticker.current = true
        labelRef.current.textContent = ""
        node.dataset.state = ""
        node.style.opacity = "0"
      } else if (el.dataset.cursor === "view" || el.closest("[data-cursor='view']")) {
        overSticker.current = false
        labelRef.current.textContent = t.cursorView
        node.dataset.state = "view"
        node.style.opacity = "1"
      } else {
        overSticker.current = false
        labelRef.current.textContent = ""
        node.dataset.state = ""
        node.style.opacity = "1"
      }
    }

    const desktop = window.matchMedia("(min-width: 768px)").matches
    if (desktop) document.documentElement.classList.add("has-custom-cursor")

    window.addEventListener("pointermove", move)
    window.addEventListener("pointerover", onOver)
    return () => {
      cancelAnimationFrame(raf)
      document.documentElement.classList.remove("has-custom-cursor")
      window.removeEventListener("pointermove", move)
      window.removeEventListener("pointerover", onOver)
    }
  }, [reduced, t.cursorView])

  if (reduced) return null

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[90] hidden h-3.5 w-3.5 rounded-full bg-paper opacity-0 mix-blend-difference md:block data-[state=view]:h-5 data-[state=view]:w-5"
    >
      <span
        ref={labelRef}
        className="absolute left-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.16em] text-paper"
      />
    </div>
  )
}
