"use client"

import { useEffect, useRef, useState } from "react"
import { usePathname } from "next/navigation"
import { useReducedMotion } from "@/hooks/use-reduced-motion"

export function PageTransition() {
  const pathname = usePathname()
  const reduced = useReducedMotion()
  const first = useRef(true)
  const [on, setOn] = useState(false)

  useEffect(() => {
    if (first.current) {
      first.current = false
      return
    }
    if (reduced) return
    setOn(true)
    const id = window.setTimeout(() => setOn(false), 1150)
    return () => window.clearTimeout(id)
  }, [pathname, reduced])

  if (!on) return null

  return (
    <div className="pointer-events-none fixed inset-0 z-[70] flex flex-col" aria-hidden>
      {Array.from({ length: 8 }, (_, index) => (
        <span
          key={index}
          className="band"
          style={{ animationDelay: `${index * 35}ms` }}
        />
      ))}
    </div>
  )
}
