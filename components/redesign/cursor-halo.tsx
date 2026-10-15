"use client"

import { useEffect, useRef } from "react"
import { useReducedMotion } from "@/hooks/use-reduced-motion"
import { useCopy } from "@/lib/redesign/use-copy"

export function CursorHalo() {
  const reduced = useReducedMotion()
  const { t } = useCopy()
  const ref = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLSpanElement>(null)
  const pos = useRef({ x: 0, y: 0 })
  const target = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const node = ref.current
    if (!node || reduced || !window.matchMedia("(pointer: fine)").matches) return

    let raf = 0
    const tick = () => {
      pos.current.x += (target.current.x - pos.current.x) * 0.18
      pos.current.y += (target.current.y - pos.current.y) * 0.18
      node.style.transform = `translate3d(${pos.current.x}px, ${pos.current.y}px, 0)`
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    const move = (event: PointerEvent) => {
      target.current = { x: event.clientX, y: event.clientY }
      node.style.opacity = "1"
    }

    const onOver = (event: PointerEvent) => {
      const el = (event.target as HTMLElement | null)?.closest?.(
        "[data-cursor], .sticker, a, button",
      ) as HTMLElement | null
      if (!el || !labelRef.current) return
      if (el.classList.contains("sticker") || el.dataset.cursor === "drag") {
        labelRef.current.textContent = t.cursorDrag
        node.dataset.state = "drag"
      } else if (el.dataset.cursor === "view" || el.closest("[data-cursor='view']")) {
        labelRef.current.textContent = t.cursorView
        node.dataset.state = "view"
      } else {
        labelRef.current.textContent = ""
        node.dataset.state = ""
      }
    }

    window.addEventListener("pointermove", move)
    window.addEventListener("pointerover", onOver)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("pointermove", move)
      window.removeEventListener("pointerover", onOver)
    }
  }, [reduced, t.cursorDrag, t.cursorView])

  if (reduced) return null

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[55] hidden h-9 w-9 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#1F4BFF] opacity-0 mix-blend-screen md:block data-[state=drag]:h-14 data-[state=drag]:w-14 data-[state=view]:h-16 data-[state=view]:w-16"
    >
      <span
        ref={labelRef}
        className="absolute left-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.16em] text-[#1F4BFF]"
      />
    </div>
  )
}
