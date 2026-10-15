"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useCopy } from "@/lib/redesign/use-copy"

const TABS = [
  { href: "/", id: "root" },
  { href: "/about", id: "about" },
  { href: "/work", id: "work" },
  { href: "/contact", id: "contact" },
] as const

function activeIndex(pathname: string) {
  if (pathname.startsWith("/about")) return 1
  if (pathname.startsWith("/work")) return 2
  if (pathname.startsWith("/contact")) return 3
  return 0
}

export function BottomNav() {
  const pathname = usePathname()
  const router = useRouter()
  const { t } = useCopy()
  const trackRef = useRef<HTMLDivElement>(null)
  const tabRefs = useRef<Array<HTMLAnchorElement | null>>([])
  const drag = useRef({ active: false, moved: false, startX: 0 })
  const current = activeIndex(pathname)
  const [preview, setPreview] = useState<number | null>(null)
  const [box, setBox] = useState({ left: 4, width: 64 })
  const index = preview ?? current

  useEffect(() => {
    const measure = () => {
      const track = trackRef.current
      const tab = tabRefs.current[index]
      if (!track || !tab) return
      const trackBox = track.getBoundingClientRect()
      const tabBox = tab.getBoundingClientRect()
      setBox({ left: tabBox.left - trackBox.left, width: tabBox.width })
    }
    measure()
    window.addEventListener("resize", measure)
    return () => window.removeEventListener("resize", measure)
  }, [index, pathname])

  const indexFromPointer = (clientX: number) => {
    const track = trackRef.current
    if (!track) return current
    const rect = track.getBoundingClientRect()
    const ratio = (clientX - rect.left) / rect.width
    return Math.min(TABS.length - 1, Math.max(0, Math.floor(ratio * TABS.length)))
  }

  return (
    <nav
      aria-label={t.navLabel}
      className="fixed bottom-4 left-1/2 z-[60] -translate-x-1/2"
      onKeyDown={(event) => {
        if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return
        event.preventDefault()
        const next =
          event.key === "ArrowRight"
            ? Math.min(TABS.length - 1, current + 1)
            : Math.max(0, current - 1)
        router.push(TABS[next].href)
      }}
    >
      <div
        ref={trackRef}
        className="relative flex items-center rounded-full border border-[#F4F1EA]/15 bg-[#12131A]/80 p-1 shadow-[0_16px_40px_-24px_rgba(0,0,0,0.8)] backdrop-blur-md"
        onPointerDown={(event) => {
          drag.current = { active: true, moved: false, startX: event.clientX }
          event.currentTarget.setPointerCapture(event.pointerId)
        }}
        onPointerMove={(event) => {
          if (!drag.current.active) return
          if (Math.abs(event.clientX - drag.current.startX) > 8) {
            drag.current.moved = true
            setPreview(indexFromPointer(event.clientX))
          }
        }}
        onPointerUp={(event) => {
          if (!drag.current.active) return
          const moved = drag.current.moved
          const next = indexFromPointer(event.clientX)
          drag.current.active = false
          setPreview(null)
          if (moved) router.push(TABS[next].href)
        }}
        onPointerCancel={() => {
          drag.current.active = false
          setPreview(null)
        }}
      >
        <span
          aria-hidden
          className="absolute top-1 bottom-1 rounded-full bg-[#1F4BFF]"
          style={{
            left: box.left,
            width: box.width,
            transition: preview === null
              ? "left 450ms cubic-bezier(0.16, 1, 0.3, 1), width 450ms cubic-bezier(0.16, 1, 0.3, 1)"
              : "none",
          }}
        />
        {TABS.map((tab, tabIndex) => {
          const selected = tabIndex === current
          return (
            <Link
              key={tab.id}
              href={tab.href}
              ref={(node) => {
                tabRefs.current[tabIndex] = node
              }}
              aria-current={selected ? "page" : undefined}
              onClick={(event) => {
                if (drag.current.moved) {
                  event.preventDefault()
                  drag.current.moved = false
                }
              }}
              className={`nav-tab relative z-[1] rounded-full px-3 py-2 font-mono text-[11px] lowercase tracking-wide sm:px-4 sm:text-xs ${
                tabIndex === index ? "text-white" : "text-[#F4F1EA]/70"
              }`}
            >
              {tab.id}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
